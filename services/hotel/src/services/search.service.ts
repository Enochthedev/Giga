/**
 * Search Service - Comprehensive hotel search and filtering system
 * Handles property search with location, criteria filters, and availability-based results
 */

import { PrismaClient } from '@/generated/prisma-client';
import { AvailabilityService } from '@/services/availability.service';
import { PricingService } from '@/services/pricing.service';
import { PropertyService } from '@/services/property.service';
import {
  PaginationResult,
  PropertyAmenity,
  PropertyCategory,
  PropertyStatus,
} from '@/types';
import { ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';
import { isAfter, isBefore } from 'date-fns';

export interface SearchRequest {
  // Text search
  query?: string;

  // Location filters
  location?: LocationFilter;

  // Date and guest filters
  checkInDate?: Date;
  checkOutDate?: Date;
  rooms?: number;
  adults?: number;
  children?: number;

  // Property filters
  category?: PropertyCategory;
  starRating?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: PropertyAmenity[];

  // Sorting and pagination
  sortBy?: SearchSortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;

  // Advanced filters
  filters?: SearchFilters;
}

export interface LocationFilter {
  city?: string;
  country?: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number; // in kilometers
  };
}

export interface SearchFilters {
  propertyTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
    currency?: string;
  };
  guestRating?: number;
  businessFacilities?: boolean;
  petFriendly?: boolean;
  accessibilityFeatures?: boolean;
  sustainabilityFeatures?: boolean;
}

export enum SearchSortBy {
  RELEVANCE = 'relevance',
  PRICE_LOW_TO_HIGH = 'price_asc',
  PRICE_HIGH_TO_LOW = 'price_desc',
  STAR_RATING = 'star_rating',
  GUEST_RATING = 'guest_rating',
  DISTANCE = 'distance',
  POPULARITY = 'popularity',
  NAME = 'name',
  NEWEST = 'newest',
}

export interface SearchResult {
  properties: SearchResultProperty[];
  pagination: PaginationResult<SearchResultProperty>;
  searchMetadata: SearchMetadata;
  facets: SearchFacets;
}

export interface SearchResultProperty {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: PropertyCategory;
  starRating?: number;
  guestRating?: number;

  // Location
  address: any;
  coordinates: any;
  distance?: number; // in kilometers from search location

  // Media
  images: any[];

  // Amenities and features
  amenities: PropertyAmenity[];

  // Availability and pricing (if dates provided)
  availability?: {
    isAvailable: boolean;
    availableRooms: number;
    lowestPrice?: number;
    currency: string;
  };

  // Computed fields
  relevanceScore: number;
  popularityScore: number;

  // Additional info
  roomCount: number;
  reviewCount: number;
}

export interface SearchMetadata {
  query?: string;
  location?: LocationFilter;
  totalResults: number;
  searchTime: number; // in milliseconds
  appliedFilters: AppliedSearchFilters;
  suggestions?: string[];
}

export interface AppliedSearchFilters {
  category?: PropertyCategory;
  starRating?: number;
  priceRange?: { min: number; max: number };
  amenities?: PropertyAmenity[];
  location?: string;
  dates?: { checkIn: Date; checkOut: Date };
  guests?: { adults: number; children: number; rooms: number };
}

export interface SearchFacets {
  categories: FacetItem[];
  starRatings: FacetItem[];
  priceRanges: FacetItem[];
  amenities: FacetItem[];
  locations: FacetItem[];
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export class SearchService {
  private availabilityService: AvailabilityService;
  private pricingService: PricingService;
  private propertyService: PropertyService;

  constructor(
    private prisma: PrismaClient,
    private redis?: any
  ) {
    this.availabilityService = new AvailabilityService(prisma);
    // Create a mock redis client if not provided (for testing)
    const redisClient = redis || {
      get: async () => null,
      set: async () => 'OK',
      setex: async () => 'OK',
      del: async () => 1,
    };
    this.pricingService = new PricingService(prisma, redisClient);
    this.propertyService = new PropertyService(prisma);
  }

  /**
   * Comprehensive hotel search with filters and availability
   */
  async searchHotels(request: SearchRequest): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      logger.info('Starting hotel search', { request });

      // Validate search request
      this.validateSearchRequest(request);

      // Build base query
      const baseQuery = this.buildBaseQuery(request);

      // Get total count for pagination
      const totalCount = await this.prisma.property.count({
        where: baseQuery.where,
      });

      // Execute search with pagination and sorting
      const properties = await this.executeSearch(baseQuery, request);

      // Enrich results with availability and pricing if dates provided
      const enrichedProperties = await this.enrichSearchResults(
        properties,
        request
      );

      // Calculate relevance scores and apply sorting
      const rankedProperties = this.rankAndSortResults(
        enrichedProperties,
        request
      );

      // Generate facets for filtering
      const facets = await this.generateSearchFacets(baseQuery, request);

      // Build pagination info
      const pagination = this.buildPaginationResult(
        rankedProperties,
        totalCount,
        request
      );

      const searchTime = Date.now() - startTime;

      return {
        properties: rankedProperties,
        pagination,
        searchMetadata: {
          query: request.query,
          location: request.location,
          totalResults: totalCount,
          searchTime,
          appliedFilters: this.buildAppliedFilters(request),
          suggestions: await this.generateSearchSuggestions(request),
        },
        facets,
      };
    } catch (error) {
      logger.error('Error in hotel search', { error, request });
      throw error;
    }
  }

  /**
   * Search hotels by location with radius
   */
  async searchByLocation(
    coordinates: { latitude: number; longitude: number },
    radius: number = 10,
    options: Partial<SearchRequest> = {}
  ): Promise<SearchResult> {
    return this.searchHotels({
      ...options,
      location: {
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radius,
        },
      },
    });
  }

  /**
   * Get search suggestions based on query
   */
  async getSearchSuggestions(
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // Search in property names and locations
      const properties = await this.prisma.property.findMany({
        where: {
          status: PropertyStatus.ACTIVE,
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          name: true,
          address: true,
        },
        take: limit,
      });

      const suggestions = new Set<string>();

      properties.forEach(property => {
        // Add property name
        if (property.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(property.name);
        }

        // Add location suggestions from address
        if (property.address && typeof property.address === 'object') {
          const address = property.address as any;
          if (address.city?.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(address.city);
          }
          if (address.country?.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(address.country);
          }
        }
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      logger.error('Error generating search suggestions', { error, query });
      return [];
    }
  }

  /**
   * Get popular search terms
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // This would typically come from search analytics
    // For now, return common hotel-related searches
    return [
      'Beach Resort',
      'City Center Hotel',
      'Business Hotel',
      'Family Resort',
      'Luxury Hotel',
      'Budget Hotel',
      'Spa Resort',
      'Airport Hotel',
      'Boutique Hotel',
      'All-Inclusive Resort',
    ].slice(0, limit);
  }

  /**
   * Validate search request
   */
  private validateSearchRequest(request: SearchRequest): void {
    if (request.checkInDate && request.checkOutDate) {
      if (isAfter(request.checkInDate, request.checkOutDate)) {
        throw new ValidationError('Check-out date must be after check-in date');
      }

      if (isBefore(request.checkInDate, new Date())) {
        throw new ValidationError('Check-in date cannot be in the past');
      }
    }

    if (request.rooms && request.rooms < 1) {
      throw new ValidationError('Number of rooms must be at least 1');
    }

    if (request.adults && request.adults < 1) {
      throw new ValidationError('Number of adults must be at least 1');
    }

    if (request.children && request.children < 0) {
      throw new ValidationError('Number of children cannot be negative');
    }

    if (request.page && request.page < 1) {
      throw new ValidationError('Page number must be at least 1');
    }

    if (request.limit && (request.limit < 1 || request.limit > 100)) {
      throw new ValidationError('Limit must be between 1 and 100');
    }
  }

  /**
   * Build base Prisma query
   */
  private buildBaseQuery(request: SearchRequest) {
    const where: any = {
      status: PropertyStatus.ACTIVE,
    };

    // Text search
    if (request.query) {
      where.OR = [
        {
          name: {
            contains: request.query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: request.query,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Location filters
    if (request.location) {
      if (request.location.city) {
        where.address = {
          path: ['city'],
          string_contains: request.location.city,
        };
      }

      if (request.location.country) {
        where.address = {
          ...where.address,
          path: ['country'],
          string_contains: request.location.country,
        };
      }
    }

    // Property filters
    if (request.category) {
      where.category = request.category;
    }

    if (request.starRating) {
      where.starRating = request.starRating;
    }

    // Amenities filter
    if (request.amenities && request.amenities.length > 0) {
      where.amenities = {
        path: '$',
        array_contains: request.amenities,
      };
    }

    return {
      where,
      include: {
        roomTypes: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            category: true,
            maxOccupancy: true,
            baseRate: true,
            currency: true,
            totalRooms: true,
          },
        },
        _count: {
          select: {
            roomTypes: true,
            bookings: true,
          },
        },
      },
    };
  }

  /**
   * Execute search with pagination and basic sorting
   */
  private async executeSearch(baseQuery: any, request: SearchRequest) {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Build order by clause
    let orderBy: any = { name: 'asc' };

    if (request.sortBy) {
      switch (request.sortBy) {
        case SearchSortBy.NAME:
          orderBy = { name: request.sortOrder || 'asc' };
          break;
        case SearchSortBy.STAR_RATING:
          orderBy = { starRating: request.sortOrder || 'desc' };
          break;
        case SearchSortBy.NEWEST:
          orderBy = { createdAt: 'desc' };
          break;
        default:
          // For other sort types, we'll handle them after enrichment
          orderBy = { name: 'asc' };
      }
    }

    return this.prisma.property.findMany({
      ...baseQuery,
      orderBy,
      skip,
      take: limit,
    });
  }

  /**
   * Enrich search results with availability and pricing
   */
  private async enrichSearchResults(
    properties: any[],
    request: SearchRequest
  ): Promise<SearchResultProperty[]> {
    const enrichedProperties = await Promise.all(
      properties.map(async property => {
        const enriched: SearchResultProperty = {
          id: property.id,
          slug: property.slug,
          name: property.name,
          description: property.description,
          category: property.category,
          starRating: property.starRating,
          guestRating: 0, // TODO: Calculate from reviews
          address: property.address,
          coordinates: property.coordinates,
          images: property.images || [],
          amenities: property.amenities || [],
          relevanceScore: 0, // Will be calculated later
          popularityScore: property._count?.bookings || 0,
          roomCount: property._count?.roomTypes || 0,
          reviewCount: 0, // TODO: Get from reviews
        };

        // Add availability and pricing if dates are provided
        if (request.checkInDate && request.checkOutDate) {
          try {
            const availabilityResults =
              await this.availabilityService.checkBulkAvailability({
                propertyId: property.id,
                checkInDate: request.checkInDate,
                checkOutDate: request.checkOutDate,
                roomQuantity: request.rooms || 1,
                guestCount: (request.adults || 2) + (request.children || 0),
              });

            const availableRooms = availabilityResults.filter(
              r => r.isAvailable
            );

            if (availableRooms.length > 0) {
              // Get lowest price from available rooms
              const lowestPrice = await this.getLowestPrice(
                property.id,
                availableRooms,
                request.checkInDate,
                request.checkOutDate
              );

              enriched.availability = {
                isAvailable: true,
                availableRooms: availableRooms.length,
                lowestPrice,
                currency: property.currency || 'USD',
              };
            } else {
              enriched.availability = {
                isAvailable: false,
                availableRooms: 0,
                currency: property.currency || 'USD',
              };
            }
          } catch (error) {
            logger.warn('Error checking availability for property', {
              propertyId: property.id,
              error: error instanceof Error ? error.message : String(error),
            });

            enriched.availability = {
              isAvailable: false,
              availableRooms: 0,
              currency: property.currency || 'USD',
            };
          }
        }

        return enriched;
      })
    );

    // Filter out unavailable properties if dates were provided
    if (request.checkInDate && request.checkOutDate) {
      return enrichedProperties.filter(p => p.availability?.isAvailable);
    }

    return enrichedProperties;
  }

  /**
   * Get lowest price for available rooms
   */
  private async getLowestPrice(
    propertyId: string,
    availableRooms: any[],
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<number> {
    try {
      const prices = await Promise.all(
        availableRooms.map(async room => {
          const pricing = await this.pricingService.calculatePrice({
            propertyId,
            roomTypeId: room.roomTypeId,
            checkInDate,
            checkOutDate,
            guestCount: 2, // Default guest count for price comparison
          });
          return pricing.totalAmount;
        })
      );

      return Math.min(...prices);
    } catch (error) {
      logger.warn('Error calculating lowest price', { propertyId, error });
      return 0;
    }
  }

  /**
   * Rank and sort search results
   */
  private rankAndSortResults(
    properties: SearchResultProperty[],
    request: SearchRequest
  ): SearchResultProperty[] {
    // Calculate relevance scores
    properties.forEach(property => {
      property.relevanceScore = this.calculateRelevanceScore(property, request);
    });

    // Apply sorting
    return this.sortResults(properties, request);
  }

  /**
   * Calculate relevance score for a property
   */
  private calculateRelevanceScore(
    property: SearchResultProperty,
    request: SearchRequest
  ): number {
    let score = 0;

    // Text relevance
    if (request.query) {
      const query = request.query.toLowerCase();
      const name = property.name.toLowerCase();
      const description = property.description.toLowerCase();

      if (name.includes(query)) {
        score += name === query ? 100 : 50;
      }
      if (description.includes(query)) {
        score += 25;
      }
    }

    // Star rating boost
    if (property.starRating) {
      score += property.starRating * 10;
    }

    // Guest rating boost
    if (property.guestRating) {
      score += property.guestRating * 5;
    }

    // Popularity boost
    score += Math.min(property.popularityScore * 2, 50);

    // Availability boost (if available)
    if (property.availability?.isAvailable) {
      score += 30;
    }

    return score;
  }

  /**
   * Sort search results based on criteria
   */
  private sortResults(
    properties: SearchResultProperty[],
    request: SearchRequest
  ): SearchResultProperty[] {
    const sortBy = request.sortBy || SearchSortBy.RELEVANCE;
    const sortOrder = request.sortOrder || 'desc';

    return properties.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case SearchSortBy.RELEVANCE:
          comparison = b.relevanceScore - a.relevanceScore;
          break;
        case SearchSortBy.PRICE_LOW_TO_HIGH:
          const priceA = a.availability?.lowestPrice || Infinity;
          const priceB = b.availability?.lowestPrice || Infinity;
          comparison = priceA - priceB;
          break;
        case SearchSortBy.PRICE_HIGH_TO_LOW:
          const priceA2 = a.availability?.lowestPrice || 0;
          const priceB2 = b.availability?.lowestPrice || 0;
          comparison = priceB2 - priceA2;
          break;
        case SearchSortBy.STAR_RATING:
          comparison = (b.starRating || 0) - (a.starRating || 0);
          break;
        case SearchSortBy.GUEST_RATING:
          comparison = (b.guestRating || 0) - (a.guestRating || 0);
          break;
        case SearchSortBy.POPULARITY:
          comparison = b.popularityScore - a.popularityScore;
          break;
        case SearchSortBy.NAME:
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = b.relevanceScore - a.relevanceScore;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Generate search facets for filtering
   */
  private async generateSearchFacets(
    baseQuery: any,
    request: SearchRequest
  ): Promise<SearchFacets> {
    // Get aggregated data for facets
    const [categories, starRatings] = await Promise.all([
      this.prisma.property.groupBy({
        by: ['category'],
        where: baseQuery.where,
        _count: true,
      }),
      this.prisma.property.groupBy({
        by: ['starRating'],
        where: baseQuery.where,
        _count: true,
      }),
    ]);

    return {
      categories: categories.map(item => ({
        value: item.category,
        label: this.formatCategoryLabel(item.category),
        count: item._count,
        selected: request.category === item.category,
      })),
      starRatings: starRatings
        .filter(
          item => item.starRating !== null && item.starRating !== undefined
        )
        .map(item => ({
          value: item.starRating!.toString(),
          label: `${item.starRating} Star${item.starRating! > 1 ? 's' : ''}`,
          count: item._count,
          selected: request.starRating === item.starRating,
        })),
      priceRanges: this.generatePriceRangeFacets(request),
      amenities: this.generateAmenityFacets(request),
      locations: [], // TODO: Implement location facets
    };
  }

  /**
   * Format category label for display
   */
  private formatCategoryLabel(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate price range facets
   */
  private generatePriceRangeFacets(request: SearchRequest): FacetItem[] {
    const ranges = [
      { min: 0, max: 100, label: 'Under $100' },
      { min: 100, max: 200, label: '$100 - $200' },
      { min: 200, max: 300, label: '$200 - $300' },
      { min: 300, max: 500, label: '$300 - $500' },
      { min: 500, max: Infinity, label: '$500+' },
    ];

    return ranges.map(range => ({
      value: `${range.min}-${range.max === Infinity ? 'max' : range.max}`,
      label: range.label,
      count: 0, // TODO: Calculate actual counts
      selected:
        request.minPrice === range.min && request.maxPrice === range.max,
    }));
  }

  /**
   * Generate amenity facets
   */
  private generateAmenityFacets(request: SearchRequest): FacetItem[] {
    const commonAmenities = [
      PropertyAmenity.WIFI,
      PropertyAmenity.PARKING,
      PropertyAmenity.POOL,
      PropertyAmenity.GYM,
      PropertyAmenity.SPA,
      PropertyAmenity.RESTAURANT,
      PropertyAmenity.BAR,
      PropertyAmenity.ROOM_SERVICE,
    ];

    return commonAmenities.map(amenity => ({
      value: amenity,
      label: this.formatAmenityLabel(amenity),
      count: 0, // TODO: Calculate actual counts
      selected: request.amenities?.includes(amenity) || false,
    }));
  }

  /**
   * Format amenity label for display
   */
  private formatAmenityLabel(amenity: PropertyAmenity): string {
    return amenity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Build applied filters summary
   */
  private buildAppliedFilters(request: SearchRequest): AppliedSearchFilters {
    const filters: AppliedSearchFilters = {};

    if (request.category) {
      filters.category = request.category;
    }

    if (request.starRating) {
      filters.starRating = request.starRating;
    }

    if (request.minPrice || request.maxPrice) {
      filters.priceRange = {
        min: request.minPrice || 0,
        max: request.maxPrice || Infinity,
      };
    }

    if (request.amenities && request.amenities.length > 0) {
      filters.amenities = request.amenities;
    }

    if (request.location?.city || request.location?.country) {
      filters.location = [request.location.city, request.location.country]
        .filter(Boolean)
        .join(', ');
    }

    if (request.checkInDate && request.checkOutDate) {
      filters.dates = {
        checkIn: request.checkInDate,
        checkOut: request.checkOutDate,
      };
    }

    if (request.adults || request.children || request.rooms) {
      filters.guests = {
        adults: request.adults || 2,
        children: request.children || 0,
        rooms: request.rooms || 1,
      };
    }

    return filters;
  }

  /**
   * Build pagination result
   */
  private buildPaginationResult(
    properties: SearchResultProperty[],
    totalCount: number,
    request: SearchRequest
  ): PaginationResult<SearchResultProperty> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: properties,
      totalCount,
      hasMore: page < totalPages,
      currentPage: page,
      totalPages,
      limit,
      offset: (page - 1) * limit,
    };
  }

  /**
   * Generate search suggestions based on current request
   */
  private async generateSearchSuggestions(
    request: SearchRequest
  ): Promise<string[]> {
    if (!request.query) {
      return [];
    }

    return this.getSearchSuggestions(request.query, 5);
  }
}

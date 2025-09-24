/**
 * Room-related type definitions for the Hotel Service
 */

export interface RoomType {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  category: RoomCategory;

  // Capacity and layout
  maxOccupancy: number;
  bedConfiguration: BedConfiguration[];
  roomSize: number;
  roomSizeUnit: RoomSizeUnit;

  // Amenities and features
  amenities: RoomAmenity[];
  view?: RoomView;
  floor?: string;

  // Inventory
  totalRooms: number;

  // Pricing
  baseRate: number;
  currency: string;

  // Media
  images: RoomImage[];

  // Status
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface BedConfiguration {
  bedType: BedType;
  quantity: number;
}

export interface RoomImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export enum RoomCategory {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  EXECUTIVE = 'executive',
  PRESIDENTIAL = 'presidential',
  JUNIOR_SUITE = 'junior_suite',
  PENTHOUSE = 'penthouse',
  STUDIO = 'studio',
  FAMILY = 'family',
  ACCESSIBLE = 'accessible'
}

export enum BedType {
  SINGLE = 'single',
  DOUBLE = 'double',
  QUEEN = 'queen',
  KING = 'king',
  SOFA_BED = 'sofa_bed',
  BUNK_BED = 'bunk_bed',
  TWIN = 'twin',
  FULL = 'full',
  CALIFORNIA_KING = 'california_king'
}

export enum RoomSizeUnit {
  SQM = 'sqm',
  SQFT = 'sqft'
}

export enum RoomView {
  OCEAN = 'ocean',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  GARDEN = 'garden',
  POOL = 'pool',
  COURTYARD = 'courtyard',
  STREET = 'street',
  INTERIOR = 'interior',
  PARTIAL_OCEAN = 'partial_ocean',
  PARTIAL_CITY = 'partial_city'
}

export enum RoomAmenity {
  // Technology
  WIFI = 'wifi',
  TV = 'tv',
  CABLE_TV = 'cable_tv',
  SMART_TV = 'smart_tv',
  PHONE = 'phone',
  SAFE = 'safe',

  // Bathroom
  PRIVATE_BATHROOM = 'private_bathroom',
  BATHTUB = 'bathtub',
  SHOWER = 'shower',
  HAIRDRYER = 'hairdryer',
  TOILETRIES = 'toiletries',
  BATHROBES = 'bathrobes',
  SLIPPERS = 'slippers',

  // Comfort
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating',
  MINIBAR = 'minibar',
  COFFEE_MAKER = 'coffee_maker',
  KETTLE = 'kettle',
  REFRIGERATOR = 'refrigerator',

  // Furniture
  DESK = 'desk',
  CHAIR = 'chair',
  SOFA = 'sofa',
  BALCONY = 'balcony',
  TERRACE = 'terrace',
  WARDROBE = 'wardrobe',

  // Services
  ROOM_SERVICE = 'room_service',
  DAILY_HOUSEKEEPING = 'daily_housekeeping',
  TURNDOWN_SERVICE = 'turndown_service',
  WAKE_UP_SERVICE = 'wake_up_service',

  // Accessibility
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  GRAB_BARS = 'grab_bars',
  LOWERED_FIXTURES = 'lowered_fixtures',

  // Kitchen (for suites/apartments)
  KITCHENETTE = 'kitchenette',
  FULL_KITCHEN = 'full_kitchen',
  MICROWAVE = 'microwave',
  DISHWASHER = 'dishwasher',

  // Entertainment
  SOUND_SYSTEM = 'sound_system',
  GAMING_CONSOLE = 'gaming_console',
  BOOKS = 'books',
  MAGAZINES = 'magazines'
}

// Request/Response types
export interface CreateRoomTypeRequest {
  propertyId: string;
  name: string;
  description: string;
  category: RoomCategory;
  maxOccupancy: number;
  bedConfiguration: BedConfiguration[];
  roomSize: number;
  roomSizeUnit: RoomSizeUnit;
  amenities: RoomAmenity[];
  view?: RoomView;
  totalRooms: number;
  baseRate: number;
  currency: string;
}

export interface UpdateRoomTypeRequest {
  name?: string;
  description?: string;
  category?: RoomCategory;
  maxOccupancy?: number;
  bedConfiguration?: BedConfiguration[];
  roomSize?: number;
  roomSizeUnit?: RoomSizeUnit;
  amenities?: RoomAmenity[];
  view?: RoomView;
  totalRooms?: number;
  baseRate?: number;
  currency?: string;
  isActive?: boolean;
}

export interface RoomTypeSearchCriteria {
  propertyId?: string;
  category?: RoomCategory[];
  maxOccupancy?: number;
  amenities?: RoomAmenity[];
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  isActive?: boolean;
  sortBy?: RoomTypeSortBy;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export enum RoomTypeSortBy {
  NAME = 'name',
  CATEGORY = 'category',
  PRICE = 'price',
  OCCUPANCY = 'occupancy',
  SIZE = 'size',
  CREATED_DATE = 'created_date'
}

export interface RoomTypeSearchResult {
  roomTypes: RoomType[];
  totalCount: number;
  hasMore: boolean;
}
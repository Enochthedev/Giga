import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger.service';

/**
 * API versioning middleware
 */
export class APIVersioningMiddleware {
  private static readonly SUPPORTED_VERSIONS = ['1.0.0'];
  private static readonly LATEST_VERSION = '1.0.0';
  private static readonly DEPRECATED_VERSIONS: Record<string, { deprecationDate: string; sunsetDate: string }> = {
    // Example: '0.9.0': { deprecationDate: '2024-01-01', sunsetDate: '2024-06-01' }
  };

  /**
   * Extract and validate API version from request
   */
  static validateVersion() {
    return (_req: Request, res: Response, next: NextFunction) => {
      // Extract version from URL path (e.g., /api/v1/auth/login)
      const pathVersion = req.path.match(/^\/api\/v(\d+(?:\.\d+)*)/)?.[1];

      // Extract version from Accept header (e.g., application/vnd.api+json;version=1.0)
      const acceptHeader = req.headers.accept;
      const headerVersion = acceptHeader?.match(/version=(\d+(?:\.\d+)*)/)?.[1];

      // Extract version from custom header
      const customHeaderVersion = req.headers['x-api-version'] as string;

      // Determine version (priority: custom header > URL path > Accept header > latest)
      const requestedVersion = customHeaderVersion || pathVersion || headerVersion || APIVersioningMiddleware.LATEST_VERSION;

      // Validate version
      if (!APIVersioningMiddleware.SUPPORTED_VERSIONS.includes(requestedVersion)) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported API version',
          code: 'UNSUPPORTED_VERSION',
          details: {
            requestedVersion,
            supportedVersions: APIVersioningMiddleware.SUPPORTED_VERSIONS,
            latestVersion: APIVersioningMiddleware.LATEST_VERSION
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check for deprecated version
      const deprecationInfo = APIVersioningMiddleware.DEPRECATED_VERSIONS[requestedVersion];
      if (deprecationInfo) {
        res.set({
          'X-API-Deprecated': 'true',
          'X-API-Deprecation-Date': deprecationInfo.deprecationDate,
          'X-API-Sunset-Date': deprecationInfo.sunsetDate,
          'X-API-Latest-Version': APIVersioningMiddleware.LATEST_VERSION
        });

        logger.warn('Deprecated API version used', {
          version: requestedVersion,
          path: req.path,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          userId: req.user?.sub
        });
      }

      // Add version info to request and response
      req.apiVersion = requestedVersion;
      res.set({
        'X-API-Version': requestedVersion,
        'X-API-Supported-Versions': APIVersioningMiddleware.SUPPORTED_VERSIONS.join(', '),
        'X-API-Latest-Version': APIVersioningMiddleware.LATEST_VERSION
      });

      next();
    };
  }

  /**
   * Get version information
   */
  static getVersionInfo() {
    return {
      version: APIVersioningMiddleware.LATEST_VERSION,
      deprecated: false,
      supportedVersions: APIVersioningMiddleware.SUPPORTED_VERSIONS,
      latestVersion: APIVersioningMiddleware.LATEST_VERSION,
      deprecatedVersions: APIVersioningMiddleware.DEPRECATED_VERSIONS,
      changelog: 'https://docs.platform.example.com/changelog'
    };
  }

  /**
   * Version-specific feature flags
   */
  static checkFeatureAvailability(feature: string, version: string): boolean {
    const featureMatrix: Record<string, string[]> = {
      'bulk-operations': ['1.0.0'],
      'advanced-analytics': ['1.0.0'],
      'phone-verification': ['1.0.0'],
      'two-factor-auth': ['1.0.0']
    };

    return featureMatrix[feature]?.includes(version) || false;
  }

  /**
   * Handle version-specific routing
   */
  static versionRouter() {
    return (_req: Request, res: Response, next: NextFunction) => {
      const version = req.apiVersion || APIVersioningMiddleware.LATEST_VERSION;

      // Add version-specific context
      req.versionContext = {
        version,
        isLatest: version === APIVersioningMiddleware.LATEST_VERSION,
        isDeprecated: !!APIVersioningMiddleware.DEPRECATED_VERSIONS[version],
        features: {
          bulkOperations: APIVersioningMiddleware.checkFeatureAvailability('bulk-operations', version),
          advancedAnalytics: APIVersioningMiddleware.checkFeatureAvailability('advanced-analytics', version),
          phoneVerification: APIVersioningMiddleware.checkFeatureAvailability('phone-verification', version),
          twoFactorAuth: APIVersioningMiddleware.checkFeatureAvailability('two-factor-auth', version)
        }
      };

      next();
    };
  }
}

/**
 * Extend Express Request interface
 */
declare global {
  namespace Express {
    interface Request {
      apiVersion?: string;
      versionContext?: {
        version: string;
        isLatest: boolean;
        isDeprecated: boolean;
        features: Record<string, boolean>;
      };
    }
  }
}
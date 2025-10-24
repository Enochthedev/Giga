import { v4 as uuidv4 } from 'uuid';

/**
 * Utility functions for cart ID generation and validation
 */

/**
 * Generate a unique anonymous cart ID
 * Format: cart_anonymous_{uuid}
 */
export function generateAnonymousCartId(): string {
  return `cart_anonymous_${uuidv4()}`;
}

/**
 * Check if a cart ID is for an anonymous user
 */
export function isAnonymousCartId(cartId: string): boolean {
  return cartId.startsWith('cart_anonymous_');
}

/**
 * Check if a cart ID is for an authenticated user
 */
export function isAuthenticatedCartId(cartId: string): boolean {
  return !isAnonymousCartId(cartId);
}

/**
 * Extract the UUID from an anonymous cart ID
 * Returns null if not an anonymous cart ID
 */
export function extractAnonymousUuid(cartId: string): string | null {
  if (!isAnonymousCartId(cartId)) {
    return null;
  }
  return cartId.replace('cart_anonymous_', '');
}

/**
 * Validate cart ID format
 */
export function isValidCartId(cartId: string): boolean {
  if (!cartId || typeof cartId !== 'string') {
    return false;
  }

  // Check if it's an anonymous cart ID
  if (isAnonymousCartId(cartId)) {
    const uuid = extractAnonymousUuid(cartId);
    // Basic UUID v4 format validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuid !== null && uuidRegex.test(uuid);
  }

  // For authenticated users, cart ID should be a valid UUID or cuid
  return cartId.length > 0;
}

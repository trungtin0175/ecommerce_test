/**
 * Utility functions for JWT token handling
 */

export interface DecodedToken {
  userId: number;
  email?: string;
  username?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, "");

    // Split token into parts
    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode payload (second part)
    const payload = parts[1];

    // Add padding if needed
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);

    return parsedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param token - JWT token string or decoded token
 * @returns true if token is expired
 */
export function isTokenExpired(token: string | DecodedToken): boolean {
  try {
    const decoded = typeof token === "string" ? decodeToken(token) : token;

    if (!decoded || !decoded.exp) {
      return true;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

/**
 * Get user ID from token
 * @param token - JWT token string
 * @returns User ID or null if not found
 */
export function getUserIdFromToken(token: string): number | null {
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.sub || decoded?.id || null;
}

/**
 * Get token from localStorage
 * @returns Token string or null if not found
 */
export function getTokenFromStorage(): string | null {
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.error("Error getting token from storage:", error);
    return null;
  }
}

/**
 * Remove token from localStorage
 */
export function removeTokenFromStorage(): void {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
  } catch (error) {
    console.error("Error removing token from storage:", error);
  }
}

/**
 * Save token to localStorage
 * @param token - JWT token string
 */
export function saveTokenToStorage(token: string): void {
  try {
    localStorage.setItem("accessToken", token);
  } catch (error) {
    console.error("Error saving token to storage:", error);
  }
}

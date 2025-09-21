import { v4 as uuidv4 } from 'uuid';
import { redisService } from './redis.service';

export interface SessionData {
  sessionId: string;
  customerId?: string;
  cartId: string;
  createdAt: string;
  lastActivity: string;
  isAnonymous: boolean;
  previousAnonymousCustomerId?: string; // For cart merging
}

export class SessionService {
  private readonly SESSION_TTL = 30 * 60; // 30 minutes
  private readonly ANONYMOUS_SESSION_TTL = 24 * 60 * 60; // 24 hours

  /**
   * Create a new session
   */
  async createSession(customerId?: string): Promise<SessionData> {
    const sessionId = uuidv4();
    const isAnonymous = !customerId;
    const actualCustomerId = customerId || `anonymous_${sessionId}`;

    const sessionData: SessionData = {
      sessionId,
      customerId: actualCustomerId,
      cartId: `cart_${actualCustomerId}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isAnonymous,
    };

    const ttl = isAnonymous ? this.ANONYMOUS_SESSION_TTL : this.SESSION_TTL;
    await this.saveSession(sessionData, ttl);

    return sessionData;
  }

  /**
   * Get session data
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await redisService.get(sessionKey);

      if (!sessionData) {
        return null;
      }

      const session: SessionData = JSON.parse(sessionData);

      // Update last activity
      session.lastActivity = new Date().toISOString();
      await this.saveSession(session);

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Update session with authenticated user
   */
  async authenticateSession(
    sessionId: string,
    customerId: string
  ): Promise<SessionData | null> {
    const session = await this.getSession(sessionId);

    if (!session) {
      return null;
    }

    const previousCustomerId = session.customerId;

    // Create new session data for authenticated user
    const authenticatedSession: SessionData = {
      ...session,
      customerId,
      cartId: `cart_${customerId}`,
      isAnonymous: false,
      lastActivity: new Date().toISOString(),
    };

    // Save with authenticated session TTL
    await this.saveSession(authenticatedSession, this.SESSION_TTL);

    // Store previous anonymous customer ID for cart merging
    if (session.isAnonymous && previousCustomerId) {
      authenticatedSession.previousAnonymousCustomerId = previousCustomerId;
    }

    return authenticatedSession;
  }

  /**
   * Extend session expiration
   */
  async extendSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);

    if (!session) {
      return false;
    }

    session.lastActivity = new Date().toISOString();
    const ttl = session.isAnonymous
      ? this.ANONYMOUS_SESSION_TTL
      : this.SESSION_TTL;
    await this.saveSession(session, ttl);

    return true;
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    await redisService.del(sessionKey);
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<{ cleaned: number; errors: number }> {
    let cleaned = 0;
    let errors = 0;

    try {
      const client = await redisService.connect();
      const sessionKeys = await client.keys('session:*');

      for (const key of sessionKeys) {
        try {
          const ttl = await client.ttl(key);

          // If TTL is -1 (no expiration), check if session is old
          if (ttl === -1) {
            const sessionData = await client.get(key);
            if (sessionData) {
              const session: SessionData = JSON.parse(sessionData);
              const lastActivity = new Date(session.lastActivity);
              const hoursSinceActivity =
                (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

              // Clean up sessions older than 48 hours
              if (hoursSinceActivity > 48) {
                await client.del(key);
                cleaned++;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing session key ${key}:`, error);
          errors++;
        }
      }

      console.log(
        `Session cleanup completed: ${cleaned} sessions cleaned, ${errors} errors`
      );
      return { cleaned, errors };
    } catch (error) {
      console.error('Error during session cleanup:', error);
      return { cleaned, errors: errors + 1 };
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStatistics(): Promise<{
    totalSessions: number;
    anonymousSessions: number;
    authenticatedSessions: number;
    averageSessionAge: number;
  }> {
    try {
      const client = await redisService.connect();
      const sessionKeys = await client.keys('session:*');

      let totalSessions = 0;
      let anonymousSessions = 0;
      let authenticatedSessions = 0;
      let totalAge = 0;

      for (const key of sessionKeys) {
        try {
          const sessionData = await client.get(key);
          if (sessionData) {
            const session: SessionData = JSON.parse(sessionData);
            totalSessions++;

            if (session.isAnonymous) {
              anonymousSessions++;
            } else {
              authenticatedSessions++;
            }

            const createdAt = new Date(session.createdAt);
            const ageHours =
              (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
            totalAge += ageHours;
          }
        } catch (error) {
          console.error(
            `Error processing session statistics for ${key}:`,
            error
          );
        }
      }

      return {
        totalSessions,
        anonymousSessions,
        authenticatedSessions,
        averageSessionAge: totalSessions > 0 ? totalAge / totalSessions : 0,
      };
    } catch (error) {
      console.error('Error getting session statistics:', error);
      return {
        totalSessions: 0,
        anonymousSessions: 0,
        authenticatedSessions: 0,
        averageSessionAge: 0,
      };
    }
  }

  /**
   * Save session data to Redis
   */
  private async saveSession(
    sessionData: SessionData,
    ttlSeconds?: number
  ): Promise<void> {
    const sessionKey = `session:${sessionData.sessionId}`;
    const ttl =
      ttlSeconds ||
      (sessionData.isAnonymous ? this.ANONYMOUS_SESSION_TTL : this.SESSION_TTL);
    await redisService.set(sessionKey, JSON.stringify(sessionData), ttl);
  }
}

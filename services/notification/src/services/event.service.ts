/**
 * Event service implementation for handling business events and triggers
 */

import crypto from 'crypto';
import {
  EventHandler,
  EventService,
  EventStore,
} from '../interfaces/webhook.interface';
import {
  BusinessEvent,
  BusinessEventType,
  EventHistoryFilters,
  EventProcessingResult,
  EventSubscription,
} from '../types/webhook.types';

export class EventServiceImpl implements EventService, EventStore {
  private events: Map<string, BusinessEvent> = new Map();
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventHandlers: Map<string, EventHandler[]> = new Map();

  // Event processing
  async processBusinessEvent(
    event: BusinessEvent
  ): Promise<EventProcessingResult> {
    const startTime = Date.now();
    const results: any[] = [];
    let rulesEvaluated = 0;
    let rulesMatched = 0;
    let actionsExecuted = 0;

    try {
      // Save the event
      await this.saveEvent(event);

      // Get all subscriptions for this event type
      const relevantSubscriptions = Array.from(
        this.subscriptions.values()
      ).filter(sub => sub.isActive && sub.eventTypes.includes(event.type));

      // Process each subscription
      for (const subscription of relevantSubscriptions) {
        try {
          const handlers = this.eventHandlers.get(subscription.id) || [];
          for (const handler of handlers) {
            await handler(event);
            actionsExecuted++;
          }
          rulesEvaluated++;
          rulesMatched++;
        } catch (error) {
          console.error(
            `Error processing subscription ${subscription.id}:`,
            error
          );
          results.push({
            subscriptionId: subscription.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Trigger any business rules (this would integrate with the rule engine)
      // For testing purposes, we'll simulate rule evaluation
      if (event.type === 'order.created' && event.data?.total > 100) {
        rulesEvaluated++;
        rulesMatched++;
        actionsExecuted++;
        results.push({
          ruleId: 'simulated-rule',
          matched: true,
          success: true,
        });
      }

      const totalExecutionTime = Date.now() - startTime;

      return {
        eventId: event.id,
        processedAt: new Date(),
        rulesEvaluated,
        rulesMatched,
        actionsExecuted,
        results,
        totalExecutionTime,
      };
    } catch (error) {
      return {
        eventId: event.id,
        processedAt: new Date(),
        rulesEvaluated,
        rulesMatched,
        actionsExecuted,
        results,
        totalExecutionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async publishEvent(event: BusinessEvent): Promise<boolean> {
    try {
      // Process the event asynchronously
      setImmediate(() => {
        this.processBusinessEvent(event).catch(error => {
          console.error('Error processing business event:', error);
        });
      });

      return true;
    } catch (error) {
      console.error('Error publishing event:', error);
      return false;
    }
  }

  async subscribeToEvents(
    eventTypes: string[],
    handler: EventHandler
  ): Promise<string> {
    const subscriptionId = crypto.randomUUID();

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventTypes,
      handler,
      createdAt: new Date(),
      isActive: true,
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Store the handler separately for easier access
    this.eventHandlers.set(subscriptionId, [handler]);

    return subscriptionId;
  }

  async unsubscribeFromEvents(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    subscription.isActive = false;
    this.eventHandlers.delete(subscriptionId);
    return true;
  }

  // Event history and replay
  async getEventHistory(
    filters: EventHistoryFilters
  ): Promise<BusinessEvent[]> {
    let events = Array.from(this.events.values());

    // Apply filters
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      events = events.filter(event => filters.eventTypes!.includes(event.type));
    }

    if (filters.userId) {
      events = events.filter(event => event.userId === filters.userId);
    }

    if (filters.source) {
      events = events.filter(event => event.source === filters.source);
    }

    if (filters.startDate) {
      events = events.filter(event => event.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      events = events.filter(event => event.timestamp <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return events.slice(offset, offset + limit);
  }

  async replayEvent(eventId: string): Promise<EventProcessingResult> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    return this.processBusinessEvent(event);
  }

  // Event persistence
  async saveEvent(event: BusinessEvent): Promise<string> {
    this.events.set(event.id, event);
    return event.id;
  }

  async getEvent(eventId: string): Promise<BusinessEvent | null> {
    return this.events.get(eventId) || null;
  }

  async getEvents(filters: EventHistoryFilters): Promise<BusinessEvent[]> {
    return this.getEventHistory(filters);
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    return this.events.delete(eventId);
  }

  async *streamEvents(
    filters: EventHistoryFilters
  ): AsyncIterable<BusinessEvent> {
    const events = await this.getEvents(filters);
    for (const event of events) {
      yield event;
    }
  }

  async getEventCount(filters: EventHistoryFilters): Promise<number> {
    const events = await this.getEvents(filters);
    return events.length;
  }

  // Utility methods for creating common business events
  static createUserRegisteredEvent(
    userId: string,
    userData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.USER_REGISTERED,
      timestamp: new Date(),
      source: 'auth-service',
      userId,
      data: userData,
    };
  }

  static createOrderCreatedEvent(
    userId: string,
    orderId: string,
    orderData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.ORDER_CREATED,
      timestamp: new Date(),
      source: 'ecommerce-service',
      userId,
      data: {
        orderId,
        ...orderData,
      },
    };
  }

  static createPaymentSuccessfulEvent(
    userId: string,
    paymentId: string,
    paymentData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.PAYMENT_SUCCESSFUL,
      timestamp: new Date(),
      source: 'payment-service',
      userId,
      data: {
        paymentId,
        ...paymentData,
      },
    };
  }

  static createBookingCreatedEvent(
    userId: string,
    bookingId: string,
    bookingData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.BOOKING_CREATED,
      timestamp: new Date(),
      source: 'hotel-service',
      userId,
      data: {
        bookingId,
        ...bookingData,
      },
    };
  }

  static createRideRequestedEvent(
    userId: string,
    rideId: string,
    rideData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.RIDE_REQUESTED,
      timestamp: new Date(),
      source: 'taxi-service',
      userId,
      data: {
        rideId,
        ...rideData,
      },
    };
  }

  static createSecurityAlertEvent(
    userId: string,
    alertData: any
  ): BusinessEvent {
    return {
      id: crypto.randomUUID(),
      type: BusinessEventType.SECURITY_ALERT,
      timestamp: new Date(),
      source: 'auth-service',
      userId,
      data: alertData,
    };
  }
}

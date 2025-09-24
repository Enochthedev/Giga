/**
 * Analytics and tracking interfaces
 */

import {
  AnalyticsDashboard,
  AnalyticsFilters,
  AnalyticsReport,
  AnalyticsReportType,
  CampaignAnalytics,
  DashboardWidget,
  DateRange,
  DeliveryAnalytics,
  EngagementEvent,
  NotificationCategory,
  NotificationChannel,
  UserEngagementAnalytics
} from '../types';

export interface IAnalyticsService {
  // Event tracking
  recordDeliveryEvent(analytics: Omit<DeliveryAnalytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  recordEngagementEvent(event: Omit<EngagementEvent, 'eventId'>): Promise<string>;
  updateDeliveryStatus(notificationId: string, status: string, metadata?: Record<string, any>): Promise<void>;

  // Analytics queries
  getDeliveryAnalytics(notificationId: string): Promise<DeliveryAnalytics>;
  getEngagementEvents(notificationId: string): Promise<EngagementEvent[]>;
  getUserEngagementAnalytics(_userId: string, period: DateRange): Promise<UserEngagementAnalytics>;
  getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics>;

  // Report generation
  generateReport(reportType: AnalyticsReportType, filters: AnalyticsFilters, period: DateRange): Promise<AnalyticsReport>;
  getDeliveryReport(filters: AnalyticsFilters, period: DateRange): Promise<any>;
  getEngagementReport(filters: AnalyticsFilters, period: DateRange): Promise<any>;
  getChannelPerformanceReport(period: DateRange): Promise<any>;
  getProviderPerformanceReport(period: DateRange): Promise<any>;

  // Real-time metrics
  getRealTimeMetrics(): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    currentThroughput: number;
    averageDeliveryTime: number;
  }>;

  // Aggregated analytics
  getDeliveryMetrics(filters: AnalyticsFilters, period: DateRange): Promise<{
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
    averageDeliveryTime: number;
  }>;

  getEngagementMetrics(filters: AnalyticsFilters, period: DateRange): Promise<{
    opened: number;
    clicked: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }>;

  // Time series data
  getTimeSeriesData(metric: string, filters: AnalyticsFilters, period: DateRange, granularity: 'hour' | 'day' | 'week'): Promise<Array<{
    timestamp: Date;
    value: number;
  }>>;

  // Comparative analytics
  compareChannelPerformance(channels: NotificationChannel[], period: DateRange): Promise<Array<{
    channel: NotificationChannel;
    deliveryRate: number;
    engagementRate: number;
    cost: number;
  }>>;

  compareProviderPerformance(providers: string[], period: DateRange): Promise<Array<{
    provider: string;
    deliveryRate: number;
    responseTime: number;
    cost: number;
    reliability: number;
  }>>;

  // User behavior analytics
  getUserBehaviorInsights(_userId: string): Promise<{
    preferredChannels: NotificationChannel[];
    optimalSendTimes: Array<{ hour: number; dayOfWeek: number; engagementRate: number }>;
    categoryPreferences: Array<{ category: NotificationCategory; engagementRate: number }>;
    churnRisk: number;
  }>;

  getAudienceSegmentation(filters: AnalyticsFilters): Promise<Array<{
    segment: string;
    size: number;
    engagementRate: number;
    characteristics: Record<string, any>;
  }>>;

  // Dashboard management
  createDashboard(dashboard: Omit<AnalyticsDashboard, 'dashboardId' | 'lastUpdated'>): Promise<string>;
  updateDashboard(dashboardId: string, updates: Partial<AnalyticsDashboard>): Promise<boolean>;
  deleteDashboard(dashboardId: string): Promise<boolean>;
  getDashboard(dashboardId: string): Promise<AnalyticsDashboard>;
  listDashboards(userId?: string): Promise<AnalyticsDashboard[]>;

  // Widget management
  addWidget(dashboardId: string, widget: Omit<DashboardWidget, 'widgetId'>): Promise<string>;
  updateWidget(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): Promise<boolean>;
  removeWidget(dashboardId: string, widgetId: string): Promise<boolean>;
  refreshWidget(dashboardId: string, widgetId: string): Promise<any>;

  // Export functionality
  exportAnalytics(filters: AnalyticsFilters, period: DateRange, format: 'csv' | 'json' | 'xlsx'): Promise<Buffer>;
  scheduleReport(reportConfig: {
    reportType: AnalyticsReportType;
    filters: AnalyticsFilters;
    schedule: string; // cron expression
    recipients: string[];
    format: 'pdf' | 'csv' | 'json';
  }): Promise<string>;

  // Data retention and cleanup
  cleanupOldAnalytics(olderThan: Date): Promise<number>;
  archiveAnalytics(filters: AnalyticsFilters, period: DateRange): Promise<string>;
}
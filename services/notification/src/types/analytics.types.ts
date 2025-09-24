/**
 * Analytics and tracking types and interfaces
 */

import { NotificationCategory, NotificationChannel, NotificationStatus } from './notification.types';

export interface DeliveryAnalytics {
  notificationId: string;
  userId?: string;
  channel: NotificationChannel;
  category: NotificationCategory;
  provider: string;

  // Delivery tracking
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;

  // Engagement tracking
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  complainedAt?: Date;
  unsubscribedAt?: Date;

  // Performance metrics
  deliveryTime?: number; // milliseconds from sent to delivered
  processingTime?: number; // milliseconds from queued to sent
  retryCount: number;

  // Cost and provider metrics
  cost?: number;
  currency?: string;
  providerResponseTime?: number;

  // Metadata
  templateId?: string;
  campaignId?: string;
  tags?: string[];
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementEvent {
  eventId: string;
  notificationId: string;
  userId?: string;
  eventType: EngagementEventType;
  channel: NotificationChannel;
  timestamp: Date;

  // Event-specific data
  clickUrl?: string;
  bounceReason?: string;
  complaintType?: string;
  deviceInfo?: DeviceInfo;
  locationInfo?: LocationInfo;

  // Tracking metadata
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;

  metadata?: Record<string, any>;
}

export enum EngagementEventType {
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
  UNSUBSCRIBED = 'unsubscribed',
  FAILED = 'failed'
}

export interface DeviceInfo {
  platform: string;
  osVersion: string;
  appVersion: string;
  deviceModel: string;
  screenResolution: string;
}

export interface LocationInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AnalyticsReport {
  reportId: string;
  reportType: AnalyticsReportType;
  period: DateRange;
  filters: AnalyticsFilters;
  metrics: AnalyticsMetrics;
  generatedAt: Date;
  generatedBy?: string;
}

export enum AnalyticsReportType {
  DELIVERY_SUMMARY = 'delivery_summary',
  ENGAGEMENT_SUMMARY = 'engagement_summary',
  CHANNEL_PERFORMANCE = 'channel_performance',
  PROVIDER_PERFORMANCE = 'provider_performance',
  TEMPLATE_PERFORMANCE = 'template_performance',
  USER_ENGAGEMENT = 'user_engagement',
  CAMPAIGN_ANALYSIS = 'campaign_analysis'
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AnalyticsFilters {
  channels?: NotificationChannel[];
  categories?: NotificationCategory[];
  providers?: string[];
  templateIds?: string[];
  userIds?: string[];
  tags?: string[];
  status?: NotificationStatus[];
}

export interface AnalyticsMetrics {
  totalNotifications: number;
  deliveryMetrics: DeliveryMetrics;
  engagementMetrics: EngagementMetrics;
  channelBreakdown: ChannelMetrics[];
  providerBreakdown: ProviderMetrics[];
  timeSeriesData?: TimeSeriesData[];
}

export interface DeliveryMetrics {
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryRate: number; // percentage
  failureRate: number; // percentage
  averageDeliveryTime: number; // milliseconds
  medianDeliveryTime: number; // milliseconds
}

export interface EngagementMetrics {
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  openRate: number; // percentage
  clickRate: number; // percentage
  bounceRate: number; // percentage
  complaintRate: number; // percentage
  unsubscribeRate: number; // percentage
}

export interface ChannelMetrics {
  channel: NotificationChannel;
  totalSent: number;
  deliveryRate: number;
  engagementRate: number;
  averageCost: number;
  averageDeliveryTime: number;
}

export interface ProviderMetrics {
  provider: string;
  channel: NotificationChannel;
  totalSent: number;
  deliveryRate: number;
  averageResponseTime: number;
  errorRate: number;
  totalCost: number;
  reliability: number; // percentage
}

export interface TimeSeriesData {
  timestamp: Date;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

export interface UserEngagementAnalytics {
  _userId: string;
  period: DateRange;
  totalNotificationsReceived: number;
  engagementScore: number; // 0-100
  preferredChannels: NotificationChannel[];
  optimalSendTimes: OptimalSendTime[];
  categoryEngagement: CategoryEngagement[];
  lastEngagementDate?: Date;
  churnRisk: ChurnRisk;
}

export interface OptimalSendTime {
  dayOfWeek: number; // 0-6
  hour: number; // 0-23
  timezone: string;
  engagementRate: number;
  sampleSize: number;
}

export interface CategoryEngagement {
  category: NotificationCategory;
  totalReceived: number;
  engagementRate: number;
  preferredChannel: NotificationChannel;
  lastEngagement?: Date;
}

export interface ChurnRisk {
  score: number; // 0-100, higher = more likely to churn
  factors: string[];
  recommendation: string;
  lastCalculated: Date;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  period: DateRange;
  targetAudience: number;
  totalSent: number;
  deliveryMetrics: DeliveryMetrics;
  engagementMetrics: EngagementMetrics;
  conversionMetrics?: ConversionMetrics;
  roi?: ROIMetrics;
  segmentPerformance: SegmentPerformance[];
}

export interface ConversionMetrics {
  totalConversions: number;
  conversionRate: number; // percentage
  averageTimeToConversion: number; // milliseconds
  conversionValue: number;
  currency: string;
}

export interface ROIMetrics {
  totalCost: number;
  totalRevenue: number;
  roi: number; // percentage
  costPerConversion: number;
  currency: string;
}

export interface SegmentPerformance {
  segmentId: string;
  segmentName: string;
  audienceSize: number;
  deliveryRate: number;
  engagementRate: number;
  conversionRate?: number;
}

export interface AnalyticsDashboard {
  dashboardId: string;
  name: string;
  widgets: DashboardWidget[];
  refreshInterval: number; // milliseconds
  lastUpdated: Date;
  createdBy: string;
  isPublic: boolean;
}

export interface DashboardWidget {
  widgetId: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  configuration: WidgetConfiguration;
  data?: any;
}

export enum WidgetType {
  METRIC_CARD = 'metric_card',
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  TABLE = 'table',
  HEATMAP = 'heatmap'
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetConfiguration {
  metric: string;
  filters: AnalyticsFilters;
  timeRange: DateRange;
  groupBy?: string[];
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  refreshInterval?: number;
}
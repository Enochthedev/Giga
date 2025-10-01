import {
  NotificationChannel,
  Priority,
  TimeWindow,
} from '@/types/common.types';
import {
  BulkNotification,
  NotificationDeliveryStatus,
  NotificationPreferences,
  NotificationTemplate,
  NotificationType,
  TaxiNotification,
} from '@/types/notification.types';

/**
 * Core notification service interface
 */
export interface NotificationService {
  // Single notifications
  sendNotification(
    notification: Omit<TaxiNotification, 'id' | 'createdAt'>
  ): Promise<TaxiNotification>;
  sendRideNotification(
    userId: string,
    type: NotificationType,
    data: any
  ): Promise<void>;
  sendEmergencyNotification(
    userId: string,
    message: string,
    location?: any
  ): Promise<void>;

  // Bulk notifications
  sendBulkNotification(
    notification: Omit<BulkNotification, 'id' | 'createdAt'>
  ): Promise<BulkNotification>;
  sendToUserGroup(
    userIds: string[],
    type: NotificationType,
    data: any
  ): Promise<void>;

  // Notification management
  getNotification(notificationId: string): Promise<TaxiNotification | null>;
  getUserNotifications(
    userId: string,
    filters?: NotificationFilters
  ): Promise<TaxiNotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;

  // Delivery tracking
  getDeliveryStatus(
    notificationId: string
  ): Promise<NotificationDeliveryStatus[]>;
  retryFailedDelivery(notificationId: string): Promise<void>;
}

export interface NotificationFilters {
  types?: NotificationType[];
  channels?: NotificationChannel[];
  read?: boolean;
  dateRange?: TimeWindow;
  priority?: Priority[];
}

/**
 * Template management interface
 */
export interface TemplateManager {
  // Template CRUD
  createTemplate(
    template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<NotificationTemplate>;
  updateTemplate(
    templateId: string,
    updates: Partial<NotificationTemplate>
  ): Promise<NotificationTemplate>;
  deleteTemplate(templateId: string): Promise<void>;
  getTemplate(templateId: string): Promise<NotificationTemplate | null>;

  // Template operations
  renderTemplate(
    templateId: string,
    variables: Record<string, any>
  ): Promise<RenderedTemplate>;
  validateTemplate(template: NotificationTemplate): Promise<TemplateValidation>;

  // Template management
  getTemplatesByType(type: NotificationType): Promise<NotificationTemplate[]>;
  duplicateTemplate(
    templateId: string,
    newName: string
  ): Promise<NotificationTemplate>;
  previewTemplate(
    templateId: string,
    sampleData: any
  ): Promise<TemplatePreview>;
}

export interface RenderedTemplate {
  title: string;
  message: string;
  variables: Record<string, any>;
  renderedAt: Date;
}

export interface TemplateValidation {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface TemplatePreview {
  templateId: string;
  renderedTitle: string;
  renderedMessage: string;
  channels: NotificationChannel[];
  estimatedDeliveryTime: number;
}

/**
 * Preference management interface
 */
export interface PreferenceManager {
  // User preferences
  getUserPreferences(userId: string): Promise<NotificationPreferences>;
  updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences>;

  // Channel preferences
  setChannelPreference(
    userId: string,
    type: NotificationType,
    channels: NotificationChannel[]
  ): Promise<void>;
  getChannelPreferences(userId: string): Promise<ChannelPreferenceMap>;

  // Quiet hours
  setQuietHours(userId: string, quietHours: any): Promise<void>;
  isInQuietHours(userId: string): Promise<boolean>;

  // Subscription management
  subscribe(userId: string, type: NotificationType): Promise<void>;
  unsubscribe(userId: string, type: NotificationType): Promise<void>;
  getSubscriptions(userId: string): Promise<NotificationSubscription[]>;
}

export interface ChannelPreferenceMap {
  [key: string]: NotificationChannel[];
}

export interface NotificationSubscription {
  type: NotificationType;
  enabled: boolean;
  channels: NotificationChannel[];
  updatedAt: Date;
}

/**
 * Delivery management interface
 */
export interface DeliveryManager {
  // Delivery processing
  processDelivery(notification: TaxiNotification): Promise<DeliveryResult>;
  processScheduledNotifications(): Promise<void>;
  retryFailedDeliveries(): Promise<void>;

  // Channel-specific delivery
  deliverViaPush(
    userId: string,
    notification: TaxiNotification
  ): Promise<DeliveryResult>;
  deliverViaSMS(
    userId: string,
    notification: TaxiNotification
  ): Promise<DeliveryResult>;
  deliverViaEmail(
    userId: string,
    notification: TaxiNotification
  ): Promise<DeliveryResult>;

  // Delivery tracking
  trackDelivery(notificationId: string): Promise<DeliveryTracking>;
  getDeliveryMetrics(timeWindow: TimeWindow): Promise<DeliveryMetrics>;

  // Delivery optimization
  optimizeDeliveryTiming(
    userId: string,
    type: NotificationType
  ): Promise<OptimalDeliveryTime>;
  selectOptimalChannel(
    userId: string,
    type: NotificationType
  ): Promise<NotificationChannel>;
}

export interface DeliveryResult {
  success: boolean;
  channel: NotificationChannel;
  deliveredAt?: Date;
  error?: string;
  retryable: boolean;
  deliveryId?: string;
}

export interface DeliveryTracking {
  notificationId: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  attempts: DeliveryAttempt[];
  finalStatus?: 'delivered' | 'failed';
  completedAt?: Date;
}

export interface DeliveryAttempt {
  channel: NotificationChannel;
  attemptedAt: Date;
  status: string;
  error?: string;
  deliveryTime?: number;
}

export interface DeliveryMetrics {
  timeWindow: TimeWindow;
  totalSent: number;
  totalDelivered: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  channelPerformance: ChannelMetrics[];
  failureReasons: FailureReason[];
}

export interface ChannelMetrics {
  channel: NotificationChannel;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
}

export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
  channel?: NotificationChannel;
}

export interface OptimalDeliveryTime {
  userId: string;
  type: NotificationType;
  recommendedTime: Date;
  timezone: string;
  confidence: number;
  reasoning: string[];
}

/**
 * Campaign management interface
 */
export interface CampaignManager {
  // Campaign lifecycle
  createCampaign(campaign: NotificationCampaign): Promise<NotificationCampaign>;
  updateCampaign(
    campaignId: string,
    updates: Partial<NotificationCampaign>
  ): Promise<NotificationCampaign>;
  launchCampaign(campaignId: string): Promise<void>;
  pauseCampaign(campaignId: string): Promise<void>;
  stopCampaign(campaignId: string): Promise<void>;

  // Campaign targeting
  defineAudience(criteria: AudienceCriteria): Promise<AudienceSegment>;
  previewAudience(criteria: AudienceCriteria): Promise<AudiencePreview>;

  // Campaign monitoring
  getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>;
  getCampaignPerformance(campaignId: string): Promise<CampaignPerformance>;

  // A/B testing
  createABTest(
    campaignId: string,
    variants: CampaignVariant[]
  ): Promise<ABTest>;
  getABTestResults(testId: string): Promise<ABTestResults>;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description?: string;
  type: NotificationType;
  template: NotificationTemplate;
  audience: AudienceCriteria;
  schedule: CampaignSchedule;
  status: CampaignStatus;
  createdAt: Date;
  launchedAt?: Date;
  completedAt?: Date;
}

export interface AudienceCriteria {
  userType?: 'driver' | 'passenger' | 'all';
  locations?: string[];
  demographics?: DemographicFilter[];
  behavioral?: BehavioralFilter[];
  customFilters?: CustomFilter[];
}

export interface DemographicFilter {
  field: string;
  operator: string;
  value: any;
}

export interface BehavioralFilter {
  behavior: string;
  timeWindow: TimeWindow;
  threshold: number;
}

export interface CustomFilter {
  field: string;
  operator: string;
  value: any;
}

export interface AudienceSegment {
  id: string;
  criteria: AudienceCriteria;
  size: number;
  userIds: string[];
  createdAt: Date;
}

export interface AudiencePreview {
  estimatedSize: number;
  sampleUsers: unknown[];
  demographics: DemographicBreakdown[];
  reachability: ReachabilityMetrics;
}

export interface DemographicBreakdown {
  category: string;
  distribution: { [key: string]: number };
}

export interface ReachabilityMetrics {
  totalUsers: number;
  reachableUsers: number;
  unreachableUsers: number;
  reachabilityRate: number;
  channelAvailability: { [key in NotificationChannel]: number };
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  scheduledFor?: Date;
  timezone?: string;
  recurrence?: RecurrencePattern;
  endDate?: Date;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  time: string;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CampaignMetrics {
  campaignId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface CampaignPerformance {
  metrics: CampaignMetrics;
  timeline: PerformanceTimeline[];
  channelBreakdown: ChannelPerformance[];
  audienceInsights: AudienceInsights;
}

export interface PerformanceTimeline {
  timestamp: Date;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface ChannelPerformance {
  channel: NotificationChannel;
  metrics: CampaignMetrics;
  cost: number;
  roi: number;
}

export interface AudienceInsights {
  totalReach: number;
  engagementRate: number;
  topPerformingSegments: SegmentPerformance[];
  underperformingSegments: SegmentPerformance[];
}

export interface SegmentPerformance {
  segment: string;
  size: number;
  engagementRate: number;
  conversionRate: number;
}

export interface CampaignVariant {
  id: string;
  name: string;
  template: NotificationTemplate;
  weight: number;
}

export interface ABTest {
  id: string;
  campaignId: string;
  variants: CampaignVariant[];
  status: 'running' | 'completed' | 'stopped';
  startedAt: Date;
  completedAt?: Date;
}

export interface ABTestResults {
  testId: string;
  variants: VariantResults[];
  winner?: string;
  confidence: number;
  statisticalSignificance: boolean;
  recommendations: string[];
}

export interface VariantResults {
  variantId: string;
  metrics: CampaignMetrics;
  performance: number;
  improvement: number;
}

// Define local interface to avoid conflicts
interface NotificationAnalytics {
  timeWindow: TimeWindow;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  deliveryRate: number;
  readRate: number;
}

/**
 * Analytics and reporting interface
 */
export interface NotificationAnalyticsService {
  // Performance analytics
  getNotificationAnalytics(
    timeWindow: TimeWindow
  ): Promise<NotificationAnalytics>;
  getChannelPerformance(
    timeWindow: TimeWindow
  ): Promise<ChannelPerformanceReport>;
  getTypePerformance(timeWindow: TimeWindow): Promise<TypePerformanceReport>;

  // User engagement
  getUserEngagement(
    userId: string,
    timeWindow: TimeWindow
  ): Promise<UserEngagementMetrics>;
  getEngagementTrends(timeWindow: TimeWindow): Promise<EngagementTrends>;

  // Delivery analytics
  getDeliveryAnalytics(timeWindow: TimeWindow): Promise<DeliveryAnalytics>;
  getFailureAnalysis(timeWindow: TimeWindow): Promise<FailureAnalysis>;

  // ROI and business impact
  calculateNotificationROI(campaignId?: string): Promise<NotificationROI>;
  getBusinessImpact(timeWindow: TimeWindow): Promise<BusinessImpact>;
}

export interface ChannelPerformanceReport {
  timeWindow: TimeWindow;
  channels: ChannelMetrics[];
  trends: ChannelTrend[];
  recommendations: ChannelRecommendation[];
}

export interface ChannelTrend {
  channel: NotificationChannel;
  trend: 'improving' | 'declining' | 'stable';
  changePercentage: number;
  dataPoints: { date: Date; value: number }[];
}

export interface ChannelRecommendation {
  channel: NotificationChannel;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

export interface TypePerformanceReport {
  timeWindow: TimeWindow;
  types: TypeMetrics[];
  bestPerforming: NotificationType[];
  worstPerforming: NotificationType[];
}

export interface TypeMetrics {
  type: NotificationType;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  engagementScore: number;
}

export interface UserEngagementMetrics {
  userId: string;
  timeWindow: TimeWindow;
  totalReceived: number;
  totalOpened: number;
  totalClicked: number;
  engagementRate: number;
  preferredChannels: NotificationChannel[];
  optimalTiming: OptimalTiming;
}

export interface OptimalTiming {
  bestDayOfWeek: string;
  bestTimeOfDay: string;
  timezone: string;
  confidence: number;
}

export interface EngagementTrends {
  timeWindow: TimeWindow;
  overallTrend: 'improving' | 'declining' | 'stable';
  engagementRate: number;
  trendData: EngagementTrendData[];
  insights: EngagementInsight[];
}

export interface EngagementTrendData {
  date: Date;
  sent: number;
  opened: number;
  clicked: number;
  engagementRate: number;
}

export interface EngagementInsight {
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  recommendation?: string;
}

export interface DeliveryAnalytics {
  timeWindow: TimeWindow;
  overallDeliveryRate: number;
  deliveryTrend: 'improving' | 'declining' | 'stable';
  channelReliability: ChannelReliability[];
  deliverySpeed: DeliverySpeedMetrics;
}

export interface ChannelReliability {
  channel: NotificationChannel;
  reliability: number;
  uptime: number;
  averageDeliveryTime: number;
}

export interface DeliverySpeedMetrics {
  averageDeliveryTime: number;
  fastestChannel: NotificationChannel;
  slowestChannel: NotificationChannel;
  speedDistribution: SpeedDistribution[];
}

export interface SpeedDistribution {
  timeRange: string;
  percentage: number;
  count: number;
}

export interface FailureAnalysis {
  timeWindow: TimeWindow;
  totalFailures: number;
  failureRate: number;
  topFailureReasons: FailureReason[];
  channelFailures: ChannelFailureMetrics[];
  resolutionMetrics: ResolutionMetrics;
}

export interface ChannelFailureMetrics {
  channel: NotificationChannel;
  failures: number;
  failureRate: number;
  topReasons: string[];
}

export interface ResolutionMetrics {
  averageResolutionTime: number;
  resolutionRate: number;
  escalationRate: number;
}

export interface NotificationROI {
  campaignId?: string;
  timeWindow: TimeWindow;
  totalCost: number;
  totalRevenue: number;
  roi: number;
  costPerEngagement: number;
  revenuePerNotification: number;
}

export interface BusinessImpact {
  timeWindow: TimeWindow;
  userRetention: RetentionImpact;
  revenueImpact: RevenueImpact;
  operationalImpact: OperationalImpact;
  customerSatisfaction: SatisfactionImpact;
}

export interface RetentionImpact {
  retentionRate: number;
  retentionImprovement: number;
  churnReduction: number;
}

export interface RevenueImpact {
  attributedRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
}

export interface OperationalImpact {
  supportTicketReduction: number;
  operationalEfficiency: number;
  automationSavings: number;
}

export interface SatisfactionImpact {
  satisfactionScore: number;
  satisfactionImprovement: number;
  npsImpact: number;
}

import { GeoLocation, Priority } from './common.types';

// Safety and security related types
export interface SafetyFeature {
  type: SafetyFeatureType;
  enabled: boolean;
  description: string;
  configuration?: Record<string, any>;
}

export enum SafetyFeatureType {
  EMERGENCY_BUTTON = 'emergency_button',
  RIDE_SHARING = 'ride_sharing',
  REAL_TIME_TRACKING = 'real_time_tracking',
  DRIVER_VERIFICATION = 'driver_verification',
  ROUTE_MONITORING = 'route_monitoring',
  SPEED_MONITORING = 'speed_monitoring',
  PANIC_MODE = 'panic_mode',
  AUDIO_RECORDING = 'audio_recording',
  VIDEO_RECORDING = 'video_recording',
  GEOFENCE_ALERTS = 'geofence_alerts',
}

// Emergency and incident management
export interface EmergencyIncident {
  id: string;
  rideId: string;
  reportedBy: string; // userId
  type: EmergencyType;
  severity: EmergencySeverity;
  location: GeoLocation;
  description: string;
  status: IncidentStatus;

  // Response information
  responseTeam?: string[];
  emergencyServices?: EmergencyService[];
  resolvedAt?: Date;
  resolution?: string;

  // Evidence and documentation
  evidence: IncidentEvidence[];
  witnesses?: Witness[];

  // Timestamps
  reportedAt: Date;
  acknowledgedAt?: Date;
  respondedAt?: Date;
  closedAt?: Date;
}

export enum EmergencyType {
  MEDICAL = 'medical',
  ACCIDENT = 'accident',
  HARASSMENT = 'harassment',
  THEFT = 'theft',
  VIOLENCE = 'violence',
  SUSPICIOUS_BEHAVIOR = 'suspicious_behavior',
  VEHICLE_BREAKDOWN = 'vehicle_breakdown',
  ROUTE_DEVIATION = 'route_deviation',
  PANIC = 'panic',
  OTHER = 'other',
}

export enum EmergencySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  REPORTED = 'reported',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

export interface EmergencyService {
  type: EmergencyServiceType;
  contactNumber: string;
  contacted: boolean;
  contactedAt?: Date;
  responseTime?: number;
  arrived: boolean;
  arrivedAt?: Date;
}

export enum EmergencyServiceType {
  POLICE = 'police',
  AMBULANCE = 'ambulance',
  FIRE_DEPARTMENT = 'fire_department',
  SECURITY = 'security',
  ROADSIDE_ASSISTANCE = 'roadside_assistance',
}

export interface IncidentEvidence {
  id: string;
  type: EvidenceType;
  url: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
}

export enum EvidenceType {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  SCREENSHOT = 'screenshot',
  GPS_LOG = 'gps_log',
}

export interface Witness {
  name?: string;
  contactInfo?: string;
  statement: string;
  recordedAt: Date;
}

// Safety monitoring and alerts
export interface SafetyAlert {
  id: string;
  rideId: string;
  type: AlertType;
  severity: Priority;
  message: string;
  location?: GeoLocation;
  triggeredBy: string;
  triggeredAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export enum AlertType {
  ROUTE_DEVIATION = 'route_deviation',
  SPEED_VIOLATION = 'speed_violation',
  EXTENDED_STOP = 'extended_stop',
  GEOFENCE_VIOLATION = 'geofence_violation',
  PANIC_BUTTON = 'panic_button',
  DRIVER_FATIGUE = 'driver_fatigue',
  VEHICLE_MALFUNCTION = 'vehicle_malfunction',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  COMMUNICATION_LOSS = 'communication_loss',
}

// Safety scoring and ratings
export interface SafetyScore {
  userId: string;
  userType: 'driver' | 'passenger';
  overallScore: number;
  components: SafetyScoreComponent[];
  lastUpdated: Date;
  riskLevel: RiskLevel;
}

export interface SafetyScoreComponent {
  category: SafetyCategory;
  score: number;
  weight: number;
  factors: SafetyFactor[];
}

export enum SafetyCategory {
  DRIVING_BEHAVIOR = 'driving_behavior',
  INCIDENT_HISTORY = 'incident_history',
  COMPLIANCE = 'compliance',
  VEHICLE_CONDITION = 'vehicle_condition',
  BACKGROUND_CHECK = 'background_check',
  TRAINING_COMPLETION = 'training_completion',
}

export interface SafetyFactor {
  name: string;
  value: number;
  impact: number;
  description: string;
}

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

// Safety training and certification
export interface SafetyTraining {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  duration: number; // minutes
  requiredFor: string[]; // user roles
  content: TrainingContent[];
  assessment?: TrainingAssessment;
  certificateValidFor?: number; // days
  isActive: boolean;
}

export enum TrainingType {
  DEFENSIVE_DRIVING = 'defensive_driving',
  EMERGENCY_RESPONSE = 'emergency_response',
  CUSTOMER_SERVICE = 'customer_service',
  VEHICLE_SAFETY = 'vehicle_safety',
  FIRST_AID = 'first_aid',
  HARASSMENT_PREVENTION = 'harassment_prevention',
  PLATFORM_SAFETY = 'platform_safety',
}

export interface TrainingContent {
  type: 'video' | 'text' | 'interactive' | 'quiz';
  title: string;
  url?: string;
  content?: string;
  duration?: number;
  required: boolean;
}

export interface TrainingAssessment {
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // minutes
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface TrainingRecord {
  id: string;
  userId: string;
  trainingId: string;
  status: TrainingStatus;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  attempts: number;
  certificateUrl?: string;
  expiresAt?: Date;
}

export enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

// Ride sharing and trusted contacts
export interface RideShare {
  rideId: string;
  sharedBy: string;
  sharedWith: TrustedContact[];
  shareLevel: ShareLevel;
  expiresAt?: Date;
  createdAt: Date;
}

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  relationship: string;
  canTrackRides: boolean;
  canReceiveAlerts: boolean;
  addedAt: Date;
  verified: boolean;
}

export enum ShareLevel {
  BASIC = 'basic', // Just ride details
  TRACKING = 'tracking', // Real-time location
  FULL = 'full', // All ride information and controls
}

// Safety policies and compliance
export interface SafetyPolicy {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  rules: SafetyRule[];
  applicableTo: string[]; // user roles
  enforcementLevel: EnforcementLevel;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export enum PolicyType {
  DRIVER_BEHAVIOR = 'driver_behavior',
  VEHICLE_STANDARDS = 'vehicle_standards',
  PASSENGER_CONDUCT = 'passenger_conduct',
  EMERGENCY_PROCEDURES = 'emergency_procedures',
  DATA_PRIVACY = 'data_privacy',
  PLATFORM_USAGE = 'platform_usage',
}

export interface SafetyRule {
  id: string;
  description: string;
  conditions: string[];
  consequences: RuleConsequence[];
  severity: RuleSeverity;
}

export interface RuleConsequence {
  type: ConsequenceType;
  duration?: number; // days
  description: string;
  appealable: boolean;
}

export enum ConsequenceType {
  WARNING = 'warning',
  TEMPORARY_SUSPENSION = 'temporary_suspension',
  PERMANENT_SUSPENSION = 'permanent_suspension',
  FINE = 'fine',
  MANDATORY_TRAINING = 'mandatory_training',
  ACCOUNT_TERMINATION = 'account_termination',
}

export enum RuleSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CRITICAL = 'critical',
}

export enum EnforcementLevel {
  ADVISORY = 'advisory',
  MANDATORY = 'mandatory',
  STRICT = 'strict',
}

// Safety audit and compliance tracking
export interface SafetyAudit {
  id: string;
  type: AuditType;
  targetId: string; // userId, vehicleId, etc.
  targetType: string;
  auditorId: string;
  findings: AuditFinding[];
  overallRating: number;
  recommendations: string[];
  status: AuditStatus;
  scheduledAt: Date;
  completedAt?: Date;
  nextAuditDue?: Date;
}

export enum AuditType {
  DRIVER_SAFETY = 'driver_safety',
  VEHICLE_INSPECTION = 'vehicle_inspection',
  COMPLIANCE_CHECK = 'compliance_check',
  INCIDENT_REVIEW = 'incident_review',
  TRAINING_VERIFICATION = 'training_verification',
}

export interface AuditFinding {
  category: string;
  description: string;
  severity: RuleSeverity;
  evidence?: string[];
  recommendation: string;
  resolved: boolean;
  resolvedAt?: Date;
}

export enum AuditStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FOLLOW_UP_REQUIRED = 'follow_up_required',
}

import { GeoLocation, TimeWindow } from '@/types/common.types';
import {
  EmergencyIncident,
  EmergencyType,
  RideShare,
  SafetyAlert,
  SafetyAudit,
  SafetyPolicy,
  SafetyScore,
  SafetyTraining,
  TrainingRecord,
  TrustedContact,
} from '@/types/safety.types';

/**
 * Core safety service interface
 */
export interface SafetyService {
  // Emergency management
  triggerEmergency(
    rideId: string,
    userId: string,
    type: EmergencyType
  ): Promise<void>;
  reportIncident(
    incident: Omit<EmergencyIncident, 'id' | 'reportedAt'>
  ): Promise<EmergencyIncident>;
  getIncident(incidentId: string): Promise<EmergencyIncident | null>;
  updateIncidentStatus(
    incidentId: string,
    status: string,
    notes?: string
  ): Promise<void>;

  // Safety monitoring
  monitorRide(rideId: string): Promise<void>;
  stopMonitoring(rideId: string): Promise<void>;
  checkSafetyAlerts(rideId: string): Promise<SafetyAlert[]>;

  // Safety scoring
  calculateSafetyScore(
    userId: string,
    userType: 'driver' | 'passenger'
  ): Promise<SafetyScore>;
  updateSafetyScore(userId: string, factors: any[]): Promise<SafetyScore>;

  // Ride sharing and tracking
  shareRideDetails(rideId: string, contacts: TrustedContact[]): Promise<void>;
  generateTrackingLink(rideId: string): Promise<string>;

  // Safety features
  enableSafetyFeatures(rideId: string, features: string[]): Promise<void>;
  disableSafetyFeatures(rideId: string, features: string[]): Promise<void>;
}

/**
 * Emergency response interface
 */
export interface EmergencyResponse {
  // Emergency handling
  handleEmergencyTrigger(
    rideId: string,
    userId: string,
    type: EmergencyType
  ): Promise<EmergencyResponse>;
  escalateEmergency(incidentId: string, escalationLevel: number): Promise<void>;
  resolveEmergency(incidentId: string, resolution: string): Promise<void>;

  // Emergency contacts
  notifyEmergencyContacts(
    userId: string,
    incident: EmergencyIncident
  ): Promise<void>;
  contactEmergencyServices(incident: EmergencyIncident): Promise<void>;

  // Response coordination
  dispatchSecurityTeam(
    location: GeoLocation,
    incidentId: string
  ): Promise<void>;
  coordinateWithAuthorities(incident: EmergencyIncident): Promise<void>;

  // Emergency communication
  establishEmergencyChannel(rideId: string): Promise<string>;
  broadcastEmergencyAlert(
    area: GeoLocation,
    radius: number,
    message: string
  ): Promise<void>;
}

export interface EmergencyResponseResult {
  success: boolean;
  incidentId: string;
  responseTime: number;
  actionsInitiated: string[];
  contactsNotified: number;
  emergencyServicesContacted: boolean;
}

/**
 * Safety monitoring interface
 */
export interface SafetyMonitoring {
  // Real-time monitoring
  startRideMonitoring(rideId: string): Promise<void>;
  monitorRouteDeviation(rideId: string, expectedRoute: any): Promise<void>;
  monitorSpeedViolations(rideId: string, speedLimits: any): Promise<void>;
  monitorUnusualStops(rideId: string): Promise<void>;

  // Behavioral analysis
  analyzeDriverBehavior(
    driverId: string,
    rideId: string
  ): Promise<BehaviorAnalysis>;
  detectAnomalousPatterns(
    userId: string,
    timeWindow: TimeWindow
  ): Promise<AnomalyDetection[]>;

  // Automated alerts
  generateSafetyAlert(
    rideId: string,
    alertType: string,
    data: any
  ): Promise<SafetyAlert>;
  processAutomatedAlerts(): Promise<void>;

  // Compliance monitoring
  monitorComplianceViolations(userId: string): Promise<ComplianceViolation[]>;
  trackSafetyMetrics(timeWindow: TimeWindow): Promise<SafetyMetrics>;
}

export interface BehaviorAnalysis {
  userId: string;
  rideId: string;
  overallScore: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskFactor {
  type: string;
  severity: number;
  description: string;
  evidence: any[];
}

export interface AnomalyDetection {
  userId: string;
  anomalyType: string;
  severity: number;
  description: string;
  detectedAt: Date;
  confidence: number;
}

export interface ComplianceViolation {
  userId: string;
  violationType: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  detectedAt: Date;
  resolved: boolean;
}

export interface SafetyMetrics {
  timeWindow: TimeWindow;
  totalIncidents: number;
  incidentsByType: IncidentTypeMetrics[];
  averageResponseTime: number;
  resolutionRate: number;
  safetyScoreDistribution: ScoreDistribution[];
}

export interface IncidentTypeMetrics {
  type: EmergencyType;
  count: number;
  averageSeverity: number;
  resolutionTime: number;
}

export interface ScoreDistribution {
  scoreRange: string;
  userCount: number;
  percentage: number;
}

/**
 * Safety training interface
 */
export interface SafetyTrainingManager {
  // Training management
  createTraining(training: Omit<SafetyTraining, 'id'>): Promise<SafetyTraining>;
  updateTraining(
    trainingId: string,
    updates: Partial<SafetyTraining>
  ): Promise<SafetyTraining>;
  deactivateTraining(trainingId: string): Promise<void>;

  // Training assignment
  assignTraining(userId: string, trainingId: string): Promise<TrainingRecord>;
  getRequiredTraining(
    userId: string,
    userRole: string
  ): Promise<SafetyTraining[]>;
  getTrainingProgress(userId: string): Promise<TrainingProgress>;

  // Training completion
  startTraining(userId: string, trainingId: string): Promise<void>;
  completeTraining(
    userId: string,
    trainingId: string,
    score: number
  ): Promise<TrainingRecord>;

  // Certification management
  issueCertificate(userId: string, trainingId: string): Promise<string>;
  renewCertificate(userId: string, trainingId: string): Promise<string>;
  checkCertificationStatus(userId: string): Promise<CertificationStatus[]>;
}

export interface TrainingProgress {
  userId: string;
  totalRequired: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  records: TrainingRecord[];
}

export interface CertificationStatus {
  trainingId: string;
  trainingName: string;
  certified: boolean;
  certificateUrl?: string;
  issuedAt?: Date;
  expiresAt?: Date;
  status: 'valid' | 'expired' | 'expiring_soon' | 'not_certified';
}

/**
 * Trusted contacts and ride sharing interface
 */
export interface TrustedContactManager {
  // Contact management
  addTrustedContact(
    userId: string,
    contact: Omit<TrustedContact, 'id' | 'addedAt'>
  ): Promise<TrustedContact>;
  removeTrustedContact(userId: string, contactId: string): Promise<void>;
  updateTrustedContact(
    contactId: string,
    updates: Partial<TrustedContact>
  ): Promise<TrustedContact>;
  getTrustedContacts(userId: string): Promise<TrustedContact[]>;

  // Contact verification
  verifyContact(contactId: string, verificationCode: string): Promise<boolean>;
  sendVerificationCode(contactId: string): Promise<void>;

  // Ride sharing
  shareRide(
    rideId: string,
    contactIds: string[],
    shareLevel: string
  ): Promise<RideShare>;
  stopSharingRide(rideId: string): Promise<void>;
  updateShareLevel(rideId: string, shareLevel: string): Promise<void>;

  // Notifications
  notifyTrustedContacts(
    userId: string,
    message: string,
    urgency: string
  ): Promise<void>;
  sendRideUpdates(rideId: string, update: string): Promise<void>;
}

/**
 * Safety policy and compliance interface
 */
export interface SafetyPolicyManager {
  // Policy management
  createPolicy(policy: Omit<SafetyPolicy, 'id'>): Promise<SafetyPolicy>;
  updatePolicy(
    policyId: string,
    updates: Partial<SafetyPolicy>
  ): Promise<SafetyPolicy>;
  activatePolicy(policyId: string): Promise<void>;
  deactivatePolicy(policyId: string): Promise<void>;

  // Policy enforcement
  checkPolicyCompliance(
    userId: string,
    action: string
  ): Promise<ComplianceCheck>;
  enforcePolicy(userId: string, violation: any): Promise<PolicyEnforcement>;

  // Audit management
  scheduleAudit(
    targetId: string,
    targetType: string,
    auditType: string
  ): Promise<SafetyAudit>;
  conductAudit(auditId: string, findings: any[]): Promise<SafetyAudit>;
  getAuditHistory(targetId: string): Promise<SafetyAudit[]>;
}

export interface ComplianceCheck {
  compliant: boolean;
  violations: PolicyViolation[];
  warnings: string[];
  requiredActions: string[];
}

export interface PolicyViolation {
  policyId: string;
  ruleId: string;
  description: string;
  severity: string;
  consequences: string[];
}

export interface PolicyEnforcement {
  violationId: string;
  action: string;
  severity: string;
  duration?: number;
  appealable: boolean;
  effectiveAt: Date;
}

/**
 * Safety analytics interface
 */
export interface SafetyAnalytics {
  // Incident analytics
  analyzeIncidentTrends(timeWindow: TimeWindow): Promise<IncidentTrends>;
  getIncidentHotspots(area?: GeoLocation): Promise<SafetyHotspot[]>;
  analyzeIncidentCauses(timeWindow: TimeWindow): Promise<CauseAnalysis>;

  // Safety performance
  calculateSafetyKPIs(timeWindow: TimeWindow): Promise<SafetyKPIs>;
  benchmarkSafetyPerformance(timeWindow: TimeWindow): Promise<SafetyBenchmark>;

  // Risk assessment
  assessUserRisk(userId: string): Promise<RiskAssessment>;
  assessRouteRisk(route: any): Promise<RouteRiskAssessment>;
  assessAreaRisk(
    area: GeoLocation,
    radius: number
  ): Promise<AreaRiskAssessment>;

  // Predictive analytics
  predictSafetyIncidents(
    area: GeoLocation,
    timeWindow: TimeWindow
  ): Promise<IncidentPrediction>;
  identifyRiskFactors(timeWindow: TimeWindow): Promise<RiskFactorAnalysis>;
}

export interface IncidentTrends {
  timeWindow: TimeWindow;
  totalIncidents: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  incidentsByType: IncidentTypeMetrics[];
  seasonalPatterns: SeasonalPattern[];
}

export interface SeasonalPattern {
  period: string;
  incidentCount: number;
  riskLevel: number;
}

export interface SafetyHotspot {
  location: GeoLocation;
  radius: number;
  incidentCount: number;
  riskScore: number;
  primaryRiskTypes: string[];
  recommendations: string[];
}

export interface CauseAnalysis {
  timeWindow: TimeWindow;
  primaryCauses: CauseFactor[];
  contributingFactors: CauseFactor[];
  preventableIncidents: number;
  recommendations: string[];
}

export interface CauseFactor {
  cause: string;
  frequency: number;
  severity: number;
  preventability: number;
}

export interface SafetyKPIs {
  timeWindow: TimeWindow;
  incidentRate: number;
  responseTime: number;
  resolutionRate: number;
  userSatisfaction: number;
  complianceRate: number;
  trainingCompletionRate: number;
}

export interface SafetyBenchmark {
  currentPerformance: SafetyKPIs;
  industryBenchmark: SafetyKPIs;
  performanceGap: number;
  improvementAreas: string[];
}

export interface RiskAssessment {
  userId: string;
  overallRisk: number;
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  monitoringLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface RouteRiskAssessment {
  route: any;
  overallRisk: number;
  riskSegments: RouteRiskSegment[];
  recommendations: string[];
}

export interface RouteRiskSegment {
  startLocation: GeoLocation;
  endLocation: GeoLocation;
  riskLevel: number;
  riskTypes: string[];
  mitigations: string[];
}

export interface AreaRiskAssessment {
  area: GeoLocation;
  radius: number;
  overallRisk: number;
  riskFactors: AreaRiskFactor[];
  timeBasedRisk: TimeBasedRisk[];
}

export interface AreaRiskFactor {
  factor: string;
  impact: number;
  prevalence: number;
}

export interface TimeBasedRisk {
  timeOfDay: string;
  riskLevel: number;
  primaryRisks: string[];
}

export interface IncidentPrediction {
  area: GeoLocation;
  timeWindow: TimeWindow;
  predictedIncidents: number;
  confidence: number;
  riskFactors: PredictiveRiskFactor[];
}

export interface PredictiveRiskFactor {
  factor: string;
  weight: number;
  currentValue: number;
  impact: number;
}

export interface RiskFactorAnalysis {
  timeWindow: TimeWindow;
  topRiskFactors: RiskFactor[];
  emergingRisks: EmergingRisk[];
  mitigationEffectiveness: MitigationEffectiveness[];
}

export interface EmergingRisk {
  riskType: string;
  trendDirection: 'increasing' | 'decreasing';
  severity: number;
  firstDetected: Date;
}

export interface MitigationEffectiveness {
  mitigation: string;
  effectiveness: number;
  costBenefit: number;
  recommendation: string;
}

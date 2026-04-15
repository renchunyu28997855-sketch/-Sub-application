export interface DegradationData {
  bearingCondition: number;
  windingTemp: number;
  vibration: number;
  seal: number;
  efficiency: number;
  equipmentAge: number;
}

export interface HistoricalEntry {
  timestamp: string;
  healthIndex: number;
  degradationData: DegradationData;
}

export interface Anomaly {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface CostData {
  plannedReplacementCost: number;
  emergencyReplacementCost: number;
  downtimeCostPerDay: number;
  maintenanceCostPerDay: number;
}

export interface MaintenanceInput {
  equipmentId: string;
  equipmentType: 'centrifugal_pump' | 'induction_motor' | 'compressor' | 'gearbox' | 'turbine';
  operatingHours: number;
  degradationData: DegradationData;
  historicalData: HistoricalEntry[];
  anomalies: Anomaly[];
  costData: CostData;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  input: MaintenanceInput;
}

export const templates: Template[] = [
  {
    id: 'motor-predictive',
    name: '电机预测维护',
    category: '电机设备',
    input: {
      equipmentId: 'MOTOR-001',
      equipmentType: 'induction_motor',
      operatingHours: 15000,
      degradationData: {
        bearingCondition: 75,
        windingTemp: 85,
        vibration: 2.5,
        seal: 90,
        efficiency: 92,
        equipmentAge: 5,
      },
      historicalData: [
        { timestamp: '2024-01-01', healthIndex: 0.95, degradationData: { bearingCondition: 95, windingTemp: 70, vibration: 1.0, seal: 98, efficiency: 96, equipmentAge: 4 } },
        { timestamp: '2024-04-01', healthIndex: 0.88, degradationData: { bearingCondition: 88, windingTemp: 75, vibration: 1.5, seal: 95, efficiency: 94, equipmentAge: 4.25 } },
        { timestamp: '2024-07-01', healthIndex: 0.82, degradationData: { bearingCondition: 82, windingTemp: 80, vibration: 2.0, seal: 92, efficiency: 93, equipmentAge: 4.5 } },
        { timestamp: '2024-10-01', healthIndex: 0.75, degradationData: { bearingCondition: 75, windingTemp: 85, vibration: 2.5, seal: 90, efficiency: 92, equipmentAge: 4.75 } },
      ],
      anomalies: [
        { type: 'bearing_wear', severity: 'medium', description: '轴承磨损趋势明显' },
        { type: 'temp_increase', severity: 'low', description: '绕组温度缓慢上升' },
      ],
      costData: {
        plannedReplacementCost: 50000,
        emergencyReplacementCost: 120000,
        downtimeCostPerDay: 25000,
        maintenanceCostPerDay: 3000,
      },
    },
  },
  {
    id: 'pump-health',
    name: '泵设备健康分析',
    category: '泵设备',
    input: {
      equipmentId: 'PUMP-CF-002',
      equipmentType: 'centrifugal_pump',
      operatingHours: 20000,
      degradationData: {
        bearingCondition: 60,
        windingTemp: 78,
        vibration: 4.2,
        seal: 65,
        efficiency: 85,
        equipmentAge: 8,
      },
      historicalData: [
        { timestamp: '2023-06-01', healthIndex: 0.90, degradationData: { bearingCondition: 90, windingTemp: 65, vibration: 1.8, seal: 95, efficiency: 92, equipmentAge: 6 } },
        { timestamp: '2023-09-01', healthIndex: 0.80, degradationData: { bearingCondition: 80, windingTemp: 70, vibration: 2.5, seal: 85, efficiency: 89, equipmentAge: 6.5 } },
        { timestamp: '2023-12-01', healthIndex: 0.70, degradationData: { bearingCondition: 70, windingTemp: 74, vibration: 3.5, seal: 75, efficiency: 87, equipmentAge: 7 } },
        { timestamp: '2024-03-01', healthIndex: 0.60, degradationData: { bearingCondition: 60, windingTemp: 78, vibration: 4.2, seal: 65, efficiency: 85, equipmentAge: 7.5 } },
      ],
      anomalies: [
        { type: 'seal_leakage', severity: 'high', description: '密封性能严重下降，存在泄漏风险' },
        { type: 'vibration_anomaly', severity: 'critical', description: '振动值超过安全阈值' },
      ],
      costData: {
        plannedReplacementCost: 80000,
        emergencyReplacementCost: 200000,
        downtimeCostPerDay: 50000,
        maintenanceCostPerDay: 5000,
      },
    },
  },
  {
    id: 'gearbox-life',
    name: '齿轮箱寿命预测',
    category: '传动设备',
    input: {
      equipmentId: 'GEAR-003',
      equipmentType: 'gearbox',
      operatingHours: 30000,
      degradationData: {
        bearingCondition: 70,
        windingTemp: 72,
        vibration: 3.8,
        seal: 80,
        efficiency: 88,
        equipmentAge: 10,
      },
      historicalData: [
        { timestamp: '2022-01-01', healthIndex: 0.92, degradationData: { bearingCondition: 92, windingTemp: 60, vibration: 1.5, seal: 95, efficiency: 94, equipmentAge: 8 } },
        { timestamp: '2022-07-01', healthIndex: 0.85, degradationData: { bearingCondition: 85, windingTemp: 64, vibration: 2.2, seal: 90, efficiency: 92, equipmentAge: 8.5 } },
        { timestamp: '2023-01-01', healthIndex: 0.78, degradationData: { bearingCondition: 78, windingTemp: 68, vibration: 3.0, seal: 85, efficiency: 90, equipmentAge: 9 } },
        { timestamp: '2023-07-01', healthIndex: 0.70, degradationData: { bearingCondition: 70, windingTemp: 72, vibration: 3.8, seal: 80, efficiency: 88, equipmentAge: 9.5 } },
      ],
      anomalies: [
        { type: 'gear_wear', severity: 'medium', description: '齿轮啮合间隙增大' },
        { type: 'oil_contamination', severity: 'low', description: '润滑油存在轻微污染' },
      ],
      costData: {
        plannedReplacementCost: 150000,
        emergencyReplacementCost: 350000,
        downtimeCostPerDay: 80000,
        maintenanceCostPerDay: 8000,
      },
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];

/**
 * Equipment Health Monitor - 设备健康监测器
 *
 * 合并技能: bearing-health-monitoring, motor-current-analysis, vibration-analysis, thermal-monitoring
 *
 * @version 1.0.0
 * 整合自 v1.0: bearing-health-monitoring, motor-current-analysis, vibration-analysis, thermal-monitoring
 */

'use strict';

// ============================================================================
// 设备规格配置
// ============================================================================

const EQUIPMENT_SPECS = {
  // 轴承规格 (来自 bearing-health-monitoring)
  bearing: {
    'deep-groove': { standardLife: 20000, normalTemp: 70, vibrationThreshold: 1.5, rollerCount: 9, contactAngle: 0 },
    'angular-contact': { standardLife: 15000, normalTemp: 75, vibrationThreshold: 2.0, rollerCount: 12, contactAngle: 30 },
    'cylindrical-roller': { standardLife: 25000, normalTemp: 80, vibrationThreshold: 2.5, rollerCount: 10, contactAngle: 0 },
    'tapered-roller': { standardLife: 18000, normalTemp: 85, vibrationThreshold: 2.0, rollerCount: 14, contactAngle: 15 },
    'thrust-ball': { standardLife: 10000, normalTemp: 70, vibrationThreshold: 3.0, rollerCount: 8, contactAngle: 90 },
    'plain-bearing': { standardLife: 15000, normalTemp: 60, vibrationThreshold: 2.0, rollerCount: 0, contactAngle: 0 }
  },

  // 电机规格 (来自 motor-current-analysis)
  motor: {
    'induction': { efficiency: 0.9, powerFactor: 0.88 },
    'asynchronous': { efficiency: 0.88, powerFactor: 0.85 },
    'synchronous': { efficiency: 0.92, powerFactor: 0.95 },
    'servo': { efficiency: 0.85, powerFactor: 0.80 },
    'dc': { efficiency: 0.87, powerFactor: 0.90 }
  },

  // 振动规格 (来自 vibration-analysis)
  iso10816: {
    zones: {
      a: { max: 2.8, condition: 'new', description: '新机器投运' },
      b: { max: 7.1, condition: 'good', description: '适合长期运行' },
      c: { max: 18, condition: 'alarm', description: '告警-需要服务' },
      d: { max: Infinity, condition: 'danger', description: '危险-需要停机' }
    }
  },

  // 温度规格 (来自 thermal-monitoring)
  temperature: {
    induction_motor: {
      winding: { max: 120, alarm: 110, warning: 95, baseline: 80 },
      bearing: { max: 95, alarm: 90, warning: 80, baseline: 65 },
      surface: { max: 80, alarm: 75, warning: 65, baseline: 50 }
    },
    dc_motor: {
      winding: { max: 110, alarm: 100, warning: 90, baseline: 75 },
      bearing: { max: 90, alarm: 85, warning: 75, baseline: 60 },
      surface: { max: 75, alarm: 70, warning: 60, baseline: 45 }
    },
    compressor: {
      cylinder: { max: 180, alarm: 160, warning: 140, baseline: 110 },
      bearing: { max: 100, alarm: 95, warning: 85, baseline: 70 },
      discharge: { max: 150, alarm: 140, warning: 125, baseline: 100 }
    },
    pump: {
      bearing: { max: 90, alarm: 85, warning: 75, baseline: 60 },
      seal: { max: 85, alarm: 80, warning: 70, baseline: 55 },
      liquid: { max: 80, alarm: 75, warning: 65, baseline: 50 }
    },
    gearbox: {
      oil: { max: 100, alarm: 95, warning: 85, baseline: 70 },
      bearing: { max: 95, alarm: 90, warning: 80, baseline: 65 },
      surface: { max: 75, alarm: 70, warning: 60, baseline: 45 }
    }
  }
};

// ============================================================================
// 扣分阈值配置
// ============================================================================

const PENALTIES = {
  vibration: [
    { max: 1.0, penalty: 0 },
    { max: 2.0, penalty: 10 },
    { max: 4.0, penalty: 25 },
    { max: Infinity, penalty: 40 }
  ],
  temperature: [
    { maxOffset: 0, penalty: 0 },
    { maxOffset: 15, penalty: 15 },
    { maxOffset: Infinity, penalty: 30 }
  ],
  currentUnbalance: [
    { max: 2, status: 'normal', penalty: 0 },
    { max: 5, status: 'attention', penalty: 5 },
    { max: 10, status: 'warning', penalty: 15 },
    { max: Infinity, status: 'critical', penalty: 30 }
  ],
  voltageUnbalance: [
    { max: 2, status: 'normal', penalty: 0 },
    { max: 5, status: 'attention', penalty: 3 },
    { max: 10, status: 'warning', penalty: 12 },
    { max: Infinity, status: 'critical', penalty: 20 }
  ],
  load: [
    { max: 80, status: 'light', penalty: 0 },
    { max: 100, status: 'normal', penalty: 0 },
    { max: 115, status: 'overload-warning', penalty: 10 },
    { max: Infinity, status: 'overload-critical', penalty: 25 }
  ]
};

// ============================================================================
// 健康状态阈值
// ============================================================================

const HEALTH_THRESHOLDS = [
  { min: 90, status: 'excellent' },
  { min: 75, status: 'good' },
  { min: 60, status: 'fair' },
  { min: 40, status: 'poor' },
  { min: 0, status: 'critical' }
];

const FAILURE_RISK_THRESHOLDS = [
  { min: 90, risk: 'very-low' },
  { min: 75, risk: 'low' },
  { min: 60, risk: 'medium' },
  { min: 40, risk: 'high' },
  { min: 0, risk: 'very-high' }
];

// ============================================================================
// 辅助函数
// ============================================================================

function calculateRMS(values) {
  if (!values || values.length === 0) return 0;
  const sumSquares = values.reduce((sum, v) => sum + v * v, 0);
  return Math.sqrt(sumSquares / values.length);
}

function calculateAverage(a, b, c) {
  return (a + b + c) / 3;
}

function getStatus(value, thresholds) {
  for (const threshold of thresholds) {
    if (value <= threshold.max) {
      return threshold;
    }
  }
  return thresholds[thresholds.length - 1];
}

function getHealthStatus(score) {
  for (const threshold of HEALTH_THRESHOLDS) {
    if (score >= threshold.min) {
      return threshold.status;
    }
  }
  return 'critical';
}

function getFailureRisk(score) {
  for (const threshold of FAILURE_RISK_THRESHOLDS) {
    if (score >= threshold.min) {
      return threshold.risk;
    }
  }
  return 'very-high';
}

// ============================================================================
// 振动分析 (来自 vibration-analysis)
// ============================================================================

function analyzeVibration(measurement, equipmentType = 'medium') {
  const zones = EQUIPMENT_SPECS.iso10816.zones;
  let zone, condition, severity, recommendation;

  if (measurement.rms <= zones.a.max) {
    zone = 'A'; condition = 'new'; severity = 'normal';
    recommendation = '无需处理';
  } else if (measurement.rms <= zones.b.max) {
    zone = 'B'; condition = 'good'; severity = 'normal';
    recommendation = '继续监测';
  } else if (measurement.rms <= zones.c.max) {
    zone = 'C'; condition = 'alarm'; severity = 'warning';
    recommendation = '1-2周内安排维护';
  } else {
    zone = 'D'; condition = 'danger'; severity = 'critical';
    recommendation = '建议立即停机检查';
  }

  return {
    rms: measurement.rms,
    peak: measurement.peak || 0,
    zone,
    condition,
    severity,
    recommendation
  };
}

// ============================================================================
// 温度分析 (来自 thermal-monitoring)
// ============================================================================

function analyzeTemperature(measurements, equipmentType = 'induction_motor') {
  const thresholds = EQUIPMENT_SPECS.temperature[equipmentType] || EQUIPMENT_SPECS.temperature.induction_motor;
  const results = {};

  for (const [point, value] of Object.entries(measurements)) {
    const threshold = thresholds[point] || thresholds.surface || { alarm: 100, warning: 80, baseline: 60 };
    let status = 'normal';

    if (value > threshold.alarm) status = 'alarm';
    else if (value > threshold.warning) status = 'warning';

    const deviation = value - threshold.baseline;

    results[point] = {
      current: value,
      baseline: threshold.baseline,
      deviation,
      status
    };
  }

  const statuses = Object.values(results).map(r => r.status);
  let overallStatus = 'normal';
  if (statuses.includes('alarm')) overallStatus = 'alarm';
  else if (statuses.includes('warning')) overallStatus = 'warning';

  return { overallStatus, points: results };
}

// ============================================================================
// 电机电流分析 (来自 motor-current-analysis)
// ============================================================================

function analyzeMotorCurrent(currentData, voltageData, ratedCurrent, ratedVoltage) {
  const iAnalysis = calculateUnbalance(currentData.phaseA, currentData.phaseB, currentData.phaseC);
  const vAnalysis = calculateUnbalance(voltageData.phaseA, voltageData.phaseB, voltageData.phaseC);

  const iStatus = getStatus(iAnalysis.unbalance, PENALTIES.currentUnbalance);
  const vStatus = getStatus(vAnalysis.unbalance, PENALTIES.voltageUnbalance);

  const loadPercentage = ratedCurrent ? (iAnalysis.average / ratedCurrent) * 100 : 0;
  const loadStatus = getStatus(loadPercentage, PENALTIES.load);

  const anomalies = diagnoseMotorAnomalies(currentData, voltageData, ratedCurrent, ratedVoltage, iAnalysis, vAnalysis);

  return {
    current: {
      average: Math.round(iAnalysis.average * 100) / 100,
      unbalance: iAnalysis.unbalance,
      unbalanceStatus: iStatus.status,
      phases: { A: currentData.phaseA, B: currentData.phaseB, C: currentData.phaseC }
    },
    voltage: {
      average: Math.round(vAnalysis.average * 100) / 100,
      unbalance: vAnalysis.unbalance,
      unbalanceStatus: vStatus.status
    },
    load: {
      percentage: Math.round(loadPercentage * 10) / 10,
      status: loadStatus.status
    },
    anomalies,
    penalties: {
      current: iStatus.penalty,
      voltage: vStatus.penalty,
      load: loadStatus.penalty
    }
  };
}

function calculateUnbalance(a, b, c) {
  const avg = calculateAverage(a, b, c);
  const max = Math.max(a, b, c);
  const min = Math.min(a, b, c);
  const unbalance = avg > 0 ? ((max - min) / avg) * 100 : 0;

  const phaseMap = { phaseA: 'A', phaseB: 'B', phaseC: 'C' };
  const values = { phaseA: a, phaseB: b, phaseC: c };
  const maxPhase = Object.keys(values).find(k => values[k] === max);
  const minPhase = Object.keys(values).find(k => values[k] === min);

  return {
    average: avg,
    unbalance: Math.round(unbalance * 100) / 100,
    maxPhase: phaseMap[maxPhase],
    minPhase: phaseMap[minPhase]
  };
}

function diagnoseMotorAnomalies(currentData, voltageData, ratedCurrent, ratedVoltage, iAnalysis, vAnalysis) {
  const anomalies = [];
  const { phaseA: ia, phaseB: ib, phaseC: ic } = currentData;

  // 缺相检测
  const zeroPhaseCurrent = [ia, ib, ic].find(i => i < 0.5);
  if (zeroPhaseCurrent !== undefined) {
    anomalies.push({
      type: 'phase-loss',
      severity: 'critical',
      description: '检测到缺相'
    });
  }

  // 过载检测
  if (ratedCurrent && iAnalysis.average > ratedCurrent * 1.15) {
    if (iAnalysis.average > ratedCurrent * 4) {
      anomalies.push({
        type: 'locked-rotor',
        severity: 'critical',
        description: '可能发生堵转'
      });
    } else {
      anomalies.push({
        type: 'overload',
        severity: 'warning',
        description: `电机过载，${(iAnalysis.average / ratedCurrent * 100).toFixed(0)}%额定负载`
      });
    }
  }

  // 电流不平衡
  if (iAnalysis.unbalance > 5) {
    anomalies.push({
      type: 'current-unbalance',
      severity: iAnalysis.unbalance > 10 ? 'warning' : 'attention',
      description: `电流不平衡度${iAnalysis.unbalance.toFixed(2)}%`
    });
  }

  // 电压不平衡
  if (vAnalysis.unbalance > 5) {
    anomalies.push({
      type: 'voltage-unbalance',
      severity: vAnalysis.unbalance > 10 ? 'warning' : 'attention',
      description: `电压不平衡度${vAnalysis.unbalance.toFixed(2)}%`
    });
  }

  return anomalies;
}

// ============================================================================
// 轴承健康分析 (来自 bearing-health-monitoring)
// ============================================================================

function analyzeBearingHealth(vibrationData, temperature, bearingType = 'deep-groove', operatingHours = 0) {
  const spec = EQUIPMENT_SPECS.bearing[bearingType] || EQUIPMENT_SPECS.bearing['deep-groove'];

  let score = 100;

  // 振动扣分
  const vibrationPenalty = getStatus(vibrationData.rms, PENALTIES.vibration);
  score -= vibrationPenalty.penalty;

  // 温度扣分
  const tempOffset = temperature - spec.normalTemp;
  const tempPenalty = getStatus(tempOffset, PENALTIES.temperature);
  score -= tempPenalty.penalty;

  // 年龄扣分
  if (operatingHours) {
    const ageRatio = operatingHours / spec.standardLife;
    if (ageRatio >= 1) score -= 35;
    else score -= Math.round(ageRatio * 30);
  }

  score = Math.round(Math.max(0, Math.min(100, score)));

  // 异常识别
  const anomalies = [];
  if (vibrationData.amplitude > spec.vibrationThreshold * 3) {
    anomalies.push({ type: 'high-amplitude', severity: 'critical', description: '振幅严重超标' });
  } else if (vibrationData.amplitude > spec.vibrationThreshold * 2) {
    anomalies.push({ type: 'elevated-amplitude', severity: 'warning', description: '振幅偏高' });
  }

  if (temperature > spec.normalTemp + 20) {
    anomalies.push({ type: 'over-temperature', severity: 'critical', description: '温度严重超标' });
  } else if (temperature > spec.normalTemp + 10) {
    anomalies.push({ type: 'high-temperature', severity: 'warning', description: '温度偏高' });
  }

  // 剩余寿命计算
  let remainingHours;
  if (score >= 90) {
    remainingHours = Math.round(spec.standardLife * 0.2);
  } else if (score >= 75) {
    remainingHours = Math.round(spec.standardLife * 0.15);
  } else if (score >= 60) {
    remainingHours = Math.round(spec.standardLife * 0.1);
  } else {
    remainingHours = Math.round(spec.standardLife * 0.05);
  }

  return {
    score,
    healthStatus: getHealthStatus(score),
    bearingType,
    spec: { standardLife: spec.standardLife, normalTemp: spec.normalTemp, vibrationThreshold: spec.vibrationThreshold },
    remainingLife: { hours: remainingHours, confidence: score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low' },
    anomalies,
    vibrationPenalty: vibrationPenalty.penalty,
    tempPenalty: tempPenalty.penalty
  };
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合设备健康监测
 * @param {Object} input - 输入参数
 * @returns {Object} 综合健康监测结果
 */
function equipmentHealthMonitor(input) {
  const {
    equipmentId,
    equipmentType = 'general',
    bearingType,
    operatingHours = 0,
    measurements = {}
  } = input;

  const { vibration, temperature, current, voltage } = measurements;

  // 输入验证
  if (!equipmentId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'equipmentId is required' } };
  }

  try {
    const result = {
      success: true,
      equipmentId,
      equipmentType,
      timestamp: new Date().toISOString()
    };

    let healthScore = 100;
    const allAnomalies = [];
    const recommendations = [];

    // 1. 振动分析
    if (vibration) {
      result.vibrationAnalysis = analyzeVibration(vibration, equipmentType);
      healthScore -= result.vibrationAnalysis.severity === 'critical' ? 20 :
                     result.vibrationAnalysis.severity === 'warning' ? 10 : 0;

      if (result.vibrationAnalysis.severity === 'warning') {
        recommendations.push('振动异常，检查轴承和对中情况');
      } else if (result.vibrationAnalysis.severity === 'critical') {
        recommendations.push('振动危险，建议立即停机检查');
      }
    }

    // 2. 温度分析
    if (temperature) {
      result.temperatureAnalysis = analyzeTemperature(temperature, equipmentType);

      if (result.temperatureAnalysis.overallStatus === 'alarm') {
        healthScore -= 20;
        recommendations.push('温度告警，检查冷却系统和润滑情况');
      } else if (result.temperatureAnalysis.overallStatus === 'warning') {
        healthScore -= 10;
        recommendations.push('温度偏高，密切关注温度变化');
      }

      // 添加温度点详情到异常
      for (const [point, data] of Object.entries(result.temperatureAnalysis.points)) {
        if (data.status === 'alarm') {
          allAnomalies.push({ type: `${point}-over-temp`, severity: 'critical', description: `${point}温度${data.current}°C超标` });
        } else if (data.status === 'warning') {
          allAnomalies.push({ type: `${point}-high-temp`, severity: 'warning', description: `${point}温度${data.current}°C偏高` });
        }
      }
    }

    // 3. 电机电流分析
    if (current && voltage) {
      result.motorAnalysis = analyzeMotorCurrent(current, voltage, input.ratedCurrent, input.ratedVoltage);
      healthScore -= result.motorAnalysis.penalties.current;
      healthScore -= result.motorAnalysis.penalties.voltage;
      healthScore -= result.motorAnalysis.penalties.load;

      allAnomalies.push(...result.motorAnalysis.anomalies);

      // 电流分析建议
      for (const anomaly of result.motorAnalysis.anomalies) {
        if (anomaly.type === 'phase-loss') recommendations.push('检测到缺相，立即停机检查电源');
        else if (anomaly.type === 'locked-rotor') recommendations.push('检测到堵转，立即停机检查负载');
        else if (anomaly.type === 'overload') recommendations.push('电机过载，降低负载或检查机械问题');
      }
    }

    // 4. 轴承健康分析
    if (vibration && temperature && bearingType) {
      result.bearingAnalysis = analyzeBearingHealth(vibration, temperature, bearingType, operatingHours);
      // 轴承分数单独计算，不重复扣分
    }

    // 综合评分
    healthScore = Math.round(Math.max(0, Math.min(100, healthScore)));
    result.healthScore = healthScore;
    result.healthStatus = getHealthStatus(healthScore);
    result.failureRisk = getFailureRisk(healthScore);

    // 汇总异常
    if (vibration && !result.motorAnalysis) {
      // 纯振动设备的异常
      if (result.vibrationAnalysis?.severity !== 'normal') {
        allAnomalies.push({
          type: 'vibration-' + result.vibrationAnalysis.severity,
          severity: result.vibrationAnalysis.severity,
          description: `振动RMS: ${vibration.rms}mm/s`
        });
      }
    }
    result.anomalies = allAnomalies;

    // 生成建议
    if (result.healthStatus === 'excellent' || result.healthStatus === 'good') {
      recommendations.push('设备状态良好，继续当前维护计划');
      recommendations.push('建议2000小时后进行例行检查');
    } else if (result.healthStatus === 'fair') {
      recommendations.push('设备状态一般，建议加强监测频率');
      recommendations.push('考虑在下次计划停机时进行检查');
    } else if (result.healthStatus === 'poor') {
      recommendations.push('设备状态较差，建议尽快安排维护');
      recommendations.push('增加日常巡检频次');
    } else {
      recommendations.push('设备状态危险，建议立即安排检修');
      recommendations.push('准备备件，考虑紧急维护');
    }

    result.recommendations = [...new Set(recommendations)]; // 去重

    // 计算置信度
    let confidence = 0.9;
    if (!vibration) confidence -= 0.15;
    if (!temperature) confidence -= 0.1;
    if (!current) confidence -= 0.1;
    if (allAnomalies.some(a => a.severity === 'critical')) confidence -= 0.1;
    result.confidence = Math.max(0.6, confidence);

    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '设备健康监测过程发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  equipmentHealthMonitor,
  analyzeVibration,
  analyzeTemperature,
  analyzeMotorCurrent,
  analyzeBearingHealth,
  EQUIPMENT_SPECS
};

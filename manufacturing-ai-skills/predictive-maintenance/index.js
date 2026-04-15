/**
 * Predictive Maintenance - 预测性维护
 *
 * 合并技能: equipment-failure-prediction, remaining-life-prediction, spoilage-prediction
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 配置参数
// ============================================================================

const CONFIG = {
  designLifeHours: 87600, // 10年运行小时
  healthThreshold: 0.2,    // 临界健康阈值
  degradationWindowDays: 30,
  confidenceLevel: 0.8,
  defaultDegradationRates: {
    bearing: 0.0001,
    seal: 0.00005,
    motor: 0.00008,
    general: 0.00003
  }
};

// ============================================================================
// 设备配置
// ============================================================================

const EQUIPMENT_CONFIGS = {
  centrifugal_pump: {
    criticalComponents: ['bearing', 'seal', 'impeller'],
    failureModes: ['wear', 'erosion', 'corrosion'],
    typicalLifeHours: 50000,
    degradationIndicators: { bearing: 0.4, seal: 0.3, efficiency: 0.3 }
  },
  induction_motor: {
    criticalComponents: ['winding', 'bearing', 'shaft'],
    failureModes: ['insulation_degradation', 'bearing_wear', 'thermal'],
    typicalLifeHours: 75000,
    degradationIndicators: { windingTemp: 0.35, bearingCondition: 0.35, vibration: 0.3 }
  },
  compressor: {
    criticalComponents: ['valve', 'piston', 'cylinder'],
    failureModes: ['wear', 'valve_failure', 'overheating'],
    typicalLifeHours: 60000,
    degradationIndicators: { valveCondition: 0.4, cylinderWear: 0.35, efficiency: 0.25 }
  },
  gearbox: {
    criticalComponents: ['gear', 'bearing', 'seal'],
    failureModes: ['gear_wear', 'bearing_failure', 'oil_degradation'],
    typicalLifeHours: 80000,
    degradationIndicators: { gearCondition: 0.4, bearingCondition: 0.35, oilQuality: 0.25 }
  },
  turbine: {
    criticalComponents: ['blade', 'seal', 'bearing'],
    failureModes: ['erosion', 'fatigue', 'creep'],
    typicalLifeHours: 100000,
    degradationIndicators: { bladeCondition: 0.45, thermalDegradation: 0.35, vibration: 0.2 }
  },
  general: {
    criticalComponents: ['general'],
    failureModes: ['wear', 'fatigue', 'degradation'],
    typicalLifeHours: 50000,
    degradationIndicators: { general: 1.0 }
  }
};

// ============================================================================
// 故障模式库
// ============================================================================

const FAILURE_MODES = {
  bearing_wear: {
    symptoms: ['vibration_increase', 'temperature_rise', 'noise'],
    severity: 'high',
    typicalTimeToFailure: '3-6 months'
  },
  insulation_degradation: {
    symptoms: ['winding_temperature_rise', 'partial_discharge', 'efficiency_drop'],
    severity: 'critical',
    typicalTimeToFailure: '6-12 months'
  },
  lubrication_failure: {
    symptoms: ['temperature_rise', 'metal_particles', 'noise'],
    severity: 'high',
    typicalTimeToFailure: '1-3 months'
  },
  misalignment: {
    symptoms: ['vibration_increase', 'bearing_wear', 'coupling_wear'],
    severity: 'medium',
    typicalTimeToFailure: '6-12 months'
  },
  unbalance: {
    symptoms: ['radial_vibration', 'high_amplitude'],
    severity: 'medium',
    typicalTimeToFailure: '3-6 months'
  },
  overloading: {
    symptoms: ['current_increase', 'temperature_rise', 'efficiency_drop'],
    severity: 'high',
    typicalTimeToFailure: '1-6 months'
  }
};

// ============================================================================
// 健康状态评估
// ============================================================================

function calculateHealthIndex(degradationData, equipmentType) {
  const config = EQUIPMENT_CONFIGS[equipmentType] || EQUIPMENT_CONFIGS.general;
  const indicators = config.degradationIndicators;

  let weightedSum = 0;
  let weightSum = 0;

  for (const [indicator, weight] of Object.entries(indicators)) {
    // degradationData values: 0 = new/perfect, 1 = failed
    const conditionScore = degradationData[indicator] !== undefined
      ? 1 - degradationData[indicator]
      : 1;

    weightedSum += conditionScore * weight;
    weightSum += weight;
  }

  const baseHealth = weightSum > 0 ? weightedSum / weightSum : 0.8;

  // 设备年龄调整
  if (degradationData.equipmentAge) {
    const ageFactor = Math.max(0.5, 1 - (degradationData.equipmentAge / 200));
    return baseHealth * ageFactor;
  }

  return baseHealth;
}

function getHealthStatus(healthIndex) {
  if (healthIndex >= 0.8) {
    return { level: 'good', description: '设备运行状态良好' };
  } else if (healthIndex >= 0.6) {
    return { level: 'fair', description: '设备有轻微退化' };
  } else if (healthIndex >= 0.4) {
    return { level: 'warning', description: '设备需要关注' };
  } else if (healthIndex >= 0.2) {
    return { level: 'poor', description: '设备接近寿命末期' };
  } else {
    return { level: 'critical', description: '设备需要立即维护' };
  }
}

// ============================================================================
// 退化率计算
// ============================================================================

function calculateDegradationRate(historicalData, windowDays = CONFIG.degradationWindowDays) {
  if (!historicalData || historicalData.length < 2) {
    return CONFIG.defaultDegradationRates.general;
  }

  const sorted = [...historicalData].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const recentData = sorted.filter(d => new Date(d.timestamp).getTime() > cutoff);

  if (recentData.length < 2) {
    return CONFIG.defaultDegradationRates.general;
  }

  const n = recentData.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  recentData.forEach((point, index) => {
    const healthScore = point.healthIndex !== undefined
      ? point.healthIndex
      : calculateHealthIndex(point.degradationData || {}, point.equipmentType || 'general');

    sumX += index;
    sumY += healthScore;
    sumXY += index * healthScore;
    sumX2 += index * index;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const avgIntervalDays = windowDays / (n - 1) || 1;
  const dailyDegradation = Math.abs(slope) * avgIntervalDays;

  return Math.max(CONFIG.defaultDegradationRates.general * 0.1, dailyDegradation);
}

// ============================================================================
// 剩余寿命计算 (RUL)
// ============================================================================

function calculateRUL(currentHealth, degradationRate, threshold = CONFIG.healthThreshold) {
  if (currentHealth <= threshold) {
    return { hours: 0, days: 0, cycles: 0, percentage: 0, isExpired: true };
  }

  if (degradationRate <= 0) {
    return { hours: Infinity, days: Infinity, cycles: Infinity, percentage: 100, isExpired: false };
  }

  const healthAboveThreshold = currentHealth - threshold;
  const daysRemaining = healthAboveThreshold / degradationRate;
  const hoursRemaining = daysRemaining * 24;

  return {
    hours: Math.round(hoursRemaining * 10) / 10,
    days: Math.round(daysRemaining * 10) / 10,
    cycles: Math.round(daysRemaining),
    percentage: Math.round((currentHealth - threshold) * 100),
    isExpired: false
  };
}

// ============================================================================
// 故障概率计算
// ============================================================================

function calculateFailureProbability(healthIndex, operatingHours, typicalLifeHours) {
  // 基于健康指数和运行时间的故障概率
  const healthFactor = 1 - healthIndex;

  // 运行时间因子 (接近设计寿命时概率增加)
  const lifeUsageRatio = operatingHours / typicalLifeHours;
  const ageFactor = Math.min(1, lifeUsageRatio);

  // 综合故障概率
  const baseProbability = (healthFactor * 0.6 + ageFactor * 0.4);

  // 非线性调整 (接近临界点时概率急剧上升)
  const criticalFactor = healthIndex < 0.3 ? 1.5 : 1;

  return Math.min(0.99, Math.max(0, baseProbability * criticalFactor));
}

// ============================================================================
// 故障模式识别
// ============================================================================

function identifyFailureModes(degradationData, anomalies = []) {
  const possibleModes = [];
  const scores = {};

  // 基于退化数据评估各种故障模式的可能性
  if (degradationData.bearingCondition > 0.3) {
    scores.bearing_wear = degradationData.bearingCondition * 0.8;
  }

  if (degradationData.windingTemp > 0.3) {
    scores.insulation_degradation = degradationData.windingTemp * 0.9;
  }

  if (degradationData.oilQuality < 0.7) {
    scores.lubrication_failure = (1 - degradationData.oilQuality) * 0.8;
  }

  if (degradationData.vibration > 0.4) {
    scores.unbalance = degradationData.vibration * 0.7;
    scores.misalignment = degradationData.vibration * 0.5;
  }

  if (degradationData.current > 0.9) {
    scores.overloading = degradationData.current * 0.8;
  }

  // 基于异常的故障模式
  for (const anomaly of anomalies) {
    if (anomaly.type === 'high-amplitude' || anomaly.type === 'vibration-warning') {
      scores.unbalance = (scores.unbalance || 0) + 0.3;
      scores.bearing_wear = (scores.bearing_wear || 0) + 0.2;
    }
    if (anomaly.type === 'over-temperature') {
      scores.overloading = (scores.overloading || 0) + 0.3;
      scores.lubrication_failure = (scores.lubrication_failure || 0) + 0.2;
    }
  }

  // 排序并返回前3个最可能的故障模式
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [mode, score] of sorted) {
    const modeInfo = FAILURE_MODES[mode] || FAILURE_MODES.bearing_wear;
    possibleModes.push({
      mode,
      confidence: Math.round(score * 100) / 100,
      severity: modeInfo.severity,
      description: modeInfo.description || mode.replace(/_/g, ' ')
    });
  }

  return possibleModes;
}

// ============================================================================
// 最佳维护时机
// ============================================================================

function calculateOptimalMaintenanceWindow(healthIndex, rul, costData = {}) {
  const {
    plannedReplacementCost = 10000,
    emergencyReplacementCost = 25000,
    downtimeCostPerDay = 5000,
    maintenanceCostPerDay = 500
  } = costData;

  const failureProbability = 1 - healthIndex;
  const expectedFailureCost = emergencyReplacementCost + (downtimeCostPerDay * rul.days * failureProbability * 0.5);
  const plannedCost = plannedReplacementCost + maintenanceCostPerDay * 7;

  const benefit = expectedFailureCost - plannedCost;
  const isWorthWaiting = benefit > 0 && rul.days > 7;

  return {
    plannedReplacementNow: Math.round(plannedCost),
    expectedFailureCost: Math.round(expectedFailureCost),
    potentialSavings: Math.round(Math.abs(benefit)),
    recommendedAction: isWorthWaiting ? 'wait' : 'replace_now',
    optimalWindow: isWorthWaiting
      ? `未来${Math.max(1, Math.round(rul.days * 0.8))}天内`
      : '尽快安排'
  };
}

// ============================================================================
// 报废预测 (spoilage)
// ============================================================================

function predictSpoilage(historicalData, currentConditions) {
  if (!historicalData || historicalData.length < 5) {
    return {
      spoilageRisk: 'unknown',
      confidence: 0,
      message: '数据不足，无法准确预测'
    };
  }

  // 计算历史报废率趋势
  const spoilageRates = historicalData.map(d => d.spoilageRate || 0);
  const avgSpoilageRate = spoilageRates.reduce((a, b) => a + b, 0) / spoilageRates.length;

  // 当前条件因子
  let conditionFactor = 1.0;
  if (currentConditions.qualityIndex) {
    conditionFactor *= (1 - currentConditions.qualityIndex * 0.3);
  }
  if (currentConditions.temperatureDeviation) {
    conditionFactor *= (1 + currentConditions.temperatureDeviation * 0.1);
  }

  const predictedSpoilageRate = avgSpoilageRate * conditionFactor;

  let risk = 'low';
  if (predictedSpoilageRate > 0.1) risk = 'medium';
  if (predictedSpoilageRate > 0.2) risk = 'high';
  if (predictedSpoilageRate > 0.3) risk = 'critical';

  return {
    spoilageRisk: risk,
    predictedRate: Math.round(predictedSpoilageRate * 1000) / 1000,
    historicalAverage: Math.round(avgSpoilageRate * 1000) / 1000,
    confidence: Math.min(0.9, historicalData.length / 30),
    recommendations: predictedSpoilageRate > 0.15
      ? ['加强质量检验', '调整生产工艺参数', '检查原材料质量']
      : ['继续当前生产工艺']
  };
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 预测性维护分析
 * @param {Object} input - 输入参数
 * @returns {Object} 预测性维护分析结果
 */
async function predictiveMaintenance(input) {
  const {
    equipmentId,
    equipmentType = 'general',
    operatingHours = 0,
    degradationData = {},
    historicalData = [],
    anomalies = [],
    costData = {},
    includeSpoilagePrediction = false
  } = input;

  // 输入验证
  if (!equipmentId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'equipmentId is required' } };
  }

  try {
    // 获取设备配置
    const config = EQUIPMENT_CONFIGS[equipmentType] || EQUIPMENT_CONFIGS.general;

    // 计算当前健康指数
    const healthIndex = calculateHealthIndex(degradationData, equipmentType);

    // 计算退化率
    const degradationRate = calculateDegradationRate(historicalData);

    // 计算剩余寿命
    const rul = calculateRUL(healthIndex, degradationRate);

    // 计算故障概率
    const failureProbability = calculateFailureProbability(healthIndex, operatingHours, config.typicalLifeHours);

    // 识别可能的故障模式
    const possibleFailureModes = identifyFailureModes(degradationData, anomalies);

    // 健康状态
    const healthStatus = getHealthStatus(healthIndex);

    // 最佳维护窗口
    const maintenanceWindow = calculateOptimalMaintenanceWindow(healthIndex, rul, costData);

    // 计算置信区间
    let uncertaintyFactor = 0.3;
    if (historicalData.length >= 10) uncertaintyFactor -= 0.1;
    if (historicalData.length >= 30) uncertaintyFactor -= 0.05;
    if (degradationData.equipmentAge) uncertaintyFactor -= 0.05;

    const confidenceInterval = {
      lower: Math.max(0, Math.round((rul.hours * (1 - uncertaintyFactor)) * 10) / 10),
      upper: Math.round((rul.hours * (1 + uncertaintyFactor)) * 10) / 10,
      confidence: Math.max(0.5, 1 - uncertaintyFactor)
    };

    // 生成建议
    const recommendations = [];

    if (healthIndex < 0.2 || rul.isExpired) {
      recommendations.push('立即安排设备更换或大修');
      recommendations.push('准备备件和停机计划');
    } else if (healthIndex < 0.4) {
      recommendations.push('30-60天内安排更换');
      recommendations.push('开始采购备件');
    } else if (healthIndex < 0.6) {
      recommendations.push('纳入中期维护计划');
      recommendations.push('增加监测频率');
    } else if (healthIndex < 0.8) {
      recommendations.push('继续监测设备状态趋势');
      recommendations.push('6-12个月内规划更换');
    } else {
      recommendations.push('设备状态良好');
      recommendations.push('按正常计划进行维护');
    }

    // 故障模式特定建议
    for (const mode of possibleFailureModes.slice(0, 2)) {
      if (mode.confidence > 0.5) {
        recommendations.push(`关注${mode.description}风险`);
      }
    }

    // 报废预测 (可选)
    let spoilagePrediction = null;
    if (includeSpoilagePrediction && degradationData.spoilageHistory) {
      spoilagePrediction = predictSpoilage(degradationData.spoilageHistory, degradationData);
    }

    const result = {
      success: true,
      status: 'success',
      timestamp: new Date().toISOString(),
      equipmentId,
      equipmentType,

      // 健康评估
      healthIndex: Math.round(healthIndex * 100) / 100,
      healthStatus: healthStatus.level,
      healthDescription: healthStatus.description,

      // 剩余寿命
      rul: {
        hours: rul.hours,
        days: rul.days,
        cycles: rul.cycles,
        isExpired: rul.isExpired
      },

      // 故障概率
      failureProbability: Math.round(failureProbability * 100) / 100,
      failureRisk: failureProbability > 0.7 ? 'critical' :
                   failureProbability > 0.5 ? 'high' :
                   failureProbability > 0.3 ? 'medium' : 'low',

      // 置信区间
      confidenceInterval,

      // 故障模式
      possibleFailureModes,

      // 维护窗口
      maintenanceWindow,

      // 设备信息
      equipment: {
        typicalLifeHours: config.typicalLifeHours,
        lifeUsedPercent: Math.round((operatingHours / config.typicalLifeHours) * 100),
        criticalComponents: config.criticalComponents,
        failureModes: config.failureModes
      },

      // 建议
      recommendations,

      // 报废预测
      spoilagePrediction
    };

    return result;

  } catch (error) {
    return {
      success: false,
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        code: 'PROCESSING_ERROR',
        message: '预测性维护分析发生错误',
        details: error.message
      }
    };
  }
}

// ============================================================================
// 批量预测
// ============================================================================

/**
 * 批量预测性维护分析
 * @param {Object[]} equipmentList - 设备列表
 * @returns {Object[]} 按优先级排序的分析结果
 */
async function predictiveMaintenanceBatch(equipmentList) {
  if (!Array.isArray(equipmentList)) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'equipmentList must be an array' } };
  }

  const results = await Promise.all(
    equipmentList.map(equipment => predictiveMaintenance(equipment))
  );

  // 按健康指数升序排序 (最危急的排前面)
  results.sort((a, b) => {
    if (a.status === 'error') return 1;
    if (b.status === 'error') return -1;
    return (a.healthIndex || 1) - (b.healthIndex || 1);
  });

  return {
    success: true,
    totalEquipment: equipmentList.length,
    criticalCount: results.filter(r => r.failureRisk === 'critical' || r.failureRisk === 'high').length,
    results
  };
}

module.exports = {
  predictiveMaintenance,
  predictiveMaintenanceBatch,
  calculateHealthIndex,
  calculateDegradationRate,
  calculateRUL,
  calculateFailureProbability,
  identifyFailureModes,
  calculateOptimalMaintenanceWindow,
  predictSpoilage,
  CONFIG,
  EQUIPMENT_CONFIGS
};

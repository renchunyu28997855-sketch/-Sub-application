/**
 * Lubrication Advisory Skill
 * 润滑指导技能 - 根据设备运行状态推荐最佳润滑方案
 *
 * @version 1.0.0
 */

'use strict';

/**
 * 油品数据库
 */
const OIL_DATABASE = {
  bearing: {
    mineral: { grade: 'VG68', viscosity: 68 },
    synthetic: { grade: 'VG100', viscosity: 100 }
  },
  gearbox: {
    mineral: { grade: 'VG220', viscosity: 220 },
    synthetic: { grade: 'VG320', viscosity: 320 }
  },
  hydraulic: {
    mineral: { grade: 'VG46', viscosity: 46 },
    synthetic: { grade: 'VG68', viscosity: 68 }
  },
  compressor: {
    mineral: { grade: 'VG100', viscosity: 100 },
    synthetic: { grade: 'VG150', viscosity: 150 }
  },
  motor: {
    grease: { grade: 'NLGI 2', viscosity: null }
  },
  chain: {
    mineral: { grade: 'VG68', viscosity: 68 },
    synthetic: { grade: 'VG100', viscosity: 100 }
  }
};

/**
 * 基础润滑周期表 (小时)
 */
const BASE_INTERVALS = {
  bearing: 2000,
  gearbox: 4000,
  hydraulic: 1000,
  compressor: 2000,
  motor: 3000,
  chain: 500
};

/**
 * 基础润滑量表
 */
const BASE_OIL_AMOUNTS = {
  bearing: { value: 30, unit: 'ml' },
  gearbox: { value: 200, unit: 'ml' },
  hydraulic: { value: 500, unit: 'ml' },
  compressor: { value: 100, unit: 'ml' },
  motor: { value: 20, unit: 'g' },
  chain: { value: 50, unit: 'ml' }
};

/**
 * 环境调整系数
 */
const ENVIRONMENT_ADJUSTMENTS = {
  'high-temp': { viscosityAdjust: 1, intervalMultiplier: 0.7 },
  'normal': { viscosityAdjust: 0, intervalMultiplier: 1.0 },
  'humid': { viscosityAdjust: 0, intervalMultiplier: 0.85 },
  'corrosive': { viscosityAdjust: 2, intervalMultiplier: 0.6 }
};

/**
 * 负载调整系数
 */
const LOAD_ADJUSTMENTS = {
  'light': 1.2,
  'medium': 1.0,
  'heavy': 0.8,
  'shock': 0.6
};

/**
 * 输入验证
 * @param {Object} input - 输入参数
 * @returns {Object} 验证结果
 */
function validateInput(input) {
  const errors = [];

  if (!input.equipmentType || typeof input.equipmentType !== 'string') {
    errors.push('equipmentType is required and must be a string');
  }

  if (!input.operatingEnvironment || typeof input.operatingEnvironment !== 'string') {
    errors.push('operatingEnvironment is required and must be a string');
  }

  if (typeof input.operatingHours !== 'number' || input.operatingHours < 0) {
    errors.push('operatingHours is required and must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 获取油品建议
 * @param {string} equipmentType - 设备类型
 * @param {string} environment - 运行环境
 * @returns {Object} 油品信息
 */
function getOilRecommendation(equipmentType, environment) {
  const normalizedType = equipmentType.toLowerCase();
  const envConfig = ENVIRONMENT_ADJUSTMENTS[environment] || ENVIRONMENT_ADJUSTMENTS['normal'];

  let oilData = OIL_DATABASE[normalizedType];

  if (!oilData) {
    // 默认使用轴承润滑方案
    oilData = OIL_DATABASE['bearing'];
  }

  // 根据环境决定使用矿物油还是合成油
  const useSynthetic = environment === 'high-temp' || environment === 'corrosive';
  const oilKey = useSynthetic ? 'synthetic' : 'mineral';

  let selectedOil;
  if (normalizedType === 'motor') {
    selectedOil = oilData['grease'];
  } else {
    selectedOil = oilData[oilKey] || oilData['mineral'];
  }

  // 调整粘度等级
  const adjustedViscosity = selectedOil.viscosity
    ? selectedOil.viscosity + envConfig.viscosityAdjust * 10
    : null;

  const grade = adjustedViscosity
    ? `ISO VG ${adjustedViscosity}`
    : selectedOil.grade;

  return {
    oilType: useSynthetic ? '合成润滑油' : '矿物润滑油',
    grade,
    viscosity: adjustedViscosity || selectedOil.viscosity
  };
}

/**
 * 计算润滑周期
 * @param {string} equipmentType - 设备类型
 * @param {string} environment - 运行环境
 * @param {string} loadCondition - 负载条件
 * @param {number} operatingHours - 运行小时数
 * @returns {number} 调整后的润滑周期
 */
function calculateLubricationInterval(equipmentType, environment, loadCondition, operatingHours) {
  const normalizedType = equipmentType.toLowerCase();
  const envConfig = ENVIRONMENT_ADJUSTMENTS[environment] || ENVIRONMENT_ADJUSTMENTS['normal'];
  const loadFactor = LOAD_ADJUSTMENTS[loadCondition] || LOAD_ADJUSTMENTS['medium'];

  let baseInterval = BASE_INTERVALS[normalizedType] || BASE_INTERVALS['bearing'];

  // 环境调整
  let interval = baseInterval * envConfig.intervalMultiplier;

  // 负载调整
  interval *= loadFactor;

  // 运行时间老化调整
  let ageFactor = 1.0;
  if (operatingHours > 20000) {
    ageFactor = 0.6;
  } else if (operatingHours > 10000) {
    ageFactor = 0.8;
  } else if (operatingHours > 5000) {
    ageFactor = 0.9;
  }
  interval *= ageFactor;

  return Math.round(interval);
}

/**
 * 计算下次润滑日期
 * @param {number} interval - 润滑周期(小时)
 * @param {number} dailyOperatingHours - 每日运行小时数, 默认8小时
 * @returns {string} 下次润滑日期
 */
function calculateNextLubricationDate(interval, dailyOperatingHours = 8) {
  const daysUntilNext = Math.ceil(interval / dailyOperatingHours);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysUntilNext);
  return nextDate.toISOString().split('T')[0];
}

/**
 * 生成额外建议
 * @param {Object} params - 参数
 * @returns {string[]} 建议列表
 */
function generateRecommendations(params) {
  const recommendations = [];
  const { environment, loadCondition, operatingHours, temperature } = params;

  if (environment === 'high-temp') {
    recommendations.push('环境温度超过40°C时，建议使用耐高温合成润滑油');
    recommendations.push('缩短润滑周期30%，并增加日常检查频率');
  }

  if (environment === 'humid') {
    recommendations.push('潮湿环境下注意防水密封，定期检查油品含水量');
  }

  if (environment === 'corrosive') {
    recommendations.push('腐蚀性环境下建议使用防腐添加剂的特种润滑油');
    recommendations.push('增加润滑周期检查频率，及时更换受污染油品');
  }

  if (loadCondition === 'heavy' || loadCondition === 'shock') {
    recommendations.push('重载或冲击负载条件下，建议提高油品粘度等级');
  }

  if (operatingHours > 10000) {
    recommendations.push('设备运行时间较长，建议进行油品分析检测');
    recommendations.push('考虑更换更高级别的润滑油以延长设备寿命');
  }

  if (temperature && temperature > 60) {
    recommendations.push('工作温度过高，建议检查设备散热系统');
  }

  return recommendations;
}

/**
 * 主技能函数
 * @param {Object} input - 输入参数
 * @returns {Object} 润滑建议结果
 */
function lubricationAdvisory(input) {
  // 验证输入
  const validation = validateInput(input);
  if (!validation.valid) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: '输入参数验证失败',
        details: validation.errors
      }
    };
  }

  const {
    equipmentType,
    operatingEnvironment,
    operatingHours,
    loadCondition = 'medium',
    temperature
  } = input;

  try {
    // 获取油品建议
    const oilRecommendation = getOilRecommendation(equipmentType, operatingEnvironment);

    // 计算润滑周期
    const adjustedInterval = calculateLubricationInterval(
      equipmentType,
      operatingEnvironment,
      loadCondition,
      operatingHours
    );

    // 获取基础润滑量
    const normalizedType = equipmentType.toLowerCase();
    const oilAmount = BASE_OIL_AMOUNTS[normalizedType] || BASE_OIL_AMOUNTS['bearing'];

    // 负载调整润滑量
    const loadFactor = LOAD_ADJUSTMENTS[loadCondition] || LOAD_ADJUSTMENTS['medium'];
    const adjustedAmount = {
      value: Math.round(oilAmount.value * loadFactor),
      unit: oilAmount.unit
    };

    // 生成建议
    const recommendations = generateRecommendations({
      environment: operatingEnvironment,
      loadCondition,
      operatingHours,
      temperature
    });

    // 计算下次润滑日期
    const nextLubricationDate = calculateNextLubricationDate(adjustedInterval);

    // 计算置信度
    let confidence = 0.85;
    if (operatingHours > 20000) confidence -= 0.15;
    if (operatingEnvironment === 'corrosive') confidence -= 0.1;
    if (!OIL_DATABASE[normalizedType]) confidence -= 0.1;

    return {
      success: true,
      data: {
        recommendedOilType: oilRecommendation.viscosity
          ? `VG${oilRecommendation.viscosity}`
          : oilRecommendation.grade,
        oilGrade: oilRecommendation.grade,
        oilCategory: oilRecommendation.oilType,
        baseInterval: BASE_INTERVALS[normalizedType] || BASE_INTERVALS['bearing'],
        adjustedInterval,
        intervalUnit: 'hours',
        oilAmount: adjustedAmount,
        viscosityRecommendation: `建议使用${oilRecommendation.grade}粘度等级的${oilRecommendation.oilType}`,
        recommendations,
        nextLubricationDate,
        confidence: Math.max(confidence, 0.6)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '润滑方案计算过程中发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  lubricationAdvisory,
  validateInput,
  getOilRecommendation,
  calculateLubricationInterval
};

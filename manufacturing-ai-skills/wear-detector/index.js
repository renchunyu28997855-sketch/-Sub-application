/**
 * Wear Detector - 磨损检测器
 *
 * 合并技能: belt-wear-detection, tool-wear-detection
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 皮带磨损标准
// ============================================================================

const BELT_STANDARDS = {
  V Belt: {
    newThickness: { min: 8, unit: 'mm' },
    wearRate: { normal: 0.5, max: 1.0 },  // mm/年
    replacementThreshold: 0.7,  // 原厚度的70%
    tension: { min: 400, max: 600, unit: 'N' }
  },
  Timing Belt: {
    newThickness: { min: 4, unit: 'mm' },
    wearRate: { normal: 0.3, max: 0.6 },
    replacementThreshold: 0.6,
    toothHeight: { min: 2.5, unit: 'mm' }
  },
  Flat Belt: {
    newThickness: { min: 5, unit: 'mm' },
    wearRate: { normal: 0.4, max: 0.8 },
    replacementThreshold: 0.65
  },
  Serpentine Belt: {
    newThickness: { min: 4, unit: 'mm' },
    wearRate: { normal: 0.35, max: 0.7 },
    replacementThreshold: 0.7
  }
};

// ============================================================================
// 刀具磨损标准
// ============================================================================

const TOOL_STANDARDS = {
  cuttingTool: {
    dullThreshold: 0.15,           // 切削刃磨损量 (mm)
    breakageThreshold: 0.5,         // 崩刃阈值 (mm)
    vibrationIncrease: 15,          // 振动增加百分比
    surfaceRoughnessIncrease: 20   // 表面粗糙度增加百分比
  },
  drill: {
    dullThreshold: 0.2,
    lipWear: { min: 0.3, unit: 'mm' },
    pointAngleDeviation: 5          // 角度偏差 (度)
  },
  endMill: {
    diameterTolerance: 0.02,        // mm
    cornerRadiusMin: 0.1,
    wearRate: { normal: 0.01, max: 0.05 }  // mm/小时
  },
  insert: {
    flankWear: { min: 0.3, unit: 'mm' },
    craterWearDepth: { max: 0.1, unit: 'mm' },
    noseRadiusMin: 0.2
  }
};

// ============================================================================
// 皮带磨损分析
// ============================================================================

function analyzeBeltWear(beltData) {
  const {
    beltType = 'V Belt',
    age = 0,                        // 运行时间 (月)
    currentThickness,
    initialThickness,
    crackDepth,
    tension,
    misalignment,
    temperature
  } = beltData;

  const standards = BELT_STANDARDS[beltType] || BELT_STANDARDS['V Belt'];
  let score = 100;
  const defects = [];
  const recommendations = [];

  // 厚度分析
  if (currentThickness !== undefined) {
    const thicknessRatio = initialThickness
      ? currentThickness / initialThickness
      : currentThickness / standards.newThickness.min;

    if (thicknessRatio <= standards.replacementThreshold) {
      score -= 40;
      defects.push({
        type: 'excessive_wear',
        severity: 'critical',
        description: `皮带厚度${currentThickness}mm低于更换阈值`
      });
      recommendations.push('立即更换皮带');
    } else if (thicknessRatio <= 0.8) {
      score -= 20;
      defects.push({
        type: 'significant_wear',
        severity: 'warning',
        description: `皮带磨损明显，厚度${currentThickness}mm`
      });
      recommendations.push('准备更换皮带，建议本月内更换');
    }

    // 按年龄推算磨损
    if (age > 0 && currentThickness) {
      const calculatedWearRate = (standards.newThickness.min - currentThickness) / (age / 12);
      if (calculatedWearRate > standards.wearRate.max) {
        score -= 15;
        defects.push({
          type: 'high_wear_rate',
          severity: 'warning',
          description: `磨损率${calculatedWearRate.toFixed(2)}mm/年，高于正常值`
        });
        recommendations.push('磨损率异常，检查对中和负载情况');
      }
    }
  }

  // 裂纹检测
  if (crackDepth !== undefined && crackDepth > 0) {
    score -= 30;
    defects.push({
      type: 'cracking',
      severity: 'critical',
      description: `发现裂纹，深度${crackDepth}mm`
    });
    recommendations.push('皮带出现裂纹，立即更换');
  }

  // 张力检测
  if (tension !== undefined) {
    if (tension < standards.tension.min) {
      score -= 15;
      defects.push({
        type: 'low_tension',
        severity: 'warning',
        description: `张力${tension}N过低`
      });
      recommendations.push('调整皮带张力');
    } else if (tension > standards.tension.max) {
      score -= 10;
      defects.push({
        type: 'high_tension',
        severity: 'warning',
        description: `张力${tension}N过高`
      });
      recommendations.push('降低皮带张力，避免过度拉伸');
    }
  }

  // 温度分析
  if (temperature !== undefined) {
    if (temperature > 80) {
      score -= 15;
      defects.push({
        type: 'over_temperature',
        severity: 'warning',
        description: `运行温度${temperature}°C偏高`
      });
      recommendations.push('检查轴承和润滑情况');
    }
  }

  // 计算剩余寿命
  let remainingLife = { months: 0, confidence: 'low' };
  if (currentThickness && age > 0) {
    const wearRate = (standards.newThickness.min - currentThickness) / (age / 12);
    if (wearRate > 0 && wearRate < standards.wearRate.max) {
      const monthsToThreshold = (currentThickness - standards.newThickness.min * standards.replacementThreshold) / wearRate;
      remainingLife = {
        months: Math.max(0, Math.round(monthsToThreshold)),
        confidence: 'medium'
      };
    }
  }

  score = Math.max(0, score);

  return {
    success: true,
    componentType: 'belt',
    beltType,
    healthScore: score,
    healthStatus: score >= 80 ? 'good' : score >= 60 ? 'fair' : score >= 40 ? 'poor' : 'critical',
    defects,
    remainingLife,
    recommendations: recommendations.length > 0
      ? recommendations
      : ['皮带状态正常，继续使用'],
    specifications: standards
  };
}

// ============================================================================
// 刀具磨损分析
// ============================================================================

function analyzeToolWear(toolData) {
  const {
    toolType = 'cuttingTool',
    age = 0,                          // 运行时间 (小时)
    currentDiameter,
    initialDiameter,
    flankWear,
    craterWear,
    vibration,
    initialVibration,
    surfaceRoughness,
    initialSurfaceRoughness,
    chipForm,
    cuttingForce
  } = toolData;

  const standards = TOOL_STANDARDS[toolType] || TOOL_STANDARDS.cuttingTool;
  let score = 100;
  const defects = [];
  const recommendations = [];

  // 刃口磨损分析
  if (flankWear !== undefined) {
    if (flankWear >= standards.dullThreshold) {
      score -= 35;
      defects.push({
        type: 'dull',
        severity: flankWear >= standards.breakageThreshold ? 'critical' : 'warning',
        description: `刃口磨损量${flankWear}mm，已达到更换标准`
      });
      recommendations.push('刀具已变钝，需要更换或修磨');
    } else if (flankWear >= standards.dullThreshold * 0.7) {
      score -= 15;
      defects.push({
        type: 'wear_progress',
        severity: 'warning',
        description: `刃口磨损${flankWear}mm，接近更换阈值`
      });
      recommendations.push('密切关注磨损情况，准备更换刀具');
    }
  }

  // 崩刃检测
  if (craterWear !== undefined && craterWear.depth > (standards.craterWearDepth?.max || 0.1)) {
    score -= 25;
    defects.push({
      type: 'chipping',
      severity: 'critical',
      description: `发现崩刃，深度${craterWear.depth}mm`
    });
    recommendations.push('刀具崩刃，立即更换');
  }

  // 直径磨损分析
  if (currentDiameter !== undefined && initialDiameter !== undefined) {
    const wearAmount = initialDiameter - currentDiameter;
    const wearPercentage = wearAmount / initialDiameter * 100;

    if (wearPercentage > 10) {
      score -= 25;
      defects.push({
        type: 'diameter_wear',
        severity: 'warning',
        description: `直径磨损${wearPercentage.toFixed(1)}%`
      });
      recommendations.push('刀具直径磨损超标，需要更换');
    }
  }

  // 振动分析
  if (vibration !== undefined && initialVibration !== undefined) {
    const vibrationIncrease = (vibration - initialVibration) / initialVibration * 100;

    if (vibrationIncrease > standards.vibrationIncrease) {
      score -= 20;
      defects.push({
        type: 'vibration_increase',
        severity: 'warning',
        description: `振动增加${vibrationIncrease.toFixed(0)}%`
      });
      recommendations.push('振动异常增大，检查刀具安装和磨损情况');
    }
  }

  // 表面质量分析
  if (surfaceRoughness !== undefined && initialSurfaceRoughness !== undefined) {
    const roughnessIncrease = (surfaceRoughness - initialSurfaceRoughness) / initialSurfaceRoughness * 100;

    if (roughnessIncrease > standards.surfaceRoughnessIncrease) {
      score -= 15;
      defects.push({
        type: 'poor_surface',
        severity: 'warning',
        description: `表面粗糙度增加${roughnessIncrease.toFixed(0)}%`
      });
      recommendations.push('加工质量下降，需要更换刀具');
    }
  }

  // 切屑形态分析
  if (chipForm !== undefined) {
    const badChipForms = ['buildup', 'sawtooth', 'powder'];
    if (badChipForms.includes(chipForm)) {
      score -= 10;
      defects.push({
        type: 'abnormal_chip',
        severity: 'attention',
        description: `切屑形态异常: ${chipForm}`
      });
      recommendations.push('切屑形态异常，检查切削参数和刀具状态');
    }
  }

  // 切削力分析
  if (cuttingForce !== undefined) {
    const forceIncreaseThreshold = 20; // 切削力增加20%视为异常
    if (cuttingForce.increase > forceIncreaseThreshold) {
      score -= 15;
      defects.push({
        type: 'force_increase',
        severity: 'warning',
        description: `切削力增加${cuttingForce.increase}%`
      });
      recommendations.push('切削力异常增大，需要检查刀具磨损');
    }
  }

  // 磨损率分析
  if (flankWear !== undefined && age > 0) {
    const wearRate = flankWear / age; // mm/小时

    if (wearRate > (TOOL_STANDARDS.endMill?.wearRate?.max || 0.05)) {
      score -= 10;
      defects.push({
        type: 'high_wear_rate',
        severity: 'attention',
        description: `磨损率${(wearRate * 1000).toFixed(1)}μm/h，高于正常`
      });
      recommendations.push('刀具磨损过快，检查切削参数是否合适');
    }
  }

  // 计算剩余寿命
  let remainingLife = { hours: 0, confidence: 'low' };
  if (flankWear !== undefined && age > 0) {
    const wearRate = flankWear / age;
    if (wearRate > 0) {
      const hoursToThreshold = (standards.dullThreshold - flankWear) / wearRate;
      remainingLife = {
        hours: Math.max(0, Math.round(hoursToThreshold)),
        confidence: flankWear > 0.05 ? 'medium' : 'low'
      };
    }
  }

  score = Math.max(0, score);

  return {
    success: true,
    componentType: 'tool',
    toolType,
    healthScore: score,
    healthStatus: score >= 80 ? 'good' : score >= 60 ? 'fair' : score >= 40 ? 'poor' : 'critical',
    defects,
    remainingLife,
    recommendations: recommendations.length > 0
      ? recommendations
      : ['刀具状态正常'],
    specifications: standards
  };
}

// ============================================================================
// 磨损模式识别
// ============================================================================

function identifyWearPattern(wearData) {
  const { vibration, temperature, noise, debris } = wearData;
  const patterns = [];

  // 正常磨损
  if (vibration < 1.5 && temperature < 70 && debris.level === 'normal') {
    patterns.push({ pattern: 'normal', confidence: 0.9 });
  }

  // 磨粒磨损
  if (debris.level === 'high' && debris.type === 'metallic') {
    patterns.push({ pattern: 'abrasive', confidence: 0.85 });
  }

  // 疲劳磨损
  if (vibration > 2.0 && noise.type === 'pulsating') {
    patterns.push({ pattern: 'fatigue', confidence: 0.75 });
  }

  // 粘着磨损
  if (temperature > 85 && debris.type === 'bonded') {
    patterns.push({ pattern: 'adhesive', confidence: 0.7 });
  }

  // 腐蚀磨损
  if (debris.type === 'oxidized' && temperature > 75) {
    patterns.push({ pattern: 'corrosive', confidence: 0.65 });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 磨损检测
 */
function wearDetector(input) {
  const {
    componentId,
    componentType,  // 'belt' | 'tool'
    componentSubType,
    parameters = {}
  } = input;

  if (!componentId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'componentId is required' } };
  }

  try {
    let result;

    switch (componentType) {
      case 'belt':
        result = analyzeBeltWear({
          beltType: componentSubType,
          ...parameters
        });
        break;

      case 'tool':
        result = analyzeToolWear({
          toolType: componentSubType,
          ...parameters
        });
        break;

      case 'general':
        // 通用磨损检测
        if (parameters.thickness || parameters.initialThickness) {
          result = analyzeBeltWear({ beltType: componentSubType || 'V Belt', ...parameters });
        } else {
          result = analyzeToolWear({ toolType: componentSubType || 'cuttingTool', ...parameters });
        }
        break;

      default:
        return {
          success: false,
          error: { code: 'INVALID_TYPE', message: `Unsupported component type: ${componentType}` }
        };
    }

    // 添加通用信息
    result.componentId = componentId;
    result.timestamp = new Date().toISOString();

    // 磨损模式识别
    if (parameters.vibration || parameters.temperature || parameters.noise || parameters.debris) {
      result.wearPatterns = identifyWearPattern({
        vibration: parameters.vibration,
        temperature: parameters.temperature,
        noise: parameters.noise,
        debris: parameters.debris
      });
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '磨损检测过程发生错误',
        details: error.message
      }
    };
  }
}

/**
 * 批量磨损检测
 */
function wearDetectorBatch(components) {
  const results = components.map(component => wearDetector(component));

  const summary = {
    total: results.length,
    healthy: results.filter(r => r.success && r.healthScore >= 80).length,
    fair: results.filter(r => r.success && r.healthScore >= 60 && r.healthScore < 80).length,
    poor: results.filter(r => r.success && r.healthScore >= 40 && r.healthScore < 60).length,
    critical: results.filter(r => r.success && r.healthScore < 40).length
  };

  return {
    success: true,
    summary,
    results
  };
}

module.exports = {
  wearDetector,
  wearDetectorBatch,
  analyzeBeltWear,
  analyzeToolWear,
  identifyWearPattern,
  BELT_STANDARDS,
  TOOL_STANDARDS
};

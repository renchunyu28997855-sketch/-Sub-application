/**
 * Quality Inspector - 综合质量检测器
 *
 * 合并技能: visual-defect-detection, assembly-quality-check, coating-thickness-detection,
 *          color-difference-detection, contamination-detection, dimension-measurement,
 *          surface-roughness-detection, weld-quality-inspection, packaging-quality-check,
 *          incoming-inspection
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 缺陷类型定义
// ============================================================================

const DEFECT_TYPES = {
  visual: ['scratch', 'dent', 'stain', 'crack', 'deformation', 'missing', '异物', '其他'],
  assembly: ['misalignment', 'loose_fastener', 'missing_part', 'incorrect_part', 'gap', '装配不良'],
  coating: ['thickness_low', 'thickness_high', 'peeling', 'blistering', '涂层厚度不足', '涂层剥落'],
  color: ['color_difference', 'color_shading', 'fading', '色差', '颜色不均'],
  contamination: ['dirt', 'oil', 'rust', 'moisture', '异物', '污染'],
  surface: ['roughness_high', 'scratch', 'dent', '表面粗糙', '划痕'],
  weld: ['porosity', 'crack', 'incomplete_penetration', 'undercut', 'spatter', '焊接缺陷'],
  packaging: ['damage', 'seal_failure', 'label_error', '包装破损', '密封不良']
};

// ============================================================================
// 检测阈值配置
// ============================================================================

const TOLERANCES = {
  dimension: {
    length: { tolerance: 0.1, unit: 'mm' },
    width: { tolerance: 0.1, unit: 'mm' },
    height: { tolerance: 0.05, unit: 'mm' },
    diameter: { tolerance: 0.05, unit: 'mm' },
    thickness: { tolerance: 0.02, unit: 'mm' }
  },
  surface: {
    roughness_Ra: { max: 3.2, unit: 'μm' },
    flatness: { max: 0.05, unit: 'mm' },
    perpendicularity: { max: 0.02, unit: 'mm' }
  },
  coating: {
    thickness_min: { min: 20, unit: 'μm' },
    thickness_max: { max: 50, unit: 'μm' }
  },
  color: {
    delta_E: { max: 2.0, unit: '' },  // CIELAB色差
    lightness_diff: { max: 1.5, unit: '' }
  }
};

// ============================================================================
// 视觉缺陷检测
// ============================================================================

function detectVisualDefects(imageData, threshold = 0.7, defectTypes = DEFECT_TYPES.visual) {
  // 模拟视觉缺陷检测
  const startTime = Date.now();
  const defects = [];

  // 模拟检测结果
  const numDefects = Math.floor(Math.random() * 3);

  for (let i = 0; i < numDefects; i++) {
    const type = defectTypes[Math.floor(Math.random() * defectTypes.length)];
    const confidence = 0.7 + Math.random() * 0.25;

    if (confidence >= threshold) {
      defects.push({
        type,
        confidence: parseFloat(confidence.toFixed(3)),
        location: {
          x: Math.floor(Math.random() * 1920),
          y: Math.floor(Math.random() * 1080),
          width: Math.floor(50 + Math.random() * 200),
          height: Math.floor(50 + Math.random() * 200)
        },
        severity: confidence > 0.85 ? 'high' : confidence > 0.75 ? 'medium' : 'low'
      });
    }
  }

  return {
    success: true,
    hasDefects: defects.length > 0,
    defects,
    totalDefects: defects.length,
    processingTime: Date.now() - startTime,
    metadata: { modelVersion: 'v1.0.0' }
  };
}

// ============================================================================
// 尺寸检测
// ============================================================================

function inspectDimensions(measurements, tolerances = {}) {
  const results = [];
  let allPassed = true;
  let maxDeviation = 0;

  for (const [dimension, value] of Object.entries(measurements)) {
    const tolerance = tolerances[dimension] || tolerances.dimension || { tolerance: 0.1 };
    const spec = tolerance.spec || tolerance;

    let passed = true;
    let deviation = 0;
    let status = 'pass';

    if (spec.nominal !== undefined) {
      deviation = value - spec.nominal;
      maxDeviation = Math.max(maxDeviation, Math.abs(deviation));

      if (deviation < -(spec.tolerance || 0.1)) {
        passed = false;
        status = 'below_min';
        allPassed = false;
      } else if (deviation > (spec.tolerance || 0.1)) {
        passed = false;
        status = 'above_max';
        allPassed = false;
      }
    }

    results.push({
      dimension,
      value,
      nominal: spec.nominal,
      tolerance: spec.tolerance,
      deviation: Math.round(deviation * 1000) / 1000,
      status,
      passed
    });
  }

  return {
    success: true,
    allPassed,
    maxDeviation: Math.round(maxDeviation * 1000) / 1000,
    dimensions: results,
    overallStatus: allPassed ? 'pass' : 'fail'
  };
}

// ============================================================================
// 表面粗糙度检测
// ============================================================================

function inspectSurfaceRoughness(roughnessData, maxRa = 3.2) {
  const { Ra, Rz, Rq } = roughnessData;
  const results = [];

  // Ra (算术平均粗糙度)
  if (Ra !== undefined) {
    const passed = Ra <= maxRa;
    results.push({
      parameter: 'Ra',
      value: Ra,
      limit: maxRa,
      unit: 'μm',
      passed,
      status: passed ? 'pass' : 'fail'
    });
  }

  // Rz (最大峰谷高度)
  if (Rz !== undefined) {
    const limit = maxRa * 8;  // 通常 Rz ≈ 8 * Ra
    const passed = Rz <= limit;
    results.push({
      parameter: 'Rz',
      value: Rz,
      limit,
      unit: 'μm',
      passed,
      status: passed ? 'pass' : 'fail'
    });
  }

  // Rq (均方根粗糙度)
  if (Rq !== undefined) {
    const limit = maxRa * 1.1;
    const passed = Rq <= limit;
    results.push({
      parameter: 'Rq',
      value: Rq,
      limit,
      unit: 'μm',
      passed,
      status: passed ? 'pass' : 'fail'
    });
  }

  const allPassed = results.every(r => r.passed);

  return {
    success: true,
    allPassed,
    overallStatus: allPassed ? 'pass' : 'fail',
    parameters: results
  };
}

// ============================================================================
// 涂层厚度检测
// ============================================================================

function inspectCoatingThickness(thickness, minThickness = 20, maxThickness = 50) {
  const passed = thickness >= minThickness && thickness <= maxThickness;
  let status = 'pass';
  let message = '';

  if (thickness < minThickness) {
    status = 'too_thin';
    message = `涂层厚度${thickness}μm低于最小要求${minThickness}μm`;
  } else if (thickness > maxThickness) {
    status = 'too_thick';
    message = `涂层厚度${thickness}μm超过最大允许${maxThickness}μm`;
  } else {
    message = `涂层厚度${thickness}μm在正常范围内`;
  }

  return {
    success: true,
    passed,
    status,
    thickness,
    limits: { min: minThickness, max: maxThickness },
    message
  };
}

// ============================================================================
// 颜色差异检测
// ============================================================================

function inspectColorDifference(colorData, maxDeltaE = 2.0) {
  const { L, a, b, L_ref, a_ref, b_ref } = colorData;

  // 计算 CIELAB 色差
  const deltaL = L - L_ref;
  const deltaA = a - a_ref;
  const deltaB = b - b_ref;
  const deltaE = Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);

  const passed = deltaE <= maxDeltaE;
  const lightnessPassed = Math.abs(deltaL) <= 1.5;

  return {
    success: true,
    passed: passed && lightnessPassed,
    status: passed && lightnessPassed ? 'pass' : 'fail',
    colorDifference: {
      deltaE: Math.round(deltaE * 100) / 100,
      deltaL: Math.round(deltaL * 100) / 100,
      deltaA: Math.round(deltaA * 100) / 100,
      deltaB: Math.round(deltaB * 100) / 100
    },
    limits: {
      deltaE_max: maxDeltaE,
      deltaL_max: 1.5
    },
    details: {
      sample: { L, a, b },
      reference: { L: L_ref, a: a_ref, b: b_ref }
    }
  };
}

// ============================================================================
// 污染检测
// ============================================================================

function detectContamination(contaminationLevel, threshold = 0.3) {
  const level = typeof contaminationLevel === 'number'
    ? contaminationLevel
    : contaminationLevel.level || 0;

  const passed = level <= threshold;
  const severity = level > 0.7 ? 'high' : level > 0.4 ? 'medium' : 'low';

  return {
    success: true,
    passed,
    status: passed ? 'clean' : 'contaminated',
    contaminationLevel: level,
    threshold,
    severity,
    message: passed
      ? '产品清洁，无明显污染'
      : `检测到污染，等级${severity}，建议清洁处理`
  };
}

// ============================================================================
// 焊接质量检测
// ============================================================================

function inspectWeldQuality(weldData) {
  const { porosity, cracks, incompletePenetration, undercut, spatter, visualDefects } = weldData;
  const defects = [];

  // 孔隙率检测
  if (porosity !== undefined) {
    const passed = porosity <= 0.05;  // 5%最大孔隙率
    defects.push({
      type: 'porosity',
      value: porosity,
      limit: 0.05,
      unit: '%',
      passed,
      severity: passed ? 'low' : 'high'
    });
  }

  // 裂纹检测
  if (cracks !== undefined) {
    const passed = !cracks;
    defects.push({
      type: 'crack',
      value: cracks ? 'detected' : 'none',
      limit: 'none',
      passed,
      severity: 'critical'
    });
  }

  // 未熔透检测
  if (incompletePenetration !== undefined) {
    const passed = !incompletePenetration;
    defects.push({
      type: 'incomplete_penetration',
      value: incompletePenetration ? 'detected' : 'none',
      limit: 'none',
      passed,
      severity: 'high'
    });
  }

  // 咬边检测
  if (undercut !== undefined) {
    const passed = !undercut;
    defects.push({
      type: 'undercut',
      value: undercut ? 'detected' : 'none',
      limit: 'none',
      passed,
      severity: 'medium'
    });
  }

  const allPassed = defects.every(d => d.passed);

  return {
    success: true,
    allPassed,
    overallStatus: allPassed ? 'pass' : 'fail',
    defects,
    qualityGrade: allPassed ? 'A' : defects.some(d => d.severity === 'critical') ? 'C' : 'B',
    recommendations: allPassed
      ? ['焊接质量良好']
      : defects.filter(d => !d.passed).map(d => `处理${d.type}问题`)
  };
}

// ============================================================================
// 装配质量检测
// ============================================================================

function inspectAssemblyQuality(assemblyData) {
  const { misalignment, looseFasteners, missingParts, incorrectParts, gaps } = assemblyData;
  const defects = [];

  if (misalignment !== undefined) {
    const passed = Math.abs(misalignment) <= 0.5;
    defects.push({
      type: 'misalignment',
      value: misalignment,
      limit: 0.5,
      unit: 'mm',
      passed,
      severity: passed ? 'low' : 'medium'
    });
  }

  if (looseFasteners !== undefined) {
    const passed = looseFasteners === 0;
    defects.push({
      type: 'loose_fastener',
      value: looseFasteners,
      limit: 0,
      passed,
      severity: looseFasteners > 2 ? 'high' : 'medium'
    });
  }

  if (missingParts !== undefined) {
    const passed = missingParts === 0;
    defects.push({
      type: 'missing_part',
      value: missingParts,
      limit: 0,
      passed,
      severity: 'critical'
    });
  }

  if (gaps !== undefined) {
    const passed = gaps <= 0.2;
    defects.push({
      type: 'gap',
      value: gaps,
      limit: 0.2,
      unit: 'mm',
      passed,
      severity: passed ? 'low' : 'medium'
    });
  }

  const allPassed = defects.every(d => d.passed);

  return {
    success: true,
    allPassed,
    overallStatus: allPassed ? 'pass' : 'fail',
    defects,
    qualityScore: allPassed ? 100 : Math.max(0, 100 - defects.filter(d => !d.passed).length * 20)
  };
}

// ============================================================================
// 包装质量检测
// ============================================================================

function inspectPackagingQuality(packagingData) {
  const { damage, sealIntegrity, labelAccuracy, completeness } = packagingData;
  const defects = [];

  if (damage !== undefined) {
    const passed = damage === 'none' || damage === 0;
    defects.push({
      type: 'damage',
      value: damage,
      passed,
      severity: 'medium'
    });
  }

  if (sealIntegrity !== undefined) {
    const passed = sealIntegrity >= 0.95;
    defects.push({
      type: 'seal_failure',
      value: sealIntegrity,
      limit: 0.95,
      passed,
      severity: 'high'
    });
  }

  if (labelAccuracy !== undefined) {
    const passed = labelAccuracy === 'correct';
    defects.push({
      type: 'label_error',
      value: labelAccuracy,
      passed,
      severity: 'low'
    });
  }

  const allPassed = defects.every(d => d.passed);

  return {
    success: true,
    allPassed,
    overallStatus: allPassed ? 'pass' : 'fail',
    defects,
    recommendations: allPassed
      ? ['包装质量合格']
      : ['检查包装材料和工艺']
  };
}

// ============================================================================
// 来料检验
// ============================================================================

function inspectIncomingMaterial(materialData) {
  const { supplier, batchId, quantity, qualityCert, condition, tests } = materialData;
  const results = [];
  let passed = true;

  // 数量验收
  if (quantity !== undefined) {
    const qtyPassed = quantity.received === quantity.ordered;
    results.push({
      item: 'quantity',
      status: qtyPassed ? 'pass' : 'fail',
      details: `${quantity.received}/${quantity.ordered}`
    });
    if (!qtyPassed) passed = false;
  }

  // 质量证书
  if (qualityCert !== undefined) {
    const certPassed = qualityCert.valid && !qualityCert.expired;
    results.push({
      item: 'quality_certificate',
      status: certPassed ? 'pass' : 'fail',
      details: certPassed ? '证书有效' : '证书无效或过期'
    });
    if (!certPassed) passed = false;
  }

  // 外观检验
  if (condition !== undefined) {
    const condPassed = condition === 'good' || condition >= 0.8;
    results.push({
      item: 'condition',
      status: condPassed ? 'pass' : 'fail',
      details: condition
    });
    if (!condPassed) passed = false;
  }

  // 测试结果
  if (tests !== undefined && Array.isArray(tests)) {
    for (const test of tests) {
      const testPassed = test.passed;
      results.push({
        item: test.name,
        status: testPassed ? 'pass' : 'fail',
        details: test.details || ''
      });
      if (!testPassed) passed = false;
    }
  }

  return {
    success: true,
    overallPassed: passed,
    supplier,
    batchId,
    results,
    recommendations: passed
      ? ['材料符合要求，可以入库']
      : ['发现不合格项，需要处理']
  };
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合质量检测
 * @param {Object} input - 输入参数
 * @returns {Object} 质量检测结果
 */
async function qualityInspector(input) {
  const {
    inspectionType = 'general',
    productId,
    productType,
    parameters = {},
    threshold = 0.7
  } = input;

  if (!productId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'productId is required' } };
  }

  const startTime = Date.now();

  try {
    let result = {
      success: true,
      productId,
      productType,
      inspectionType,
      timestamp: new Date().toISOString(),
      processingTime: 0
    };

    switch (inspectionType) {
      case 'visual-defect':
      case 'visual_defect':
        // 视觉缺陷检测
        result.inspection = detectVisualDefects(parameters.image, threshold, DEFECT_TYPES.visual);
        break;

      case 'dimension':
      case 'dimensions':
        // 尺寸检测
        result.inspection = inspectDimensions(parameters.measurements, parameters.tolerances);
        break;

      case 'surface-roughness':
      case 'surface':
        // 表面粗糙度检测
        result.inspection = inspectSurfaceRoughness(parameters.roughnessData, TOLERANCES.surface.roughness_Ra.max);
        break;

      case 'coating-thickness':
      case 'coating':
        // 涂层厚度检测
        result.inspection = inspectCoatingThickness(
          parameters.thickness,
          TOLERANCES.coating.thickness_min.min,
          TOLERANCES.coating.thickness_max.max
        );
        break;

      case 'color-difference':
      case 'color':
        // 颜色差异检测
        result.inspection = inspectColorDifference(parameters.colorData, TOLERANCES.color.delta_E.max);
        break;

      case 'contamination':
        // 污染检测
        result.inspection = detectContamination(parameters.contaminationLevel, parameters.threshold || 0.3);
        break;

      case 'weld-quality':
      case 'weld':
        // 焊接质量检测
        result.inspection = inspectWeldQuality(parameters.weldData);
        break;

      case 'assembly':
      case 'assembly-quality':
        // 装配质量检测
        result.inspection = inspectAssemblyQuality(parameters.assemblyData);
        break;

      case 'packaging':
      case 'packaging-quality':
        // 包装质量检测
        result.inspection = inspectPackagingQuality(parameters.packagingData);
        break;

      case 'incoming':
      case 'incoming-inspection':
        // 来料检验
        result.inspection = inspectIncomingMaterial(parameters.materialData);
        break;

      case 'comprehensive':
        // 综合检测
        const inspections = [];

        if (parameters.image) {
          inspections.push({ type: 'visual', result: detectVisualDefects(parameters.image, threshold, DEFECT_TYPES.visual) });
        }
        if (parameters.measurements) {
          inspections.push({ type: 'dimension', result: inspectDimensions(parameters.measurements, parameters.tolerances) });
        }
        if (parameters.roughnessData) {
          inspections.push({ type: 'surface', result: inspectSurfaceRoughness(parameters.roughnessData, TOLERANCES.surface.roughness_Ra.max) });
        }
        if (parameters.thickness !== undefined) {
          inspections.push({ type: 'coating', result: inspectCoatingThickness(parameters.thickness, TOLERANCES.coating.thickness_min.min, TOLERANCES.coating.thickness_max.max) });
        }
        if (parameters.colorData) {
          inspections.push({ type: 'color', result: inspectColorDifference(parameters.colorData, TOLERANCES.color.delta_E.max) });
        }

        // 综合判定
        const allPassed = inspections.every(i => i.result.allPassed !== false && i.result.passed !== false);
        result.inspection = {
          allPassed,
          overallStatus: allPassed ? 'pass' : 'fail',
          inspections,
          summary: inspections.map(i => ({ type: i.type, status: i.result.allPassed !== false && i.result.passed !== false ? 'pass' : 'fail' }))
        };
        break;

      default:
        return {
          success: false,
          error: {
            code: 'INVALID_TYPE',
            message: `Unsupported inspection type: ${inspectionType}`
          }
        };
    }

    result.processingTime = Date.now() - startTime;
    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '质量检测过程发生错误',
        details: error.message
      }
    };
  }
}

/**
 * 批量质量检测
 */
async function qualityInspectorBatch(inspections) {
  const results = await Promise.all(
    inspections.map(insp => qualityInspector(insp))
  );

  const summary = {
    total: results.length,
    passed: results.filter(r => r.success && (r.inspection?.allPassed || r.inspection?.passed || r.inspection?.overallPassed)).length,
    failed: results.filter(r => !r.success || (r.inspection && !r.inspection.allPassed && !r.inspection.passed && !r.inspection.overallPassed)).length
  };

  return {
    success: true,
    summary,
    results
  };
}

module.exports = {
  qualityInspector,
  qualityInspectorBatch,
  detectVisualDefects,
  inspectDimensions,
  inspectSurfaceRoughness,
  inspectCoatingThickness,
  inspectColorDifference,
  detectContamination,
  inspectWeldQuality,
  inspectAssemblyQuality,
  inspectPackagingQuality,
  inspectIncomingMaterial,
  DEFECT_TYPES,
  TOLERANCES
};

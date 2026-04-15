/**
 * Material Manager - 物料管理器
 *
 * 合并技能: material-replenishment, material-substitution, material-traceability
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 物料配置
// ============================================================================

const MATERIAL_CONFIG = {
  defaultLeadTime: 7,           // 默认交货期 (天)
  defaultSafetyStockDays: 7,    // 默认安全库存天数
  defaultOrderQuantity: 100,   // 默认订单数量
  spoilageRate: 0.02,          // 默认报废率
  freshnessThreshold: 30        // 新鲜度阈值 (天)
};

// ============================================================================
// 物料补货计划 ( Material Replenishment )
// ============================================================================

function calculateReplenishment(materialData, inventoryData, demandForecast) {
  const {
    materialId,
    currentStock = 0,
    reorderPoint = 0,
    orderQuantity = MATERIAL_CONFIG.defaultOrderQuantity,
    leadTime = MATERIAL_CONFIG.defaultLeadTime,
    safetyStockDays = MATERIAL_CONFIG.defaultSafetyStockDays
  } = inventoryData;

  // 计算日均需求
  const avgDailyDemand = calculateAvgDailyDemand(demandForecast);
  const safetyStock = avgDailyDemand * safetyStockDays;

  // 计算再订货点
  const calculatedReorderPoint = avgDailyDemand * leadTime + safetyStock;

  // 判断是否需要补货
  const needsReplenishment = currentStock <= (reorderPoint || calculatedReorderPoint);

  // 计算建议补货量
  let suggestedQuantity = orderQuantity;
  if (needsReplenishment) {
    // 考虑未来需求
    const futureDemand = avgDailyDemand * (leadTime + safetyStockDays);
    suggestedQuantity = Math.max(orderQuantity, futureDemand - currentStock);
  }

  // 计算下次补货时间
  const daysUntilReorder = currentStock > 0 ? currentStock / avgDailyDemand : 0;

  return {
    materialId,
    currentStock: Math.round(currentStock * 100) / 100,
    avgDailyDemand: Math.round(avgDailyDemand * 100) / 100,
    safetyStock: Math.round(safetyStock * 100) / 100,
    reorderPoint: Math.round((reorderPoint || calculatedReorderPoint) * 100) / 100,
    needsReplenishment,
    suggestedQuantity: Math.ceil(suggestedQuantity),
    daysUntilReorder: Math.round(daysUntilReorder * 10) / 10,
    estimatedDeliveryDate: needsReplenishment
      ? new Date(Date.now() + leadTime * 24 * 60 * 60 * 1000).toISOString()
      : null,
    orderStatus: needsReplenishment ? 'ready_to_order' : 'monitoring'
  };
}

function calculateAvgDailyDemand(demandForecast) {
  if (!demandForecast || demandForecast.length === 0) return MATERIAL_CONFIG.defaultOrderQuantity;

  const totalDemand = demandForecast.reduce((sum, d) => sum + (d.quantity || 0), 0);
  const daysSpan = demandForecast.length;

  return totalDemand / daysSpan;
}

function generateReplenishmentSchedule(inventoryItems, demandForecasts, productionSchedule) {
  const schedule = [];

  for (const item of inventoryItems) {
    const forecast = demandForecasts.filter(f => f.materialId === item.materialId);
    const replenishment = calculateReplenishment(item.materialId, item, forecast);

    schedule.push({
      ...replenishment,
      priority: calculateReplenishmentPriority(replenishment),
      scheduledDate: replenishment.needsReplenishment
        ? new Date().toISOString().split('T')[0]
        : null
    });
  }

  // 按优先级排序
  schedule.sort((a, b) => b.priority - a.priority);

  return {
    success: true,
    schedule,
    summary: {
      totalItems: inventoryItems.length,
      needsReplenishment: schedule.filter(s => s.needsReplenishment).length,
      totalOrderValue: schedule.reduce((sum, s) => sum + (s.suggestedQuantity || 0) * (s.unitCost || 0), 0)
    }
  };
}

function calculateReplenishmentPriority(replenishment) {
  let priority = 50;

  // 紧急程度
  if (replenishment.daysUntilReorder <= 3) priority += 30;
  else if (replenishment.daysUntilReorder <= 7) priority += 20;
  else if (replenishment.daysUntilReorder <= 14) priority += 10;

  // 库存水平
  if (replenishment.currentStock <= replenishment.safetyStock) priority += 20;

  return Math.min(100, priority);
}

// ============================================================================
// 物料替代分析 ( Material Substitution )
// ============================================================================

function analyzeMaterialSubstitution(materialId, availableMaterials, constraints = {}) {
  const targetMaterial = availableMaterials.find(m => m.materialId === materialId);

  if (!targetMaterial) {
    return {
      success: false,
      error: { code: 'MATERIAL_NOT_FOUND', message: `Material ${materialId} not found` }
    };
  }

  const substitutes = [];

  for (const material of availableMaterials) {
    if (material.materialId === materialId) continue;

    const compatibility = calculateSubstitutionCompatibility(targetMaterial, material, constraints);

    if (compatibility.score > 30) {
      substitutes.push({
        materialId: material.materialId,
        materialName: material.name,
        compatibility: compatibility.score,
        compatibilityLevel: compatibility.level,
        differences: compatibility.differences,
        conversionNotes: generateConversionNotes(targetMaterial, material, compatibility),
        risks: identifySubstitutionRisks(targetMaterial, material, compatibility)
      });
    }
  }

  // 按兼容性排序
  substitutes.sort((a, b) => b.compatibility - a.compatibility);

  return {
    success: true,
    targetMaterial: {
      materialId: targetMaterial.materialId,
      name: targetMaterial.name,
      specifications: targetMaterial.specifications
    },
    substitutes,
    recommendations: generateSubstitutionRecommendations(substitutes)
  };
}

function calculateSubstitutionCompatibility(source, target, constraints) {
  const sourceSpec = source.specifications || {};
  const targetSpec = target.specifications || {};

  let totalScore = 100;
  const differences = [];

  // 检查化学成分
  if (sourceSpec.composition && targetSpec.composition) {
    const compDiff = calculateCompositionDifference(sourceSpec.composition, targetSpec.composition);
    if (compDiff > 5) {
      totalScore -= 30;
      differences.push({ property: 'composition', difference: compDiff, severity: 'high' });
    } else if (compDiff > 0) {
      totalScore -= 15;
      differences.push({ property: 'composition', difference: compDiff, severity: 'low' });
    }
  }

  // 检查机械性能
  if (sourceSpec.strength && targetSpec.strength) {
    const strengthRatio = targetSpec.strength / sourceSpec.strength;
    if (strengthRatio < 0.9 || strengthRatio > 1.1) {
      totalScore -= 25;
      differences.push({ property: 'strength', difference: `${((strengthRatio - 1) * 100).toFixed(1)}%`, severity: 'medium' });
    }
  }

  // 检查尺寸规格
  if (sourceSpec.dimensions && targetSpec.dimensions) {
    const dimDiff = calculateDimensionDifference(sourceSpec.dimensions, targetSpec.dimensions);
    if (dimDiff > 0.1) {
      totalScore -= 20;
      differences.push({ property: 'dimensions', difference: dimDiff, severity: 'medium' });
    }
  }

  // 检查成本
  if (sourceSpec.unitCost && targetSpec.unitCost) {
    const costDiff = (targetSpec.unitCost - sourceSpec.unitCost) / sourceSpec.unitCost * 100;
    if (costDiff < -10) {
      differences.push({ property: 'cost', difference: `${costDiff.toFixed(1)}% cheaper`, severity: 'positive' });
    } else if (costDiff > 20) {
      differences.push({ property: 'cost', difference: `+${costDiff.toFixed(1)}% more expensive`, severity: 'warning' });
    }
  }

  // 兼容性等级
  let level = 'excellent';
  if (totalScore >= 90) level = 'excellent';
  else if (totalScore >= 70) level = 'good';
  else if (totalScore >= 50) level = 'acceptable';
  else if (totalScore >= 30) level = 'poor';
  else level = 'incompatible';

  return {
    score: Math.max(0, totalScore),
    level,
    differences
  };
}

function calculateCompositionDifference(comp1, comp2) {
  let diff = 0;
  for (const element of Object.keys(comp1)) {
    const v1 = comp1[element] || 0;
    const v2 = comp2[element] || 0;
    diff += Math.abs(v1 - v2);
  }
  return diff;
}

function calculateDimensionDifference(dim1, dim2) {
  let maxDiff = 0;
  for (const key of Object.keys(dim1)) {
    const d = Math.abs((dim1[key] || 0) - (dim2[key] || 0));
    maxDiff = Math.max(maxDiff, d);
  }
  return maxDiff;
}

function generateConversionNotes(source, target, compatibility) {
  const notes = [];

  if (compatibility.level === 'excellent' || compatibility.level === 'good') {
    notes.push('可直接替代使用');
  } else if (compatibility.level === 'acceptable') {
    notes.push('替代时需进行工艺参数调整');
    for (const diff of compatibility.differences) {
      if (diff.property === 'strength') notes.push(`注意强度差异: ${diff.difference}`);
    }
  } else {
    notes.push('不建议替代，如必须使用请先进行测试验证');
  }

  return notes;
}

function identifySubstitutionRisks(source, target, compatibility) {
  const risks = [];

  for (const diff of compatibility.differences) {
    if (diff.severity === 'high' || diff.severity === 'medium') {
      risks.push({
        risk: `${diff.property}差异可能导致产品质量问题`,
        mitigation: getRiskMitigation(diff.property)
      });
    }
  }

  return risks;
}

function getRiskMitigation(property) {
  const mitigations = {
    composition: '进行材料成分分析验证',
    strength: '进行机械性能测试',
    dimensions: '检查配合公差',
    cost: '重新评估成本效益'
  };
  return mitigations[property] || '进行充分测试验证';
}

function generateSubstitutionRecommendations(substitutes) {
  const recommendations = [];

  if (substitutes.length === 0) {
    recommendations.push({ priority: 'high', text: '未找到合适的替代材料，建议联系供应商' });
  } else {
    const best = substitutes[0];
    if (best.compatibilityLevel === 'excellent' || best.compatibilityLevel === 'good') {
      recommendations.push({
        priority: 'medium',
        text: `推荐使用${best.materialName}，兼容性评分${best.compatibility}`
      });
    } else {
      recommendations.push({
        priority: 'high',
        text: '替代材料存在差异，建议进行小批量试产验证'
      });
    }
  }

  return recommendations;
}

// ============================================================================
// 物料追溯 ( Material Traceability )
// ============================================================================

function trackMaterialTraceability(batchId, traceabilityData) {
  const {
    supplierInfo = {},
    productionRecords = [],
    qualityTests = [],
    shippingRecords = []
  } = traceabilityData;

  // 查找该批次的所有记录
  const records = {
    supplier: supplierInfo[batchId] || null,
    incoming: productionRecords.filter(r => r.batchId === batchId),
    quality: qualityTests.filter(t => t.batchId === batchId),
    shipping: shippingRecords.filter(s => s.batchId === batchId || s.materials?.includes(batchId))
  };

  // 生成追溯链
  const traceChain = generateTraceChain(records);

  // 计算完整性得分
  const completeness = calculateTraceCompleteness(records);

  return {
    success: true,
    batchId,
    traceChain,
    completeness,
    issues: identifyTraceabilityIssues(records),
    recommendations: generateTraceRecommendations(records)
  };
}

function generateTraceChain(records) {
  const chain = [];

  // 供应商信息
  if (records.supplier) {
    chain.push({
      stage: 'supplier',
      timestamp: records.supplier.deliveryDate,
      description: `来自 ${records.supplier.supplierName} 的原材料`,
      details: {
        supplierId: records.supplier.supplierId,
        lotNumber: records.supplier.lotNumber,
        certificate: records.supplier.certificateNumber
      }
    });
  }

  // 入料检验
  for (const record of records.incoming) {
    chain.push({
      stage: 'incoming_inspection',
      timestamp: record.inspectionDate,
      description: '入料检验',
      details: {
        inspector: record.inspector,
        result: record.result,
        notes: record.notes
      }
    });
  }

  // 质量测试
  for (const test of records.quality) {
    chain.push({
      stage: 'quality_test',
      timestamp: test.testDate,
      description: `质量测试 - ${test.testType}`,
      details: {
        testResult: test.result,
        parameters: test.parameters,
        passed: test.passed
      }
    });
  }

  // 出货记录
  for (const ship of records.shipping) {
    chain.push({
      stage: 'shipping',
      timestamp: ship.shipDate,
      description: '产品出货',
      details: {
        destination: ship.destination,
        quantity: ship.quantity,
        orderId: ship.orderId
      }
    });
  }

  return chain;
}

function calculateTraceCompleteness(records) {
  let score = 0;
  let maxScore = 4;

  if (records.supplier) score++;
  if (records.incoming.length > 0) score++;
  if (records.quality.length > 0) score++;
  if (records.shipping.length > 0) score++;

  return {
    score,
    maxScore,
    percentage: Math.round(score / maxScore * 100),
    level: score >= 4 ? 'complete' : score >= 2 ? 'partial' : 'minimal'
  };
}

function identifyTraceabilityIssues(records) {
  const issues = [];

  if (!records.supplier) {
    issues.push({ type: 'missing_supplier', severity: 'high', description: '缺少供应商信息' });
  }

  if (records.incoming.length === 0) {
    issues.push({ type: 'missing_incoming', severity: 'medium', description: '缺少入料检验记录' });
  }

  if (records.quality.length === 0) {
    issues.push({ type: 'missing_quality', severity: 'medium', description: '缺少质量测试记录' });
  }

  if (records.shipping.length === 0) {
    issues.push({ type: 'missing_shipping', severity: 'low', description: '尚无出货记录' });
  }

  return issues;
}

function generateTraceRecommendations(records) {
  const recommendations = [];

  if (!records.supplier) {
    recommendations.push({ priority: 'high', action: '完善供应商信息档案' });
  }

  if (records.incoming.length === 0) {
    recommendations.push({ priority: 'medium', action: '建立入料检验记录系统' });
  }

  if (records.completeness?.percentage < 100) {
    recommendations.push({ priority: 'low', action: '完善追溯记录以满足法规要求' });
  }

  return recommendations;
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合物料管理
 */
async function materialManager(input) {
  const {
    facilityId,
    action = 'replenishment',  // 'replenishment' | 'substitution' | 'traceability'
    materialId,
    inventoryData = {},
    demandForecast = [],
    availableMaterials = [],
    traceabilityData = {},
    constraints = {}
  } = input;

  if (!facilityId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'facilityId is required' } };
  }

  try {
    let result = {
      success: true,
      facilityId,
      action,
      materialId,
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'replenishment':
        result.replenishment = calculateReplenishment(materialId, inventoryData, demandForecast);
        break;

      case 'replenishment_schedule':
        result.schedule = generateReplenishmentSchedule(inventoryData.items || [inventoryData], demandForecast, []);
        break;

      case 'substitution':
        result.substitution = analyzeMaterialSubstitution(materialId, availableMaterials, constraints);
        break;

      case 'traceability':
        result.traceability = trackMaterialTraceability(materialId, traceabilityData);
        break;

      default:
        return {
          success: false,
          error: { code: 'INVALID_ACTION', message: `Unsupported action: ${action}` }
        };
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '物料管理过程发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  materialManager,
  calculateReplenishment,
  generateReplenishmentSchedule,
  analyzeMaterialSubstitution,
  trackMaterialTraceability,
  MATERIAL_CONFIG
};

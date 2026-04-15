/**
 * Production Planner - 生产规划器
 *
 * 合并技能: capacity-planning, bottleneck-identification, procurement-optimization
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 生产配置
// ============================================================================

const PLANNING_CONFIG = {
  defaultUtilizationTarget: 0.85,
  overtimeMaxPercentage: 0.2,
  safetyCapacity: 0.1,
  planningHorizonMonths: 3
};

// ============================================================================
// 产能规划 ( Capacity Planning )
// ============================================================================

function analyzeCapacityPlanning(demandForecast, currentCapacity, resources) {
  const { lines = [], workers = [], equipment = [] } = resources;

  // 计算当前总产能
  const totalCurrentCapacity = calculateTotalCapacity(lines);
  const totalWorkerCapacity = calculateWorkerCapacity(workers);
  const totalEquipmentCapacity = calculateEquipmentCapacity(equipment);

  // 取最小值作为瓶颈产能
  const limitingCapacity = Math.min(totalCurrentCapacity, totalWorkerCapacity, totalEquipmentCapacity);

  // 分析未来需求
  const demandAnalysis = analyzeDemandTrend(demandForecast);

  // 计算产能差距
  const capacityGap = demandAnalysis.peakDemand - limitingCapacity;

  // 产能扩展方案
  const expansionOptions = generateExpansionOptions(capacityGap, resources);

  // 投资回报分析
  const roiAnalysis = calculateExpansionROI(expansionOptions, demandAnalysis);

  return {
    success: true,
    currentCapacity: {
      production: Math.round(totalCurrentCapacity),
      labor: Math.round(totalWorkerCapacity),
      equipment: Math.round(totalEquipmentCapacity),
      limitingFactor: identifyLimitingFactor(totalCurrentCapacity, totalWorkerCapacity, totalEquipmentCapacity),
      utilization: calculateCurrentUtilization(demandForecast, limitingCapacity)
    },
    demandAnalysis,
    capacityGap: Math.round(capacityGap),
    expansionOptions,
    roiAnalysis,
    recommendations: generateCapacityRecommendations(capacityGap, expansionOptions, demandAnalysis)
  };
}

function calculateTotalCapacity(lines) {
  return lines.reduce((sum, line) => {
    const capacity = line.capacity || 0;
    const utilization = line.targetUtilization || PLANNING_CONFIG.defaultUtilizationTarget;
    const workingHours = (line.workingHours || 8) * (line.workingDays || 22);
    return sum + capacity * utilization * workingHours;
  }, 0);
}

function calculateWorkerCapacity(workers) {
  return workers.reduce((sum, w) => {
    const hours = w.workingHours || 8;
    const days = w.workingDays || 22;
    const workers = w.count || 1;
    return sum + w.capacityPerHour * hours * days * workers;
  }, 0);
}

function calculateEquipmentCapacity(equipment) {
  return equipment.reduce((sum, e) => {
    const capacity = e.capacity || 0;
    const utilization = e.targetUtilization || PLANNING_CONFIG.defaultUtilizationTarget;
    const hours = e.operatingHours || 8;
    const days = e.operatingDays || 22;
    return sum + capacity * utilization * hours * days;
  }, 0);
}

function identifyLimitingFactor(production, labor, equipment) {
  const min = Math.min(production, labor, equipment);
  if (min === production) return 'production_line';
  if (min === labor) return 'labor';
  return 'equipment';
}

function calculateCurrentUtilization(demandForecast, capacity) {
  const totalDemand = demandForecast.reduce((sum, d) => sum + (d.demand || 0), 0);
  return Math.round(totalDemand / capacity * 100);
}

function analyzeDemandTrend(demandForecast) {
  if (!demandForecast || demandForecast.length === 0) {
    return { trend: 'stable', avgDemand: 0, peakDemand: 0, seasonalPattern: null };
  }

  const demands = demandForecast.map(d => d.demand || 0);
  const avgDemand = demands.reduce((a, b) => a + b, 0) / demands.length;
  const peakDemand = Math.max(...demands);
  const minDemand = Math.min(...demands);

  // 计算趋势
  let trend = 'stable';
  if (demands.length >= 3) {
    const recentAvg = demands.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlierAvg = demands.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, demands.length);
    if (recentAvg > earlierAvg * 1.1) trend = 'increasing';
    else if (recentAvg < earlierAvg * 0.9) trend = 'decreasing';
  }

  // 识别季节性
  const seasonal = detectSeasonalPattern(demandForecast);

  return {
    avgDemand: Math.round(avgDemand),
    peakDemand: Math.round(peakDemand),
    minDemand: Math.round(minDemand),
    trend,
    seasonalPattern: seasonal
  };
}

function detectSeasonalPattern(demandForecast) {
  if (demandForecast.length < 6) return null;

  // 简化的季节性检测
  const monthlyAvg = {};
  for (const item of demandForecast) {
    const month = new Date(item.month).getMonth();
    if (!monthlyAvg[month]) monthlyAvg[month] = [];
    monthlyAvg[month].push(item.demand);
  }

  const seasonalIndex = {};
  const overallAvg = demandForecast.reduce((sum, d) => sum + (d.demand || 0), 0) / demandForecast.length;

  for (const [month, values] of Object.entries(monthlyAvg)) {
    seasonalIndex[month] = values.reduce((a, b) => a + b, 0) / values.length / overallAvg;
  }

  return { index: seasonalIndex, peakMonth: Object.entries(seasonalIndex).sort((a, b) => b[1] - a[1])[0]?.[0] };
}

function generateExpansionOptions(capacityGap, resources) {
  const options = [];

  if (capacityGap <= 0) return options;

  // 选项1: 增加产线
  options.push({
    type: 'add_production_line',
    description: '增加生产线',
    additionalCapacity: capacityGap * 1.2,
    investment: capacityGap * 5000,
    timeline: 12,
    pros: ['产能提升大', '灵活性高'],
    cons: ['投资大', '需要空间']
  });

  // 选项2: 增加班次
  options.push({
    type: 'add_shifts',
    description: '增加生产班次',
    additionalCapacity: capacityGap * 0.5,
    investment: capacityGap * 2000,
    timeline: 1,
    pros: ['投资小', '见效快'],
    cons: ['人工成本增加', '员工负担加重']
  });

  // 选项3: 增加设备
  options.push({
    type: 'upgrade_equipment',
    description: '升级设备提高效率',
    additionalCapacity: capacityGap * 0.8,
    investment: capacityGap * 3000,
    timeline: 6,
    pros: ['效率提升', '质量改善'],
    cons: ['需要培训', '停产影响']
  });

  // 选项4: 外包
  options.push({
    type: 'outsourcing',
    description: '部分产能外包',
    additionalCapacity: capacityGap,
    investment: 0,
    timeline: 1,
    pros: ['无投资', '快速响应'],
    cons: ['质量控制难', '失去部分控制权']
  });

  return options;
}

function calculateExpansionROI(options, demandAnalysis) {
  return options.map(option => {
    const annualBenefit = demandAnalysis.avgDemand * 12 * 10; // 假设每单位10元利润
    const annualCost = option.investment / option.timeline;
    const roi = option.investment > 0 ? ((annualBenefit - annualCost) / option.investment * 100) : Infinity;
    const paybackMonths = option.investment > 0 ? (option.investment / (annualBenefit / 12)) : 0;

    return {
      type: option.type,
      investment: option.investment,
      annualBenefit: Math.round(annualBenefit),
      roi: Math.round(roi * 100) / 100,
      paybackMonths: Math.round(paybackMonths)
    };
  });
}

function generateCapacityRecommendations(capacityGap, expansionOptions, demandAnalysis) {
  const recommendations = [];

  if (capacityGap <= 0) {
    recommendations.push({ priority: 'low', text: '当前产能充足，可以优化现有资源利用率' });
  } else {
    recommendations.push({ priority: 'high', text: `存在${Math.round(capacityGap)}单位产能缺口，需要扩展` });

    // 推荐最佳方案
    const bestRoi = expansionOptions.sort((a, b) => b.roi - a.roi)[0];
    if (bestRoi) {
      recommendations.push({
        priority: 'medium',
        text: `建议: ${bestRoi.type === 'add_shifts' ? '增加班次' : bestRoi.type === 'outsourcing' ? '考虑外包' : '增加产线'}，投资回报率${bestRoi.roi}%`
      });
    }
  }

  if (demandAnalysis.trend === 'increasing') {
    recommendations.push({ priority: 'medium', text: '需求呈上升趋势，建议提前规划产能扩展' });
  }

  return recommendations;
}

// ============================================================================
// 瓶颈识别 ( Bottleneck Identification )
// ============================================================================

function identifyBottlenecks(productionSystem, metrics) {
  const { stations = [], buffers = [], qualityDefects = [] } = productionSystem;

  // 分析各工序产能
  const stationAnalysis = analyzeStationCapacities(stations, metrics);

  // 找出最低产能工序
  const bottleneck = findBottleneckStation(stationAnalysis);

  // 分析缓冲库存
  const bufferAnalysis = analyzeBuffers(buffers);

  // 计算整体产能
  const systemCapacity = calculateSystemCapacity(stationAnalysis);

  // 识别质量问题导致的瓶颈
  const qualityBottlenecks = analyzeQualityBottlenecks(qualityDefects, stationAnalysis);

  // 生成改善建议
  const improvementSuggestions = generateBottleneckImprovements(bottleneck, bufferAnalysis, qualityBottlenecks);

  return {
    success: true,
    systemCapacity: Math.round(systemCapacity),
    bottleneck: {
      stationId: bottleneck.stationId,
      name: bottleneck.name,
      capacity: bottleneck.capacity,
      utilization: bottleneck.utilization,
      constraintType: bottleneck.constraintType
    },
    stationAnalysis,
    bufferAnalysis,
    qualityBottlenecks,
    improvementSuggestions
  };
}

function analyzeStationCapacities(stations, metrics) {
  return stations.map(station => {
    const stationMetrics = metrics?.filter(m => m.stationId === station.stationId) || [];
    const cycleTime = station.cycleTime || 60;
    const availability = calculateStationAvailability(stationMetrics);

    const capacity = (60 / cycleTime) * availability * (station.workers || 1) * 8 * 60; // 每班8小时

    return {
      stationId: station.stationId,
      name: station.name,
      cycleTime,
      capacity: Math.round(capacity),
      utilization: calculateUtilization(stationMetrics, capacity),
      availability: Math.round(availability * 100),
      defectRate: calculateDefectRate(stationMetrics)
    };
  });
}

function calculateStationAvailability(metrics) {
  if (metrics.length === 0) return 0.9;

  const plannedTime = metrics.reduce((sum, m) => sum + (m.plannedTime || 480), 0);
  const downtime = metrics.reduce((sum, m) => sum + (m.downtime || 0), 0);

  return plannedTime > 0 ? (plannedTime - downtime) / plannedTime : 0.9;
}

function calculateUtilization(metrics, capacity) {
  if (metrics.length === 0) return 0;

  const totalOutput = metrics.reduce((sum, m) => sum + (m.output || 0), 0);
  return capacity > 0 ? Math.round(totalOutput / capacity * 100) : 0;
}

function calculateDefectRate(metrics) {
  if (metrics.length === 0) return 0;

  const totalOutput = metrics.reduce((sum, m) => sum + (m.output || 0), 0);
  const defects = metrics.reduce((sum, m) => sum + (m.defects || 0), 0);

  return totalOutput > 0 ? Math.round(defects / totalOutput * 10000) / 100 : 0;
}

function findBottleneckStation(stationAnalysis) {
  const bottleneck = stationAnalysis.reduce((min, s) =>
    s.utilization > min.utilization ? s : min
  , stationAnalysis[0] || { utilization: 0 });

  let constraintType = 'capacity';
  if (bottleneck.availability < 0.85) constraintType = 'availability';
  else if (bottleneck.defectRate > 2) constraintType = 'quality';

  return { ...bottleneck, constraintType };
}

function analyzeBuffers(buffers) {
  return buffers.map(buffer => {
    const avgLevel = buffer.avgLevel || 0;
    const maxLevel = buffer.maxLevel || 100;
    const utilization = maxLevel > 0 ? avgLevel / maxLevel : 0;

    let status = 'normal';
    if (utilization > 0.9) status = 'high';
    if (utilization < 0.2) status = 'low';

    return {
      bufferId: buffer.bufferId,
      name: buffer.name,
      avgLevel,
      utilization: Math.round(utilization * 100),
      status
    };
  });
}

function calculateSystemCapacity(stationAnalysis) {
  return Math.min(...stationAnalysis.map(s => s.capacity));
}

function analyzeQualityBottlenecks(qualityDefects, stationAnalysis) {
  const qualityIssues = [];

  for (const defect of qualityDefects || []) {
    const station = stationAnalysis.find(s => s.stationId === defect.stationId);
    if (station && defect.impact === 'bottleneck') {
      qualityIssues.push({
        stationId: defect.stationId,
        defectType: defect.type,
        impact: defect.impact,
        reduction: defect.reduction || 0
      });
    }
  }

  return qualityIssues;
}

function generateBottleneckImprovements(bottleneck, bufferAnalysis, qualityBottlenecks) {
  const suggestions = [];

  // 产能瓶颈建议
  if (bottleneck.constraintType === 'capacity') {
    suggestions.push({
      area: bottleneck.name,
      priority: 'high',
      type: 'capacity',
      suggestion: '增加该工序产能，建议增加设备或操作人员',
      impact: '提升系统整体产能15-20%'
    });
  }

  // 设备可用性建议
  if (bottleneck.constraintType === 'availability') {
    suggestions.push({
      area: bottleneck.name,
      priority: 'high',
      type: 'maintenance',
      suggestion: '加强设备维护，提高设备可用性',
      impact: '减少停机时间，提升产能'
    });
  }

  // 质量问题建议
  if (bottleneck.constraintType === 'quality' || qualityBottlenecks.length > 0) {
    suggestions.push({
      area: bottleneck.name,
      priority: 'medium',
      type: 'quality',
      suggestion: '分析质量缺陷根本原因，改善工艺',
      impact: '减少不良品，提升良率'
    });
  }

  // 库存缓冲建议
  const highBuffer = bufferAnalysis.find(b => b.status === 'high');
  if (highBuffer) {
    suggestions.push({
      area: highBuffer.name,
      priority: 'low',
      type: 'buffer',
      suggestion: '检查该缓冲前后工序平衡',
      impact: '减少在制品库存'
    });
  }

  return suggestions;
}

// ============================================================================
// 采购优化 ( Procurement Optimization )
// ============================================================================

function optimizeProcurement(purchaseOrders, suppliers, inventoryData) {
  const {
    consolidateOrders = true,
    preferReliableSuppliers = true,
    minimizeCost = true
  } = {};

  // 分析现有订单
  const orderAnalysis = analyzePurchaseOrders(purchaseOrders);

  // 供应商分配优化
  const supplierAllocation = optimizeSupplierAllocation(purchaseOrders, suppliers, {
    preferReliableSuppliers
  });

  // 采购合并优化
  const consolidation = consolidatePurchaseOrders(purchaseOrders, suppliers);

  // 计算成本优化
  const costOptimization = calculateProcurementCost(purchaseOrders, suppliers, consolidation);

  return {
    success: true,
    orderAnalysis,
    supplierAllocation,
    consolidation,
    costOptimization,
    recommendations: generateProcurementRecommendations(orderAnalysis, consolidation, costOptimization)
  };
}

function analyzePurchaseOrders(orders) {
  return {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, o) => sum + (o.value || 0), 0),
    totalQuantity: orders.reduce((sum, o) => sum + (o.quantity || 0), 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.value || 0), 0) / orders.length : 0,
    byCategory: categorizeOrders(orders)
  };
}

function categorizeOrders(orders) {
  const categories = {};
  for (const order of orders) {
    const cat = order.category || 'general';
    if (!categories[cat]) categories[cat] = { count: 0, value: 0 };
    categories[cat].count++;
    categories[cat].value += order.value || 0;
  }
  return categories;
}

function optimizeSupplierAllocation(orders, suppliers, constraints) {
  const { preferReliableSuppliers = true } = constraints;

  const allocation = {};
  const supplierScores = {};

  for (const supplier of suppliers) {
    supplierScores[supplier.supplierId] = calculateSupplierScore(supplier);
  }

  for (const order of orders) {
    let bestSupplier = null;
    let bestScore = -Infinity;

    for (const supplier of suppliers) {
      if (supplier.category !== order.category && supplier.category !== 'general') continue;

      const score = supplierScores[supplier.supplierId];
      if (score > bestScore) {
        bestScore = score;
        bestSupplier = supplier;
      }
    }

    if (bestSupplier) {
      if (!allocation[bestSupplier.supplierId]) {
        allocation[bestSupplier.supplierId] = { supplier: bestSupplier, orders: [], totalValue: 0 };
      }
      allocation[bestSupplier.supplierId].orders.push(order);
      allocation[bestSupplier.supplierId].totalValue += order.value || 0;
    }
  }

  return allocation;
}

function calculateSupplierScore(supplier) {
  let score = 50;

  // 可靠性分数
  if (supplier.performance?.deliveryRate > 95) score += 30;
  else if (supplier.performance?.deliveryRate > 90) score += 20;
  else score -= 10;

  // 价格分数
  if (supplier.priceIndex < 0.9) score += 20;
  else if (supplier.priceIndex < 1.0) score += 10;

  return score;
}

function consolidatePurchaseOrders(orders, suppliers) {
  // 按供应商和类别分组订单
  const consolidationGroups = {};

  for (const order of orders) {
    const supplierId = order.supplierId || 'default';
    const category = order.category || 'general';
    const key = `${supplierId}-${category}`;

    if (!consolidationGroups[key]) {
      consolidationGroups[key] = {
        supplierId: supplierId,
        category,
        orders: [],
        totalQuantity: 0,
        totalValue: 0
      };
    }

    consolidationGroups[key].orders.push(order);
    consolidationGroups[key].totalQuantity += order.quantity || 0;
    consolidationGroups[key].totalValue += order.value || 0;
  }

  // 计算合并节省
  const consolidated = Object.values(consolidationGroups);
  let originalOrderCount = orders.length;
  let newOrderCount = consolidated.length;

  return {
    groups: consolidated,
    originalOrderCount,
    newOrderCount,
    orderReduction: originalOrderCount - newOrderCount,
    estimatedSavings: calculateConsolidationSavings(consolidated)
  };
}

function calculateConsolidationSavings(consolidated) {
  let savings = 0;

  for (const group of consolidated) {
    // 假设每单固定成本100元，减少订单数可节省
    const orderSavings = (group.orders.length - 1) * 100;
    // 批量采购折扣 (假设5%)
    const volumeDiscount = group.totalValue * 0.05;

    savings += orderSavings + volumeDiscount;
  }

  return Math.round(savings);
}

function calculateProcurementCost(orders, suppliers, consolidation) {
  const originalCost = orders.reduce((sum, o) => sum + (o.value || 0), 0);
  const consolidatedCost = consolidation.groups.reduce((sum, g) => {
    const avgPrice = g.orders.length > 0 ? g.totalValue / g.totalQuantity : 0;
    return sum + avgPrice * g.totalQuantity * 0.95; // 5%批量折扣
  }, 0);

  return {
    originalCost: Math.round(originalCost),
    optimizedCost: Math.round(consolidatedCost),
    savings: Math.round(originalCost - consolidatedCost),
    savingsPercentage: Math.round((1 - consolidatedCost / originalCost) * 100)
  };
}

function generateProcurementRecommendations(orderAnalysis, consolidation, costOptimization) {
  const recommendations = [];

  if (consolidation.orderReduction > 0) {
    recommendations.push({
      priority: 'high',
      area: 'consolidation',
      action: `合并订单从${consolidation.originalOrderCount}减少到${consolidation.newOrderCount}`,
      saving: `${consolidation.estimatedSavings}元`
    });
  }

  if (costOptimization.savingsPercentage > 3) {
    recommendations.push({
      priority: 'medium',
      area: 'cost',
      action: '通过采购优化预计节省采购成本',
      saving: `${costOptimization.savingsPercentage}%`
    });
  }

  return recommendations;
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合生产规划
 */
async function productionPlanner(input) {
  const {
    facilityId,
    planningType = 'comprehensive',  // 'capacity' | 'bottleneck' | 'procurement' | 'comprehensive'
    demandForecast = [],
    currentCapacity = {},
    resources = {},
    productionSystem = {},
    purchaseOrders = [],
    suppliers = [],
    inventoryData = {}
  } = input;

  if (!facilityId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'facilityId is required' } };
  }

  try {
    let result = {
      success: true,
      facilityId,
      planningType,
      timestamp: new Date().toISOString()
    };

    switch (planningType) {
      case 'capacity':
        result.planning = analyzeCapacityPlanning(demandForecast, currentCapacity, resources);
        break;

      case 'bottleneck':
        result.bottleneck = identifyBottlenecks(productionSystem, resources.metrics);
        break;

      case 'procurement':
        result.procurement = optimizeProcurement(purchaseOrders, suppliers, inventoryData);
        break;

      case 'comprehensive':
        const capacity = analyzeCapacityPlanning(demandForecast, currentCapacity, resources);
        const bottleneck = productionSystem.stations ? identifyBottlenecks(productionSystem, resources.metrics || []) : null;
        const procurement = purchaseOrders.length > 0 ? optimizeProcurement(purchaseOrders, suppliers, inventoryData) : null;

        result.planning = {
          capacity,
          bottleneck,
          procurement,
          integratedRecommendations: [
            ...(capacity?.recommendations || []),
            ...(bottleneck?.improvementSuggestions || []),
            ...(procurement?.recommendations || [])
          ]
        };
        break;

      default:
        return {
          success: false,
          error: { code: 'INVALID_TYPE', message: `Unsupported planning type: ${planningType}` }
        };
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '生产规划过程发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  productionPlanner,
  analyzeCapacityPlanning,
  identifyBottlenecks,
  optimizeProcurement,
  PLANNING_CONFIG
};

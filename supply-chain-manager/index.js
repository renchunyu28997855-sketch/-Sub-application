/**
 * Supply Chain Manager - 供应链管理器
 *
 * 合并技能: supplier-performance-evaluation, order-priority-ranking, multi-plant-coordination
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 供应商绩效评估 ( Supplier Performance Evaluation )
// ============================================================================

function evaluateSupplierPerformance(supplierData, performanceMetrics) {
  const {
    supplierId,
    supplierName,
    category,
    history = []
  } = supplierData;

  const metrics = calculateSupplierMetrics(supplierData, performanceMetrics);
  const grades = assignSupplierGrades(metrics);
  const risks = identifySupplierRisks(supplierData, metrics);
  const recommendations = generateSupplierRecommendations(metrics, grades);

  return {
    success: true,
    supplier: { supplierId, supplierName, category },
    evaluationPeriod: {
      start: performanceMetrics.startDate,
      end: performanceMetrics.endDate
    },
    metrics,
    grades,
    overallScore: grades.overall,
    risks,
    recommendations,
    benchmark: compareWithIndustryAverage(metrics)
  };
}

function calculateSupplierMetrics(supplierData, performanceMetrics) {
  const { deliveries = [], qualityTests = [], responses = [] } = performanceMetrics;

  // 交付率计算
  const totalOrders = deliveries.length;
  const onTimeDeliveries = deliveries.filter(d => d.onTime).length;
  const deliveryRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders * 100) : 0;

  // 质量合格率
  const totalQualityTests = qualityTests.length;
  const passedTests = qualityTests.filter(t => t.result === 'pass' || t.passed).length;
  const qualityRate = totalQualityTests > 0 ? (passedTests / totalQualityTests * 100) : 0;

  // 响应时间
  const avgResponseTime = responses.length > 0
    ? responses.reduce((sum, r) => sum + (r.responseTime || 0), 0) / responses.length
    : 0;

  // 价格竞争力 (相对市场平均)
  const priceCompetitiveness = supplierData.priceIndex || 1.0;

  return {
    delivery: {
      rate: Math.round(deliveryRate * 100) / 100,
      onTime: onTimeDeliveries,
      total: totalOrders,
      avgDelay: calculateAvgDelay(deliveries)
    },
    quality: {
      rate: Math.round(qualityRate * 100) / 100,
      passed: passedTests,
      total: totalQualityTests
    },
    responsiveness: {
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      score: calculateResponsivenessScore(avgResponseTime)
    },
    cost: {
      priceIndex: priceCompetitiveness,
      competitiveness: calculateCostCompetitiveness(priceCompetitiveness)
    }
  };
}

function calculateAvgDelay(deliveries) {
  const delayed = deliveries.filter(d => !d.onTime);
  if (delayed.length === 0) return 0;

  const totalDelay = delayed.reduce((sum, d) => sum + (d.delayDays || 0), 0);
  return Math.round(totalDelay / delayed.length * 100) / 100;
}

function calculateResponsivenessScore(avgResponseTime) {
  if (avgResponseTime <= 2) return 100;
  if (avgResponseTime <= 4) return 90;
  if (avgResponseTime <= 8) return 80;
  if (avgResponseTime <= 24) return 70;
  if (avgResponseTime <= 48) return 60;
  return 50;
}

function calculateCostCompetitiveness(priceIndex) {
  if (priceIndex <= 0.9) return 'excellent';
  if (priceIndex <= 1.0) return 'good';
  if (priceIndex <= 1.1) return 'fair';
  return 'poor';
}

function assignSupplierGrades(metrics) {
  const deliveryScore = metrics.delivery.rate >= 95 ? 100
    : metrics.delivery.rate >= 90 ? 80
    : metrics.delivery.rate >= 85 ? 70
    : 60;

  const qualityScore = metrics.quality.rate >= 99 ? 100
    : metrics.quality.rate >= 95 ? 80
    : metrics.quality.rate >= 90 ? 70
    : 60;

  const responseScore = metrics.responsiveness.score;

  const overall = Math.round((deliveryScore * 0.4 + qualityScore * 0.4 + responseScore * 0.2));

  let grade = 'D';
  if (overall >= 90) grade = 'A';
  else if (overall >= 80) grade = 'B';
  else if (overall >= 70) grade = 'C';

  return {
    delivery: { score: deliveryScore, grade: deliveryScore >= 90 ? 'A' : deliveryScore >= 80 ? 'B' : 'C' },
    quality: { score: qualityScore, grade: qualityScore >= 90 ? 'A' : qualityScore >= 80 ? 'B' : 'C' },
    responsiveness: { score: responseScore, grade: responseScore >= 90 ? 'A' : responseScore >= 80 ? 'B' : 'C' },
    overall,
    grade
  };
}

function identifySupplierRisks(supplierData, metrics) {
  const risks = [];

  // 交付风险
  if (metrics.delivery.rate < 90) {
    risks.push({
      category: 'delivery',
      level: metrics.delivery.rate < 80 ? 'high' : 'medium',
      description: `交付率偏低: ${metrics.delivery.rate}%`,
      mitigation: '增加安全库存或寻找替代供应商'
    });
  }

  // 质量风险
  if (metrics.quality.rate < 95) {
    risks.push({
      category: 'quality',
      level: metrics.quality.rate < 90 ? 'high' : 'medium',
      description: `质量合格率偏低: ${metrics.quality.rate}%`,
      mitigation: '加强来料检验，要求供应商改善'
    });
  }

  // 单一来源风险
  if (supplierData.singleSource) {
    risks.push({
      category: 'supply',
      level: 'high',
      description: '单一供应源，供应链脆弱',
      mitigation: '开发第二供应商'
    });
  }

  // 财务风险
  if (supplierData.financialRisk) {
    risks.push({
      category: 'financial',
      level: 'medium',
      description: '供应商财务状况存疑',
      mitigation: '评估供应商财务稳定性'
    });
  }

  return risks;
}

function generateSupplierRecommendations(metrics, grades) {
  const recommendations = [];

  if (grades.delivery.score < 90) {
    recommendations.push({
      priority: 'high',
      area: 'delivery',
      action: '与供应商沟通改善交付准时率',
      target: '提升至95%以上'
    });
  }

  if (grades.quality.score < 90) {
    recommendations.push({
      priority: 'high',
      area: 'quality',
      action: '加强来料检验，增加抽检比例',
      target: '提升至99%以上'
    });
  }

  if (grades.responsiveness.score < 80) {
    recommendations.push({
      priority: 'medium',
      area: 'responsiveness',
      action: '与供应商建立更紧密的沟通机制',
      target: '响应时间控制在24小时内'
    });
  }

  return recommendations;
}

function compareWithIndustryAverage(metrics) {
  const industryAvg = {
    deliveryRate: 92,
    qualityRate: 96,
    responseTime: 8
  };

  return {
    deliveryVsAvg: metrics.delivery.rate - industryAvg.deliveryRate,
    qualityVsAvg: metrics.quality.rate - industryAvg.qualityRate,
    responseVsAvg: industryAvg.responseTime - metrics.responsiveness.avgResponseTime,
    overallVsAvg: 'average'
  };
}

// ============================================================================
// 订单优先级排序 ( Order Priority Ranking )
// ============================================================================

function rankOrderPriorities(orders, criteria = {}) {
  const {
    weights = { urgency: 0.4, value: 0.3, customer: 0.2, operational: 0.1 }
  } = criteria;

  const rankedOrders = orders.map(order => {
    const scores = calculateOrderScores(order, criteria);
    const weightedScore = calculateWeightedScore(scores, weights);

    return {
      ...order,
      scores,
      weightedScore: Math.round(weightedScore * 100) / 100,
      priority: assignPriorityLevel(weightedScore)
    };
  });

  // 按加权分数排序
  rankedOrders.sort((a, b) => b.weightedScore - a.weightedScore);

  return {
    success: true,
    rankedOrders,
    summary: {
      total: orders.length,
      urgent: rankedOrders.filter(o => o.priority === 'urgent').length,
      high: rankedOrders.filter(o => o.priority === 'high').length,
      medium: rankedOrders.filter(o => o.priority === 'medium').length,
      low: rankedOrders.filter(o => o.priority === 'low').length
    }
  };
}

function calculateOrderScores(order, criteria) {
  // 紧急度分数
  let urgencyScore = 50;
  if (order.deadline) {
    const daysUntilDeadline = calculateDaysUntil(order.deadline);
    if (daysUntilDeadline <= 1) urgencyScore = 100;
    else if (daysUntilDeadline <= 3) urgencyScore = 85;
    else if (daysUntilDeadline <= 7) urgencyScore = 70;
    else if (daysUntilDeadline <= 14) urgencyScore = 55;
    else urgencyScore = 40;
  }

  // 价值分数
  let valueScore = 50;
  if (order.value) {
    if (order.value > 100000) valueScore = 100;
    else if (order.value > 50000) valueScore = 85;
    else if (order.value > 10000) valueScore = 70;
    else if (order.value > 5000) valueScore = 55;
    else valueScore = 40;
  }

  // 客户分数
  let customerScore = 50;
  switch (order.customerLevel) {
    case 'vip': customerScore = 100; break;
    case 'important': customerScore = 80; break;
    case 'regular': customerScore = 60; break;
    case 'new': customerScore = 70; break;
  }

  // 运营影响分数
  let operationalScore = 50;
  if (order.operationalImpact) {
    if (order.operationalImpact === 'critical') operationalScore = 100;
    else if (order.operationalImpact === 'high') operationalScore = 80;
    else if (order.operationalImpact === 'medium') operationalScore = 60;
    else operationalScore = 40;
  }

  return { urgency: urgencyScore, value: valueScore, customer: customerScore, operational: operationalScore };
}

function calculateDaysUntil(deadline) {
  if (!deadline) return Infinity;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
}

function calculateWeightedScore(scores, weights) {
  return (
    scores.urgency * (weights.urgency || 0.4) +
    scores.value * (weights.value || 0.3) +
    scores.customer * (weights.customer || 0.2) +
    scores.operational * (weights.operational || 0.1)
  );
}

function assignPriorityLevel(score) {
  if (score >= 85) return 'urgent';
  if (score >= 70) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

// ============================================================================
// 多工厂协调 ( Multi-Plant Coordination )
// ============================================================================

function coordinateMultiPlant(plants, productionPlan, constraints = {}) {
  const {
    balanceLoad = true,
    minimizeTransportation = true,
    respectCapabilities = true
  } = constraints;

  // 分析各工厂能力
  const plantCapabilities = analyzePlantCapabilities(plants);

  // 负载分配
  const loadAllocation = allocateProductionLoad(plants, productionPlan, plantCapabilities, constraints);

  // 运输优化
  const transportation = optimizeTransportation(plants, loadAllocation, constraints);

  // 生成协调计划
  const coordinationPlan = generateCoordinationPlan(plants, loadAllocation, transportation);

  return {
    success: true,
    plants: plants.map(p => ({
      plantId: p.plantId,
      name: p.name,
      allocatedLoad: loadAllocation[p.plantId] || 0,
      utilization: calculatePlantUtilization(p, loadAllocation[p.plantId])
    })),
    loadAllocation,
    transportation,
    coordinationPlan,
    summary: calculateCoordinationSummary(plants, loadAllocation, transportation)
  };
}

function analyzePlantCapabilities(plants) {
  return plants.map(plant => ({
    plantId: plant.plantId,
    name: plant.name,
    capacity: plant.capacity || 1000,
    capabilities: plant.capabilities || ['general'],
    location: plant.location,
    operatingCost: plant.operatingCost || 100,
    utilization: 0
  }));
}

function allocateProductionLoad(plants, productionPlan, plantCapabilities, constraints) {
  const allocation = {};
  const { respectCapabilities = true } = constraints;

  for (const order of productionPlan) {
    const requiredCapability = order.requiredCapability || 'general';

    // 找到最合适的工厂
    let bestPlant = null;
    let bestScore = -Infinity;

    for (const plant of plants) {
      const plantCap = plantCapabilities.find(p => p.plantId === plant.plantId);
      if (!plantCap) continue;

      // 检查能力匹配
      if (respectCapabilities && !plantCap.capabilities.includes(requiredCapability)) {
        continue;
      }

      // 计算匹配分数
      const utilization = (allocation[plant.plantId] || 0) / plantCap.capacity;
      const score = 100 - utilization * 50; // 负载越低分数越高

      if (score > bestScore) {
        bestScore = score;
        bestPlant = plant;
      }
    }

    // 分配订单
    if (bestPlant) {
      allocation[bestPlant.plantId] = (allocation[bestPlant.plantId] || 0) + (order.quantity || 1);
    }
  }

  return allocation;
}

function calculatePlantUtilization(plant, allocatedLoad) {
  const capacity = plant.capacity || 1000;
  return allocatedLoad ? Math.round(allocatedLoad / capacity * 100) : 0;
}

function optimizeTransportation(plants, loadAllocation, constraints) {
  const { minimizeTransportation = true } = constraints;

  if (!minimizeTransportation) return { totalCost: 0, routes: [] };

  // 简化的运输成本计算
  const routes = [];
  let totalCost = 0;

  for (const plant of plants) {
    const load = loadAllocation[plant.plantId] || 0;
    if (load > 0 && plant.location) {
      const distance = plant.location.distance || 100; // km
      const costPerUnit = plant.location.costPerKm || 0.5;
      const cost = load * distance * costPerUnit;

      routes.push({
        plantId: plant.plantId,
        destination: plant.location.destination || 'distribution-center',
        quantity: load,
        distance,
        cost: Math.round(cost)
      });

      totalCost += cost;
    }
  }

  return {
    totalCost: Math.round(totalCost),
    routes,
    avgDistance: routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + r.distance, 0) / routes.length) : 0
  };
}

function generateCoordinationPlan(plants, loadAllocation, transportation) {
  const plan = [];

  for (const plant of plants) {
    const load = loadAllocation[plant.plantId] || 0;
    if (load > 0) {
      plan.push({
        plantId: plant.plantId,
        action: 'produce',
        quantity: load,
        startDate: new Date().toISOString(),
        status: 'scheduled'
      });
    }
  }

  // 添加运输计划
  for (const route of transportation.routes || []) {
    plan.push({
      plantId: route.plantId,
      action: 'transport',
      quantity: route.quantity,
      destination: route.destination,
      status: 'pending'
    });
  }

  return plan;
}

function calculateCoordinationSummary(plants, loadAllocation, transportation) {
  const totalLoad = Object.values(loadAllocation).reduce((sum, l) => sum + l, 0);
  const totalCapacity = plants.reduce((sum, p) => sum + (p.capacity || 0), 0);

  return {
    totalPlants: plants.length,
    totalLoad,
    totalCapacity,
    overallUtilization: Math.round(totalLoad / totalCapacity * 100),
    transportationCost: transportation.totalCost || 0,
    balancedLoad: isLoadBalanced(loadAllocation, plants)
  };
}

function isLoadBalanced(loadAllocation, plants) {
  const loads = Object.values(loadAllocation);
  if (loads.length < 2) return true;

  const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
  const variance = loads.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / loads.length;

  return variance < avg * 0.1; // 负载差异小于10%认为平衡
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合供应链管理
 */
async function supplyChainManager(input) {
  const {
    facilityId,
    action = 'evaluation',  // 'evaluation' | 'priority' | 'coordination'
    supplierData,
    performanceMetrics,
    orders = [],
    plants = [],
    productionPlan = [],
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
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'evaluation':
        if (!supplierData || !performanceMetrics) {
          return { success: false, error: { code: 'INVALID_INPUT', message: 'supplierData and performanceMetrics required' } };
        }
        result.evaluation = evaluateSupplierPerformance(supplierData, performanceMetrics);
        break;

      case 'priority':
        if (!orders || orders.length === 0) {
          return { success: false, error: { code: 'INVALID_INPUT', message: 'orders required' } };
        }
        result.priorityRanking = rankOrderPriorities(orders, constraints);
        break;

      case 'coordination':
        if (!plants || plants.length === 0) {
          return { success: false, error: { code: 'INVALID_INPUT', message: 'plants required' } };
        }
        result.coordination = coordinateMultiPlant(plants, productionPlan, constraints);
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
        message: '供应链管理过程发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  supplyChainManager,
  evaluateSupplierPerformance,
  rankOrderPriorities,
  coordinateMultiPlant,
  calculateSupplierMetrics,
  assignSupplierGrades
};

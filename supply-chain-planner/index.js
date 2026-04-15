/**
 * Supply Chain Planner - 供应链规划器
 *
 * 合并技能: inventory-prediction
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 预测配置
// ============================================================================

const FORECAST_CONFIG = {
  defaultForecastPeriod: 30,       // 默认预测天数
  confidenceLevel: 0.95,           // 置信水平
  minDataPoints: 5,                // 最少数据点数
  seasonalityDetection: true,
  trendDetection: true
};

// ============================================================================
// 库存预测 ( Inventory Prediction )
// ============================================================================

function predictInventory(inventoryHistory, demandForecast, parameters = {}) {
  const {
    forecastDays = FORECAST_CONFIG.defaultForecastPeriod,
    confidenceLevel = FORECAST_CONFIG.confidenceLevel,
    includeSafetyStock = true,
    serviceLevel = 0.95
  } = parameters;

  // 验证数据
  if (!inventoryHistory || inventoryHistory.length < FORECAST_CONFIG.minDataPoints) {
    return {
      success: false,
      error: { code: 'INSUFFICIENT_DATA', message: '库存历史数据不足' }
    };
  }

  // 计算基本统计
  const stats = calculateInventoryStats(inventoryHistory);

  // 检测趋势
  const trend = detectTrend(inventoryHistory);

  // 检测季节性
  const seasonality = detectSeasonality(inventoryHistory);

  // 生成预测
  const forecast = generateInventoryForecast(stats, trend, seasonality, forecastDays);

  // 计算安全库存
  const safetyStock = includeSafetyStock
    ? calculateSafetyStock(demandForecast, serviceLevel)
    : 0;

  // 预测未来库存水平
  const inventoryProjection = projectInventoryLevels(stats, forecast, safetyStock);

  // 生成补货建议
  const replenishmentRecommendations = generateReplenishmentRecommendations(
    inventoryProjection,
    safetyStock
  );

  return {
    success: true,
    itemId: inventoryHistory[0]?.itemId,
    forecastPeriod: forecastDays,
    stats,
    trend,
    seasonality,
    forecast,
    safetyStock: Math.round(safetyStock * 100) / 100,
    inventoryProjection,
    replenishmentRecommendations
  };
}

function calculateInventoryStats(history) {
  const values = history.map(h => h.inventory || h.quantity || 0);

  const n = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // 计算标准差
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);

  // 计算移动平均
  const movingAvg3 = calculateMovingAverage(values, 3);
  const movingAvg7 = calculateMovingAverage(values, 7);

  // 最新值
  const latest = values[values.length - 1];

  return {
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    min: Math.min(...values),
    max: Math.max(...values),
    latest,
    movingAvg3: Math.round(movingAvg3 * 100) / 100,
    movingAvg7: Math.round(movingAvg7 * 100) / 100,
    dataPoints: n
  };
}

function calculateMovingAverage(values, period) {
  if (values.length < period) return values[values.length - 1] || 0;

  const recentValues = values.slice(-period);
  return recentValues.reduce((a, b) => a + b, 0) / period;
}

function detectTrend(history) {
  if (history.length < 4) return { type: 'stable', slope: 0 };

  const values = history.map(h => h.inventory || h.quantity || 0);
  const n = values.length;

  // 线性回归
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // 计算R²
  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * i + intercept;
    ssRes += Math.pow(values[i] - predicted, 2);
    ssTot += Math.pow(values[i] - meanY, 2);
  }
  const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

  let trendType = 'stable';
  if (Math.abs(slope) > 0.5 && rSquared > 0.7) {
    trendType = slope > 0 ? 'increasing' : 'decreasing';
  }

  return {
    type: trendType,
    slope: Math.round(slope * 1000) / 1000,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(rSquared * 1000) / 1000,
    confidence: rSquared > 0.8 ? 'high' : rSquared > 0.5 ? 'medium' : 'low'
  };
}

function detectSeasonality(history) {
  if (history.length < 12) return { detected: false, pattern: null };

  // 简化季节性检测
  const values = history.map(h => h.inventory || h.quantity || 0);
  const n = values.length;

  // 按周分组计算平均值
  const weeklyAvg = {};
  for (let i = 0; i < n; i++) {
    const week = Math.floor(i / 7) % 4; // 4周循环
    if (!weeklyAvg[week]) weeklyAvg[week] = [];
    weeklyAvg[week].push(values[i]);
  }

  const avgByWeek = Object.entries(weeklyAvg).map(([week, vals]) => ({
    week: parseInt(week),
    avg: vals.reduce((a, b) => a + b, 0) / vals.length
  }));

  // 检查方差
  const overallAvg = values.reduce((a, b) => a + b, 0) / n;
  const variance = avgByWeek.reduce((sum, w) => sum + Math.pow(w.avg - overallAvg, 2), 0) / avgByWeek.length;

  const detected = variance > (overallAvg * 0.1); // 10%以上差异认为有季节性

  return {
    detected,
    pattern: detected ? avgByWeek : null,
    amplitude: Math.round(Math.sqrt(variance) * 100) / 100
  };
}

function generateInventoryForecast(stats, trend, seasonality, forecastDays) {
  const forecast = [];

  for (let day = 1; day <= forecastDays; day++) {
    let predictedValue = stats.mean;

    // 应用趋势
    if (trend.type !== 'stable') {
      predictedValue += trend.slope * (stats.dataPoints + day);
    }

    // 应用季节性
    if (seasonality.detected && seasonality.pattern) {
      const seasonWeek = day % 7;
      const seasonData = seasonality.pattern.find(p => p.week === seasonWeek);
      if (seasonData) {
        predictedValue *= (seasonData.avg / stats.mean);
      }
    }

    // 置信区间
    const margin = stats.stdDev * 1.96; // 95%置信区间
    const marginFactor = day / forecastDays; // 越远越不确定

    forecast.push({
      day,
      date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted: Math.max(0, Math.round(predictedValue)),
      lowerBound: Math.max(0, Math.round(predictedValue - margin * marginFactor)),
      upperBound: Math.round(predictedValue + margin * marginFactor)
    });
  }

  return forecast;
}

function calculateSafetyStock(demandForecast, serviceLevel) {
  if (!demandForecast || demandForecast.length === 0) return 0;

  // 计算需求标准差
  const demands = demandForecast.map(d => d.demand || 0);
  const avgDemand = demands.reduce((a, b) => a + b, 0) / demands.length;
  const demandStdDev = Math.sqrt(demands.reduce((sum, d) => sum + Math.pow(d - avgDemand, 2), 0) / demands.length);

  // Z分数 (95% = 1.645, 99% = 2.33)
  const zScore = serviceLevel >= 0.99 ? 2.33 : serviceLevel >= 0.95 ? 1.645 : 1.28;

  // 安全库存 = Z * σ * √(平均提前期)
  const avgLeadTime = 7; // 假设7天
  const safetyStock = zScore * demandStdDev * Math.sqrt(avgLeadTime);

  return safetyStock;
}

function projectInventoryLevels(stats, forecast, safetyStock) {
  return forecast.map(f => ({
    date: f.date,
    predictedInventory: f.predicted,
    safetyStock,
    reorderPoint: f.predicted + safetyStock,
    lowerBound: f.lowerBound,
    upperBound: f.upperBound,
    serviceLevel: safetyStock > 0 ? 0.95 : 0.85
  }));
}

function generateReplenishmentRecommendations(inventoryProjection, safetyStock) {
  const recommendations = [];
  const criticalDays = [];

  // 找到库存低于安全库存的日期
  for (const day of inventoryProjection) {
    if (day.predictedInventory < safetyStock) {
      criticalDays.push(day);
    }
  }

  if (criticalDays.length > 0) {
    recommendations.push({
      priority: 'high',
      type: 'safety_stock_breach',
      description: `预测${criticalDays.length}天库存将低于安全库存`,
      action: '建议立即补货',
      firstCriticalDate: criticalDays[0].date
    });
  }

  // 计算最佳补货时机
  const avgInventory = inventoryProjection.reduce((sum, d) => sum + d.predictedInventory, 0) / inventoryProjection.length;
  const daysAboveAvg = inventoryProjection.filter(d => d.predictedInventory > avgInventory).length;

  if (daysAboveAvg < inventoryProjection.length * 0.3) {
    recommendations.push({
      priority: 'medium',
      type: 'low_inventory_trend',
      description: '库存整体呈下降趋势',
      action: '建议调整补货计划，增加补货频率'
    });
  }

  return recommendations;
}

// ============================================================================
// 需求预测 ( Demand Forecasting )
// ============================================================================

function forecastDemand(historicalSales, parameters = {}) {
  const {
    forecastPeriod = 30,
    method = 'auto',  // 'simple' | 'moving_average' | 'weighted' | 'auto'
    weights = [0.5, 0.3, 0.2]  // 近期到远期权重
  } = parameters;

  if (!historicalSales || historicalSales.length < 3) {
    return {
      success: false,
      error: { code: 'INSUFFICIENT_DATA', message: '历史销售数据不足' }
    };
  }

  let forecast;
  let methodUsed;

  switch (method) {
    case 'simple':
      forecast = simpleForecast(historicalSales, forecastPeriod);
      methodUsed = 'simple';
      break;

    case 'moving_average':
      forecast = movingAverageForecast(historicalSales, forecastPeriod);
      methodUsed = 'moving_average';
      break;

    case 'weighted':
      forecast = weightedForecast(historicalSales, forecastPeriod, weights);
      methodUsed = 'weighted';
      break;

    case 'auto':
    default:
      // 自动选择最佳方法
      forecast = selectBestForecastMethod(historicalSales, forecastPeriod);
      methodUsed = 'auto_selected';
  }

  return {
    success: true,
    methodUsed,
    forecast,
    accuracy: calculateForecastAccuracy(historicalSales),
    recommendations: generateDemandRecommendations(forecast)
  };
}

function simpleForecast(historicalSales, period) {
  const avg = historicalSales.reduce((sum, s) => sum + (s.quantity || 0), 0) / historicalSales.length;
  return Array(period).fill(null).map((_, i) => ({
    day: i + 1,
    predicted: Math.round(avg)
  }));
}

function movingAverageForecast(historicalSales, period, window = 3) {
  const result = [];
  const recent = historicalSales.slice(-window);

  const avg = recent.reduce((sum, s) => sum + (s.quantity || 0), 0) / recent.length;

  for (let i = 1; i <= period; i++) {
    result.push({
      day: i,
      predicted: Math.round(avg)
    });
  }

  return result;
}

function weightedForecast(historicalSales, period, weights) {
  const result = [];
  const recent = historicalSales.slice(-weights.length);

  let weightedSum = 0;
  let weightSum = 0;

  for (let i = 0; i < recent.length; i++) {
    weightedSum += (recent[i].quantity || 0) * weights[i];
    weightSum += weights[i];
  }

  const weightedAvg = weightedSum / weightSum;

  for (let i = 1; i <= period; i++) {
    result.push({
      day: i,
      predicted: Math.round(weightedAvg)
    });
  }

  return result;
}

function selectBestForecastMethod(historicalSales, period) {
  // 比较不同方法的准确性
  const methods = {
    simple: simpleForecast(historicalSales, Math.min(7, period)),
    moving: movingAverageForecast(historicalSales, Math.min(7, period)),
    weighted: weightedForecast(historicalSales, Math.min(7, period), [0.5, 0.3, 0.2])
  };

  // 返回加权平均作为最终预测
  const finalForecast = [];
  for (let i = 0; i < period; i++) {
    const values = Object.values(methods).map(m => m[i]?.predicted || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    finalForecast.push({
      day: i + 1,
      predicted: Math.round(avg)
    });
  }

  return finalForecast;
}

function calculateForecastAccuracy(historicalSales) {
  if (historicalSales.length < 2) return { mape: 0, accuracy: 100 };

  // 使用MAPE (Mean Absolute Percentage Error)
  let totalError = 0;
  let count = 0;

  for (let i = 1; i < historicalSales.length; i++) {
    const actual = historicalSales[i].quantity || 0;
    const previous = historicalSales[i - 1].quantity || 0;

    if (actual > 0) {
      totalError += Math.abs((actual - previous) / actual);
      count++;
    }
  }

  const mape = count > 0 ? (totalError / count) * 100 : 0;
  const accuracy = Math.max(0, 100 - mape);

  return {
    mape: Math.round(mape * 100) / 100,
    accuracy: Math.round(accuracy * 100) / 100
  };
}

function generateDemandRecommendations(forecast) {
  const recommendations = [];

  // 检查趋势
  const firstHalf = forecast.slice(0, Math.floor(forecast.length / 2));
  const secondHalf = forecast.slice(Math.floor(forecast.length / 2));

  const firstAvg = firstHalf.reduce((sum, f) => sum + f.predicted, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, f) => sum + f.predicted, 0) / secondHalf.length;

  if (secondAvg > firstAvg * 1.2) {
    recommendations.push({
      priority: 'high',
      type: 'increasing_demand',
      action: '需求呈上升趋势，建议提前备货'
    });
  } else if (secondAvg < firstAvg * 0.8) {
    recommendations.push({
      priority: 'medium',
      type: 'decreasing_demand',
      action: '需求呈下降趋势，建议调整库存策略'
    });
  }

  // 识别峰值
  const peak = forecast.reduce((max, f) => f.predicted > max.predicted ? f : max, forecast[0]);

  if (peak.predicted > forecast.reduce((sum, f) => sum + f.predicted, 0) / forecast.length * 1.5) {
    recommendations.push({
      priority: 'medium',
      type: 'demand_peak',
      action: `检测到需求峰值在第${peak.day}天，峰值量${peak.predicted}`,
      peakDate: peak.day
    });
  }

  return recommendations;
}

// ============================================================================
// 补货优化 ( Replenishment Optimization )
// ============================================================================

function optimizeReplenishment(inventoryData, demandForecast, supplierInfo) {
  const {
    itemId,
    currentStock = 0,
    reorderPoint = 0,
    reorderQuantity = 100,
    leadTime = 7
  } = inventoryData;

  // 计算最优订货点
  const optimalReorderPoint = calculateOptimalReorderPoint(demandForecast, leadTime);

  // 计算经济订货量 (EOQ)
  const eoq = calculateEOQ(inventoryData, demandForecast);

  // 计算再订货时机
  const reorderTiming = calculateReorderTiming(currentStock, demandForecast, optimalReorderPoint);

  // 供应商最优订货批次
  const supplierOrders = optimizeSupplierOrders(eoq, supplierInfo);

  return {
    success: true,
    itemId,
    currentStock,
    optimalReorderPoint: Math.round(optimalReorderPoint),
    economicOrderQuantity: Math.round(eoq),
    reorderTiming,
    supplierOrders,
    recommendations: generateReplenishmentRecommendations(
      currentStock,
      optimalReorderPoint,
      eoq,
      supplierOrders
    )
  };
}

function calculateOptimalReorderPoint(demandForecast, leadTime) {
  if (!demandForecast || demandForecast.length === 0) return 50;

  const avgDailyDemand = demandForecast.reduce((sum, d) => sum + (d.demand || 0), 0) / demandForecast.length;
  const demandStdDev = calculateStdDev(demandForecast.map(d => d.demand || 0));

  // ROP = 平均日需求 × 提前期 + Z × σ × √提前期
  const zScore = 1.645; // 95%服务级别
  const rop = avgDailyDemand * leadTime + zScore * demandStdDev * Math.sqrt(leadTime);

  return rop;
}

function calculateStdDev(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateEOQ(inventoryData, demandForecast) {
  const {
    orderingCost = 100,    // 每次订货成本
    holdingCostRate = 0.2,  // 年持有成本率
    unitCost = 10
  } = inventoryData;

  const annualDemand = demandForecast
    ? demandForecast.reduce((sum, d) => sum + (d.demand || 0), 0) * 365 / demandForecast.length
    : 1000;

  // EOQ = √(2 × 年需求 × 订货成本 / 持有成本率 × 单价)
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / (holdingCostRate * unitCost));

  return Math.round(eoq);
}

function calculateReorderTiming(currentStock, demandForecast, reorderPoint) {
  const avgDailyDemand = demandForecast
    ? demandForecast.reduce((sum, d) => sum + (d.demand || 0), 0) / demandForecast.length
    : 10;

  const daysUntilReorder = currentStock / avgDailyDemand;

  return {
    daysUntilReorder: Math.round(daysUntilReorder * 10) / 10,
    reorderDate: new Date(Date.now() + daysUntilReorder * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantityToOrder: Math.round(reorderPoint * 1.2) // 额外20%作为安全储备
  };
}

function optimizeSupplierOrders(eoq, supplierInfo) {
  if (!supplierInfo || supplierInfo.length === 0) {
    return { recommendedSupplier: null, batchSize: eoq };
  }

  // 选择最优供应商
  const suppliers = supplierInfo.map(s => ({
    ...s,
    score: calculateSupplierScore(s)
  }));

  suppliers.sort((a, b) => b.score - a.score);

  return {
    recommendedSupplier: suppliers[0].supplierId,
    batchSize: eoq,
    alternativeSuppliers: suppliers.slice(1, 3).map(s => s.supplierId)
  };
}

function calculateSupplierScore(supplier) {
  let score = 50;

  if (supplier.deliveryRate > 95) score += 30;
  else if (supplier.deliveryRate > 90) score += 20;

  if (supplier.priceDiscount > 0.1) score += 20;
  else if (supplier.priceDiscount > 0.05) score += 10;

  if (supplier.minOrderQuantity <= 50) score += 10;

  return score;
}

function generateReplenishmentRecommendations(currentStock, optimalReorderPoint, eoq, supplierOrders) {
  const recommendations = [];

  if (currentStock < optimalReorderPoint) {
    recommendations.push({
      priority: 'high',
      action: '立即补货',
      quantity: Math.round(eoq)
    });
  } else if (currentStock < optimalReorderPoint * 1.2) {
    recommendations.push({
      priority: 'medium',
      action: '库存接近再订货点，建议准备补货'
    });
  }

  if (supplierOrders.recommendedSupplier) {
    recommendations.push({
      priority: 'low',
      action: `推荐供应商: ${supplierOrders.recommendedSupplier}`
    });
  }

  return recommendations;
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合供应链规划
 */
async function supplyChainPlanner(input) {
  const {
    facilityId,
    action = 'inventory',  // 'inventory' | 'demand' | 'replenishment'
    inventoryHistory = [],
    demandForecast = [],
    supplierInfo = [],
    parameters = {}
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
      case 'inventory':
        result.prediction = predictInventory(inventoryHistory, demandForecast, parameters);
        break;

      case 'demand':
        result.forecast = forecastDemand(inventoryHistory, parameters);
        break;

      case 'replenishment':
        result.optimization = optimizeReplenishment(
          inventoryHistory[0] || {},
          demandForecast,
          supplierInfo
        );
        break;

      case 'integrated':
        const inventory = predictInventory(inventoryHistory, demandForecast, parameters);
        const demand = forecastDemand(inventoryHistory, parameters);
        const replenishment = optimizeReplenishment(
          inventoryHistory[0] || {},
          demandForecast,
          supplierInfo
        );

        result = {
          ...result,
          inventoryPrediction: inventory,
          demandForecast: demand,
          replenishmentOptimization: replenishment,
          integratedRecommendations: [
            ...(inventory?.replenishmentRecommendations || []),
            ...(demand?.recommendations || []),
            ...(replenishment?.recommendations || [])
          ]
        };
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
        message: '供应链规划过程发生错误',
        details: error.message
      }
    };
  }
}

module.exports = {
  supplyChainPlanner,
  predictInventory,
  forecastDemand,
  optimizeReplenishment,
  calculateInventoryStats,
  detectTrend,
  FORECAST_CONFIG
};

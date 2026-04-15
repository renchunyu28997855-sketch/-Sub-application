/**
 * Energy Optimizer - 能源优化器
 *
 * 合并技能: energy-saving-optimization, equipment-energy-efficiency, hvac-optimization,
 *          lighting-optimization, air-compressor-optimization, peak-shaving,
 *          renewable-energy-integration, energy-cost-allocation
 *
 * @version 1.0.0
 */

'use strict';

// ============================================================================
// 能效标准配置
// ============================================================================

const ENERGY_STANDARDS = {
  // 电机能效等级 (IE标准)
  motorEfficiency: {
    IE1: { min: 0.75, name: '标准效率' },
    IE2: { min: 0.85, name: '高效率' },
    IE3: { min: 0.90, name: '优质高效' },
    IE4: { min: 0.95, name: '超优效率' }
  },

  // 照明能效标准 (lm/W)
  lightingEfficiency: {
    LED: { min: 100, recommended: 140 },
    Fluorescent: { min: 70, recommended: 90 },
    HID: { min: 50, recommended: 80 }
  },

  // 空压机能效标准 (kW/(m3/min))
  compressorEfficiency: {
    fixedSpeed: { min: 6.5, optimal: 6.0 },
    variableSpeed: { min: 5.5, optimal: 5.0 },
    centrifugal: { min: 5.0, optimal: 4.5 }
  },

  // HVAC能效指标
  hvacEfficiency: {
    chiller: { min: 5.0, excellent: 6.0 },           // COP
    airHandler: { min: 3.5, excellent: 4.5 },      // kW/ton
    vav: { min: 0.4, excellent: 0.35 }             // W/cfm
  },

  // 碳排放因子 (kg CO2/kWh)
  carbonFactors: {
    coal: 0.9,
    naturalGas: 0.4,
    grid: 0.5,
    solar: 0.02,
    wind: 0.01,
    nuclear: 0.01
  }
};

// ============================================================================
// 能源消耗分析
// ============================================================================

function analyzeEnergyConsumption(consumptionData, facilityInfo = {}) {
  const { electricity = {}, gas = {}, diesel = {}, coal = {} } = consumptionData;

  // 计算总能源消耗 (转换为kWh)
  const electricityKwh = electricity.consumption || 0;
  const gasKwh = (gas.consumption || 0) * 11;  // 1m³天然气 ≈ 11kWh
  const dieselKwh = (diesel.consumption || 0) * 10;  // 1L柴油 ≈ 10kWh
  const coalKwh = (coal.consumption || 0) * 6.5;  // 1kg煤 ≈ 6.5kWh

  const totalKwh = electricityKwh + gasKwh + dieselKwh + coalKwh;

  // 计算总成本
  const totalCost = (electricity.cost || 0) + (gas.cost || 0) + (diesel.cost || 0) + (coal.cost || 0);

  // 计算能源强度 (kWh/产出单位)
  const output = facilityInfo.output || 1;
  const energyIntensity = totalKwh / output;

  // 计算碳排放
  const carbonEmissions = calculateCarbonEmissions(consumptionData);

  return {
    totalKwh: Math.round(totalKwh),
    breakdown: {
      electricity: { kwh: electricityKwh, cost: electricity.cost || 0, percentage: totalKwh > 0 ? (electricityKwh / totalKwh * 100).toFixed(1) : 0 },
      gas: { kwh: gasKwh, cost: gas.cost || 0, percentage: totalKwh > 0 ? (gasKwh / totalKwh * 100).toFixed(1) : 0 },
      diesel: { kwh: dieselKwh, cost: diesel.cost || 0, percentage: totalKwh > 0 ? (dieselKwh / totalKwh * 100).toFixed(1) : 0 },
      coal: { kwh: coalKwh, cost: coal.cost || 0, percentage: totalKwh > 0 ? (coalKwh / totalKwh * 100).toFixed(1) : 0 }
    },
    totalCost: Math.round(totalCost),
    energyIntensity: Math.round(energyIntensity * 100) / 100,
    carbonEmissions: Math.round(carbonEmissions * 100) / 100
  };
}

function calculateCarbonEmissions(consumptionData) {
  const { electricity = {}, gas = {}, diesel = {}, coal = {} } = consumptionData;
  const factors = ENERGY_STANDARDS.carbonFactors;

  return (
    (electricity.consumption || 0) * factors.grid +
    (gas.consumption || 0) * factors.naturalGas +
    (diesel.consumption || 0) * 2.7 +
    (coal.consumption || 0) * factors.coal
  );
}

// ============================================================================
// 电机能效评估
// ============================================================================

function evaluateMotorEfficiency(motorData) {
  const { power, current, voltage, powerFactor, efficiency, motorType } = motorData;

  // 计算输入功率
  const inputPower = (voltage * current * Math.sqrt(3) * (powerFactor || 0.85)) / 1000; // kW

  // 额定功率 (kW)
  const ratedPower = power;

  // 负载率
  const loadFactor = ratedPower > 0 ? inputPower / ratedPower : 0;

  // 评估效率等级
  let efficiencyClass = 'IE1';
  let efficiencyLevel = 'standard';

  if (efficiency) {
    if (efficiency >= 0.95) { efficiencyClass = 'IE4'; efficiencyLevel = 'super_premium'; }
    else if (efficiency >= 0.90) { efficiencyClass = 'IE3'; efficiencyLevel = 'premium'; }
    else if (efficiency >= 0.85) { efficiencyClass = 'IE2'; efficiencyLevel = 'high'; }
    else { efficiencyClass = 'IE1'; efficiencyLevel = 'standard'; }
  }

  // 计算节能潜力
  const potentialSavings = ratedPower * (0.85 - (efficiency || 0.85)) * loadFactor * 8000; // 年运行8000小时

  return {
    ratedPower,
    inputPower: Math.round(inputPower * 100) / 100,
    loadFactor: Math.round(loadFactor * 100) / 100,
    currentEfficiency: efficiency ? Math.round(efficiency * 100) : null,
    efficiencyClass,
    efficiencyLevel,
    potentialSavings: Math.round(potentialSavings),
    recommendations: generateMotorRecommendations(loadFactor, efficiency, efficiencyClass)
  };
}

function generateMotorRecommendations(loadFactor, efficiency, efficiencyClass) {
  const recommendations = [];

  if (loadFactor < 0.5) {
    recommendations.push('电机负载率过低(<50%)，考虑使用变频器或较小功率电机');
  } else if (loadFactor > 0.9) {
    recommendations.push('电机接近满载运行，建议检查是否存在过载');
  }

  if (efficiencyClass === 'IE1') {
    recommendations.push('建议升级到IE3或IE4高效电机，可节能5-10%');
  } else if (efficiencyClass === 'IE2') {
    recommendations.push('考虑升级到IE3高效电机');
  }

  if (!efficiency || efficiency < 0.85) {
    recommendations.push('电机效率偏低，建议进行维护检查');
  }

  return recommendations;
}

// ============================================================================
// HVAC优化分析
// ============================================================================

function optimizeHVAC(hvacData, ambientData = {}) {
  const {
    chiller = {},
    airHandler = {},
    coolingTower = {},
    temperature = {},
    humidity = {}
  } = hvacData;

  const results = [];
  let totalPotential = 0;

  // 冷水机组分析
  if (chiller.cop) {
    const copAnalysis = analyzeChillerCOP(chiller.cop, chiller.tonnage || 100);
    results.push(copAnalysis);
    totalPotential += copAnalysis.potentialAnnualSaving;
  }

  // 空气处理机组分析
  if (airHandler.power || airHandler.cfm) {
    const ahuAnalysis = analyzeAirHandler(airHandler);
    results.push(ahuAnalysis);
    totalPotential += ahuAnalysis.potentialAnnualSaving;
  }

  // 送风温度优化
  if (temperature.supply && temperature.return) {
    const satAnalysis = analyzeSupplyAirTemp(temperature.supply, temperature.return);
    results.push(satAnalysis);
    totalPotential += satAnalysis.potentialAnnualSaving;
  }

  return {
    components: results,
    totalPotentialAnnualSaving: Math.round(totalPotential),
    priorityActions: results.filter(r => r.rating === 'high').map(r => r.recommendation)
  };
}

function analyzeChillerCOP(cop, tonnage) {
  const standard = ENERGY_STANDARDS.hvacEfficiency.chiller;
  let rating = 'medium';
  let recommendation = '';
  let potential = 0;

  if (cop >= standard.excellent) {
    rating = 'excellent';
    recommendation = '冷水机组效率优秀';
  } else if (cop >= standard.min) {
    rating = 'good';
    recommendation = '冷水机组效率正常，可进一步优化';
    potential = tonnage * (standard.excellent - cop) * 800 * 0.1; // 假设电价0.8元/kWh
  } else {
    rating = 'poor';
    recommendation = '冷水机组效率偏低，建议检修或更换';
    potential = tonnage * (standard.min - cop) * 800 * 0.1;
  }

  return {
    component: 'chiller',
    currentValue: cop,
    rating,
    recommendation,
    potentialAnnualSaving: potential
  };
}

function analyzeAirHandler(ahuData) {
  const { power, cfm } = ahuData;
  const standard = ENERGY_STANDARDS.hvacEfficiency.airHandler;

  if (!power || !cfm) {
    return { component: 'air_handler', status: 'insufficient_data' };
  }

  const efficiency = power / cfm; // W/cfm
  let rating = 'medium';
  let recommendation = '';
  let potential = 0;

  if (efficiency <= standard.excellent) {
    rating = 'excellent';
    recommendation = '空气处理机组效率优秀';
  } else if (efficiency <= standard.min) {
    rating = 'good';
    recommendation = '空气处理机组效率正常';
  } else {
    rating = 'poor';
    recommendation = '空气处理机组效率偏低，建议清洁过滤器或更换风机';
    potential = cfm * (efficiency - standard.min) * 8000 * 0.8 / 1000;
  }

  return {
    component: 'air_handler',
    currentValue: efficiency,
    unit: 'W/cfm',
    rating,
    recommendation,
    potentialAnnualSaving: potential
  };
}

function analyzeSupplyAirTemp(supplyTemp, returnTemp) {
  const tempDiff = supplyTemp - returnTemp;
  let rating = 'medium';
  let recommendation = '';
  let potential = 0;

  if (Math.abs(tempDiff) < 8) {
    rating = 'poor';
    recommendation = '送回风温差过小，建议调整或清洁盘管';
    potential = 5000; // 估算年节省
  } else if (Math.abs(tempDiff) > 15) {
    rating = 'good';
    recommendation = '送回风温差过大，可能影响舒适性';
  } else {
    rating = 'good';
    recommendation = '送回风温差正常';
  }

  return {
    component: 'supply_air_temp',
    supplyTemp,
    returnTemp,
    differential: tempDiff,
    rating,
    recommendation,
    potentialAnnualSaving: potential
  };
}

// ============================================================================
// 照明优化分析
// ============================================================================

function optimizeLighting(lightingData) {
  const { totalPower, lumens, fixtures = [], operatingHours = 4000 } = lightingData;

  // 计算当前能效
  const currentEfficiency = lumens > 0 ? totalPower / (lumens / 1000) : 0; // lm/W

  const results = [];
  let totalPotential = 0;

  // 分析各类型灯具
  const types = { LED: 0, Fluorescent: 0, HID: 0, Other: 0 };

  for (const fixture of fixtures) {
    const type = fixture.type || 'Other';
    types[type] = (types[type] || 0) + (fixture.watts || 0);
  }

  // LED升级潜力
  if (types.Fluorescent > 0 || types.HID > 0) {
    const upgradePotential = (types.Fluorescent + types.HID) * (1 - 0.6) * operatingHours * 0.8 / 1000; // kWh
    const costSaving = upgradePotential * 0.8; // 元

    results.push({
      action: 'upgrade_to_led',
      currentPower: types.Fluorescent + types.HID,
      projectedPower: (types.Fluorescent + types.HID) * 0.6,
      annualEnergySaving: Math.round(upgradePotential),
      costSaving: Math.round(costSaving),
      rating: 'high'
    });
    totalPotential += costSaving;
  }

  // 智能控制潜力
  if (totalPower > 10) {
    const smartPotential = totalPower * 0.15 * operatingHours * 0.8 / 1000; // 假设节电15%
    const costSaving = smartPotential * 0.8;

    results.push({
      action: 'install_smart_controls',
      currentPower: totalPower,
      projectedSaving: 0.15,
      annualEnergySaving: Math.round(smartPotential),
      costSaving: Math.round(costSaving),
      rating: 'medium'
    });
    totalPotential += costSaving;
  }

  return {
    currentEfficiency: Math.round(currentEfficiency),
    totalPower,
    fixtureBreakdown: types,
    suggestions: results,
    totalPotentialAnnualSaving: Math.round(totalPotential)
  };
}

// ============================================================================
// 空压机优化分析
// ============================================================================

function optimizeAirCompressor(compressorData) {
  const { type, power, flow, pressure, loadProfile = [], operatingHours = 8000 } = compressorData;

  // 计算比功率
  const specificPower = power / flow; // kW/(m³/min)

  const standard = ENERGY_STANDARDS.compressorEfficiency[type] || ENERGY_STANDARDS.compressorEfficiency.fixedSpeed;

  let rating = 'medium';
  let recommendation = '';
  let potential = 0;

  if (specificPower <= standard.optimal) {
    rating = 'excellent';
    recommendation = '空压机效率优秀';
  } else if (specificPower <= standard.min) {
    rating = 'good';
    recommendation = '空压机效率正常';
    potential = power * 0.1 * operatingHours * 0.8;
  } else {
    rating = 'poor';
    recommendation = '空压机效率偏低，建议检查泄漏或调整压力设定';
    potential = power * 0.2 * operatingHours * 0.8;
  }

  // 分析负载曲线
  const loadAnalysis = analyzeCompressorLoad(loadProfile);

  return {
    type,
    ratedPower: power,
    flow,
    pressure,
    specificPower: Math.round(specificPower * 100) / 100,
    rating,
    recommendation,
    loadAnalysis,
    potentialAnnualSaving: Math.round(potential)
  };
}

function analyzeCompressorLoad(loadProfile) {
  if (!loadProfile || loadProfile.length === 0) {
    return { status: 'no_data' };
  }

  const avgLoad = loadProfile.reduce((a, b) => a + b.load, 0) / loadProfile.length;
  const timeAtZero = loadProfile.filter(p => p.load < 10).length / loadProfile.length * 100;

  let assessment = 'normal';
  if (avgLoad < 0.4) {
    assessment = 'undersized';
  } else if (avgLoad > 0.85) {
    assessment = 'overloaded';
  }

  return {
    averageLoad: Math.round(avgLoad * 100),
    timeAtZeroLoad: Math.round(timeAtZero),
    assessment,
    suggestions: timeAtZero > 30 ? ['存在大量空载运行，建议安装变频或调速控制'] : []
  };
}

// ============================================================================
// 峰谷调节分析
// ============================================================================

function analyzePeakShaving(loadProfile, utilityData = {}) {
  const { peakRate = 1.5, offPeakRate = 0.5, demandCharge = 30 } = utilityData;

  if (!loadProfile || loadProfile.length === 0) {
    return { status: 'insufficient_data' };
  }

  // 计算峰谷负荷
  let peakKwh = 0;
  let offPeakKwh = 0;
  let peakDemand = 0;
  let offPeakDemand = 0;

  for (const period of loadProfile) {
    if (period.isPeak) {
      peakKwh += period.kwh || 0;
      peakDemand = Math.max(peakDemand, period.demand || 0);
    } else {
      offPeakKwh += period.kwh || 0;
      offPeakDemand = Math.max(offPeakDemand, period.demand || 0);
    }
  }

  // 计算峰谷比例
  const totalKwh = peakKwh + offPeakKwh;
  const peakRatio = totalKwh > 0 ? peakKwh / totalKwh : 0;

  // 评估需求费用
  const currentDemandCharge = peakDemand * demandCharge;
  const optimizedDemandCharge = offPeakDemand * demandCharge;
  const demandSavings = Math.max(0, currentDemandCharge - optimizedDemandCharge);

  // 建议
  const suggestions = [];
  if (peakRatio > 0.4) {
    suggestions.push('峰时用电比例偏高，建议将非紧急生产调整到低谷时段');
  }
  if (peakDemand > offPeakDemand * 1.3) {
    suggestions.push('需求峰值过高，考虑安装储能系统进行削峰');
    suggestions.push('安装需求响应系统，在高峰时段自动调减负荷');
  }

  return {
    current: {
      peakKwh: Math.round(peakKwh),
      offPeakKwh: Math.round(offPeakKwh),
      peakDemand,
      offPeakDemand,
      peakRatio: Math.round(peakRatio * 100),
      estimatedDemandCharge: Math.round(currentDemandCharge)
    },
    potential: {
      targetPeakReduction: Math.round((peakDemand - offPeakDemand) * 0.3),
      annualSaving: Math.round(demandSavings * 12)
    },
    suggestions
  };
}

// ============================================================================
// 新能源集成分析
// ============================================================================

function analyzeRenewableIntegration(renewableData, gridData = {}) {
  const { solar = {}, wind = {} } = renewableData;
  const { gridPrice = 0.5 } = gridData;

  const results = [];
  let totalInvestment = 0;
  let totalAnnualGeneration = 0;
  let totalAnnualSaving = 0;

  // 太阳能分析
  if (solar.capacity) {
    const solarAnalysis = analyzeSolar(solar, gridPrice);
    results.push(solarAnalysis);
    totalInvestment += solarAnalysis.installationCost;
    totalAnnualGeneration += solarAnalysis.annualGeneration;
    totalAnnualSaving += solarAnalysis.annualSaving;
  }

  // 风能分析
  if (wind.capacity) {
    const windAnalysis = analyzeWind(wind, gridPrice);
    results.push(windAnalysis);
    totalInvestment += windAnalysis.installationCost;
    totalAnnualGeneration += windAnalysis.annualGeneration;
    totalAnnualSaving += windAnalysis.annualSaving;
  }

  // 计算投资回报
  const paybackYears = totalAnnualSaving > 0 ? totalInvestment / totalAnnualSaving : 0;

  return {
    breakdown: results,
    total: {
      installationCost: Math.round(totalInvestment),
      annualGeneration: Math.round(totalAnnualGeneration),
      annualSaving: Math.round(totalAnnualSaving),
      paybackYears: Math.round(paybackYears * 10) / 10,
      roi: paybackYears > 0 ? Math.round((1 / paybackYears) * 100) : 0
    }
  };
}

function analyzeSolar(solarData, gridPrice) {
  const { capacity, sunHours = 4.5, efficiency = 0.8, landArea = 0 } = solarData;

  // 年发电量 = 装机容量 × 日照时数 × 年天数 × 效率
  const annualGeneration = capacity * sunHours * 365 * efficiency;
  const annualSaving = annualGeneration * gridPrice;

  // 粗略估算安装成本 (8-10元/瓦)
  const installationCost = capacity * 1000 * 8;
  const paybackYears = installationCost / annualSaving;

  return {
    type: 'solar',
    capacity,
    annualGeneration: Math.round(annualGeneration),
    annualSaving: Math.round(annualSaving),
    installationCost: Math.round(installationCost),
    paybackYears: Math.round(paybackYears * 10) / 10,
    efficiency,
    suitable: annualGeneration > 0
  };
}

function analyzeWind(windData, gridPrice) {
  const { capacity, capacityFactor = 0.3, hours = 8000 } = windData;

  const annualGeneration = capacity * capacityFactor * hours;
  const annualSaving = annualGeneration * gridPrice;
  const installationCost = capacity * 1000 * 10; // 10元/瓦
  const paybackYears = installationCost / annualSaving;

  return {
    type: 'wind',
    capacity,
    capacityFactor,
    annualGeneration: Math.round(annualGeneration),
    annualSaving: Math.round(annualSaving),
    installationCost: Math.round(installationCost),
    paybackYears: Math.round(paybackYears * 10) / 10,
    suitable: annualGeneration > 0
  };
}

// ============================================================================
// 碳排放计算
// ============================================================================

function calculateCarbonEmissionsDetailed(consumptionData, renewableData = {}) {
  const gridEmissions = (consumptionData.electricity?.consumption || 0) * 0.5; // kg CO2
  const gasEmissions = (consumptionData.gas?.consumption || 0) * 2.0; // kg CO2
  const dieselEmissions = (consumptionData.diesel?.consumption || 0) * 2.7;
  const coalEmissions = (consumptionData.coal?.consumption || 0) * 2.0;

  const totalEmissions = gridEmissions + gasEmissions + dieselEmissions + coalEmissions;

  // 新能源减排
  let avoidedEmissions = 0;
  if (renewableData.solar?.capacity) {
    avoidedEmissions += renewableData.solar.capacity * 4 * 365 * 0.5; // 估算
  }
  if (renewableData.wind?.capacity) {
    avoidedEmissions += renewableData.wind.capacity * 0.3 * 8000 * 0.5;
  }

  return {
    totalEmissions: Math.round(totalEmissions),
    breakdown: {
      grid: Math.round(gridEmissions),
      gas: Math.round(gasEmissions),
      diesel: Math.round(dieselEmissions),
      coal: Math.round(coalEmissions)
    },
    avoidedEmissions: Math.round(avoidedEmissions),
    netEmissions: Math.round(totalEmissions - avoidedEmissions),
    carbonIntensity: consumptionData.electricity?.consumption > 0
      ? Math.round(totalEmissions / (consumptionData.electricity.consumption / 1000))
      : 0
  };
}

// ============================================================================
// 主函数
// ============================================================================

/**
 * 综合能源优化分析
 */
async function energyOptimizer(input) {
  const {
    facilityId,
    analysisType = 'comprehensive',
    consumptionData = {},
    equipmentData = {},
    renewableData = {},
    utilityData = {},
    optimizationGoals = []
  } = input;

  if (!facilityId) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'facilityId is required' } };
  }

  try {
    const result = {
      success: true,
      facilityId,
      analysisType,
      timestamp: new Date().toISOString()
    };

    switch (analysisType) {
      case 'comprehensive':
      case 'full':
        result.analysis = analyzeComprehensiveEnergy(consumptionData, equipmentData, renewableData, utilityData, optimizationGoals);
        break;

      case 'consumption':
        result.analysis = analyzeEnergyConsumption(consumptionData);
        break;

      case 'motor':
        result.analysis = evaluateMotorEfficiency(equipmentData.motor);
        break;

      case 'hvac':
        result.analysis = optimizeHVAC(equipmentData.hvac, utilityData);
        break;

      case 'lighting':
        result.analysis = optimizeLighting(equipmentData.lighting);
        break;

      case 'compressor':
        result.analysis = optimizeAirCompressor(equipmentData.compressor);
        break;

      case 'peak-shaving':
        result.analysis = analyzePeakShaving(equipmentData.loadProfile, utilityData);
        break;

      case 'renewable':
        result.analysis = analyzeRenewableIntegration(renewableData, utilityData);
        break;

      case 'carbon':
        result.analysis = calculateCarbonEmissionsDetailed(consumptionData, renewableData);
        break;

      default:
        return {
          success: false,
          error: { code: 'INVALID_TYPE', message: `Unsupported analysis type: ${analysisType}` }
        };
    }

    return result;

  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: '能源优化分析发生错误',
        details: error.message
      }
    };
  }
}

function analyzeComprehensiveEnergy(consumptionData, equipmentData, renewableData, utilityData, goals) {
  const results = {};

  // 能源消耗分析
  results.consumption = analyzeEnergyConsumption(consumptionData);

  // 电机能效 (如果提供)
  if (equipmentData.motor) {
    results.motor = evaluateMotorEfficiency(equipmentData.motor);
  }

  // HVAC优化
  if (equipmentData.hvac) {
    results.hvac = optimizeHVAC(equipmentData.hvac, utilityData);
  }

  // 照明优化
  if (equipmentData.lighting) {
    results.lighting = optimizeLighting(equipmentData.lighting);
  }

  // 空压机优化
  if (equipmentData.compressor) {
    results.compressor = optimizeAirCompressor(equipmentData.compressor);
  }

  // 峰谷分析
  if (equipmentData.loadProfile) {
    results.peakShaving = analyzePeakShaving(equipmentData.loadProfile, utilityData);
  }

  // 新能源分析
  if (renewableData && (renewableData.solar?.capacity || renewableData.wind?.capacity)) {
    results.renewable = analyzeRenewableIntegration(renewableData, utilityData);
  }

  // 碳排放
  results.carbon = calculateCarbonEmissionsDetailed(consumptionData, renewableData);

  // 综合建议
  const recommendations = [];
  let totalPotential = 0;

  if (results.motor?.potentialSavings > 0) {
    recommendations.push({ area: 'motor', potential: results.motor.potentialSavings, action: results.motor.recommendations[0] });
    totalPotential += results.motor.potentialSavings;
  }
  if (results.hvac?.totalPotentialAnnualSaving > 0) {
    recommendations.push({ area: 'hvac', potential: results.hvac.totalPotentialAnnualSaving });
    totalPotential += results.hvac.totalPotentialAnnualSaving;
  }
  if (results.lighting?.totalPotentialAnnualSaving > 0) {
    recommendations.push({ area: 'lighting', potential: results.lighting.totalPotentialAnnualSaving });
    totalPotential += results.lighting.totalPotentialAnnualSaving;
  }
  if (results.compressor?.potentialAnnualSaving > 0) {
    recommendations.push({ area: 'compressor', potential: results.compressor.potentialAnnualSaving });
    totalPotential += results.compressor.potentialAnnualSaving;
  }
  if (results.peakShaving?.potential?.annualSaving > 0) {
    recommendations.push({ area: 'peak_shaving', potential: results.peakShaving.potential.annualSaving });
    totalPotential += results.peakShaving.potential.annualSaving;
  }

  results.summary = {
    totalCurrentCost: results.consumption.totalCost,
    totalPotentialAnnualSaving: Math.round(totalPotential),
    investmentPaybackMonths: 18, // 估算
    recommendations: recommendations.sort((a, b) => b.potential - a.potential)
  };

  return results;
}

module.exports = {
  energyOptimizer,
  analyzeEnergyConsumption,
  evaluateMotorEfficiency,
  optimizeHVAC,
  optimizeLighting,
  optimizeAirCompressor,
  analyzePeakShaving,
  analyzeRenewableIntegration,
  calculateCarbonEmissions,
  calculateCarbonEmissionsDetailed,
  ENERGY_STANDARDS
};

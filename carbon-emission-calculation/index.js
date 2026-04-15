/**
 * Carbon Emission Calculation Skill
 * Comprehensive carbon footprint analysis for factories, processes, and products
 */

class CarbonEmissionCalculator {
  constructor(config = {}) {
    this.reportingCurrency = config.reportingCurrency || 'CNY';

    // Default emission factors (kgCO2e per unit)
    this.defaultEmissionFactors = {
      electricity: {
        'china_east': 0.853,
        'china_north': 0.759,
        'china_central': 0.862,
        'china_south': 0.802,
        'china_west': 0.667,
        'default': 0.853
      },
      natural_gas: 0.202,
      diesel: 0.267,
      gasoline: 0.231,
      coal: 0.354,
      lpg: 0.210,
      fuel_oil: 0.276,
      biomass: 0.0,
      renewable: 0.0
    };

    // Transport emission factors (kgCO2e per tonne-km)
    this.transportFactors = {
      road_heavy: 0.107,
      road_light: 0.171,
      rail: 0.028,
      sea: 0.016,
      air_freight: 0.602,
      air_passenger: 0.195
    };

    // Material emission factors (kgCO2e per kg)
    this.materialFactors = {
      steel: 2.5,
      aluminum: 12.0,
      copper: 3.5,
      plastic: 3.0,
      concrete: 0.4,
      paper: 1.0,
      wood: 0.8,
      glass: 1.2,
      default: 2.0
    };
  }

  /**
   * Calculate carbon emissions across all scopes
   * @param {Object} input - Energy, material, and logistics data
   * @returns {Object} Comprehensive carbon emission analysis
   */
  process(input) {
    try {
      this.validateInput(input);

      // Calculate Scope 1 - Direct emissions
      const scope1Emissions = this.calculateScope1Emissions(input.energySources);

      // Calculate Scope 2 - Indirect energy emissions
      const scope2Emissions = this.calculateScope2Emissions(input.energySources);

      // Calculate Scope 3 - Value chain emissions
      const scope3Emissions = this.calculateScope3Emissions(input);

      // Calculate totals
      const totalEmissions = this.calculateTotalEmissions(scope1Emissions, scope2Emissions, scope3Emissions);

      // Calculate emissions breakdown
      const emissionsBreakdown = this.calculateEmissionsBreakdown(
        scope1Emissions, scope2Emissions, scope3Emissions
      );

      // Calculate carbon intensity
      const carbonIntensity = this.calculateCarbonIntensity(totalEmissions, input.productionData);

      // Map to compliance standards
      const complianceMapping = this.mapToComplianceStandards(
        totalEmissions, input.reportingStandards || ['GHG_Protocol']
      );

      // Generate detailed report
      const carbonFootprintReport = this.generateCarbonFootprintReport(
        totalEmissions, emissionsBreakdown, carbonIntensity, input.reportingPeriod
      );

      return {
        success: true,
        totalEmissions,
        emissionsBreakdown,
        carbonIntensity,
        complianceMapping,
        carbonFootprintReport,
        metadata: {
          calculationDate: new Date().toISOString(),
          reportingCurrency: this.reportingCurrency,
          methodology: 'IPCC_AR5_GWP100'
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate input data structure
   */
  validateInput(input) {
    if (!input.energySources || !Array.isArray(input.energySources)) {
      throw new Error('energySources is required and must be an array');
    }
    if (input.energySources.length === 0) {
      throw new Error('energySources array cannot be empty');
    }

    input.energySources.forEach((source, index) => {
      if (!source.sourceType || typeof source.sourceType !== 'string') {
        throw new Error(`energySources[${index}].sourceType must be a string`);
      }
      if (typeof source.consumption !== 'number' || source.consumption < 0) {
        throw new Error(`energySources[${index}].consumption must be a non-negative number`);
      }
    });
  }

  /**
   * Calculate Scope 1 - Direct emissions
   */
  calculateScope1Emissions(energySources) {
    let totalEmissions = 0;
    const breakdown = [];

    const scope1Types = ['natural_gas', 'diesel', 'gasoline', 'lpg', 'fuel_oil', 'coal'];

    energySources.forEach(source => {
      if (scope1Types.includes(source.sourceType)) {
        const factor = this.getEmissionFactor(source, 'scope1');
        const emissions = source.consumption * factor;
        totalEmissions += emissions;

        breakdown.push({
          source: source.sourceType,
          emissions: Math.round(emissions * 100) / 100,
          consumption: source.consumption,
          factor: factor
        });
      }
    });

    return {
      total: Math.round(totalEmissions * 100) / 100,
      breakdown
    };
  }

  /**
   * Calculate Scope 2 - Indirect emissions from purchased energy
   */
  calculateScope2Emissions(energySources) {
    let totalEmissions = 0;
    const breakdown = [];

    const scope2Types = ['electricity', 'steam', 'district_heating', 'district_cooling'];

    energySources.forEach(source => {
      if (scope2Types.includes(source.sourceType)) {
        const factor = this.getEmissionFactor(source, 'scope2');
        const emissions = source.consumption * factor;
        totalEmissions += emissions;

        breakdown.push({
          source: source.sourceType,
          gridRegion: source.gridRegion || 'default',
          emissions: Math.round(emissions * 100) / 100,
          consumption: source.consumption,
          factor: factor
        });
      }
    });

    return {
      total: Math.round(totalEmissions * 100) / 100,
      breakdown
    };
  }

  /**
   * Calculate Scope 3 - Value chain emissions
   */
  calculateScope3Emissions(input) {
    let totalEmissions = 0;
    const breakdown = [];

    // Raw material emissions
    if (input.rawMaterials && Array.isArray(input.rawMaterials)) {
      input.rawMaterials.forEach(material => {
        const factor = material.emissionFactor ||
          this.materialFactors[material.materialType] ||
          this.materialFactors.default;
        const emissions = material.quantity * factor;
        totalEmissions += emissions;

        breakdown.push({
          category: 'raw_materials',
          detail: material.materialType,
          emissions: Math.round(emissions * 100) / 100,
          quantity: material.quantity,
          factor: factor
        });
      });
    }

    // Logistics and transportation emissions
    if (input.logistics && Array.isArray(input.logistics)) {
      input.logistics.forEach(log => {
        const factor = log.emissionFactor || this.getTransportFactor(log.mode);
        // Convert to tonne-km (weight in kg / 1000 * distance)
        const tkm = (log.weightkg / 1000) * log.distancekm;
        const emissions = tkm * factor;
        totalEmissions += emissions;

        breakdown.push({
          category: 'logistics',
          detail: `${log.mode} transport`,
          emissions: Math.round(emissions * 100) / 100,
          tkm: Math.round(tkm * 100) / 100,
          factor: factor
        });
      });
    }

    // Upstream energy production (extraction and transmission losses)
    const electricitySources = input.energySources.filter(s => s.sourceType === 'electricity');
    electricitySources.forEach(source => {
      const extractionLossFactor = 0.05; // 5% for extraction and transmission
      const factor = this.getEmissionFactor(source, 'scope2');
      const upstreamEmissions = source.consumption * factor * extractionLossFactor;
      totalEmissions += upstreamEmissions;

      breakdown.push({
        category: 'upstream_energy',
        detail: 'energy_production_transmission',
        emissions: Math.round(upstreamEmissions * 100) / 100,
        factor: extractionLossFactor
      });
    });

    return {
      total: Math.round(totalEmissions * 100) / 100,
      breakdown
    };
  }

  /**
   * Get emission factor for a source
   */
  getEmissionFactor(source, scope) {
    if (source.emissionFactor) {
      return source.emissionFactor;
    }

    if (source.sourceType === 'electricity') {
      const gridRegion = source.gridRegion || 'default';
      return this.defaultEmissionFactors.electricity[gridRegion] ||
        this.defaultEmissionFactors.electricity.default;
    }

    return this.defaultEmissionFactors[source.sourceType] || 0;
  }

  /**
   * Get transport emission factor
   */
  getTransportFactor(mode) {
    const modeKey = (mode || 'road_heavy').toLowerCase().replace(/\s+/g, '_');
    return this.transportFactors[modeKey] || this.transportFactors.road_heavy;
  }

  /**
   * Calculate total emissions across all scopes
   */
  calculateTotalEmissions(scope1, scope2, scope3) {
    const total = scope1.total + scope2.total + scope3.total;

    return {
      tCO2e: Math.round(total * 100) / 100,
      byScope: {
        scope1: scope1.total,
        scope2: scope2.total,
        scope3: scope3.total
      },
      byScopePercentages: {
        scope1: total > 0 ? Math.round((scope1.total / total) * 10000) / 100 : 0,
        scope2: total > 0 ? Math.round((scope2.total / total) * 10000) / 100 : 0,
        scope3: total > 0 ? Math.round((scope3.total / total) * 10000) / 100 : 0
      }
    };
  }

  /**
   * Calculate detailed emissions breakdown
   */
  calculateEmissionsBreakdown(scope1, scope2, scope3) {
    const bySource = [];
    const byActivity = [];

    // Combine all breakdowns
    const allBreakdowns = [
      ...scope1.breakdown.map(b => ({ ...b, scope: 'scope1' })),
      ...scope2.breakdown.map(b => ({ ...b, scope: 'scope2' })),
      ...scope3.breakdown.map(b => ({ ...b, scope: 'scope3' }))
    ];

    const totalEmissions = scope1.total + scope2.total + scope3.total;

    // Group by source category
    const sourceMap = new Map();
    allBreakdowns.forEach(item => {
      const category = item.source || item.category || 'unknown';
      if (!sourceMap.has(category)) {
        sourceMap.set(category, 0);
      }
      sourceMap.set(category, sourceMap.get(category) + item.emissions);
    });

    sourceMap.forEach((emissions, category) => {
      bySource.push({
        category,
        emissions: Math.round(emissions * 100) / 100,
        percentage: totalEmissions > 0 ? Math.round((emissions / totalEmissions) * 10000) / 100 : 0
      });
    });

    // Group by activity type
    const activityMap = new Map();
    allBreakdowns.forEach(item => {
      const activity = item.category || 'energy_use';
      if (!activityMap.has(activity)) {
        activityMap.set(activity, 0);
      }
      activityMap.set(activity, activityMap.get(activity) + item.emissions);
    });

    activityMap.forEach((emissions, activity) => {
      byActivity.push({
        activity,
        emissions: Math.round(emissions * 100) / 100,
        percentage: totalEmissions > 0 ? Math.round((emissions / totalEmissions) * 10000) / 100 : 0
      });
    });

    // Sort by emissions descending
    bySource.sort((a, b) => b.emissions - a.emissions);
    byActivity.sort((a, b) => b.emissions - a.emissions);

    return { bySource, byActivity };
  }

  /**
   * Calculate carbon intensity metrics
   */
  calculateCarbonIntensity(totalEmissions, productionData) {
    if (!productionData || !productionData.outputQuantity || productionData.outputQuantity <= 0) {
      return {
        perUnit: null,
        perRevenue: null,
        perArea: null,
        note: 'Insufficient production data for intensity calculation'
      };
    }

    const total = totalEmissions.tCO2e * 1000; // Convert to kgCO2e

    return {
      perUnit: {
        value: Math.round((total / productionData.outputQuantity) * 1000) / 1000,
        unit: 'kgCO2e per ' + (productionData.outputUnit || 'unit')
      },
      perRevenue: productionData.revenue ?
        Math.round((total / productionData.revenue) * 1000) / 1000 : null,
      perArea: productionData.area ?
        Math.round((totalEmissions.tCO2e / productionData.area) * 1000) / 1000 : null
    };
  }

  /**
   * Map emissions to compliance reporting standards
   */
  mapToComplianceStandards(totalEmissions, reportingStandards) {
    const mappings = [];

    reportingStandards.forEach(standard => {
      switch (standard) {
        case 'GHG_Protocol':
          mappings.push({
            standard: 'GHG Protocol',
            version: 'Corporate Standard',
            scope: 'Corporate',
            requirements: [
              'Scope 1: Direct emissions from owned/controlled sources',
              'Scope 2: Indirect emissions from purchased energy',
              'Scope 3: Other indirect emissions in value chain'
            ],
            complianceStatus: 'Calculated',
            details: {
              scope1Emissions: totalEmissions.byScope.scope1,
              scope2Emissions: totalEmissions.byScope.scope2,
              scope3Emissions: totalEmissions.byScope.scope3
            }
          });
          break;

        case 'ISO_14064':
          mappings.push({
            standard: 'ISO 14064-1',
            version: '2018',
            scope: 'Organizational Level',
            requirements: [
              'GHG inventory design and development',
              'GHG inventory management',
              'GHG inventory quality assurance',
              'GHG report disclosure'
            ],
            complianceStatus: 'Methodology Aligned',
            details: {
              quantificationMethod: 'Calculation based on emission factors',
              uncertaintyAssessment: 'Standard emission factors used'
            }
          });
          break;

        case 'IPCC':
          mappings.push({
            standard: 'IPCC AR5',
            version: 'Fifth Assessment Report',
            scope: 'Global Warming Potential (GWP100)',
            requirements: [
              'Use 100-year GWP values for CO2 equivalent',
              'Apply consistent emission factors',
              'Document data sources and methodologies'
            ],
            complianceStatus: 'Compliant',
            details: {
              gwpHorizon: '100 years',
              methodology: 'IPCC AR5 GWP100'
            }
          });
          break;

        default:
          mappings.push({
            standard: standard,
            complianceStatus: 'Not mapped - manual review required'
          });
      }
    });

    return mappings;
  }

  /**
   * Generate comprehensive carbon footprint report
   */
  generateCarbonFootprintReport(totalEmissions, emissionsBreakdown, carbonIntensity, reportingPeriod) {
    return {
      generatedAt: new Date().toISOString(),
      reportingPeriod: reportingPeriod || {
        start: 'Not specified',
        end: 'Not specified'
      },
      boundaries: {
        operationalBoundary: 'Manufacturing facility and related operations',
        includedScopes: [1, 2, 3],
        excludedSources: 'None specified'
      },
      summary: {
        totalEmissions: totalEmissions.tCO2e,
        unit: 'tonnes CO2 equivalent (tCO2e)',
        scopeDistribution: totalEmissions.byScopePercentages
      },
      keyDrivers: emissionsBreakdown.bySource.slice(0, 3),
      intensityMetrics: carbonIntensity
    };
  }

  /**
   * Handle errors gracefully
   */
  handleError(error) {
    return {
      success: false,
      error: {
        message: error.message,
        type: error.name || 'CalculationError'
      }
    };
  }
}

module.exports = CarbonEmissionCalculator;

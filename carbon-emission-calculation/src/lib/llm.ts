import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  console.log('chatCompletion messages:', JSON.stringify(messages, null, 2));
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.7',
    messages,
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content || '';
}

export interface CarbonAnalysisInput {
  energySources?: Array<{
    sourceType: string;
    consumption: number;
    unit?: string;
    emissionFactor: number;
    gridRegion?: string;
  }>;
  rawMaterials?: Array<{
    materialType: string;
    quantity: number;
    unit?: string;
    origin?: string;
    emissionFactor: number;
  }>;
  logistics?: Array<{
    mode: string;
    distancekm: number;
    weightkg: number;
    emissionFactor?: number;
  }>;
  productionData?: {
    outputQuantity: number;
    outputUnit: string;
  };
  reportingStandards?: string[];
}

export interface CarbonAnalysisResult {
  totalEmissions: {
    tCO2e: number;
    byScope: {
      scope1: number;
      scope2: number;
      scope3: number;
    };
  };
  emissionsBreakdown: {
    bySource: Array<{ category: string; emissions: number; percentage: number }>;
    byActivity: Array<{ activity: string; emissions: number; percentage: number }>;
  };
  carbonIntensity: {
    perUnit: number;
    perRevenue: number;
    perArea: number;
  };
  complianceMapping: Array<{
    standard: string;
    scope: string;
    requirements: string[];
    complianceStatus: string;
  }>;
}

export async function analyzeCarbonEmissions(input: CarbonAnalysisInput): Promise<CarbonAnalysisResult> {
  console.log('analyzeCarbonEmissions input:', JSON.stringify(input, null, 2));

  // Default emission factors
  const defaultFactors: Record<string, number> = {
    electricity_china: 0.853,
    natural_gas: 0.202,
    diesel: 0.267,
    coal: 0.354,
    road_transport: 0.107,
    rail_transport: 0.028,
    sea_transport: 0.015,
    air_transport: 0.5,
  };

  // Calculate Scope 1 (direct emissions)
  let scope1Emissions = 0;
  const scope1Sources: Array<{ name: string; emissions: number }> = [];

  if (input.energySources) {
    input.energySources.forEach(source => {
      // Direct combustion sources (non-electricity)
      if (source.sourceType !== 'electricity' && source.sourceType !== 'renewable') {
        const factor = source.emissionFactor || defaultFactors[source.sourceType] || 0;
        const emissions = source.consumption * factor / 1000; // Convert to tCO2e
        scope1Emissions += emissions;
        scope1Sources.push({
          name: getSourceName(source.sourceType),
          emissions
        });
      }
    });
  }

  // Calculate Scope 2 (indirect energy emissions)
  let scope2Emissions = 0;
  const scope2Sources: Array<{ name: string; emissions: number }> = [];

  if (input.energySources) {
    input.energySources.forEach(source => {
      // Electricity and purchased energy
      if (source.sourceType === 'electricity') {
        const factor = source.emissionFactor || (source.gridRegion?.toLowerCase().includes('china') ? 0.853 : 0.5);
        const emissions = source.consumption * factor / 1000; // Convert to tCO2e
        scope2Emissions += emissions;
        scope2Sources.push({
          name: `电力 (${source.gridRegion || 'Grid'})`,
          emissions
        });
      }
    });
  }

  // Calculate Scope 3 (value chain emissions)
  let scope3Emissions = 0;
  const scope3Sources: Array<{ name: string; emissions: number }> = [];

  // Raw materials emissions
  if (input.rawMaterials) {
    input.rawMaterials.forEach(material => {
      const factor = material.emissionFactor || 2.5;
      const emissions = material.quantity * factor / 1000; // Convert to tCO2e
      scope3Emissions += emissions;
      scope3Sources.push({
        name: `原材料: ${material.materialType}`,
        emissions
      });
    });
  }

  // Logistics emissions
  if (input.logistics) {
    input.logistics.forEach(log => {
      const factor = log.emissionFactor || defaultFactors[`${log.mode}_transport`] || 0.1;
      const tkm = (log.distancekm * log.weightkg) / 1000; // Convert kg to t, get tkm
      const emissions = tkm * factor / 1000; // Convert to tCO2e
      scope3Emissions += emissions;
      scope3Sources.push({
        name: `物流: ${getModeName(log.mode)}`,
        emissions
      });
    });
  }

  const totalEmissions = scope1Emissions + scope2Emissions + scope3Emissions;

  // Build bySource breakdown
  const bySource: Array<{ category: string; emissions: number; percentage: number }> = [];
  scope1Sources.forEach(s => {
    bySource.push({
      category: `Scope 1 - ${s.name}`,
      emissions: s.emissions,
      percentage: totalEmissions > 0 ? (s.emissions / totalEmissions) * 100 : 0
    });
  });
  scope2Sources.forEach(s => {
    bySource.push({
      category: `Scope 2 - ${s.name}`,
      emissions: s.emissions,
      percentage: totalEmissions > 0 ? (s.emissions / totalEmissions) * 100 : 0
    });
  });
  scope3Sources.forEach(s => {
    bySource.push({
      category: `Scope 3 - ${s.name}`,
      emissions: s.emissions,
      percentage: totalEmissions > 0 ? (s.emissions / totalEmissions) * 100 : 0
    });
  });

  // Build byActivity breakdown
  const byActivity: Array<{ activity: string; emissions: number; percentage: number }> = [];
  if (scope1Emissions > 0) {
    byActivity.push({
      activity: '直接燃烧',
      emissions: scope1Emissions,
      percentage: totalEmissions > 0 ? (scope1Emissions / totalEmissions) * 100 : 0
    });
  }
  if (scope2Emissions > 0) {
    byActivity.push({
      activity: '电力消耗',
      emissions: scope2Emissions,
      percentage: totalEmissions > 0 ? (scope2Emissions / totalEmissions) * 100 : 0
    });
  }
  if (input.rawMaterials && input.rawMaterials.length > 0) {
    byActivity.push({
      activity: '原材料生产',
      emissions: scope3Emissions * 0.6, // Estimate 60% of Scope 3 from materials
      percentage: totalEmissions > 0 ? ((scope3Emissions * 0.6) / totalEmissions) * 100 : 0
    });
  }
  if (input.logistics && input.logistics.length > 0) {
    byActivity.push({
      activity: '物流运输',
      emissions: scope3Emissions * 0.4, // Estimate 40% of Scope 3 from logistics
      percentage: totalEmissions > 0 ? ((scope3Emissions * 0.4) / totalEmissions) * 100 : 0
    });
  }

  // Calculate carbon intensity
  const outputQty = input.productionData?.outputQuantity || 1;
  const carbonIntensity = {
    perUnit: totalEmissions / outputQty,
    perRevenue: totalEmissions / 10000, // Assuming revenue in 10k units
    perArea: totalEmissions / 1000, // Assuming area in 1000 m²
  };

  // Build compliance mapping
  const standards = input.reportingStandards || ['GHG_Protocol'];
  const complianceMapping: CarbonAnalysisResult['complianceMapping'] = standards.map(std => {
    const info = getStandardInfo(std);
    const hasAllScopes = scope1Emissions > 0 && scope2Emissions > 0 && scope3Emissions > 0;
    const isCompliant = std === 'GHG_Protocol' ? hasAllScopes : scope1Emissions > 0;

    return {
      standard: info.name,
      scope: info.scope,
      requirements: info.requirements,
      complianceStatus: isCompliant ? 'Compliant' : 'Partial Compliance',
    };
  });

  return {
    totalEmissions: {
      tCO2e: totalEmissions,
      byScope: {
        scope1: scope1Emissions,
        scope2: scope2Emissions,
        scope3: scope3Emissions,
      },
    },
    emissionsBreakdown: {
      bySource,
      byActivity,
    },
    carbonIntensity,
    complianceMapping,
  };
}

function getSourceName(sourceType: string): string {
  const names: Record<string, string> = {
    natural_gas: '天然气',
    diesel: '柴油',
    coal: '煤炭',
    renewable: '可再生能源',
  };
  return names[sourceType] || sourceType;
}

function getModeName(mode: string): string {
  const names: Record<string, string> = {
    road: '公路运输',
    rail: '铁路运输',
    sea: '海运',
    air: '航空运输',
  };
  return names[mode] || mode;
}

function getStandardInfo(standard: string): { name: string; scope: string; requirements: string[] } {
  const standards: Record<string, { name: string; scope: string; requirements: string[] }> = {
    GHG_Protocol: {
      name: 'GHG Protocol',
      scope: 'Scope 1, 2, 3',
      requirements: [
        '组织边界和运营边界界定',
        'GHG排放量化和报告',
        '温室气体排放因子选择',
      ],
    },
    ISO_14064: {
      name: 'ISO 14064',
      scope: '组织层面',
      requirements: [
        'GHG排放清单编制',
        '温室气体源和汇识别',
        '数据质量管理',
      ],
    },
    IPCC: {
      name: 'IPCC Guidelines',
      scope: '国家级排放因子',
      requirements: [
        '排放因子使用',
        '不确定性评估',
        '方法一致性',
      ],
    },
  };
  return standards[standard] || { name: standard, scope: 'Unknown', requirements: [] };
}

export function mockAnalyze(input: CarbonAnalysisInput): CarbonAnalysisResult {
  // Simulated calculation for demo
  const energyEmissions = (input.energySources || []).reduce((sum, s) => {
    const factor = s.emissionFactor || 0.853;
    return sum + s.consumption * factor / 1000;
  }, 0);

  const materialEmissions = (input.rawMaterials || []).reduce((sum, m) => {
    const factor = m.emissionFactor || 2.5;
    return sum + m.quantity * factor / 1000;
  }, 0);

  const logisticsEmissions = (input.logistics || []).reduce((sum, l) => {
    const factor = l.emissionFactor || 0.107;
    const tkm = (l.distancekm * l.weightkg) / 1000;
    return sum + tkm * factor / 1000;
  }, 0);

  const scope1 = energyEmissions * 0.3;
  const scope2 = energyEmissions * 0.7;
  const scope3 = materialEmissions + logisticsEmissions;
  const totalEmissions = scope1 + scope2 + scope3;

  const outputQty = input.productionData?.outputQuantity || 1000;

  return {
    totalEmissions: {
      tCO2e: totalEmissions,
      byScope: {
        scope1,
        scope2,
        scope3,
      },
    },
    emissionsBreakdown: {
      bySource: [
        { category: 'Scope 1 - 天然气燃烧', emissions: scope1 * 0.6, percentage: (scope1 * 0.6 / totalEmissions) * 100 },
        { category: 'Scope 1 - 柴油燃烧', emissions: scope1 * 0.4, percentage: (scope1 * 0.4 / totalEmissions) * 100 },
        { category: 'Scope 2 - 电力消耗', emissions: scope2, percentage: (scope2 / totalEmissions) * 100 },
        { category: 'Scope 3 - 原材料生产', emissions: materialEmissions, percentage: (materialEmissions / totalEmissions) * 100 },
        { category: 'Scope 3 - 物流运输', emissions: logisticsEmissions, percentage: (logisticsEmissions / totalEmissions) * 100 },
      ],
      byActivity: [
        { activity: '能源燃烧', emissions: scope1, percentage: (scope1 / totalEmissions) * 100 },
        { activity: '电力消耗', emissions: scope2, percentage: (scope2 / totalEmissions) * 100 },
        { activity: '原材料获取', emissions: materialEmissions * 0.8, percentage: ((materialEmissions * 0.8) / totalEmissions) * 100 },
        { activity: '物流运输', emissions: logisticsEmissions, percentage: (logisticsEmissions / totalEmissions) * 100 },
      ],
    },
    carbonIntensity: {
      perUnit: totalEmissions / outputQty,
      perRevenue: totalEmissions / 10000,
      perArea: totalEmissions / 1000,
    },
    complianceMapping: (input.reportingStandards || ['GHG_Protocol']).map(std => {
      const info = getStandardInfo(std);
      return {
        standard: info.name,
        scope: info.scope,
        requirements: info.requirements,
        complianceStatus: 'Compliant',
      };
    }),
  };
}

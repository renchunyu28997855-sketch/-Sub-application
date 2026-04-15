export interface CarbonTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  inputData: {
    energySources: Array<{
      sourceType: string;
      consumption: number;
      unit: string;
      emissionFactor: number;
      gridRegion?: string;
    }>;
    rawMaterials: Array<{
      materialType: string;
      quantity: number;
      unit: string;
      origin: string;
      emissionFactor: number;
    }>;
    logistics: Array<{
      mode: string;
      distancekm: number;
      weightkg: number;
      emissionFactor: number;
    }>;
    productionData: {
      outputQuantity: number;
      outputUnit: string;
    };
    reportingStandards: string[];
  };
}

export const templates: CarbonTemplate[] = [
  {
    id: 'factory-monthly-audit',
    name: '工厂月度碳核查',
    category: '工厂碳核算',
    description: '针对工厂月度能源消耗数据进行碳排放核算，包含电力、天然气、柴油等能源消耗',
    inputData: {
      energySources: [
        { sourceType: 'electricity', consumption: 500000, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China-East' },
        { sourceType: 'natural_gas', consumption: 20000, unit: 'm³', emissionFactor: 0.202 },
        { sourceType: 'diesel', consumption: 5000, unit: 'L', emissionFactor: 0.267 },
      ],
      rawMaterials: [],
      logistics: [],
      productionData: { outputQuantity: 10000, outputUnit: '吨' },
      reportingStandards: ['GHG_Protocol', 'ISO_14064'],
    },
  },
  {
    id: 'product-carbon-footprint',
    name: '产品碳足迹分析',
    category: '产品碳足迹',
    description: '分析产品全生命周期碳排放，包括原材料获取、生产制造、物流运输等环节',
    inputData: {
      energySources: [
        { sourceType: 'electricity', consumption: 10000, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China' },
      ],
      rawMaterials: [
        { materialType: '钢材', quantity: 500, unit: 'kg', origin: '河北', emissionFactor: 2.5 },
        { materialType: '塑料', quantity: 200, unit: 'kg', origin: '江苏', emissionFactor: 3.2 },
        { materialType: '电子元件', quantity: 50, unit: 'kg', origin: '广东', emissionFactor: 5.8 },
      ],
      logistics: [
        { mode: 'road', distancekm: 500, weightkg: 750, emissionFactor: 0.107 },
        { mode: 'sea', distancekm: 2000, weightkg: 750, emissionFactor: 0.015 },
      ],
      productionData: { outputQuantity: 1000, outputUnit: '件' },
      reportingStandards: ['GHG_Protocol', 'IPCC'],
    },
  },
  {
    id: 'supply-chain-audit',
    name: '供应链碳排放审计',
    category: '供应链审计',
    description: '对供应商物料和物流运输环节进行碳排放核算，评估供应链碳足迹',
    inputData: {
      energySources: [],
      rawMaterials: [
        { materialType: '铝材', quantity: 1000, unit: 'kg', origin: '山东', emissionFactor: 12.0 },
        { materialType: '铜材', quantity: 500, unit: 'kg', origin: '江西', emissionFactor: 5.5 },
        { materialType: '纸箱', quantity: 200, unit: 'kg', origin: '浙江', emissionFactor: 1.2 },
        { materialType: '泡沫', quantity: 100, unit: 'kg', origin: '江苏', emissionFactor: 3.5 },
      ],
      logistics: [
        { mode: 'road', distancekm: 800, weightkg: 1800, emissionFactor: 0.107 },
        { mode: 'rail', distancekm: 1200, weightkg: 1800, emissionFactor: 0.028 },
      ],
      productionData: { outputQuantity: 5000, outputUnit: '套' },
      reportingStandards: ['GHG_Protocol', 'ISO_14064', 'IPCC'],
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];

export const reportingStandards = [
  { id: 'GHG_Protocol', name: 'GHG Protocol', description: '温室气体核算体系' },
  { id: 'ISO_14064', name: 'ISO 14064', description: '温室气体核算与报告规范' },
  { id: 'IPCC', name: 'IPCC', description: '政府间气候变化专门委员会指南' },
];

export const energySourceTypes = [
  { value: 'electricity', label: '电力', unit: 'kWh' },
  { value: 'natural_gas', label: '天然气', unit: 'm³' },
  { value: 'diesel', label: '柴油', unit: 'L' },
  { value: 'coal', label: '煤炭', unit: 'kg' },
  { value: 'renewable', label: '可再生能源', unit: 'kWh' },
];

export const logisticsModes = [
  { value: 'road', label: '公路运输', unit: 'tkm' },
  { value: 'rail', label: '铁路运输', unit: 'tkm' },
  { value: 'sea', label: '海运', unit: 'tkm' },
  { value: 'air', label: '航空运输', unit: 'tkm' },
];

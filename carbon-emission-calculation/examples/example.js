/**
 * Carbon Emission Calculation - Example Usage
 */

const CarbonEmissionCalculator = require('../index.js');

// Initialize the calculator
const calculator = new CarbonEmissionCalculator({
  reportingCurrency: 'CNY'
});

// Energy sources data
const energySources = [
  { sourceType: 'electricity', consumption: 850000, gridRegion: 'china_east' },
  { sourceType: 'natural_gas', consumption: 125000 },
  { sourceType: 'diesel', consumption: 15000 },
  { sourceType: 'renewable', consumption: 45000 }
];

// Raw materials data
const rawMaterials = [
  { materialType: 'steel', quantity: 25000, emissionFactor: 2.5 },
  { materialType: 'aluminum', quantity: 5000, emissionFactor: 12.0 },
  { materialType: 'plastic', quantity: 8000, emissionFactor: 3.0 },
  { materialType: 'copper', quantity: 1200, emissionFactor: 3.5 }
];

// Logistics data
const logistics = [
  { mode: 'road_heavy', distancekm: 450, weightkg: 35000 },
  { mode: 'road_heavy', distancekm: 280, weightkg: 18000 },
  { mode: 'rail', distancekm: 850, weightkg: 42000 },
  { mode: 'sea', distancekm: 3200, weightkg: 65000 }
];

// Production data
const productionData = {
  outputQuantity: 50000,
  outputUnit: 'units',
  revenue: 15000000,
  area: 5000
};

// Reporting standards
const reportingStandards = ['GHG_Protocol', 'ISO_14064', 'IPCC'];

// Reporting period
const reportingPeriod = {
  start: '2026-01-01',
  end: '2026-03-31'
};

// Calculate carbon emissions
const result = calculator.process({
  energySources,
  rawMaterials,
  logistics,
  productionData,
  reportingStandards,
  reportingPeriod
});

console.log('=== Carbon Emission Calculation Results ===\n');
console.log(JSON.stringify(result, null, 2));

# Carbon Emission Calculation - Technical Specification

## Skill Profile

- **Skill ID**: carbon-emission-calculation
- **Category**: Energy Management (Batch 9)
- **Function**: Calculate and analyze carbon emissions across factory, process, and product levels
- **Complexity**: High

## Emission Scopes

### Scope 1 - Direct Emissions
- Natural gas combustion
- Diesel generators
- Company vehicles
- Refrigerant leaks

### Scope 2 - Indirect Emissions (Energy)
- Purchased electricity
- Purchased steam
- District heating/cooling

### Scope 3 - Value Chain Emissions
- Raw material extraction
- Transportation and logistics
- Employee commuting
- Waste disposal
- Upstream energy production

## Input Schema

```javascript
{
  energySources: [{
    sourceType: String,       // "electricity" | "natural_gas" | "diesel" | "coal" | "renewable"
    consumption: Number,       // kWh or appropriate unit
    emissionFactor: Number,    // kgCO2e per unit (if known)
    gridRegion: String         // For electricity emission factors
  }],
  rawMaterials: [{
    materialType: String,
    quantity: Number,
    unit: String,
    origin: String,
    emissionFactor: Number     // kgCO2e per kg
  }],
  logistics: [{
    mode: String,              // "road" | "rail" | "sea" | "air"
    distancekm: Number,
    weightkg: Number,
    emissionFactor: Number     // kgCO2e per tkm
  }],
  productionData: {
    outputQuantity: Number,
    outputUnit: String
  },
  reportingStandards: [String]  // ["GHG_Protocol", "ISO_14064", "IPCC"]
}
```

## Output Schema

```javascript
{
  totalEmissions: {
    tCO2e: Number,
    byScope: {
      scope1: Number,
      scope2: Number,
      scope3: Number
    }
  },
  emissionsBreakdown: {
    bySource: [{ category: String, emissions: Number, percentage: Number }],
    byActivity: [{ activity: String, emissions: Number, percentage: Number }]
  },
  carbonIntensity: {
    perUnit: Number,
    perRevenue: Number,
    perArea: Number
  },
  complianceMapping: [{
    standard: String,
    scope: String,
    requirements: [String],
    complianceStatus: String
  }],
  carbonFootprintReport: {
    generatedAt: String,
    reportingPeriod: Object,
    boundaries: Object
  }
}
```

## Processing Logic

1. **Scope 1 Calculation**: Direct combustion emissions using emission factors
2. **Scope 2 Calculation**: Electricity/energy indirect emissions with grid factors
3. **Scope 3 Calculation**: Supply chain emissions from materials and logistics
4. **Intensity Calculation**: Normalize by production output
5. **Compliance Mapping**: Match calculations to reporting standards

## Emission Factors (Default)

| Source Type | Emission Factor | Unit |
|-------------|-----------------|------|
| Grid Electricity (China) | 0.853 | kgCO2e/kWh |
| Natural Gas | 0.202 | kgCO2e/kWh |
| Diesel | 0.267 | kgCO2e/kWh |
| Coal (avg) | 0.354 | kgCO2e/kWh |
| Road Transport | 0.107 | kgCO2e/tkm |

## Error Handling

- Unknown emission factor: Return error with missing factor
- Negative consumption values: Treat as zero
- Missing grid region: Use national average factor
- Division by zero in intensity: Return null

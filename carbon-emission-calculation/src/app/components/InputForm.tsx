'use client';

import { useState } from 'react';
import { templates, categories, reportingStandards, energySourceTypes, logisticsModes, CarbonTemplate } from './templates';
import './InputForm.css';

interface EnergySource {
  sourceType: string;
  consumption: number;
  unit: string;
  emissionFactor: number;
  gridRegion: string;
}

interface RawMaterial {
  materialType: string;
  quantity: number;
  unit: string;
  origin: string;
  emissionFactor: number;
}

interface Logistics {
  mode: string;
  distancekm: number;
  weightkg: number;
  emissionFactor: number;
}

interface ProductionData {
  outputQuantity: number;
  outputUnit: string;
}

interface CarbonAnalysisResult {
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

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CarbonAnalysisResult | null>(null);
  const [error, setError] = useState('');

  // Form state for custom mode
  const [energySources, setEnergySources] = useState<EnergySource[]>([
    { sourceType: 'electricity', consumption: 0, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China' }
  ]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [logistics, setLogistics] = useState<Logistics[]>([]);
  const [productionData, setProductionData] = useState<ProductionData>({ outputQuantity: 0, outputUnit: '件' });
  const [standards, setStandards] = useState<string[]>(['GHG_Protocol']);

  const handleApplyTemplate = (template: CarbonTemplate) => {
    setSelectedTemplate(template.id);
    setShowDropdown(false);

    // Apply energy sources
    const mappedEnergy = template.inputData.energySources.map(e => ({
      sourceType: e.sourceType,
      consumption: e.consumption,
      unit: e.unit,
      emissionFactor: e.emissionFactor,
      gridRegion: e.gridRegion || 'China'
    }));
    setEnergySources(mappedEnergy.length > 0 ? mappedEnergy : [{ sourceType: 'electricity', consumption: 0, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China' }]);

    // Apply raw materials
    setRawMaterials(template.inputData.rawMaterials.map(m => ({
      materialType: m.materialType,
      quantity: m.quantity,
      unit: m.unit,
      origin: m.origin,
      emissionFactor: m.emissionFactor
    })));

    // Apply logistics
    setLogistics(template.inputData.logistics.map(l => ({
      mode: l.mode,
      distancekm: l.distancekm,
      weightkg: l.weightkg,
      emissionFactor: l.emissionFactor
    })));

    // Apply production data
    setProductionData(template.inputData.productionData);

    // Apply standards
    setStandards(template.inputData.reportingStandards);
  };

  const handleReset = () => {
    setSelectedTemplate('');
    setEnergySources([{ sourceType: 'electricity', consumption: 0, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China' }]);
    setRawMaterials([]);
    setLogistics([]);
    setProductionData({ outputQuantity: 0, outputUnit: '件' });
    setStandards(['GHG_Protocol']);
    setResult(null);
  };

  const handleAddEnergySource = () => {
    setEnergySources([...energySources, { sourceType: 'electricity', consumption: 0, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China' }]);
  };

  const handleRemoveEnergySource = (index: number) => {
    setEnergySources(energySources.filter((_, i) => i !== index));
  };

  const handleEnergySourceChange = (index: number, field: keyof EnergySource, value: string | number) => {
    const updated = [...energySources];
    updated[index] = { ...updated[index], [field]: value };
    setEnergySources(updated);
  };

  const handleAddRawMaterial = () => {
    setRawMaterials([...rawMaterials, { materialType: '', quantity: 0, unit: 'kg', origin: '', emissionFactor: 2.5 }]);
  };

  const handleRemoveRawMaterial = (index: number) => {
    setRawMaterials(rawMaterials.filter((_, i) => i !== index));
  };

  const handleRawMaterialChange = (index: number, field: keyof RawMaterial, value: string | number) => {
    const updated = [...rawMaterials];
    updated[index] = { ...updated[index], [field]: value };
    setRawMaterials(updated);
  };

  const handleAddLogistics = () => {
    setLogistics([...logistics, { mode: 'road', distancekm: 0, weightkg: 0, emissionFactor: 0.107 }]);
  };

  const handleRemoveLogistics = (index: number) => {
    setLogistics(logistics.filter((_, i) => i !== index));
  };

  const handleLogisticsChange = (index: number, field: keyof Logistics, value: string | number) => {
    const updated = [...logistics];
    updated[index] = { ...updated[index], [field]: value };
    setLogistics(updated);
  };

  const handleStandardToggle = (standardId: string) => {
    if (standards.includes(standardId)) {
      setStandards(standards.filter(s => s !== standardId));
    } else {
      setStandards([...standards, standardId]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const inputData = {
        energySources: energySources.filter(e => e.consumption > 0),
        rawMaterials: rawMaterials.filter(m => m.quantity > 0),
        logistics: logistics.filter(l => l.distancekm > 0 && l.weightkg > 0),
        productionData,
        reportingStandards: standards,
      };

      const res = await fetch('/carbon-emission-calculation/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '分析失败');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    );
  };

  const hasValidInput = () => {
    const hasEnergy = energySources.some(e => e.consumption > 0);
    const hasMaterials = rawMaterials.some(m => m.quantity > 0);
    const hasLogistics = logistics.some(l => l.distancekm > 0 && l.weightkg > 0);
    const hasProduction = productionData.outputQuantity > 0;
    return hasEnergy || hasMaterials || hasLogistics || hasProduction;
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <a href="http://47.112.29.121/" className="back-home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回主页
          </a>
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                <path d="M12 2a7 7 0 0 1 7 7"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>碳排放计算系统</h1>
              <p>智能碳排放核算与分析，支持工厂、产品和供应链碳足迹分析</p>
            </div>
          </div>
        </header>

        <section className="input-section">
          <div className="mode-tabs">
            <button
              className={`tab ${mode === 'template' ? 'active' : ''}`}
              onClick={() => setMode('template')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
              </svg>
              模板选择
            </button>
            <button
              className={`tab ${mode === 'custom' ? 'active' : ''}`}
              onClick={() => setMode('custom')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              自定义输入
            </button>
          </div>

          <div className="card">
            {mode === 'template' ? (
              <div className="form-content">
                <div className="template-selector">
                  <div className="template-header">
                    <label className="form-label">选择分析模板</label>
                    {selectedTemplate && (
                      <button className="btn-reset" onClick={handleReset}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        清空
                      </button>
                    )}
                  </div>
                  <div className="dropdown-container">
                    <button
                      className={`dropdown-trigger ${showDropdown ? 'open' : ''}`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="dropdown-text">
                        {selectedTemplate
                          ? templates.find(t => t.id === selectedTemplate)?.name
                          : '请选择分析模板...'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        {categories.map(category => (
                          <div key={category} className="dropdown-category">
                            <div className="category-label">
                              {getCategoryIcon(category)}
                              {category}
                            </div>
                            <div className="category-templates">
                              {templates.filter(t => t.category === category).map(template => (
                                <button
                                  key={template.id}
                                  className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                                  onClick={() => handleApplyTemplate(template)}
                                >
                                  {template.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedTemplate && (
                  <>
                    <div className="form-section">
                      <div className="form-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        能源消耗
                      </div>
                      {energySources.map((source, idx) => (
                        <div key={idx} className="energy-source-item">
                          <div className="energy-source-grid-3">
                            <div>
                              <label className="form-label-sm">能源类型</label>
                              <select
                                className="input"
                                value={source.sourceType}
                                onChange={(e) => handleEnergySourceChange(idx, 'sourceType', e.target.value)}
                              >
                                {energySourceTypes.map(type => (
                                  <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="form-label-sm">消耗量</label>
                              <input
                                type="number"
                                className="input"
                                value={source.consumption || ''}
                                onChange={(e) => handleEnergySourceChange(idx, 'consumption', parseFloat(e.target.value) || 0)}
                                placeholder="消耗量"
                              />
                            </div>
                            <div>
                              <label className="form-label-sm">排放因子</label>
                              <input
                                type="number"
                                className="input"
                                value={source.emissionFactor || ''}
                                onChange={(e) => handleEnergySourceChange(idx, 'emissionFactor', parseFloat(e.target.value) || 0)}
                                placeholder="kgCO2e/单位"
                              />
                            </div>
                          </div>
                          {source.sourceType === 'electricity' && (
                            <div style={{ marginTop: '8px' }}>
                              <label className="form-label-sm">电网区域</label>
                              <input
                                type="text"
                                className="input"
                                value={source.gridRegion}
                                onChange={(e) => handleEnergySourceChange(idx, 'gridRegion', e.target.value)}
                                placeholder="如: China, China-East"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {rawMaterials.length > 0 && (
                      <div className="form-section">
                        <div className="form-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          </svg>
                          原材料
                        </div>
                        {rawMaterials.map((material, idx) => (
                          <div key={idx} className="material-item">
                            <div className="material-grid">
                              <div>
                                <label className="form-label-sm">材料类型</label>
                                <input
                                  type="text"
                                  className="input"
                                  value={material.materialType}
                                  onChange={(e) => handleRawMaterialChange(idx, 'materialType', e.target.value)}
                                  placeholder="如: 钢材"
                                />
                              </div>
                              <div>
                                <label className="form-label-sm">数量</label>
                                <input
                                  type="number"
                                  className="input"
                                  value={material.quantity || ''}
                                  onChange={(e) => handleRawMaterialChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                  placeholder="数量"
                                />
                              </div>
                              <div>
                                <label className="form-label-sm">排放因子</label>
                                <input
                                  type="number"
                                  className="input"
                                  value={material.emissionFactor || ''}
                                  onChange={(e) => handleRawMaterialChange(idx, 'emissionFactor', parseFloat(e.target.value) || 0)}
                                  placeholder="kgCO2e/kg"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {logistics.length > 0 && (
                      <div className="form-section">
                        <div className="form-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13"/>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/>
                            <circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                          物流运输
                        </div>
                        {logistics.map((log, idx) => (
                          <div key={idx} className="logistics-item">
                            <div className="logistics-grid">
                              <div>
                                <label className="form-label-sm">运输方式</label>
                                <select
                                  className="input"
                                  value={log.mode}
                                  onChange={(e) => handleLogisticsChange(idx, 'mode', e.target.value)}
                                >
                                  {logisticsModes.map(mode => (
                                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="form-label-sm">距离(km)</label>
                                <input
                                  type="number"
                                  className="input"
                                  value={log.distancekm || ''}
                                  onChange={(e) => handleLogisticsChange(idx, 'distancekm', parseFloat(e.target.value) || 0)}
                                  placeholder="距离"
                                />
                              </div>
                              <div>
                                <label className="form-label-sm">重量(kg)</label>
                                <input
                                  type="number"
                                  className="input"
                                  value={log.weightkg || ''}
                                  onChange={(e) => handleLogisticsChange(idx, 'weightkg', parseFloat(e.target.value) || 0)}
                                  placeholder="重量"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="form-section">
                      <div className="form-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20V10"/>
                          <path d="M18 20V4"/>
                          <path d="M6 20v-4"/>
                        </svg>
                        生产数据
                      </div>
                      <div className="production-grid">
                        <div>
                          <label className="form-label-sm">产量</label>
                          <input
                            type="number"
                            className="input"
                            value={productionData.outputQuantity || ''}
                            onChange={(e) => setProductionData({ ...productionData, outputQuantity: parseFloat(e.target.value) || 0 })}
                            placeholder="产量"
                          />
                        </div>
                        <div>
                          <label className="form-label-sm">单位</label>
                          <input
                            type="text"
                            className="input"
                            value={productionData.outputUnit}
                            onChange={(e) => setProductionData({ ...productionData, outputUnit: e.target.value })}
                            placeholder="如: 件、吨"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="form-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        报告标准
                      </div>
                      <div className="standards-grid">
                        {reportingStandards.map(std => (
                          <label
                            key={std.id}
                            className={`standard-checkbox ${standards.includes(std.id) ? 'checked' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={standards.includes(std.id)}
                              onChange={() => handleStandardToggle(std.id)}
                            />
                            <span className="checkmark">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                            <span>{std.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  className={`btn-primary ${!selectedTemplate || loading ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !selectedTemplate}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      开始分析
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="form-content">
                <div className="form-section">
                  <div className="form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    能源消耗
                  </div>
                  {energySources.map((source, idx) => (
                    <div key={idx} className="energy-source-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>能源 {idx + 1}</span>
                        {energySources.length > 1 && (
                          <button
                            className="btn-reset"
                            onClick={() => handleRemoveEnergySource(idx)}
                            style={{ padding: '2px 8px' }}
                          >
                            删除
                          </button>
                        )}
                      </div>
                      <div className="energy-source-grid-3">
                        <div>
                          <label className="form-label-sm">能源类型</label>
                          <select
                            className="input"
                            value={source.sourceType}
                            onChange={(e) => handleEnergySourceChange(idx, 'sourceType', e.target.value)}
                          >
                            {energySourceTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label-sm">消耗量</label>
                          <input
                            type="number"
                            className="input"
                            value={source.consumption || ''}
                            onChange={(e) => handleEnergySourceChange(idx, 'consumption', parseFloat(e.target.value) || 0)}
                            placeholder="消耗量"
                          />
                        </div>
                        <div>
                          <label className="form-label-sm">排放因子</label>
                          <input
                            type="number"
                            className="input"
                            value={source.emissionFactor || ''}
                            onChange={(e) => handleEnergySourceChange(idx, 'emissionFactor', parseFloat(e.target.value) || 0)}
                            placeholder="kgCO2e/单位"
                          />
                        </div>
                      </div>
                      {source.sourceType === 'electricity' && (
                        <div style={{ marginTop: '8px' }}>
                          <label className="form-label-sm">电网区域</label>
                          <input
                            type="text"
                            className="input"
                            value={source.gridRegion}
                            onChange={(e) => handleEnergySourceChange(idx, 'gridRegion', e.target.value)}
                            placeholder="如: China, China-East"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={handleAddEnergySource}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    添加能源
                  </button>
                </div>

                <div className="form-section">
                  <div className="form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    原材料
                  </div>
                  {rawMaterials.map((material, idx) => (
                    <div key={idx} className="material-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>材料 {idx + 1}</span>
                        <button
                          className="btn-reset"
                          onClick={() => handleRemoveRawMaterial(idx)}
                          style={{ padding: '2px 8px' }}
                        >
                          删除
                        </button>
                      </div>
                      <div className="material-grid">
                        <div>
                          <label className="form-label-sm">材料类型</label>
                          <input
                            type="text"
                            className="input"
                            value={material.materialType}
                            onChange={(e) => handleRawMaterialChange(idx, 'materialType', e.target.value)}
                            placeholder="如: 钢材"
                          />
                        </div>
                        <div>
                          <label className="form-label-sm">数量</label>
                          <input
                            type="number"
                            className="input"
                            value={material.quantity || ''}
                            onChange={(e) => handleRawMaterialChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="数量"
                          />
                        </div>
                        <div>
                          <label className="form-label-sm">排放因子</label>
                          <input
                            type="number"
                            className="input"
                            value={material.emissionFactor || ''}
                            onChange={(e) => handleRawMaterialChange(idx, 'emissionFactor', parseFloat(e.target.value) || 0)}
                            placeholder="kgCO2e/kg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={handleAddRawMaterial}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    添加材料
                  </button>
                </div>

                <div className="form-section">
                  <div className="form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    物流运输
                  </div>
                  {logistics.map((log, idx) => (
                    <div key={idx} className="logistics-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>物流 {idx + 1}</span>
                        <button
                          className="btn-reset"
                          onClick={() => handleRemoveLogistics(idx)}
                          style={{ padding: '2px 8px' }}
                        >
                          删除
                        </button>
                      </div>
                      <div className="logistics-grid">
                        <div>
                          <label className="form-label-sm">运输方式</label>
                          <select
                            className="input"
                            value={log.mode}
                            onChange={(e) => handleLogisticsChange(idx, 'mode', e.target.value)}
                          >
                            {logisticsModes.map(mode => (
                              <option key={mode.value} value={mode.value}>{mode.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label-sm">距离(km)</label>
                          <input
                            type="number"
                            className="input"
                            value={log.distancekm || ''}
                            onChange={(e) => handleLogisticsChange(idx, 'distancekm', parseFloat(e.target.value) || 0)}
                            placeholder="距离"
                          />
                        </div>
                        <div>
                          <label className="form-label-sm">重量(kg)</label>
                          <input
                            type="number"
                            className="input"
                            value={log.weightkg || ''}
                            onChange={(e) => handleLogisticsChange(idx, 'weightkg', parseFloat(e.target.value) || 0)}
                            placeholder="重量"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="add-item-btn" onClick={handleAddLogistics}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    添加物流
                  </button>
                </div>

                <div className="form-section">
                  <div className="form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20V10"/>
                      <path d="M18 20V4"/>
                      <path d="M6 20v-4"/>
                    </svg>
                    生产数据
                  </div>
                  <div className="production-grid">
                    <div>
                      <label className="form-label-sm">产量</label>
                      <input
                        type="number"
                        className="input"
                        value={productionData.outputQuantity || ''}
                        onChange={(e) => setProductionData({ ...productionData, outputQuantity: parseFloat(e.target.value) || 0 })}
                        placeholder="产量"
                      />
                    </div>
                    <div>
                      <label className="form-label-sm">单位</label>
                      <input
                        type="text"
                        className="input"
                        value={productionData.outputUnit}
                        onChange={(e) => setProductionData({ ...productionData, outputUnit: e.target.value })}
                        placeholder="如: 件、吨"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    报告标准
                  </div>
                  <div className="standards-grid">
                    {reportingStandards.map(std => (
                      <label
                        key={std.id}
                        className={`standard-checkbox ${standards.includes(std.id) ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={standards.includes(std.id)}
                          onChange={() => handleStandardToggle(std.id)}
                        />
                        <span className="checkmark">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                        <span>{std.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  className={`btn-primary ${!hasValidInput() || loading ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !hasValidInput()}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      开始分析
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="result-section">
            <div className="result-header">
              <div className="result-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h2>碳排放分析结果</h2>
                <p>已完成碳排放核算</p>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                  <path d="M12 2a7 7 0 0 1 7 7"/>
                </svg>
                排放汇总
              </h3>
              <div className="emissions-summary">
                <div className="emission-stat total">
                  <div className="value">{result.totalEmissions.tCO2e.toFixed(2)}</div>
                  <div className="label">总排放量 (tCO2e)</div>
                </div>
                <div className="emission-stat">
                  <div className="value">{result.totalEmissions.byScope.scope1.toFixed(2)}</div>
                  <div className="label">Scope 1 (tCO2e)</div>
                </div>
                <div className="emission-stat">
                  <div className="value">{result.totalEmissions.byScope.scope2.toFixed(2)}</div>
                  <div className="label">Scope 2 (tCO2e)</div>
                </div>
                <div className="emission-stat">
                  <div className="value">{result.totalEmissions.byScope.scope3.toFixed(2)}</div>
                  <div className="label">Scope 3 (tCO2e)</div>
                </div>
              </div>
            </div>

            {result.emissionsBreakdown.bySource.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  按来源分类
                </h3>
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>排放源</th>
                      <th>排放量 (tCO2e)</th>
                      <th className="bar-cell">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.emissionsBreakdown.bySource.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.category}</td>
                        <td>{item.emissions.toFixed(2)}</td>
                        <td className="bar-cell">
                          <div className="bar">
                            <div className="bar-fill" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.percentage.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.emissionsBreakdown.byActivity.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                  按活动分类
                </h3>
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>活动类型</th>
                      <th>排放量 (tCO2e)</th>
                      <th className="bar-cell">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.emissionsBreakdown.byActivity.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.activity}</td>
                        <td>{item.emissions.toFixed(2)}</td>
                        <td className="bar-cell">
                          <div className="bar">
                            <div className="bar-fill" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.percentage.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-4"/>
                </svg>
                碳排放强度
              </h3>
              <div className="intensity-grid">
                <div className="intensity-item">
                  <div className="value">{result.carbonIntensity.perUnit.toFixed(4)}</div>
                  <div className="label">单位产品排放 (tCO2e/单位)</div>
                </div>
                <div className="intensity-item">
                  <div className="value">{result.carbonIntensity.perRevenue.toFixed(4)}</div>
                  <div className="label">单位营收排放 (tCO2e/万元)</div>
                </div>
                <div className="intensity-item">
                  <div className="value">{result.carbonIntensity.perArea.toFixed(4)}</div>
                  <div className="label">单位面积排放 (tCO2e/m²)</div>
                </div>
              </div>
            </div>

            {result.complianceMapping.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  合规性映射
                </h3>
                <div className="compliance-grid">
                  {result.complianceMapping.map((item, idx) => (
                    <div
                      key={idx}
                      className={`compliance-card ${item.complianceStatus.toLowerCase().includes('compliant') ? 'compliant' : 'non-compliant'}`}
                    >
                      <div className="standard-name">{item.standard}</div>
                      <div className="scope">{item.scope}</div>
                      <div className="status">
                        {item.complianceStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

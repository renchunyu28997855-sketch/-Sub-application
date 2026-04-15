'use client';

import { useState } from 'react';
import { templates, categories, analysisTypes, EnergyTemplate } from './templates';
import './InputForm.css';

interface ConsumptionData {
  electricity: { consumption: string; cost: string };
  gas: { consumption: string; cost: string };
}

interface EquipmentData {
  motor: { power: string; current: string; voltage: string; powerFactor: string; efficiency: string };
  hvac: { power: string; cop: string };
}

interface RenewableData {
  solar: { capacity: string; sunHours: string };
  wind: { capacity: string; capacityFactor: string };
}

interface UtilityData {
  peakRate: string;
  offPeakRate: string;
  demandCharge: string;
  gridPrice: string;
}

interface AnalysisResult {
  consumption?: {
    totalKwh: number;
    breakdown: Record<string, number>;
    totalCost: number;
    energyIntensity: number;
    carbonEmissions: number;
  };
  motor?: {
    ratedPower: number;
    efficiencyClass: string;
    potentialSavings: number;
  };
  hvac?: {
    totalPotentialAnnualSaving: number;
    components: Record<string, number>;
  };
  lighting?: {
    currentEfficiency: string;
    totalPotentialAnnualSaving: number;
  };
  peakShaving?: {
    current: { peakRatio: number };
    potential: { annualSaving: number };
  };
  summary: {
    totalCurrentCost: number;
    totalPotentialAnnualSaving: number;
    recommendations: string[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [facilityId, setFacilityId] = useState('');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [consumptionData, setConsumptionData] = useState<ConsumptionData>({
    electricity: { consumption: '', cost: '' },
    gas: { consumption: '', cost: '' },
  });
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    motor: { power: '', current: '', voltage: '', powerFactor: '', efficiency: '' },
    hvac: { power: '', cop: '' },
  });
  const [renewableData, setRenewableData] = useState<RenewableData>({
    solar: { capacity: '', sunHours: '' },
    wind: { capacity: '', capacityFactor: '' },
  });
  const [utilityData, setUtilityData] = useState<UtilityData>({
    peakRate: '',
    offPeakRate: '',
    demandCharge: '',
    gridPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: EnergyTemplate) => {
    setSelectedTemplate(template.id);
    setFacilityId(template.inputData.facilityId || '');
    setAnalysisType(template.inputData.analysisType);
    if (template.inputData.consumptionData?.electricity) {
      setConsumptionData({
        electricity: {
          consumption: String(template.inputData.consumptionData.electricity.consumption),
          cost: String(template.inputData.consumptionData.electricity.cost),
        },
        gas: template.inputData.consumptionData.gas
          ? {
              consumption: String(template.inputData.consumptionData.gas.consumption),
              cost: String(template.inputData.consumptionData.gas.cost),
            }
          : { consumption: '', cost: '' },
      });
    }
    if (template.inputData.utilityData) {
      setUtilityData({
        peakRate: String(template.inputData.utilityData.peakRate),
        offPeakRate: String(template.inputData.utilityData.offPeakRate),
        demandCharge: String(template.inputData.utilityData.demandCharge),
        gridPrice: String(template.inputData.utilityData.gridPrice),
      });
    }
    setShowDropdown(false);
  };

  const handleReset = () => {
    setSelectedTemplate('');
    setFacilityId('');
    setAnalysisType('comprehensive');
    setConsumptionData({
      electricity: { consumption: '', cost: '' },
      gas: { consumption: '', cost: '' },
    });
    setEquipmentData({
      motor: { power: '', current: '', voltage: '', powerFactor: '', efficiency: '' },
      hvac: { power: '', cop: '' },
    });
    setRenewableData({
      solar: { capacity: '', sunHours: '' },
      wind: { capacity: '', capacityFactor: '' },
    });
    setUtilityData({
      peakRate: '',
      offPeakRate: '',
      demandCharge: '',
      gridPrice: '',
    });
  };

  const buildRequestData = () => {
    const data: Record<string, unknown> = {
      facilityId: facilityId || 'FACILITY_DEFAULT',
      analysisType,
    };

    const hasConsumption =
      consumptionData.electricity.consumption ||
      consumptionData.electricity.cost ||
      consumptionData.gas.consumption ||
      consumptionData.gas.cost;

    if (hasConsumption) {
      data.consumptionData = {
        electricity: {
          consumption: Number(consumptionData.electricity.consumption) || 0,
          cost: Number(consumptionData.electricity.cost) || 0,
        },
      };
      if (consumptionData.gas.consumption || consumptionData.gas.cost) {
        (data.consumptionData as Record<string, unknown>).gas = {
          consumption: Number(consumptionData.gas.consumption) || 0,
          cost: Number(consumptionData.gas.cost) || 0,
        };
      }
    }

    const hasEquipment = equipmentData.motor.power || equipmentData.hvac.power;
    if (hasEquipment) {
      data.equipmentData = {};
      if (equipmentData.motor.power) {
        (data.equipmentData as Record<string, unknown>).motor = {
          power: Number(equipmentData.motor.power) || 0,
          current: Number(equipmentData.motor.current) || 0,
          voltage: Number(equipmentData.motor.voltage) || 0,
          powerFactor: Number(equipmentData.motor.powerFactor) || 0,
          efficiency: Number(equipmentData.motor.efficiency) || 0,
        };
      }
      if (equipmentData.hvac.power) {
        (data.equipmentData as Record<string, unknown>).hvac = {
          power: Number(equipmentData.hvac.power) || 0,
          cop: Number(equipmentData.hvac.cop) || 0,
        };
      }
    }

    const hasRenewable = renewableData.solar.capacity || renewableData.wind.capacity;
    if (hasRenewable) {
      data.renewableData = {};
      if (renewableData.solar.capacity) {
        (data.renewableData as Record<string, unknown>).solar = {
          capacity: Number(renewableData.solar.capacity) || 0,
          sunHours: Number(renewableData.solar.sunHours) || 0,
        };
      }
      if (renewableData.wind.capacity) {
        (data.renewableData as Record<string, unknown>).wind = {
          capacity: Number(renewableData.wind.capacity) || 0,
          capacityFactor: Number(renewableData.wind.capacityFactor) || 0,
        };
      }
    }

    const hasUtility = utilityData.peakRate || utilityData.offPeakRate || utilityData.demandCharge || utilityData.gridPrice;
    if (hasUtility) {
      data.utilityData = {
        peakRate: Number(utilityData.peakRate) || 0,
        offPeakRate: Number(utilityData.offPeakRate) || 0,
        demandCharge: Number(utilityData.demandCharge) || 0,
        gridPrice: Number(utilityData.gridPrice) || 0,
      };
    }

    return data;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestData = buildRequestData();
      const res = await fetch('/energy-optimizer/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '综合分析':
        return { bg: 'rgba(34, 211, 238, 0.15)', text: '#22d3ee' };
      case '设备分析':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case '电网优化':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '综合分析':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case '设备分析':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        );
      case '电网优化':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <a href="http://47.112.29.121/" className="back-home-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回主页
          </a>
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>能源优化分析系统</h1>
              <p>智能分析工业设施能源消耗，提供节能建议和优化方案</p>
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 13h6M9 17h4" />
              </svg>
              模板选择
            </button>
            <button
              className={`tab ${mode === 'custom' ? 'active' : ''}`}
              onClick={() => setMode('custom')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              自定义输入
            </button>
          </div>

          <div className="card">
            {mode === 'template' ? (
              <div className="form-content">
                <div className="template-selector">
                  <div className="template-header">
                    <label className="form-label">选择模板</label>
                    {selectedTemplate && (
                      <button className="btn-reset" onClick={handleReset}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
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
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        {categories.map(category => (
                          <div key={category} className="dropdown-category">
                            <div className="category-label" style={{ color: getCategoryColor(category).text }}>
                              {getCategoryIcon(category)}
                              {category}
                            </div>
                            <div className="category-templates">
                              {templates.filter(t => t.category === category).map(template => (
                                <button
                                  key={template.id}
                                  className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                                  style={selectedTemplate === template.id ? { background: getCategoryColor(category).bg, borderColor: getCategoryColor(category).text, color: getCategoryColor(category).text } : {}}
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

                <div className="template-description">
                  {selectedTemplate ? (
                    <div className="template-info">
                      <p className="template-use-case">
                        <strong>使用场景：</strong>{templates.find(t => t.id === selectedTemplate)?.context.useCase}
                      </p>
                      <p className="template-expected">
                        <strong>预期输出：</strong>{templates.find(t => t.id === selectedTemplate)?.context.expectedOutput}
                      </p>
                    </div>
                  ) : (
                    <p className="placeholder-text">选择一个模板快速开始，或使用自定义输入进行详细配置</p>
                  )}
                </div>

                <div className="form-section">
                  <label className="form-label">分析类型</label>
                  <select
                    className="select"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                  >
                    {analysisTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  className={`btn-primary ${!selectedTemplate ? 'disabled' : ''}`}
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
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      开始分析
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="form-content">
                <div className="form-section">
                  <label className="form-label">设施ID</label>
                  <input
                    type="text"
                    className="input"
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    placeholder="例如：FACILITY_001"
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">分析类型</label>
                  <select
                    className="select"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                  >
                    {analysisTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <label className="form-label">能源消耗数据</label>
                  <div className="data-grid">
                    <div className="data-group">
                      <span className="data-group-title">电力</span>
                      <div className="data-row">
                        <input
                          type="text"
                          className="input-sm"
                          value={consumptionData.electricity.consumption}
                          onChange={(e) => setConsumptionData({
                            ...consumptionData,
                            electricity: { ...consumptionData.electricity, consumption: e.target.value }
                          })}
                          placeholder="消耗量(kWh)"
                        />
                        <input
                          type="text"
                          className="input-sm"
                          value={consumptionData.electricity.cost}
                          onChange={(e) => setConsumptionData({
                            ...consumptionData,
                            electricity: { ...consumptionData.electricity, cost: e.target.value }
                          })}
                          placeholder="费用(元)"
                        />
                      </div>
                    </div>
                    <div className="data-group">
                      <span className="data-group-title">燃气</span>
                      <div className="data-row">
                        <input
                          type="text"
                          className="input-sm"
                          value={consumptionData.gas.consumption}
                          onChange={(e) => setConsumptionData({
                            ...consumptionData,
                            gas: { ...consumptionData.gas, consumption: e.target.value }
                          })}
                          placeholder="消耗量(m³)"
                        />
                        <input
                          type="text"
                          className="input-sm"
                          value={consumptionData.gas.cost}
                          onChange={(e) => setConsumptionData({
                            ...consumptionData,
                            gas: { ...consumptionData.gas, cost: e.target.value }
                          })}
                          placeholder="费用(元)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">电机参数</label>
                  <div className="data-grid data-grid-3">
                    <input
                      type="text"
                      className="input-sm"
                      value={equipmentData.motor.power}
                      onChange={(e) => setEquipmentData({
                        ...equipmentData,
                        motor: { ...equipmentData.motor, power: e.target.value }
                      })}
                      placeholder="功率(kW)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={equipmentData.motor.current}
                      onChange={(e) => setEquipmentData({
                        ...equipmentData,
                        motor: { ...equipmentData.motor, current: e.target.value }
                      })}
                      placeholder="电流(A)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={equipmentData.motor.voltage}
                      onChange={(e) => setEquipmentData({
                        ...equipmentData,
                        motor: { ...equipmentData.motor, voltage: e.target.value }
                      })}
                      placeholder="电压(V)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={equipmentData.motor.powerFactor}
                      onChange={(e) => setEquipmentData({
                        ...equipmentData,
                        motor: { ...equipmentData.motor, powerFactor: e.target.value }
                      })}
                      placeholder="功率因数"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={equipmentData.motor.efficiency}
                      onChange={(e) => setEquipmentData({
                        ...equipmentData,
                        motor: { ...equipmentData.motor, efficiency: e.target.value }
                      })}
                      placeholder="效率"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">电价信息</label>
                  <div className="data-grid data-grid-2">
                    <input
                      type="text"
                      className="input-sm"
                      value={utilityData.peakRate}
                      onChange={(e) => setUtilityData({ ...utilityData, peakRate: e.target.value })}
                      placeholder="峰时电价(元/kWh)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={utilityData.offPeakRate}
                      onChange={(e) => setUtilityData({ ...utilityData, offPeakRate: e.target.value })}
                      placeholder="谷时电价(元/kWh)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={utilityData.demandCharge}
                      onChange={(e) => setUtilityData({ ...utilityData, demandCharge: e.target.value })}
                      placeholder="需量电费(元/kW)"
                    />
                    <input
                      type="text"
                      className="input-sm"
                      value={utilityData.gridPrice}
                      onChange={(e) => setUtilityData({ ...utilityData, gridPrice: e.target.value })}
                      placeholder="电网电价(元/kWh)"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">可再生能源</label>
                  <div className="data-grid">
                    <div className="data-group">
                      <span className="data-group-title">光伏</span>
                      <div className="data-row">
                        <input
                          type="text"
                          className="input-sm"
                          value={renewableData.solar.capacity}
                          onChange={(e) => setRenewableData({
                            ...renewableData,
                            solar: { ...renewableData.solar, capacity: e.target.value }
                          })}
                          placeholder="装机容量(kW)"
                        />
                        <input
                          type="text"
                          className="input-sm"
                          value={renewableData.solar.sunHours}
                          onChange={(e) => setRenewableData({
                            ...renewableData,
                            solar: { ...renewableData.solar, sunHours: e.target.value }
                          })}
                          placeholder="年日照小时数"
                        />
                      </div>
                    </div>
                    <div className="data-group">
                      <span className="data-group-title">风电</span>
                      <div className="data-row">
                        <input
                          type="text"
                          className="input-sm"
                          value={renewableData.wind.capacity}
                          onChange={(e) => setRenewableData({
                            ...renewableData,
                            wind: { ...renewableData.wind, capacity: e.target.value }
                          })}
                          placeholder="装机容量(kW)"
                        />
                        <input
                          type="text"
                          className="input-sm"
                          value={renewableData.wind.capacityFactor}
                          onChange={(e) => setRenewableData({
                            ...renewableData,
                            wind: { ...renewableData.wind, capacityFactor: e.target.value }
                          })}
                          placeholder="容量系数"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h2>分析结果</h2>
                <p>能源优化分析已完成</p>
              </div>
            </div>

            <div className="result-card summary-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                费用概览
              </h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">当前年度成本</span>
                  <span className="stat-value cost">¥{result.summary.totalCurrentCost.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">预计年节省</span>
                  <span className="stat-value saving">¥{result.summary.totalPotentialAnnualSaving.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">节能比例</span>
                  <span className="stat-value percentage">
                    {result.summary.totalCurrentCost > 0
                      ? ((result.summary.totalPotentialAnnualSaving / result.summary.totalCurrentCost) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {result.consumption && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  </svg>
                  能源消耗分析
                </h3>
                <div className="data-display">
                  <div className="data-item">
                    <span className="data-label">总消耗</span>
                    <span className="data-value">{result.consumption.totalKwh.toLocaleString()} kWh</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">总费用</span>
                    <span className="data-value">¥{result.consumption.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">能源强度</span>
                    <span className="data-value">{result.consumption.energyIntensity} kWh/㎡</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">碳排放</span>
                    <span className="data-value">{result.consumption.carbonEmissions} tCO₂</span>
                  </div>
                </div>
              </div>
            )}

            {result.motor && (
              <div className="result-card motor-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  电机能效评估
                </h3>
                <div className="data-display">
                  <div className="data-item">
                    <span className="data-label">额定功率</span>
                    <span className="data-value">{result.motor.ratedPower} kW</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">能效等级</span>
                    <span className="data-value efficiency-class">{result.motor.efficiencyClass}</span>
                  </div>
                  <div className="data-item full-width">
                    <span className="data-label">节能潜力</span>
                    <span className="data-value saving">¥{result.motor.potentialSavings.toLocaleString()}/年</span>
                  </div>
                </div>
              </div>
            )}

            {result.peakShaving && (
              <div className="result-card peak-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  峰谷调节分析
                </h3>
                <div className="data-display">
                  <div className="data-item">
                    <span className="data-label">当前峰谷比</span>
                    <span className="data-value">{result.peakShaving.current.peakRatio}:1</span>
                  </div>
                  <div className="data-item full-width">
                    <span className="data-label">预计年节省</span>
                    <span className="data-value saving">¥{result.peakShaving.potential.annualSaving.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {result.summary.recommendations && result.summary.recommendations.length > 0 && (
              <div className="result-card recommendations-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  优化建议
                </h3>
                <ul className="recommendations-list">
                  {result.summary.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

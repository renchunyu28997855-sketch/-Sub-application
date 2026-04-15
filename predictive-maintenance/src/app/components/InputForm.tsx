'use client';

import { useState } from 'react';
import { templates, categories, MaintenanceInput } from './templates';
import './InputForm.css';

interface RUL {
  hours: number;
  days: number;
  cycles: number;
  isExpired: boolean;
}

interface PossibleFailureMode {
  mode: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface MaintenanceWindow {
  plannedReplacementNow: boolean;
  expectedFailureCost: number;
  potentialSavings: number;
  recommendedAction: string;
}

interface AnalysisResult {
  healthIndex: number;
  healthStatus: 'good' | 'fair' | 'warning' | 'poor' | 'critical';
  rul: RUL;
  failureProbability: number;
  failureRisk: 'critical' | 'high' | 'medium' | 'low';
  possibleFailureModes: PossibleFailureMode[];
  maintenanceWindow: MaintenanceWindow;
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Custom input state
  const [equipmentId, setEquipmentId] = useState('');
  const [equipmentType, setEquipmentType] = useState<MaintenanceInput['equipmentType']>('induction_motor');
  const [operatingHours, setOperatingHours] = useState('');
  const [degradationData, setDegradationData] = useState({
    bearingCondition: '',
    windingTemp: '',
    vibration: '',
    seal: '',
    efficiency: '',
    equipmentAge: '',
  });
  const [anomaliesText, setAnomaliesText] = useState('');
  const [costData, setCostData] = useState({
    plannedReplacementCost: '',
    emergencyReplacementCost: '',
    downtimeCostPerDay: '',
    maintenanceCostPerDay: '',
  });

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEquipmentId(template.input.equipmentId);
      setEquipmentType(template.input.equipmentType);
      setOperatingHours(template.input.operatingHours.toString());
      setDegradationData({
        bearingCondition: template.input.degradationData.bearingCondition.toString(),
        windingTemp: template.input.degradationData.windingTemp.toString(),
        vibration: template.input.degradationData.vibration.toString(),
        seal: template.input.degradationData.seal.toString(),
        efficiency: template.input.degradationData.efficiency.toString(),
        equipmentAge: template.input.degradationData.equipmentAge.toString(),
      });
      setAnomaliesText(template.input.anomalies.map(a => `${a.type}:${a.severity}:${a.description}`).join('\n'));
      setCostData({
        plannedReplacementCost: template.input.costData.plannedReplacementCost.toString(),
        emergencyReplacementCost: template.input.costData.emergencyReplacementCost.toString(),
        downtimeCostPerDay: template.input.costData.downtimeCostPerDay.toString(),
        maintenanceCostPerDay: template.input.costData.maintenanceCostPerDay.toString(),
      });
    }
    setShowDropdown(false);
  };

  const handleReset = () => {
    setSelectedTemplate('');
    setEquipmentId('');
    setEquipmentType('induction_motor');
    setOperatingHours('');
    setDegradationData({
      bearingCondition: '',
      windingTemp: '',
      vibration: '',
      seal: '',
      efficiency: '',
      equipmentAge: '',
    });
    setAnomaliesText('');
    setCostData({
      plannedReplacementCost: '',
      emergencyReplacementCost: '',
      downtimeCostPerDay: '',
      maintenanceCostPerDay: '',
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const anomalies = anomaliesText.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split(':');
        return {
          type: parts[0] || 'unknown',
          severity: (parts[1] as 'low' | 'medium' | 'high' | 'critical') || 'medium',
          description: parts[2] || '',
        };
      });

      const inputData: MaintenanceInput = {
        equipmentId: equipmentId || 'UNKNOWN',
        equipmentType,
        operatingHours: parseFloat(operatingHours) || 0,
        degradationData: {
          bearingCondition: parseFloat(degradationData.bearingCondition) || 0,
          windingTemp: parseFloat(degradationData.windingTemp) || 0,
          vibration: parseFloat(degradationData.vibration) || 0,
          seal: parseFloat(degradationData.seal) || 0,
          efficiency: parseFloat(degradationData.efficiency) || 0,
          equipmentAge: parseFloat(degradationData.equipmentAge) || 0,
        },
        historicalData: [],
        anomalies,
        costData: {
          plannedReplacementCost: parseFloat(costData.plannedReplacementCost) || 0,
          emergencyReplacementCost: parseFloat(costData.emergencyReplacementCost) || 0,
          downtimeCostPerDay: parseFloat(costData.downtimeCostPerDay) || 0,
          maintenanceCostPerDay: parseFloat(costData.maintenanceCostPerDay) || 0,
        },
      };

      const res = await fetch('/predictive-maintenance/api/analyze', {
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'good': return 'status-good';
      case 'fair': return 'status-fair';
      case 'warning': return 'status-warning';
      case 'poor': return 'status-poor';
      case 'critical': return 'status-critical';
      default: return '';
    }
  };

  const getRiskClass = (risk: string) => {
    return `risk-tag risk-${risk}`;
  };

  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '电机设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        );
      case '泵设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
          </svg>
        );
      case '传动设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <a href="http://47.112.29.121/" className="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回主页
        </a>

        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>预测性维护分析系统</h1>
              <p>智能分析设备健康状态，预测故障风险，优化维护策略</p>
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
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
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
                          : '请选择设备模板...'}
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
                                  onClick={() => handleApplyTemplate(template.id)}
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

                <button
                  className={`btn-primary ${!selectedTemplate ? 'disabled' : ''}`}
                  onClick={() => {
                    if (selectedTemplate) {
                      handleApplyTemplate(selectedTemplate);
                      setMode('custom');
                    }
                  }}
                  disabled={!selectedTemplate}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  加载模板并编辑
                </button>
              </div>
            ) : (
              <div className="form-content">
                <div className="form-header">
                  <label className="form-label">设备信息</label>
                </div>
                <div className="context-grid">
                  <div className="form-group">
                    <label className="form-label-sm">设备ID</label>
                    <input
                      type="text"
                      className="input"
                      value={equipmentId}
                      onChange={(e) => setEquipmentId(e.target.value)}
                      placeholder="例如: MOTOR-001"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">设备类型</label>
                    <select
                      className="input"
                      value={equipmentType}
                      onChange={(e) => setEquipmentType(e.target.value as MaintenanceInput['equipmentType'])}
                    >
                      <option value="centrifugal_pump">离心泵</option>
                      <option value="induction_motor">感应电机</option>
                      <option value="compressor">压缩机</option>
                      <option value="gearbox">齿轮箱</option>
                      <option value="turbine">涡轮机</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">已运行小时数</label>
                    <input
                      type="number"
                      className="input"
                      value={operatingHours}
                      onChange={(e) => setOperatingHours(e.target.value)}
                      placeholder="例如: 15000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">设备年龄(年)</label>
                    <input
                      type="number"
                      className="input"
                      value={degradationData.equipmentAge}
                      onChange={(e) => setDegradationData({ ...degradationData, equipmentAge: e.target.value })}
                      placeholder="例如: 5"
                    />
                  </div>
                </div>

                <div className="form-header">
                  <label className="form-label">退化参数</label>
                </div>
                <div className="context-grid">
                  <div className="form-group">
                    <label className="form-label-sm">轴承状态 (%)</label>
                    <input
                      type="number"
                      className="input"
                      value={degradationData.bearingCondition}
                      onChange={(e) => setDegradationData({ ...degradationData, bearingCondition: e.target.value })}
                      placeholder="0-100"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">绕组温度 (C)</label>
                    <input
                      type="number"
                      className="input"
                      value={degradationData.windingTemp}
                      onChange={(e) => setDegradationData({ ...degradationData, windingTemp: e.target.value })}
                      placeholder="例如: 85"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">振动值 (mm/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input"
                      value={degradationData.vibration}
                      onChange={(e) => setDegradationData({ ...degradationData, vibration: e.target.value })}
                      placeholder="例如: 2.5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">密封性 (%)</label>
                    <input
                      type="number"
                      className="input"
                      value={degradationData.seal}
                      onChange={(e) => setDegradationData({ ...degradationData, seal: e.target.value })}
                      placeholder="0-100"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">效率 (%)</label>
                    <input
                      type="number"
                      className="input"
                      value={degradationData.efficiency}
                      onChange={(e) => setDegradationData({ ...degradationData, efficiency: e.target.value })}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                <div className="form-header">
                  <label className="form-label">异常记录</label>
                </div>
                <textarea
                  className="textarea"
                  value={anomaliesText}
                  onChange={(e) => setAnomaliesText(e.target.value)}
                  placeholder="每行一个异常，格式: 类型:严重程度:描述
例如: bearing_wear:medium:轴承磨损趋势明显"
                />

                <div className="form-header">
                  <label className="form-label">成本数据</label>
                </div>
                <div className="context-grid">
                  <div className="form-group">
                    <label className="form-label-sm">计划更换成本</label>
                    <input
                      type="number"
                      className="input"
                      value={costData.plannedReplacementCost}
                      onChange={(e) => setCostData({ ...costData, plannedReplacementCost: e.target.value })}
                      placeholder="例如: 50000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">紧急更换成本</label>
                    <input
                      type="number"
                      className="input"
                      value={costData.emergencyReplacementCost}
                      onChange={(e) => setCostData({ ...costData, emergencyReplacementCost: e.target.value })}
                      placeholder="例如: 120000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">停机成本/天</label>
                    <input
                      type="number"
                      className="input"
                      value={costData.downtimeCostPerDay}
                      onChange={(e) => setCostData({ ...costData, downtimeCostPerDay: e.target.value })}
                      placeholder="例如: 25000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">维护成本/天</label>
                    <input
                      type="number"
                      className="input"
                      value={costData.maintenanceCostPerDay}
                      onChange={(e) => setCostData({ ...costData, maintenanceCostPerDay: e.target.value })}
                      placeholder="例如: 3000"
                    />
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
                <h2>分析结果</h2>
                <p>设备: {equipmentId} | 类型: {equipmentType}</p>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                健康状态
              </h3>
              <div className="health-status-grid">
                <div className="health-status-item">
                  <div className="label">健康指数</div>
                  <div className={`value ${getStatusClass(result.healthStatus)}`}>
                    {(result.healthIndex * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="health-status-item">
                  <div className="label">健康状态</div>
                  <div className={`value ${getStatusClass(result.healthStatus)}`}>
                    {result.healthStatus === 'good' ? '良好' :
                     result.healthStatus === 'fair' ? '一般' :
                     result.healthStatus === 'warning' ? '警告' :
                     result.healthStatus === 'poor' ? '较差' : '危险'}
                  </div>
                </div>
                <div className="health-status-item">
                  <div className="label">故障概率</div>
                  <div className={`value ${result.failureProbability > 0.7 ? 'status-critical' : result.failureProbability > 0.4 ? 'status-warning' : 'status-good'}`}>
                    {(result.failureProbability * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="rul-display">
                <div className="rul-title">剩余使用寿命 (RUL)</div>
                <div className={`rul-value ${result.rul.isExpired ? 'rul-expired' : ''}`}>
                  {result.rul.isExpired ? '已过期' : `${result.rul.hours} 小时 (约 ${result.rul.days} 天)`}
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                风险等级
              </h3>
              <div className="risk-tags">
                <span className={getRiskClass(result.failureRisk)}>
                  {result.failureRisk === 'critical' ? '严重' :
                   result.failureRisk === 'high' ? '高' :
                   result.failureRisk === 'medium' ? '中' : '低'}风险
                </span>
              </div>
            </div>

            {result.possibleFailureModes && result.possibleFailureModes.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  可能故障模式
                </h3>
                <div className="failure-modes-list">
                  {result.possibleFailureModes.map((mode, idx) => (
                    <div className="failure-mode-item" key={idx}>
                      <div className="mode-header">
                        <span className="mode-name">{mode.mode}</span>
                        <span>
                          <span className="confidence">{(mode.confidence * 100).toFixed(0)}%</span>
                          <span className={`severity ${getSeverityClass(mode.severity)}`}>
                            {mode.severity === 'critical' ? '严重' :
                             mode.severity === 'high' ? '高' :
                             mode.severity === 'medium' ? '中' : '低'}
                          </span>
                        </span>
                      </div>
                      <p className="description">{mode.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.maintenanceWindow && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                  </svg>
                  维护窗口建议
                </h3>
                <div className="maintenance-window">
                  <div className="window-title">
                    {result.maintenanceWindow.plannedReplacementNow ? '建议立即计划更换' : '可继续观察'}
                  </div>
                  <div className="window-grid">
                    <div className="window-item">
                      <span className="item-label">预计故障成本</span>
                      <span className="item-value">¥{result.maintenanceWindow.expectedFailureCost.toLocaleString()}</span>
                    </div>
                    <div className="window-item">
                      <span className="item-label">潜在节省</span>
                      <span className="item-value savings">¥{result.maintenanceWindow.potentialSavings.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="recommended-action">{result.maintenanceWindow.recommendedAction}</p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface EquipmentContext {
  equipmentName: string;
  monitoringParams: string;
  alertThreshold: string;
  frequency: string;
}

interface Metric {
  name: string;
  value: number;
  status: 'normal' | 'warning' | 'critical';
  description: string;
}

interface Alert {
  level: 'info' | 'warning' | 'critical';
  message: string;
  suggestion: string;
}

interface AnalysisResult {
  healthScore: number;
  status: 'normal' | 'warning' | 'critical';
  metrics: Metric[];
  alerts: Alert[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [equipmentData, setEquipmentData] = useState('');
  const [context, setContext] = useState<EquipmentContext>({
    equipmentName: '',
    monitoringParams: '',
    alertThreshold: '',
    frequency: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: Template) => {
    setEquipmentData(template.equipmentData);
    setContext(template.context);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setEquipmentData('');
    setContext({
      equipmentName: '',
      monitoringParams: '',
      alertThreshold: '',
      frequency: '',
    });
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const inputData = { equipmentData, context };

      const res = await fetch('/equipment-health-monitor/api/analyze', {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '生产设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20h20M5 20V8l5-4v16M15 20V4l5 4v12"/>
          </svg>
        );
      case '加工设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        );
      case '自动化设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4M8 16h0M16 16h0"/>
          </svg>
        );
      case '物流设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2M15 18H9M19 18h2a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0016.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        );
      case '能源设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        );
      case '动力设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 12h4M8 10v4M15 11h2M18 10v4"/>
          </svg>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <div className="logo">
            <div className="logo-icon equipment-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>设备健康监控</h1>
              <p>智能设备状态监测、实时健康评分、异常告警</p>
            </div>
          </div>
          <a href="http://47.112.29.121/" className="back-home-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回主页
          </a>
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
                    <label className="form-label">选择设备模板</label>
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

                <div className="form-header">
                  <label className="form-label">设备数据</label>
                </div>
                <textarea
                  className="textarea"
                  value={equipmentData}
                  onChange={(e) => setEquipmentData(e.target.value)}
                  placeholder="描述设备运行数据，例如：主轴温度65°C、振动3.2mm/s、压力8.5bar、功率85%..."
                />

                <div className="context-grid">
                  {[
                    { key: 'equipmentName', label: '设备名称', placeholder: 'SMT贴片机、CNC机床' },
                    { key: 'monitoringParams', label: '监控参数', placeholder: '温度、压力、振动' },
                    { key: 'alertThreshold', label: '告警阈值', placeholder: '温度>80°C' },
                    { key: 'frequency', label: '监控频率', placeholder: '实时/每小时' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof EquipmentContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!equipmentData ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !equipmentData}
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
                <div className="form-header">
                  <label className="form-label">设备数据</label>
                </div>
                <textarea
                  className="textarea"
                  value={equipmentData}
                  onChange={(e) => setEquipmentData(e.target.value)}
                  placeholder="输入设备运行数据，例如：主轴温度65°C、振动3.2mm/s、压力8.5bar、功率85%、良品率97%..."
                  style={{ height: '150px' }}
                />

                <div className="form-header" style={{ marginTop: '16px' }}>
                  <label className="form-label">设备信息（可选）</label>
                </div>
                <div className="context-grid">
                  {[
                    { key: 'equipmentName', label: '设备名称', placeholder: 'CNC数控机床' },
                    { key: 'monitoringParams', label: '监控参数', placeholder: '温度、振动、压力' },
                    { key: 'alertThreshold', label: '告警阈值', placeholder: '温度>80°C' },
                    { key: 'frequency', label: '监控频率', placeholder: '实时监控' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof EquipmentContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!equipmentData ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !equipmentData}
                  style={{ marginTop: '16px' }}
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <h2>健康评分：{result.healthScore}</h2>
                <p>
                  状态：
                  <span style={{
                    color: result.status === 'normal' ? '#10b981' : result.status === 'warning' ? '#f59e0b' : '#ef4444',
                    fontWeight: 600
                  }}>
                    {result.status === 'normal' ? '正常' : result.status === 'warning' ? '警告' : '危险'}
                  </span>
                </p>
              </div>
              <div className="health-score-ring" style={{ '--score-color': getScoreColor(result.healthScore) } as React.CSSProperties}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-card)" strokeWidth="8"/>
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={getScoreColor(result.healthScore)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${result.healthScore * 2.83} 283`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="score-text">{result.healthScore}</span>
              </div>
            </div>

            {result.metrics && result.metrics.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 20V10M12 20V4M6 20v-6"/>
                  </svg>
                  指标详情
                </h3>
                <div className="metrics-grid">
                  {result.metrics.map((metric, idx) => {
                    const colors = getStatusColor(metric.status);
                    return (
                      <div
                        key={idx}
                        className="metric-item"
                        style={{ background: colors.bg, borderColor: colors.border }}
                      >
                        <div className="metric-header">
                          <span className="metric-name">{metric.name}</span>
                          <span className="metric-status" style={{ color: colors.text }}>
                            {metric.status === 'normal' ? '正常' : metric.status === 'warning' ? '警告' : '危险'}
                          </span>
                        </div>
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-desc">{metric.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.alerts && result.alerts.length > 0 && (
              <div className="result-card alerts-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  告警信息
                </h3>
                <div className="alerts-list">
                  {result.alerts.map((alert, idx) => {
                    const colors = getStatusColor(alert.level === 'info' ? 'normal' : alert.level === 'warning' ? 'warning' : 'critical');
                    return (
                      <div key={idx} className="alert-item" style={{ borderLeftColor: colors.text }}>
                        <div className="alert-message">{alert.message}</div>
                        <div className="alert-suggestion">{alert.suggestion}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.recommendations && (
              <div className="result-card recommendations-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  维护建议
                </h3>
                <div className="recommendations-grid">
                  {result.recommendations.immediate && result.recommendations.immediate.length > 0 && (
                    <div className="recommendation-section immediate">
                      <h4>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        立即处理
                      </h4>
                      <ul>
                        {result.recommendations.immediate.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.recommendations.shortTerm && result.recommendations.shortTerm.length > 0 && (
                    <div className="recommendation-section short-term">
                      <h4>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        短期计划
                      </h4>
                      <ul>
                        {result.recommendations.shortTerm.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.recommendations.longTerm && result.recommendations.longTerm.length > 0 && (
                    <div className="recommendation-section long-term">
                      <h4>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        长期规划
                      </h4>
                      <ul>
                        {result.recommendations.longTerm.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

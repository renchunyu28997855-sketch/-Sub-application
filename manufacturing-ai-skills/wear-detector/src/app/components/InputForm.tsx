'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface WearContext {
  equipmentType: string;
  wearDescription: string;
  operatingHours: string;
  maintenanceHistory: string;
}

interface AnalysisResult {
  wearAnalysis: {
    type: string;
    severity: 'critical' | 'warning' | 'normal';
    description: string;
    metrics: {
      wearRate: string;
      temperatureRise: string;
      vibrationLevel: string;
    };
  }[];
  lifeEstimation: {
    remainingLife: number;
    totalLife: number;
    condition: 'high' | 'medium' | 'low';
    estimatedHours: number;
  };
  maintenanceSuggestions: {
    priority: 'urgent' | 'recommended' | 'precautionary';
    title: string;
    description: string;
  }[];
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [wearDescription, setWearDescription] = useState('');
  const [context, setContext] = useState<WearContext>({
    equipmentType: '',
    wearDescription: '',
    operatingHours: '',
    maintenanceHistory: '',
  });
  const [customDescription, setCustomDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: Template) => {
    setWearDescription(template.jobDescription);
    setContext(template.context);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setWearDescription('');
    setContext({
      equipmentType: '',
      wearDescription: '',
      operatingHours: '',
      maintenanceHistory: '',
    });
    setSelectedTemplate('');
    setCustomDescription('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const inputData = mode === 'template'
        ? { wearDescription, context }
        : { wearDescription: customDescription };

      const res = await fetch('/wear-detector/api/analyze', {
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
    switch (category) {
      case '旋转设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        );
      case '加工设备':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
        );
      case '传动系统':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <a href="http://47.112.29.121/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回主页
          </a>
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>磨损检测分析系统</h1>
              <p>智能分析设备磨损情况，评估寿命并提供维护建议</p>
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
                          : '请选择磨损检测模板...'}
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
                  <label className="form-label">磨损描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={wearDescription}
                  onChange={(e) => setWearDescription(e.target.value)}
                  placeholder="描述设备磨损情况，例如：轴承出现异常振动和噪音，温度升高，振动频谱显示高频成分增加..."
                />

                <div className="context-grid">
                  {[
                    { key: 'equipmentType', label: '设备类型', placeholder: '滚动轴承、刀具、齿轮等' },
                    { key: 'wearDescription', label: '磨损详情', placeholder: '表面剥落、磨损宽度、裂纹等' },
                    { key: 'operatingHours', label: '运行时间', placeholder: '约XX小时/XX天' },
                    { key: 'maintenanceHistory', label: '维护历史', placeholder: '上次维护时间、更换记录' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof WearContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!wearDescription ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !wearDescription}
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
                  <label className="form-label">自定义磨损描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="请详细描述设备磨损情况，包括：&#10;- 设备类型和型号&#10;- 发现的磨损现象（振动、噪音、温度异常等）&#10;- 检测数据和指标&#10;- 近期维护情况"
                  style={{ height: '200px' }}
                />

                <button
                  className={`btn-primary ${!customDescription ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !customDescription}
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
                <p>已完成磨损智能分析</p>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                磨损分析
              </h3>
              {result.wearAnalysis.map((item, idx) => (
                <div className="analysis-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="analysis-header">
                    <span className="analysis-title">{item.type}</span>
                    <span className={`analysis-badge ${item.severity}`}>
                      {item.severity === 'critical' ? '严重' : item.severity === 'warning' ? '警告' : '正常'}
                    </span>
                  </div>
                  <div className="analysis-content">
                    {item.description}
                  </div>
                  <div className="analysis-metrics">
                    <div className="metric-item">
                      <span className="metric-label">磨损速率</span>
                      <span className={`metric-value ${parseFloat(item.metrics.wearRate) > 0.5 ? 'high' : parseFloat(item.metrics.wearRate) > 0.2 ? 'medium' : 'low'}`}>
                        {item.metrics.wearRate}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">温升</span>
                      <span className={`metric-value ${parseFloat(item.metrics.temperatureRise) > 30 ? 'high' : parseFloat(item.metrics.temperatureRise) > 15 ? 'medium' : 'low'}`}>
                        {item.metrics.temperatureRise}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">振动级</span>
                      <span className={`metric-value ${item.metrics.vibrationLevel === 'high' ? 'high' : item.metrics.vibrationLevel === 'medium' ? 'medium' : 'low'}`}>
                        {item.metrics.vibrationLevel === 'high' ? '高' : item.metrics.vibrationLevel === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                寿命评估
              </h3>
              <div className="life-estimation">
                <div className="life-header">
                  <div className="life-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <div className="life-title">剩余使用寿命</div>
                    <div className="life-subtitle">基于当前磨损状况和运行数据综合评估</div>
                  </div>
                </div>
                <div className="life-bar-container">
                  <div
                    className={`life-bar ${result.lifeEstimation.condition}`}
                    style={{ width: `${(result.lifeEstimation.remainingLife / result.lifeEstimation.totalLife) * 100}%` }}
                  />
                </div>
                <div className="life-stats">
                  <span>剩余 {result.lifeEstimation.remainingLife} 小时</span>
                  <span>总计 {result.lifeEstimation.totalLife} 小时</span>
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                </svg>
                维护建议
              </h3>
              <ul className="suggestions-list">
                {result.maintenanceSuggestions.map((suggestion, idx) => (
                  <li className="suggestion-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className={`suggestion-icon ${suggestion.priority}`}>
                      {suggestion.priority === 'urgent' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      ) : suggestion.priority === 'recommended' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                      )}
                    </div>
                    <div className="suggestion-content">
                      <h4>{suggestion.title}</h4>
                      <p>{suggestion.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface WorkContext {
  productType: string;
  productionVolume: string;
  leadTime: string;
  resources: string;
}

interface AnalysisResult {
  productionPlan: {
    phase: string;
    tasks: string[];
    timeline: string;
    output: string;
  }[];
  capacityAnalysis: {
    currentUtilization: number;
    bottleneck: string;
    suggestions: string[];
  };
  materialRequirements: {
    material: string;
    quantity: string;
    deliveryTime: string;
    priority: string;
  }[];
  recommendations: string[];
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState<WorkContext>({
    productType: '',
    productionVolume: '',
    leadTime: '',
    resources: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: Template) => {
    setDescription(template.description);
    setContext(template.context);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setDescription('');
    setContext({
      productType: '',
      productionVolume: '',
      leadTime: '',
      resources: '',
    });
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/production-planner/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, context }),
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

  const getUtilizationColor = (value: number) => {
    if (value >= 85) return '#ef4444';
    if (value >= 70) return '#f59e0b';
    return '#10b981';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      case '中':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
    }
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
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>智能生产规划系统</h1>
              <p>AI驱动的生产计划制定、产能分析与物料需求规划</p>
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
                          : '请选择生产场景模板...'}
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                              </svg>
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
                  <label className="form-label">需求描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述您的生产需求，例如：根据销售预测，制定下月生产计划，确保按时交付客户订单..."
                />

                <div className="context-grid">
                  {[
                    { key: 'productType', label: '产品类型', placeholder: '如：多品种产品、定制化产品' },
                    { key: 'productionVolume', label: '产量规模', placeholder: '如：10,000件/月' },
                    { key: 'leadTime', label: '交期要求', placeholder: '如：15天' },
                    { key: 'resources', label: '可用资源', placeholder: '如：两条生产线，50名工人' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof WorkContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!description ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !description}
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
                  <label className="form-label">生产需求描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述您的生产需求，包括：产品种类、生产数量、交货时间、特殊要求等..."
                  style={{ height: '160px' }}
                />

                <div className="context-grid">
                  {[
                    { key: 'productType', label: '产品类型', placeholder: '如：组装类产品、电子元件' },
                    { key: 'productionVolume', label: '产量规模', placeholder: '如：月产5,000套' },
                    { key: 'leadTime', label: '交期要求', placeholder: '如：30天' },
                    { key: 'resources', label: '可用资源', placeholder: '如：设备清单、人力情况' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof WorkContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!description ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !description}
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
                <p>已完成智能生产规划分析</p>
              </div>
            </div>

            {result.productionPlan && result.productionPlan.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1"/>
                  </svg>
                  生产计划
                </h3>
                <div className="plan-list">
                  {result.productionPlan.map((phase, idx) => (
                    <div className="plan-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="plan-header">
                        <span className="plan-phase">{phase.phase}</span>
                        <span className="plan-timeline">{phase.timeline}</span>
                      </div>
                      <div className="plan-tasks">
                        {phase.tasks.map((task, i) => (
                          <span key={i} className="task-tag">{task}</span>
                        ))}
                      </div>
                      <div className="plan-output">
                        <span className="output-label">产出：</span>{phase.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.capacityAnalysis && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  产能分析
                </h3>
                <div className="capacity-summary">
                  <div className="capacity-utilization">
                    <div className="utilization-ring" style={{
                      background: `conic-gradient(${getUtilizationColor(result.capacityAnalysis.currentUtilization)} ${result.capacityAnalysis.currentUtilization}%, var(--bg-input) 0)`
                    }}>
                      <span className="utilization-value" style={{ color: getUtilizationColor(result.capacityAnalysis.currentUtilization) }}>
                        {result.capacityAnalysis.currentUtilization}%
                      </span>
                    </div>
                    <span className="utilization-label">当前利用率</span>
                  </div>
                  <div className="bottleneck-info">
                    <span className="bottleneck-label">瓶颈分析</span>
                    <p>{result.capacityAnalysis.bottleneck}</p>
                  </div>
                </div>
                {result.capacityAnalysis.suggestions && result.capacityAnalysis.suggestions.length > 0 && (
                  <div className="suggestions-box">
                    <h4>改善建议</h4>
                    <ul>
                      {result.capacityAnalysis.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {result.materialRequirements && result.materialRequirements.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
                  </svg>
                  物料需求计划
                </h3>
                <div className="materials-table">
                  <div className="table-header">
                    <span>物料</span>
                    <span>数量</span>
                    <span>到货时间</span>
                    <span>优先级</span>
                  </div>
                  {result.materialRequirements.map((item, idx) => {
                    const priorityStyle = getPriorityColor(item.priority);
                    return (
                      <div className="table-row" key={idx}>
                        <span className="material-name">{item.material}</span>
                        <span className="material-qty">{item.quantity}</span>
                        <span className="material-time">{item.deliveryTime}</span>
                        <span className="priority-tag" style={{ background: priorityStyle.bg, color: priorityStyle.text }}>
                          {item.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="result-card recommendations-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  综合建议
                </h3>
                <ul className="recommendations-list">
                  {result.recommendations.map((rec, idx) => (
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

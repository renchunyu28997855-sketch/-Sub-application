'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface WorkContext {
  equipment: string;
  operatingConditions: string;
  oilType: string;
  maintenanceHistory: string;
}

interface AnalysisResult {
  lubricationPlan: {
    recommendedOil: string;
    oilGrade: string;
    viscosityGrade: string;
    changeInterval: string;
    lubricationMethod: string;
  };
  maintenanceSchedule: {
    daily: string[];
    weekly: string[];
    monthly: string[];
    quarterly: string[];
    yearly: string[];
  };
  recommendations: {
    precautions: string[];
    commonIssues: { issue: string; solution: string }[];
    optimization: string[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState<WorkContext>({
    equipment: '',
    operatingConditions: '',
    oilType: '',
    maintenanceHistory: '',
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
      equipment: '',
      operatingConditions: '',
      oilType: '',
      maintenanceHistory: '',
    });
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const inputData = { description, context };

      const res = await fetch('/lubrication-advisory/api/analyze', {
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

  return (
    <div className="app-container">
      <div className="back-button-container">
        <a href="http://47.112.29.121/" className="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回主页
        </a>
      </div>

      <div className="content-wrapper">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>润滑咨询系统</h1>
              <p>智能润滑方案推荐、油品选择与维护周期建议</p>
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
                          : '请选择润滑咨询模板...'}
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
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
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
                  <label className="form-label">问题描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述您的润滑咨询需求，例如：需要为某设备选择合适的润滑方案..."
                />

                <div className="context-grid">
                  {[
                    { key: 'equipment', label: '设备信息', placeholder: '设备型号、规格、类型' },
                    { key: 'operatingConditions', label: '工况条件', placeholder: '转速、载荷、温度等' },
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
                  <label className="form-label">详细描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述您的润滑需求，包括：&#10;1. 设备类型和型号&#10;2. 工作环境（温度、湿度、污染情况）&#10;3. 运行参数（转速、载荷、工作周期）&#10;4. 现有润滑状况&#10;5. 维护历史"
                  style={{ height: '180px' }}
                />

                <div className="context-grid">
                  {[
                    { key: 'equipment', label: '设备信息', placeholder: '设备型号、规格' },
                    { key: 'operatingConditions', label: '工况条件', placeholder: '转速、载荷、温度' },
                    { key: 'oilType', label: '当前油品', placeholder: '正在使用的润滑油类型' },
                    { key: 'maintenanceHistory', label: '维护历史', placeholder: '近期维护情况' },
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
                <p>已完成润滑方案分析</p>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
                </svg>
                润滑方案
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">推荐油品</span>
                  <span className="info-value">{result.lubricationPlan.recommendedOil}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">油品级别</span>
                  <span className="info-value">{result.lubricationPlan.oilGrade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">粘度等级</span>
                  <span className="info-value">{result.lubricationPlan.viscosityGrade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">换油周期</span>
                  <span className="info-value">{result.lubricationPlan.changeInterval}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">润滑方式</span>
                  <span className="info-value">{result.lubricationPlan.lubricationMethod}</span>
                </div>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                维护周期
              </h3>
              <div className="schedule-list">
                {result.maintenanceSchedule.daily.length > 0 && (
                  <div className="schedule-item">
                    <span className="schedule-tag daily">每日</span>
                    <ul className="schedule-content">
                      {result.maintenanceSchedule.daily.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.maintenanceSchedule.weekly.length > 0 && (
                  <div className="schedule-item">
                    <span className="schedule-tag weekly">每周</span>
                    <ul className="schedule-content">
                      {result.maintenanceSchedule.weekly.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.maintenanceSchedule.monthly.length > 0 && (
                  <div className="schedule-item">
                    <span className="schedule-tag monthly">每月</span>
                    <ul className="schedule-content">
                      {result.maintenanceSchedule.monthly.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.maintenanceSchedule.quarterly.length > 0 && (
                  <div className="schedule-item">
                    <span className="schedule-tag quarterly">每季度</span>
                    <ul className="schedule-content">
                      {result.maintenanceSchedule.quarterly.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.maintenanceSchedule.yearly.length > 0 && (
                  <div className="schedule-item">
                    <span className="schedule-tag yearly">每年</span>
                    <ul className="schedule-content">
                      {result.maintenanceSchedule.yearly.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                注意事项
              </h3>
              <ul className="suggestions-list">
                {result.recommendations.precautions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {result.recommendations.commonIssues.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  常见问题
                </h3>
                <div className="issues-list">
                  {result.recommendations.commonIssues.map((item, idx) => (
                    <div className="issue-item" key={idx}>
                      <span className="issue-problem">{item.issue}</span>
                      <span className="issue-arrow">→</span>
                      <span className="issue-solution">{item.solution}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.optimization.length > 0 && (
              <div className="result-card optimization-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  优化建议
                </h3>
                <ul className="suggestions-list">
                  {result.recommendations.optimization.map((item, idx) => (
                    <li key={idx}>{item}</li>
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

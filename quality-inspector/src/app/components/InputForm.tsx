'use client';

import { useState } from 'react';
import { templates, categories, InspectionTemplate } from './templates';
import './InputForm.css';

interface InspectionResult {
  inspectionType: string;
  productId: string;
  success: boolean;
  hasDefects: boolean;
  allPassed: boolean;
  overallStatus: 'pass' | 'fail' | 'warning';
  defects: Array<{
    type: string;
    confidence: number;
    location: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  dimensions: Array<{
    dimension: string;
    value: number;
    nominal: number;
    tolerance: string;
    deviation: number;
    status: 'pass' | 'fail' | 'warning';
  }>;
  recommendations: string[];
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [productId, setProductId] = useState('');
  const [productType, setProductType] = useState('');
  const [customParams, setCustomParams] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: InspectionTemplate) => {
    setProductType(template.parameters.inspectionType);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setProductId('');
    setProductType('');
    setCustomParams('');
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let params = {};

      if (mode === 'template' && selectedTemplate) {
        const template = templates.find(t => t.id === selectedTemplate);
        if (template) {
          params = template.parameters.defaultParams;
        }
      } else {
        try {
          params = customParams ? JSON.parse(customParams) : {};
        } catch {
          throw new Error('自定义参数格式错误，请输入有效的JSON');
        }
      }

      const res = await fetch('/quality-inspector/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionType: mode === 'template' ? productType : params.inspectionType || 'comprehensive',
          productId,
          productType,
          parameters: params,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '检测分析失败');
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '检测分析失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'var(--accent-emerald)';
      case 'fail': return 'var(--accent-red)';
      case 'warning': return 'var(--accent-amber)';
      default: return 'var(--text-muted)';
    }
  };

  const getSeverityClass = (severity: string) => {
    return `defect-severity ${severity}`;
  };

  const getStatusClass = (status: string) => {
    return `status-badge ${status}`;
  };

  const getResultIcon = () => {
    if (!result) return null;

    const status = result.overallStatus;
    const iconColor = getStatusColor(status);

    if (status === 'pass') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      );
    } else if (status === 'fail') {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      );
    } else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      );
    }
  };

  const getResultTitle = () => {
    if (!result) return '';
    switch (result.overallStatus) {
      case 'pass': return '检测通过';
      case 'fail': return '检测未通过';
      case 'warning': return '存在异常';
      default: return '检测完成';
    }
  };

  const getResultSubtitle = () => {
    if (!result) return '';
    if (result.allPassed) return '所有检测项目均符合标准';
    if (!result.hasDefects) return '未发现明显缺陷';
    return `发现 ${result.defects.length} 项缺陷`;
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
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>AI 质量检测系统</h1>
              <p>智能分析产品质量，识别缺陷并提供检测建议</p>
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
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              自定义输入
            </button>
          </div>

          <div className="card">
            {mode === 'template' ? (
              <div className="form-content">
                <div className="template-selector">
                  <div className="template-header">
                    <label className="form-label">选择检测模板</label>
                    {selectedTemplate && (
                      <button className="btn-reset" onClick={handleReset}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        重置
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
                          : '请选择检测模板...'}
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
                                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
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
                                  <div className="template-name">{template.name}</div>
                                  <div className="template-desc">{template.description}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="context-grid">
                  <div className="form-group">
                    <label className="form-label-sm">产品ID</label>
                    <input
                      type="text"
                      className="input"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="输入产品编号"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-sm">产品类型</label>
                    <input
                      type="text"
                      className="input"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      placeholder="输入产品类型"
                    />
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="template-info">
                    <div className="template-info-title">模板说明</div>
                    <p>{templates.find(t => t.id === selectedTemplate)?.description}</p>
                  </div>
                )}

                <button
                  className={`btn-primary ${!productId || !productType ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !productId || !productType}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                      </svg>
                      开始检测
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">检测参数（JSON格式）</label>
                  <textarea
                    className="textarea"
                    value={customParams}
                    onChange={(e) => setCustomParams(e.target.value)}
                    placeholder={`{
  "inspectionType": "visual-defect",
  "productId": "P001",
  "productType": "精密零件",
  "parameters": {
    "measurements": [49.8, 30.1, 15.3],
    "tolerances": ["±0.2mm", "±0.1mm", "±0.2mm"]
  }
}`}
                    style={{ height: '200px' }}
                  />
                </div>

                <button
                  className={`btn-primary ${!customParams ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !customParams}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                      </svg>
                      开始检测
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
            <div className={`result-header ${result.overallStatus}`}>
              <div className="result-icon">
                {getResultIcon()}
              </div>
              <div>
                <h2>{getResultTitle()}</h2>
                <p>{getResultSubtitle()}</p>
              </div>
            </div>

            {result.defects.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  缺陷检测
                </h3>
                <div className="defects-list">
                  {result.defects.map((defect, idx) => (
                    <div className="defect-item" key={idx}>
                      <div className="defect-header">
                        <span className="defect-type">{defect.type}</span>
                        <span className="defect-confidence">{(defect.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="defect-details">
                        <span>位置：{defect.location}</span>
                        <span className={getSeverityClass(defect.severity)}>{defect.severity.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.dimensions.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  尺寸检测
                </h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <div className="stat-value pass">{result.dimensions.filter(d => d.status === 'pass').length}</div>
                    <div className="stat-label">合格</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value warning">{result.dimensions.filter(d => d.status === 'warning').length}</div>
                    <div className="stat-label">警告</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value fail">{result.dimensions.filter(d => d.status === 'fail').length}</div>
                    <div className="stat-label">不合格</div>
                  </div>
                </div>
                <table className="dimensions-table">
                  <thead>
                    <tr>
                      <th>尺寸项目</th>
                      <th>实测值</th>
                      <th>标称值</th>
                      <th>公差</th>
                      <th>偏差</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.dimensions.map((dim, idx) => (
                      <tr key={idx}>
                        <td>{dim.dimension}</td>
                        <td>{dim.value}</td>
                        <td>{dim.nominal}</td>
                        <td>{dim.tolerance}</td>
                        <td style={{ color: getStatusColor(dim.status) }}>
                          {dim.deviation > 0 ? '+' : ''}{dim.deviation}
                        </td>
                        <td>
                          <span className={getStatusClass(dim.status)}>
                            {dim.status === 'pass' ? '合格' : dim.status === 'warning' ? '警告' : '不合格'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="result-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  检测建议
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

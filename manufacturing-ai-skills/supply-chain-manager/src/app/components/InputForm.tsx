'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface SupplyChainContext {
  suppliers: string;
  products: string;
  volume: string;
  issues: string;
}

interface AnalysisResult {
  analysis: {
    riskAssessment: { level: string; factors: string[] };
    supplierPerformance: { name: string; score: number; issues: string[] }[];
    inventoryOptimization: { currentStatus: string; suggestions: string[] };
    recommendations: { priority: string; action: string; impact: string }[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [scenario, setScenario] = useState('');
  const [context, setContext] = useState<SupplyChainContext>({
    suppliers: '',
    products: '',
    volume: '',
    issues: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: Template) => {
    setScenario(template.scenario);
    setContext(template.context);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setScenario('');
    setContext({ suppliers: '', products: '', volume: '', issues: '' });
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/supply-chain-manager/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, context }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '分析失败');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <a href="http://47.112.29.121/" className="back-home-btn">← 返回主页</a>
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>供应链管理系统</h1>
              <p>智能分析供应链风险，优化库存管理</p>
            </div>
          </div>
        </header>

        <section className="input-section">
          <div className="mode-tabs">
            <button className={`tab ${mode === 'template' ? 'active' : ''}`} onClick={() => setMode('template')}>模板输入</button>
            <button className={`tab ${mode === 'custom' ? 'active' : ''}`} onClick={() => setMode('custom')}>自定义输入</button>
          </div>

          <div className="card">
            {mode === 'template' ? (
              <div className="form-content">
                <div className="template-selector">
                  <div className="template-header">
                    <label className="form-label">选择模板</label>
                    {selectedTemplate && <button className="btn-reset" onClick={handleReset}>清空</button>}
                  </div>
                  <div className="dropdown-container">
                    <button className={`dropdown-trigger ${showDropdown ? 'open' : ''}`} onClick={() => setShowDropdown(!showDropdown)}>
                      <span>{selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : '请选择模板...'}</span>
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        {categories.map(cat => (
                          <div key={cat} className="dropdown-category">
                            <div className="category-label">{cat}</div>
                            <div className="category-templates">
                              {templates.filter(t => t.category === cat).map(template => (
                                <button key={template.id} className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                                  onClick={() => handleApplyTemplate(template)}>{template.name}</button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">场景描述</label>
                  <textarea className="textarea" value={scenario} onChange={e => setScenario(e.target.value)} placeholder="描述供应链场景..." />
                </div>

                <div className="context-grid">
                  {[{ key: 'suppliers', label: '供应商信息' }, { key: 'products', label: '产品信息' }, { key: 'volume', label: '交易量' }, { key: 'issues', label: '存在问题' }].map(f => (
                    <div className="form-group" key={f.key}>
                      <label className="form-label-sm">{f.label}</label>
                      <input type="text" className="input" value={context[f.key as keyof SupplyChainContext]} onChange={e => setContext({...context, [f.key]: e.target.value})} />
                    </div>
                  ))}
                </div>

                <button className={`btn-primary ${!scenario ? 'disabled' : ''}`} onClick={handleSubmit} disabled={loading || !scenario}>
                  {loading ? '分析中...' : '开始分析'}
                </button>
              </div>
            ) : (
              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">场景描述</label>
                  <textarea className="textarea" value={scenario} onChange={e => setScenario(e.target.value)} placeholder="描述你的供应链场景..." />
                </div>
                <button className={`btn-primary ${!scenario ? 'disabled' : ''}`} onClick={handleSubmit} disabled={loading || !scenario}>
                  {loading ? '分析中...' : '开始分析'}
                </button>
              </div>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
        </section>

        {result && (
          <section className="result-section">
            <div className="result-header"><h2>分析结果</h2></div>
            <div className="result-card">
              <h3>风险评估</h3>
              <div className="risk-level" style={{borderLeftColor: getRiskColor(result.analysis.riskAssessment.level)}}>
                <span className="risk-badge" style={{backgroundColor: getRiskColor(result.analysis.riskAssessment.level)}}>
                  {result.analysis.riskAssessment.level.toUpperCase()}
                </span>
                <div className="risk-factors">
                  {result.analysis.riskAssessment.factors.map((f, i) => <span key={i} className="factor-tag">{f}</span>)}
                </div>
              </div>
            </div>
            <div className="result-card">
              <h3>供应商绩效</h3>
              {result.analysis.supplierPerformance.map((s, i) => (
                <div key={i} className="supplier-item">
                  <span className="supplier-name">{s.name}</span>
                  <span style={{color: s.score >= 85 ? '#10b981' : s.score >= 70 ? '#f59e0b' : '#ef4444'}}>{s.score}分</span>
                  {s.issues.length > 0 && <div className="supplier-issues">{s.issues.join(', ')}</div>}
                </div>
              ))}
            </div>
            <div className="result-card">
              <h3>库存优化建议</h3>
              <p>{result.analysis.inventoryOptimization.currentStatus}</p>
              <ul>{result.analysis.inventoryOptimization.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="result-card">
              <h3>优化建议</h3>
              {result.analysis.recommendations.map((r, i) => (
                <div key={i} className="recommendation-item" style={{borderLeftColor: getRiskColor(r.priority)}}>
                  <span className="priority-badge" style={{backgroundColor: getRiskColor(r.priority)}}>{r.priority}</span>
                  <div><div>{r.action}</div><div className="text-sm text-gray-500">{r.impact}</div></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

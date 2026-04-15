'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface LogisticsContext {
  inputData: string;
  outputResult: string;
  collaborator: string;
  frequency: string;
  timeRatio?: string;
}

interface Task {
  name: string;
  skills: string[];
  digitalScore: number;
  ruleScore: number;
  faultTolerance: number;
}

interface AnalysisResult {
  tasks: Task[];
  classification: string[];
  recommendations: {
    skillDocuments?: { name: string; input: string; output: string; apiExample: string }[];
    agentDesign?: { role: string; capabilities: string[]; workflow: string[] }[];
    humanSuggestions?: string[];
    systemSuggestions?: string[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [context, setContext] = useState<LogisticsContext>({
    inputData: '',
    outputResult: '',
    collaborator: '',
    frequency: '',
    timeRatio: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleApplyTemplate = (template: Template) => {
    setJobDescription(template.jobDescription);
    setContext(template.context);
    setSelectedTemplate(template.id);
    setShowDropdown(false);
  };

  const handleReset = () => {
    setJobDescription('');
    setContext({
      inputData: '',
      outputResult: '',
      collaborator: '',
      frequency: '',
      timeRatio: '',
    });
    setSelectedTemplate('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/logistics-optimizer/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, context }),
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
    if (score >= 7) return '#10b981';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getClassificationLabel = (cls: string) => {
    const map: Record<string, { label: string; bg: string; text: string }> = {
      skill: { label: 'Skill化', bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
      agent: { label: 'Agent化', bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
      human: { label: '保留人力', bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
      system: { label: '保留系统', bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
    };
    return map[cls] || { label: cls, bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '运输路线优化':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            <path d="M2 12h20"/>
          </svg>
        );
      case '物流成本分析':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        );
      case '仓储调度优化':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"/>
            <path d="M16 8h4l3 3v5a2 2 0 01-2 2h-5M16 16a2 2 0 100 4 2 2 0 000-4zM8 3v5"/>
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
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回主页
          </a>
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>物流优化系统</h1>
              <p>智能分析物流路径、成本与运输调度</p>
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
                          : '请选择物流场景模板...'}
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
                  <label className="form-label">场景描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="描述物流场景，例如：根据发货点和目的地的位置，规划最优运输路线..."
                />

                <div className="context-grid">
                  {[
                    { key: 'inputData', label: '输入数据', placeholder: '发货点坐标、目的地列表' },
                    { key: 'outputResult', label: '输出结果', placeholder: '最优路线、运输成本' },
                    { key: 'collaborator', label: '协作对象', placeholder: '司机、调度中心' },
                    { key: 'frequency', label: '执行频率', placeholder: '每天、每周、每月' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof LogisticsContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!jobDescription ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !jobDescription}
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
                  <label className="form-label">物流场景描述</label>
                </div>
                <textarea
                  className="textarea textarea-large"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="请详细描述您的物流场景，包括：
- 具体任务（如路线规划、成本分析、仓储调度等）
- 输入数据和约束条件
- 期望的输出结果
- 涉及的协作对象
- 执行频率和规模"
                />

                <div className="context-grid">
                  {[
                    { key: 'inputData', label: '输入数据', placeholder: '数据来源和格式' },
                    { key: 'outputResult', label: '输出结果', placeholder: '期望的输出形式' },
                    { key: 'collaborator', label: '协作对象', placeholder: '涉及的部门和人员' },
                    { key: 'frequency', label: '执行频率', placeholder: '每日/每周/每月/按需' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label-sm">{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        value={context[field.key as keyof LogisticsContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`btn-primary ${!jobDescription ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !jobDescription}
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
                <p>已完成智能分析</p>
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1"/>
                </svg>
                任务拆解
              </h3>
              <div className="tasks-list">
                {result.tasks.map((task, idx) => (
                  <div className="task-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="task-header">
                      <span className="task-name">{task.name}</span>
                      <span className="task-skills">{task.skills.join('、')}</span>
                    </div>
                    <div className="task-scores">
                      {[
                        { label: '数字化', key: 'digitalScore' as const },
                        { label: '规则性', key: 'ruleScore' as const },
                        { label: '容错率', key: 'faultTolerance' as const },
                      ].map((s) => (
                        <div className="score-item" key={s.key}>
                          <span className="score-label">{s.label}</span>
                          <span className="score-value" style={{ color: getScoreColor(task[s.key]) }}>
                            {task[s.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-card">
              <h3 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                分类建议
              </h3>
              <div className="tags-list">
                {result.classification.map((cls, idx) => {
                  const info = getClassificationLabel(cls);
                  return (
                    <span
                      key={idx}
                      className="tag"
                      style={{ background: info.bg, color: info.text }}
                    >
                      {info.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {result.recommendations.skillDocuments && result.recommendations.skillDocuments.length > 0 && (
              <div className="result-card skill-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                  </svg>
                  Skill文档
                </h3>
                <div className="docs-list">
                  {result.recommendations.skillDocuments.map((skill, idx) => (
                    <div className="doc-item" key={idx}>
                      <h4>{skill.name}</h4>
                      <div className="doc-content">
                        <p><span>输入</span> {skill.input}</p>
                        <p><span>输出</span> {skill.output}</p>
                      </div>
                      <code className="code-block">{skill.apiExample}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.agentDesign && result.recommendations.agentDesign.length > 0 && (
              <div className="result-card agent-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <path d="M12 7v4M8 16h0M16 16h0"/>
                  </svg>
                  Agent方案
                </h3>
                <div className="agents-list">
                  {result.recommendations.agentDesign.map((agent, idx) => (
                    <div className="agent-item" key={idx}>
                      <h4>{agent.role}</h4>
                      <p><span>能力</span> {agent.capabilities.join('、')}</p>
                      <div className="workflow">
                        {agent.workflow.map((step, i) => (
                          <span key={i}>
                            {i > 0 && <span className="arrow">→</span>}
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.humanSuggestions && result.recommendations.humanSuggestions.length > 0 && (
              <div className="result-card human-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  人力优化建议
                </h3>
                <ul className="suggestions-list">
                  {result.recommendations.humanSuggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations.systemSuggestions && result.recommendations.systemSuggestions.length > 0 && (
              <div className="result-card system-card">
                <h3 className="section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                  系统优化建议
                </h3>
                <ul className="suggestions-list">
                  {result.recommendations.systemSuggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
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

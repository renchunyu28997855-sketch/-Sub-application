'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import './InputForm.css';

interface WorkContext {
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
  const [mode, setMode] = useState<'template' | 'wizard'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [context, setContext] = useState<WorkContext>({
    inputData: '',
    outputResult: '',
    collaborator: '',
    frequency: '',
    timeRatio: '',
  });
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const wizardQuestions = [
    {
      key: 'mainTask',
      question: '请描述您的供应链规划需求',
      placeholder: '例如：根据历史销售数据预测下季度需求，制定采购计划',
    },
    {
      key: 'system',
      question: '目前使用哪些系统或工具？',
      placeholder: '例如：ERP系统、Excel、供应商管理系统',
    },
    {
      key: 'frequency',
      question: '这项工作多久执行一次？',
      placeholder: '例如：每天、每周、每月、每季度',
    },
    {
      key: 'output',
      question: '最终的输出是什么？',
      placeholder: '例如：采购计划表、需求预测报告',
    },
    {
      key: 'impact',
      question: '如果出错，影响有多大？',
      placeholder: '例如：可能导致库存积压或缺货、影响生产计划',
    },
  ];

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
      const inputData = mode === 'template'
        ? { jobDescription, context }
        : { jobDescription: wizardAnswers.mainTask + '。使用系统：' + wizardAnswers.system + '。输出：' + wizardAnswers.output };

      const res = await fetch('/supply-chain-planner/api/analyze', {
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
      case '采购策略':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        );
      case '需求预测':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        );
      case '供应商管理':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1"/>
          </svg>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="back-home">
        <a href="http://47.112.29.121/" className="back-home-link">
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
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>供应链规划助手</h1>
              <p>智能分析供应链需求，提供采购策略与需求预测方案</p>
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
              模板输入
            </button>
            <button
              className={`tab ${mode === 'wizard' ? 'active' : ''}`}
              onClick={() => setMode('wizard')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              向导问答
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
                          : '请选择模板...'}
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
                  <label className="form-label">需求描述</label>
                </div>
                <textarea
                  className="textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="描述您的供应链规划需求，例如：根据历史销售数据制定下季度采购策略..."
                />

                <div className="context-grid">
                  {[
                    { key: 'inputData', label: '输入数据', placeholder: '历史销售数据、供应商信息' },
                    { key: 'outputResult', label: '输出结果', placeholder: '采购计划、需求预测报告' },
                    { key: 'collaborator', label: '协作对象', placeholder: '采购部、生产部、供应商' },
                    { key: 'frequency', label: '执行频率', placeholder: '每天、每周、每月' },
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
                <div className="wizard-progress">
                  {wizardQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`progress-dot ${i <= wizardStep ? 'active' : ''} ${i < wizardStep ? 'completed' : ''}`}
                    />
                  ))}
                  <span className="progress-text">{wizardStep + 1} / {wizardQuestions.length}</span>
                </div>

                <div className="wizard-question">
                  <h3>{wizardQuestions[wizardStep].question}</h3>
                  <textarea
                    className="textarea"
                    value={wizardAnswers[wizardQuestions[wizardStep].key] || ''}
                    onChange={(e) =>
                      setWizardAnswers({ ...wizardAnswers, [wizardQuestions[wizardStep].key]: e.target.value })
                    }
                    placeholder={wizardQuestions[wizardStep].placeholder}
                  />
                </div>

                <div className="wizard-actions">
                  {wizardStep > 0 && (
                    <button className="btn-outline" onClick={() => setWizardStep(wizardStep - 1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      上一步
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (wizardStep < wizardQuestions.length - 1) {
                        setWizardStep(wizardStep + 1);
                      } else {
                        const desc = wizardAnswers.mainTask;
                        const sys = wizardAnswers.system;
                        const freq = wizardAnswers.frequency;
                        const out = wizardAnswers.output;
                        const impact = wizardAnswers.impact;
                        setJobDescription(`${desc}。使用系统：${sys}。执行频率：${freq}。输出：${out}。影响：${impact}`);
                        handleSubmit();
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        分析中...
                      </>
                    ) : wizardStep < wizardQuestions.length - 1 ? (
                      <>
                        下一步
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        开始分析
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
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

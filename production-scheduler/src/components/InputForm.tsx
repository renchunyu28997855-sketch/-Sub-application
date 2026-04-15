'use client';

import { useState } from 'react';
import { templates, categories, Template } from './templates';
import styles from '../page.module.css';

interface ProductionContext {
  machines: string;
  workers: string;
  materials: string;
  deadline: string;
  priority: string;
}

interface Task {
  name: string;
  duration: string;
  resources: string[];
  priority: 'high' | 'medium' | 'low';
}

interface ScheduleItem {
  time: string;
  task: string;
  machine?: string;
  worker?: string;
}

interface AnalysisResult {
  tasks: Task[];
  schedule: ScheduleItem[];
  recommendations: {
    optimizeSuggestions?: string[];
    riskWarnings?: string[];
    resourceSuggestions?: string[];
  };
}

export default function InputForm() {
  const [mode, setMode] = useState<'template' | 'wizard'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [context, setContext] = useState<ProductionContext>({
    machines: '',
    workers: '',
    materials: '',
    deadline: '',
    priority: '',
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
      question: '请描述主要的生产任务',
      placeholder: '例如：进行500件金属零件的CNC加工',
    },
    {
      key: 'machines',
      question: '使用哪些机器设备？',
      placeholder: '例如：CNC加工中心、铣床、车床',
    },
    {
      key: 'workers',
      question: '需要多少人员配置？',
      placeholder: '例如：操作工3人、质检员1人',
    },
    {
      key: 'materials',
      question: '原材料和物料情况如何？',
      placeholder: '例如：铝材棒料充足，需提前准备刀具',
    },
    {
      key: 'deadline',
      question: '交期要求是什么？',
      placeholder: '例如：当日完成、下周三前交付',
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
      machines: '',
      workers: '',
      materials: '',
      deadline: '',
      priority: '',
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
        : {
          jobDescription: wizardAnswers.mainTask,
          context: {
            machines: wizardAnswers.machines,
            workers: wizardAnswers.workers,
            materials: wizardAnswers.materials,
            deadline: wizardAnswers.deadline,
            priority: '高',
          },
        };

      const res = await fetch('/production-scheduler/api/analyze', {
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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return styles['priority-high'];
      case 'medium': return styles['priority-medium'];
      case 'low': return styles['priority-low'];
      default: return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '电子产品':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <path d="M9 6h6M9 10h6M9 14h4"/>
          </svg>
        );
      case '机械加工':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        );
      case '注塑成型':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v6M12 22v-6M4.93 10.93l4.24 4.24M14.83 8.83l4.24-4.24M2 12h6M22 12h-6M4.93 13.07l4.24-4.24M14.83 15.17l4.24 4.24"/>
          </svg>
        );
      case '表面处理':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        );
      case '装配作业':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
        );
      case '包装物流':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
          </svg>
        );
      case '食品医药':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
        );
    }
  };

  return (
    <div className={styles['app-container']}>
      <div className={styles['content-wrapper']}>
        <a href="http://47.112.29.121/" className={styles['back-button']}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回主页
        </a>

        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles['logo-icon']}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
              </svg>
            </div>
            <div className={styles['logo-text']}>
              <h1>生产排程调度系统</h1>
              <p>智能优化生产计划，提升设备利用率与交付效率</p>
            </div>
          </div>
        </header>

        <section className={styles['input-section']}>
          <div className={styles['mode-tabs']}>
            <button
              className={`${styles.tab} ${mode === 'template' ? styles.active : ''}`}
              onClick={() => setMode('template')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
              </svg>
              模板选择
            </button>
            <button
              className={`${styles.tab} ${mode === 'wizard' ? styles.active : ''}`}
              onClick={() => setMode('wizard')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              自定义输入
            </button>
          </div>

          <div className={styles.card}>
            {mode === 'template' ? (
              <div className={styles['form-content']}>
                <div className={styles['template-selector']}>
                  <div className={styles['template-header']}>
                    <label className={styles['form-label']}>选择生产模板</label>
                    {selectedTemplate && (
                      <button className={styles['btn-reset']} onClick={handleReset}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        清空
                      </button>
                    )}
                  </div>
                  <div className={styles['dropdown-container']}>
                    <button
                      className={`${styles['dropdown-trigger']} ${showDropdown ? styles.open : ''}`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className={styles['dropdown-text']}>
                        {selectedTemplate
                          ? templates.find(t => t.id === selectedTemplate)?.name
                          : '请选择生产模板...'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles['dropdown-arrow']}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className={styles['dropdown-menu']}>
                        {categories.map(category => (
                          <div key={category} className={styles['dropdown-category']}>
                            <div className={styles['category-label']}>
                              {getCategoryIcon(category)}
                              {category}
                            </div>
                            <div className={styles['category-templates']}>
                              {templates.filter(t => t.category === category).map(template => (
                                <button
                                  key={template.id}
                                  className={`${styles['template-item']} ${selectedTemplate === template.id ? styles.selected : ''}`}
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

                <div className={styles['form-header']}>
                  <label className={styles['form-label']}>生产任务描述</label>
                </div>
                <textarea
                  className={styles.textarea}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="描述生产任务内容，例如：进行500件金属零件的CNC加工，材质为铝合金..."
                />

                <div className={styles['context-grid']}>
                  {[
                    { key: 'machines', label: '设备/机器', placeholder: 'CNC加工中心、铣床' },
                    { key: 'workers', label: '人员配置', placeholder: '操作工3人、质检员1人' },
                    { key: 'materials', label: '物料情况', placeholder: '铝材棒料、刀具' },
                    { key: 'deadline', label: '交期要求', placeholder: '当日完成、下周三前' },
                  ].map((field) => (
                    <div className={styles['form-group']} key={field.key}>
                      <label className={styles['form-label-sm']}>{field.label}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={context[field.key as keyof ProductionContext]}
                        onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className={`${styles['btn-primary']} ${!jobDescription ? styles.disabled : ''}`}
                  onClick={handleSubmit}
                  disabled={loading || !jobDescription}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner}></span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      生成排程方案
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className={styles['form-content']}>
                <div className={styles['wizard-progress']}>
                  {wizardQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`${styles['progress-dot']} ${i <= wizardStep ? styles.active : ''} ${i < wizardStep ? styles.completed : ''}`}
                    />
                  ))}
                  <span className={styles['progress-text']}>{wizardStep + 1} / {wizardQuestions.length}</span>
                </div>

                <div className={styles['wizard-question']}>
                  <h3>{wizardQuestions[wizardStep].question}</h3>
                  <textarea
                    className={styles.textarea}
                    value={wizardAnswers[wizardQuestions[wizardStep].key] || ''}
                    onChange={(e) =>
                      setWizardAnswers({ ...wizardAnswers, [wizardQuestions[wizardStep].key]: e.target.value })
                    }
                    placeholder={wizardQuestions[wizardStep].placeholder}
                  />
                </div>

                <div className={styles['wizard-actions']}>
                  {wizardStep > 0 && (
                    <button className={styles['btn-outline']} onClick={() => setWizardStep(wizardStep - 1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      上一步
                    </button>
                  )}
                  <button
                    className={styles['btn-primary']}
                    onClick={() => {
                      if (wizardStep < wizardQuestions.length - 1) {
                        setWizardStep(wizardStep + 1);
                      } else {
                        handleSubmit();
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className={styles.spinner}></span>
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
                        生成排程方案
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
            <div className={styles['error-message']}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className={styles['result-section']}>
            <div className={styles['result-header']}>
              <div className={styles['result-icon']}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h2>排程方案</h2>
                <p>已生成优化生产计划</p>
              </div>
            </div>

            <div className={styles['result-card']}>
              <h3 className={styles['section-title']}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1"/>
                </svg>
                任务分解
              </h3>
              <div className={styles['tasks-list']}>
                {result.tasks.map((task, idx) => (
                  <div className={styles['task-item']} key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className={styles['task-header']}>
                      <span className={styles['task-name']}>
                        {task.name}
                        <span className={`${styles['priority-badge']} ${getPriorityClass(task.priority)}`}>
                          {getPriorityLabel(task.priority)}优先级
                        </span>
                      </span>
                      <span className={styles['task-skills']}>{task.resources.join('、')}</span>
                    </div>
                    <div className={styles['task-scores']}>
                      <div className={styles['score-item']}>
                        <span className={styles['score-label']}>预计工期</span>
                        <span className={styles['score-value']}>{task.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['result-card']}>
              <h3 className={styles['section-title']}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                排程时间表
              </h3>
              <div className={styles['schedule-output']}>
                {result.schedule.map((item, idx) => (
                  <div className={styles['schedule-item']} key={idx}>
                    <span className={styles['schedule-time']}>{item.time}</span>
                    <span className={styles['schedule-content']}>
                      <strong>{item.task}</strong>
                      {item.machine && ` | 设备: ${item.machine}`}
                      {item.worker && ` | 人员: ${item.worker}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.optimizeSuggestions && result.recommendations.optimizeSuggestions.length > 0 && (
              <div className={styles['result-card']}>
                <h3 className={styles['section-title']}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
                  </svg>
                  优化建议
                </h3>
                <ul className={styles['suggestions-list']}>
                  {result.recommendations.optimizeSuggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations.riskWarnings && result.recommendations.riskWarnings.length > 0 && (
              <div className={styles['result-card']}>
                <h3 className={styles['section-title']}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <path d="M12 9v4M12 17h.01"/>
                  </svg>
                  风险预警
                </h3>
                <ul className={styles['suggestions-list']}>
                  {result.recommendations.riskWarnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations.resourceSuggestions && result.recommendations.resourceSuggestions.length > 0 && (
              <div className={styles['result-card']}>
                <h3 className={styles['section-title']}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  资源建议
                </h3>
                <ul className={styles['suggestions-list']}>
                  {result.recommendations.resourceSuggestions.map((suggestion, idx) => (
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

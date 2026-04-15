'use client';

import { useState, useEffect } from 'react';
import { allSkills, skillCategories } from '@/lib/skills';
import { Skill, SkillTemplate } from '@/lib/types';

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(allSkills[0]);
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<SkillTemplate | null>(null);
  const [customInput, setCustomInput] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Check auth and extract token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      window.location.href = 'http://47.112.29.121/';
      return;
    }

    setToken(tokenParam);

    // Validate token
    fetch('http://47.112.29.121/api/auth/me', {
      headers: { Authorization: `Bearer ${tokenParam}` },
    })
      .then(res => {
        if (!res.ok) {
          window.location.href = 'http://47.112.29.121/';
        }
      })
      .catch(() => {
        window.location.href = 'http://47.112.29.121/';
      });
  }, []);

  // Read skill from URL query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skillId = params.get('skill');
    if (skillId) {
      const skill = allSkills.find(s => s.id === skillId);
      if (skill) {
        setSelectedSkill(skill);
      }
    }
  }, []);

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setSelectedTemplate(null);
    setCustomInput({});
    setResult(null);
    setMode('template');
    setShowDropdown(false);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('skill', skill.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleSelectTemplate = (template: SkillTemplate) => {
    setSelectedTemplate(template);
    setMode('template');
    setShowDropdown(false);
  };

  const handleApplyTemplate = (template: SkillTemplate) => {
    setSelectedTemplate(template);
    setMode('template');
    setShowDropdown(false);
  };

  const handleAnalyze = async () => {
    if (!token) {
      setError('请先登录');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const inputData = mode === 'template' && selectedTemplate
        ? selectedTemplate.inputData
        : customInput;

      const response = await fetch('/manufacturing-skills/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: selectedSkill.id,
          input: inputData,
          mock: false,
          token: token,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setCustomInput({});
    setResult(null);
    setError('');
  };

  const getCurrentInputData = () => {
    if (mode === 'template' && selectedTemplate) {
      return selectedTemplate.inputData;
    }
    return customInput;
  };

  return (
    <div className="app-container">
      <a href="http://47.112.29.121/" className="back-home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        返回主页
      </a>

      {/* Skill Selector - Left Sidebar */}
      <aside className="skill-selector">
        <div className="skill-selector-header">
          <h2>🏭 制造技能平台</h2>
          <p>选择技能开始分析</p>
        </div>

        <div className="skill-list">
          {skillCategories.map(category => (
            <div key={category}>
              <div style={{ padding: '8px 16px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {category}
              </div>
              {allSkills.filter(s => s.category === category).map(skill => (
                <div
                  key={skill.id}
                  className={`skill-item ${selectedSkill.id === skill.id ? 'active' : ''}`}
                  onClick={() => handleSelectSkill(skill)}
                >
                  <div className="skill-icon">{skill.icon}</div>
                  <div className="skill-info">
                    <h3>{skill.name}</h3>
                    <p>{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Workspace - Right Content */}
      <main className="workspace">
        <div className="workspace-header">
          <h1>
            <span>{selectedSkill.icon}</span>
            {selectedSkill.name}
          </h1>
          <p>{selectedSkill.description}</p>
        </div>

        <div className="mode-tabs">
          <button
            className={`tab ${mode === 'template' ? 'active' : ''}`}
            onClick={() => setMode('template')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M9 9h6M9 13h6M9 17h4"></path>
            </svg>
            模板选择
          </button>
          <button
            className={`tab ${mode === 'custom' ? 'active' : ''}`}
            onClick={() => setMode('custom')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            自定义输入
          </button>
        </div>

        <div className="card">
          <div className="form-content">
            {mode === 'template' ? (
              <>
                <div style={{ position: 'relative' }}>
                  <label className="form-label">选择分析模板</label>
                  <button
                    className={`dropdown-trigger ${showDropdown ? 'active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span>{selectedTemplate?.name || '请选择分析模板...'}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={showDropdown ? 'dropdown-arrow' : ''}>
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu" style={{ position: 'relative' }}>
                      {selectedSkill.templates.map(template => (
                        <div
                          key={template.id}
                          className={`dropdown-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                          onClick={() => handleApplyTemplate(template)}
                        >
                          <div style={{ fontWeight: 500 }}>{template.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{template.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTemplate && (
                  <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>输入数据预览</div>
                    <pre style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {JSON.stringify(selectedTemplate.inputData, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <>
                {selectedSkill.apiFields.map(field => (
                  <div key={field.key}>
                    <label className="form-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="textarea"
                        placeholder={field.placeholder}
                        value={customInput[field.key] || ''}
                        onChange={(e) => setCustomInput({ ...customInput, [field.key]: e.target.value })}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        className="dropdown-trigger"
                        style={{ width: '100%' }}
                        value={customInput[field.key] || ''}
                        onChange={(e) => setCustomInput({ ...customInput, [field.key]: e.target.value })}
                      >
                        <option value="">请选择...</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="dropdown-trigger"
                        style={{ width: '100%' }}
                        placeholder={field.placeholder}
                        value={customInput[field.key] || ''}
                        onChange={(e) => setCustomInput({ ...customInput, [field.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading || (mode === 'template' ? !selectedTemplate : Object.keys(customInput).length === 0)}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    分析中...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                    开始分析
                  </>
                )}
              </button>
              <button
                className="btn-primary"
                style={{ background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(148, 163, 184, 0.2)' }}
                onClick={handleReset}
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171' }}>
            {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-card">
              <div className="result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <h3>分析结果</h3>
              </div>
              <div className="result-content">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

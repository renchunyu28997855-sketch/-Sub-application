'use client';

import { useState, useEffect } from 'react';
import { allSkills, skillCategories, getSkillsByCategory } from '@/lib/skills';
import { Skill, SkillCategory } from '@/lib/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);

  // Check auth and extract token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      window.location.href = 'http://47.112.29.121/';
      return;
    }

    setToken(tokenParam);

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

  const handleSelectCategory = (category: SkillCategory) => {
    setSelectedCategory(category);
    setSelectedSkill(null);
    setResult(null);
    setShowCategories(false);
  };

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setResult(null);
    setUserInput('');
    setShowCategories(false);
  };

  const handleBack = () => {
    if (selectedSkill) {
      setSelectedSkill(null);
      setResult(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setShowCategories(true);
    }
  };

  const handleAnalyze = async () => {
    if (!token || !selectedSkill) return;

    if (!userInput.trim()) {
      setError('请输入内容');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/unified-skills/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: selectedSkill.id,
          input: userInput,
          token: token,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getSkillsForCurrentView = () => {
    if (selectedCategory) {
      return getSkillsByCategory(selectedCategory.key);
    }
    return [];
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <div className="top-nav">
        {selectedSkill ? (
          <button onClick={handleBack} className="back-btn">
            <span>←</span>
          </button>
        ) : selectedCategory ? (
          <button onClick={handleBack} className="back-btn">
            <span>←</span>
          </button>
        ) : (
          <a href="http://47.112.29.121/" className="back-btn">
            <span>🏠</span>
          </a>
        )}

        <div className="nav-title">
          {selectedSkill ? (
            <>
              <span>{selectedSkill.icon}</span>
              <span>{selectedSkill.name}</span>
            </>
          ) : selectedCategory ? (
            <>
              <span>{selectedCategory.icon}</span>
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span>AI 技能平台</span>
          )}
        </div>

        <div style={{ width: '44px' }}></div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {/* Categories View */}
        {showCategories && !selectedCategory && (
          <div className="categories-grid">
            {skillCategories.map(cat => (
              <div
                key={cat.key}
                className="category-card"
                onClick={() => handleSelectCategory(cat)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">
                  {allSkills.filter(s => s.categoryKey === cat.key).length} 个技能
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills List View */}
        {selectedCategory && !selectedSkill && (
          <div className="skills-list">
            <div className="skills-list-header">
              <div className="skills-list-title">
                {selectedCategory.icon} {selectedCategory.name}
              </div>
            </div>
            <div className="skills-grid">
              {getSkillsForCurrentView().map(skill => (
                <div
                  key={skill.id}
                  className="skill-card"
                  onClick={() => handleSelectSkill(skill)}
                >
                  <div className="skill-card-icon">{skill.icon}</div>
                  <div className="skill-card-name">{skill.name}</div>
                  <div className="skill-card-desc">{skill.description}</div>
                  {skill.whenToUse && (
                    <div className="skill-card-hint">适用：{skill.whenToUse}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Detail View */}
        {selectedSkill && (
          <div className="skill-detail">
            <div className="skill-detail-header">
              <div className="skill-detail-icon">{selectedSkill.icon}</div>
              <div className="skill-detail-info">
                <h1>{selectedSkill.name}</h1>
                <p>{selectedSkill.description}</p>
              </div>
            </div>

            <div className="input-section">
              <textarea
                className="input-textarea"
                placeholder={selectedSkill.inputFormat || '请输入内容...'}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={8}
              />
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !userInput.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  分析中...
                </>
              ) : (
                <>
                  <span>✨</span>
                  开始分析
                </>
              )}
            </button>

            {error && (
              <div className="error-message">{error}</div>
            )}

            {result && (
              <div className="result-section">
                <div className="result-header">
                  <span>📋</span>
                  <h3>分析结果</h3>
                </div>
                <pre className="result-content">
                  {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

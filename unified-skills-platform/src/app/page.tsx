'use client';

import { useState, useEffect, useRef } from 'react';
import { getSkillById } from '@/lib/skills';
import { Skill } from '@/lib/types';
import { getSkillGuideResolved, buildInputFromGuide, SkillGuide, InputField, SelectOption } from '@/lib/skill-guides';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [skillGuide, setSkillGuide] = useState<SkillGuide | null>(null);
  const [guideValues, setGuideValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = 'unified-skills-conversations';

  // 检测 localStorage 是否可用（无痕模式下可能不可用）
  const isStorageAvailable = (): boolean => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  const storageAvailable = typeof window !== 'undefined' ? isStorageAvailable() : false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConversation = (skillId: string, msgs: Message[]) => {
    if (!storageAvailable) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const conversations: Record<string, Message[]> = stored ? JSON.parse(stored) : {};
      conversations[skillId] = msgs;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversation:', e);
    }
  };

  const loadConversation = (skillId: string): Message[] => {
    if (!storageAvailable) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const conversations: Record<string, Message[]> = JSON.parse(stored);
        return conversations[skillId] || [];
      }
    } catch (e) {
      console.error('Failed to load conversation:', e);
    }
    return [];
  };

  const clearConversation = (skillId: string) => {
    if (!storageAvailable) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const conversations: Record<string, Message[]> = JSON.parse(stored);
        delete conversations[skillId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      }
    } catch (e) {
      console.error('Failed to clear conversation:', e);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const skillParam = params.get('skill');

    if (!tokenParam || !skillParam) {
      window.location.href = 'http://47.112.29.121/';
      return;
    }

    setToken(tokenParam);

    const skill = getSkillById(skillParam);
    if (skill) {
      setSelectedSkill(skill);
      setMessages(loadConversation(skill.id));
      setConversationId(skill.id);
      // 加载技能引导配置（优先专用配置，兜底通用生成）
      const guide = getSkillGuideResolved(skill.id, skill.name, skill.description, skill.inputFormat);
      setSkillGuide(guide);
      setIsReady(true);
    } else {
      setError('技能不存在');
      setIsReady(true);
    }
  }, []);

  // 处理选项选择（单选）
  const handleSelectOption = (fieldId: string, value: string) => {
    const newValues = { ...guideValues, [fieldId]: value };
    setGuideValues(newValues);

    // 如果有技能引导，尝试构建输入
    if (skillGuide) {
      const input = buildInputFromGuide(skillGuide, newValues);
      setUserInput(input);
    }
  };

  // 处理多选切换
  const handleMultiSelectToggle = (fieldId: string, value: string) => {
    const currentValues = guideValues[fieldId]?.split(',').filter(Boolean) || [];
    const newValues = { ...guideValues };

    if (currentValues.includes(value)) {
      // 取消选择
      newValues[fieldId] = currentValues.filter(v => v !== value).join(',');
    } else {
      // 添加选择
      newValues[fieldId] = [...currentValues, value].join(',');
    }

    setGuideValues(newValues);

    if (skillGuide) {
      const input = buildInputFromGuide(skillGuide, newValues);
      setUserInput(input);
    }
  };

  // 快速模板选择
  const handleQuickTemplate = (template: { name: string; description: string; values: Record<string, string> }) => {
    if (template) {
      setGuideValues(template.values);
      if (skillGuide) {
        const input = buildInputFromGuide(skillGuide, template.values);
        setUserInput(input);
      }
    }
  };

  // 清空选择
  const handleClearGuide = () => {
    setGuideValues({});
    setCurrentStep(0);
  };

  const handleNewChat = () => {
    if (conversationId) {
      clearConversation(conversationId);
      setMessages([]);
      handleClearGuide();
    }
  };

  const handleAnalyze = async () => {
    if (!token || !selectedSkill) return;

    if (!userInput.trim()) {
      setError('请输入内容');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessages = [...messages, userMessage];
    setUserInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/unified-skills/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: selectedSkill.id,
          input: userInput,
          token: token,
          messages: currentMessages.slice(0, -1),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setMessages(prev => prev.slice(0, -1));
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: typeof data === 'string' ? data : (data.analysis || data.result || JSON.stringify(data, null, 2)),
          timestamp: Date.now(),
        };
        const newMessages = [...currentMessages, assistantMessage];
        setMessages(newMessages);

        if (conversationId) {
          saveConversation(conversationId, newMessages);
        }
      }
    } catch {
      setError('分析失败，请稍后重试');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  if (!isReady) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <div className="loading-ring"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!selectedSkill) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <p>{error || '技能不存在'}</p>
          <a href="http://47.112.29.121/" className="btn-home">返回首页</a>
        </div>
      </div>
    );
  }

  const chineseName = selectedSkill.description?.split('。')[0] || selectedSkill.name;

  // 当前引导字段
  const currentField = skillGuide?.fields[currentStep];

  return (
    <div className="chat-container">
      {/* 顶部导航 */}
      <header className="chat-header">
        <a href="http://47.112.29.121/" className="btn-home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span>AI应用中心</span>
        </a>
        <div className="header-skill">
          <span className="skill-icon">{selectedSkill.icon}</span>
          <span className="skill-name">{chineseName}</span>
        </div>
        <div style={{ width: '120px' }}></div>
      </header>

      {/* 聊天区域 */}
      <main className="chat-main">
        <div className="messages-wrapper">
          {messages.length === 0 && skillGuide && (
            <div className="guide-panel">
              <div className="guide-header">
                <h2>{skillGuide.title}</h2>
                <p>{skillGuide.description}</p>
              </div>

              {/* 快速模板 */}
              {skillGuide.quickTemplates && skillGuide.quickTemplates.length > 0 && (
                <div className="guide-section">
                  <h3>快速开始</h3>
                  <div className="quick-templates">
                    {skillGuide.quickTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        className="quick-template-btn"
                        onClick={() => handleQuickTemplate(template)}
                      >
                        <span className="template-name">{template.name}</span>
                        <span className="template-desc">{template.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 引导选项 */}
              <div className="guide-section">
                <h3>或者自定义</h3>
                {skillGuide.fields.map((field, idx) => (
                  <div key={field.id} className="guide-field">
                    <label className="field-label">
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </label>

                    {field.type === 'select' && field.options && (
                      <div className="option-cards">
                        {field.options.map((option) => (
                          <button
                            key={option.value}
                            className={`option-card ${guideValues[field.id] === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelectOption(field.id, option.value)}
                          >
                            <span className="option-label">{option.label}</span>
                            {option.description && (
                              <span className="option-desc">{option.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {field.type === 'select-multiple' && field.options && (
                      <>
                        <div className="option-cards">
                          {field.options.map((option) => {
                            const currentValues = guideValues[field.id]?.split(',').filter(Boolean) || [];
                            const isSelected = currentValues.includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`option-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleMultiSelectToggle(field.id, option.value)}
                              >
                                <span className="option-label">
                                  {isSelected && '✓ '}{option.label}
                                </span>
                                {option.description && (
                                  <span className="option-desc">{option.description}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {field.multiSelectHint && (
                          <p className="multi-select-hint">{field.multiSelectHint}</p>
                        )}
                      </>
                    )}

                    {field.type === 'text' && (
                      <input
                        type="text"
                        className="guide-input"
                        placeholder={field.placeholder}
                        value={guideValues[field.id] || ''}
                        onChange={(e) => handleSelectOption(field.id, e.target.value)}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        className="guide-textarea"
                        placeholder={field.placeholder}
                        value={guideValues[field.id] || ''}
                        onChange={(e) => handleSelectOption(field.id, e.target.value)}
                        rows={3}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="guide-actions">
                <button className="guide-clear-btn" onClick={handleClearGuide}>
                  清空选择
                </button>
              </div>
            </div>
          )}

          {messages.length === 0 && !skillGuide && (
            <div className="welcome-card">
              <div className="welcome-icon">{selectedSkill.icon}</div>
              <h2>{chineseName}</h2>
              <p>{selectedSkill.inputFormat || '请输入您的内容，我会帮您分析'}</p>
              <div className="welcome-hint">
                <span className="hint-badge">💡 按 Enter 发送</span>
                <span className="hint-badge">💬 支持多轮对话</span>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12z"/>
                  </svg>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">{msg.content}</div>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message message-assistant">
              <div className="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12z"/>
                </svg>
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 输入区域 */}
      <footer className="chat-footer">
        {error && <div className="error-toast">{error}</div>}
        <div className="input-wrapper">
          <textarea
            className="chat-input"
            placeholder="输入消息，或点击上方选项自动填入..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={handleAnalyze}
            disabled={loading || !userInput.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
        {messages.length > 0 && (
          <button onClick={handleNewChat} className="new-chat-link">+ 新对话</button>
        )}
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { getSkillById } from '@/lib/skills';
import { Skill } from '@/lib/types';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = 'unified-skills-conversations';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConversation = (skillId: string, msgs: Message[]) => {
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
      setIsReady(true);
    } else {
      setError('技能不存在');
      setIsReady(true);
    }
  }, []);

  const handleNewChat = () => {
    if (conversationId) {
      clearConversation(conversationId);
      setMessages([]);
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
          {messages.length === 0 && (
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
            placeholder="输入消息..."
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

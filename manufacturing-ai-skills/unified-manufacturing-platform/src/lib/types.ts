// 统一技能配置类型

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  inputData: Record<string, unknown>;
  context: Record<string, string>;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  inputPrompt: string;
  outputFormat: string;
  templates: SkillTemplate[];
  apiFields: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  }[];
}

export interface AnalysisResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

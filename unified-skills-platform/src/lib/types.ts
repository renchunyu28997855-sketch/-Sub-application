// 统一技能配置类型

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  categoryKey: string;
  whenToUse: string;
  systemPrompt: string;
  inputFormat: string;
  path: string;
}

export interface SkillCategory {
  key: string;
  name: string;
  icon: string;
}

export interface SkillsConfig {
  categories: SkillCategory[];
  skills: Skill[];
}

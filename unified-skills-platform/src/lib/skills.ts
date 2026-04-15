import { Skill, SkillsConfig } from './types';
import skillsConfig from './skills-config.json';

const config = skillsConfig as SkillsConfig;

export const allSkills: Skill[] = config.skills;
export const skillCategories = config.categories;

export function getSkillsByCategory(categoryKey: string): Skill[] {
  return allSkills.filter(s => s.categoryKey === categoryKey);
}

export function getSkillById(id: string): Skill | undefined {
  return allSkills.find(s => s.id === id);
}

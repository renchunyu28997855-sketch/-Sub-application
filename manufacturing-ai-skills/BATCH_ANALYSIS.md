/**
 * 批量技能分析脚本
 * 用于分析 manufacturing-ai-skills 目录下的所有技能
 */

const fs = require('fs').promises;
const path = require('path');

// 读取技能目录
async function getSkills(basePath) {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'docs') {
      const skillPath = path.join(basePath, entry.name);
      const indexPath = path.join(skillPath, 'index.js');
      const skillMdPath = path.join(skillPath, 'skill.md');

      const hasIndex = await fs.access(indexPath).then(() => true).catch(() => false);
      const hasSkillMd = await fs.access(skillMdPath).then(() => true).catch(() => false);

      if (hasIndex) {
        skills.push({
          name: entry.name,
          path: skillPath,
          hasIndex,
          hasSkillMd
        });
      }
    }
  }

  return skills;
}

// 读取技能文件
async function readSkillFiles(skill) {
  try {
    const indexPath = path.join(skill.path, 'index.js');
    const skillMdPath = path.join(skill.path, 'skill.md');

    const indexContent = await fs.readFile(indexPath, 'utf8');
    let skillMdContent = null;
    let description = null;

    if (skill.hasSkillMd) {
      skillMdContent = await fs.readFile(skillMdPath, 'utf8');
      // 尝试提取描述
      const descMatch = skillMdContent.match(/description:\s*["']([^"']+)["']/);
      if (descMatch) {
        description = descMatch[1];
      }
    }

    return {
      ...skill,
      indexContent,
      skillMdContent,
      description
    };
  } catch (error) {
    return { ...skill, error: error.message };
  }
}

// 提取技能功能关键词
function extractKeywords(skill) {
  const text = ((skill.indexContent || '') + ' ' + (skill.description || '')).toLowerCase();

  const keywords = {
    // 检测类
    quality_check: /quality[_-]?check|quality[_-]?detection|quality[_-]?inspection/i.test(text),
    defect_detection: /defect[_-]?detection|visual[_-]?inspection|surface[_-]?check/i.test(text),
    wear_detection: /wear[_-]?detection|tool[_-]?wear|belt[_-]?wear/i.test(text),
    health_monitoring: /health[_-]?monitoring|bearing[_-]?health|motor[_-]?current/i.test(text),
    contamination: /contamination[_-]?detection/i.test(text),
    dimension: /dimension[_-]?measurement|dimension[_-]?check/i.test(text),
    color: /color[_-]?difference|color[_-]?check/i.test(text),
    coating: /coating[_-]?thickness/i.test(text),
    weld: /weld[_-]?quality|weld[_-]?inspection/i.test(text),
    surface: /surface[_-]?roughness|surface[_-]?check/i.test(text),
    vibration: /vibration[_-]?analysis/i.test(text),
    thermal: /thermal[_-]?monitoring/i.test(text),

    // 优化类
    scheduling: /scheduling|shift[_-]?scheduling|production[_-]?scheduling/i.test(text),
    planning: /planning|capacity[_-]?planning/i.test(text),
    optimization: /optimization|delivery[_-]?optimization|energy[_-]?saving/i.test(text),
    line_balancing: /line[_-]?balancing|production[_-]?line[_-]?balancing/i.test(text),
    bottleneck: /bottleneck[_-]?identification/i.test(text),

    // 预测类
    prediction: /prediction|predictive|remaining[_-]?life|inventory[_-]?prediction/i.test(text),
    failure: /failure[_-]?prediction|equipment[_-]?failure/i.test(text),
    spoilage: /spoilage[_-]?prediction/i.test(text),

    // 维护类
    maintenance: /maintenance[_-]?schedule|lubrication[_-]?advisory/i.test(text),

    // 能源类
    energy: /energy[_-]?consumption|energy[_-]?efficiency|equipment[_-]?energy/i.test(text),
    peak_shaving: /peak[_-]?shaving/i.test(text),
    renewable: /renewable[_-]?energy/i.test(text),
    carbon: /carbon[_-]?emission/i.test(text),
    hvac: /hvac/i.test(text),
    lighting: /lighting[_-]?optimization/i.test(text),
    air_compressor: /air[_-]?compressor/i.test(text),

    // 物流类
    picking: /picking[_-]?path|warehouse[_-]?layout/i.test(text),
    delivery: /delivery[_-]?optimization/i.test(text),

    // 物料类
    material: /material[_-]?replenishment|material[_-]?substitution|material[_-]?traceability/i.test(text),
    procurement: /procurement[_-]?optimization/i.test(text),
    incoming: /incoming[_-]?inspection/i.test(text),

    // 供应链类
    supplier: /supplier[_-]?performance/i.test(text),
    multi_plant: /multi[_-]?plant[_-]?coordination/i.test(text),
    order_priority: /order[_-]?priority/i.test(text),
    rush_order: /rush[_-]?order/i.test(text),
    resource: /resource[_-]?allocation/i.test(text),

    // 其他
    label: /label[_-]?recognition/i.test(text),
    packaging: /packaging[_-]?quality/i.test(text),
    cost: /cost[_-]?allocation/i.test(text),
  };

  return keywords;
}

// 技能分类
function categorizeSkill(skill) {
  const keywords = skill.keywords;

  if (keywords.quality_check || keywords.defect_detection || keywords.visual_inspection) return 'quality-detection';
  if (keywords.wear_detection) return 'wear-detection';
  if (keywords.health_monitoring) return 'health-monitoring';
  if (keywords.contamination) return 'contamination-detection';
  if (keywords.dimension) return 'dimension-measurement';
  if (keywords.color) return 'color-detection';
  if (keywords.coating) return 'coating-detection';
  if (keywords.weld) return 'weld-inspection';
  if (keywords.surface) return 'surface-inspection';
  if (keywords.vibration) return 'vibration-analysis';
  if (keywords.thermal) return 'thermal-monitoring';
  if (keywords.scheduling) return 'scheduling';
  if (keywords.planning) return 'planning';
  if (keywords.optimization) return 'optimization';
  if (keywords.line_balancing) return 'line-balancing';
  if (keywords.bottleneck) return 'bottleneck-analysis';
  if (keywords.prediction) return 'prediction';
  if (keywords.failure) return 'failure-prediction';
  if (keywords.spoilage) return 'spoilage-prediction';
  if (keywords.maintenance) return 'maintenance';
  if (keywords.energy) return 'energy-management';
  if (keywords.peak_shaving) return 'peak-shaving';
  if (keywords.renewable) return 'renewable-energy';
  if (keywords.carbon) return 'carbon-emission';
  if (keywords.hvac) return 'hvac';
  if (keywords.lighting) return 'lighting';
  if (keywords.air_compressor) return 'air-compressor';
  if (keywords.picking) return 'picking-optimization';
  if (keywords.delivery) return 'delivery-optimization';
  if (keywords.material) return 'material-management';
  if (keywords.procurement) return 'procurement';
  if (keywords.incoming) return 'incoming-inspection';
  if (keywords.supplier) return 'supplier-management';
  if (keywords.multi_plant) return 'multi-plant';
  if (keywords.order_priority) return 'order-priority';
  if (keywords.rush_order) return 'rush-order';
  if (keywords.resource) return 'resource-allocation';
  if (keywords.label) return 'label-recognition';
  if (keywords.packaging) return 'packaging-quality';
  if (keywords.cost) return 'cost-allocation';

  return 'other';
}

// 主函数
async function main() {
  console.log('===========================================');
  console.log('  制造业AI技能 - 批量分析');
  console.log('===========================================\n');

  const basePath = 'F:/develop/app/manufacturing-ai-skills';

  // 1. 获取所有技能
  console.log('1. 扫描技能目录...');
  const skills = await getSkills(basePath);
  console.log(`   发现 ${skills.length} 个技能\n`);

  // 2. 读取所有技能文件
  console.log('2. 读取技能文件...');
  const skillsWithContent = [];
  for (const skill of skills) {
    const s = await readSkillFiles(skill);
    s.keywords = extractKeywords(s);
    s.category = categorizeSkill(s);
    skillsWithContent.push(s);
    process.stdout.write('.');
  }
  console.log('\n');

  // 3. 按类别分组
  console.log('3. 按功能分类...');
  const categories = {};
  for (const skill of skillsWithContent) {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  }

  console.log('\n技能分布:');
  for (const [cat, catskills] of Object.entries(categories)) {
    console.log(`   ${cat}: ${catskills.length}个`);
    catskills.forEach(s => console.log(`      - ${s.name}`));
  }
  console.log();

  // 4. 找出可能重复的技能
  console.log('4. 分析相似/重复技能...');

  // 统计每类别的技能数量
  const duplicates = [];
  for (const [cat, catskills] of Object.entries(categories)) {
    if (catskills.length > 1) {
      duplicates.push({
        category: cat,
        skills: catskills,
        suggestion: '可考虑合并'
      });
    }
  }

  if (duplicates.length > 0) {
    console.log('\n发现可能的重复/相似技能:');
    for (const d of duplicates) {
      console.log(`\n  【${d.category}】(${d.skills.length}个)`);
      d.skills.forEach(s => console.log(`     - ${s.name}`));
    }
  }

  // 5. 生成汇总报告
  console.log('\n5. 生成汇总报告...');

  const report = {
    total: skillsWithContent.length,
    categories: Object.keys(categories).length,
    categoryDetails: {},
    duplicates: duplicates.map(d => ({ category: d.category, count: d.skills.length, skills: d.skills.map(s => s.name) })),
    recommendations: []
  };

  for (const [cat, catskills] of Object.entries(categories)) {
    report.categoryDetails[cat] = {
      count: catskills.length,
      skills: catskills.map(s => ({
        name: s.name,
        hasDoc: s.hasSkillMd
      }))
    };

    if (catskills.length > 3) {
      report.recommendations.push({
        type: 'consolidate',
        category: cat,
        message: `${cat}类别有${catskills.length}个技能，建议合并为更少的高级技能`
      });
    }
  }

  // 6. 保存报告
  const reportPath = path.join(basePath, 'ANALYSIS_REPORT.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n报告已保存: ${reportPath}`);

  console.log('\n===========================================');
  console.log('  分析完成');
  console.log('===========================================');

  return report;
}

main().catch(console.error);

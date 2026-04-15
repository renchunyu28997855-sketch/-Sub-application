/**
 * Lubrication Advisory - 使用示例
 */

const { lubricationAdvisory } = require('../index.js');

// 示例1: 齿轮箱润滑建议
console.log('=== 示例1: 齿轮箱润滑建议 ===');
const gearboxResult = lubricationAdvisory({
  equipmentType: 'gearbox',
  operatingEnvironment: 'normal',
  operatingHours: 3500,
  loadCondition: 'heavy'
});

if (gearboxResult.success) {
  console.log('推荐油品:', gearboxResult.data.recommendedOilType);
  console.log('油品等级:', gearboxResult.data.oilGrade);
  console.log('润滑周期:', gearboxResult.data.adjustedInterval, '小时');
  console.log('润滑量:', gearboxResult.data.oilAmount.value, gearboxResult.data.oilAmount.unit);
  console.log('下次润滑日期:', gearboxResult.data.nextLubricationDate);
  console.log('建议:', gearboxResult.data.recommendations);
  console.log('置信度:', (gearboxResult.data.confidence * 100).toFixed(0) + '%');
} else {
  console.log('错误:', gearboxResult.error);
}

// 示例2: 高温环境下轴承润滑
console.log('\n=== 示例2: 高温环境轴承润滑 ===');
const bearingResult = lubricationAdvisory({
  equipmentType: 'bearing',
  operatingEnvironment: 'high-temp',
  operatingHours: 8000,
  loadCondition: 'medium',
  temperature: 65
});

if (bearingResult.success) {
  console.log('推荐油品:', bearingResult.data.recommendedOilType);
  console.log('油品等级:', bearingResult.data.oilGrade);
  console.log('润滑周期:', bearingResult.data.adjustedInterval, '小时');
  console.log('粘度建议:', bearingResult.data.viscosityRecommendation);
  console.log('建议:', bearingResult.data.recommendations);
} else {
  console.log('错误:', bearingResult.error);
}

// 示例3: 液压系统润滑
console.log('\n=== 示例3: 液压系统润滑 ===');
const hydraulicResult = lubricationAdvisory({
  equipmentType: 'hydraulic',
  operatingEnvironment: 'humid',
  operatingHours: 12000,
  loadCondition: 'shock'
});

if (hydraulicResult.success) {
  console.log('推荐油品:', hydraulicResult.data.recommendedOilType);
  console.log('润滑周期:', hydraulicResult.data.adjustedInterval, '小时');
  console.log('润滑量:', hydraulicResult.data.oilAmount.value, hydraulicResult.data.oilAmount.unit);
  console.log('建议:', hydraulicResult.data.recommendations);
} else {
  console.log('错误:', hydraulicResult.error);
}

// 示例4: 输入验证失败
console.log('\n=== 示例4: 输入验证 ===');
const invalidResult = lubricationAdvisory({
  equipmentType: '',
  operatingHours: -100
});

if (!invalidResult.success) {
  console.log('验证错误:', invalidResult.error.details);
}

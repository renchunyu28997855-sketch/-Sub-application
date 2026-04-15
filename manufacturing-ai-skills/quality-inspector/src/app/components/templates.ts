export interface InspectionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  parameters: {
    inspectionType: string;
    defaultParams: Record<string, any>;
  };
}

export const templates: InspectionTemplate[] = [
  {
    id: 'visual-defect',
    name: '视觉缺陷检测',
    category: '缺陷检测',
    description: '通过产品图片识别表面缺陷，如划痕、凹坑、色差、变形等',
    parameters: {
      inspectionType: 'visual-defect',
      defaultParams: {
        imageQuality: 'high',
        detectionSensitivity: 'medium',
        defectTypes: ['划痕', '凹坑', '气泡', '色差'],
      },
    },
  },
  {
    id: 'dimension',
    name: '尺寸测量检测',
    category: '精密检测',
    description: '测量产品关键尺寸，与公差要求对比分析',
    parameters: {
      inspectionType: 'dimension',
      defaultParams: {
        measurementMethod: 'caliper',
        tolerance: '±0.05mm',
        criticalDimensions: ['长度', '宽度', '高度', '直径'],
      },
    },
  },
  {
    id: 'surface-roughness',
    name: '表面粗糙度检测',
    category: '精密检测',
    description: '测量产品表面粗糙度参数，评估表面质量',
    parameters: {
      inspectionType: 'surface-roughness',
      defaultParams: {
        measurementMethod: 'profilometer',
        raRange: '0.1-3.2μm',
        evaluationLength: '5mm',
      },
    },
  },
  {
    id: 'coating-thickness',
    name: '涂层厚度检测',
    category: '材料检测',
    description: '测量涂层或镀层厚度，确保符合工艺要求',
    parameters: {
      inspectionType: 'coating-thickness',
      defaultParams: {
        measurementMethod: 'eddy-current',
        coatingType: '油漆/镀层',
        targetThickness: '20-50μm',
      },
    },
  },
  {
    id: 'color-difference',
    name: '色差检测',
    category: '外观检测',
    description: '测量产品颜色与标准色的差异，确保颜色一致性',
    parameters: {
      inspectionType: 'color-difference',
      defaultParams: {
        colorSpace: 'CIELab',
        tolerance: 'ΔE≤1.0',
        measurementMode: 'spot',
      },
    },
  },
  {
    id: 'comprehensive',
    name: '综合质量检测',
    category: '全面检测',
    description: '整合多种检测项目，提供全面的质量评估报告',
    parameters: {
      inspectionType: 'comprehensive',
      defaultParams: {
        includeVisual: true,
        includeDimension: true,
        includeSurface: true,
        inspectionLevel: 'full',
      },
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];

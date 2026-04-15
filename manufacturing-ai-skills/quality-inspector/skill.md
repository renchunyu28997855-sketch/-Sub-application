# Quality Inspector - 综合质量检测器

## 描述

综合质量检测技能，整合视觉缺陷检测、尺寸测量、表面粗糙度、涂层厚度、颜色差异、污染检测、焊接质量、装配质量、包装质量和来料检验等10项检测功能。

**版本**: 1.0.0
**合并来源**: visual-defect-detection, assembly-quality-check, coating-thickness-detection, color-difference-detection, contamination-detection, dimension-measurement, surface-roughness-detection, weld-quality-inspection, packaging-quality-check, incoming-inspection

## 功能特性

### 支持的检测类型

| 检测类型 | 说明 | 主要参数 |
|----------|------|----------|
| visual-defect | 视觉缺陷检测 | image, threshold |
| dimension | 尺寸测量 | measurements, tolerances |
| surface-roughness | 表面粗糙度 | roughnessData (Ra, Rz, Rq) |
| coating-thickness | 涂层厚度 | thickness |
| color-difference | 颜色差异 | colorData (L, a, b) |
| contamination | 污染检测 | contaminationLevel |
| weld-quality | 焊接质量 | weldData |
| assembly-quality | 装配质量 | assemblyData |
| packaging-quality | 包装质量 | packagingData |
| incoming-inspection | 来料检验 | materialData |
| comprehensive | 综合检测 | 组合上述多种检测 |

## 输入参数

```javascript
qualityInspector({
  inspectionType: string,        // 检测类型
  productId: string,            // 产品ID (必填)
  productType: string,           // 产品类型
  threshold: number,             // 置信度阈值 (默认0.7)
  parameters: {                 // 检测参数
    // 视觉检测
    image: Buffer,              // 图片数据

    // 尺寸检测
    measurements: {
      length: number,
      width: number,
      height: number,
      diameter: number,
      thickness: number
    },
    tolerances: {
      dimension: {
        length: { nominal: 100, tolerance: 0.1 },
        width: { nominal: 50, tolerance: 0.1 }
      }
    },

    // 表面粗糙度
    roughnessData: { Ra: 1.5, Rz: 8.0, Rq: 1.6 },

    // 涂层厚度
    thickness: 35,

    // 颜色差异
    colorData: {
      L: 50, a: 10, b: 20,
      L_ref: 50.5, a_ref: 10.2, b_ref: 20.1
    },

    // 污染检测
    contaminationLevel: 0.2,

    // 焊接质量
    weldData: {
      porosity: 0.02,
      cracks: false,
      incompletePenetration: false,
      undercut: false
    },

    // 装配质量
    assemblyData: {
      misalignment: 0.2,
      looseFasteners: 0,
      missingParts: 0,
      gaps: 0.1
    },

    // 包装质量
    packagingData: {
      damage: 'none',
      sealIntegrity: 0.98,
      labelAccuracy: 'correct',
      completeness: 100
    },

    // 来料检验
    materialData: {
      supplier: 'SUP-001',
      batchId: 'BATCH-2026-001',
      quantity: { received: 1000, ordered: 1000 },
      qualityCert: { valid: true, expired: false },
      condition: 'good',
      tests: [
        { name: 'tensile_strength', passed: true, details: '450MPa' }
      ]
    }
  }
})
```

## 输出格式

```javascript
{
  success: true,
  productId: "PROD-001",
  productType: "metal-part",
  inspectionType: "visual-defect",
  timestamp: "2026-04-15T10:30:00.000Z",
  processingTime: 125,

  // 检测结果 (根据类型不同结构有所差异)
  inspection: {
    success: true,
    hasDefects: true,
    allPassed: false,
    overallStatus: "fail",

    // 视觉检测结果
    defects: [
      {
        type: "scratch",
        confidence: 0.85,
        location: { x: 150, y: 200, width: 100, height: 50 },
        severity: "medium"
      }
    ],
    totalDefects: 1,

    // 尺寸检测结果
    dimensions: [
      {
        dimension: "length",
        value: 100.05,
        nominal: 100,
        tolerance: 0.1,
        deviation: 0.05,
        status: "pass",
        passed: true
      }
    ],

    // 建议
    recommendations: ["发现划痕缺陷，建议返工"]
  }
}
```

## 检测类型详细说明

### 视觉缺陷检测

基于深度学习的表面缺陷检测，支持多种缺陷类型：

| 缺陷类型 | 说明 | 严重程度判定 |
|----------|------|--------------|
| scratch | 表面划痕 | 置信度>0.85为高 |
| dent | 凹坑 | 置信度>0.85为高 |
| stain | 污渍 | 通常为中等 |
| crack | 裂纹 | 任何检测都为高 |
| deformation | 变形 | 通常为中等 |

### 尺寸检测

支持多维度测量和公差检查：

```javascript
inspectDimensions({
  length: 100.05,   // 测量值
  width: 50.02,     // 测量值
  thickness: 5.018   // 测量值
}, {
  length: { nominal: 100, tolerance: 0.1 },
  width: { nominal: 50, tolerance: 0.1 },
  thickness: { nominal: 5, tolerance: 0.02 }
})
```

### 表面粗糙度

测量参数：

| 参数 | 说明 | 典型限值 |
|------|------|----------|
| Ra | 算术平均粗糙度 | ≤3.2μm |
| Rz | 最大峰谷高度 | ≤25.6μm (≈8×Ra) |
| Rq | 均方根粗糙度 | ≤3.5μm (≈1.1×Ra) |

### 涂层厚度

测量范围：20-50μm
- 小于20μm: too_thin (厚度不足)
- 20-50μm: pass (正常)
- 大于50μm: too_thick (超过上限)

### 颜色差异

CIELAB色差标准：
- ΔE ≤ 2.0: 人眼难以察觉，可接受
- ΔE 2.0-3.0: 轻微差异，可能可接受
- ΔE > 3.0: 明显差异，不合格

### 焊接质量

缺陷类型：

| 缺陷 | 说明 | 严重程度 |
|------|------|----------|
| porosity | 孔隙率 | 高 (≤5%) |
| crack | 裂纹 | 严重 |
| incomplete_penetration | 未熔透 | 高 |
| undercut | 咬边 | 中等 |

质量等级：
- A级: 全部合格
- B级: 有中等缺陷
- C级: 有严重缺陷

### 装配质量

检查项目：
- misalignment (对齐偏差) ≤0.5mm
- looseFasteners (松动紧固件) = 0
- missingParts (缺失零件) = 0
- gaps (间隙) ≤0.2mm

### 包装质量

检查项目：
- damage (破损): none
- sealIntegrity (密封完整性) ≥95%
- labelAccuracy (标签准确): correct
- completeness (完整性) = 100%

## 使用示例

### 示例1: 视觉缺陷检测

```javascript
const { qualityInspector } = require('./quality-inspector');

const result = await qualityInspector({
  inspectionType: 'visual-defect',
  productId: 'PART-001',
  productType: 'metal-plate',
  parameters: {
    image: imageBuffer
  },
  threshold: 0.75
});

if (result.inspection.hasDefects) {
  console.log(`发现${result.inspection.totalDefects}个缺陷`);
  result.inspection.defects.forEach(d => {
    console.log(`- ${d.type}: ${d.severity}`);
  });
}
```

### 示例2: 综合检测

```javascript
const result = await qualityInspector({
  inspectionType: 'comprehensive',
  productId: 'PROD-001',
  productType: 'painted-panel',
  parameters: {
    image: imageBuffer,
    measurements: {
      length: 1000,
      width: 500,
      thickness: 2.0
    },
    roughnessData: { Ra: 1.2 },
    thickness: 35,
    colorData: {
      L: 85, a: 0.5, b: 2.0,
      L_ref: 85.2, a_ref: 0.4, b_ref: 2.1
    }
  }
});

console.log(`综合检测结果: ${result.inspection.overallStatus}`);
```

### 示例3: 尺寸和粗糙度检测

```javascript
const result = await qualityInspector({
  inspectionType: 'dimension',
  productId: 'MACHINED-001',
  parameters: {
    measurements: {
      length: 99.95,
      width: 50.08,
      diameter: 25.02
    },
    tolerances: {
      length: { nominal: 100, tolerance: 0.1 },
      width: { nominal: 50, tolerance: 0.1 },
      diameter: { nominal: 25, tolerance: 0.05 }
    }
  }
});
```

### 示例4: 批量检测

```javascript
const { qualityInspectorBatch } = require('./quality-inspector');

const results = await qualityInspectorBatch([
  { inspectionType: 'visual-defect', productId: 'A-001', parameters: { image: img1 } },
  { inspectionType: 'dimension', productId: 'A-002', parameters: { measurements: dims2 } },
  { inspectionType: 'visual-defect', productId: 'A-003', parameters: { image: img3 } }
]);

console.log(`通过: ${results.summary.passed}/${results.summary.total}`);
```

## 错误处理

```javascript
{
  success: false,
  error: {
    code: 'INVALID_INPUT',           // 输入错误
    message: 'productId is required' // 错误消息
  }
}

// 常见错误码
// INVALID_INPUT: 缺少必填参数
// INVALID_TYPE: 不支持的检测类型
// PROCESSING_ERROR: 检测过程错误
```

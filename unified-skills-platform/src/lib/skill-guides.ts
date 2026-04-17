/**
 * 技能引导配置 - 每个技能的定义选项
 *
 * 设计思路：
 * 1. 预设选项，用户点击快速填入
 * 2. 也支持自由输入，灵活性高
 * 3. 选项按技能分类，配置化管理
 */

import { Skill } from './types';

// ==================== 选项类型定义 ====================

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface InputField {
  id: string;
  type: 'select' | 'select-multiple' | 'text' | 'textarea';
  label: string;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
  /** 多选时的提示文字 */
  multiSelectHint?: string;
}

export interface SkillGuide {
  skillId: string;
  /** 引导标题 */
  title: string;
  /** 简短描述 */
  description: string;
  /** 输入字段配置 */
  fields: InputField[];
  /** 快捷模板（预设场景） */
  quickTemplates?: {
    name: string;
    description: string;
    /** 预填充的字段值 */
    values: Record<string, string>;
  }[];
}

// ==================== 全技能引导配置 ====================

export const skillGuides: Record<string, SkillGuide> = {

  // ==================== 商业类 ====================

  'biz-plan': {
    skillId: 'biz-plan',
    title: '商业计划书生成',
    description: '请选择或输入您的项目信息',
    fields: [
      {
        id: 'industry',
        type: 'select',
        label: '所属行业',
        placeholder: '选择行业',
        options: [
          { value: 'technology', label: '科技/互联网', description: 'AI、软件、SaaS等' },
          { value: 'ecommerce', label: '电商/零售', description: '电商平台、直播带货等' },
          { value: 'education', label: '教育', description: '教育培训、在线学习等' },
          { value: 'healthcare', label: '医疗健康', description: '医疗科技、生物医药等' },
          { value: 'finance', label: '金融科技', description: '支付、保险科技等' },
          { value: 'manufacturing', label: '制造业', description: '智能制造、工业4.0等' },
          { value: 'service', label: '生活服务', description: '本地生活、物流等' },
          { value: 'other', label: '其他行业', description: '请在下方详细描述' },
        ],
        required: true,
      },
      {
        id: 'stage',
        type: 'select',
        label: '融资阶段',
        placeholder: '选择阶段',
        options: [
          { value: 'idea', label: '概念期', description: '只有想法，尚未落地' },
          { value: 'prototype', label: '原型期', description: '已有MVP或原型' },
          { value: 'seed', label: '天使轮', description: '早期融资' },
          { value: 'series-a', label: 'A轮', description: '规模化扩张' },
          { value: 'series-b', label: 'B轮及以上', description: '成熟期扩张' },
          { value: 'profit', label: '已盈利', description: '不融资，自身造血' },
        ],
        required: true,
      },
      {
        id: 'target',
        type: 'select',
        label: '目标用户',
        placeholder: '选择用户类型',
        options: [
          { value: 'consumer', label: '普通消费者（C端）', description: '面向个人用户' },
          { value: 'business', label: '企业客户（B端）', description: '面向企业/商家' },
          { value: 'government', label: '政府/机构（G端）', description: '政府采购' },
          { value: 'developer', label: '开发者', description: 'SaaS/API服务' },
        ],
        required: true,
      },
      {
        id: 'description',
        type: 'textarea',
        label: '项目简介',
        placeholder: '用1-2句话描述您的项目是什么，解决什么问题',
      },
    ],
    quickTemplates: [
      {
        name: 'AI应用创业',
        description: '人工智能方向的创业项目',
        values: { industry: 'technology', target: 'consumer', description: 'AI应用' },
      },
      {
        name: '消费品牌',
        description: '消费品/零售方向',
        values: { industry: 'ecommerce', target: 'consumer', description: '消费品牌' },
      },
    ],
  },

  'meeting-notes': {
    skillId: 'meeting-notes',
    title: '会议纪要生成',
    description: '输入会议信息，生成结构化纪要',
    fields: [
      {
        id: 'meetingType',
        type: 'select',
        label: '会议类型',
        options: [
          { value: 'brainstorm', label: '头脑风暴', description: '创意讨论' },
          { value: 'review', label: '项目复盘', description: '总结经验' },
          { value: 'planning', label: '规划会议', description: '制定计划' },
          { value: 'sync', label: '同步会议', description: '信息同步' },
          { value: 'decision', label: '决策会议', description: '拍板定案' },
          { value: 'client', label: '客户沟通', description: '商务洽谈' },
        ],
        required: true,
      },
      {
        id: 'participants',
        type: 'text',
        label: '参会人员',
        placeholder: '如：张三、李四、王五',
      },
      {
        id: 'content',
        type: 'textarea',
        label: '会议内容',
        placeholder: '粘贴会议记录、录音摘要或主要讨论点',
        required: true,
      },
    ],
    quickTemplates: [
      {
        name: '周会同步',
        description: '团队周会信息同步',
        values: { meetingType: 'sync' },
      },
      {
        name: '项目复盘',
        description: '项目结束后总结复盘',
        values: { meetingType: 'review' },
      },
    ],
  },

  'prd-writer': {
    skillId: 'prd-writer',
    title: 'PRD文档撰写',
    description: '生成专业产品需求文档',
    fields: [
      {
        id: 'productType',
        type: 'select',
        label: '产品类型',
        options: [
          { value: 'app', label: 'App应用', description: '移动端应用' },
          { value: 'web', label: 'Web应用', description: '网页端产品' },
          { value: 'mini-program', label: '小程序', description: '微信/抖音小程序' },
          { value: 'saas', label: 'SaaS平台', description: '企业级SaaS' },
          { value: 'hardware', label: '软硬一体', description: '硬件+软件结合' },
        ],
        required: true,
      },
      {
        id: 'target',
        type: 'select',
        label: '目标用户',
        options: [
          { value: 'consumer', label: '普通用户', description: 'C端用户' },
          { value: 'business', label: '企业用户', description: 'B端用户' },
          { value: 'internal', label: '内部用户', description: '公司内部使用' },
        ],
        required: true,
      },
      {
        id: 'feature',
        type: 'textarea',
        label: '核心功能',
        placeholder: '描述要开发的核心功能',
        required: true,
      },
      {
        id: 'goal',
        type: 'text',
        label: '业务目标',
        placeholder: '如：提升转化率30%',
      },
    ],
  },

  'brand-story': {
    skillId: 'brand-story',
    title: '品牌故事撰写',
    description: '构建有感染力的品牌叙事',
    fields: [
      {
        id: 'brandType',
        type: 'select',
        label: '品牌类型',
        options: [
          { value: 'product', label: '产品品牌', description: '消费品、科技产品' },
          { value: 'service', label: '服务品牌', description: '餐饮、教育等' },
          { value: 'corporate', label: '企业品牌', description: '公司整体形象' },
          { value: 'personal', label: '个人品牌', description: '创始人/IP品牌' },
        ],
        required: true,
      },
      {
        id: 'tone',
        type: 'select',
        label: '文风调性',
        options: [
          { value: 'warm', label: '温暖亲切', description: '如：三只松鼠' },
          { value: 'professional', label: '专业权威', description: '如：IBM' },
          { value: 'playful', label: '轻松活泼', description: '如：蜜雪冰城' },
          { value: 'luxury', label: '高端奢华', description: '如：路易威登' },
          { value: 'minimal', label: '简约克制', description: '如：无印良品' },
        ],
        required: true,
      },
      {
        id: 'brandName',
        type: 'text',
        label: '品牌名称',
        placeholder: '您的品牌叫什么',
        required: true,
      },
      {
        id: 'story',
        type: 'textarea',
        label: '创始故事/背景',
        placeholder: '品牌起源、创始人经历或创立契机',
      },
    ],
    quickTemplates: [
      {
        name: '新消费品牌',
        description: '面向年轻消费者的新品牌',
        values: { brandType: 'product', tone: 'playful' },
      },
      {
        name: '企业服务',
        description: 'B端企业服务品牌',
        values: { brandType: 'service', tone: 'professional' },
      },
    ],
  },

  'copywriter': {
    skillId: 'copywriter',
    title: '营销文案创作',
    description: '生成吸引用户的营销内容',
    fields: [
      {
        id: 'copyType',
        type: 'select',
        label: '文案类型',
        options: [
          { value: 'ad-slogan', label: '广告语/Slogan', description: '品牌口号' },
          { value: 'product-desc', label: '产品文案', description: '产品描述' },
          { value: 'poster', label: '海报文案', description: '宣传海报' },
          { value: 'video', label: '视频脚本', description: '短视频口播' },
          { value: 'social', label: '社交媒体', description: '小红书/朋友圈' },
        ],
        required: true,
      },
      {
        id: 'product',
        type: 'textarea',
        label: '产品/服务信息',
        placeholder: '描述您的产品或服务',
        required: true,
      },
      {
        id: 'audience',
        type: 'select',
        label: '目标人群',
        options: [
          { value: 'young-female', label: '年轻女性', description: '18-30岁女性' },
          { value: 'young-male', label: '年轻男性', description: '18-30岁男性' },
          { value: 'middle-aged', label: '中年人群', description: '30-50岁' },
          { value: 'senior', label: '老年人群', description: '50岁以上' },
          { value: 'business', label: '商务人士', description: '企业决策者' },
          { value: 'students', label: '学生群体', description: '在校学生' },
        ],
      },
      {
        id: 'highlight',
        type: 'text',
        label: '核心卖点',
        placeholder: '1-3个主要卖点',
      },
    ],
    quickTemplates: [
      {
        name: '种草文案',
        description: '小红书风格的种草笔记',
        values: { copyType: 'social' },
      },
      {
        name: '产品海报',
        description: '宣传海报简短文案',
        values: { copyType: 'poster' },
      },
    ],
  },

  'data-analyst': {
    skillId: 'data-analyst',
    title: '数据分析洞察',
    description: '分析数据趋势，发现业务洞察',
    fields: [
      {
        id: 'dataType',
        type: 'select',
        label: '数据类型',
        options: [
          { value: 'sales', label: '销售数据', description: '营收、订单等' },
          { value: 'user', label: '用户数据', description: '活跃、留存等' },
          { value: 'marketing', label: '营销数据', description: '投放、转化等' },
          { value: 'operation', label: '运营数据', description: 'DAU、GMV等' },
          { value: 'financial', label: '财务报表', description: '资产负债表等' },
          { value: 'other', label: '其他数据', description: '请在下方描述' },
        ],
        required: true,
      },
      {
        id: 'metric',
        type: 'select',
        label: '关注指标',
        options: [
          { value: 'growth', label: '增长分析', description: '趋势、增速' },
          { value: 'comparison', label: '对比分析', description: '环比、同比' },
          { value: 'correlation', label: '关联分析', description: '因素关联' },
          { value: 'prediction', label: '预测分析', description: '未来趋势' },
          { value: 'breakdown', label: '拆解分析', description: '构成拆解' },
        ],
        required: true,
      },
      {
        id: 'data',
        type: 'textarea',
        label: '数据内容',
        placeholder: '粘贴您的数据或关键指标',
        required: true,
      },
      {
        id: 'goal',
        type: 'text',
        label: '分析目的',
        placeholder: '如：找出下降原因、验证假设等',
      },
    ],
  },

  // ==================== 教育类 ====================

  'study-plan': {
    skillId: 'study-plan',
    title: '学习计划制定',
    description: '制定科学有效的学习计划',
    fields: [
      {
        id: 'subject',
        type: 'select',
        label: '学习方向',
        options: [
          { value: 'programming', label: '编程开发', description: 'Python、Java、前端等' },
          { value: 'design', label: '设计技能', description: 'UI/UX、平面设计等' },
          { value: 'language', label: '语言学习', description: '英语、日语等' },
          { value: 'business', label: '商业技能', description: '运营、营销等' },
          { value: 'data', label: '数据分析', description: 'SQL、Excel、Python' },
          { value: 'certification', label: '考证备考', description: 'CPA、PMP等' },
        ],
        required: true,
      },
      {
        id: 'level',
        type: 'select',
        label: '当前水平',
        options: [
          { value: 'zero', label: '零基础', description: '完全不了解' },
          { value: 'beginner', label: '入门', description: '有些基础了解' },
          { value: 'intermediate', label: '进阶', description: '有实战经验' },
          { value: 'advanced', label: '高级', description: '深入掌握' },
        ],
        required: true,
      },
      {
        id: 'goal',
        type: 'select',
        label: '学习目标',
        options: [
          { value: 'job', label: '求职就业', description: '找到相关工作' },
          { value: 'promotion', label: '职场晋升', description: '提升职场竞争力' },
          { value: 'side-project', label: '副业/接单', description: '独立项目能力' },
          { value: 'knowledge', label: '知识储备', description: '系统学习' },
        ],
        required: true,
      },
      {
        id: 'time',
        type: 'text',
        label: '每天可用时间',
        placeholder: '如：2小时',
      },
    ],
  },

  'flashcard-generator': {
    skillId: 'flashcard-generator',
    title: '闪卡生成器',
    description: '将知识点转化为记忆卡片',
    fields: [
      {
        id: 'subject',
        type: 'select',
        label: '科目领域',
        options: [
          { value: 'language', label: '语言', description: '英语、语文' },
          { value: 'science', label: '理科', description: '数学、物理、化学' },
          { value: 'history', label: '历史/政治', description: '文综' },
          { value: 'programming', label: '编程', description: '代码、算法' },
          { value: 'professional', label: '专业知识', description: '医学、法律等' },
          { value: 'other', label: '其他', description: '其他知识点' },
        ],
        required: true,
      },
      {
        id: 'count',
        type: 'select',
        label: '生成数量',
        options: [
          { value: '5', label: '5张', description: '少量快速' },
          { value: '10', label: '10张', description: '日常学习' },
          { value: '20', label: '20张', description: '系统学习' },
          { value: '50', label: '50张', description: '大量记忆' },
        ],
      },
      {
        id: 'content',
        type: 'textarea',
        label: '知识点内容',
        placeholder: '输入要生成闪卡的知识点',
        required: true,
      },
    ],
    quickTemplates: [
      {
        name: '英语单词',
        description: '生成英语单词闪卡',
        values: { subject: 'language', count: '20' },
      },
      {
        name: '编程概念',
        description: '生成编程概念闪卡',
        values: { subject: 'programming', count: '10' },
      },
    ],
  },

  // ==================== 专业服务类 ====================

  'career-coach': {
    skillId: 'career-coach',
    title: '职业规划咨询',
    description: '分析职业问题，提供发展建议',
    fields: [
      {
        id: 'questionType',
        type: 'select',
        label: '问题类型',
        options: [
          { value: 'job-change', label: '转行转型', description: '想换行业/岗位' },
          { value: 'promotion', label: '晋升发展', description: '如何突破职业瓶颈' },
          { value: 'skill', label: '技能提升', description: '该学什么技能' },
          { value: 'salary', label: '薪资谈判', description: '如何谈薪资' },
          { value: 'interview', label: '面试准备', description: '如何应对面试' },
          { value: 'work-life', label: '工作平衡', description: '工作与生活平衡' },
        ],
        required: true,
      },
      {
        id: 'experience',
        type: 'select',
        label: '工作年限',
        options: [
          { value: '0-1', label: '应届/1年内', description: '刚步入职场' },
          { value: '1-3', label: '1-3年', description: '职场新人' },
          { value: '3-5', label: '3-5年', description: '成长期' },
          { value: '5-10', label: '5-10年', description: '资深人士' },
          { value: '10+', label: '10年以上', description: '管理层/专家' },
        ],
        required: true,
      },
      {
        id: 'background',
        type: 'textarea',
        label: '背景信息',
        placeholder: '简述您的行业、岗位、工作经历等',
      },
    ],
  },

  'interview-prep': {
    skillId: 'interview-prep',
    title: '面试准备',
    description: '模拟面试，预测问题，准备回答',
    fields: [
      {
        id: 'target',
        type: 'select',
        label: '目标岗位类型',
        options: [
          { value: 'product', label: '产品经理', description: 'PM' },
          { value: 'operation', label: '运营', description: '运营岗位' },
          { value: 'dev', label: '技术开发', description: '程序员' },
          { value: 'design', label: '设计师', description: '设计岗位' },
          { value: 'marketing', label: '市场/营销', description: '市场岗位' },
          { value: 'sales', label: '销售', description: '销售岗位' },
          { value: 'other', label: '其他岗位', description: '请描述' },
        ],
        required: true,
      },
      {
        id: 'level',
        type: 'select',
        label: '面试层级',
        options: [
          { value: 'intern', label: '实习', description: '实习生面试' },
          { value: 'junior', label: '初级', description: '1-3年经验' },
          { value: 'middle', label: '中级', description: '3-5年经验' },
          { value: 'senior', label: '高级', description: '5年+经验' },
          { value: 'leader', label: '管理岗', description: '团队负责人' },
        ],
        required: true,
      },
      {
        id: 'company',
        type: 'text',
        label: '目标公司（可选）',
        placeholder: '如：字节跳动、阿里巴巴',
      },
      {
        id: 'focus',
        type: 'select',
        label: '重点准备',
        options: [
          { value: 'self-intro', label: '自我介绍', description: '如何介绍自己' },
          { value: 'project', label: '项目经历', description: '讲解项目经验' },
          { value: 'scenario', label: '情景题', description: '假设问题' },
          { value: ' desped', label: '反向面试', description: '问面试官问题' },
          { value: 'salary', label: '薪资期望', description: '谈薪资待遇' },
        ],
      },
    ],
  },

  // ==================== 生活类 ====================

  'travel-planner': {
    skillId: 'travel-planner',
    title: '旅行规划',
    description: '制定完整的旅行计划',
    fields: [
      {
        id: 'destination',
        type: 'text',
        label: '目的地',
        placeholder: '如：日本东京、云南大理',
        required: true,
      },
      {
        id: 'duration',
        type: 'select',
        label: '旅行天数',
        options: [
          { value: '1-2', label: '1-2天', description: '短途周末' },
          { value: '3-5', label: '3-5天', description: '小长假' },
          { value: '6-7', label: '6-7天', description: '一周假期' },
          { value: '7+', label: '7天以上', description: '长途旅行' },
        ],
        required: true,
      },
      {
        id: 'style',
        type: 'select',
        label: '旅行风格',
        options: [
          { value: 'relax', label: '休闲放松', description: '度假躺平' },
          { value: 'adventure', label: '探索冒险', description: '徒步、探险' },
          { value: 'culture', label: '文化体验', description: '博物馆、历史' },
          { value: 'food', label: '美食之旅', description: '吃货专属' },
          { value: 'shopping', label: '购物之旅', description: '买买买' },
          { value: 'family', label: '亲子游', description: '带孩子出行' },
        ],
        required: true,
      },
      {
        id: 'budget',
        type: 'select',
        label: '人均预算',
        options: [
          { value: 'low', label: '经济实惠', description: '5000元以内' },
          { value: 'medium', label: '舒适品质', description: '5000-15000' },
          { value: 'high', label: '奢华体验', description: '15000+' },
        ],
      },
      {
        id: 'season',
        type: 'select',
        label: '出行时间',
        options: [
          { value: 'spring', label: '春季', description: '3-5月' },
          { value: 'summer', label: '夏季', description: '6-8月' },
          { value: 'autumn', label: '秋季', description: '9-11月' },
          { value: 'winter', label: '冬季', description: '12-2月' },
        ],
      },
    ],
    quickTemplates: [
      {
        name: '周末短途',
        description: '1-2天周边游',
        values: { duration: '1-2', style: 'relax' },
      },
      {
        name: '出境游',
        description: '国外长途旅行',
        values: { duration: '6-7', style: 'culture' },
      },
    ],
  },

  'recipe-recommender': {
    skillId: 'recipe-recommender',
    title: '食谱推荐',
    description: '根据场景推荐美味食谱',
    fields: [
      {
        id: 'meal',
        type: 'select',
        label: '用餐类型',
        options: [
          { value: 'breakfast', label: '早餐', description: '快捷早餐' },
          { value: 'lunch', label: '午餐', description: '工作日午餐' },
          { value: 'dinner', label: '晚餐', description: '正餐' },
          { value: 'dessert', label: '甜点/零食', description: '小食甜品' },
          { value: 'party', label: '聚会宴请', description: '多人聚餐' },
        ],
        required: true,
      },
      {
        id: 'cuisine',
        type: 'select',
        label: '菜系偏好',
        options: [
          { value: 'chinese', label: '中餐', description: '川/湘/粤/鲁等' },
          { value: 'japanese', label: '日料', description: '刺身、寿司等' },
          { value: 'korean', label: '韩餐', description: '烤肉、拌饭等' },
          { value: 'western', label: '西餐', description: '牛排、意面等' },
          { value: 'italian', label: '意式', description: '披萨、意面' },
          { value: 'fusion', label: '融合创意', description: '创意菜' },
        ],
      },
      {
        id: 'constraint',
        type: 'select',
        label: '特殊需求',
        options: [
          { value: 'none', label: '无特殊要求', description: '正常饮食' },
          { value: 'vegetarian', label: '素食', description: '全素' },
          { value: 'low-carb', label: '低碳水', description: '减脂餐' },
          { value: 'quick', label: '快手菜', description: '30分钟内完成' },
          { value: 'budget', label: '省钱实惠', description: '控制预算' },
        ],
      },
      {
        id: 'ingredient',
        type: 'text',
        label: '已有食材（可选）',
        placeholder: '如：鸡肉、西红柿、鸡蛋',
      },
    ],
    quickTemplates: [
      {
        name: '快手早餐',
        description: '10分钟搞定早餐',
        values: { meal: 'breakfast', constraint: 'quick' },
      },
      {
        name: '减脂餐',
        description: '健康低脂晚餐',
        values: { meal: 'dinner', constraint: 'low-carb' },
      },
    ],
  },

  // ==================== 数据类 ====================

  'sql-query': {
    skillId: 'sql-query',
    title: 'SQL查询生成',
    description: '描述需求，生成SQL',
    fields: [
      {
        id: 'dbType',
        type: 'select',
        label: '数据库类型',
        options: [
          { value: 'mysql', label: 'MySQL', description: 'MySQL数据库' },
          { value: 'postgresql', label: 'PostgreSQL', description: 'PgSQL数据库' },
          { value: 'sqlserver', label: 'SQL Server', description: '微软SQL' },
          { value: 'oracle', label: 'Oracle', description: 'Oracle数据库' },
          { value: 'sqlite', label: 'SQLite', description: '轻量级数据库' },
        ],
        required: true,
      },
      {
        id: 'operation',
        type: 'select',
        label: '操作类型',
        options: [
          { value: 'select', label: '查询数据', description: 'SELECT' },
          { value: 'aggregate', label: '聚合统计', description: 'COUNT/SUM等' },
          { value: 'join', label: '多表关联', description: 'JOIN操作' },
          { value: 'subquery', label: '子查询', description: '嵌套查询' },
          { value: 'update', label: '更新数据', description: 'UPDATE' },
          { value: 'create', label: '建表', description: 'CREATE TABLE' },
        ],
        required: true,
      },
      {
        id: 'requirement',
        type: 'textarea',
        label: '查询需求',
        placeholder: '描述你想查询什么数据',
        required: true,
      },
      {
        id: 'tables',
        type: 'textarea',
        label: '表结构（可选）',
        placeholder: '如有表结构信息可以提供',
      },
    ],
  },

  'chart-designer': {
    skillId: 'chart-designer',
    title: '图表设计建议',
    description: '选择最合适的数据可视化方式',
    fields: [
      {
        id: 'dataType',
        type: 'select',
        label: '数据类型',
        options: [
          { value: 'trend', label: '趋势数据', description: '随时间变化' },
          { value: 'comparison', label: '对比数据', description: '不同类别比较' },
          { value: 'proportion', label: '占比数据', description: '各部分占比' },
          { value: 'correlation', label: '关联数据', description: '两个变量关系' },
          { value: 'distribution', label: '分布数据', description: '数值分布' },
          { value: 'geographic', label: '地理数据', description: '地区分布' },
        ],
        required: true,
      },
      {
        id: 'chartGoal',
        type: 'select',
        label: '展示目的',
        options: [
          { value: 'show-change', label: '展示变化', description: '强调增长/下降' },
          { value: 'rank', label: '排名对比', description: '谁多谁少' },
          { value: 'share', label: '占比展示', description: '各部分比例' },
          { value: 'relationship', label: '关系展示', description: '相关性' },
        ],
        required: true,
      },
      {
        id: 'metricCount',
        type: 'select',
        label: '指标数量',
        options: [
          { value: 'single', label: '单一指标', description: '一个数据系列' },
          { value: 'multiple', label: '多指标', description: '2-3个指标' },
          { value: 'many', label: '多个指标', description: '4个以上' },
        ],
      },
    ],
    quickTemplates: [
      {
        name: '销售趋势',
        description: '展示月度销售额趋势',
        values: { dataType: 'trend', chartGoal: 'show-change' },
      },
      {
        name: '用户占比',
        description: '展示用户类型占比',
        values: { dataType: 'proportion', chartGoal: 'share' },
      },
    ],
  },

  // ==================== 写作类 ====================

  'blog-writer': {
    skillId: 'blog-writer',
    title: '博客文章创作',
    description: '生成专业博客内容',
    fields: [
      {
        id: 'blogType',
        type: 'select',
        label: '文章类型',
        options: [
          { value: 'tutorial', label: '教程/指南', description: 'step by step教学' },
          { value: 'opinion', label: '观点论述', description: '表达观点' },
          { value: 'case-study', label: '案例分析', description: '实际案例' },
          { value: 'news', label: '行业资讯', description: '新闻资讯' },
          { value: 'review', label: '产品测评', description: '测评体验' },
          { value: 'story', label: '故事分享', description: '亲身经历' },
        ],
        required: true,
      },
      {
        id: 'audience',
        type: 'select',
        label: '目标读者',
        options: [
          { value: 'beginner', label: '初学者', description: '入门级内容' },
          { value: 'professional', label: '从业者', description: '行业专业人士' },
          { value: 'manager', label: '管理者', description: '决策层' },
          { value: 'general', label: '普通读者', description: '大众读者' },
        ],
        required: true,
      },
      {
        id: 'topic',
        type: 'textarea',
        label: '主题/话题',
        placeholder: '文章要讲什么',
        required: true,
      },
      {
        id: 'keywords',
        type: 'text',
        label: 'SEO关键词',
        placeholder: '如：Python入门、React教程',
      },
    ],
  },

  'email-writer': {
    skillId: 'email-writer',
    title: '商务邮件撰写',
    description: '生成专业的商务邮件',
    fields: [
      {
        id: 'emailType',
        type: 'select',
        label: '邮件类型',
        options: [
          { value: 'introduction', label: '自我介绍/开发信', description: '首次联系' },
          { value: 'followup', label: '跟进邮件', description: '持续推进' },
          { value: 'meeting', label: '邀约会议', description: '约会议' },
          { value: 'proposal', label: '方案报价', description: '发送方案' },
          { value: 'apology', label: '道歉邮件', description: '处理问题' },
          { value: 'thank', label: '感谢邮件', description: '表达感谢' },
        ],
        required: true,
      },
      {
        id: 'tone',
        type: 'select',
        label: '邮件语气',
        options: [
          { value: 'formal', label: '正式商务', description: '严谨正式' },
          { value: 'friendly', label: '友好委婉', description: '轻松友好' },
          { value: 'urgent', label: '紧迫催促', description: '时间紧迫' },
          { value: 'humble', label: '谦逊请求', description: '客气请求' },
        ],
        required: true,
      },
      {
        id: 'recipient',
        type: 'text',
        label: '收件人',
        placeholder: '如：王总（某公司采购总监）',
      },
      {
        id: 'purpose',
        type: 'textarea',
        label: '邮件目的',
        placeholder: '邮件主要想达成什么',
        required: true,
      },
    ],
    quickTemplates: [
      {
        name: '开发信',
        description: '首次联系潜在客户',
        values: { emailType: 'introduction', tone: 'formal' },
      },
      {
        name: '会议邀约',
        description: '约客户开会',
        values: { emailType: 'meeting', tone: 'friendly' },
      },
    ],
  },

  'resume-optimize': {
    skillId: 'resume-optimize',
    title: '简历诊断优化',
    description: '分析并优化您的简历',
    fields: [
      {
        id: 'target',
        type: 'select',
        label: '目标岗位类型',
        options: [
          { value: 'product', label: '产品经理', description: 'PM' },
          { value: 'operation', label: '运营', description: '运营岗位' },
          { value: 'dev', label: '技术开发', description: '程序员' },
          { value: 'design', label: '设计师', description: '设计岗位' },
          { value: 'marketing', label: '市场/营销', description: '市场岗位' },
          { value: 'sales', label: '销售', description: '销售岗位' },
          { value: 'other', label: '其他', description: '其他岗位' },
        ],
        required: true,
      },
      {
        id: 'targetCompany',
        type: 'select',
        label: '目标公司类型',
        options: [
          { value: 'big-tech', label: '大厂/名企', description: 'BAT/TMD等' },
          { value: 'startup', label: '创业公司', description: 'A轮左右' },
          { value: 'foreign', label: '外企', description: '欧美企业' },
          { value: 'state', label: '国企/央企', description: '国有企业' },
          { value: 'any', label: '不限定', description: '都可以' },
        ],
      },
      {
        id: 'experience',
        type: 'select',
        label: '工作年限',
        options: [
          { value: 'fresh', label: '应届生', description: '无工作经验' },
          { value: '1-3', label: '1-3年', description: '初入职场' },
          { value: '3-5', label: '3-5年', description: '成长期' },
          { value: '5-10', label: '5-10年', description: '资深' },
          { value: '10+', label: '10年以上', description: '专家/管理' },
        ],
        required: true,
      },
    ],
  },

  'summarizer': {
    skillId: 'summarizer',
    title: '内容摘要提取',
    description: '快速提取文章/文档的核心要点',
    fields: [
      {
        id: 'summaryType',
        type: 'select',
        label: '摘要类型',
        options: [
          { value: 'brief', label: '简短摘要', description: '1-3句话概括' },
          { value: 'standard', label: '标准摘要', description: '段落摘要' },
          { value: 'key-points', label: '要点列表', description: '列出关键点' },
          { value: 'bullets', label: '简短要点', description: '简洁bullet points' },
        ],
        required: true,
      },
      {
        id: 'content',
        type: 'textarea',
        label: '原文内容',
        placeholder: '粘贴要摘要的文章或内容',
        required: true,
      },
      {
        id: 'focus',
        type: 'text',
        label: '关注重点（可选）',
        placeholder: '如：主要结论、争议观点等',
      },
    ],
    quickTemplates: [
      {
        name: '新闻摘要',
        description: '快速了解新闻要点',
        values: { summaryType: 'brief' },
      },
      {
        name: '会议记录',
        description: '提取会议关键决策',
        values: { summaryType: 'key-points' },
      },
    ],
  },

  'tech-writer': {
    skillId: 'tech-writer',
    title: '技术文档撰写',
    description: '生成专业的技术文档',
    fields: [
      {
        id: 'docType',
        type: 'select',
        label: '文档类型',
        options: [
          { value: 'api-doc', label: 'API文档', description: '接口说明' },
          { value: 'user-guide', label: '用户手册', description: '使用指南' },
          { value: 'dev-guide', label: '开发指南', description: '开发者文档' },
          { value: 'readme', label: 'README', description: '项目说明' },
          { value: 'changelog', label: '更新日志', description: '版本更新' },
          { value: 'architecture', label: '架构文档', description: '系统设计' },
        ],
        required: true,
      },
      {
        id: 'techStack',
        type: 'text',
        label: '技术栈',
        placeholder: '如：React、Node.js、PostgreSQL',
      },
      {
        id: 'content',
        type: 'textarea',
        label: '功能/接口描述',
        placeholder: '描述要生成文档的内容',
        required: true,
      },
    ],
  },
};

/**
 * 获取技能的引导配置
 */
export function getSkillGuide(skillId: string): SkillGuide | undefined {
  return skillGuides[skillId];
}

/**
 * 构建技能的输入格式提示
 * 将选项选择转换为结构化文本
 */
export function buildInputFromGuide(guide: SkillGuide, values: Record<string, string>): string {
  const lines: string[] = [];

  // 根据字段顺序添加内容
  for (const field of guide.fields) {
    const value = values[field.id];
    if (!value) continue;

    const option = field.options?.find(o => o.value === value);
    const displayValue = option?.label || value;

    switch (field.type) {
      case 'select':
        lines.push(`【${field.label}】${displayValue}`);
        break;
      case 'text':
        lines.push(`【${field.label}】${value}`);
        break;
      case 'textarea':
        if (field.id === 'content' || field.id === 'requirement' || field.id === 'data' || field.id === 'description' || field.id === 'story' || field.id === 'topic' || field.id === 'product' || field.id === 'purpose' || field.id === 'feature' || field.id === 'background') {
          lines.push(`\n${value}`);
        } else {
          lines.push(`【${field.label}】\n${value}`);
        }
        break;
    }
  }

  return lines.join('\n');
}

/**
 * 通用引导生成器 - 为没有专属配置的技能生成引导
 */
export function generateGenericGuide(skillId: string, skillName: string, skillDescription: string, inputFormat?: string): SkillGuide {
  const fields: InputField[] = [];

  // 从 inputFormat 解析字段（如果有）
  if (inputFormat) {
    // 尝试从 inputFormat 中提取 Markdown 格式的字段
    const fieldMatches = inputFormat.matchAll(/\*\*([^*]+)\*\*\s*\n\s*```\s*\n([^`]+)\n```/g);
    for (const match of fieldMatches) {
      const label = match[1].replace(/\*\*/g, '').trim();
      const placeholder = match[2].trim();
      fields.push({
        id: label.toLowerCase().replace(/\s+/g, '_'),
        type: 'text',
        label,
        placeholder,
      });
    }

    // 如果没有解析到字段，但有 inputFormat 内容，添加一个textarea
    if (fields.length === 0 && inputFormat.length > 10) {
      fields.push({
        id: 'content',
        type: 'textarea',
        label: '请输入内容',
        placeholder: inputFormat.slice(0, 200),
        required: true,
      });
    }
  }

  // 如果还是没有字段，添加通用内容输入
  if (fields.length === 0) {
    fields.push({
      id: 'content',
      type: 'textarea',
      label: '请描述您的需求',
      placeholder: '详细描述您的需求，我会帮您处理',
      required: true,
    });
  }

  // 添加补充信息字段
  fields.push({
    id: 'additional',
    type: 'textarea',
    label: '补充信息（可选）',
    placeholder: '任何其他有助于我更好帮助您的信息',
  });

  return {
    skillId,
    title: skillName,
    description: skillDescription?.slice(0, 100) || '请输入您的需求',
    fields,
    quickTemplates: [],
  };
}

/**
 * 获取技能引导（优先专用配置，兜底通用生成）
 */
export function getSkillGuideResolved(
  skillId: string,
  skillName: string,
  skillDescription?: string,
  inputFormat?: string
): SkillGuide {
  // 优先返回专用配置
  if (skillGuides[skillId]) {
    return skillGuides[skillId];
  }

  // 兜底生成通用引导
  return generateGenericGuide(skillId, skillName, skillDescription || '', inputFormat);
}

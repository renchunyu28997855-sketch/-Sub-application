// js/report/generator.js
import { REPORT_TEMPLATES } from './templates.js';

export class ReportGenerator {
    constructor() {
        this.templates = REPORT_TEMPLATES;
    }

    generate(data) {
        return this.templates.generateReport(data);
    }

    exportToHTML(content) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI 降本增效方案</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
${content}
</body>
</html>
        `;
    }
}

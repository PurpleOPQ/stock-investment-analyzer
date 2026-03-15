// index.js - 完整修复版，确保 analysis 被正确定义并传入 generateReport
import { getFinancialData } from './api.js';
import { analyzeStock } from './stock-analysis.js';
import { generateReport } from './report.js';

(async () => {
  const symbol = process.argv[2] || 'AAPL';

  try {
    console.log(`正在分析股票: ${symbol}`);

    // 步骤1: 获取数据
    const data = await getFinancialData(symbol);
    console.log('数据获取成功');

    // 步骤2: 分析数据
    const analysis = analyzeStock(data, symbol);
    console.log('分析完成');
    console.log('=== 分析结果 ===');
    console.log(JSON.stringify(analysis, null, 2));

    // 步骤3: 生成 PDF 报告
    generateReport(analysis, symbol);
    console.log('报告生成完成');

  } catch (err) {
    console.error('程序出错:', err.message);
    console.error(err.stack);  // 打印堆栈，便于调试
  }
})();
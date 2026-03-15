// report.js - 简单清晰版（一页纸内完成、蓝色主调、易读布局）
import PDFDocument from 'pdfkit';
import fs from 'fs';

function generateReport(analysis, symbol) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // 注册字体
  const fontPath = './NotoSansSC[wght].ttf';  // 你的字体文件
  doc.registerFont('NotoSansSC', fontPath);
  doc.font('NotoSansSC');

  // 颜色
  const PRIMARY_BLUE = '#001F3F';  // 标题/强调
  const GRAY = '#4A4A4A';          // 正文

  doc.pipe(fs.createWriteStream(`${symbol}_investment_analysis.pdf`));

  // 标题
  doc.fontSize(22).fillColor(PRIMARY_BLUE)
     .text(`股票投资分析报告 - ${symbol}`, { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(10).fillColor(GRAY)
     .text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, { align: 'center' });

  doc.moveDown(1.5);

  // 核心财务指标
  doc.fontSize(14).fillColor(PRIMARY_BLUE).text('核心财务指标');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(GRAY);

  const finances = analysis.finances || {};
  const financeItems = [
    `当前价格: ${finances.currentPrice || 'N/A'}`,
    `市盈率 (PE): ${finances.peRatio || 'N/A'}`,
    `每股收益 (EPS): ${finances.eps || 'N/A'}`,
    `ROE: ${finances.roe || 'N/A'}`,
    `利润率: ${finances.profitMargin || 'N/A'}`,
    `营收增长: ${finances.revenueGrowth || 'N/A'}`,
    `负债率: ${finances.debtEquity || 'N/A'}`,
    `行业: ${finances.sector || 'N/A'}`,
    `市值: ${finances.marketCap || 'N/A'}`,
    `机构目标均价: ${finances.targetMeanPrice || 'N/A'}`,
    `潜在涨幅: ${finances.upsidePercent || 'N/A'}`
  ];

  financeItems.forEach(item => {
    doc.text(item);
  });

  doc.moveDown(1.5);

  // 巴菲特视角
  doc.fontSize(14).fillColor(PRIMARY_BLUE).text('巴菲特视角 (价值投资)');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(GRAY)
     .text(`评分: ${analysis.buffett?.score || 0}/5  ${analysis.buffett?.verdict || 'N/A'}`);

  if (analysis.buffett?.logic?.length > 0) {
    doc.moveDown(0.3);
    doc.text('投资逻辑:');
    analysis.buffett.logic.forEach(l => doc.text(`- ${l}`));
  }
  if (analysis.buffett?.risk?.length > 0) {
    doc.moveDown(0.3);
    doc.text('风险点:');
    analysis.buffett.risk.forEach(r => doc.text(`- ${r}`));
  }

  doc.moveDown(1.5);

  // 木头姐视角
  doc.fontSize(14).fillColor(PRIMARY_BLUE).text('木头姐视角 (成长投资)');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(GRAY)
     .text(`评分: ${analysis.wood?.score || 0}/3  ${analysis.wood?.verdict || 'N/A'}`);

  if (analysis.wood?.logic?.length > 0) {
    doc.moveDown(0.3);
    doc.text('投资逻辑:');
    analysis.wood.logic.forEach(l => doc.text(`- ${l}`));
  }
  if (analysis.wood?.risk?.length > 0) {
    doc.moveDown(0.3);
    doc.text('风险点:');
    analysis.wood.risk.forEach(r => doc.text(`- ${r}`));
  }

  doc.moveDown(1.5);

  // 技术面判断
  doc.fontSize(14).fillColor(PRIMARY_BLUE).text('技术面判断');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(GRAY);
  const technical = analysis.technical || {};
  doc.text(`RSI: ${technical.rsi || 'N/A'} (${technical.rsiSignal || 'N/A'})`);
  doc.text(`50日均线: ${technical.ma50 || 'N/A'}`);
  doc.text(`趋势: ${technical.trend || 'N/A'}`);

  // 免责声明
  doc.moveDown(2);
  doc.fontSize(8).fillColor(GRAY)
     .text('本报告仅供参考，不构成投资建议。数据来源于公开市场，可能存在延迟。', { align: 'center' });

  doc.end();

  console.log(`PDF 报告已生成: ${symbol}_investment_analysis.pdf`);
}

export { generateReport };
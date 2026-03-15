
# 股票投资分析工具

一个基于 Node.js 的股票投资分析 Skill，支持巴菲特价值投资视角、木头姐成长投资视角、简单技术面判断，并生成 PDF 报告。

## 功能亮点

- 巴菲特价值投资视角：高 ROE、低负债、合理估值、护城河判断
- 木头姐成长投资视角：高营收增长、科技行业、成长潜力评估
- 技术面判断：RSI 超买/超卖、50 日均线趋势
- 核心指标：当前价格、市盈率、EPS、ROE、利润率、营收增长、负债率、机构目标价、潜在涨幅
- 输出：控制台结果 + 美观 PDF 报告（支持中文）

## 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/PurpleOPQ/stock-investment-analyzer.git
   cd stock-investment-analyzer

2. **安装依赖bash**

npm install

3. **配置 API Key**
打开 api.js
修改 const API_KEY = '你的key'; 为你的 Alpha Vantage API Key
免费申请：https://www.alphavantage.co/support/#api-key

4. **运行分析bash**

node index.js AAPL           # 分析苹果
node index.js TSLA NVDA      # 同时分析特斯拉和英伟达

输出：控制台显示完整分析结果
项目目录生成 PDF 报告（如 AAPL_investment_analysis.pdf）

依赖node-fetch
pdfkit
(可选) ta.js（技术指标）

注意事项Alpha Vantage 免费 API 每天限额 25 次，建议准备多个 key 或等待次日重置。
PDF 报告需要中文字体支持，项目已包含 NotoSansSC[wght].ttf 文件。
本工具仅供学习与参考，不构成任何投资建议。

许可证MIT License欢迎 Star、Fork 或 Issues 交流！

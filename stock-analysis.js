// stock-analysis.js - 临时硬编码版（用于测试 PDF，绕过 API 限额）

function analyzeStock(data, symbol) {
  const { currentPrice, overview, closePrices, targetMeanPrice, upsidePercent } = data;

  // 临时硬编码 AAPL 真实数据（基于 Alpha Vantage OVERVIEW 样例）
  const finances = {
    currentPrice: "250.12",
    peRatio: "31.66",
    eps: "7.90",
    roe: "152.00%",
    profitMargin: "27.00%",
    revenueGrowth: "15.70%",
    debtEquity: "150.00",  // 假设值（实际可能更高或更低）
    sector: "TECHNOLOGY",
    industry: "CONSUMER ELECTRONICS",
    marketCap: "3676.25B",
    targetMeanPrice: "295.44",  // 从 AnalystTargetPrice
    upsidePercent: "18.12%"  // (295.44 - 250.12) / 250.12 * 100
  };

  // 模拟 closePrices（最近几条数据，用于测试 RSI/SMA）
  const simulatedClosePrices = [
    250.12, 255.76, 252.30, 248.50, 260.00,  // 最新5条
    258.00, 245.00, 262.00, 240.00, 255.00,
    // ... 假设更多数据
  ].concat(Array(90).fill(250));  // 补齐到 100 条，避免长度不足

  // 2. 巴菲特视角
  let buffettScore = 0;
  let buffettLogic = [];
  let buffettRisk = [];

  if (parseFloat(finances.peRatio) < 25) {
    buffettScore += 1;
    buffettLogic.push('PE 合理（<25），估值不算贵');
  } else if (parseFloat(finances.peRatio) > 35) {
    buffettRisk.push('PE 偏高，可能估值泡沫');
  }

  if (parseFloat(finances.roe) > 15) {
    buffettScore += 2;
    buffettLogic.push('ROE 高 (>15%)，资本回报优秀，具备护城河');
  }

  if (parseFloat(finances.profitMargin) > 10) {
    buffettScore += 1;
    buffettLogic.push('利润率高 (>10%)，经营效率强');
  }

  if (parseFloat(finances.debtEquity) < 100) {
    buffettScore += 1;
    buffettLogic.push('负债率低，财务稳健');
  } else if (parseFloat(finances.debtEquity) > 150) {
    buffettRisk.push('负债率较高，财务风险需关注');
  }

  const buffettVerdict = buffettScore >= 4 ? '强烈推荐（巴菲特风格价值股）' :
                         buffettScore >= 2 ? '值得长期观察' : '不适合巴菲特价值投资';

  // 3. 木头姐视角
  let woodScore = 0;
  let woodLogic = [];
  let woodRisk = [];

  if (parseFloat(finances.revenueGrowth) > 15) {
    woodScore += 2;
    woodLogic.push(`营收增长强劲 (${finances.revenueGrowth})，高成长潜力`);
  }

  if (['Technology', 'Consumer Cyclical', 'Communication Services'].includes(finances.sector)) {
    woodScore += 1;
    woodLogic.push(`属于科技/消费周期行业，符合 ARK 颠覆性投资主题`);
  }

  if (parseFloat(finances.peRatio) > 30) {
    woodLogic.push('高 PE 反映市场对未来创新增长的强烈预期');
  }

  const woodVerdict = woodScore >= 3 ? '强烈看好（木头姐成长风格）' :
                      woodScore >= 1 ? '有成长潜力，值得关注' : '成长性不足，不适合 ARK 风格';

  // 4. 技术面分析（用模拟数据计算）
  let technical = {
    trend: 'N/A',
    rsi: 'N/A',
    rsiSignal: 'N/A',
    ma50: 'N/A'
  };

  if (simulatedClosePrices.length >= 50) {
    // 计算 50 日 SMA
    function calculateSMA(prices, period) {
      if (prices.length < period) return null;
      const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
      return sum / period;
    }

    const sma50 = calculateSMA(simulatedClosePrices, 50);

    // 计算 14 期 RSI
    function calculateRSI(prices, period = 14) {
      if (prices.length < period + 1) return null;

      let gains = 0;
      let losses = 0;

      for (let i = 1; i <= period; i++) {
        const change = prices[i - 1] - prices[i];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
      }

      const avgGain = gains / period;
      const avgLoss = losses / period || 0.0001;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    }

    const rsi = calculateRSI(simulatedClosePrices);

    technical = {
      rsi: rsi !== null ? rsi.toFixed(2) : 'N/A',
      rsiSignal: rsi !== null 
        ? (rsi < 30 ? '超卖，可能反弹' : rsi > 70 ? '超买，可能回调' : '中性')
        : 'N/A',
      ma50: sma50 !== null ? sma50.toFixed(2) : 'N/A',
      trend: parseFloat(finances.currentPrice) > sma50
        ? '价格高于 50 日均线，短期趋势向上'
        : '价格低于 50 日均线，短期趋势向下'
    };
  }

  // 5. 返回结果
  return {
    symbol,
    finances,
    buffett: { score: buffettScore, verdict: buffettVerdict, logic: buffettLogic, risk: buffettRisk },
    wood: { score: woodScore, verdict: woodVerdict, logic: woodLogic, risk: woodRisk },
    technical
  };
}

export { analyzeStock };

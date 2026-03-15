// api.js - Yahoo temporarily disabled (403 crumb issue), focus on Alpha Vantage
import fetch from 'node-fetch';
// import YahooFinance from 'yahoo-finance2';  // Comment out to avoid 403

// const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const API_KEY = 'demo';  // Change if needed

async function getFinancialData(stockSymbol) {
  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`;
  const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol}&apikey=${API_KEY}`;
  const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&outputsize=compact&apikey=${API_KEY}`;

  const fetchWithRetry = async (url, retries = 2, timeoutMs = 30000) => {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        console.log(`尝试 ${attempt}/${retries + 1} 请求: ${url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log(`请求成功: ${url}，数据大小: ${JSON.stringify(data).length} 字符`);
        return data;
      } catch (err) {
        console.error(`尝试 ${attempt} 失败: ${err.message}`);
        if (attempt === retries + 1) throw err;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  };

  try {
    console.log('开始请求 Alpha Vantage...');

    const [quoteData, overviewData, dailyData] = await Promise.all([
      fetchWithRetry(quoteUrl),
      fetchWithRetry(overviewUrl),
      fetchWithRetry(dailyUrl)
    ]);

    const quote = quoteData['Global Quote'] || {};
    const overview = overviewData || {};

    // 当前价格优先 Alpha, fallback 可以手动或未来加
    const currentPrice = parseFloat(quote['05. price']) || 'N/A';

    // 涨幅空间暂设为 N/A (Yahoo 失效后)
    const targetMeanPrice = 'N/A (Yahoo Finance 临时不可用)';
    const upsidePercent = 'N/A';

        // 从日线数据提取收盘价数组（最新在前）
    const timeSeries = dailyData['Time Series (Daily)'] || {};
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));  // 最新日期在前
    const closePrices = dates.map(date => parseFloat(timeSeries[date]['4. close'] || 0)).filter(p => p > 0);

    console.log('提取的日期数量:', dates.length);
    console.log('closePrices 长度（过滤后）:', closePrices.length);

    return {
      currentPrice,
      quote,
      overview,
      closePrices,
      targetMeanPrice,
      upsidePercent
    };
  } catch (error) {
    console.error('获取数据失败 最终错误:', error);
    throw error;
  }
}

export { getFinancialData };
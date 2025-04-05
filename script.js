async function fetchPrices() {
  const spotEl = document.getElementById('spotPrice');
  const etfEl = document.getElementById('etfPrice');
  const arbEl = document.getElementById('arbResult');

  spotEl.textContent = 'Loading...';
  etfEl.textContent = 'Loading...';
  arbEl.textContent = 'Checking...';

  try {
    // ✅ Gold Spot Price (using Metals API via exchangerate.host)
    const metalRes = await fetch('https://api.exchangerate.host/latest?base=XAU&symbols=USD');
    const metalData = await metalRes.json();
    const goldSpot = 1 / metalData.rates.USD; // Convert USD per XAU to XAU per USD
    spotEl.textContent = `$${goldSpot.toFixed(2)} (per oz)`;

    // ✅ GLD ETF Price (via Yahoo Finance)
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const yahooUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/GLD');
    const etfRes = await fetch(`${proxyUrl}${yahooUrl}`);
    const etfJson = await etfRes.json();
    const etfData = JSON.parse(etfJson.contents);
    const etfPrice = etfData.chart.result[0].meta.regularMarketPrice;
    etfEl.textContent = `$${etfPrice.toFixed(2)} (GLD ETF)`;

    // ✅ Check for arbitrage opportunity
    const fairValue = goldSpot * 0.1; // 1/10 oz of gold ≈ 1 GLD share
    const diff = etfPrice - fairValue;
    const percent = (diff / fairValue) * 100;

    if (Math.abs(percent) < 0.5) {
      arbEl.textContent = `No strong arbitrage. GLD is close to spot value.`;
    } else if (percent > 0) {
      arbEl.textContent = `📉 GLD is overpriced by ${percent.toFixed(2)}%. Consider shorting.`;
    } else {
      arbEl.textContent = `📈 GLD is underpriced by ${Math.abs(percent).toFixed(2)}%. Consider buying.`;
    }

  } catch (err) {
    spotEl.textContent = 'Error';
    etfEl.textContent = 'Error';
    arbEl.textContent = `Error: ${err.message}`;
    console.error('Error fetching prices:', err);
  }
}

// Auto fetch on page load
fetchPrices();

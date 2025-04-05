const ALPHA_KEY = 'P3NW500T36QX49GH';   // ✅ Your real Alpha Vantage key
const METALS_KEY = 'YOUR_METALS_API_KEY';  // 🔁 Replace this when you get the key

const spotPriceEl = document.getElementById('spotPrice');
const etfPriceEl = document.getElementById('etfPrice');
const arbResultEl = document.getElementById('arbResult');

async function fetchGLDPrice() {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${ALPHA_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return parseFloat(data["Global Quote"]["05. price"]);
}

async function fetchGoldSpotPrice() {
  const url = `https://metals-api.com/api/latest?access_key=${METALS_KEY}&base=USD&symbols=XAU`;
  const response = await fetch(url);
  const data = await response.json();
  return 1 / data.rates.XAU;
}

async function fetchPrices() {
  try {
    const [goldSpotPrice, gldEtfPrice] = await Promise.all([
      fetchGoldSpotPrice(),
      fetchGLDPrice()
    ]);

    spotPriceEl.textContent = `$${goldSpotPrice.toFixed(2)}`;
    etfPriceEl.textContent = `$${gldEtfPrice.toFixed(2)}`;

    const goldPerGLD = goldSpotPrice / 10;
    const diff = goldPerGLD - gldEtfPrice;
    const percent = ((diff / gldEtfPrice) * 100).toFixed(2);

    if (Math.abs(percent) < 0.5) {
      arbResultEl.textContent = `📉 No arbitrage opportunity right now.`;
      arbResultEl.style.color = '#6b7280';
    } else {
      arbResultEl.textContent = `💸 Arbitrage Detected: ${percent}%`;
      arbResultEl.style.color = percent > 0 ? '#10b981' : '#ef4444';
    }

  } catch (error) {
    arbResultEl.textContent = '❌ Error fetching prices';
    arbResultEl.style.color = 'red';
    console.error(error);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000);

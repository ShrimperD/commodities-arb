const ALPHA_KEY = 'P3NW500T36QX49GH'; // Your Alpha Vantage API key
const GOLD_API_KEY = 'goldapi-txt8sm94nh9y9-io'; // Your GoldAPI.io key

const spotPriceEl = document.getElementById('spotPrice');
const etfPriceEl = document.getElementById('etfPrice');
const arbResultEl = document.getElementById('arbResult');

async function fetchGLDPrice() {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${ALPHA_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
    throw new Error("GLD price not available from Alpha Vantage");
  }

  return parseFloat(data["Global Quote"]["05. price"]);
}

async function fetchGoldSpotPrice() {
  const url = 'https://www.goldapi.io/api/XAU/USD';

  const response = await fetch(url, {
    headers: {
      'x-access-token': GOLD_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return parseFloat(data.price); // Gold spot price in USD per ounce
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

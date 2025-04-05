const GOLD_API_KEY = "goldapi-txt8sm94nh9y9-io";
const FINNHUB_KEY = "cvop5ipr01qihjtq49e0cvop5ipr01qihjtq49eg";

async function fetchSpotPrice(symbol) {
  const url = `https://www.goldapi.io/api/${symbol}/USD`;

  const res = await fetch(url, {
    headers: {
      "x-access-token": GOLD_API_KEY,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!data || !data.price) throw new Error(`No price for ${symbol}`);
  return data.price;
}

async function fetchETFPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!data || !data.c) throw new Error(`No ETF price for ${symbol}`);
  return data.c;
}

function calculateArb(spot, etf, ratio = 10) {
  const theoretical = spot / ratio;
  const diff = theoretical - etf;
  const percent = (diff / etf) * 100;
  return percent.toFixed(2);
}

async function fetchPrices() {
  try {
    const [goldSpot, silverSpot, oilSpot] = await Promise.all([
      fetchSpotPrice("XAU"),
      fetchSpotPrice("XAG"),
      fetchSpotPrice("WTI"),
    ]);

    const [gldPrice, slvPrice, usoPrice] = await Promise.all([
      fetchETFPrice("GLD"),
      fetchETFPrice("SLV"),
      fetchETFPrice("USO"),
    ]);

    // Set prices in the DOM
    document.getElementById("goldSpot").textContent = `$${goldSpot.toFixed(2)}`;
    document.getElementById("gldPrice").textContent = `$${gldPrice.toFixed(2)}`;
    document.getElementById("goldArb").textContent = `${calculateArb(goldSpot, gldPrice)}%`;

    document.getElementById("silverSpot").textContent = `$${silverSpot.toFixed(2)}`;
    document.getElementById("slvPrice").textContent = `$${slvPrice.toFixed(2)}`;
    document.getElementById("silverArb").textContent = `${calculateArb(silverSpot, slvPrice)}%`;

    document.getElementById("oilSpot").textContent = `$${oilSpot.toFixed(2)}`;
    document.getElementById("usoPrice").textContent = `$${usoPrice.toFixed(2)}`;
    document.getElementById("oilArb").textContent = `${calculateArb(oilSpot, usoPrice, 1)}%`;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000);

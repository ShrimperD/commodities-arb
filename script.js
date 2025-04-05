const GOLD_API_KEY = "goldapi-txt8sm94nh9y9-io";
const FINNHUB_KEY = "cvop5ipr01qihjtq49e0cvop5ipr01qihjtq49eg";

// GOLDAPI - for Gold & Silver Spot Prices
async function fetchSpotPrice(metal) {
  const response = await fetch(`https://www.goldapi.io/api/${metal}/USD`, {
    headers: {
      "x-access-token": GOLD_API_KEY,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.price) throw new Error(`${metal} price not available`);
  return parseFloat(data.price);
}

// FINNHUB - for GLD and USO ETF Prices
async function fetchETFPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.c) throw new Error(`${symbol} price not available`);
  return parseFloat(data.c); // current price
}

function calculateArb(spot, etf, ratio = 10) {
  const theoretical = spot / ratio;
  const diff = theoretical - etf;
  const percent = (diff / etf) * 100;
  return percent.toFixed(2);
}

async function fetchPrices() {
  try {
    // Fetch all prices
    const [goldSpot, silverSpot, oilSpot] = await Promise.all([
      fetchSpotPrice("XAU"),
      fetchSpotPrice("XAG"),
      fetchSpotPrice("WTI"),
    ]);

    const [gld, slv, uso] = await Promise.all([
      fetchETFPrice("GLD"),
      fetchETFPrice("SLV"),
      fetchETFPrice("USO"),
    ]);

    // Update DOM
    document.getElementById("goldSpot").textContent = `$${goldSpot.toFixed(2)}`;
    document.getElementById("gldPrice").textContent = `$${gld.toFixed(2)}`;
    document.getElementById("goldArb").textContent = `${calculateArb(goldSpot, gld)}%`;

    document.getElementById("silverSpot").textContent = `$${silverSpot.toFixed(2)}`;
    document.getElementById("slvPrice").textContent = `$${slv.toFixed(2)}`;
    document.getElementById("silverArb").textContent = `${calculateArb(silverSpot, slv)}%`;

    document.getElementById("oilSpot").textContent = `$${oilSpot.toFixed(2)}`;
    document.getElementById("usoPrice").textContent = `$${uso.toFixed(2)}`;
    document.getElementById("oilArb").textContent = `${calculateArb(oilSpot, uso, 1)}%`; // 1:1 ratio for Oil

  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000); // refresh every 60 seconds

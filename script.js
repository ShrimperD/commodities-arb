const GOLD_API_KEY = "goldapi-txt8sm94nh9y9-io";
const FINNHUB_KEY = "cvop5ipr01qihjtq49e0cvop5ipr01qihjtq49eg";

async function fetchGoldSpotPrice() {
  const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
    headers: {
      "x-access-token": GOLD_API_KEY,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.price) throw new Error("Spot price not available");

  return parseFloat(data.price);
}

async function fetchGLDPrice() {
  const url = `https://finnhub.io/api/v1/quote?symbol=GLD&token=${FINNHUB_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.c) throw new Error("GLD price not available");

  return parseFloat(data.c); // current price
}

function calculateArbitrage(spotPrice, gldPrice) {
  const theoreticalGLD = spotPrice / 10; // Approx conversion
  const diff = theoreticalGLD - gldPrice;
  const percent = (diff / gldPrice) * 100;
  return percent.toFixed(2);
}

async function fetchPrices() {
  const spotEl = document.getElementById("spotPrice");
  const gldEl = document.getElementById("gldPrice");
  const arbEl = document.getElementById("arbitrage");

  try {
    const [spot, gld] = await Promise.all([
      fetchGoldSpotPrice(),
      fetchGLDPrice(),
    ]);

    spotEl.textContent = `$${spot.toFixed(2)}`;
    gldEl.textContent = `$${gld.toFixed(2)}`;

    const arb = calculateArbitrage(spot, gld);
    arbEl.textContent = `${arb}%`;

    arbEl.style.color = Math.abs(arb) >= 1 ? "green" : "gray";
  } catch (error) {
    console.error(error);
    spotEl.textContent = "❌ Error";
    gldEl.textContent = "❌ Error";
    arbEl.textContent = "❌";
  }
}

fetchPrices();
setInterval(fetchPrices, 60000); // every 60 seconds

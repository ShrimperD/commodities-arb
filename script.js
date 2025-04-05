const API_KEY = "goldapi-txt8sm94nh9y9-io";
const BASE_URL = "https://www.goldapi.io/api/";

async function fetchSpotPrice(symbol) {
  const url = `${BASE_URL}${symbol}`;
  const response = await fetch(url, {
    headers: {
      "x-access-token": API_KEY,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`No price for ${symbol}`);
  }

  const data = await response.json();
  return data.price;
}

async function fetchPrices() {
  try {
    const gold = await fetchSpotPrice("XAU/USD");
    document.getElementById("goldPrice").textContent = `$${gold}`;

    const silver = await fetchSpotPrice("XAG/USD");
    document.getElementById("silverPrice").textContent = `$${silver}`;

    const oil = await fetchSpotPrice("BRENT/USD"); // Using Brent instead of WTI
    document.getElementById("oilPrice").textContent = `$${oil}`;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchPrices();

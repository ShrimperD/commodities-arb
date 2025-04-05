async function fetchPrices() {
  const spotPriceEl = document.getElementById('spotPrice');
  const etfPriceEl = document.getElementById('etfPrice');
  const arbResultEl = document.getElementById('arbResult');

  try {
    // Replace with real API endpoints if needed
    const goldSpotPrice = 2320.15; // Example: from goldprice.org or metals-api.com
    const gldEtfPrice = 214.67;     // Example: from Alpha Vantage or Yahoo Finance

    // Update UI
    spotPriceEl.textContent = `$${goldSpotPrice.toFixed(2)}`;
    etfPriceEl.textContent = `$${gldEtfPrice.toFixed(2)}`;

    // 1 GLD ≈ 1/10 oz gold
    const goldPerGLD = goldSpotPrice / 10;

    const diff = goldPerGLD - gldEtfPrice;
    const percent = ((diff / gldEtfPrice) * 100).toFixed(2);

    if (Math.abs(percent) < 0.5) {
      arbResultEl.textContent = `📉 No arbitrage opportunity right now.`;
      arbResultEl.style.color = '#6b7280'; // gray
    } else {
      arbResultEl.textContent = `💸 Arbitrage Detected: ${percent}%`;
      arbResultEl.style.color = percent > 0 ? '#10b981' : '#ef4444'; // green or red
    }

  } catch (error) {
    arbResultEl.textContent = '❌ Error fetching prices';
    arbResultEl.style.color = 'red';
    console.error(error);
  }
}

fetchPrices();
setInterval(fetchPrices, 60000); // Update every 60 seconds

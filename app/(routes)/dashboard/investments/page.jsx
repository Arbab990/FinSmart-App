"use client";
import React, { useEffect, useState } from "react";
import { FaChartLine, FaDollarSign, FaPlusCircle, FaMoneyBillWave } from "react-icons/fa";

const InvestmentTracking = () => {
  const [latestPrice, setLatestPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("AAPL"); // Default to AAPL
  const [investments, setInvestments] = useState([]);

  // Fetches the latest market data
  useEffect(() => {
    const fetchLatestMarketData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedMarket}&interval=5min&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
        );
        const data = await response.json();

        // Extract the latest price data
        const timeSeries = data["Time Series (5min)"];
        if (timeSeries) {
          const latestTime = Object.keys(timeSeries)[0];
          const latestData = timeSeries[latestTime];
          const price = parseFloat(latestData["1. open"]);
          const prevPrice = parseFloat(timeSeries[Object.keys(timeSeries)[1]]["1. open"]);
          const priceChange = price - prevPrice;

          setLatestPrice(price);
          setChange(priceChange);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    // Initial fetch and periodic refresh every 5 minutes
    fetchLatestMarketData();
    const interval = setInterval(fetchLatestMarketData, 300000);

    return () => clearInterval(interval);
  }, [selectedMarket]);

  const handleInvestment = () => {
    if (!investmentAmount || !selectedMarket) {
      alert("Please select a market and enter an investment amount.");
      return;
    }

    const newInvestment = {
      market: selectedMarket,
      amount: parseFloat(investmentAmount),
      date: new Date().toLocaleString(),
    };

    setInvestments([...investments, newInvestment]);
    alert(`Invested $${investmentAmount} in ${selectedMarket}`);
    setInvestmentAmount("");
    setSelectedMarket("AAPL"); // Reset to AAPL or any default stock symbol
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">📈 Real-Time Market Rate</h2>

      {/* Market Data Display */}
      <div className="text-center bg-white shadow-md p-6 rounded-lg mb-8 transition-transform duration-300 transform hover:scale-105">
        {latestPrice ? (
          <>
            <h3 className="text-xl font-semibold">
              {selectedMarket} Market Price <FaChartLine />
            </h3>
            <p className="text-4xl font-bold mt-2 text-green-700">
              ₹{latestPrice.toFixed(2)}
            </p>
            <p className={`text-lg ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
              Change: {change >= 0 ? "+" : ""}
              {change.toFixed(2)}
            </p>
          </>
        ) : (
          <p>Loading latest price...</p>
        )}
      </div>

      {/* Make an Investment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Make an Investment</h3>
        <div className="flex flex-col space-y-4">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="border rounded p-2"
          >
            <option value="AAPL">Market: Apple Inc. (AAPL)</option>
            <option value="MSFT">Market: Microsoft Corp. (MSFT)</option>
            <option value="GOOGL">Market: Alphabet Inc. (GOOGL)</option>
            <option value="TSLA">Market: Tesla Inc. (TSLA)</option>
            <option value="AMZN">Market: Amazon.com Inc. (AMZN)</option>
            {/* Add more options as needed */}
          </select>
          <input
            type="number"
            placeholder="Investment Amount (in $)"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={handleInvestment}
            className="bg-green-600 text-white rounded py-2 flex justify-center items-center gap-2 hover:bg-green-700 transition duration-300"
          >
            <FaPlusCircle /> Invest
          </button>
        </div>
      </div>

      {/* Investments List */}
      <h3 className="text-xl font-semibold mb-4">Your Investments</h3>
      <div className="grid grid-cols-1 gap-6">
        {investments.map((investment, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col">
              <span className="font-bold">
                {investment.market} - ${investment.amount.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm">{investment.date}</span>
            </div>
            <FaMoneyBillWave className="text-green-500 text-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentTracking;





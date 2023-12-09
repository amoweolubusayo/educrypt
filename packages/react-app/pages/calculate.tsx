import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { FaBook } from "react-icons/fa";
import Chart from "chart.js/auto";

interface Post {
  id: number;
  title: string;
  href: string;
  videoEmbedCode: string;
  date: string;
  datetime: string;
  author: {
    name: string;
    imageUrl: string;
  };
}

const Home: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [investmentPeriod, setInvestmentPeriod] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const { address, isConnected } = useAccount();

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(e.target.value);
    calculateResult(); // Calculate result when the investment amount changes
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentPeriod(e.target.value);
    calculateResult(); // Calculate result when the investment period changes
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentPeriod(e.target.value);
    calculateResult(); // Calculate result when the slider value changes
  };

  const calculateResult = () => {
    // Perform your calculation logic here
    // For demonstration, I'm just doubling the investment amount
    const calculatedResult = parseInt(investmentAmount, 10) * 2;
    setResult(calculatedResult);

    // Update the chart data
    if (chart) {
      chart.data.labels?.push(new Date().toLocaleTimeString());
      chart.data.datasets?.[0].data?.push(calculatedResult);
      chart.update();
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  useEffect(() => {
    // Create a chart on component mount
    const ctx = document.getElementById("earningsChart") as HTMLCanvasElement;
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Earnings Over Time",
            borderColor: "#92548B",
            backgroundColor: "rgba(146, 84, 139, 0.1)",
            data: [],
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
        },
      },
    });

    setChart(newChart);

    // Cleanup function to destroy the chart on component unmount
    return () => {
      newChart.destroy();
    };
  }, []);

  return (
    <>
      {/* ... (Existing content) */}

      {/* Chart */}
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <canvas id="earningsChart" width="400" height="200"></canvas>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* ... (Existing content) */}

          <div className="flex flex-col justify-center items-center mt-10 space-y-4">
            {/* Investment Amount Input */}
            <input
              type="number"
              placeholder="Enter Investment Amount"
              value={investmentAmount}
              onChange={handleInvestmentChange}
              className="rounded-md px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />

            {/* Investment Period Input */}
            <input
              type="number"
              placeholder="Enter Investment Period (in years)"
              value={investmentPeriod}
              onChange={handlePeriodChange}
              className="rounded-md px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />

            {/* Calculate Button
            <button
              onClick={calculateResult}
              className="rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Calculate
            </button> */}

            <div className="flex items-center space-x-2">
              <span className="text-gray-700">
                Investment Period: {investmentPeriod} years
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={investmentPeriod}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>

            {/* Result Display */}
            <div className="font-semibold text-white bg-gray-900 rounded-md px-3 py-2 text-md">
              Result: {result !== null ? result : "0"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

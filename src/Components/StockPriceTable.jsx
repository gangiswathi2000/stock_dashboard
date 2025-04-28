import { useEffect, useState } from 'react';
import StockChart from './StockChart';

const API_KEY = 'd07br0pr01qrslhncvpgd07br0pr01qrslhncvq0';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-600 font-semibold">Loading stock data...</p>
    </div>
  );
}

function StockPriceTable() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  const stockSymbols = ["NVDA", "SNOW", "ICE", "AAPL", "GOOGL", "TW", "AMZN", "MSFT", "TSLA"];

  useEffect(() => {
    async function fetchStocks() {
      try {
        const stockData = [];

        for (const symbol of stockSymbols) {
          let success = false;
          let retries = 0;

          while (!success && retries < 2) {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
            const data = await response.json();

            if (data.c !== 0 && data.c !== undefined) {
              stockData.push({
                symbol,
                price: data.c,
                change: data.d,
                percentChange: data.dp,
              });
              success = true;
            } else {
              retries++;
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }

          if (!success) {
            stockData.push({
              symbol,
              price: undefined,
              change: undefined,
              percentChange: undefined,
            });
          }
        }

        setStocks(stockData);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  function handleSort(column) {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  }

  const filteredStocks = stocks
    .filter((stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortColumn === 'symbol') {
        return sortOrder === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      } else if (sortColumn === 'price') {
        return sortOrder === 'asc'
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      } else if (sortColumn === 'percentChange') {
        return sortOrder === 'asc'
          ? (a.percentChange || 0) - (b.percentChange || 0)
          : (b.percentChange || 0) - (a.percentChange || 0);
      }
      return 0;
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 text-xl">
        Failed to fetch stock data. Please try again.
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-gradient-to-tr from-blue-50 to-cyan-100 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search symbol"
            className="border border-gray-300 rounded-lg p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="ml-4 px-4 py-2 bg-[#3D90D7] text-white rounded-lg hover:bg-blue-500 transition"
            >
              X
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-blue-200 text-blue-900">
              <tr>
                <th
                  className="text-2xl py-2 px-2 text-center text-md font-bold cursor-pointer select-none"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol {sortColumn === 'symbol' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                </th>
                <th
                  className="text-2xl py-2 px-2 text-center text-md font-bold cursor-pointer select-none"
                  onClick={() => handleSort('price')}
                >
                  Price ($) {sortColumn === 'price' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                </th>
                <th
                  className="text-2xl py-2 px-2 text-center text-md font-bold cursor-pointer select-none"
                  onClick={() => handleSort('percentChange')}
                >
                  Change (%) {sortColumn === 'percentChange' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredStocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="hover:bg-blue-100 transition duration-200 ease-in-out"
                >
                  <td className="py-4 px-6 font-semibold">{stock.symbol}</td>

                  <td className="py-4 px-6">
                    {stock.price !== undefined && stock.price !== 0
                      ? stock.price.toFixed(2) + "$"
                      : "N/A"}
                  </td>

                  <td className="py-4 px-6 font-semibold">
                    {stock.percentChange !== undefined && stock.percentChange !== 0 ? (
                      <span className={stock.percentChange >= 0 ? "text-green-600" : "text-red-600"}>
                        {stock.percentChange.toFixed(2)}%
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StockChart stocks={filteredStocks} />
    </>
  );
}

export default StockPriceTable;
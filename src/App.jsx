import { useEffect, useState } from 'react'
import './App.css'
import StockPriceTable from './Components/StockPriceTable'


function App() {
  return (
    <div className="min-h-screen w-full">
     <div className="container mx-auto p-6">
     <h1 className="text-5xl font-bold mb-6 text-center">📈 Stock Price Dashboard</h1>
        <StockPriceTable />
      </div>
    </div>
  );
  
}

export default App;
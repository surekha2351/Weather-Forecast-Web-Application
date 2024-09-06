import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/WeatherPage.tsx';
import CityTable from './components/CityTable.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cities" element={<CityTable />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImpactImportanceDiagram from './ImpactImportanceDiagram';
import UploadPage from './UploadPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImpactImportanceDiagram />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Gallery } from './pages/Gallery';
import ArtworkPage from './pages/ArtworkPage';
import { SuccessPage } from './components/SuccessPage';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/artwork/:id" element={<ArtworkPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

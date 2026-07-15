import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DistributorApp from './features/distributor/DistributorApp.jsx';
import StorefrontApp from './features/storefront/StorefrontApp.jsx';

export default function App({ theme, onThemeToggle }) {
  return (
    <Routes>
      <Route path="/distributor/*" element={<DistributorApp />} />
      <Route path="/*" element={<StorefrontApp theme={theme} onThemeToggle={onThemeToggle} />} />
    </Routes>
  );
}

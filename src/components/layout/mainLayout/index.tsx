// src/components/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../footer';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

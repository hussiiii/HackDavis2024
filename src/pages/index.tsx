import React from 'react';
import "../app/globals.css";
import TableView from '../components/TableView';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-creamy">
      <div className="flex-grow">
        <TableView />
      </div>
      <Footer />
    </div>
  );
}
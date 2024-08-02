import React, { useContext } from 'react';
import "../app/globals.css";
import TableView from '../components/TableView';
import Footer from '@/components/Footer';

export default function Home() {

  return (
    
    <div className="bg-creamy min-h-screen">
      <TableView />
      <Footer /> 
    </div>

  );
}
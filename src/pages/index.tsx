import React, { useContext } from 'react';
import "../app/globals.css";
import TableView from '../components/TableView';

export default function Home() {

  return (
    
    <div className="bg-creamy min-h-screen">
      <TableView />
    </div>

  );
}
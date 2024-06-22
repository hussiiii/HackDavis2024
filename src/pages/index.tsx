import React, { useContext } from 'react';
import "../app/globals.css";
import TableView from '../components/TableView';

export default function Home() {
  function createUser() {
    const newUser = {
               //Altryee ygshahes
      username: "Admin",
      email: "admin@hello.com",
      phone: "237424378234"
    }
    fetch(`/api/users`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    }).then((response) => {
      console.log("Done woww")
    })
  }

  return (
    <div>
      {/* <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <button onClick={createUser}>Click Me</button>
      </div> */}
      <TableView />
    </div>

  );
}
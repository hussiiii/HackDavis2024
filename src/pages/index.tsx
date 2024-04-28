import React, { useContext } from 'react';
import "../app/globals.css";

export default function Home() {
  function createUser() {
    const newUser = {
      username: "hello1aef",
      email: "hello1@hello.comaefwa",
      phone: "9199991991faew"
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
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <button onClick={createUser}>Click Me</button>
      </div>
    </div>

  );
}
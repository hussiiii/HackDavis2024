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
  function sendSMS() {
    const text = {
      to: "+18777804236",
      message: "'Sup from AggieHouse"
    }
    fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(text)
    }).then((response) => {
      console.log("Sent!")
    })
  }
  return (
    <div>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <button onClick={createUser}>Click Me for new user</button>
        <br/>
        <button onClick={sendSMS}>Click to send text!</button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoutingComponent from './Routing/RoutingComponent';


const socket: Socket = io('https://real-time-collaboration-whitebord-backend.onrender.com'); // Make sure this matches your backend URL

function App() {
  

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('New message:', message);
    });

    
  }, []);

  return (
    <div className="App">
      <RoutingComponent socket={socket} />
    </div>
  );
}

export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import JoinRoom from "../component/JoinRoom";
import Canvas from "../component/Canvas";
import Login from "../component/Login"; // Import the Login component
import { Socket } from "socket.io-client";
import Sign from "../component/Sign";
import PrivateRoute from "./PriveteRoute";

interface RoutingComponentProps {
  socket: Socket;
}

const RoutingComponent: React.FC<RoutingComponentProps> = ({ socket }) => {
  return (
    <Routes>
      <Route path="/" element={<JoinRoom socket={socket} />} />
      <Route path="/login" element={<Login />} /> {/* Add Login route */}
      <Route path="/register" element={<Sign />} /> {/* Add Register route */}
      <Route path="/room/:id" element={<Canvas socket={socket} />} />
    </Routes>
  );
};

export default RoutingComponent;

import React, { useState } from 'react';
import { Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface JoinRoomProps {
  socket: Socket;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ socket }) => {
  const [roomID, setRoomID] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [joinRoomID, setJoinRoomID] = useState<string>('');
  const navigate = useNavigate();

  const generateRoomID = () => {
    const newRoomID = uuidv4();
    setRoomID(newRoomID);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomID);
    alert('Room ID copied to clipboard!');
  };

  const handleCreateRoom = () => {
    if (roomID) {
      navigate(`/room/${roomID}`, { state: { userName: name, isCreator: true } });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <h2>Real-time Whiteboard Collaboration</h2>
        <Row className="mt-4">
          <Col xs={12} md={6} className="mb-3">
            <div className="border p-4">
              <h3>Create Room</h3>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formRoomID" className="mt-3">
                  <Form.Label>Room ID</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Room ID"
                      value={roomID}
                      readOnly
                    />
                    <Button variant="outline-secondary" onClick={generateRoomID}>
                      Generate Room ID
                    </Button>
                    <Button variant="outline-secondary" onClick={copyToClipboard}>
                      Copy
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button variant="primary" className="mt-3" onClick={handleCreateRoom}>
                  Create Room
                </Button>
              </Form>
            </div>
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <div className="border p-4">
              <h3>Join Room</h3>
              <Form>
                <Form.Group controlId="formJoinName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formJoinRoomID" className="mt-3">
                  <Form.Label>Room ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Room ID"
                    value={joinRoomID}
                    onChange={(e) => setJoinRoomID(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" className="mt-3" onClick={() => navigate(`/room/${joinRoomID}`, { state: { userName: name, isCreator: false } })}>
                  Join Room
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default JoinRoom;

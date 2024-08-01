import React, { useState, FormEvent } from 'react';
import { Navbar, Container, Button, Modal, Form } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IHeadersProps {}

const Headers: React.FunctionComponent<IHeadersProps> = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  const handleClose = () => {
    setShowInviteModal(false);
  };

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simulating email sending logic
    try {
      // For real-world applications, replace the following line with an actual API call
      await sendEmailWithRoomId(inviteEmail, roomId);
      alert(`Invite sent to ${inviteEmail} with Room ID: ${roomId}`);
      setInviteEmail('');
      setRoomId('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Failed to send invite:', error);
      alert('Failed to send invite. Please try again.');
    }
  };

  // Mock function to simulate sending email with room ID
  const sendEmailWithRoomId = (email: string, roomId: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulating a delay for the email sending
      setTimeout(() => {
        // Simulate success
        resolve();
        // For failure, you can use reject() with an error message
      }, 1000);
    });
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" style={{ height: '60px' }}>
        <Container>
          <Navbar.Brand href="#" style={{ color: '#ffffff' }}>Real-Time-Collaboration <sup>App</sup></Navbar.Brand>
          <Button
            variant="outline-light"
            onClick={handleInviteClick}
            style={{ borderColor: '#ffffff', color: '#ffffff' }}
          >
            <FaEnvelope /> Invite
          </Button>
        </Container>
      </Navbar>

      <Modal show={showInviteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite to RTC <sup>App</sup></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleInviteSubmit}>
            <Form.Group controlId="formRoomId">
              <Form.Label>Room ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formInviteEmail" className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              Send Invite
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Headers;

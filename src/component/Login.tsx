import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {};

const Login: React.FC<Props> = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === formData.email && parsedUser.password === formData.password) {
        localStorage.setItem("auth","true")
        alert('Login successful!');
      } else {
        alert('Invalid email or password');
      }
    } else {
      alert('No user found. Please register.');
    }

    setFormData({
      email: '',
      password: ''
    });
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Row className="justify-content-center" style={{ width: '40%' }}>
        <Col>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Login
                </Button>

                <Button variant="link" href="/register" className="w-100">
                  Don't have an account? Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

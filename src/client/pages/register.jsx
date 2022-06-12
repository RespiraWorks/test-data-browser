import {
  Alert, Button, Container, Form,
} from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const genericErrorMessage = 'Something went wrong! Please try again later.';

    fetch('/users/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName, lastName, username: email, password
      }),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError('Please fill all the fields correctly!');
          } else if (response.status === 401) {
            setError('Invalid email and password combination.');
          } else if (response.status === 500) {
            console.log(response);
            const data = await response.json();
            if (data.message) setError(data.message || genericErrorMessage);
          } else {
            setError(genericErrorMessage);
          }
        } else {
          const data = await response.json();
          setUserContext((oldValues) => ({ ...oldValues, token: data.token }));
        }
      })
      .catch((caughtError) => {
        setIsSubmitting(false);
        setError(caughtError);
      });
  }

  return (
    <Container>
      {error
        && (
          <Alert variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="reg_email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="reg_password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm() || isSubmitting}>
          {isSubmitting ? 'Registering…' : 'Register'}
        </Button>
      </Form>
    </Container>
  );
}

export default Register;

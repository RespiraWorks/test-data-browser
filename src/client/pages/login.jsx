import {
  Alert, Button, Container, Form,
} from 'react-bootstrap';
import React, { useContext, useState } from 'react';
// import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Login() {
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

    const route = '/users/login';
    const data = { username: email, password };
    const genericErrorMessage = 'Something went wrong! Please try again later.';

    // axios.post(route, data, {
    //   headers: {
    //     Accept: { 'Content-Type': 'application/json' },
    //   },
    //   withCredentials: true
    // }).then((response) => {
    //   setIsSubmitting(false);
    //   const responseOK = response && response.status === 200 && response.statusText === 'OK';
    //   if (!responseOK) {
    //     if (response.status === 400) {
    //       setError('Please fill all the fields correctly!');
    //     } else if (response.status === 401) {
    //       setError('Invalid email and password combination.');
    //     } else {
    //       setError(genericErrorMessage);
    //     }
    //   } else {
    //     const responseData = response.data;
    //     setUserContext((oldValues) => ({ ...oldValues, token: responseData.token }));
    //   }
    // }).catch((caughtError) => {
    //   setIsSubmitting(false);
    //   console.log('Axios error caught');
    //   console.log(caughtError.toJSON());
    //   setError(caughtError);
    // });

    fetch(route, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError('Please fill all the fields correctly!');
          } else if (response.status === 401) {
            setError('Invalid email and password combination.');
          } else {
            setError(genericErrorMessage);
          }
        } else {
          const responseData = await response.json();
          setUserContext((oldValues) => ({ ...oldValues, token: responseData.token }));
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
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm() || isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </Form>
    </Container>
  );
}

export default Login;

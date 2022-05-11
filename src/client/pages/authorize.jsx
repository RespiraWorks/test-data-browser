import React, {
  useCallback, useContext, useEffect, useState
} from 'react';
import {
  Container, Spinner, Tab, Tabs
} from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import Login from './login';
import Register from './register';
import Welcome from './welcome';

function Authorize() {
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch('/users/refreshToken', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => ({ ...oldValues, token: data.token }));
      } else {
        setUserContext((oldValues) => ({ ...oldValues, token: null }));
      }
      // TODO: pick better refresh time - 5 min?
      // call refreshToken every 1 minute to renew the authentication token.
      setTimeout(verifyUser, 1 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return userContext.token === null ? (
    <Container>
      <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="login" title="Login">
          <Login />
        </Tab>
        <Tab eventKey="register" title="Register">
          <Register />
        </Tab>
      </Tabs>
    </Container>
  ) : userContext.token ? (
    <Welcome />
  ) : (
    <Spinner animation="border" variant="primary" size="xl" />
  );
}

export default Authorize;

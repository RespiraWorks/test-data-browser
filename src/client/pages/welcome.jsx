import {
  Button, Container, Spinner
} from 'react-bootstrap';
import React, { useCallback, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

function Welcome() {
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch('/users/me', {
      method: 'GET',
      credentials: 'include',
      // Pass authentication token as bearer token in header
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => ({ ...oldValues, details: data }));
      } else if (response.status === 401) {
        // Edge case: when the token has expired.
        // This could happen if the refreshToken calls have failed due to network error or
        // User has had the tab open from previous day and tries to click on the Fetch button
        window.location.reload();
      } else {
        setUserContext((oldValues) => ({ ...oldValues, details: null }));
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails]);

  const logoutHandler = () => {
    fetch('/users/logout', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async () => {
      setUserContext((oldValues) => ({ ...oldValues, details: undefined, token: null }));
      window.localStorage.setItem('logout', Date.now());
    });
  };

  const refetchHandler = () => {
    // set details to undefined so that spinner will be displayed and
    //  fetchUserDetails will be invoked from useEffect
    setUserContext((oldValues) => ({ ...oldValues, details: undefined }));
  };

  return userContext.details === null ? (
    'Error Loading User details'
  ) : !userContext.details ? (
    <Spinner animation="border" variant="primary" size="xl" />
  ) : (
    <Container>
      <div className="user-details">
        <div>
          <p>
            Welcome&nbsp;
            <strong>
              {userContext.details.firstName}
              {userContext.details.lastName && ` ${userContext.details.lastName}`}
            </strong>
            !
          </p>
          <p>
            Your reward points:
            {' '}
            <strong>{userContext.details.points}</strong>
          </p>
        </div>
        <div className="user-actions">
          <Button onClick={logoutHandler}>Logout</Button>
          <Button onClick={refetchHandler}>Refetch</Button>
        </div>
      </div>
    </Container>
  );
}

export default Welcome;

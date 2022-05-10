import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';

function SecretPage() {
  return (
    <div>
      <Container>
        <h4>Secret Page</h4>
        <Button
          variant="link"
          as="a"
          href="/logout"
        >
          Log Out
        </Button>
      </Container>
    </div>
  );
}

export default SecretPage;

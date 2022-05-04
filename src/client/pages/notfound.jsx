import React from 'react';

function NotFound() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div>
        <h2>Page not found</h2>
        <p>404 or something...</p>
      </div>
    </div>
  );
}

export default NotFound;

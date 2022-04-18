import React from 'react';
import './header.css';

function Title() {
  return (
    <div className="row border Title">
      <p className="col-2 my-auto ml">
        <img src="rw_w_80.png" alt="rw logo" />
      </p>
      <p className="col-7 my-auto mx-auto">
        <strong>Come for the data, stay for the bugs</strong>
      </p>
      <p className="col-2 my-auto pr">
        <img src="rw_w_80.png" alt="rw logo" />
      </p>
    </div>
  );
}

export default Title;

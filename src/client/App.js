import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Component } from 'react';
import DataFileTable from './data-file-table';
import UploadFile from './upload-file';
import './app.scss';
import './old_app.css';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then((res) => res.json())
      .then((user) => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        <h1 style={{ display: 'none' }}>RespiraWorks</h1>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <BrowserRouter>
          <Routes>

            <Route path="/upload-file">
              <UploadFile />
            </Route>

            <Route path="/">
              <DataFileTable />
            </Route>

          </Routes>
        </BrowserRouter>

      </div>
    );
  }
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import MyNavbar from './pages/navbar';
import DataFileTable from './pages/data-file-table';
import UploadFile from './pages/upload-file';
import DataSet from './pages/dataset';
import NotFound from './pages/notfound';
import Login from './pages/login';

export default function App() {
  return (
    <div>
      <MyNavbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataFileTable />} />
          <Route path="/upload-file" element={<UploadFile />} />
          <Route path="/dataset" element={<DataSet />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

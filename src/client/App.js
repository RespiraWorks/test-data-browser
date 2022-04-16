import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import DataFileTable from './pages/data-file-table';
import UploadFile from './pages/upload-file';
import MyNavbar from './pages/navbar';

export default function App() {
  return (
    <div>
      <MyNavbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataFileTable />} />
          <Route path="/upload-file" element={<UploadFile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

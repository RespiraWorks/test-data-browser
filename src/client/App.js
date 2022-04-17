import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import DataFileTable from './pages/data-file-table';
import UploadFile from './pages/upload-file';

export default function App() {
  return (
    <div>
      <h1 style={{ display: 'none' }}>RespiraWorks</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataFileTable />} />
          <Route path="/upload-file" element={<UploadFile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

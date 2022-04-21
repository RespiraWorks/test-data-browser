import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import MyNavbar from './pages/navbar';
import DataFileTable from './pages/data-file-table';
import UploadFile from './pages/upload-file';
import DataSet from './pages/dataset';

export default function App() {
  return (
    <div>
      <MyNavbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataFileTable />} />
          <Route path="/upload-file" element={<UploadFile />} />
          <Route path="/dataset" element={<DataSet />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

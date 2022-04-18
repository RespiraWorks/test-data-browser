import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import DataFileTable from './pages/data-file-table';
import UploadFile from './pages/upload-file';
import Title from './pages/header';

export default function App() {
  return (
    <div>
      <Title />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DataFileTable />} />
          <Route path="/upload-file" element={<UploadFile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

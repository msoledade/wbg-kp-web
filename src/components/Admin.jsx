import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>

export default function Admin() {
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }
    setUploadStatus(`Uploading ${selectedFile.name}...`);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed with no details.' }));
        throw new Error(errorData.detail || 'Upload failed');
      }
      const result = await response.json();
      setUploadStatus(`Success: ${result.message}`);
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Upload Knowledge Pack</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Upload a PDF file to add to the knowledge base.
      </p>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="flex items-center space-x-2 p-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          title="Upload PDF"
        >
          <UploadIcon />
          <span>Upload PDF</span>
        </button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      {uploadStatus && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{uploadStatus}</p>}
    </div>
  );
} 
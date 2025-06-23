import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>

export default function Admin() {
  const [files, setFiles] = useState([]); // [{file, status, message}]
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // overall progress
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles.map(file => ({ file, status: 'pending', message: '' })));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    files.forEach(({ file }) => formData.append('files', file));
    try {
      const response = await axios.post(`${API_URL}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      const results = response.data.results;
      setFiles(files.map((f, idx) => ({
        ...f,
        status: results[idx]?.status || 'failed',
        message: results[idx]?.message || 'Unknown error',
      })));
    } catch (error) {
      setFiles(files.map(f => ({ ...f, status: 'failed', message: error.message })));
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Upload Knowledge Pack</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Upload one or more PDF files to add to the knowledge base.
      </p>
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="flex items-center space-x-2 p-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          title="Upload PDF"
          disabled={uploading}
        >
          <UploadIcon />
          <span>Select PDF(s)</span>
        </button>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={handleUpload}
          className="p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
          disabled={uploading || !files.length}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Selected Files</h3>
          <ul className="space-y-2">
            {files.map((f, idx) => (
              <li key={idx} className="flex items-center space-x-4 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <span className="flex-1 truncate text-gray-800 dark:text-gray-200">{f.file.name}</span>
                <span className="text-sm">
                  {f.status === 'pending' && <span className="text-gray-500">Pending</span>}
                  {f.status === 'success' && <span className="text-green-600">Uploaded</span>}
                  {f.status === 'failed' && <span className="text-red-600">Failed</span>}
                </span>
                {f.message && <span className="text-xs text-gray-500 ml-2">{f.message}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 
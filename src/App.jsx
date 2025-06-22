import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Assistant from './components/Assistant';
import Admin from './components/Admin';
import KnowledgePacks from './components/KnowledgePacks';
import Layout from './components/Layout';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="kps" element={<KnowledgePacks />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

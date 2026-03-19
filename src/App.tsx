import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Accessions from './pages/Accessions';
import AccessionDetail from './pages/AccessionDetail';
import MapPage from './pages/MapPage';
import Literature from './pages/Literature';
import Download from './pages/Download';
import About from './pages/About';
import Genomics from './pages/Genomics';
import GenomicsDetail from './pages/GenomicsDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminUpload from './pages/admin/AdminUpload';
import AdminGenomeUpload from './pages/admin/AdminGenomeUpload';
import AdminManage from './pages/admin/AdminManage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/accessions" element={<Accessions />} />
          <Route path="/accessions/:id" element={<AccessionDetail />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/genomics" element={<Genomics />} />
          <Route path="/genomics/:species" element={<GenomicsDetail />} />
          <Route path="/literature" element={<Literature />} />
          <Route path="/download" element={<Download />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute>
                <AdminUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/genome-upload"
            element={
              <ProtectedRoute>
                <AdminGenomeUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute>
                <AdminManage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

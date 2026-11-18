import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Teaching } from './pages/Teaching';
import { Gallery } from './pages/Gallery';
import { Interests } from './pages/Interests';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './admin/pages/AdminDashboard';

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            <Route path="/teaching" element={<Teaching />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PortfolioProvider>
  );
}

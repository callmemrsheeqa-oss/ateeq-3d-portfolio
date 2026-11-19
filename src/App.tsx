import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Education } from './pages/Education';
import { Skills } from './pages/Skills';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Learning } from './pages/Learning';
import { Journey } from './pages/Journey';
import { Teaching } from './pages/Teaching';
import { Gallery } from './pages/Gallery';
import { Interests } from './pages/Interests';
import { Contact } from './pages/Contact';
import { CvPage } from './pages/CvPage';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './admin/pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/teaching" element={<Teaching />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/interests" element={<Interests />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cv" element={<CvPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

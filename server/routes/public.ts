import { Router } from 'express';
import {
  downloadActiveCv,
  getCvStatus,
  getPortfolio,
  getPublicAwards,
  getPublicGallery,
  getPublicProfile,
  getPublicProjectBySlug,
  getPublicProjects,
  getPublicSkills,
  serveMediaFile,
} from '../controllers/publicController.ts';

export const publicRouter = Router();

publicRouter.get('/portfolio', getPortfolio);
publicRouter.get('/profile', getPublicProfile);
publicRouter.get('/projects', getPublicProjects);
publicRouter.get('/projects/:slug', getPublicProjectBySlug);
publicRouter.get('/skills', getPublicSkills);
publicRouter.get('/gallery', getPublicGallery);
publicRouter.get('/awards', getPublicAwards);
publicRouter.get('/cv/status', getCvStatus);
publicRouter.get('/cv/download', downloadActiveCv);
publicRouter.get('/media/:bucket/:filename', serveMediaFile);

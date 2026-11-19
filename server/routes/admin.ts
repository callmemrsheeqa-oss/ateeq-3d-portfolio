import { Router } from 'express';
import {
  activateAdminCv,
  createAdminAiKnowledge,
  createAdminAward,
  createAdminCertificate,
  createAdminEducation,
  createAdminExperience,
  createAdminJourney,
  createAdminLearning,
  createAdminProject,
  createAdminSkill,
  createAdminSocial,
  createAdminTeaching,
  deleteAdminAiKnowledge,
  deleteAdminAward,
  deleteAdminCertificate,
  deleteAdminCv,
  deleteAdminEducation,
  deleteAdminExperience,
  deleteAdminGalleryImage,
  deleteAdminJourney,
  deleteAdminLearning,
  deleteAdminMessage,
  deleteAdminProject,
  deleteAdminSkill,
  deleteAdminSocial,
  deleteAdminTeaching,
  getAdminOverview,
  listAdminAiKnowledge,
  listAdminAwards,
  listAdminCertificates,
  listAdminCvs,
  listAdminEducations,
  listAdminExperiences,
  listAdminGallery,
  listAdminJourney,
  listAdminLearning,
  listAdminMessages,
  listAdminProjects,
  listAdminSkills,
  listAdminSocials,
  listAdminTeachings,
  reorderAdminGallery,
  toggleAdminMessageRead,
  updateAdminAiKnowledge,
  updateAdminAward,
  updateAdminCertificate,
  updateAdminEducation,
  updateAdminExperience,
  updateAdminGalleryImage,
  updateAdminJourney,
  updateAdminLearning,
  updateAdminProfile,
  updateAdminProject,
  updateAdminSettings,
  updateAdminSkill,
  updateAdminSocial,
  updateAdminTeaching,
  uploadAdminCv,
  uploadAdminGalleryImages,
  uploadAdminProfilePhoto,
} from '../controllers/adminController.ts';
import {
  getAdminMe,
  loginWithGoogle,
  loginWithPassword,
  logoutAdmin,
} from '../controllers/authController.ts';
import { requireAdminAuth } from '../middleware/auth.ts';
import { loginRateLimiter } from '../middleware/rateLimit.ts';
import {
  createImageUpload,
  createMixedAssetUpload,
  cvUpload,
} from '../utils/storage.ts';

const galleryImageUpload = createImageUpload('gallery');
const awardAssetUpload = createMixedAssetUpload('awards').fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);
const certAssetUpload = createMixedAssetUpload('certificates').fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

export const adminRouter = Router();

// Public Auth Routes (with rate limiting on login)
adminRouter.post('/auth/google', loginRateLimiter, loginWithGoogle);
adminRouter.post('/auth/login', loginRateLimiter, loginWithPassword);
adminRouter.post('/auth/logout', logoutAdmin);

// Protected Admin Routes
adminRouter.use(requireAdminAuth);

adminRouter.get('/auth/me', getAdminMe);
adminRouter.get('/overview', getAdminOverview);

adminRouter.put('/profile', updateAdminProfile);
adminRouter.put('/settings', updateAdminSettings);

adminRouter.get('/projects', listAdminProjects);
adminRouter.post('/projects', createAdminProject);
adminRouter.put('/projects/:id', updateAdminProject);
adminRouter.delete('/projects/:id', deleteAdminProject);

adminRouter.get('/skills', listAdminSkills);
adminRouter.post('/skills', createAdminSkill);
adminRouter.put('/skills/:id', updateAdminSkill);
adminRouter.delete('/skills/:id', deleteAdminSkill);

adminRouter.get('/educations', listAdminEducations);
adminRouter.post('/educations', createAdminEducation);
adminRouter.put('/educations/:id', updateAdminEducation);
adminRouter.delete('/educations/:id', deleteAdminEducation);

adminRouter.get('/experiences', listAdminExperiences);
adminRouter.post('/experiences', createAdminExperience);
adminRouter.put('/experiences/:id', updateAdminExperience);
adminRouter.delete('/experiences/:id', deleteAdminExperience);

adminRouter.get('/teachings', listAdminTeachings);
adminRouter.post('/teachings', createAdminTeaching);
adminRouter.put('/teachings/:id', updateAdminTeaching);
adminRouter.delete('/teachings/:id', deleteAdminTeaching);

adminRouter.get('/learning', listAdminLearning);
adminRouter.post('/learning', createAdminLearning);
adminRouter.put('/learning/:id', updateAdminLearning);
adminRouter.delete('/learning/:id', deleteAdminLearning);

adminRouter.get('/journey', listAdminJourney);
adminRouter.post('/journey', createAdminJourney);
adminRouter.put('/journey/:id', updateAdminJourney);
adminRouter.delete('/journey/:id', deleteAdminJourney);

adminRouter.get('/cv', listAdminCvs);
adminRouter.post('/cv/upload', cvUpload.single('file'), uploadAdminCv);
adminRouter.put('/cv/:id/activate', activateAdminCv);
adminRouter.delete('/cv/:id', deleteAdminCv);

adminRouter.get('/gallery', listAdminGallery);
adminRouter.post('/gallery/upload', galleryImageUpload.array('files', 12), uploadAdminGalleryImages);
adminRouter.post('/profile-photo', galleryImageUpload.single('file'), uploadAdminProfilePhoto);
adminRouter.put('/gallery/reorder', reorderAdminGallery);
adminRouter.put('/gallery/:id', updateAdminGalleryImage);
adminRouter.delete('/gallery/:id', deleteAdminGalleryImage);

adminRouter.get('/awards', listAdminAwards);
adminRouter.post('/awards', awardAssetUpload, createAdminAward);
adminRouter.put('/awards/:id', updateAdminAward);
adminRouter.delete('/awards/:id', deleteAdminAward);

adminRouter.get('/certificates', listAdminCertificates);
adminRouter.post('/certificates', certAssetUpload, createAdminCertificate);
adminRouter.put('/certificates/:id', updateAdminCertificate);
adminRouter.delete('/certificates/:id', deleteAdminCertificate);

adminRouter.get('/socials', listAdminSocials);
adminRouter.post('/socials', createAdminSocial);
adminRouter.put('/socials/:id', updateAdminSocial);
adminRouter.delete('/socials/:id', deleteAdminSocial);

adminRouter.get('/messages', listAdminMessages);
adminRouter.patch('/messages/:id/read', toggleAdminMessageRead);
adminRouter.delete('/messages/:id', deleteAdminMessage);

adminRouter.get('/ai-knowledge', listAdminAiKnowledge);
adminRouter.post('/ai-knowledge', createAdminAiKnowledge);
adminRouter.put('/ai-knowledge/:id', updateAdminAiKnowledge);
adminRouter.delete('/ai-knowledge/:id', deleteAdminAiKnowledge);

import { Router } from 'express';
import multer from 'multer';
import { OnboardingController } from '../controllers/onboarding.controller';
import { anyAuth } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer();

// Public routes
router.get('/boards', OnboardingController.getEducationBoards);
router.get('/subjects', OnboardingController.getSubjects);
router.get('/schools/search', OnboardingController.searchSchools);
router.get('/check-username/:username', OnboardingController.checkUsername);

// Protected routes (require authentication)
router.post(
  '/student/profile', 
  anyAuth, 
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  OnboardingController.completeStudentProfile
);

router.post(
  '/school/register', 
  anyAuth, 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'registrationProof', maxCount: 1 },
    { name: 'schoolImages', maxCount: 5 }
  ]),
  OnboardingController.registerSchool
);

export default router;

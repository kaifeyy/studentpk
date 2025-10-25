import { Router } from 'express';
import { BoardsController } from '../controllers/boards.controller';

const router = Router();

// All routes are public as education board data is public information
router.get('/all', BoardsController.getAllBoards);
router.get('/type/:type', BoardsController.getBoardsByType);
router.get('/province/:province', BoardsController.getBoardsByProvince);
router.get('/board/:id', BoardsController.getBoardById);
router.get('/subject-groups/:type', BoardsController.getSubjectGroups);
router.get('/grade-levels/:type', BoardsController.getGradeLevels);
router.get('/subjects/:type', BoardsController.getAllSubjects);

export default router;

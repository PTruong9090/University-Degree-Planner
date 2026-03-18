import express from 'express';
import {
    createPlanner,
    deletePlanner,
    getPlanner,
    listPlanners,
    updatePlanner,
} from '../controller/plannerController.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.route('/')
    .get(listPlanners)
    .post(createPlanner);

router.route('/:id')
    .get(getPlanner)
    .put(updatePlanner)
    .delete(deletePlanner);

export default router;

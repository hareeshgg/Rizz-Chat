import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

import { getusersFromSearch, toggleFollow } from '../controllers/follower.controller.js';

const router = express.Router();

router.get("/", protectRoute, getusersFromSearch);
router.post("/toggle/:id", protectRoute, toggleFollow);

export default router;
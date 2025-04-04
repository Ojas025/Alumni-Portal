import { Router } from 'express'
import { handleDeleteJob, handleFetchAllJobs, handleFetchJobsByUser, handlePostJob, handleUpdateJobPost } from '../controllers/job.controller';
import { verifyJWT } from '../middlewares/auth/user.middlewares';

const router = Router();

// /api/job/
router.get("/", verifyJWT, handleFetchAllJobs);
router.get("/:id", verifyJWT, handleFetchJobsByUser);
router.post("/", verifyJWT, handlePostJob);
router.delete("/:jobId", verifyJWT, handleDeleteJob);
router.put("/update/:jobId", verifyJWT, handleUpdateJobPost);

export default router;
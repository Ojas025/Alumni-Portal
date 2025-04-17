import express from "express"; 
import { verifyJWT } from "../middlewares/auth/user.middlewares";
import { handleFetchAllNotes, handlePostNote } from "../controllers/note.controller";

const router = express.Router(); 
router.use(verifyJWT);

router.post('/', handlePostNote);
router.get('/', handleFetchAllNotes);

export default router;
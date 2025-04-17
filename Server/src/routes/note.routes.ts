import express from "express"; 
import { verifyJWT } from "../middlewares/auth/user.middlewares";
import { handleDeleteNote, handleFetchAllNotes, handlePostNote } from "../controllers/note.controller";

const router = express.Router(); 
router.use(verifyJWT);

router.post('/', handlePostNote);
router.get('/', handleFetchAllNotes);
router.delete('/:noteId', handleDeleteNote);

export default router;
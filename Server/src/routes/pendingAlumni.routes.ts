import express from 'express'
import { verifyJWT, verifyPermission } from '../middlewares/auth/user.middlewares';
import { handleAddPendingAlumni, handleFetchAllPendingAlumnis, handleVerifyPendingAlumni } from '../controllers/pendingAlumni.controller';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

router.get('/', verifyJWT, verifyPermission(['admin']), handleFetchAllPendingAlumnis);
router.post('/', upload.single('document'), handleAddPendingAlumni);
router.put('/',verifyJWT, verifyPermission(['admin']), handleVerifyPendingAlumni);


export default router;
import express from 'express'
import { verifyJWT, verifyPermission } from '../middlewares/auth/user.middlewares';
import { handleAddPendingAlumni, handleFetchAllPendingAlumnis, handleVerifyPendingAlumni } from '../controllers/pendingAlumni.controller';

const router = express.Router();
router.use(verifyJWT);

router.get('/', verifyPermission(['admin']), handleFetchAllPendingAlumnis);
router.post('/', verifyPermission(['admin']), handleAddPendingAlumni);
router.put('/', verifyPermission(['admin']), handleVerifyPendingAlumni);


export default router;
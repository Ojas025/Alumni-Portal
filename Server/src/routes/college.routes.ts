import express from 'express'
import { verifyJWT, verifyPermission } from '../middlewares/auth/user.middlewares';
import { handleAddCollege, handleEditCollege, handleFetchAllColleges, handleRemoveCollege } from '../controllers/college.controller';

const router = express.Router();
router.use(verifyJWT);

router.get('/', verifyPermission(['admin']), handleFetchAllColleges);
router.post('/', verifyPermission(['admin']), handleAddCollege);
router.delete('/', verifyPermission(['admin']), handleRemoveCollege);
router.put('/', verifyPermission(['admin']), handleEditCollege);

export default router; 
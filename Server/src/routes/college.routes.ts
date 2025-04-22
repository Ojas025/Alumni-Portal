import express from 'express'
import { verifyJWT, verifyPermission } from '../middlewares/auth/user.middlewares';
import { handleAddCollege, handleEditCollege, handleFetchAllColleges, handleRemoveCollege } from '../controllers/college.controller';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

router.get('/', handleFetchAllColleges);
router.post('/', verifyJWT, verifyPermission(['admin']), upload.single('logo'), handleAddCollege);
router.delete('/', verifyJWT, verifyPermission(['admin']), handleRemoveCollege);
router.put('/', verifyJWT, verifyPermission(['admin']), upload.single('logo'), handleEditCollege);

export default router; 
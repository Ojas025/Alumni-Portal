import express from 'express'
import { handleAddConnection, handleDeleteUser, handleFetchAllAlumniProfiles, handleFetchAllConnections, handleFetchAllStudentProfiles, handleFetchUsers, handleGetAlumniLocations, handleGetProfileById, handleGetUserProfile, handleRefreshAccessToken, handleRemoveConnection, handleUpdateAccountDetails, handleUpdateProfileImage, handleUpdateUserPassword, handleUserLogin, handleUserLogout, handleUserSignUp } from '../controllers/auth/user.controller';
import { userLoginValidator, userRegistrationValidator } from '../validators/user.validators';
import { validate } from '../validators/validate';
import { verifyJWT } from '../middlewares/auth/user.middlewares';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

// Auth
router.post('/login', userLoginValidator(), validate, handleUserLogin);
router.post('/signup', userRegistrationValidator(), validate, handleUserSignUp);
router.post('/logout', handleUserLogout);
router.post('/refresh-token', handleRefreshAccessToken);
router.put('/user/password', verifyJWT, handleUpdateUserPassword);

// Profile
router.get('/user/profile', verifyJWT, handleGetUserProfile);
router.get('/user/profile/alumni', verifyJWT, handleFetchAllAlumniProfiles);
router.get('/user/profile/student', verifyJWT, handleFetchAllStudentProfiles);
router.get('/user/profile/:id', verifyJWT, handleGetProfileById);
router.delete('/user/:id', verifyJWT, handleDeleteUser);
router.put('/user/profile', verifyJWT, handleUpdateAccountDetails);
router.get('/user/users/', verifyJWT, handleFetchUsers);
router.post('/user/upload', verifyJWT, upload.single('profileImage'), handleUpdateProfileImage);

// Connections
router.get('/user/connections', verifyJWT, handleFetchAllConnections);
router.put('/user/connect/:connecteeId', verifyJWT, handleAddConnection);
router.delete('/user/disconnect/:connecteeId', verifyJWT, handleRemoveConnection);

router.get('/user/alumni/location', verifyJWT, handleGetAlumniLocations);


export default router;
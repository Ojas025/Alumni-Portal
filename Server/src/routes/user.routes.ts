import express from 'express'
import { handleAddConnection, handleDeleteUser, handleFetchAllAlumniProfiles, handleFetchAllConnections, handleFetchAllStudentProfiles, handleFetchUsers, handleGetProfileById, handleGetUserProfile, handleRefreshAccessToken, handleRemoveConnection, handleUpdateAccountDetails, handleUserLogin, handleUserLogout, handleUserSignUp } from '../controllers/auth/user.controller';
import { userLoginValidator, userRegistrationValidator } from '../validators/user.validators';
import { validate } from '../validators/validate';
import { verifyJWT } from '../middlewares/auth/user.middlewares';

const router = express.Router();

// Auth
router.post('/login', userLoginValidator(), validate, handleUserLogin);
router.post('/signup', userRegistrationValidator(), validate, handleUserSignUp);
router.post('/logout', handleUserLogout);
router.post('/refresh-token', handleRefreshAccessToken);

// Profile
router.get('/user/profile', verifyJWT, handleGetUserProfile);
router.get('/user/profile/alumni', verifyJWT, handleFetchAllAlumniProfiles);
router.get('/user/profile/student', verifyJWT, handleFetchAllStudentProfiles);
router.get('/user/profile/:id', verifyJWT, handleGetProfileById);
router.delete('/user/:id', verifyJWT, handleDeleteUser);
router.put('/user/profile', verifyJWT, handleUpdateAccountDetails);
router.get('/user/users/', verifyJWT, handleFetchUsers);

// Connections
router.get('/user/connections', verifyJWT, handleFetchAllConnections);
router.put('/user/connect/:connecteeId', verifyJWT, handleAddConnection);
router.delete('/user/disconnect/:connecteeId', verifyJWT, handleRemoveConnection);


export default router;
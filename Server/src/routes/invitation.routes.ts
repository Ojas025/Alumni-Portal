import express from 'express'
import { verifyJWT } from '../middlewares/auth/user.middlewares';
import { handleAcceptInvitation, handleFetchPendingInvitations, handleRejectInvitation, handleSendInvitation } from '../controllers/invitation.controller';

const router = express.Router();
router.use(verifyJWT);

router.get('/pending', handleFetchPendingInvitations);
router.put('/reject/:invitationId', handleRejectInvitation);
router.put('/accept/:invitationId', handleAcceptInvitation);
router.post('/', handleSendInvitation);


export default router;
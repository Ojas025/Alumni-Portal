// import { Router } from "express";
// import { verifyJWT, verifyPermission } from "../middlewares/auth/user.middlewares";
// import { handleFetchAllActiveMentorships, handleFetchAllMentorships, handleGetPendingRequestsSent, handleRequestMentorship, handleRespondToMentorshipRequest } from "../controllers/mentorship.controller";

// const router = Router();

// // /api/mentorship

// router.get("/", verifyJWT, handleFetchAllMentorships);
// router.get("/active", verifyJWT, handleFetchAllActiveMentorships);
// router.post("/request", verifyJWT, verifyPermission(["student", "admin"]), handleRequestMentorship);
// router.put("/response", verifyJWT, verifyPermission(["alumni", "admin"]), handleRespondToMentorshipRequest);
// router.get("/request/pending", verifyJWT, verifyPermission(["student", "admin"]), handleGetPendingRequestsSent);

// export default router;
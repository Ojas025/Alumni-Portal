import { Router } from "express"; 
import { verifyJWT, verifyPermission } from "../middlewares/auth/user.middlewares";
import { handleDeleteTweet, handleFetchAllTweets, handleFetchUserTweets, handlePostTweet, handleUpdateTweet } from "../controllers/tweet.controller";

const router = Router();

router.get("/", verifyJWT, handleFetchAllTweets);
router.get("/user/:userId", verifyJWT, verifyPermission(["alumni", "admin"]), handleFetchUserTweets);
router.post("/", verifyJWT, handlePostTweet);
router.delete("/tweet/:tweetId", verifyJWT, verifyPermission(["alumni", "admin"]), handleDeleteTweet);
router.put("/tweet/:tweetId", verifyJWT, verifyPermission(["alumni", "admin"]), handleUpdateTweet);

export default router;
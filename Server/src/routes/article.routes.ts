import { Router } from "express"; 
import { handleDeleteArticle, handleFetchAllArticles, handleFetchArticleById, handleFetchArticlesByUser, handleFetchArticleSummary, handlePostArticle, handleUpdateArticle } from "../controllers/article.controller";
import { verifyJWT, verifyPermission } from "../middlewares/auth/user.middlewares";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", verifyJWT, handleFetchAllArticles);
router.get("/:articleId", verifyJWT, handleFetchArticleById);
router.get("/user/:userId", verifyJWT, verifyPermission(["alumni", "admin"]), handleFetchArticlesByUser);
router.post("/", verifyJWT, verifyPermission(["alumni", "admin"]), upload.single('thumbnail'), handlePostArticle);
router.delete("/:articleId", verifyJWT, verifyPermission(["alumni", "admin"]), handleDeleteArticle);
router.put("/:articleId", verifyJWT, verifyPermission(["alumni", "admin"]), upload.single('thumbnail'), handleUpdateArticle);
router.post("/summarize", verifyJWT, handleFetchArticleSummary);

export default router;
import { Router } from "express";
import { verifyJWT, verifyPermission } from "../middlewares/auth/user.middlewares";
import { handleDeleteEvent, handleFetchAllEvents, handleFetchEventById, handleFetchEventsByUser, handleFetchRsvpdEvents, handlePostEvent, handleRemoveRsvp, handleRsvpForEvent, handleUpdateEvent } from "../controllers/event.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
router.use(verifyJWT);

// /api/event

router.get("/", handleFetchAllEvents);
router.get("/user/:id", verifyPermission(["alumni", "admin"]), handleFetchEventsByUser);
router.get("/fetch/rsvp", handleFetchRsvpdEvents);
router.post("/", verifyPermission(["alumni", "admin"]), upload.single('image'), handlePostEvent);
router.put("/update/:eventId", verifyPermission(["alumni", "admin"]),  upload.single('image'), handleUpdateEvent);
router.post("/register/:eventId", handleRsvpForEvent);
router.put("/register/:eventId", handleRemoveRsvp);
router.get("/fetch/:eventId", handleFetchEventById);
router.delete("/:eventId", verifyPermission(["alumni", "admin"]), handleDeleteEvent);
router.get("/:eventId", verifyPermission(["alumni", "admin"]), handleFetchEventsByUser);

export default router;
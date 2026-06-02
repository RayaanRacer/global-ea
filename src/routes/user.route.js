import express from "express";

const router = express.Router();
import {
  getAdminDashboard,
  getAllRidersController,
  getRiderById,
  updatePasswordController,
  userCreateRiderController,
  userLoginController,
  userUpdateRiderController,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

router.post("/login", userLoginController);
router.post(
  "/create",
  authMiddleware,
  authorize("ADMIN"),
  userCreateRiderController,
);
router.put(
  "/update/:id",
  authMiddleware,
  authorize("ADMIN"),
  userUpdateRiderController,
);
router.get("/dashboard", authMiddleware, getAdminDashboard);
router.get("/details/:id", authMiddleware, authorize("ADMIN"), getRiderById);
router.get("/list", authMiddleware, authorize("ADMIN"), getAllRidersController);
router.put(
  "/password/:id",
  authMiddleware,
  authorize("ADMIN"),
  updatePasswordController,
);

export default router;

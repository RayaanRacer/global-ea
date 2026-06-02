import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
  completeRideController,
  createRideController,
  dispatchRideController,
  getRideDetailsController,
  getRidesListController,
  updateRideLocationController,
} from "../controllers/ride.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorize("ADMIN"),
  createRideController,
);

router.patch(
  "/:id/dispatch",
  authMiddleware,
  authorize("RIDER"),
  dispatchRideController,
);

router.put(
  "/:id/update-location",
  authMiddleware,
  authorize("RIDER"),
  updateRideLocationController,
);

router.put(
  "/:id/complete",
  authMiddleware,
  authorize("RIDER"),
  completeRideController,
);

router.get("/:id/details", authMiddleware, getRideDetailsController);

router.get("/list", authMiddleware, getRidesListController);
export default router;

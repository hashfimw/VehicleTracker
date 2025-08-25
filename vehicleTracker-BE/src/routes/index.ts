import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { vehicleRoutes } from "./vehicle.routes";
import { reportRoutes } from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/reports", reportRoutes);

export { router as apiRoutes };

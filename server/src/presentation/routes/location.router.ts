import { Router } from "express";
import { LocationController } from "../controllers/location/location.controller";


const router = Router();

router.get(
  "/search",
  LocationController.search,
);

router.get(
  "/details",
  LocationController.details,
);

export default router;
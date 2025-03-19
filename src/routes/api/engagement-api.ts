import Router from "express";
import {
  sendMessage,
  receiveMessage,
  checkStatus,
} from "../../controllers/engagementController";

const router = Router();
router.get("/deliveryreports", sendMessage);

router.post("/receivemessage", receiveMessage);

router.post("/checkstatus", checkStatus);

export default router;

import {
    create,
    single,
    deleteBenefitPlan,
    getAll,
    update,
  } from "../../../controllers/insurance/benefitPlanController";
  import { Router } from "express";
  
  const router = Router();
  
  // Retrieve all benefit plans
  router.get("/", getAll);
  
  // Create a new benefit plan
  router.post("/", create);
  
  // Retrieve a single benefit plan with id
  router.get("/:id", single);
  
  // Update a benefit plan with id
  router.patch("/:id", update);
  
  // Delete a benefit plan with id
  router.delete("/:id", deleteBenefitPlan);
  
  export default router;
  
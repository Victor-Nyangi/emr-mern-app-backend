import { Request, Response, NextFunction, Router } from "express";

const router = Router();

export const ping = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Welcome to EMR Backend API Mock Server",
    pingResponse: "Salaamaa",
  });
};


router.get("/", ping);

export default router;

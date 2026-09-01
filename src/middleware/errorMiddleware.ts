import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

/** Unmatched route -> a JSON 404 rather than Express's HTML default. */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  next(new Error(`Not found: ${req.method} ${req.originalUrl}`));
};

/**
 * The single place errors become responses.
 *
 * Controllers are wrapped in expressAsyncHandler and simply throw; this
 * decides the status and the body. Without it, a thrown error fell
 * through to Express's default handler, which replies with an HTML error
 * page. The frontend calls response.json() on every reply, so that HTML
 * threw a SyntaxError which its catch turned into an empty result set --
 * a backend failure rendered as an empty table with no error anywhere.
 * Always replying JSON is what makes those failures visible.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // A handler may already have set an intended status; anything below 400
  // means nothing meaningful was chosen, so treat it as a server error.
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err instanceof Error ? err.message : "Internal Server Error";

  // Translate the Mongoose failures that would otherwise all read as 500.
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if ((err as any)?.code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue ?? {}).join(", ");
    message = field ? `${field} already exists` : "Duplicate key";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "production"
      ? {}
      : { stack: err instanceof Error ? err.stack : undefined }),
  });
};

export default { notFound, errorHandler };

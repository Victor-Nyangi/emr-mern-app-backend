import { Response } from "express";
import mongoose from "mongoose";

/**
 * Turns a caught error into a JSON error response.
 *
 * This exists because the controllers are plain `async (req, res)`
 * handlers rather than expressAsyncHandler-wrapped ones: throwing from
 * them would produce an unhandled rejection and hang the request instead
 * of reaching the error middleware. Until they are wrapped, they catch
 * and delegate here.
 *
 * New code in middleware (which is wrapped) should throw and let
 * errorMiddleware respond. Both paths produce the same { message } shape,
 * so the frontend sees one error contract either way.
 */
export const handleError = (
  res: Response,
  error: unknown,
  statusCode = 500
) => {
  let status = statusCode;
  let message =
    error instanceof Error ? error.message : "Internal Server Error";

  // Mongoose failures carry a more accurate status than the call site's
  // guess -- a bad ObjectId is the caller's fault, not a missing record.
  if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = Object.values(error.errors)
      .map((e: any) => e.message)
      .join(", ");
  } else if (error instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  } else if ((error as any)?.code === 11000) {
    status = 409;
    const field = Object.keys((error as any).keyValue ?? {}).join(", ");
    message = field ? `${field} already exists` : "Duplicate key";
  }

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({ message });
};

export default handleError;

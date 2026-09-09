import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

type Source = "body" | "query" | "params";

/**
 * Validates part of the request against a Joi schema before the handler
 * runs, so controllers receive data they can trust.
 *
 * Two settings matter here:
 *
 *  - `stripUnknown` drops fields the schema does not declare. Controllers
 *    previously spread req.body straight into Mongoose updates, so a
 *    caller could set any field the schema happened to allow. Stripping
 *    closes that without rejecting requests that carry extra keys.
 *
 *  - `abortEarly: false` reports every problem at once rather than only
 *    the first, so a form can highlight all its invalid fields in one go.
 *
 * Failures are thrown, not sent, so errorMiddleware owns the response and
 * the error shape stays identical to every other error in the API.
 */
export const validate =
  (schema: ObjectSchema, source: Source = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      res.status(400);
      throw new Error(error.details.map((d) => d.message).join(", "));
    }

    // Use the coerced and stripped value, not the raw input.
    req[source] = value;

    next();
  };

export default validate;

import Joi from "joi";

const createInvoiceSchema = Joi.object({
  clientId: Joi.string().required(),
  items: Joi.array(),
  paid: Joi.number(),
  moreDetails: Joi.string(),
  debugMode: Joi.boolean(),
});
export default createInvoiceSchema;

"use strict";
import path from "path";
import log4js from "log4js";
import shortId from "shortid";
import { Request, Response } from "express";

import createInvoiceSchema from "../../schemas/invoice";
import generateInvoicePdf from "../../utils/pdf-generator";

const { getClientById } = require("../../repositories/clients");

type BillItem = {
  amountSum: number;
  quantity: number;
};
log4js.configure({
  appenders: {
    invoiceStory: {
      type: "file",
      filename: "containers/stories/invoiceStory-01.log",
    },
  },
  categories: { default: { appenders: ["invoiceStory"], level: "error" } },
});

const logger = log4js.getLogger("invoiceStory");
logger.level = "debug";

export const createInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await createInvoiceSchema.validateAsync(req.body);

    const logger = log4js.getLogger("invoiceStory");
    logger.trace("Hello, we got a NEW invoice story");

    const { moreDetails, clientId, items, paid, debugMode } = req.body;

    const client = getClientById(clientId);
    const destinationEmail = client.email;
    const { pricePerSession } = client;

    const invoiceId = shortId.generate();
    const invoiceNumber = "FACT-" + invoiceId + "." + clientId;

    // Calculate sum per item
    items.forEach((item: BillItem) => {
      item.amountSum = pricePerSession * item.quantity;
      return item;
    });
    // getting subtotal ->
    const subtotal = items.reduce((prev: number, curr: BillItem) => {
      return curr.amountSum + prev;
    }, 0);

    const fileName = invoiceNumber + ".pdf";
    const filePath = path.join(__dirname, "../../containers/${fileName}");

    const invoiceDetails = { client, items, invoiceNumber, paid, subtotal };
    logger.info("The data:", invoiceDetails);
    if (debugMode) {
      logger.debug("It is a debug mode, returning the data");
      res.send({
        success: false,
        debugMode,
        data: { invoiceDetails, filePath },
      });
    }
    logger.info("It is NOT a debug mode, going to send the email");
    generateInvoicePdf(invoiceNumber, filePath);
    // ... Other stuff happening here ( incl sending email)
    res.send({ success: true, data: { destinationEmail } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    logger.error("Some error occured", { message });
    res.status(400).json({ message });
  }
};

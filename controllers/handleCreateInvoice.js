"use strict";
const shortId = require("shortid");
const path = require("path");
const { createInvoiceSchema } = require("../schemas/invoice");
const { generateInvoicePdf } = require("../utils/pdf-generator");
const { sendGmail } = require("../utils/email-sender");
const { getClientById } = require("../repositories/clients");

const Log4js = require("log4js");
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
Logger.level = "debug";

const handleCreateInvoice = async (req, res, next) => {
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
    items.forEach((item) => {
      item.amountsum = pricePerSession * item.quantity;
      return item;
    });
    // getting subtotal ->
    const subtotal = items.reduce((prev, curr) => {
      return curr.amountSum + prev;
    }, 0);

    const fileName = invoiceNumber + ".pdf";
    const filePath = path.join(__dirname, "../../containers/${fileName}");

    const invoiceDetails = { client, items, invoiceNumber, paid, subtotal };
    logger.info("The data:", invoiceDetails);
    if (debugMode) {
      logger.debug("It is a debug mode, returning the data");
      return res.send({
        success: false,
        debugMode,
        data: { invoiceDetails, filepath },
      });
    }
    logger.info("It is NOT a debug mode, going to send the email");
    generateInvoicePdf(invoiceDetails, filePath);
    // ... Other stuff happening here ( incl sending email)
    return res.send({ success: true, data: { destinationEmail } });
  } catch (err) {
    Logger.error("Some error occured", { message: err.message });
    return res.status(400).send({ message: err.message });
  }
};
module.exports = { handleCreateInvoice };

const Url = require('../models/Url');
const checkWebsite = require('../utils/checkWebsite');
const sendEmail = require('../mailer/mailer');
const logger = require('../winston/logger');

const check = async (req, res) => {
  const { url } = req.body;
  const email = req.user.email;

  if (!url) {
    logger.warn("URL parameter is required");
    return res.status(400).send("URL parameter is required");
  }

  try {
    const result = await checkWebsite(url);
    logger.info(`Website check completed for URL: ${url}`);

    let urlEntry = await Url.findOne({ url: url, email: email });
    if (urlEntry) {
      urlEntry.statusCode = result.statusCode;
      urlEntry.responseTime = result.responseTime;
      urlEntry.currentStatus = result.currentStatus;
      urlEntry.checkedAt = new Date();
      logger.info(`URL entry updated for URL: ${url} and email: ${email}`);
    } else {
      urlEntry = new Url({
        url: url,
        email: email,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        currentStatus: result.currentStatus
      });
      logger.info(`New URL entry created for URL: ${url} and email: ${email}`);
    }
    await urlEntry.save();

    const subject = `Website Check Result for ${url}`;
    const text = `Status Code: ${result.statusCode}\nResponse Time: ${result.responseTime}ms\nStatus: ${result.currentStatus}`;
    
    try {
      const info = await sendEmail(email, subject, text);
      logger.info(`Email sent to ${email} with subject: ${subject}`);
      res.send({
        ...result,
        emailSent: true,
        emailResponse: info,
      });
    } catch (error) {
      logger.error(`Failed to send email to ${email}: ${error.message}`);
      res.send({
        ...result,
        emailSent: false,
        emailError: error.message,
      });
    }
  } catch (err) {
    logger.error(`Error during website check for URL: ${url}: ${err.message}`);
    res.status(500).send('Server error');
  }
};

module.exports = {
  check,
};

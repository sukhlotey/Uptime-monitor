const checkWebsite = require('./checkWebsite');
const sendEmail = require("../mailer/mailer");
const Url = require('../models/Url');
const cron = require("node-cron");
const logger = require('../winston/logger');

const scheduleJobs = async () => {
  try {
    const urls = await Url.find({});
    urls.forEach((urlEntry) => {
      cron.schedule(urlEntry.schedule, async () => {
        const result = await checkWebsite(urlEntry.url);
        const previousStatus = urlEntry.currentStatus;

        urlEntry.statusCode = result.statusCode;
        urlEntry.responseTime = result.responseTime;
        urlEntry.currentStatus = result.currentStatus;
        urlEntry.checkedAt = new Date();
        await urlEntry.save();

        logger.info(`Checked URL: ${urlEntry.url}, Status: ${result.currentStatus}`);

        if (result.currentStatus !== previousStatus) {
          const statusChange = result.currentStatus === 'down' ? 'down' : 'up';
          const subject = `Website Status Change: ${urlEntry.url} is now ${statusChange}`;
          const text = `Status Code: ${result.statusCode}\nResponse Time: ${result.responseTime}ms\nStatus: ${result.currentStatus}`;

          try {
            await sendEmail(urlEntry.email, subject, text);
            logger.info(`Email sent to ${urlEntry.email} for status change to ${statusChange}`);
          } catch (error) {
            logger.error(`Failed to send email to ${urlEntry.email}: ${error.message}`);
          }
        }
      });
    });
  } catch (error) {
    logger.error(`Error scheduling jobs: ${error.message}`);
  }
};

scheduleJobs();

app.post("/check", authenticate, async (req, res) => {
  const { url, schedule } = req.body;
  const email = req.user.email;

  if (!url) {
    logger.warn("URL parameter is required");
    return res.status(400).send("URL parameter is required");
  }

  try {
    const result = await checkWebsite(url);
    let urlEntry = await Url.findOne({ url: url, email: email });

    if (urlEntry) {
      const previousStatus = urlEntry.currentStatus;
      urlEntry.statusCode = result.statusCode;
      urlEntry.responseTime = result.responseTime;
      urlEntry.currentStatus = result.currentStatus;
      urlEntry.checkedAt = new Date();
      if (schedule) {
        urlEntry.schedule = schedule;
      }
      await urlEntry.save();
      logger.info(`URL entry updated for URL: ${url} and email: ${email}`);

      if (result.currentStatus !== previousStatus) {
        const statusChange = result.currentStatus === 'down' ? 'down' : 'up';
        const subject = `Website Status Change: ${url} is now ${statusChange}`;
        const text = `Status Code: ${result.statusCode}\nResponse Time: ${result.responseTime}ms\nStatus: ${result.currentStatus}`;

        try {
          const info = await sendEmail(email, subject, text);
          logger.info(`Email sent to ${email} for status change to ${statusChange}`);
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
      } else {
        res.send(result);
      }
    } else {
      urlEntry = new Url({
        url: url,
        email: email,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        currentStatus: result.currentStatus,
        checkedAt: new Date(),
        schedule: schedule || "*/5 * * * *"
      });
      await urlEntry.save();
      logger.info(`New URL entry created for URL: ${url} and email: ${email}`);

      const subject = `Website Check Result for ${url}`;
      const text = `Status Code: ${result.statusCode}\nResponse Time: ${result.responseTime}ms\nStatus: ${result.currentStatus}`;

      try {
        const info = await sendEmail(email, subject, text);
        logger.info(`Email sent to ${email} for website check result`);
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
    }

    scheduleJobs();
  } catch (error) {
    logger.error(`Error during URL check: ${error.message}`);
    res.status(500).send('Server error');
  }
});

module.exports = scheduleJobs;

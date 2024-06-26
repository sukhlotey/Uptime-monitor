const axios = require('axios');
const logger = require('../winston/logger')
const checkWebsite = async (url) => {
  try {
    const startTime = Date.now();
    const response = await axios.get(url);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    logger.info(`Status Code: ${response.status}`);
    logger.info(`Response Time: ${responseTime}ms`);

    return {
      statusCode: response.status,
      responseTime: responseTime,
      currentStatus: response.status === 200 ? 'up' : 'down'
    };
  } catch (error) {
    logger.error(`Error fetching ${url}: ${error.message}`);
    return {
      statusCode: error.response ? error.response.status : "404",
      responseTime: "0",
      currentStatus: 'down'
    };
  }
};

module.exports = checkWebsite;

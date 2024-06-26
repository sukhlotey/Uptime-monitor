const mongoose = require('mongoose');
const logger = require('../winston/logger')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        logger.info('MongoDb Connected')
    } catch (err) {
      logger.error(err)
        process.exit(1);
    }
};

module.exports = connectDB;

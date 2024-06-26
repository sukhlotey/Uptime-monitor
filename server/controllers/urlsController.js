const Url = require('../models/Url')

const urls =  async (req, res) => {
    const email = req.user.email;
    const urls = await Url.find({ email: email }).sort({ checkedAt: -1 });
  
    res.send(urls);
  };

  module.exports = urls;
const featureFlags = require('../services/flags');

module.exports = async function (req, res, next) {
    res.locals.flags = await featureFlags.getAll();

    next();
};

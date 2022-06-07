const DECOMM_NOTIFICATION_BANNER_FLAG_KEY = "alphavilleLongroomDecommNotficationBanner";

module.exports = async function (req, res, next) {
    res.locals.canShowDecommNotficationBanner = res.locals.flags.filter(flag => flag.name === DECOMM_NOTIFICATION_BANNER_FLAG_KEY).state || false;

    next();
};
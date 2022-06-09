module.exports = async function (req, res, next) {
    res.locals.canShowDecommNotficationBanner = process.env.SHOW_DECOMM_NOTIFICATION_BANNER_FLAG || false;
    res.locals.canShowDecommNotficationBanner = true;

    next();
};
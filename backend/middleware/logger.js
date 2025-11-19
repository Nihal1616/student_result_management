const Log = require("../models/Log");

const activityLogger = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      if (res.statusCode < 400) {
        Log.create({
          user: req.user?.id,
          action,
          resource,
          details: {
            method: req.method,
            url: req.url,
            body: req.body,
            params: req.params,
            query: req.query,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        }).catch((err) => console.error("Logging error:", err));
      }

      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = activityLogger;

export const requireMembership = (...levels) => {

  return (req, res, next) => {

    if (
      !levels.includes(req.user.membership)
    ) {
      return res.status(403).json({
        message:
          "Access denied: insufficient membership",
      });
    }

    next();
  };
};
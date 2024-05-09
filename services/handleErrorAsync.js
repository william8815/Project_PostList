const handleErrorAsync = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch((error) => {
      return next(error);
    });
  };
};
module.exports = handleErrorAsync;

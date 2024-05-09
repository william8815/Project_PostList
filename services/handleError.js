const handleError = (res, err) => {
  res.status(400).send({
    status: "false",
    message: err && err.message ? err.message : "輸入錯誤或無此 id",
  });
  res.end();
};
module.exports = handleError;

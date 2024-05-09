const handleSuccess = (res, data) => {
  res.send({
    status: "success",
    data: data,
  });
  res.end;
};
module.exports = handleSuccess;

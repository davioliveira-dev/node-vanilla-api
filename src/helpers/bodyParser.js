module.exports = function bodyParser(req, callback) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (body.length) {
      req.body = JSON.parse(body);
    }
    callback();
  });
};

const http = require("http");
const { URL } = require("url");

const routes = require("./routes");
const bodyParser = require("./helpers/bodyParser");

const server = http.createServer((req, res) => {
  console.log(`Request method: ${req.method} | Endpoint: ${req.url}`);
  const parsedUrl = new URL(`http://localhost${req.url}`);
  const query = parsedUrl.searchParams;
  const method = req.method;
  let pathname = parsedUrl.pathname;
  let id = null;

  const splitEndpoint = pathname.split("/").filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find(
    (route) => route.endpoint === pathname && route.method === method
  );

  if (route) {
    req.query = Object.fromEntries(query);
    req.params = { id };
    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      bodyParser(req, () => route.handler(req, res));
    } else {
      route.handler(req, res);
    }

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: `Not found. Cannot ${req.method} on ${req.url} `,
    })
  );
});
server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);

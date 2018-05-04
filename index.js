const express = require("express");
const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const https = require("https");
const http = require("http");

const privateKey = fs.readFileSync(path.join(`${__dirname}/sslcert/key.pem`));
const certificate = fs.readFileSync(path.join(`${__dirname}/sslcert/server.crt`));

const credentials = { key: privateKey, cert: certificate };

const DEFAULT_PORT_HTTP = 5000;
const DEFAULT_PORT_HTTPS = 5001;

const app = express();
app.use(express.static(path.join(__dirname, "./")));

const portHttp = process.env.PORT_HTTP || DEFAULT_PORT_HTTP;
const portHttps = process.env.PORT_HTTPS || DEFAULT_PORT_HTTPS;

app.set("portHttps", portHttps);
app.set("portHttp", portHttp);
app.get("/api/chartsconfig", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const content = fs.readFileSync(path.join(`${__dirname}/chartConfig.json`));
  res.send(content);
});

http
  .createServer(app)
  .listen(app.get("portHttp"), () => console.log(chalk.blue(`Listening on http://localhost:${portHttp}`)));

https
  .createServer(credentials, app)
  .listen(app.get("portHttps"), () => console.log(chalk.gray(`Listening on https://localhost:${portHttps}`)));

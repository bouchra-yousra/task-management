// DOT ENV CONFIGURATION
const dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");

var myEnv = dotenv.config();
dotenvExpand(myEnv);

// REQUIRING NECESSARY APPS : EXPRESS - BODYPARSER - CORS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const InitiateMongoServer = require("./src/utils/db");
var path = require("path");

// ROUTES
const user = require("./src/routes/user");
const task = require("./src/routes/task");
const category = require("./src/routes/category");
const space = require("./src/routes/space");

//Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Task_Management",
    version: "1.2.0",
    description:
      "This is a REST API application made with Express. It is the backend behind task management, which allows user to create tasks in an easy and organised way.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Afoun Yousra",
    },
  },
  servers: [
    {
      url: "http://localhost:8083/v1",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// INIT
InitiateMongoServer();
const app = express();

// PORT
const port = process.env.PORT || 8083;

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cors());
app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1/user", user);
app.use("/v1/tasks", task);
app.use("/v1/categories", category);
app.use("/v1/spaces", space);

app.get("/v1/", (req, res) => {
  res.sendFile(path.join(__dirname + "/src/static/index.html"));
});

app.use(function (err, req, res, next) {
  console.dir(err);

  if (err) {
    // Your Error Status code and message here.
    res.status(err.statusCode ?? 500).json({
      message: err.message ?? "error ! ",
    });
  }

  // Send Some valid Response
});

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});

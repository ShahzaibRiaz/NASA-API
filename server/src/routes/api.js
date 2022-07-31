const express = require("express");
const planetsRouter = require("./planets/planets.router.js");
const launchesRouter = require("./launches/launches.router.js");
const apiRouter = express.Router();

apiRouter.use("/planets", planetsRouter);
apiRouter.use("/launches", launchesRouter);

module.exports = apiRouter;

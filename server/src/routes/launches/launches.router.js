const express = require("express");
const {
  httpGetAllLaunches,
  httpAddLaunch,
  httpDeleteLaunch,
} = require("./launches.controller.js");

const router = express.Router();

router.get("/", httpGetAllLaunches);
router.post("/", httpAddLaunch);
router.delete("/:flightNumber", httpDeleteLaunch);

module.exports = router;

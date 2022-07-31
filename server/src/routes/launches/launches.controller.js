const {
  getAllLaunches,
  abortLaunchByFlightNumber,
  scheduleNewLaunch,
  launchExists,
} = require("../../models/launches.model.js");
const getPagination = require("../../services/query");

const httpGetAllLaunches = async (req, res, next) => {
  const { skip, limit } = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
};

const httpAddLaunch = async (req, res, next) => {
  const { mission, target, launchDate, rocket } = req.body.launch;
  console.log(req.body);
  if (!mission || !target || !launchDate || !rocket) {
    return res
      .status(400)
      .json({ error: "Mission or launch date is required" });
  }
  const launch = req.body.launch;
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpDeleteLaunch = async (req, res, next) => {
  // checke if launch exists with given flightNumber;
  const flightNumber = Number(req.params.flightNumber);
  if (!(await launchExists({ flightNumber }))) {
    return res
      .status(404)
      .json({ error: "Launch not found with given flightNumber" });
  }

  const abortedLaunch = await abortLaunchByFlightNumber(flightNumber);
  return res.status(200).json(abortedLaunch);
};

module.exports = { httpGetAllLaunches, httpAddLaunch, httpDeleteLaunch };

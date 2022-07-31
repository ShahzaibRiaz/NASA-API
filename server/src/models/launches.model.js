const axios = require("axios");
const launchesModel = require("./launches.mongo");
const planetsModel = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function saveLaunch(launch) {
  await launchesModel.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFlightNumber() {
  const launch = await launchesModel.findOne({}).sort("-flightNumber");
  if (!launch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return launch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesModel
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
  const planet = await planetsModel.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error(`No matching planet found.`);
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: ["ZTM", "ZA Bros", "SpaceX"],
  });
  await saveLaunch(launch);
}

const launchExists = async (filter) => {
  return await launchesModel.findOne(filter);
};

const abortLaunchByFlightNumber = async (flightNumber) => {
  return await launchesModel.findOneAndUpdate(
    { flightNumber },
    { upcoming: false, success: false }
  );
};

async function loadLaunchesData() {
  const launchExist = await launchExists({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (launchExist) {
    console.log("Launch data already loaded!");
    return;
  }
  const result = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: { name: 1 },
        },
        {
          path: "payloads",
          select: { customers: 1 },
        },
      ],
    },
  });
  const launchDocs = result.data.docs;
  for (const launchDoc of launchDocs) {
    const customers = launchDoc.payloads.flatMap(
      (payload) => payload.customers
    );
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}

module.exports = {
  getAllLaunches,
  abortLaunchByFlightNumber,
  launchExists,
  scheduleNewLaunch,
  loadLaunchesData,
};

const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planetsModel = require("./planets.mongo");

let planets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    ).pipe(
      parse({
        comment: "#",
        columns: true,
      })
        .on("data", async function (planet) {
          if (isHabitablePlanet(planet)) {
            // Upsert operation in mongoose feature
            // Insert + updated = upsert
            // await planetsModel.create({ keplerName: planet.kepler_name });
            savePlanetToDB(planet);
          }
        })
        .on("error", function (error) {
          console.log("Error", error);
          reject(error);
        })
        .on("end", function () {
          console.log("Habitables Planets found.");
          resolve(planets);
        })
    );
  });
}

async function savePlanetToDB(planet) {
  try {
    await planetsModel.findOneAndUpdate(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.log("Save Planet to DB", error);
  }
}
// Points to keep in mind that we're reading file and getting data from it in the form of chunks(streams) and we use pipe to throw that data (stream) to writable stream which is parse function from csv-parse lib.

//NOTE: Node won't wait for streams to get complete while loading module.
async function getAllPlanets() {
  return await planetsModel.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}
module.exports = { getAllPlanets, loadPlanetsData };

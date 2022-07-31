/** ------------------------------ */
/** SETUP ENV VARIABLES */
/** ------------------------------ */
require("dotenv").config();
// ------------------------------------------------------------------
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 4000;
/** ------------------------------ */
/** SERVER LISTENING ON PORT
/** ------------------------------ */
async function startServer() {
  try {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    app.listen(PORT, function () {
      console.log("Server running on port 4000");
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();

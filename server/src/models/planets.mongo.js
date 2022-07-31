const mongoose = require("mongoose");

const PlanetSchema = mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Planet", PlanetSchema);

const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("TEST GET /launches", () => {
    test("It should return with 200 status code", async () => {
      const response = await request(app).get("/v1/launches").expect(200);
    });
  });

  describe("TEST POST /launches", () => {
    const completeLaunchDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1080",
      target: "Kepler-186 f",
      launchDate: "January 1, 2016",
    };

    test("it should responsed with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          launch: completeLaunchDate,
        })
        .expect("Content-Type", /json/)
        .expect(201);
    });
    test("It should catch missing properties", () => {});
  });
});

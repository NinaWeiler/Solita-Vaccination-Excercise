const mongoose = require("mongoose");
const supertest = require("supertest");
const { initialOrders, initialVaccinations } = require("./test_helper");
const app = require("../app");
const Vaccination = require("../models/vaccination");
const Order = require("../models/order");
const config = require("../utils/config");
const api = supertest(app);


beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}); 
/*
beforeAll(() => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MogoDB', error.message)
    })
}) */


beforeEach(async () => {
  await Vaccination.deleteMany({});
  await Order.deleteMany({});

  for (let order of initialOrders) {
    let orderObject = new Order(order);
    await orderObject.save();
  }

  for (let vaccination of initialVaccinations) {
    let vaccinationObject = new Vaccination(vaccination);
    await vaccinationObject.save();
  }
});

describe("For initial orders in db", () => {
  test("all orders are returned", async () => {
    const response = await api.get("/api/orders");
    expect(response.body).toHaveLength(initialOrders.length);
  });
});

describe("Querying vaccinations expiring in 10 days", () => {
  test("returns orders that arrived 20 days before selected day", async () => {
    const selectedDay = "2021-02-11";
    let expectedArrivalDay = "2021-01-22";
    const response = await api.get("/api/orders/exp10/" + selectedDay);
    expect(response.body[0].arrived.startsWith(expectedArrivalDay)).toBe(true);
  });
  test('response has property "vaccines"', async () => {
    const selectedDay = "2021-02-11";
    const response = await api.get("/api/orders/exp10/" + selectedDay);
    expect(response.body[0]).toHaveProperty("vaccines");
  });
  test("empty array returned if no vaccinations are expiring in 10 days", async () => {
    const selectedDay = "2021-02-12";
    const response = await api.get("/api/orders/exp10/" + selectedDay);
    expect(response.body).toHaveLength(0);
  });
});

describe("Querying vaccinations expired on selected day", () => {
  test("return orders that arrived 30 days before selected day", async () => {
    const selectedDay = "2021-02-11";
    let expectedArrivalDay = "2021-01-12";
    const response = await api.get("/api/orders/expired/" + selectedDay);
    expect(response.body[0].arrived.startsWith(expectedArrivalDay)).toBe(true);
  });
  test('response has property "expired"', async () => {
    const selectedDay = "2021-02-11";
    const response = await api.get("/api/orders/expired/" + selectedDay);
    expect(response.body[0]).toHaveProperty("expired");
  });
  test("empty array returned if no vaccinations expire that day", async () => {
    const selectedDay = "2021-01-12";
    const response = await api.get("/api/orders/expired/" + selectedDay);
    expect(response.body).toHaveLength(0);
  });
});

describe("Error handling", () => {
  test("returns status 404 if unknown endpoint", async () => {
    const response = await api.get("/api/order");
    expect(response.status).toBe(404);
  });
  test("invalid date returns error message", async () => {
    const response = await api.get("/api/orders/expired/20-02-30");
    console.log("response.text", response);
    expect(response.text).toBe('{"error":"invalid date"}');
  }); 
});

afterAll(() => {
  mongoose.connection.close();
});

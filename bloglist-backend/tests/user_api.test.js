const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", name: "Root", passwordHash });
  await user.save();
});

describe("user creation", () => {
  test("succeeds with valid data", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "password123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("fails if username already taken", async () => {
    const newUser = {
      username: "root",
      name: "Another Root",
      password: "password123",
    };

    const result = await api.post("/api/users").send(newUser).expect(400);

    assert(result.body.error.includes("unique"));
  });

  test("fails if username too short", async () => {
    const newUser = { username: "ab", name: "Short", password: "password123" };

    const result = await api.post("/api/users").send(newUser).expect(400);

    assert(result.body.error);
  });

  test("fails if password too short", async () => {
    const newUser = { username: "validuser", name: "Valid", password: "ab" };

    const result = await api.post("/api/users").send(newUser).expect(400);

    assert(result.body.error);
  });
});

after(async () => {
  await mongoose.connection.close();
});

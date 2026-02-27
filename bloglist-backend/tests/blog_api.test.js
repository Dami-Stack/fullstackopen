const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

const api = supertest(app);

let token;
let testUser;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 10);
  testUser = new User({ username: "testuser", name: "Test", passwordHash });
  await testUser.save();

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser", password: "password" });

  token = loginResponse.body.token;

  await Blog.insertMany(helper.initialBlogs);
});

describe("GET /api/blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct amount of blogs is returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier is named id not _id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert(blog.id);
    assert(!blog._id);
  });
});

describe("POST /api/blogs", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Test Author",
      url: "http://testblog.com",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("if likes is missing it defaults to 0", async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Test Author",
      url: "http://testblog.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    assert.strictEqual(response.body.likes, 0);
  });

  test("blog without title returns 400", async () => {
    const newBlog = { author: "Test Author", url: "http://testblog.com" };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test("blog without url returns 400", async () => {
    const newBlog = { title: "Blog without url", author: "Test Author" };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test("fails with 401 if token not provided", async () => {
    const newBlog = {
      title: "No token blog",
      author: "Test Author",
      url: "http://testblog.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await Blog.findByIdAndUpdate(blogToDelete.id, { user: testUser._id });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe("updating a blog", () => {
  test("succeeds in updating likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});

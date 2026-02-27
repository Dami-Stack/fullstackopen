const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/11/10/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

test("dummy returns one", () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test("is the one with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result.likes, 12);
  });
});

describe("most blogs", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test("author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test("author with most likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });
});

"use strict";

const request = require("supertest");
const express = require("express");
const session = require("express-session");
const userRoutes = require("../routes/user-routes");
const { User, CampaignCreatorRequest } = require("../utils/sequelize").models;

jest.mock("../utils/sequelize", () => ({
    models: {
      User: { findOne: jest.fn(), create: jest.fn() },
      CampaignCreatorRequest: { findOne: jest.fn(), create: jest.fn() },
    },
}));

describe("User Routes Tests - NOT LOGGED USER", () => {
    let app;

    beforeEach(() => {
        // Variables
        const ONEDAY = 24 * 60 * 60 * 1000;
        const SECRET = "test_secret";
        
        app = express();

        // Config
        app.set("views", `${__dirname}/../views`);
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: true }));
        app.use(session({
            secret: SECRET,
            saveUninitialized: true,
            cookie: { maxAge: ONEDAY },
            resave: false
        }));
        // Routes
        app.use("/", userRoutes);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /login renders login page", async () => {
        const res = await request(app).get("/login");
        expect(res.status).toBe(200);
    });

    test("GET /register renders register page", async () => {
        const res = await request(app).get("/register");
        expect(res.status).toBe(200);
    });
    
    test("GET /profile redirects when user is not logged in", async () => {
        const res = await request(app).get("/profile");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });
    
    test("GET /register/admin redirects when user, admin, is not logged in", async () => {
        const res = await request(app).get("/register/admin");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    test("GET /register/admin redirect to /login if not logged in", async () => {
        const res = await request(app).get('/register/admin');

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/login'); 
    });

    test("POST /login fails with invalid credentials", async () => {
        User.findOne.mockResolvedValue(null);
    
        const res = await request(app).post("/login").send({
            username: "invalid_user",
            password: "invalid_pass",
        });
    
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    test("POST /login succeeds with valid credentials", async () => {
        User.findOne.mockResolvedValue({ username: "valid_user", password: "valid_pass", role: "donor" });
    
        const res = await request(app).post("/login").send({
            username: "valid_user",
            password: "valid_pass",
        });
    
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/campaigns");
    });

    test("POST /register fails with missing fields", async () => {
        const res = await request(app).post("/register").send({ username: "new_user" });
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/register");
    });

    test("POST /register creator fails to insert file", async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, username: "new_user" });
    
        const res = await request(app)
            .post("/register")
            .send({
            username: "new_user",
            password: "password123",
            password_confirmation: "password123",
            role: "campaign_creator",
        });
    
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/register");
    });
    
    test("POST /register succeeds with valid data as a DONOR", async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, username: "new_user" });
    
        const res = await request(app)
            .post("/register")
            .field("username", "new_user")
            .field("password", "password123")
            .field("password_confirmation", "password123")
            .field("role", "donor")
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    // test("POST /register succeeds with valid data and file upload for CREATOR", async () => {
    //     User.findOne.mockResolvedValue(null);
    //     User.create.mockResolvedValue({ id: 1, username: "creator"});
    //     CampaignCreatorRequest.create.mockResolvedValue({});

    //     const mockFile = { buffer: Buffer.from("mock-file-buffer"), name: "mock_file.pdf" };
    //     const res = await request(app)
    //         .post("/register")
    //         .field("username", "creator")
    //         .field("password", "pass123")
    //         .field("password_confirmation", "pass123")
    //         .field("role", "campaign_creator")
    //         .attach("id_document", mockFile.buffer, mockFile.name);

    //     expect(res.status).toBe(302);
    //     expect(res.headers.location).toBe("/login");
    // });
});

describe("User Routes Tests - DONOR", () => {
    let app;
    let agent;
    let mockUser;

    beforeEach(async () => {
        // Variables
        const ONEDAY = 24 * 60 * 60 * 1000;
        const SECRET = "test_secret";
        
        app = express();

        // Config
        app.set("views", `${__dirname}/../views`);
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: true }));
        app.use(session({
            secret: SECRET,
            saveUninitialized: true,
            cookie: { maxAge: ONEDAY },
            resave: false
        }));
        // Routes
        app.use("/", userRoutes);
        // Set up a request agent to simulate an authenticated session
        agent = request.agent(app);

        mockUser = { id: 1, username: "donor", password: "valid_pass", role: "donor" };
        // Mock user login
        User.findOne.mockResolvedValue(mockUser);

        // Login as a DONOR
        await agent.post("/login").send({
            username: "donor",
            password: "valid_pass",
        });

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /profile renders profile page", async () => {
        const res = await agent.get("/profile");
        expect(res.status).toBe(200);
    });

    test("POST /profile update profile successfully", async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);

        User.findOne
            .mockResolvedValueOnce(null) 
            .mockResolvedValueOnce({ id: 1, update: mockUpdate }); 

        const response = await agent
            .post("/profile")
            .field("newUsername", "user2")
            .field("newPassword", "newpass123")
            .field("newPasswordConfirmation", "newpass123")
            .attach('picture', 'tests/test-image.jpg'); 

        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/profile");
        expect(User.findOne).toHaveBeenCalledTimes(3);
        expect(User.findOne).toHaveBeenNthCalledWith(2, { where: { username: "user2" } }); 
        expect(User.findOne).toHaveBeenNthCalledWith(3, { where: { id: 1 } });
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            username: 'user2',
            password: 'newpass123',
            picture: expect.any(Buffer), // Ensure the picture is passed correctly as a buffer
        }));
    });

    test("GET /register/admin redirect to login", async () => {
        agent.session = { user: mockUser };

        const response = await agent.get('/register/admin');
        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/login");
    });

    test("GET /logout destroys session and redirects", async () => {
        // Perform the GET request to logout
        const response = await agent.get("/logout");

        // Verify redirection after logout
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/login");
    });
});


describe("User Routes Tests - CREATOR", () => {
    let app;
    let agent;
    let mockUser;

    beforeEach(async () => {
        // Variables
        const ONEDAY = 24 * 60 * 60 * 1000;
        const SECRET = "test_secret";
        
        app = express();

        // Config
        app.set("views", `${__dirname}/../views`);
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: true }));
        app.use(session({
            secret: SECRET,
            saveUninitialized: true,
            cookie: { maxAge: ONEDAY },
            resave: false
        }));
        // Routes
        app.use("/", userRoutes);
        // Set up a request agent to simulate an authenticated session
        agent = request.agent(app);

        mockUser = { id: 1, username: "creator", password: "valid_pass", role: "creator" };
        // Mock user login
        User.findOne.mockResolvedValue(mockUser);

        // Login as a CREATOR
        await agent.post("/login").send({
            username: "creator",
            password: "valid_pass",
        });

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /profile renders profile page", async () => {
        const res = await agent.get("/profile");
        expect(res.status).toBe(200);
    });

    test("POST /profile update profile successfully", async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);

        User.findOne
            .mockResolvedValueOnce(null) 
            .mockResolvedValueOnce({ id: 1, update: mockUpdate }); 

        const response = await agent
            .post("/profile")
            .field("newUsername", "user2")
            .field("newPassword", "newpass123")
            .field("newPasswordConfirmation", "newpass123")
            .attach('picture', 'tests/test-image.jpg'); 

        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/profile");
        expect(User.findOne).toHaveBeenCalledTimes(3);
        expect(User.findOne).toHaveBeenNthCalledWith(2, { where: { username: "user2" } }); 
        expect(User.findOne).toHaveBeenNthCalledWith(3, { where: { id: 1 } });
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            username: 'user2',
            password: 'newpass123',
            picture: expect.any(Buffer), // Ensure the picture is passed correctly as a buffer
        }));
    });

    test("GET /register/admin redirect to login", async () => {
        agent.session = { user: mockUser };

        const response = await agent.get('/register/admin');
        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/login");
    });

    test("GET /logout destroys session and redirects", async () => {
        // Perform the GET request to logout
        const response = await agent.get("/logout");

        // Verify redirection after logout
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/login");
    });
});


describe("User Routes Tests - ADMIN", () => {
    let app;
    let agent;
    let mockUser;

    beforeEach(async () => {
        // Variables
        const ONEDAY = 24 * 60 * 60 * 1000;
        const SECRET = "test_secret";
        
        app = express();

        // Config
        app.set("views", `${__dirname}/../views`);
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: true }));
        app.use(session({
            secret: SECRET,
            saveUninitialized: true,
            cookie: { maxAge: ONEDAY },
            resave: false
        }));
        // Routes
        app.use("/", userRoutes);
        // Set up a request agent to simulate an authenticated session
        agent = request.agent(app);

        mockUser = { id: 1, username: "admin", password: "valid_pass", role: "administrator" };
        // Mock user login
        User.findOne.mockResolvedValue(mockUser);

        // Login as a ADMIN
        await agent.post("/login").send({
            username: "admin",
            password: "valid_pass",
        });

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /profile renders profile page", async () => {
        const res = await agent.get("/profile");
        expect(res.status).toBe(200);
    });

    test("POST /profile update profile successfully", async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);

        User.findOne
            .mockResolvedValueOnce(null) 
            .mockResolvedValueOnce({ id: 1, update: mockUpdate }); 

        const response = await agent
            .post("/profile")
            .field("newUsername", "user2")
            .field("newPassword", "newpass123")
            .field("newPasswordConfirmation", "newpass123")
            .attach('picture', 'tests/test-image.jpg'); 

        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/profile");
        expect(User.findOne).toHaveBeenCalledTimes(3);
        expect(User.findOne).toHaveBeenNthCalledWith(2, { where: { username: "user2" } }); 
        expect(User.findOne).toHaveBeenNthCalledWith(3, { where: { id: 1 } });
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            username: 'user2',
            password: 'newpass123',
            picture: expect.any(Buffer), // Ensure the picture is passed correctly as a buffer
        }));
    });

    test("GET /register/admin redirect to login", async () => {
        agent.session = { user: mockUser };

        const response = await agent.get('/register/admin');
        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/login");
    });

    test("GET /logout destroys session and redirects", async () => {
        // Perform the GET request to logout
        const response = await agent.get("/logout");

        // Verify redirection after logout
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/login");
    });
});


describe("User Routes Tests - ROOT ADMIN", () => {
    let app;
    let agent;
    let mockUser;

    beforeEach(async () => {
        // Variables
        const ONEDAY = 24 * 60 * 60 * 1000;
        const SECRET = "test_secret";
        
        app = express();

        // Config
        app.set("views", `${__dirname}/../views`);
        app.set("view engine", "ejs");
        app.use(express.urlencoded({ extended: true }));
        app.use(session({
            secret: SECRET,
            saveUninitialized: true,
            cookie: { maxAge: ONEDAY },
            resave: false
        }));
        // Routes
        app.use("/", userRoutes);
        // Set up a request agent to simulate an authenticated session
        agent = request.agent(app);

        mockUser = { id: 1, username: "root", password: "valid_pass", role: "root_administrator" };
        // Mock user login
        User.findOne.mockResolvedValue(mockUser);

        // Login as a ROOT ADMIN
        await agent.post("/login").send({
            username: "root",
            password: "valid_pass",
        });

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("GET /profile renders profile page", async () => {
        const res = await agent.get("/profile");
        expect(res.status).toBe(200);
    });

    test("POST /profile update profile successfully", async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);

        User.findOne
            .mockResolvedValueOnce(null) 
            .mockResolvedValueOnce({ id: 1, update: mockUpdate }); 

        const response = await agent
            .post("/profile")
            .field("newUsername", "user2")
            .field("newPassword", "newpass123")
            .field("newPasswordConfirmation", "newpass123")
            .attach('picture', 'tests/test-image.jpg'); 

        expect(response.status).toBe(302); 
        expect(response.headers.location).toBe("/profile");
        expect(User.findOne).toHaveBeenCalledTimes(3);
        expect(User.findOne).toHaveBeenNthCalledWith(2, { where: { username: "user2" } }); 
        expect(User.findOne).toHaveBeenNthCalledWith(3, { where: { id: 1 } });
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            username: 'user2',
            password: 'newpass123',
            picture: expect.any(Buffer), 
        }));
    });

    test("GET /register/admin render register admin page", async () => {
        agent.session = { user: mockUser };

        const response = await agent.get('/register/admin');
        expect(response.status).toBe(200); 
    });

    test("GET /logout destroys session and redirects", async () => {
        const response = await agent.get("/logout");

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/login");
    });
});
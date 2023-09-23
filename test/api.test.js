const request = require("supertest");
const express = require("express");
const router = require("../routes/tasks"); // Adjust the file path
const Task = require("../models/task");
jest.mock("../models/task");

const app = express();
app.use(express.json());
app.use("/", router);

describe("GET /", () => {
  it("should return all task when found", async () => {
    const mockTask = {
      status: "ok",
      message: "Retrive Data succesfully",
      tasks: [
          {
              _id: "mockTaskId",
              title: "Updated Title1",
              description: "test",
              completed: false,
          }
      ]
  };
    
   Task.find.mockResolvedValue(mockTask)

    const response = await request(app).get("/");
    console.log(response.bo)
    expect(response.status).toBe(200);
    // expect(response.body).toEqual(mockTask);
  });

  it("should return a 404 error when task not found", async () => {
    Task.find.mockResolvedValue(null);

    const response = await request(app).get("/");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Task not found",
    });
  });

  it("should return a 500 error for other errors", async () => {
    Task.find.mockRejectedValue(new Error("Some error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
  });
});

//created
describe("POST /", () => {
  it("should create a new task and return 201 status", async () => {
    const mockTask = {
      _id: "mockTaskId",
      title: "Sample Task",
      description: "Task description",
      completed: false,
    };
    Task.prototype.save.mockResolvedValue(mockTask);

    const requestBody = {
      title: "Sample Task",
      description: "Task description",
      completed: false,
    };

    const response = await request(app).post("/").send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: "ok",
      message: "Task created succesfully",
      id: mockTask.id,
    });
  });

  it("should handle errors and call next with the error", async () => {
    const errorMessage = "Error saving task";
    Task.prototype.save.mockRejectedValue(new Error(errorMessage));

    const requestBody = {
      title: "Sample Task",
      description: "Task description",
      completed: "false",
    };

    // Mock next function to capture the error
    const mockNext = jest.fn();

    const response = await request(app).post("/").send(requestBody);

    expect(response.status).toBe(500);
  });
});

// patch
describe("PATCH /:id", () => {
  it("should update a task and return 200 status", async () => {
    const mockTaskId = "650d53f412d38f32613838a6";
    const requestBody = {
      title: "Updated Task Title",
      description: "Updated Task Description",
      completed: true,
    };
    const mockUpdatedTask = {
      _id: mockTaskId,
      title: requestBody.title,
      description: requestBody.description,
      completed: requestBody.completed,
    };
    Task.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

    const response = await request(app)
      .patch(`/${mockTaskId}`)
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedTask);
  });

  it("should handle invalid task ID and return 400 status", async () => {
    const invalidTaskId = "650d53f412d38f32613838a69";
    const requestBody = {
      title: "Updated Task Title",
      description: "Updated Task Description",
      completed: true,
    };

    const response = await request(app)
      .patch(`/${invalidTaskId}`)
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid task ID" });
  });

  it("should handle errors and return 500 status", async () => {
    const mockTaskId = "650d53f412d38f32613838a1";
    const requestBody = {
      title: "Updated Task Title",
      description: "Updated Task Description",
      completed: true,
    };
    const errorMessage = "Internal server error";
    Task.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .patch(`/${mockTaskId}`)
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: "error",
      message: "Internal server error",
    });
  });
});

// get :id
describe("GET /:id", () => {
  it("should return a task by id ", async () => {
    const mockTask = {
      status: "ok",
      message: "Retrive Data succesfully",
      tasks: [
          {
              _id: "mockTaskId",
              title: "Updated Title1",
              description: "test",
              completed: false,
          }
      ]
  };
    
   Task.find.mockResolvedValue(mockTask)

    const response = await request(app).get("/");
    console.log(response.bo)
    expect(response.status).toBe(200);
    // expect(response.body).toEqual(mockTask);
  });

  it("should return a 404 error when task not found", async () => {
    Task.find.mockResolvedValue(null);

    const response = await request(app).get("/");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Task not found",
    });
  });

  it("should return a 500 error for other errors", async () => {
    Task.find.mockRejectedValue(new Error("Some error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
  });
});

// delete

describe('DELETE /:id', () => {
  it('should delete a task and return 200 status', async () => {
    const mockTaskId = '650d5efc0f8822e58f8b6998';
    Task.findByIdAndRemove.mockResolvedValue({ _id: mockTaskId });

    const response = await request(app)
      .delete(`/${mockTaskId}`)
      .expect(200);
    expect(response.body).toEqual({ status: 'ok', message: 'Task has been deleted' });
  });

  it('should handle invalid task ID and return 400 status', async () => {
    const invalidTaskId = 'invalidTaskId';

    const response = await request(app)
      .delete(`/${invalidTaskId}`)
      .expect(400);

    expect(response.body).toEqual({ message: 'Invalid task ID' });
  });

  it('should handle task not found and return 400 status', async () => {
    const nonExistentTaskId = null;
    Task.findByIdAndRemove.mockRejectedValue(null);

    const response = await request(app)
      .delete(`/${nonExistentTaskId}`)
      .expect(400);
      expect(response.status).toBe(400);
    // expect(response.body).toEqual({ status: 'error', message: 'Task not found' });
  });


});

const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const Task = require("../models/task");
const mongoose = require("mongoose");

// GET /tasks
// Example route with Swagger annotations
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get Tasks
 *     tags: [Tasks]
 *     description: Returns a simple message as an example.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get("/", async (req, res, next) => {
  try {
    let tasks = await Task.find();
    if (!tasks) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }
    res.status(200).json({
      status: "ok",
      message: "Retrive Data succesfully",
      tasks,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the task.
 *         description:
 *           type: string
 *           description: Description of the task.
 *         completed:
 *           type: boolean
 *           description: Indicates whether the task is completed or not.
 *       example:
 *         title: New Task
 *         description: This is a new task.
 *         completed: false
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       description: Request body for creating a new task.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'  # Reference the actual Task model schema
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */


router.post("/", async (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed || false,
  });

  try {
    const newTask = await task.save();
    res.status(201).json({
      status: "ok",
      message: "Task created succesfully",
      id: newTask.id,
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id
/**
 * @swagger
 *  /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a task by ID.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The task with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found.
 */
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update a task by ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update for the task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *             example:
 *               title: Updated Title
 *               description: Updated description
 *               completed: true
 *     responses:
 *       200:
 *         description: The updated task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'  # Assuming you have a Task schema defined
 *       404:
 *         description: Task not found.
 */

router.patch("/:id", async (req, res) => {
  const taskId = req.params.id;

  // Validate if the provided ID is a valid MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: req.body }, // Update the task with the request body
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
// DELETE /tasks/:id
/**
 * @swagger
 * /api/v1/tasks:/{id}:
 *   delete:
 *     summary: Delete a task by ID.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 */

router.delete("/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    // Validate if the provided ID is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Use findByIdAndRemove to delete the task
    const deletedTask = await Task.findByIdAndRemove(taskId);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    res.json({ status: "ok", message: "Task has been deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

async function getTask(req, res, next) {
  let task;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(404)
        .json({ status: "error", message: "Invalid task ID" });
    }
    task = await Task.findById(req.params.id);
    if (task == null || !task) {
      return res
        .status(400)
        .json({ status: "error", message: "Task not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

module.exports = router;

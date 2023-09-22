const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { specs, swaggerUi } = require('./Swagger/swagger');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('combined'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/task_management_db');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Serve Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Load models and routes here
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const jobRoutes = require('./routes/jobRoutes')

dotenv.config()

const app = express()

//Middleware
app.use(cors());
app.use(express.json())

connectDB()

app.use('/api/jobs', jobRoutes)
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  });

const PORT = process.env.PORT || 5000

app.listen(PORT, ()  => console.log(`Server is running at port ${PORT}`))
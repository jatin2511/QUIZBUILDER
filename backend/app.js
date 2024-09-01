const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();


connectDB();

const app = express();


app.use(express.json());


app.use(cors({
  origin: 'https://66d42b87c54e74fe32eb8a31--hilarious-moonbeam-5731f1.netlify.app/', 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization' 
}));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/dashboard',require('./routes/dashboardRoute'));
app.use('/api/analytics',require('./routes/analyticsRoute'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

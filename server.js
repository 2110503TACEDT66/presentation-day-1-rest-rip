const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const workingSpaces = require('./routes/workingSpace')
const reservations = require('./routes/reservation');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const {xss} = require('express-xss-sanitizer');
const helmet = require('helmet');
const connectDB = require('./config/db');
const auth = require('./routes/auth');
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();


app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());
app.use(cookieParser());

app.use('/workingSpaces', workingSpaces);
app.use('/reservations', reservations);
app.use('/auth',auth);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log('Server running in', process.env.NODE_ENV, ' mode on port ', PORT);
});

process.on('unhandledRejection',(err,promise)=> { 
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit());
});

const limiter = rateLimit({
    windowsMs : 10*60*1000,
    max : 100
});

app.use(limiter);

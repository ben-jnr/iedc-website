const express = require('express');
const app = express();
const router = express.Router();
const dotenv = require('dotenv');
const connectDb = require('./backend/config/db');
const ejs = require('ejs');
const asyncHandler = require("./backend/middlewares/async");
const Event = require('./backend/schemas/Event');
const advancedQueryResults = require('./backend/middlewares/advancedQueryResults');

const events = require('./backend/routes/events');
const teams = require('./backend/routes/teams');
const about = require('./backend/routes/about');
const home = require('./backend/routes/home');
const achievements = require('./backend/routes/achievements');

//setting up ejs and Static directory
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

//Loading all env variables
dotenv.config({ path: './backend/config/config.env' });

//Connect to mongo
connectDb()

// JSON parsing essentials
app.use(express.json());

// URL encoded data extracter
app.use(
  express.urlencoded({
    extended: true,
  })
);

router.route('/').get(advancedQueryResults(Event), asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQueryResults);
}))

//Mounting Route
app.use('/events', events);
app.use('/teams', teams);
app.use('/about',about);
app.use('/home', home);
app.use('/achievements',achievements);

//Listening to app
const server = app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${process.env.PORT}`));


//Handling unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error:${error.message}`);
  //Close the server and exit process
  server.close(() => process.exit(1));
})

//'npm run dev' for running app in development mode 
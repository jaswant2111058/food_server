require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')


const indexRouter = require('./routes/index');
const authRouter = require('./routes/user');
const imagesRouter = require('./routes/imagesRouter');
const webyapar = require("./routes/webyapar")


const app = express();


mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));



    
app.use(
    cors({
        origin: "*",
        exposedHeaders: 'Authorization'
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', imagesRouter);
app.use('/', webyapar);


const os = require('os');
const getLocalIPv4Address = () => {
  const ifaces = os.networkInterfaces();

  for (const iface in ifaces) {
    for (const details of ifaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
};

const port = process.env.PORT || '5000'

const server = app.listen(port, function () {
    console.log("Server is up");
    const host = getLocalIPv4Address();
    console.log(`Server is running at http://${host}:${server.address().port}`);
})
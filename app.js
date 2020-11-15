const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const globalErrorHandler = require('./Controller/errorController');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', viewRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.use(globalErrorHandler);

/**
 * Basically if any request make it to this point that means router
 * did not catch the request in that case a nicely
 * formatted error would be given to user
 * */
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Error',
    message: `Can't find the ${req.originalUrl} for this server`
  });
});

module.exports = app;

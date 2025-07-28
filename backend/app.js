const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');
const notificationRoute = require('./routes/notificationRoute')
const reportRoute = require('./routes/reportRoute')
const contactMsgRoute = require('./routes/contactMessageRoute')

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static("uploads"))

app.use('/api/v1/notification/', notificationRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/blog', blogRoute);
app.use('/api/v1/report', reportRoute);
app.use('/api/v1/contact', contactMsgRoute);

module.exports = app;
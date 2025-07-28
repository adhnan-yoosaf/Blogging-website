const app = require('./app')
const dotenv = require('dotenv')
const databaseConnection = require('./config/databaseConnection')

dotenv.config({ path: './config/config.env' });
databaseConnection()

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`)
});

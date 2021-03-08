require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./src/models");
const globals = require("./src/config/globals.js");

app.use(bodyParser.json());

db.sequelize.sync({ force: globals.sync_database }).then(() => {
    console.log("Drop and re-sync db.");
});

require('./src/routes/apiRoutes.js')(app);
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`🚀 app listening on port ${port}`);

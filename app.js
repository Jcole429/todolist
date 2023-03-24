const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    var today = new Date();
    var currentDay = today.getDay();

    res.render("list", { kindOfDay: weekdayNames[currentDay] });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
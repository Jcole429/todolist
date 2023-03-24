const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    var today = new Date();

    var dateOptions = {
        weekday: "long",
    };

    var currentDay = today.toLocaleDateString("en-US", dateOptions);

    res.render("list", { kindOfDay: currentDay });
});

app.post("/", (req, res) => {
    res.send(req.body.newItem);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
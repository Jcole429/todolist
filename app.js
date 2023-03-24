const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let items = ["Buy food", "Cook food", "Eat food"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let today = new Date();

    let dateOptions = {
        weekday: "long",
    };

    let currentDay = today.toLocaleDateString("en-US", dateOptions);

    res.render("list", { kindOfDay: currentDay, newListItems: items });
});

app.post("/", (req, res) => {
    items.push(req.body.newItem);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const PORT = 3000;

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let items = ["Buy food", "Cook food", "Eat food"];
let workItems = []

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let currentDay = date.getCurrentDay();
    res.render("list", { listTitle: currentDay, newListItems: items });
});

app.post("/", (req, res) => {
    console.log(req.body);
    let item = req.body.newItem;
    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
}); 
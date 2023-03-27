const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItem1 = new Item({ name: "Do homework" });
const defaultItem2 = new Item({ name: "Read book" });
const defaultItem3 = new Item({ name: "Do laundry" });

const defaultItems = [defaultItem1, defaultItem2, defaultItem3];

const workItems = []

app.get("/", (req, res) => {
    const currentDay = date.getCurrentDay();
    Item.find().then((items) => {
        if (items.length == 0) {
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        res.render("list", { listTitle: "To Do", listItems: items });
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/", (req, res) => {
    console.log(req.body);
    const item = req.body.newItem;
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
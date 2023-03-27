const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const defaultListName = "To Do"; // Default list

app.get("/", (req, res) => {
    List.findOne({ name: defaultListName }).then((foundList) => {
        if (foundList === null) { // List does not exist
            console.log("List not found: " + defaultListName);

            const list = new List({
                name: defaultListName
            });

            list.save();

            res.redirect("/");

        } else { // List exists
            res.render("list", { listTitle: foundList.name, listItems: foundList.items, listId: foundList._id });
        }
    });
});

app.post("/", (req, res) => {
    console.log(req.body);
    const newItemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({ name: newItemName });

    List.findOne({ name: listName }).then((foundList) => {
        if (foundList == null) { // List does not exist
            console.log("List does not exist:" + listName);
        } else {
            foundList.items.push(newItem);
            foundList.save();

            if (listName === defaultListName) {
                res.redirect("/");
            } else {
                res.redirect("/list/" + listName);
            }
        }
    });
    // }
});

app.post("/delete", (req, res) => {
    console.log(req.body);
    const itemId = req.body.itemId
    const listId = req.body.listId

    List.findOneAndUpdate({ _id: listId }, { $pull: { items: { _id: itemId } } }).then((foundList) => {
        console.log("foundList: " + foundList);
        if (foundList.name === defaultListName) {
            res.redirect("/");
        } else {
            res.redirect("/list/" + foundList.name);
        }
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/list/:listName", (req, res) => {
    console.log(req.params);
    const listName = _.capitalize(req.params.listName);

    List.findOne({ name: listName }).then((foundList) => {
        if (foundList === null) { // List does not exist
            console.log("List not found: " + listName);

            const list = new List({
                name: listName
            });

            list.save();

            res.redirect("/list/" + listName);

        } else { // List exists
            console.log("Found list: " + listName);
            res.render("list", { listTitle: foundList.name, listItems: foundList.items, listId: foundList._id });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
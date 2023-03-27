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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const defaultItem1 = new Item({ name: "Do homework" });
const defaultItem2 = new Item({ name: "Read book" });
const defaultItem3 = new Item({ name: "Do laundry" });

const defaultItems = [defaultItem1, defaultItem2, defaultItem3];

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
            res.render("list", { listTitle: foundList.name, listItems: foundList.items });
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
    const itemId = req.body.itemId
    Item.deleteOne({ _id: itemId }).then(() => {
        console.log("Deleted: " + itemId);
    }).catch((error) => {
        console.log(error);
    });
    res.redirect("/");
});

app.get("/list/:listName", (req, res) => {
    const listName = req.params.listName;

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
            res.render("list", { listTitle: foundList.name, listItems: foundList.items });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
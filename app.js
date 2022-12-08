const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app. set("view engine", "ejs");

// const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

// var items = [];

// Connect with local MongoDB
// mongoose.connect("mongodb://localhost:27017/todoDB");

// Connect with Cloud MongoDB
mongoose.connect("mongodb+srv://admin:admin123@todoejs.nfu5hdx.mongodb.net/todoDB");

const itemSchema = mongoose.Schema({
    name: String
});
const Todo = mongoose.model("Todo", itemSchema);

app.get("/", function(req, res){
    // var todayObject = new Date();
    
    // First way using list
    // var today = todayObject.getDate()
    // res.render("list", {today: day[today]})

    //Second way using toLocalDateString()
    // var options = {weekday: "long", day: "numeric", month: "long"};
    // var today = todayObject.toLocaleDateString("en-US", options);
    // res.render("list", {today: today, itemLst: items})

    // Display data from MongoDB
    Todo.find({}, function(err, result){
        if (result.length === 0) {
            Todo.insertMany([
                {
                    name: "<-- Hit checkbox to delete item."
                }
            ], function(err){
                if (err){
                    console.log(err);
                } else {
                    console.log("Succesfully saved default items to DB");
                }
            });

        }
        res.render("list", {today: "Today", itemLst: result})
    });
})

app.post("/", function(req, res){
    var newItem = req.body.newItem;
    // items.push(newItem);
    const todo = new Todo ({
        name: newItem
    });

    todo.save();

    res.redirect("/");
})

app.post("/delete", function(req, res){
    var delItem = req.body.checkbox;
    Todo.findByIdAndDelete({_id: delItem}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Succesfully delete the item.");
        }
    });
    res.redirect("/");

})

// Run on localhost
// app.listen(3000, function() {
//     console.log("Server started on port 3000");
// })

// Run on Heroku
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running.");
})


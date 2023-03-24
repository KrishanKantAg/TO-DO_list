const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require('ejs');
const day = require(__dirname + "/days.js");
const mongoose = require('mongoose');
require('dotenv').config();
const _ = require("lodash");
const url ="mongodb+srv://"+process.env.user+":"+process.env.password+process.env.cluster+".mongodb.net/toDOListDB?retryWrites=true&w=majority";
mongoose.connect(url,{useNewUrlParser: true }).then(function(){
    item.find().then(function (items) {
        if (items.length == 0) {
            const buyFood = new item({
                name: "Buy food"
            })
            const Cook = new item({
                name: "Cook"
            })
            const Eat = new item({
                name: "Eat"
            })
            item.insertMany([buyFood, Cook, Eat]).then(function () { console.log("inserted intial elements") }).catch(
                function (err) { console.log(err) }
            );
        }
    }).catch(function(err){console.log(err)})
});
// mongoose.set('bufferCommands', false);



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static('public'));
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Sense which is very common, common-sense"],
    }
})
const listSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        item: [itemSchema],
    }
)
const item = mongoose.model("Item", itemSchema);
const list = mongoose.model("List", listSchema);
let ite = [];
let lis = [];
 







app.get("/", function (req, res) {
    
    item.find().then(function (items) {
        ite = items;
        const today = day.date();
        res.render("list", { day: today, k: ite }
        );
    });





});

app.post("/", function (req, res) {
    const newitem = new item({ name: req.body.nextItem });
if(req.body.query){res.redirect("/"+req.body.query)}
    //  console.log(req.body.List+" "+day.date().split(",")[0]);
    if (req.body.List == day.date().split(",")[0] + ",") {
        item.create(newitem).then(function () { console.log("A item is added") }).catch(function (err) { console.log(err) });
        res.redirect("/");
    }
    else {
    if(newitem.name!=""){
        list.updateOne({ name: req.body.List }, {"$push":{item:newitem}} ).then(function(raw){console.log(raw)}).catch(function(err){
            console.log(err)
        });}
        res.redirect("/" + req.body.List);
    }

});
app.post("/delete", function (req, res) {
    const arr = req.body.checkbox.split(" ");
    
    if (arr[1] == day.date().split(",")[0] + ",") {
        item.deleteOne({ _id: arr[0] }).then(function () { console.log("Hurrah! You have cleared one item of your list!") }).catch(function (err) { console.log(err) })
        res.redirect("/");

    }
    else { 
        list.updateOne({name:arr[1]},{"$pull":{"item":{"_id":arr[0]}}}).then(function(){console.log("Hurrah! you cleared a task from lists!")}).catch(function(err){
            console.log(err);
        });
        res.redirect("/"+arr[1]);
    }

})

app.get("/:work", function (req, res) {
    // work.find().then(function(works){wor=works
    //     res.render("list",{day:"Work TO-DO", k: wor});
    // });


    var temp = _.kebabCase(req.params.work);

    const newlistItem = new list({
        name: temp,
        item: [],
    });

    list.findOne({ name: temp }).then(function (lists) {
        if (lists == null) { list.create(newlistItem).then(function () { console.log("A new list name searched") }).catch(function (err) { console.log(err) }) }
   else{lis=lists.item}
   res.render("list",{day:temp,k:lis});
   
    });

  
});







app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("server is up at port 3000");
});
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require('ejs');
const day = require(__dirname+"/days.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));
var items=["Buy food","Cook","Eat"];
var workItems=[];

app.get("/", function (req, res) {

    const today = day.date();
    res.render("list", { day: today, k: items }
    )


});

app.post("/", function(req,res){
     item = req.body.nextItem;
    //  console.log(req.body.List);
     if(req.body.List=="Work"){
        workItems.push(item);
        res.redirect("/work");
     }
     else{
     items.push(item);
    res.redirect("/");}
}); 

app.get("/work",function(req,res){
    res.render("list",{day:"Work TO-DO", k: workItems });
});







app.listen(process.env.PORT||3000, function (req, res) {
    console.log("server is up at port 3000");
});
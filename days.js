
module.exports = {
date:getDate, 
day:getDay,
}




function getDate(){

var option = {
    weekday: "long",
    day: "numeric",
    month: "long",
    // year: "numeric",
}
var today = new Date();

return today.toLocaleDateString("en-UK", option);
}

function getDay(){

    var option = {
        weekday: "long",
       
        // year: "numeric",
    }
    var today = new Date();
    
    return today.toLocaleDateString("en-UK", option);
    }
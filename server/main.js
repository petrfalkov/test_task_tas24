const express = require("express");
const exphbs  = require('express-handlebars');
const CronJob = require('cron').CronJob;
const updateChartsController = require('./controller/updateChartsController');
const path    = require('path');
const publicPath = path.join(__dirname, '../views');


//create express app
const app = express();

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Defining middleware to serve static files
app.use('/', express.static(publicPath));
app.use('/charts', express.static('charts'));

app.get("/", function(req, res){
    res.render("chart");
});

//update charts .csv files every day at 7 am Kiev time
new CronJob('0 7 * * *', function() {
    updateChartsController.updateChartsData(
        'phis_osoba', //filename
        'предпрениматель' //category of account user
    );
    updateChartsController.updateChartsData(
        'ur_osoba', //filename
        'юр лицо' //category of account user
    );
}, null, true, 'Europe/Kiev');

app.listen("3300", function(){
    console.log('Server up: http://localhost:3300');
});




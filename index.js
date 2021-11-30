// Imports
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// View Engine And Templates
app.set('view engine', 'pug');
app.set('views', './views');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo Connector
mongoose.connect('mongodb://localhost/cruddatabase');

// Model
var VehicleInventorySchema = mongoose.Schema({
    Vehicle_Name: String,
    Dealership: String,
    Dealership_Contact: Number,
    Demo_Included: String,
    Preowned: String,
    Delivery_Date: String,
    Vehicle_Units: Number,
    edit: Boolean,
});


// Model Object
var VehicleDet = mongoose.model("VehicleDet", VehicleInventorySchema);


// Read
app.get('/', function(req, res){
    VehicleDet.find(function(err, response){
        res.render('index', {vehicles: response});
    }); 
});

app.post('/create', function(req, res){
    var VehicleInfo = req.body;
    
    if(!VehicleInfo.Vehicle_Name || !VehicleInfo.Dealership || !VehicleInfo.Dealership_Contact || !VehicleInfo.Demo_Included || !VehicleInfo.Preowned || !VehicleInfo.Delivery_Date || !VehicleInfo.Vehicle_Units){
       res.render('show_message', {
          message: "Invalid Input Please Try Again", type: "error"});
    }else {
       var NewVehicle = new VehicleDet({
        Vehicle_Name: VehicleInfo.Vehicle_Name,
        Dealership: VehicleInfo.Dealership,
        Dealership_Contact: parseInt(VehicleInfo.Dealership_Contact),
        Demo_Included: VehicleInfo.Demo_Included,
        Preowned: VehicleInfo.Preowned,
        Delivery_Date: VehicleInfo.Delivery_Date,
        Vehicle_Units: parseInt(VehicleInfo.Vehicle_Units),
        edit: false,
      });
         
       NewVehicle.save(function(err, VehicleDet){
          if(err)
             res.render('show_message', {message: "Database error", type: "error"});
          else{
              res.redirect('/');
          }      
       });
    }
});


// Update
app.get('/update/:id', function(req, res){
    VehicleDet.findById(req.params.id, function(err, response){
        response.edit = true;
        VehicleDet.findByIdAndUpdate(req.params.id, response, 
            function(err, response){
                res.redirect('/')
        });
    });
});

app.post('/update/:id', function(req, res){
    var editData = req.body
    editData.edit = false;
    VehicleDet.findByIdAndUpdate(req.params.id, editData, function(err, response){
        res.redirect('/')
    });
});

// Delete
app.get('/delete/:id', function(req, res){
    VehicleDet.findByIdAndRemove(req.params.id, function(err, response){
        res.redirect('/')
    });
});

// Port
app.listen(3000);
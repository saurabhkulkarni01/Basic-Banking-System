//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { toNumber } = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-saurabh:EuaRWyzCv37f6sV2@cluster0.vxucd.mongodb.net/bank", {useNewUrlParser: true});


const TransferSchema = new mongoose.Schema({
    fromCust: String ,
    toCust: String ,
    Ammount : Number,
    DateAndTime : String
  });
  const CustomerSchema = new mongoose.Schema({
    Name: String ,
    Email : String ,
    CMoney : Number
  });


const Customer=mongoose.model('Customer',CustomerSchema);
const Transaction=mongoose.model('Transaction',TransferSchema);


const customerss = [
    {
        Name: 'saurabh',
        Email: 'saurabh123@gmail.com',
        CMoney: 100000
    },
    {
        Name: 'soumya',
        Email: 'soumyaIAS@gmail.com',
        CMoney: 100000
    },
    {
        Name: 'Abhisht',
        Email: 'Ticktocker@gmail.com',
        CMoney: 100000
    },
    {
        Name: 'Harshit',
        Email: 'MachauBhaiyya@yahoo.com',
        CMoney: 100000
    },
    {
        Name: 'durgadas',
        Email: 'DD@gmail.com',
        CMoney: 100000
    },
    {
        Name: 'Mann',
        Email: 'Mann@yahoo.com',
        CMoney: 1000000
    },
    {
        Name: 'Prakhar',
        Email: 'Prakhar@gmail.com',
        CMoney: 100000
    },
    {
        Name: 'Shubham',
        Email: 'YeahShubham@yahoo.com',
        CMoney: 100000
    },
    {
        Name: 'Subhajit',
        Email: 'Stalker@gmail.com',
        CMoney: 100000
	},
    {
        Name: 'Hare Krishna',
        Email: 'HK@gmail.com',
        CMoney: 100000
	}
]


  /*Customer.deleteMany({}).then(function(){
    console.log("deleted")
    }).catch(function(error){

     });
    Transaction.deleteMany({}).then(function(){
        console.log("deleted")
        }).catch(function(error){
    
         });
         */

         Customer.find({},function(err,clntItem){
            console.log(clntItem.length);
            if(clntItem.length === 0){
                Customer.insertMany(customerss).then(function(){
                    console.log("Data inserted")  // Success
                }).catch(function(error){
                    console.log(error)      // Failure
                });
            
            }
        })

 
    
    



app.get("/",function(req,res){
    res.render("home");
    
});


app.get("/transaction", function(req, res){

    Transaction.find({}, function(err, transactions){
      res.render("transaction", {
        transactions:transactions
        });
    });
  });

  app.get("/customers", function(req, res){
   
     

    Customer.find({}, function(err, customers){
       ///// console.log(customers.length);
      res.render('customers.ejs', {
        customers:customers
        });
    });
  });

  app.get("/transfer", function(req, res){

    Customer.find({}, function(err, customers){
      res.render("transfer", {
        customers:customers
        });
    });
  });


 // app.get("/transfer1", function(req, res){

   // Customer.find({}, function(err, customers){
     // res.render("transfer1", {
      //  customers:customers
    //    });
  //  });
  //});




  app.post("/transfer" ,function(req,res){

    ///console.log(req.body);
   // const a=req.body.FromName;
   // const b=req.body.ToName;
    //const c=req.body.ammount;
    
  

    if(req.body.FromName===req.body.ToName)
    {
        res.render("fail");
        res.redirect("/");
    }
    Customer.findOne({Name:req.body.FromName}, function(err, clnt){
        if(err){
            console.log(err);
        }else{
            if(clnt.CMoney >= req.body.ammount){
               
                updateAmount(clnt.CMoney-req.body.ammount);
                Customer.findOne({Name:req.body.ToName}, function(errr, clint){
                    if(errr){
                        console.log(errr);
                    }else{
                       
                            updateamount( toNumber(clint.CMoney)+ toNumber(req.body.ammount) );
                           
                        
                    }
                    ////console.log(clnt.CMoney-req.body.ammount);
                })
                var currentdate = new Date(); 
                var datetime =  currentdate.getDate() + "/"
                                + (currentdate.getMonth()+1)  + "/" 
                                + currentdate.getFullYear() + "  "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();
            
                let newtrans=[{
                    fromCust: req.body.FromName,
                    toCust: req.body.ToName,
                    Ammount: req.body.ammount,
                    DateAndTime: datetime
                }]
                Transaction.insertMany(newtrans).then(function(){
                    console.log("Data inserted")  // Success
                }).catch(function(error){
                    console.log(error)      // Failure
                });
            
                
            
                 res.render("sucess")
            
              
               
            }
            else{
                res.render("fail");
            }
        }
        //////console.log(clnt.CMoney-req.body.ammount);
    })
   


    function updateAmount(final){
        Customer.findOneAndUpdate({Name:req.body.FromName}, {CMoney: final}, function(err){
            if(err){
                console.log(err);
            }
        });
        
    }
    function updateamount(final){
        Customer.findOneAndUpdate({Name:req.body.ToName}, {CMoney: final}, function(err){
            if(err){
                console.log(err);
            }
        });
        
    }

   

  });





  app.listen( process.env.PORT || 8080, function(){
    console.log("Server started on port 3000.");
  });
  

  





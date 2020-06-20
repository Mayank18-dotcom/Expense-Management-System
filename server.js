var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect("mongodb://localhost/expenses", { useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var Schema = mongoose.Schema;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var newSchema = new Schema({
    date: String,
    name: String,
    amount: Number
})

var User = mongoose.model("User",newSchema);

app.get('/',(req,res)=>{
    User.find({},(err,result)=>{
        if(err) res.json(err)
        else{
            res.render("index");
        }
    })
})
/**************************************************************************** */
app.get('/dates',(req,res)=>{
    User.find({}).distinct('date',(err,result)=>{
        if(err) res.json(err)
        else{
            res.render("dates",{users:result});
        }
    })
})


app.get('/newexpense',(req,res)=>{
    User.find({},(err,result)=>{
        if(err) res.json(err)
        else{
            res.render("newexpense");
        }
    })
})

app.post('/addnew',(req,res)=>{
    User.create(req.body.user,(err,result)=>{ 
        if(err) res.json(err)
        else{
            res.redirect('/dates');
        }
    })
})

/**************************************************************************** */

app.get('/dates/:date',(req,res)=>{
    const d = req.params.date;
    User.find({date:req.params.date},(err,result)=>{
        if(err){
            res.json(err);
        }
        else if (result==0)
        {
            res.redirect('/dates');
        }
        else{
            res.render("expenses",{users:result});
        }
    })
})

app.post('/addnewexpense',(req,res)=>{
    User.create(req.body.user,(err,result)=>{ 
        if(err) res.json(err)
        else{
            res.redirect('back');
        }
    })
})

app.get('/newexpense',(req,res)=>{
    User.find({},(err,result)=>{
        if(err) res.json(err)
        else{
            res.render("newexpense");
        }
    })
})

app.get('/expenses/edit/:id',(req,res)=>{
    User.find({_id:req.params.id},(err,result)=>{
        if(err){
            res.json(err);
        }
        else{
            res.render("edit",{users:result});
        }
    })
})

app.post('/expenses/edits/:id',(req,res)=>{
    const date = req.params.date;
    User.findOneAndUpdate({_id: req.params.id},req.body.user,(err,result)=>{
        if (err) return res.json(err);
        else{
            res.redirect('/dates');
        }
    })
})

app.get('/expenses/delete/:id',(req, res) => {
    User.findOneAndDelete({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.redirect('back');
    });
});

var port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`Listening at port ${port}`)});
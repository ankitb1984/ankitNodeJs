var express = require("express");
var bp = require("body-parser");
var _ = require("underscore");
var MongoClient = require("mongodb").MongoClient;
var app=express();
app.use(bp.json());

app.use(express.static("public"));

var tasks = [];
var taskid=0;
var db;

MongoClient.connect("mongodb://admin:admin@ds111178.mlab.com:11178/ankdb", (error, database) => {
	if(error) return console.log(error);
	db = database;
});


app.listen(3000, function(){
	console.log("App is running on port 3000");
});

app.get("/alltasks", function (req, res) {
		res.json(tasks);
	});
app.post("/postmytask", function (req, res) {
		/*var data = req.body;
		data.id=taskid++;
		tasks.push(data);
		res.json(data);*/
		db.collection("userdb").save(req.body, (err, result)=>{
			if(err) return console.log(err);
			else res.send("Data saved successfully.");
		});
	});
/*app.get("/alltasks/:id", function (req, res) {
		var todoId=parseInt(req.params.id,10);
		var matchedTodo=_.findWhere(tasks,{id:todoId});
		/*tasks.forEach(function(todo){
			if(todoId===todo.id){
				matchedTodo = todo;
			}
		});
		if(matchedTodo){
			res.json(matchedTodo);
		}else{
			res.status(404).send();
		}
	});*/
	
app.delete("/deletetask/:id", function (req, res) {
		var todoId=parseInt(req.params.id,10);
		var matchedTodo=_.findWhere(tasks,{id:todoId});

		if(matchedTodo){
			tasks = _.without(tasks, matchedTodo);
			res.json(tasks);
		}else{
			res.status(404).send();
		}
	});
	
app.delete("/deletetask", function (req, res) {
		db.collection("userdb").findOneAndDelete({desc: req.body.desc}, (err, result)=>{
			if(err) return res.send(500, err);
			res.send("Data deleted successfully.");
		}); 
	});
	
app.put("/updatetask", function (req, res) {
		db.collection("userdb").findOneAndUpdate(
		{desc: req.body.desc}, 
		{
			$set: {
				desc : req.body.desc,
				comp : req.body.comp					
			}
		},
		{
			sort: {_id: -1},
			upsert: true
		},
		(err, result)=>{
			if(err) return res.send(err);
			res.send(result);
		});
	});
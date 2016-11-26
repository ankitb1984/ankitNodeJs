var express = require("express");
var bp = require("body-parser");
var _ = require("underscore");
var app=express();
app.use(bp.json());

app.use(express.static("public"));

var tasks = [];
var taskid=0;


app.listen(3000, function(){
	console.log("App is running on port 3000");
});

app.get("/alltasks", function (req, res) {
		res.json(tasks);
	});
app.post("/postmytask", function (req, res) {
		var data = req.body;
		data.id=taskid++;
		tasks.push(data);
		res.json(data);
	});
app.get("/alltasks/:id", function (req, res) {
		var todoId=parseInt(req.params.id,10);
		var matchedTodo=_.findWhere(tasks,{id:todoId});
		/*tasks.forEach(function(todo){
			if(todoId===todo.id){
				matchedTodo = todo;
			}
		});*/
		if(matchedTodo){
			res.json(matchedTodo);
		}else{
			res.status(404).send();
		}
	});
	
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
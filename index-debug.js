/*
    =>Primary file for API
*/

//Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var  exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

//Declare the app
var app = {};

//initialization function
app.init = function(){
    //Start the servers
    debugger;
    server.init();
    debugger;

    //Start the workers
    debugger;
    workers.init();
    debugger;


    //Start the CLI, but make sure it starts last
    debugger;
    setTimeout(function(){
       cli.init(); 
       debugger;
    },50);
    debugger;

    // Set foo at 1
    debugger;
    var foo = 1;
    console.log("Just assigned 1 to foo");
    debugger;

    //Increment foo
    foo++;
    console.log("Just incremented foo")
    debugger;

    //Square foo
    foo = foo*foo;
    console.log("Just squared foo")
    debugger;

    //Convert foo to a string
    foo = foo.toString();
    console.log("Just converted foo to string")
    debugger;

    //Call the init script that will throw a problem
    exampleDebuggingProblem.init();
    console.log("Just call the library");
    debugger;
};

//Execute
app.init();

//Export the app
module.exports = app;
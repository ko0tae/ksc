#!/usr/bin/env node

process.chdir(__dirname);

var spawnSync = require('child_process').spawnSync;
var inquirer = require('inquirer');

var debug = function(log) {
  if(false) {
    console.log(log);
  }
}

var getContexts = function() {
  cmdrun = spawnSync('kubectl', [ 'config', 'get-contexts' ]);
  return cmdrun.stdout.toString('utf-8');
}

var useContext  = function(name) {
  cmdrun = spawnSync('kubectl', [ 'config', 'use-context', name ]);
  console.log(cmdrun.stdout.toString('utf-8'));
  console.log(cmdrun.stderr.toString('utf-8'));
}

var out = getContexts();

debug(out);

var arr_out = out.split("\n");

for (var i = 0; i < arr_out.length; i++) {
  arr_out[i] = arr_out[i].replace(/\s\s+/g, " ");
  if(arr_out[i].startsWith(" ")) {
     arr_out[i] = "_" + arr_out[i];
  }
}

debug(arr_out);

arr_out.shift();

arr_out.pop();

debug(arr_out);

var message = "select context\n";
var contexts = [];
var current_context = "";

for (var i = 0; i < arr_out.length; i++) {
  var cols = arr_out[i].split(" ");
  if(cols[0] == "*") {
    contexts.push("* " + cols[1]);
    current_context = "* " + cols[1];
  } else {
    contexts.push("  " + cols[1]);
  }
}

var eol_str = "---------------------------- END OF LIST ----------------------------";

contexts.push(eol_str);

var questions = [
  {  type: 'list',
     name: 'context',
     message: message,
     default: current_context,
     pageSize: 16,
     loop: true,
     choices: contexts,
     filter: function (val) {
       return val;
     }
  }
];

inquirer.prompt(questions).then((answers) => {
  if(answers.context != eol_str) {
    useContext(answers.context.substr(2));
  }
});


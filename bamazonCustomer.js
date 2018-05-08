var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected!");
  loadTable();
});

var loadTable = function() {
  connection.query("SELECT * FROM products", function(err, res){
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id+" || "+res[i].product_name+" || "+
      res[i].department_name+" || "+res[i].price+" || "+res[i].
      stock_quantity+"\n");
    }
  customerInput();
  })
}

var customerInput = function() {
  inquirer.prompt([{
    type: 'input',
    name: 'choice',
    message: "What item would you like to buy?"
  }]).then(function(answer){
    var correct = false;
    connection.query("SELECT * FROM products", function(err, res){
    for (var i = 0; i < res.length; i++) {
      if (answer.choice===res[i].product_name){
        correct=true;
        var product = answer.choice;
        var id = i;
        inquirer.prompt({
          type: 'input',
          name: 'amount',
          message: "What quantity would you like to purchase?",
          validate: function(value){
            if (isNaN(value)==false){
              return true;
            } else {
                return false;
            }
          }
        }).then(function(answer){
          if((res[id].stock_quantity-answer.amount)>0){
            connection.query("UPDATE products SET stock_quantity='"+(res[id].stock_quantity-
            answer.amount)+"' WHERE product_name= '"+ product +"'", function(err, res2) {
              console.log("Purchase successful!");
              loadTable();
            })
          } else {
            console.log("Not a valid item");
            customerInput(res);
          }
        })
      }
    }
  })
  })
}

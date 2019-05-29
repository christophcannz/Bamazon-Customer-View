var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localHost",
    user: "****",
    password: "****",
    database: "bamazon_db",
    port: 3306
});
connection.connect();

var display = function() {
    connection.query("SELECT * FROM products",function(err, res) {
        if (err) throw err;
        console.log("---------------------------");
        console.log("    WELCOME to BAMAZON   ");
        console.log("---------------------------");
        console.log("");
        console.log("Find your product below");
        console.log("");
var chart = new Table({
        head: ['Product ID', 'Product Description', 'Cost'],
        colWidths: [12, 50, 8],
        colAlign: ["center", "left", "right"],
        style: {
            head: ("aqua"),
            compact: true
        }
    });
    for (var i = 0; i < res.length; i++) {
        chart.push ([res[i].id, res[i].products_name, res[i].price]);
    }
    console.log(chart.toString());
    console.log("");
    shoppingCart(); //place a function/call here------------
    });
    
};

var shoppingCart = function() {
    inquirer.prompt({
        name: "productForPurchase",
        type: "input",
        message: "Enter the product ID to select your desired item."
    }).then(function(responseOne) {
//==========DB QUERY===================================
        var selection = responseOne.productForPurchase;
        connection.query("SELECT * FROM products WHERE Id=?", selection, function(err, res) {
//==========PRODUCT INVENTORY==========================

            if (err) throw err;
            if (res.length ===0) {
                console.log("ERROR: Product not available, please make another selection.");

                shoppingCart("Product added!");
            } else {
                inquirer.prompt({
                    name:"quantity",
                    type: "input",
                    message: "Now, enter the quantity."
                }).then(function(responseTwo){

                    var quantity = responseTwo.quantity;
                    if (quantity > res[0].stock_quantity) {
                        console.log("Alert! Inventory is getting low! There are " + res[0].stock_quantity + " items left.")
                        shoppingCart();
                    } else {
                        console.log("We have enough product!");
                        console.log(res[0].product_name + " purchased");
                        console.log(quantity + " qty @ $" + res[0].price);

                        var newItemQuantity = res[0].stock_quantity - quantity;
                        // UPDATE products SET stock_quantity=stock_quantity+2 WHERE id=1
                        var querystring = `UPDATE products SET stock_quantity=newItemQuantity WHERE id=res[0].id`;
                        connection.query(querystring, function (err, resUpdate) {
                            if (err) throw err;
                            console.log("");
                            console.log("Order Processed.");
                            console.log("Thank you for your order!");
                            console.log("");
                            connection.end();
                        });
                    }
                });
            }
        })
    })
}


display();

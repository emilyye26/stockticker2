var http = require('http');
var url = require('url');
var qs = require('querystring');

var port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb+srv://emilyye526:May262004@product.5iv2qax.mongodb.net/?retryWrites=true&w=majority&appName=product';

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    urlObj = url.parse(req.url,true)
    path = urlObj.pathname;

    if (path == "/")
    {
        // Creates HTML form and writes to page
        s = "<form action = '/process' method = 'GET'><br/>" + 
            "<label>Search:" + "</label>" + 
            "<input type='text' name='name'> <br/>" +
            "<input type='radio' id='company' name='type' value='companyName'/>" + "<label for='company'>Company Name" + "</label>" +
            "<input type='radio' id='ticker' name='type' value='tickerName'/>" + 
            "<label for='ticker'>Ticker" + "</label><br/>" + 
            "<input type= 'submit'>" + 
            "</form>";
        res.write(s);
    }
    else if (path == "/process") {
        // Gets name and query type from the URL 
        var qName = url.parse(req.url, true).query.name;
        var qType = url.parse(req.url, true).query.type;
        
        // Connects to Mongo client
        MongoClient.connect(mongoUrl, function(err, db) {
            if(err) { 
                console.log("Connection err: " + err); return; 
            }
            
            // Accesses database and collection
            var dbo = db.db("Stock");
            var coll = dbo.collection('PublicCompanies');

            // Creates query based on if the user chose to search by name or ticker
            if (qType == 'tickerName') {
                theQuery = {ticker: qName}
                result = coll.find(theQuery)
            } else if (qType == "companyName") {
                theQuery = {companyName: qName}
                result = coll.find(theQuery)
            }
            
            result.toArray(function(err, items) {
                if (err) {
                  console.log("Error: " + err);
                } 
                else 
                {
                // Iterates through results, logging and printing company info
                  for (i=0; i<items.length; i++){
                      console.log( "Company Name: " + items[i].companyName);console.log("Ticker: " + items[i].ticker);
                      console.log("Price: " + items[i].price);
                      res.write("<p>Company Name: " + items[i].companyName + "</p>");
                      res.write("<p>Ticker: " + items[i].ticker + "</p>");
                      res.write("<p>Price: " + items[i].price + "</p>");
                  }
                }   
                db.close();
              });

              //end find		
        }); 

    }
    res.end();
}).listen(port);




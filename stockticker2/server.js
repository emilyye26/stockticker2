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
        res.write("Processing..<br/>");
        var qName = url.parse(req.url, true).query.name;
        var qType = url.parse(req.url, true).query.type;
        // res.write(qType);
        MongoClient.connect(mongoUrl, function(err, db) {
            if(err) { 
                console.log("Connection err: " + err); return; 
            }
            
            var dbo = db.db("Stock");
            var coll = dbo.collection('PublicCompanies');
            res.write(qType);
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
                  console.log("Items: ");
                  for (i=0; i<items.length; i++){
                      console.log( "Company Name: " + items[i].companyName);console.log("Ticker: " + items[i].ticker);
                      console.log("Price: " + items[i].price);
                  }
                }   
                db.close();
              });

              //end find		
        }); 

    }
}).listen(port);


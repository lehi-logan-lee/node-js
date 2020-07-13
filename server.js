// import the required packages 

var express = require('express'); 
var path = require('path'); 
var app = express();
var bodyParser = require('body-parser');
const router = express.Router();
const PORT = process.env.PORT || 3000
var paypal = require('paypal-rest-sdk');


// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AbGpOTAxk-_7QAP9fKYd0Kn3K6jQ0LtoRmk8ToBsePuEFefSrPCrJbdj5-jlmshoIW-xr6zbKvStsR_F', // please provide your client id here 
  'client_secret': 'EDq2UStlRZwxqLUX_8m0_YLb6p1Gum-M1mUW5VFnOfMpjt8zc18r8tNbua9NExllgE1mCxkztRhMLhCC' // provide your client secret here 
});

// Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://tevopxwhcwduwg:f254c7d0fb01cf6e23486b3c422daf0df104d45b9e3f60120b769e8b0991649f@ec2-34-194-198-176.compute-1.amazonaws.com:5432/dd9mfcmbfunsru?ssl=true";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

app.set('port', (process.env.PORT || 3000));

// set public directory to serve static html files 
app.use('/', express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

// This says that we want the function "getPerson" below to handle
// any requests that come to the /getPerson endpoint
app.get('/getPerson', getPerson);

router.post('/balance',function(req,res){
	res.sendFile(path.join(__dirname+'/exchange.html'));
  });

// End point for exchange
app.post('/balance', (req, res) => {
  const weight = +req.body.weight
  const type = req.body.type
const obj = { weight: weight, type: type, result: calculateRate(weight, type) }

  res.render('pages/balance', obj)
})

app.use('/', router);

// redirect to store when user hits http://localhost:3000
app.get('/' , (req , res) => {
    res.redirect('/index.html'); 
})

// start payment process 
app.get('/buy' , ( req , res ) => {
	// create payment object 
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		"return_url": "https://fast-thicket-49899.herokuapp.com/success",
		"cancel_url": "https://fast-thicket-49899.herokuapp.com/err"
	},
	"transactions": [{
		"amount": {
			"total": 1.00,
			"currency": "USD"
		},
		"description": " a book on mean stack "
	}]
    }
	
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect('/err');
        });
}); 


// success page 
app.get('/success' , (req ,res ) => {
    console.log(req.query); 
    res.redirect('/success.html'); 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.redirect('/err.html'); 
})

//404 not found
app.get('*', function(req, res){
  res.status(404).send('404, page not found.');
});

// Start the server running, app listens on 3000 port 
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// helper functions 
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}

// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getPerson(request, response) {
	// First get the person's id
	const id = request.query.id;

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
            const person = result[0];
            var my_obj = JSON.stringify(person);
            var fir = JSON.parse(my_obj);
            var firstName = fir.first;
            var lastName = fir.last;
            var money = fir.balance;

            const obj = { first: firstName, last: lastName, money: money, id: id }

            response.render('pages/getPerson', obj)
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getPersonFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT id, first, last, balance FROM person WHERE id = $1::int";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFromDb

function calculateRate(weight, type) {
    //const baseValue = 0;
    let rate = 1;
      switch(type) {
        case 'USD':
          rate = 1.00;
          break
        case 'EUR':
            rate = 0.88;
          break
        case 'CNY':
            rate = 7.00;
          break
        case 'JPY':
            rate = 107.36;
          break
      }

      return (rate * weight).toFixed(2);
  }
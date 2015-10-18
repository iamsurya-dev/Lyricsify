var express = require('express');
var mysql     =    require('mysql');
var MsTranslator = require('mstranslator');
var app = express();
var inputText="The snow glows white on the mountain tonight. Not a footprint to be seen. A kingdom of isolation,. And it looks like I'm the queen.. The wind is howling like this swirling storm inside. Couldn't keep it in, heaven knows I tried!. Don't let them in, don't let them see. Be the good girl you always have to be. Conceal, don't feel, don't let them know. Well, now they know!. Let it go, let it go. Can't hold it back anymore. Let it go, let it go. Turn away and slam the door!. I don't care. What they're going to say. Let the storm rage on,. The cold never bothered me anyway!. It's funny how some distance. Makes everything seem small. And the fears that once controlled me. Can't get to me at all!. It's time to see what I can do. To test the limits and break through. No right, no wrong, no rules for me I'm free!. Let it go, let it go. I am one with the wind and sky. Let it go, let it go. You'll never see me cry!. Here I stand. And here I'll stay. Let the storm rage on!. My power flurries through the air into the ground. My soul is spiraling in frozen fractals all around. And one thought crystallizes like an icy blast. I'm never going back,. The past is in the past!. Let it go, let it go. When I'll rise like the break of dawn. Let it go, let it go. That perfect girl is gone!. Here I stand. In the light of day. Let the storm rage on,. The cold never bothered me anyway!";
var fromLang='en';
var toLang='fr';

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'lyricsify',
    debug    :  false
});

app.use(express.static(__dirname + "/client"));


// Second parameter to constructor (true) indicates that
// the token should be auto-generated.
var client = new MsTranslator({
  client_id: "decodesongs"
  , client_secret: "anuItfIgvkl6FQ9oJ28flBPcUCvSSqmDMYwRry6FuyQ="
}, true);

var params = {
  text: inputText, 
  from: fromLang,
  to: toLang
};

client.getLanguagesForTranslate(function(err, data) {
  console.log("Data is :: ", data);
});

// Don't worry about access token, it will be auto-generated if needed.
client.translate(params, function(err, data) {
  console.log("Data is :: ", data);
});

function searchSongs(req,res) {
    
    pool.getConnection(function(err,connection) {
        if (err) {
			console.log("Error in connecting to the DB ::", err);		
          	connection.release();
          	res.json({"code" : 100, "status" : "Error in connection database"});
          	return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select NOW()",function(err,rows){
            connection.release();
            if(!err) {
            	console.log("response is :: ", rows);
                //res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

app.get("/call",function(req,res){-
        handle_database(req,res);
        
});


app.listen(3000);
console.log("server running on port 3000");
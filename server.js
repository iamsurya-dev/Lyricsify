var express = require('express');
var bodyParser = require('body-parser');
var mysql     =    require('mysql');
var MsTranslator = require('mstranslator');
var jsdiff = require('diff');
var lyrics = require('./musixmatch.js');
var app = express();
var inputText="!";
var fromLang='en';
var toLang='fr';

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'us-cdbr-azure-central-a.cloudapp.net',
    user     : 'bef241aac11ce2',
    password : process.env.MYSQLPASS,
    database : 'acsm_35d30e33720d211',
    debug    :  false
});

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({ extended: true }));


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
var langcodes=new Array();

/*
client.getLanguagesForTranslate(function(err, data) {
  console.log("Data is :: ", data," typeof:"+typeof(data)," len"+data.length);
  // for(i=0;i<data.length;i++)
  // {
  //   var str=data[i].replace('\r', '').replace('\n', '');
  //   langcodes.push(str);
  // }
  // console.log("data1:",langcodes);
});*/

var languageCodes = ['ar', 'bs-Latn', 'bg', 'ca', 'zh-CHS', 'zh-CHT', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'de', 'el', 'ht', 'he', 'hi', 'mww', 'hu', 'id', 'it', 'ja', 'tlh', 'tlh-Qaak', 'ko', 'lv', 'lt', 'ms', 'mt', 'yua', 'no', 'otq', 'fa', 'pl', 'pt', 'ro', 'ru', 'sr-Cyrl', 'sr-Latn', 'sk', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi', 'cy']
// Don't worry about access token, it will be auto-generated if needed.
// client.translate(params, function(err, data) {
//   console.log("Data is :: ", data);
// });


// client.getLanguageNames(params1,function(err,data){
//   console.log("Data is :: ", data);
// });

function translate(req,res)
{
  client.translate(params, function(err, data) {
  console.log("Data is :: ", data);
});
}

function languageNames(callback)
{
  client.getLanguageNames({locale:'en', languageCodes:languageCodes}, callback);
}

function handle_database(req,res) {
    
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
                res.json(rows);
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

app.post("/:artist/:title/:lang", function(req, res) {
  console.log("request :::: ", req.body);
   pool.getConnection(function(err,connection) {
        if (err) {
        	console.log("Error is ::", err);		
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query(
            "insert into userLyrics (songId, text, transLang) values ((select id from songs s where s.artist=? and s.title=?), ?, ?)",
            [req.params.artist, req.params.title, req.body.text, req.params.lang],
        function(err,rows){
            connection.release();
            if(!err) {
            	console.log("response is :: ", rows);
                res.json(rows);
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
});

app.get("/:artist/:title/:lang", function(req, res) {
    pool.getConnection(function(err,connection) {
        if (err) {
        	console.log("Error is ::", err);		
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        var getSong = function (artist, title, callbackFound, callbackMissing) {
            connection.query(
                "select id,origLang,artist,title from songs where artist=? and title=?;",
                [artist, title],
                function(err,rows) {
                    if (err || rows.length > 1) {
                        connection.release(); res.end(); return;
                    }
                    if (rows.length == 1) {
                        callbackFound(rows[0]);
                    } else {
                        callbackMissing();
                    }
                }
            );
        };
        
        var insertSong = function (artist, title, id, transLang) {
            lyrics.getLyricsById(id, function (origLyrics, origLang) {
                connection.query("insert into songs set ?", {artist: artist, title: title, origLang: origLang}, 
                function(err, result) {
                    if (err) { connection.release(); res.end(); return; }
                    var newSongId = result.insertId; 
                    connection.query("insert into lyrics set ?", 
                        {songId: newSongId, transLang: origLang, text: origLyrics}, function (err, result) {
                        if (err) { console.log("Error!!!!!!", err); connection.release(); res.end(); return; }
                        console.log("Result is ::: ", result);
                        finishSong(origLyrics, null, origLang, transLang, newSongId, artist, title);
                    });
                });
            });
        };
        
        var finishSong = function (origLyrics, transLyrics, origLang, transLang, songId, artist, title) {
            if (origLyrics === null) { connection.release(); res.end(); return; }
            if (transLyrics === null) {
                console.log("!!!!!", origLyrics, transLyrics, origLang, transLang, songId);
                client.translateArray({texts: origLyrics.split('\n'), from:origLang, to:transLang},
                function (err, dataArray) {
                    if (err) {connection.release(); res.end(); return; }
                    var data = "";
                    for (var i = 0; i < dataArray.length; i++) {
                        data += dataArray[i].TranslatedText + '\n';
                    }
                    connection.query("insert into lyrics set ?",
                        {songId:songId, transLang:transLang, text:data}, 
                        function (err, result) {
                        if (err) { connection.release(); res.end(); return; }

                        send(origLyrics, data, origLang, transLang, artist, title);
                    });
                });
            } else {
                send(origLyrics, transLyrics, origLang, transLang, artist, title);
            }
        };
        
        var send = function (origLyrics, transLyrics, origLang, transLang, artist, title) {
            connection.release();
            console.log("Return");
            res.json({origLyrics:origLyrics, transLyrics:transLyrics, origLang:origLang,
                      transLang:transLang, artist:artist, title:title});
            return;
        };
        
        getSong(req.params.artist, req.params.title, function (song) {
            // Get lyrics
            connection.query(
                "select text,transLang from lyrics l,songs s where s.artist=? and s.title=? and s.id=l.songId and (l.transLang=? or l.transLang=?)",
                [req.params.artist, req.params.title, song.origLang, req.params.lang],
                function (err, rows) {
                    if (err) { connection.release(); res.end(); return; }
                    console.log("lyrics is :: ", rows.length);
                    var origLyrics = null;
                    var transLyrics = null;
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].transLang == song.origLang) {
                           origLyrics = rows[i].text;
                        }
                        if (rows[i].transLang == req.params.lang) {
                            transLyrics = rows[i].text;
                        }
                    }
                    finishSong(origLyrics, transLyrics, song.origLang, req.params.lang, song.id, song.artist, song.title);
                }
            );
        }, function() {
            lyrics.getArtistTitleIdBySearch(req.params.artist, req.params.title, function(artist, title, id) {
                if (artist != req.params.artist || title != req.params.title) {
                    getSong(artist, title, function (song) {
                        connection.release();
                        res.redirect('/'+encodeURIComponent(artist)+'/'+encodeURIComponent(title)+
                                     '/'+encodeURIComponent(req.params.lang));
                    }, function () {
                        insertSong(artist, title, id, req.params.lang);
                    });
                } else {
                    insertSong(artist, title, id, req.params.lang);
                }
            });
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
});

app.get("/mod",function(req,res){-
  console.log("Inside moderator server");

  pool.getConnection(function(err,connection) {
      if (err) {
        console.log("Error is ::", err);    
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }   

      connection.query(
          "select L.songId, S.artist, S.title, S.origLang, L.transLang, L.text as 'oldText', UL.text as 'newText', " +
          "(select l1.text from lyrics l1 where l1.songID=S.id and l1.transLang=S.origLang) as origLangText " +
          "from songs S, lyrics L, userLyrics UL Where S.id = L.songId AND L.songId = UL.songId and L.transLang = UL.transLang",
          function(err,rows){
            //Not sure how callback works
            console.log("Rows is :: ", rows);
            res.json(rows);
            return;
          }
      );

      connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;     
      });
  });
        
});


app.post("/mod", function(req, res) {
    console.log("Inside mod post", req.body.songId);
    console.log("lang ::: ", req.body.lng);
    pool.getConnection(function(err,connection) {
      if (err) {
        console.log("Error is ::", err);    
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }   
      var qry = "update `lyrics` set `lyrics`.text = (select ul.text from userLyrics ul where ul.songId = " + req.body.songId + " and " +
          "ul.transLang = " + "'" + req.body.lng + "') where `lyrics`.songid = " + req.body.songId + " and `lyrics`.transLang = " + "'"+req.body.lng + "'";
      console.log("Query :: ", qry);
      connection.query(
          qry,
          function(err,rows){
            console.log("Erri :: ", err);
          }
      );
      connection.query(
          "delete from `userLyrics` where `userLyrics`.songid = ? and `userLyrics`.transLang = ?",
          [req.body.songId, req.body.lng],
          function(err,rows){
              res.json({"code" : 200, "status" : "Successfully authorized"});
          }
      );

      connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;     
      });
  });
});

app.get('/languages', function(req, res) {
    languageNames(function (err, data) { 
        //console.log(data.length, languageCodes.length, data, languageCodes);
        if (data.length != languageCodes.length) { res.end(); return; }
        var out = {};
        for (var i = 0; i < data.length; i++) {
            out[languageCodes[i]] = data[i];
        }
        res.json(out);
    });
});

app.listen(3000);
console.log("server running on port 3000");

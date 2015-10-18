$(function() {

var $lyricsList;  

	// Collects data from JSON
	function loadLyricsContent() {                   
	/*$.getJSON('data/lyrics.json')    
	.done( function(data){                    
	   lyricsList = data;                            
	}).fail( function() {  
		// fix here                    
	  $('#translatedlyrics').html('Sorry! We could not load the translated lyrics!');
	}); */

var $myObject = new Object();
$myObject.origLyrics = "John";
$myObject.origLang = "cat";
$myObject.transLyrics = "John";

	$lyricsList = $myObject;
	console.log("lyricslist",$lyricsList);
	}   
                   

	//SETUP
	var $main, $translationContent, $translate;
	$main = $('#main');
	$translationContent = $('#translation');
	$translate = $('#translate');

	$main.show();
	$translationContent.hide();
	$translate.on('click', function(e){
		e.preventDefault();  
		                               
		$.ajax({
		beforeSend: function(xhr) {                  
		  if (xhr.overrideMimeType) {       
		    xhr.overrideMimeType("application/json"); // json data
		  }
		}
		});
		loadLyricsContent();

		$('#translatedlyrics').html($lyricsList.transLyrics);
		$('#translatedlyrics').html($lyricsList.transLyrics);
		$translationContent.show();
	}); 


  	$translate.on('click', function(e){
  		e.preventDefault();
  		var songTitle = $('#inputSong').val(); // fix
  		var songArtist = $('#inputArtist').val();

  		$('#songTitle').html(songTitle + ' - ' + songArtist);
  	}); 
});
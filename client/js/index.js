$(function() {

var $lyricsList;  

	// Collects data from JSON
	function loadLyricsContent() {                   
	/*$.getJSON('data/lyrics.json')    
	.done( function(data){                    
	   $lyricsList = data;                            
	}).fail( function() {  
		// fix here                    
	  $('#translatedlyrics').html('Sorry! We could not load the translated lyrics!');
	}); */

var $myObject = new Object();
/*$myObject.origLyrics = "John";
$myObject.origLang = "cat";
$myObject.transLyrics = "John";*/

	$lyricsList = $myObject;
	console.log("lyricslist",$lyricsList);
	}   

	function addOptions(languages){
		console.log('language:', languages);
		$.each(languages, function(lang, language){
			var $select = $('#languagemenu');
			$select.append($('<option>', {
				value: lang,
				text: language
			}));
		});
	}

	function showResponse(response){
		console.log('showResponse:', response);

		var $originalLyrics = $('#originallyrics');
		$originalLyrics.text(response.origLyrics);

		var $translatedlyrics = $('#translatedlyrics');
		$translatedlyrics.text(response.transLyrics);
	}

	// get languages for options
	$.getJSON('/languages', addOptions);
                   
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
		$('#originallyrics').html($lyricsList.origLyrics);
		$translationContent.show();
	}); 


	// edit and display submit button
	$('#submittransl').hide();
	$('#edit').on('click', function(){
		$('#submittransl').show();
	})

  	$translate.on('click', function(e){
  		e.preventDefault();
  		var songTitle = $('#inputSong').val(); // fix
  		var songArtist = $('#inputArtist').val();
  		var songLanguage = $('#languagemenu').val();

  		$.getJSON('/'+encodeURIComponent(songTitle) + '/' + encodeURIComponent(songArtist) + '/' + encodeURIComponent(songLanguage), showResponse);


  		$('#songTitle').html(songTitle + ' - ' + songArtist);
  	}); 
});
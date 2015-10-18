$(function() {

	var times;                                     
	$.ajax({
	beforeSend: function(xhr) {                  
	  if (xhr.overrideMimeType) {       
	    xhr.overrideMimeType("application/json"); // json data
	  }
	}
	});

	// Collects data from JSON
	function loadLyricsContent() {                   
	$.getJSON('data/lyrics.json')      // collect JSON data
	.done( function(data){                    
	  times = data;                             
	}).fail( function() {  
		// fix here                    
	  $('#translatedlyrics').html('Sorry! We could not load the translated lyrics!');
	});
	}

  	loadLyricsContent();                         

	//SETUP
	var $searchContent, $searchForm, $lyricsContent;
	$search = $('#searchForm');
	$lyricsContent = $('#lyricscontent');
	$searchContent = $('#searchContent');

	// Shows Search Content Only
	$searchContent.show();
	$lyricsContent.hide();
	$searchForm.on('submit', function(e){
		e.preventDefault();  

		$('#lyricscontainer').remove();
		$lyricsContent.load();
	});
});
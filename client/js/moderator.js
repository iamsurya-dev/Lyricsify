$(function() {


var $songId;
var $transLanguage;


$(document).ready(function() {
    console.log('asasdasd');
    $.get('/mod',function(data){
      console.log("Data[0] is :: ", data[0]);
      $('#songTitle').html(data[0].title + ' - ' + data[0].artist);
      $('#origLanguage').html('Original Language - ' + data[0].origLang);
      $('#transLanguage').html('Translated Language - ' + data[0].transLang);
      $('#originallyrics').html(data[0].origLangText);

      var one = data[0].oldText;
      var other = data[0].newText;
      console.log("One :: ", one);
      console.log("Other :: ", other);
      $songId = data[0].songId;
      $transLanguage = data[0].transLang;
      var diff = JsDiff.diffWords(one, other);

      diff.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var color = part.added ? 'green' :
          part.removed ? 'red' : 'grey';
        var span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document
          .createTextNode(part.value));
        display.appendChild(span);
      });

     // $('#originallyrics').html(data[0].origLangText);


    });
});



$('#submitAuthorized').click(function() {
  console.log('asasdasd');
  $.post('/mod', {songId : $songId, lng: $transLanguage}, function(data){
    console.log("Data is :: ", data);
  });
   
});


});
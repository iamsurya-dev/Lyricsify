var one = 'beep boop';
var other = 'beep boob blah';

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


$(document).ready(function() {
    console.log('asasdasd');
    $.get('/mod',function(data){
      console.log("Data is :: ", data);
    });
});



$('#submitAuthorized').click(function() {
  console.log('asasdasd');
  $.post('/mod',function(data){
    console.log("Data is :: ", data);
  });
   
});
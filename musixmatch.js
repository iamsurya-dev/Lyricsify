var request = require('request');

// calls callback with lyrics and language
exports.getLyricsById = function(id, callback) {
	request('http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey='+
			encodeURIComponent('9e9f1dcbbea6cd330e6c65c7d4c3024c')+'&track_id='+encodeURIComponent(id),
		function (error, response, body) {
			if (!error & response.statusCode == 200) {
				var resp = JSON.parse(body);
				resp = resp.message.body.lyrics;
				callback(resp.lyrics_body + '\n' + resp.lyrics_copyright, resp.lyrics_language);
			}
		}
	);
};

// calls callback with artist, title, id
exports.getArtistTitleIdBySearch = function(artist, title, callback) {
	console.log("getArtistTitleIdBySearchArtist Artist :: ", artist);
	console.log("getArtistTitleIdBySearch title :: ", title);
	request('http://api.musixmatch.com/ws/1.1/matcher.track.get?apikey='+
			encodeURIComponent('9e9f1dcbbea6cd330e6c65c7d4c3024c')+
			'&q_artist='+encodeURIComponent(artist)+'&q_track='+encodeURIComponent(title)+
			'&f_has_lyrics=1',
		function (error, response, body) {
			if (!error & response.statusCode == 200) {
				var resp = JSON.parse(body);
				console.log("Search", artist, title, resp);
				resp = resp.message.body.track;
				callback(resp.artist_name, resp.track_name, resp.track_id);
			}
		}
	);
};

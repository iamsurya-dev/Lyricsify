var request = require('request');

// calls callback with lyrics and language
exports.getLyricsById = function(id, callback) {
	request('http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey='+
			encodeURIComponent(process.env.APIKEY)+'&track_id='+encodeURIComponent(id),
		function (error, response, body) {
			if (!error & response.statusCode == 200) {
				var resp = JSON.parse(body);
				resp = resp.message.body.lyrics;
				callback(resp.lyrics_body, resp.lyrics_language);
			}
		}
	);
};

// calls callback with artist, title, id
exports.getArtistTitleIdBySearch = function(artist, title) {
	request(''http://api.musixmatch.com/ws/1.1/matcher.track.get?apikey='+
			encodeURIComponent(process.env.APIKEY)+
			'&q_artist='+encodeURIComponent(artist)+'&q_track='+encodeURIComponent(title),
		function (error, response, body) {
			if (!error & response.statusCode == 200) {
				var resp = JSON.parse(body);
				resp = resp.message.body.track;
				callback(resp.artist_name, resp.track_name, resp.track_id)
			}
		}
	);
};

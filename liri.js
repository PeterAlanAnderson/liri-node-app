require("dotenv").config();

var keys = require("./keys.js")
var Spotify = require("node-spotify-api")
var Twitter = require("twitter")
var fs = require("file-system")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var typeInput = process.argv[2];
var itemInput = process.argv[3];

function eventSwitch(var1,var2){
    switch (var1){
        case "my-tweets":
            twitterPull();
            break;
        case "spotify-this-song":
            spotifyPull(var2);
            break;
        case "movie-this":
            omdbPull(var2);
            break;
        case "do-what-it-says":
            fileRead();
            break;
        default:
            invalidTypeInput();
            break;
    }
}

eventSwitch(typeInput,itemInput);


function twitterPull(){
	let params={screen_name:'HeteroSideBitch'};
	client.get('statuses/user_timeline.json?count=20',params,function(error,tweets,response){
		if(!error){
			for (let i=0;i<tweets.length;i++){
                console.log(tweets[i].text)
                console.log("_____________________________________________________________________")
                console.log("")
			};
		}
		else {
			console.log(error)
        }
        return;
	});

};

function spotifyPull(song){
	if (!song) {
		song = "The Sign Ace of Base";
    }
	spotify.search({ type: 'track', query: song }, function (err, data){
        let trackList = data.tracks.items
		for (i=0; i<trackList.length;i++){
			let artist = trackList[i].artists[i].name
			console.log("Artist: "+artist)
			console.log("Song Title: "+trackList[i].name)
			console.log("Preview URL: "+trackList[i].preview_url)
            console.log("Album: "+trackList[i].album.name)
            return;
		}
	});
};

function omdbPull(movie){
    let requestURL = 'http://www.omdbapi.com/?t='+movie+'&apikey=trilogy&y=&plot=short&tomatoes=true&r=json';
    let request = require("request")
    request(requestURL, function(error, response, body){
        if (!error&&response.statusCode===200){
            console.log("Title: " + JSON.parse(body).Title)
			console.log("Rating: " + JSON.parse(body).imdbRating)
			console.log("Released: " + JSON.parse(body).Released)
			console.log("Country of Production: " + JSON.parse(body).Country)
			console.log("Language: " + JSON.parse(body).Language)
			console.log("Plot Summary: " + JSON.parse(body).Plot)
			console.log("Starring: " + JSON.parse(body).Actors)
			console.log("Language: " + JSON.parse(body).Language)
            console.log("Website: " + JSON.parse(body).Website)
            return;
        }
    })
    if (!movie) {
		movie = "Mr.Nobody"
    }
    return;
}

function fileRead(){
    fs.readFile('random.txt', 'utf8', function(err,data){
        if(err) throw err;
        var varsArr = data.split(',')
        eventSwitch(varsArr[0],varsArr[1])
        return;
    })
    return;
}

function invalidTypeInput(){
    console.log("Your selection was invalid.")
    console.log("Please input one of the following:")
    console.log("my-tweets")
    console.log("spotify-this-song 'song title artist'")
    console.log("movie-this 'movie title'")
}






// // Include the request npm package (Don't forget to run "npm install request" in this folder first!)
// var request = require("request");

// // Then run a request to the OMDB API with the movie specified
// request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, body) {

//   // If the request is successful (i.e. if the response status code is 200)
//   if (!error && response.statusCode === 200) {

//     // Parse the body of the site and recover just the imdbRating
//     // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//     console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
//   }
// });

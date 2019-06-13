const Movies = require('../models/cinemas');
var Cinemas_Summary = require('../models/cinemas_summary');
var Book_Movie = require('../models/book_movie');
var moment = require('moment');
var pagination = require('../utils/pagination');
var search = require('../utils/search');
var request = require('request');
var sessionStorage = require('node-sessionstorage');
var uuidv4 = require('uuid/v4');
var User = require('../models/user');
const jwt = require("jsonwebtoken");
var opn = require('opn');

module.exports = {
    getAllv2: async(req, res, next) => {
        try{
            var availability = req.query.availability;
            var theater_name = req.query.theater_name;
            var top = (req.query.top == 'true');
            var limit = parseInt(req.query.limit);
            var start_id = req.query.start_id;
            var dateNow = new Date();
            var movieList = new Array();
            var movies = await getSchedules();

            movies.forEach(element => {
                    var _movie = new Movies({
                        item_type: 'v1-movies',
                        name: element.movie_details.title,
                        image_url: decodePoster(element.movie_details.poster),
                        writeup: element.movie_details.synopsis,
                        description: element.movie_details.synopsis,
                        trailer_url: element.movie_details.poster,
                        genre: getGenres(element.movie_genres),
                        mtrcb_rating: element.movie_details.rating,
                        thumbnail_url: decodePoster(element.movie_details.poster),
                        booking_url: "localhost:4200/schedules/" + element.screening_time[0].schedule_id + "/" + element.screening_time[0].id
                    })
                    movieList.push(_movie);
            });


            if(typeof start_id != "undefined" || !isNaN(limit))
            {
                var sorted_movies = top == true ? pagination.sortItemsWithFeatured(movieList) : movieList;
                var _movies = pagination.chunkArray(sorted_movies, limit);
                var movie_index = pagination.getItemChunkIndex(_movies, start_id);
                var next_id = pagination.getNextId(_movies, movie_index);
                var _data = _movies[movie_index];
                var data = [];
                
                for(var a = 0; a < _movies[movie_index].length; a++)
                {
                    var _movieSummary = {
                        "_id": _data[a]._id,
                        "item_type": _data[a].item_type,
                        "name":_data[a].name,
                        "writeup":_data[a].writeup,
                        "image_url": _data[a].thumbnail_url,
                        "booking_url": _data[a].booking_url
                    };
                    data.push(_movieSummary);
                }

                var movie_summary = {
                    "pagination": {
                        "next": next_id
                    },
                    "data": data
                };

                res.send(movie_summary);
            }
            else
                res.send(movieList);
        }
        catch(err){
            console.log(err);
            next(err);
        }
    },
    bookMovie: async(req, res, next) => {
        try{
            var screening_id = req.params.screening_id;
            var user = await getUser(req.headers.authorization);
            var guid = uuidv4();
            var bookMovie = new Book_Movie({
            status: "PENDING",
            user: user,
            guid: guid
            });
        
            var _bookMovie = await Book_Movie.create(bookMovie);

            //window.open('http://localhost:4200/schedules/' + screening_id + '/' + guid)
            //res.redirect('http://localhost:4200/schedules/' + screening_id + '/' + guid);
            var url = {
                url: 'http://localhost:4200/schedules/' + screening_id + '/' + guid
            }
            res.send(url);
        }
        catch(ex){
            next(ex);
        }
    }
}

async function getUser (request) {
    var token = jwt.verify(request.replace("Bearer ", ""), "secret");
    var _user = await User.findById(token.data._id);

    return _user;
  }

function getGenres(movie_genres){
    var genres = [];
    movie_genres.forEach(element => {
        genres.push(element.name);
    });
    return genres.toString();
}

function decodePoster(poster){
    var buf = new Buffer(poster, 'base64');
    return buf;
}

async function getSchedules(){
    // var session_id = sessionStorage.getItem("session_id");
    // if(session_id == null){
    //     await login();
    //     session_id = sessionStorage.getItem("session_id");
    // }
    return new Promise(function(resolve, reject){
        request({method: 'Get', 
            headers: {'Authorization' : 'o9TEPnqgaMIdL83bXKO4pN2HFkD0xBlJRmcjvZi6WVGutASsz5', 'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'},
            uri: 'http://114.108.254.186:6060/api/v2/schedules'}, 
            function(error, resp, body){
                if(resp.statusCode == 200){
                    var _body = JSON.parse(resp.body);
                    if(_body.message == "Invalid session token."){
                        login();
                    }   
                    else
                        resolve(JSON.parse(resp.body));
                  } else {
                    console.log('error: '+ resp.statusCode)
                    console.log(body)
                    reject(body);
                  }
            });
    })
}

async function login(){
    var body = {
        "data": {
           "email": "rockwelllist_mobile@rockwell.com",
           "password": "Rockwell123",
        }
     };
    return new Promise(function(resolve, reject){
        request({method: 'POST', 
            headers: {'Accept': '*/*', 'Content-Type': 'application/json; charset=utf-8'},
            uri: 'http://114.108.254.186:6060/api/v2/login', 
            body: body, json: true},
            function(error, resp, body){
                if(resp.statusCode == 200){
                    sessionStorage.setItem("session_id", resp.body.data.session_token);
                    resolve(resp.body);
                  } else {
                    console.log('error: '+ resp.statusCode)
                    console.log(body)
                    reject(body);
                  }
            });
    })
}



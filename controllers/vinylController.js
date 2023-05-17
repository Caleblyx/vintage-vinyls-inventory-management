const asyncHandler = require('express-async-handler');

const Vinyl = require("../models/vinyl");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.index = asyncHandler(async (res, req, next)  => {
    const [numVinyls, numArtists, numGenres, newReleases] = await Promise.all([
        Vinyl.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        Vinyl.find({}).sort({ release_date: -1 }).limit(5).exec(),
    ]);
    res.render("index", {
        title: "Vinyl Inventory",
        vinyl_number: numVinyls,
        artist_number: numArtists,
        genre_number: numGenres,
        new_releases: newReleases,
    })
})
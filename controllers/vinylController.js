const asyncHandler = require('express-async-handler');

const Vinyl = require("../models/vinyl");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.index = asyncHandler(async (res, req, next)  => {
    const [numVinyls, numArtists, numGenres, newReleases] = await Promise.all([
        Vinyl.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);
    res.render("index", {
        title: "Vintage Vinyls Inventory Manager",
        vinyl_number: numVinyls,
        artist_number: numArtists,
        genre_number: numGenres,
    })
})

exports.vinyl_list = asyncHandler(async (res, req, next ) => {
    res.send("Not implemented yet");
})

exports.vinyl_detail = asyncHandler(async (res, req, next) => {
    res.send("Not implemented yet");
})

exports.vinyl_create_get = asyncHandler(async (res, req, next ) => {
    res.send("Not implemented yet");
})

exports.vinyl_create_post = asyncHandler(async (res, req, next) => {
    res.send("Not implemented yet");
})

exports.vinyl_delete_get = asyncHandler(async (res, req, next ) => {
    res.send("Not implemented yet");
})

exports.vinyl_delete_post = asyncHandler(async (res, req, next) => {
    res.send("Not implemented yet");
})

exports.vinyl_update_get = asyncHandler(async (res, req, next ) => {
    res.send("Not implemented yet");
})

exports.vinyl_update_post = asyncHandler(async (res, req, next) => {
    res.send("Not implemented yet");
})

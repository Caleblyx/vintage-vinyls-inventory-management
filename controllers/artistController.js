const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

const Vinyl = require("../models/vinyl");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.artist_list = asyncHandler(async (req, res, next ) => {
    const allArtists = await Artist.find({}).exec();
    res.render("artist_list", {
        title: "All Artists",
        all_artists: allArtists
    })
})

exports.artist_detail = asyncHandler(async (req, res, next) => {
    const [artist, allVinyls] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Vinyl.find({ artist: req.params.id })
            .populate("artist")
            .sort({ title : 1 })
            .exec(),
    ])

    if (artist == null) {
        const err = new Error("Artist not found");
        err.status = 404;
        next(err);
    }

    res.render("artist_detail", {
        title: "Artist: ",
        artist: artist,
        all_vinyls: allVinyls,
    })
})

exports.artist_create_get = asyncHandler(async (req, res, next ) => {
    res.render("artist_form", {
        title: "Add Artist"
    })
})

exports.artist_create_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must not be empty")
        .isAlphanumeric('en-US', {ignore: ' '})
        .withMessage("Name contains invalid characters"),
    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1 })
        .escape()
        .withMessage("An invalid description was provided"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        const artist = new Artist({
            name: req.body.name,
            description: req.body.description
        })

        if (!errors.isEmpty()) {
            res.render("artist_form", {
                title: "Add Artist",
                artist: artist,
                errors: errors.array()
            })
            return
        } else {
            await artist.save();
            res.redirect(artist.url);
        }
    })
]

exports.artist_delete_get = asyncHandler(async (req, res, next ) => {
    const [artist, allVinyls] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Vinyl.find({ artist: req.params.id })
            .populate("artist")
            .sort({ title : 1 })
            .exec(),
    ])

    if (artist == null) {
        const err = new Error("Artist not found");
        err.status = 404;
        next(err);
    }

    res.render("artist_delete", {
        title: "Delete Artist",
        artist: artist,
        all_vinyls: allVinyls
    })
})

exports.artist_delete_post = asyncHandler(async (req, res, next) => {

    const [artist, allVinyls] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Vinyl.find({ artist: req.params.id })
            .populate("artist")
            .sort({ title : 1 })
            .exec(),
    ]);

    if (allVinyls.length > 0) {
        res.render("artist_delete", {
            title: "Delete Artist",
            artist: artist,
            all_vinyls: allVinyls
        })
        return;
    } else {
        await Artist.findByIdAndDelete(req.params.id);
        res.redirect("/catalog/artist");
    }

    res.send("Not implemented yet");
})

exports.artist_update_get = asyncHandler(async (req, res, next ) => {
    const artist = await Artist.findById(req.params.id).exec();

    if(artist === null) {
        res.redirect("/catalog/artist");
    }

    res.render("artist_form", {
        title: "Update Artist",
        artist: artist
    }) 
})

exports.artist_update_post = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must not be empty")
        .isAlphanumeric('en-US', {ignore: ' '})
        .withMessage("Name contains invalid characters"),
    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1 })
        .escape()
        .withMessage("An invalid description was provided"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        const artist = new Artist({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render("artist_form", {
                title: "Update Artist",
                artist: artist,
                errors: errors.array()
            })
            return
        } else {
            const artist = Artist.findByIdAndUpdate(req.params.id, artist, {});
            res.redirect(artist.url);
        }
    })
]

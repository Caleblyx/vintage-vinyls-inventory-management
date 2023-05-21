const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ('../public/images/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

let upload = multer({ storage: storage });

const Vinyl = require("../models/vinyl");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.index = asyncHandler(async (req, res, next)  => {
    const [numVinyls, numArtists, numGenres, newReleases] = await Promise.all([
        Vinyl.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);
    res.render("index", {
        title: "Welcome to Vintage Vinyls Inventory Manager",
        vinyl_number: numVinyls,
        artist_number: numArtists,
        genre_number: numGenres,
    })
})

exports.vinyl_list = asyncHandler(async (req, res, next ) => {
    const allVinyls = await Vinyl.find({})
        .sort({ title: 1 })
        .populate("artist")
        .populate("genre")
        .exec();
    res.render("vinyl_list", {
        title: "List of Vinyls",
        all_vinyls: allVinyls
    })
})

exports.vinyl_detail = asyncHandler(async (req, res, next) => {
    const vinyl = await Vinyl.findById(req.params.id)
        .populate("artist")
        .populate("genre")
        .exec();
    console.log(vinyl.album_release_date_formatted);
    res.render("vinyl_detail", {
        vinyl: vinyl
    })
})

exports.vinyl_create_get = asyncHandler(async (req, res, next ) => {
    const [allArtists, allGenres] = await Promise.all([
        Artist.find({}).exec(),
        Genre.find({}).exec(),
    ])

    res.render("vinyl_form", {
        title: "Add Vinyl to Inventory",
        artists: allArtists,
        genres: allGenres
    });
})

exports.vinyl_create_post = [
    
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") req.body.genre = []
            else req.body.genre = new Array(req.body.genre)
        }
        next();
    },
    upload.single('image'),
    body("title",  "Album title must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist",  "Album artist must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),
    body("album_release_date", "Invalid release date")
        .isISO8601()
        .toDate(),
    body("vinyl_release_date", "Invalid release date")
        .isISO8601()
        .toDate(),
    body("price", "Invalid price")
        .notEmpty()
        .isFloat({ min: 0 })
        .escape(),
    body("number_in_stock", "Invalid quantity")
        .notEmpty()
        .isInt({ min: 0 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const vinyl = new Vinyl({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            album_release_date: req.body.album_release_date,
            vinyl_release_date: req.body.vinyl_release_date,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            img : {
                data: fs.readFileSync(path.join('../public/images/' + req.file.filename)),
                contentType: 'image/png'
            }
        })

        if (!errors.isEmpty()){

            const[allArtists, allGenres] = await Promise.all([
              Artist.find().exec(),
              Genre.find().exec(),
            ]);
      
            for (const genre of allGenres) {
              if (vinyl.genre.indexOf(genre._id) > -1) {
                genre.checked = "true";
              }
            }
      
            res.render("vinyl_form", {
              title: "Add Vinyl to Inventory",
              artists: allArtists,
              genres: allGenres,
              vinyl: vinyl,
              errors: errors.array(),
            });
        } else {
            await vinyl.save();
            res.redirect(vinyl.url);
        }
    }
    
    )]

exports.vinyl_delete_get = asyncHandler(async (req, res, next ) => {
    const vinyl = await Vinyl.findById(req.params.id)
        .populate("artist")
        .populate("genre")
        .exec();
    if (vinyl === null) {
        res.redirect("/catalog/vinyl");
    }
    res.render("vinyl_delete", {
        title: "Delete Vinyl",
        vinyl: vinyl
    })
})

exports.vinyl_delete_post = asyncHandler(async (req, res, next) => {
    console.log("hello");
    await Vinyl.findByIdAndDelete(req.params.id);
    res.redirect("/catalog/vinyl");
})

exports.vinyl_update_get = asyncHandler(async (req, res, next ) => {
    const [vinyl, allArtists, allGenres] = await Promise.all([
        Vinyl.findById(req.params.id),
        Artist.find({}).exec(),
        Genre.find({}).exec(),
    ])

    if (vinyl === null) {
        const err = new Error("Vinyl not found")
        err.status = 404;
        return next(err);
    }

    for (const genre of allGenres) {
        if (vinyl.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
    }

    res.render("vinyl_form", {
        title: "Update Vinyl",
        vinyl: vinyl,
        artists: allArtists,
        genres: allGenres
    });
})

exports.vinyl_update_post = [
    
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === "undefined") req.body.genre = []
            else req.body.genre = new Array(req.body.genre)
        }
        next();
    },
    upload.single('image'),
    body("title",  "Album title must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist",  "Album artist must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),
    body("album_release_date", "Invalid release date")
        .isISO8601()
        .toDate(),
    body("vinyl_release_date", "Invalid release date")
        .isISO8601()
        .toDate(),
    body("price", "Invalid price")
        .notEmpty()
        .isFloat({ min: 0 })
        .escape(),
    body("number_in_stock", "Invalid quantity")
        .notEmpty()
        .isInt({ min: 0 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const vinyl = new Vinyl({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            album_release_date: req.body.album_release_date,
            vinyl_release_date: req.body.vinyl_release_date,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            img : req.file ? {
                data: fs.readFileSync(path.join('../public/images/' + req.file.filename)),
                contentType: 'image/png'
            } : {},
            _id: req.params.id
        })

        if (!errors.isEmpty()){

            const[allArtists, allGenres] = await Promise.all([
              Artist.find().exec(),
              Genre.find().exec(),
            ]);
      
            for (const genre of allGenres) {
              if (vinyl.genre.indexOf(genre._id) > -1) {
                genre.checked = "true";
              }
            }
      
            res.render("vinyl_form", {
              title: "Add Vinyl to Inventory",
              artists: allArtists,
              genres: allGenres,
              vinyl: vinyl,
              errors: errors.array(),
            });
        } else {
            const updatedVinyl = await Vinyl.findByIdAndUpdate(req.params.id, vinyl, {});
            res.redirect(updatedVinyl.url);
        }
    }
    )]

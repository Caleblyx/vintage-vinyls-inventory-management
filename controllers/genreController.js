const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

const Vinyl = require("../models/vinyl");
const Artist = require("../models/artist");
const Genre = require("../models/genre");

exports.genre_list = asyncHandler(async (req, res, next ) => {
    const allGenres = await Genre.find({}).sort({ name : 1 }).exec(); 
    res.render("genre_list", {
        title: "All Genres",
        all_genres: allGenres
    })
})

exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, allVinyls] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Vinyl.find({genre: req.params.id}).sort({ name: 1 }).populate("artist").exec()
    ])

    if (genre == null) {
        const err = new Error("Genre not found");
        err.status = 400;
        next(err);
    }
    res.render("genre_detail", {
        title: "Genre: ",
        genre: genre,
        all_vinyls: allVinyls
    })

})

exports.genre_create_get = asyncHandler(async (req, res, next ) => {
    res.render("genre_form", {
        title: "Add Genre"
    })
})

exports.genre_create_post = [
    body("name")
        .trim()
        .isLength( { min: 1 })
        .withMessage("Name must not be empty")
        .isAlpha('en-US', { ignore: ' ' })
        .withMessage("Name must contain alphabets only"),
    asyncHandler(async (req, res, next ) => {
        const errors = validationResult(req);
        const genre = new Genre({
            name: req.body.name
        })

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Add Genre",
                genre: genre,
                errors: errors.array()
            })
            return;
        } else {
            await genre.save();
            res.redirect(genre.url);
        }
})]


exports.genre_delete_get = asyncHandler(async (req, res, next ) => {
    const [genre, allVinyls] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Vinyl.find({genre: req.params.id}).sort({ name: 1 }).populate("artist").exec()
    ])

    if (genre == null) {
        const err = new Error("Genre not found");
        err.status = 400;
        next(err);
    }
    res.render("genre_delete", {
        title: "Delete Genre",
        genre: genre,
        all_vinyls: allVinyls
    })
})

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    const [genre, allVinyls] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Vinyl.find({genre: req.params.id}).sort({ name: 1 }).populate("artist").exec()
    ])

    if(allVinyls.length > 0) {
        res.render("genre_delete", {
            title: "Delete Genre",
            genre: genre,
            all_vinyls: allVinyls
        })
        return
    } else {
        await Genre.findByIdAndDelete(req.params.id);
        res.redirect("/catalog/genre");
    }
})

exports.genre_update_get = asyncHandler(async (req, res, next ) => {
    const genre = await Genre.findById(req.params.id).exec();
    if (genre === null) {
        res.redirect("/catalog/genre");
    } else {
        res.render("genre_form", {
            title: "Update Genre",
            genre: genre
        })
    }
})

exports.genre_update_post = [
    body("name")
        .trim()
        .isLength( { min: 1 })
        .withMessage("Name must not be empty")
        .isAlpha('en-US', { ignore: ' ' })
        .withMessage("Name must contain alphabets only"),
    asyncHandler(async (req, res, next ) => {
        const errors = validationResult(req);
        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Add Genre",
                genre: genre,
                errors: errors.array()
            })
            return;
        } else {
            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {})
            res.redirect(updatedGenre.url);
        }
})]

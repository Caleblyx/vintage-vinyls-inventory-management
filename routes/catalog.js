const  express = require('express');
const router = express.Router();
const vinylController = require('../controllers/vinylController');
const genreController = require('../controllers/genreController');
const artistController = require('../controllers/artistController');

router.get("/", vinylController.index);

// VINYL ROUTES

router.get("/vinyl/create", vinylController.vinyl_create_get);

router.post("/vinyl/create", vinylController.vinyl_create_post);

router.get("/vinyl/:id/delete", vinylController.vinyl_delete_get);

router.post("/vinyl/:id/delete", vinylController.vinyl_delete_post);

router.get("/vinyl/:id/update", vinylController.vinyl_update_get);

router.post("/vinyl/:id/update", vinylController.vinyl_update_post);

router.get("/vinyl/:id", vinylController.vinyl_detail);

router.get("/vinyl", vinylController.vinyl_list);

// GENRE ROUTES

router.get("/genre/create", genreController.genre_create_get);

router.post("/genre/create", genreController.genre_create_post);

router.get("/genre/:id/delete", genreController.genre_delete_get);

router.post("/genre/:id/delete", genreController.genre_delete_post);

router.get("/genre/:id/update", genreController.genre_update_get);

router.post("/genre/:id/update", genreController.genre_update_post);

router.get("/genre/:id", genreController.genre_detail);

router.get("/genre", genreController.genre_list);

// ARTIST ROUTES

router.get("/artist/create", artistController.artist_create_get);

router.post("/artist/create", artistController.artist_create_post);

router.get("/artist/:id/delete", artistController.artist_delete_get);

router.post("/artist/:id/delete", artistController.artist_delete_post);

router.get("/artist/:id/update", artistController.artist_update_get);

router.post("/artist/:id/update", artistController.artist_update_post);

router.get("/artist/:id", artistController.artist_detail);

router.get("/artist", artistController.artist_list);

module.exports = router;
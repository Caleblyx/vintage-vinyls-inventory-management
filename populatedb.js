#! /usr/bin/env node

console.log(
    'This script populates some test vinls, artists, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Vinyl = require("./models/vinyl");
  const Artist = require("./models/artist");
  const Genre = require("./models/genre");
  
  const genres = [];
  const artists = [];
  const vinyls = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createArtists();
    await createVinyls();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function genreCreate(name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres.push(genre);
    console.log(`Added genre: ${name}`);
  }
  
  async function artistCreate(name) {
    artistdetail = { name };
  
    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists.push(artist);
    console.log(`Added artist: ${name}`);
  }
  
  async function vinylCreate(
    title, 
    album_release_date, 
    vinyl_release_date, 
    price, 
    number_in_stock, 
    artist, 
    genre
    ) {
    vinyldetail = {
      title: title,
      album_release_date: album_release_date,
      vinyl_release_date: vinyl_release_date,
      price: price,
      number_in_stock: number_in_stock,
      artist: artist,
    };
    if (genre != false) vinyldetail.genre = genre;
  
    const vinyl = new Vinyl(vinyldetail);
    await vinyl.save();
    vinyls.push(vinyl);
    console.log(`Added vinyl: ${title}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate("Pop"),
      genreCreate("Rock"),
      genreCreate("Hip-Hop"),
      genreCreate("Blues"),
      genreCreate("Funk")
    ]);
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
      artistCreate("The Beatles"),
      artistCreate("Pink Floyd"),
      artistCreate("Michael Jackson"),
      artistCreate("B.B. King"),
      artistCreate("Kendrick Lamar"),
    ]);
  }
  
  async function createVinyls() {
    console.log("Adding Vinyls");
    await Promise.all([
      vinylCreate(
        "Abbey Road",
        "1969-09-26",
        "2019-09-27",
        48.00,
        15,
        artists[0],
        [genres[0], genres[1]]
      ),
      vinylCreate(
        "The Dark Side of the Moon",
        "1973-03-01",
        "2016-11-04",
        48.00,
        10,
        artists[1],
        [genres[1]]
      ),
      vinylCreate(
        "Thriller",
        "1982-11-29",
        "2022-11-01",
        60.00,
        17,
        artists[2],
        [genres[0], genres[1], genres[4]]
      ),
      vinylCreate(
        "Live at the Regal",
        "1965",
        "2015",
        90.00,
        5,
        artists[3],
        [genres[3]]
      ),
      vinylCreate(
        "To Pimp a Butterfly",
        "2015-03-15",
        "2015-03-15",
        60.00,
        11,
        artists[4],
        [genres[2]]
      ),
      vinylCreate(
        "Revolver",
        "1966-08-05",
        "2022-11-13",
        48.00,
        8,
        artists[0],
        [genres[0], genres[1]]
      ),
      vinylCreate(
        "Off The Wall",
        "1979-08-10",
        "2016-04",
        60.00,
        12,
        artists[2],
        [genres[0], genres[4]]
      ),
    ]);
  }
  
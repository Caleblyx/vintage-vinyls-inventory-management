const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String },
    img: {
        data: Buffer,
        contentType: String
    }
})


ArtistSchema.virtual("url").get(function() {
    return `/catalog/artist/${this._id}`;
});

module.exports = mongoose.model("Artist", ArtistSchema);
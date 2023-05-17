const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    description: { type: String },
})

ArtistSchema.virtual("name").get(function() {
    let fullname = ""
    if (this.first_name && this.family_name) {
        fullname = first_name + family_name;
    }
    return fullname;
});

ArtistSchema.virtual("url").get(function() {
    return `/catalog/author/${this._id}`;
});

module.exports = mongoose.Model("Artist", ArtistSchema);
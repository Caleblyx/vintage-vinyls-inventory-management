const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const VinylSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    album_release_date: { type: Date, required: true},
    vinyl_release_date: { type: Date, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    number_in_stock: { type: Schema.Types.Number, required: true },
    img: {
        data: Buffer,
        contentType: String
    }
})

VinylSchema.virtual("url").get(function(){
    return `/catalog/vinyl/${this._id}`;
});

VinylSchema.virtual("album_release_date_formatted").get(function(){
    return this.album_release_date 
        ? DateTime.fromJSDate(this.album_release_date).toLocaleString(DateTime.DATE_MED) : "";
});

VinylSchema.virtual("vinyl_release_date_formatted").get(function(){
    return this.vinyl_release_date 
        ? DateTime.fromJSDate(this.vinyl_release_date).toLocaleString(DateTime.DATE_MED) : "";
});

VinylSchema.virtual("album_release_date_form_formatted").get(function(){
    return this.album_release_date 
        ? DateTime.fromJSDate(this.album_release_date).toFormat("yyyy-MM-dd") : "";
});

VinylSchema.virtual("vinyl_release_date_form_formatted").get(function(){
    return this.vinyl_release_date 
        ? DateTime.fromJSDate(this.vinyl_release_date).toFormat("yyyy-MM-dd") : "";
});

VinylSchema.virtual("price_form_formatted").get(function() {
    return this.price.toString();
})

module.exports = mongoose.model("Vinyl", VinylSchema);
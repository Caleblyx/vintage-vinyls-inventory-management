const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const VinylSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, required: true },
    genre: { type: Schema.Types.ObjectId, required: true },
    album_release_date: { type: Date, required: true},
    vinyl_release_date: { type: Date, required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    number_in_stock: { type: Schema.Types.Number, required: true },
})

VinylSchema.virtual("url").get(function(){
    return `/catalog/album/${this._id}`;
});

VinylSchema.virtual("vinyl_release_date_formatted")(function(){
    return this.release_date 
        ? DateTime.fromJSDate(this.vinyl_release_date).toLocaleString(DateTime.DATE_MED) : "";
})

module.exports = mongoose.Model("Vinyl", VinylSchema);
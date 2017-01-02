/**
 * Created by mickv on 2/01/2017.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var watchedEpisodeSchema = new Schema(
    {
        userId: String,
        seriesId: Number,
        seasonId: Number,
        episodeId: Number,
        watched: Boolean
    }
);

module.exports = mongoose.model('watchedEpisode', watchedEpisodeSchema);
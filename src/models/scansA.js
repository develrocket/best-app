/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Schema
 */
var ScansASchema = new Schema({
    keyScan: {type: String, default: 0, unique: true},
    radius: {type: String, default: '[]'},
    bevelAngle: {type: String, default: '[]'},
    landThickness: {type: String, default: '[]'},
    halfBevelGap: {type: String, default: '[]'},
    wallThickness: {type: String, default: '[]'},
    data_key: {type: String, default: ''},
    is_deleted: {type: Boolean, default: 0},
    is_saved: {type: Boolean, default: 0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

ScansASchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model("ScansA", ScansASchema);

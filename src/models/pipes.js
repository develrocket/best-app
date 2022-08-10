/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Schema
 */
var PipesSchema = new Schema({
    keyPipe: {type: String, default: 0, unique: true},
    keyScanA: {type: String, default: ''},
    keyScanB: {type: String, default: ''},
    keyProject: {type: String, default: ''},
    pipeNumber: {type: String, default: ''},
    heatNumber: {type: String, default: ''},
    data_key: {type: String, default: ''},
    is_deleted: {type: Boolean, default: 0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

PipesSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model("Pipes", PipesSchema);

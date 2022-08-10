/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Schema
 */
var ManualFieldSchema = new Schema({
    keyPipe: {type: String, default: 0},
    fieldKey: {type: String, default: ''},
    fieldName: {type: String, default: ''},
    fieldValue: {type: String, default: ''},
    data_key: {type: String, default: ''},
    is_deleted: {type: Boolean, default: 0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

ManualFieldSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model("ManualFields", ManualFieldSchema);

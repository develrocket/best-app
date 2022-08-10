/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Schema
 */

var ProjectsSchema = new Schema({
    keyProject: {type: String, default: 0, unique: true},
    projectName: {type: String, default: ''},
    client: {type: String, default: ''},
    contractor: {type: String, default: ''},
    projectDesignation: {type: String, default: ''},
    weldProcedure: {type: String, default: ''},
    upperPipeDiameter: {type: Number, default: 0},
    lowerPipeDiameter: {type: Number, default: 0},
    nominalPipeDiameter: {type: Number, default: 0},
    nominalRadius: {type: Number, default: 0},
    upperRadius: {type: Number, default: 0},
    lowerRadius: {type: Number, default: 0},
    nominalRadiusExtension: {type: Number, default: 0},
    upperRadiusExtension: {type: Number, default: 0},
    lowerRadiusExtension: {type: Number, default: 0},
    nominalLandThickness: {type: Number, default: 0},
    upperLandThickness: {type: Number, default: 0},
    lowerLandThickness: {type: Number, default: 0},
    nominalBevelAngle: {type: Number, default: 0},
    upperBevelAngle: {type: Number, default: 0},
    lowerBevelAngle: {type: Number, default: 0},
    nominalHalfBevelGap: {type: Number, default: 0},
    upperHalfBevelGap: {type: Number, default: 0},
    lowerHalfBevelGap: {type: Number, default: 0},
    nominalWallThickness: {type: Number, default: 0},
    upperWallThickness: {type: Number, default: 0},
    lowerWallThickness: {type: Number, default: 0},
    nominalInternalPipeDiameter: {type: Number, default: 0},
    upperInternalPipeDiameter: {type: Number, default: 0},
    lowerInternalPipeDiameter: {type: Number, default: 0},
    nominalOutsidePipeDiameter: {type: Number, default: 0},
    upperOutsidePipeDiameter: {type: Number, default: 0},
    lowerOutsidePipeDiameter: {type: Number, default: 0},
    fieldUnits: {type: String, default:'mm'},
    pipeOptions: {type: String, default: '{}'},
    data_key: {type: String, default: ''},
    is_deleted: {type: Boolean, default: 0},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

ProjectsSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

module.exports = mongoose.model("Projects", ProjectsSchema);

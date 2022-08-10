/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";

var mongoose = require("mongoose");
var ScansB = mongoose.model("ScansB");
var common = require("../common");

function handleError(res, err) {
    return res.status(500).json(err);
}

exports.updateSave = function(req, res) {
    ScansB.findOne({keyScan: req.body.keyScan}, function(err, item) {
        if (err) return handleError(res, err);
        item.is_saved = 1;
        item.save(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json(item);
        });
    });
};

exports.list = function(req, res) {
    ScansB.findOne({keyScan: req.body.keyScan}, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.loadKeyScan = function(req, res) {
    ScansB.findOne({keyScan: req.body.keyScan}, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.add = function(req, res) {
    var data = req.body;
    data['data_key'] = common.guid();
    ScansB.create(data, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.all = function(req, res) {
    ScansB.find({is_deleted: 0}, function(err, items) {
        if (err) return handleError(res, err);
        return res.status(200).json(items);
    });
};







/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";

var mongoose = require("mongoose");
var Pipes = mongoose.model("Pipes");
var common = require("../common");

function handleError(res, err) {
    return res.status(500).json(err);
}

exports.save = function(req, res) {
    var data = req.body;
    data['data_key'] = common.guid();
    Pipes.create(data, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.loadByProject = function(req, res) {
    Pipes.find({keyProject: req.body.keyProject, is_deleted: 0}, function(err, items) {
        if (err) return handleError(res, err);
        return res.status(200).json(items);
    });
};

exports.loadByPipe = function(req, res) {
    Pipes.find({keyPipe: req.body.keyPipe}, function(err, items) {
        if (err) return handleError(res, err);
        return res.status(200).json(items);
    });
};




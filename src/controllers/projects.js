/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";

var mongoose = require("mongoose");
var Projects = mongoose.model("Projects");
var common = require("../common");

function handleError(res, err) {
    return res.status(500).json(err);
}

exports.list = function(req, res) {
    Projects.find({is_deleted: 0}, function(err, items) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(items);
    });
};

exports.updateField = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) {
            return handleError(res, err);
        }

        item[req.body.keyName] = req.body.value;
        item.save(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json(item);
        })
    });
};

exports.updateUnit = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) {
            return handleError(res, err);
        }

        item.fieldUnits = req.body.value;
        item.save(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json(item);
        });
    });
};

exports.loadUnit = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, 'fieldUnits', function(err, item) {
        if (err) return handleError(res, err);
        res.status(200).json(item);
    });
};

exports.add = function(req, res) {
    var data = req.body;
    data['data_key'] = common.guid();
    Projects.create(data, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.updatePipeOptions = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) return handleError(res, err);
        item.pipeOptions = req.body.pipeOptions;
        item.save(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json(item);
        });
    });
};

exports.loadPipeOptions = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, 'pipeOptions', function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    });
};

exports.updateName = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) return handleError(res, err);
        item.projectName = req.body.projectName;
        item.save(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json(item);
        });
    });
};

exports.loadFields = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) return handleError(res, err);
        return res.status(200).json(item);
    })
};

exports.delete = function(req, res) {
    Projects.findOne({keyProject: req.body.keyProject}, function(err, item) {
        if (err) return handleError(res, err);
        item.remove(function(err) {
            if (err) return handleError(res, err);
            return res.status(200).json({result: 'success'});
        });
    })
};

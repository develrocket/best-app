/**
 * Created by Administrator on 11/9/2016.
 */
"use strict";

var mongoose = require("mongoose");
var ManualFields = mongoose.model("ManualFields");
var common = require("../common");

function handleError(res, err) {
    return res.status(500).json(err);
}

exports.save = function(req, res) {
    var fields = req.body.data;
    var saveCount = 0;

    for (var i = 0; i < fields.length; i ++) {
        var newData = {
            keyPipe: req.body.keyPipe,
            fieldKey: fields[i].mKey,
            fieldName: fields[i].mValue,
            fieldValue: fields[i].mRValue,
            data_key: common.guid()
        };
        ManualFields.create(newData, function(err, item) {
            saveCount ++;
            if (err) return handleError(res, err);
            if (saveCount == fields.length) return res.status(200).json(item);
        });
    }

};

exports.loadByPipe = function(req, res) {
    ManualFields.find({keyPipe: req.body.keyPipe}, function(err, items) {
        if (err) return handleError(res, err);
        return res.status(200).json(items);
    });
};




/**
 * Created by Administrator on 11/9/2016.
 */
"use strict"

var projectController = require("../src/controllers/projects");
var pipeController = require("../src/controllers/pipes");
var scansAController = require("../src/controllers/scansA");
var scansBController = require("../src/controllers/scansB");
var manualFieldsController = require("../src/controllers/manualFields");

module.exports = function(app) {

    app.post("/api/pipe/save", pipeController.save);
    app.post("/api/pipe/list/project", pipeController.loadByProject);
    app.post("/api/pipe/list/pipe", pipeController.loadByPipe);

    app.post("/api/scansA/updateSave", scansAController.updateSave);
    app.post("/api/scansA/list", scansAController.list);
    app.post("/api/scansA/load/keyScan", scansAController.loadKeyScan);
    app.post("/api/scansA/add", scansAController.add);
    app.get("/api/scansA/load/list", scansAController.all);

    app.post("/api/scansB/updateSave", scansBController.updateSave);
    app.post("/api/scansB/list", scansBController.list);
    app.post("/api/scansB/load/keyScan", scansBController.loadKeyScan);
    app.post("/api/scansB/add", scansBController.add);
    app.get("/api/scansB/load/list", scansBController.all);

    app.get("/api/projects/list", projectController.list);
    app.post("/api/projects/update/field", projectController.updateField);
    app.post("/api/projects/update/unit", projectController.updateUnit);
    app.post("/api/projects/load/unit", projectController.loadUnit);
    app.post("/api/projects/add", projectController.add);
    app.post("/api/projects/update/options", projectController.updatePipeOptions);
    app.post("/api/projects/load/options", projectController.loadPipeOptions);
    app.post("/api/projects/update/name", projectController.updateName);
    app.post("/api/projects/load/fields", projectController.loadFields);
    app.post("/api/projects/delete", projectController.delete);

    app.post("/api/manualFields/add", manualFieldsController.save);
    app.post("/api/manualFields/list/pipe", manualFieldsController.loadByPipe);
};

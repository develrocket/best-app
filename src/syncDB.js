/**
 * Created by Administrator on 3/3/2017.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


//define db connections
var localDB = mongoose.createConnection("mongodb://localhost/best");
var remoteDB = mongoose.createConnection("mongodb://root:bestapp@ds157469.mlab.com:57469/best-test-app");


//define schemas
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

var ScansBSchema = new Schema({
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

ScansBSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});
ScansASchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

PipesSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

ProjectsSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});

ManualFieldSchema.pre("save", function(next) {
    this.updated = new Date();
    next();
});


localDB.projects = localDB.model('Projects', ProjectsSchema);
localDB.manualFields = localDB.model('ManualFields', ManualFieldSchema);
localDB.pipes = localDB.model('Pipes', PipesSchema);
localDB.scansA = localDB.model('ScansA', ScansASchema);
localDB.scansB = localDB.model('ScansB', ScansBSchema);

remoteDB.projects = remoteDB.model('Projects', ProjectsSchema);
remoteDB.manualFields = remoteDB.model('ManualFields', ManualFieldSchema);
remoteDB.pipes = remoteDB.model('Pipes', PipesSchema);
remoteDB.scansA = remoteDB.model('ScansA', ScansASchema);
remoteDB.scansB = remoteDB.model('ScansB', ScansBSchema);

function syncProjects() {

    var i, j;

    localDB.projects.find({}, function(err, localData) {

        if (err) {
            console.log('load-projects-list-err:', err);
            return;
        }
        if (localData.length == 0) return;

        remoteDB.projects.find({}, function(err, remoteData) {
            if (err) {
                console.log('load-remote-projects-list-err:', err);
                return;
            }

            for (i  = 0; i < localData.length; i ++) {
                var lData = localData[i];
                for (j = 0; j < remoteData.length; j ++) {
                    var rData = remoteData[j];
                    if (lData.data_key == rData.data_key) break;
                }

                if (j == remoteData.length) {
                    remoteDB.projects.create(lData, function(err, item) {});
                }
            }
        })
    });
}

function syncManualFields() {
    var i, j;

    localDB.pipes.find({}, function(err, localData) {

        if (err) {
            console.log('load-manualfields-list-err:', err);
            return;
        }
        if (localData.length == 0) return;

        remoteDB.pipes.find({}, function(err, remoteData) {
            if (err) {
                console.log('load-manualfields-projects-list-err:', err);
                return;
            }

            for (i  = 0; i < localData.length; i ++) {
                var lData = localData[i];
                for (j = 0; j < remoteData.length; j ++) {
                    var rData = remoteData[j];
                    if (lData.data_key == rData.data_key) break;
                }

                if (j == remoteData.length) {
                    remoteDB.pipes.create(lData, function(err, item) {});
                }
            }
        })
    });
}

function syncPipes() {
    var i, j;

    localDB.manualFields.find({}, function(err, localData) {

        if (err) {
            console.log('load-pipes-list-err:', err);
            return;
        }
        if (localData.length == 0) return;

        remoteDB.manualFields.find({}, function(err, remoteData) {
            if (err) {
                console.log('load-pipes-projects-list-err:', err);
                return;
            }

            for (i  = 0; i < localData.length; i ++) {
                var lData = localData[i];
                for (j = 0; j < remoteData.length; j ++) {
                    var rData = remoteData[j];
                    if (lData.data_key == rData.data_key) break;
                }

                if (j == remoteData.length) {
                    remoteDB.manualFields.create(lData, function(err, item) {});
                }
            }
        })
    });
}

function syncScansA() {
    var i, j;

    localDB.scansA.find({}, function(err, localData) {

        if (err) {
            console.log('load-scansA-list-err:', err);
            return;
        }
        if (localData.length == 0) return;

        remoteDB.scansA.find({}, function(err, remoteData) {
            if (err) {
                console.log('load-scansA-projects-list-err:', err);
                return;
            }

            for (i  = 0; i < localData.length; i ++) {
                var lData = localData[i];
                for (j = 0; j < remoteData.length; j ++) {
                    var rData = remoteData[j];
                    if (lData.data_key == rData.data_key) break;
                }

                if (j == remoteData.length) {
                    remoteDB.scansA.create(lData, function(err, item) {});
                }
            }
        })
    });
}


function syncScansB() {
    var i, j;

    localDB.scansB.find({}, function(err, localData) {

        if (err) {
            console.log('load-scansB-list-err:', err);
            return;
        }
        if (localData.length == 0) return;

        remoteDB.scansB.find({}, function(err, remoteData) {
            if (err) {
                console.log('load-scansB-projects-list-err:', err);
                return;
            }

            for (i  = 0; i < localData.length; i ++) {
                var lData = localData[i];
                for (j = 0; j < remoteData.length; j ++) {
                    var rData = remoteData[j];
                    if (lData.data_key == rData.data_key) break;
                }

                if (j == remoteData.length) {
                    remoteDB.scansB.create(lData, function(err, item) {});
                }
            }
        })
    });
}


function sync() {
    syncProjects();
    syncManualFields();
    syncPipes();
    syncScansA();
    syncScansB();
}

module.exports = {
    sync: sync
};

import fs from 'fs';

// Pipe_Scan_3_20160408_123335

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function createNameUsingDate(type) {
    const currentTime = new Date();

    const fileName = 'Pipe_Scan_' + type + '_' +
        currentTime.getFullYear() +
        // currentTime.getDate() +
        pad(currentTime.getMonth() + 1, 2) +
        pad(currentTime.getDate(), 2) +
        '_' +
        pad(currentTime.getHours(), 2) +
        pad(currentTime.getMinutes(), 2) +
        pad(currentTime.getSeconds(), 2);

    return fileName;
}

// Debug only
export function debugA(path, data, manualField, pipeFields) {
    console.log(data);
    console.log(manualField);
    const fileName = createNameUsingDate('A') + '.csv';
    saveTestFile(path, fileName, data, manualField, pipeFields);
}

export function debugB(path, data, manualField, pipeFields) {
    console.log(data);
    const fileName = createNameUsingDate('B') + '.csv';
    saveTestFile(path, fileName, data, manualField, pipeFields);
}

function saveTestFile(path, fileName, data, manualField, pipeFields) {
    var dataKey = ['bevelAngle', 'halfBevelGap', 'landThickness', 'radius', 'wallThickness'];
    var realKey = ['Angle', 'Gap', 'Thickness', 'Radius', 'WT'];

    if (path) {
        if (path.length > 0) {
            const filePath = path + '/' + fileName;

            var realData = ' ';
            var maxLength = 0;
            for (var i = 0; i < data.length; i ++) {
                realData += ',Scan ' + (i + 1);
                for (var j = 0; j < dataKey.length; j ++) {
                    if (typeof data[i][dataKey[j]] == "undefined") continue;
                    if (data[i][dataKey[j]].length > maxLength) maxLength = data[i][dataKey[j]].length;
                }
            }
            realData += '\n';

            var obj_index = 0;
            var data_index = -1;
            var key_index = 0;
            var flag = false;

            while (true) {

                if (obj_index == maxLength) break;

                data_index = (data_index + 1) % (data.length + 1);

                if (data_index == 0) {
                    realData += '\n' + (obj_index + 1) + ' - ' + realKey[key_index];
                }else {
                    if (typeof data[data_index-1][dataKey[key_index]] == "undefined") {
                        realData += ', ';
                    }else {
                        if (data[data_index-1][dataKey[key_index]].length >= obj_index + 1) {
                            flag = true;
                            realData += ',' + data[data_index-1][dataKey[key_index]][obj_index];
                        }else {
                            realData += ', ';
                        }
                    }

                    if (data_index == data.length) {
                        key_index = (key_index + 1) % realKey.length;
                        if (key_index == 0) obj_index ++;
                    }
                }
            }


            const {pipeNumber} = pipeFields;
            const {heatNumber} = pipeFields;

            if (pipeNumber) {
                realData += '\nPipe Number';

                for (var j = 0; j < data.length; j ++) {
                    realData += ', ' + pipeNumber;
                }
            }

            if (heatNumber) {
                realData += '\nHeat Number';

                for (var j = 0; j < data.length; j ++) {
                    realData += ', ' + heatNumber;
                }
            }


            //Add scan data by manual Fields
            for (var i = 0; i < manualField.length; i ++) {
                var item = manualField[i];
                if (item.mKey.trim() == '') continue;
                realData += '\n' + item.mValue.trim();

                for (var j = 0; j < data.length; j ++) {
                    realData += ', ' + item.mRValue;
                }
            }

            fs.writeFileSync(filePath, realData);
        }
    }
}

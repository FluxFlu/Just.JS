function valueReplace(file, type) {
    if (!file.includes(type)) return file;
    //Replaces all variable declarations:
    let valReplace = file.match(eval(`/(?<=(?:let|const|var)[^a-bA-B_]*${type}_[A-Za-z]*[ =:][ =:]*)[a-zA-Z0-9\"\`\'\\(\\[].*?(?=;)/g`));

    let varNames = file.match(eval(`/(?<=(?:let|const|var).*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    let lNames = file.match(eval(`/(?<=let.*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    let cNames = file.match(eval(`/(?<=const.*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    let vNames = file.match(eval(`/(?<=var.*)(?<=${type}_)(.*?)(?=[ :=])/g`));

    let allLines = file.match(/(.*)[^\n\r]/g);

    let stringedLines = allLines.map(e => (e.match(/((?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*'))/g)) ? e.match(/((?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*'))/g) : [""]);
    stringedLines.forEach(e => { if (allLines[stringedLines.indexOf(e)].includes(" = new /*jjs*/ j")) { stringedLines[stringedLines.indexOf(e)] = '' } });
    let reStringed = [];
    let lineValues = [];
    for (let x = 0; x < stringedLines.length; x++) {
        for (let i = 0; i < stringedLines[x].length; i++) {
            let e = stringedLines[x][i];
            let empt = "";
            for (let n = 0; n < e.length; n++) {
                empt += " ";
            }
            reStringed.push([x, allLines[x].indexOf(e), e]);
            allLines[x] = allLines[x].substring(0, allLines[x].indexOf(e)) + empt + allLines[x].substring(allLines[x].indexOf(e) + e.length);
        }
    }
    let numOf = 0;
    for (let x = 0; x < allLines.length; x++) {

        if (eval(`allLines[x].match(/(.*)(?=${type}_)(.*)/g)`)) {
            let stat;
            if (lNames && lNames.includes(varNames[numOf])) stat = "let";
            if (cNames && cNames.includes(varNames[numOf])) stat = "const";
            if (vNames && vNames.includes(varNames[numOf])) stat = "var";
            let ill = allLines[x].search(eval(`/(?<=[^A-Za-z_])${varNames[numOf]}(?=\\.evaluated\\(\\)\\.value)/`));
            allLines[x] = allLines[x].replace(eval(`/(?:(?:let|const|var)[^a-bA-B_\\n\\r;]*${type}_[A-Za-z]*[ =:]*)[a-zA-Z0-9""()].*?(?:;|\\n|\\r)/`), `${stat} ${varNames[numOf]} = new /*jjs*/ j${type} (${valReplace[numOf]}, '${stat}' );`);
            numOf++;
            for (let i = 0; i < reStringed.length; i++) {
                let e = reStringed[i];
                if (e[0] == x && e[1] > ill) {
                    reStringed[i][1] += 6;
                }
            }
        }
    }

    let batString = false;
    if (allLines && varNames && allLines.length && allLines.length && allLines.length > 0 && varNames.length > 0) {
        for (let x = 0; x < allLines.length; x++) {
            let allMatcher = `/(?:(?:let|const|var)[^a-bA-B_\\n\\r;]*${type}_[A-Za-z]*[ =:]*)[a-zA-Z0-9""()].*?(?:;|\\n|\\r)/`;
            while (allLines[x].match(eval(allMatcher))) {
                let i = allLines[x].match(eval(allMatcher));
                let empt = "";
                for (let n = 0; n < i.length; n++) {
                    empt += " ";
                }
                lineValues.push([x, allLines.search(eval(allMatcher)), i]);
                allLines[x] = allLines[x].replace(eval(allMatcher), empt);
            }
            for (let y = 0; y < varNames.length; y++) {

                if (allLines[x].match(/`/g) && allLines[x].match(/`/g).length % 2 == 1) {
                    if (batString)
                        batString = false;
                    else
                        batString = true;
                }

                let valueMatch = `/(?<=[^A-Za-z_])${varNames[y]}(?=[^A-Za-z_])(?!\\.evaluated\\(\\)\\.value)((?=.*${varNames[y]}.*new \\/\\*jjs\\*\\/ j)|(?!.*new \\/\\*jjs\\*\\/ j))/`;
                while (allLines[x].match(eval(valueMatch)) && !batString) {
                    let ill = allLines[x].search(eval(valueMatch));
                    allLines[x] = allLines[x].replace(eval(valueMatch), `${varNames[y]}.evaluated().value`);

                    for (let i = 0; i < reStringed.length; i++) {
                        let e = reStringed[i];
                        if (e[0] == x && e[1] > ill) {
                            reStringed[i][1] += 18;
                        }
                    }
                }
            }
        }
    }
    for (let x = 0; x < allLines.length; x++) {
        for (let i = 0; i < reStringed.length; i++) {
            if (reStringed[i][0] == x) {
                if (allLines[x].includes(' = new /*jjs*/ j')) {
                    reStringed.filter(e => e[0] != x);
                    continue;
                }

                allLines[x] = allLines[x].substring(0, reStringed[i][1]) + reStringed[i][2] + allLines[x].substring(reStringed[i][1] + reStringed[i][2].length);
            }
        }
        for (let i = 0; i < lineValues.length; i++) {
            if (lineValues[i][0] == x) {

                allLines[x] = allLines[x].substring(0, lineValues[i][1]) + lineValues[i][2] + allLines[x].substring(lineValues[i][1] + lineValues[i][2].length);
            }
        }
    }


    file = allLines.join("\n");


    return file;
}

class jint {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => parseInt(e));
            } else {
                Object.defineProperty(this, "value", {
                    value: parseInt(value),
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    evaluated() {
        this.updateValue();
        return this;
    }
    updateValue() {
        if (this.type != 'const') {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => parseInt(e));
            } else {
                this.value = parseInt(this.value);
            }
        }
    }
}

class jfloat {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => parseFloat(e));
            } else {
                Object.defineProperty(this, "value", {
                    value: parseFloat(value),
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    evaluated() {
        this.updateValue();
        return this;
    }
    updateValue() {
        if (this.type != 'const') {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => parseFloat(e));
            } else {
                this.value = parseFloat(this.value);
            }
        }
    }
}

class jboolean {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => !!e);
            } else {
                Object.defineProperty(this, "value", {
                    value: !!value,
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    evaluated() {
        this.updateValue();
        return this;
    }
    updateValue() {
        if (this.type != 'const') {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => !!e);
            } else {
                this.value = !!this.value;
            }
        }
    }
}

class jstring {
    constructor(value, type) {
        this.type = type;
        if (this.type != 'const') {
            this.value = value;
            this.updateValue();
        }
        else {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => e.toString());
            } else {
                Object.defineProperty(this, "value", {
                    value: value.toString(),
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }
    evaluated() {
        this.updateValue();
        return this;
    }
    updateValue() {
        if (this.type != 'const') {
            if (this.value instanceof Array) {
                this.value = this.value.map(e => e.toString());
            } else {
                this.value = this.value.toString();
            }
        }
    }
}


function jjs(func, params) {
    if (func) {
        if (!params) { params = []; }
        const process = new jjsProcess(func, params);
        return process.begin();
    }
}

function stronglyTyped(file) {
    file = file.replaceAll(/(?=\/\/)(.*)[\n\r]/g, "");
    file = file.replaceAll("  ", " ");

    file = valueReplace(file, 'int');
    file = valueReplace(file, 'float');
    file = valueReplace(file, 'boolean');
    file = valueReplace(file, 'string');

    return file;
}

class jjsProcess {
    constructor(file, params) {
        this.file = file;
        this.params = params;
    }
    begin() {

        //Function coerced to string
        this.file = this.file.toString();

        //Modify String
        this.file = stronglyTyped(this.file);

        //Use eval to evaluate string and collect return values
        let exports = eval(`(${this.file})(${this.params})`);

        //Return the return values
        return exports;

    }
}

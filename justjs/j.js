// Replaces all jjs "statically typed variables" with regular variable type objects ((int_, float_, boolean_, string_) => (jint, jfloat, jboolean, jstring))

function valueReplace(file, type) {

    //  If the file doesn't include this data type, no point in running this code
    if (!file.includes(type)) return file;

    // Gets the values of all variables
    const valReplace = file.match(eval(`/(?<=(?:let|const|var)[^a-bA-B_]*${type}_[A-Za-z]*[ =:][ =:]*)[a-zA-Z0-9\"\`\'\\(\\[].*?(?=;)/g`));

    // Gets the names of all variables
    const varNames = file.match(eval(`/(?<=(?:let|const|var).*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    
    // Gets the names of all let variables
    const lNames = file.match(eval(`/(?<=let.*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    
    // Gets the names of all const variables
    const cNames = file.match(eval(`/(?<=const.*)(?<=${type}_)(.*?)(?=[ :=])/g`));
    
    // Gets the names of all var variables
    const vNames = file.match(eval(`/(?<=var.*)(?<=${type}_)(.*?)(?=[ :=])/g`));

    // Gets all lines in the string as an array
    const allLines = file.match(/(.*)[^\n\r]/g);

    // Gets every value from the allLines array that is a string literal 
    const stringedLines = allLines.map(e => (e.match(/((?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*'))/g)) ? e.match(/((?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*'))/g) : [""]);

    // Removes all the values from stringedLines that are part of a variable declaration that has already been managed by a previous execution of 'valueReplace'
    stringedLines.forEach(e => { if (allLines[stringedLines.indexOf(e)].includes(" = new /*jjs*/ j")) { stringedLines[stringedLines.indexOf(e)] = '' } });
    
    // Declares reStringed (used to store string literals that will be added back in after they are removed for manipulation purposes)
    const reStringed = [];

    // Declares lineValues (reStringed but again)
    const lineValues = [];


    // Adds the string literals to reStringed whilst removing them from allLines: {
    for (let x = 0; x < stringedLines.length; x++) {
        for (let i = 0; i < stringedLines[x].length; i++) {
            const e = stringedLines[x][i];
            let empt = "";
            for (let n = 0; n < e.length; n++) {
                empt += " ";
            }
            reStringed.push([x, allLines[x].indexOf(e), e]);
            allLines[x] = allLines[x].substring(0, allLines[x].indexOf(e)) + empt + allLines[x].substring(allLines[x].indexOf(e) + e.length);
        }
    }
    // }


    // Replaces jjs variable declaration with regular variable type objects: {
    let numOf = 0;
    for (let x = 0; x < allLines.length; x++) {

        if (eval(`allLines[x].match(/(.*)(?=${type}_)(.*)/g)`)) {
            let stat;
            if (lNames && lNames.includes(varNames[numOf])) stat = "let";
            if (cNames && cNames.includes(varNames[numOf])) stat = "const";
            if (vNames && vNames.includes(varNames[numOf])) stat = "var";
            const ill = allLines[x].search(eval(`/(?<=[^A-Za-z_])${varNames[numOf]}(?=\\.evaluated\\(\\)\\.value)/`));
            allLines[x] = allLines[x].replace(eval(`/(?:(?:let|const|var)[^a-bA-B_\\n\\r;]*${type}_[A-Za-z]*[ =:]*)[a-zA-Z0-9""()].*?(?:;|\\n|\\r)/`), `${stat} ${varNames[numOf]} = new /*jjs*/ j${type} (${valReplace[numOf]}, '${stat}' );`);
            numOf++;
            for (let i = 0; i < reStringed.length; i++) {
                const e = reStringed[i];
                if (e[0] == x && e[1] > ill) {
                    reStringed[i][1] += 6;
                }
            }
        }
    }
    // }


    // Replaces every time a variable is referenced with variable.evaluated().value,
    //      in order to not directly reference objects as though they were values: {
    
    // ( The reason .evaluated() is used is as a way to coerce back to the original data type, and then return the post-coersion object )

    if (allLines && varNames && allLines.length && allLines.length && allLines.length > 0 && varNames.length > 0) {
        for (let x = 0; x < allLines.length; x++) {
            const allMatcher = `/(?:(?:let|const|var)[^a-bA-B_\\n\\r;]*${type}_[A-Za-z]*[ =:]*)[a-zA-Z0-9""()].*?(?:;|\\n|\\r)/`;
            while (allLines[x].match(eval(allMatcher))) {
                const i = allLines[x].match(eval(allMatcher));
                let empt = "";
                for (let n = 0; n < i.length; n++) {
                    empt += " ";
                }
                lineValues.push([x, allLines.search(eval(allMatcher)), i]);
                allLines[x] = allLines[x].replace(eval(allMatcher), empt);
            }
            for (let y = 0; y < varNames.length; y++) {
                const valueMatch = `/(?<=[^A-Za-z_])${varNames[y]}(?=[^A-Za-z_])(?!\\.evaluated\\(\\)\\.value)((?=.*${varNames[y]}.*new \\/\\*jjs\\*\\/ j)|(?!.*new \\/\\*jjs\\*\\/ j))/`;
                while (allLines[x].match(eval(valueMatch))) {
                    const ill = allLines[x].search(eval(valueMatch));
                    allLines[x] = allLines[x].replace(eval(valueMatch), `${varNames[y]}.evaluated().value`);

                    for (let i = 0; i < reStringed.length; i++) {
                        const e = reStringed[i];
                        if (e[0] == x && e[1] > ill) {
                            reStringed[i][1] += 18;
                        }
                    }
                }
            }
        }
    }
    // }


    // Substitutes all the string literals from reStringed back into allLines: {

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
                console.log("cock and actual literal balls");
                allLines[x] = allLines[x].substring(0, lineValues[i][1]) + lineValues[i][2] + allLines[x].substring(lineValues[i][1] + lineValues[i][2].length);
            }
        }
    }
    // }
    


    file = allLines.join("\n");


    return file;
}

// Create type classes: {

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
// }

// Function that creates an instance of jjsProcess and runs it
function jjs(func, params) {
    if (func) {
        if (!params) { params = []; }
        const process = new jjsProcess(func, params);
        process.manip();
        return process.execute();
    }
}

// Function called by jjsProcess' begin method to actually implement all of the regex
function stronglyTyped(file) {

    // Removes comments
    file = file.replaceAll(/(?=\/\/)(.*)[\n\r]/g, "");

    //  Removes double spaces
    file = file.replaceAll("  ", " ");

    // Calls the value replace function for each data type
    file = valueReplace(file, 'int');
    file = valueReplace(file, 'float');
    file = valueReplace(file, 'boolean');
    file = valueReplace(file, 'string');

    // Returns the file
    return file;
}


// Class that includes a file and its parameters as values.
class jjsProcess {
    constructor(file, params) {
        this.file = file;
        this.params = params;
    }

    // Turns the file from jjs code into js code
    manip() {

        //Function coerced to string
        this.file = this.file.toString();

        //Modify String
        this.file = stronglyTyped(this.file);

    }

    // Runs the jjs code
    execute() {

        //Use eval to evaluate string and collect return values
        const exports = eval(`(${this.file})(${this.params})`);

        //Return the return values
        return exports;

    }
}

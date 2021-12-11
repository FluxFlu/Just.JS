import valueReplace from './functions/valueReplace.js';
import jint from './dataTypes/int.js';
import jfloat from './dataTypes/float.js';
import jboolean from './dataTypes/boolean.js';
import jstring from './dataTypes/string.js';
async function jjs(file, func) {
    return(await eval(`(async () => {let { ${func} } = await import(".${file}"); return ${func};})()`).then((jjs) => {
        if (jjs) {
            const process = new jjsProcess(jjs);
            return process.begin();
        }
    }));
}

function returnMatch(file) {
    let returnMatch = new RegExp(/(?<=(?:return)[A-Za-z]*[ =:]*)(?!\[)[a-zA-Z0-9""\[].*?(?!\])(?=[;\n\r])/);
    while (file.match(returnMatch)) {
        let i = file.match(returnMatch);
        file = file.replace(/(?<=(?:return)[A-Za-z]*[ =:]*)(?!\[)[a-zA-Z0-9""\[].*?(?!\])(?=[;\n\r])/, `[${i}]`);
    }
    return file;
}


function stronglyTyped(file) {
    file = file.replaceAll(/(?=\/\/)(.*)[\n\r]/g, "");
    file = file.replaceAll("  ", " ");

    file = valueReplace(file, 'int');
    file = valueReplace(file, 'float');
    file = valueReplace(file, 'boolean');
    file = valueReplace(file, 'string');

    file = returnMatch(file);
    return file;
}

class jjsProcess {
    constructor(file) {
        this.file = file;
    }
    begin() {

        //Function coerced to string
        this.file = this.file.toString();

        //Modify String
        this.file = stronglyTyped(this.file);
        
        //Use eval to evaluate string and collect return values
        let exports = eval(`(${this.file})()`);

        //Return the return values
        return exports;
        
    }
}

export { jjs };

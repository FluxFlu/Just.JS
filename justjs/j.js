/*
    Documentation:

    //
    ${datatype}_${variableName} when declaring variables

    eg: 

    let int_x = 3;
    const boolean_y = true;


    They are then used normally

    eg:

    console.log(x);

    if (y) {...}
    //

    //
    You must use semicolons properly and cannot have variables with the same variable name within the same global scope.
    (in this case, 'global scope' refers to the scope of a single function run with the 'jjs' function)
    //

    Variable values are always set back to their original type, but only every time the variable is referenced.

    This allows users to temporarily modify the value type of a variable to their benefit.

    eg:

    let int_x = 3;

    x += "" + 8;

    console.log(x + 2);
    ^ prints out 40.
    //

    //

    In order to properly import, the justjs folder must be right next to the file you are running the 'jjs' function in. Past that, you can place your actual scripts wherever you want.

    ie:

    [*Any Folder]:
        - [justjs]
        - index.html

    //

    Values are returned within arrays, and the jjs function is async.
    
    ## Within the index.html:
    
    <script src="./justjs/j.js" type="module" charset="utf-8"></script>
    <script src="./script/main.js" type="module" charset="utf-8" id="main"></script>
    <p id="p"></p>
    <script type="module">
        import { jjs } from './justjs/j.js';
        let x = 0;
        let y = 0;
        await jjs('./script/main.js', 'mainClass').then(e => {
            x = e[0];
            y = e[1];
        });
            console.log(x);
            console.log(y);
            // ^ logs 40 as x, and 200 as y.
    </script>
    
    
    ## Within the main.js file:
    export function mainFunc() {
        let int_x = 3;

        x += "" + 8;

        y = x * 5

        return x, y;
    }



    //
*/
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
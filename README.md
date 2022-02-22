![Just.JS](https://github.com/FluxFlu/Just.JS/blob/main/logo.png?raw=true)
# Just.JS
A JavaScript library that supports statically typed variables while still allowing for coercion between data types.


# How to import

In order to properly import Just.JS, the justjs folder must be right next to the file you are running the 'jjs' function in. Past that, you can place your actual scripts wherever you want.

    [*Base Folder]:
        - [justjs]
        - index.html

# How to run

Just.JS code is run by parsing declared functions through a specific function, titled 'jjs.' 

It takes one parameter, which is the function that includes code which will be run as jjs.

For example:

```
[Example Filestructure]
    [Test Code]
        [justjs]
        index.html
```

```html
<!-- This is where you import the code, typically your 'index' file. -->
<!-- This example includes HTML to show that nothing other than importing the jjs file is required for this code to run. -->
<body>
    <script src="./justjs/j.js"></script>
    
    <script src="./script/script.js"></script>
    <script>
        function mainFunction() {
        let x = 3;
        console.log(x);
        }
        jjs(mainFunction);
        // This will only run mainFunction, logging 3 to the console.
    </script>
</body>
```

# How to use


`${datatype}_${variableName}` is used when declaring variables. This is optional, variables can still be declared as they would be in regular JavaScript, and they will then not have any assigned type. The data types implemented are int, float, string, and boolean.
```js
let int_x = 3;
const boolean_y = true;


// These values are then referred to regularly:

console.log(x);

if (y) {...}
```
#### Variable values always return to their original type, but only after an expression ends. This allows for temporary coercion between types.
```js
let int_x = 3;
// x is integer 3.
    
x += "" + 8;
// x is integer 38.

console.log(x + 2);
// ^ prints out 40.
```
#### You can also create arrays with a set type.
```js
let int_x = [3, "4", 2.77];
// x is [3, 4, 2]

x = x.reduce((e, i) => e + i);
// x is 9

console.log(x);
// prints out 9
    
x += "" + 8;
// x is 98

console.log(x + 2);
// prints out 100
```
#### Additionally, value types can be changed using cast().
```js
    let int_l = 0;
    console.log(l); // Outputs 0
    cast(l, "boolean");
    console.log(l); // Outputs false
    cast(l, "string");
    l = l + 2
    console.log(l); // Outputs "false2"
```
# Notes:

#### You must use semicolons properly and cannot have variables with the same variable name within the same imported function.

```js
//For example:
function mainFunc() {
  function main() {
    let int_x = 77;
    return x;
  }
  let float_x = main();
}
  
// This doesn't work, because even though they're not in the same scope, you've declared two variables with the same name.
// This is implemented to prevent unnecessary confusion between variables.
// This only time this doesn't apply is class and object attributes (see next example).
```
```js
//Class example:

function mainFunction() {
    class mainClass {
        constructor(x, y, width, height) {
          this.fl = x;
          this.e = y;
          this.gg = width;
          this.oo = height;
        }
      }
      let int_fl = 3;
      let int_e = 8;
      let float_gg = 0.33;
      let float_oo = 4.77;
      console.log(new mainClass(fl, e, gg, oo));
}
      
// This code works fine.
// Even though you have two different values with the same name, attributes are an exception to this rule.
// You are allowed to have as many attributes as you want with the same name in a file.
```
#### Values are returned as through the jjs function. Only a single value is returned, so you must use an array to return multiple values.

For example:

```js
function mainFunction() {
    let int_x = 12;
    let int_y = 500;
    return [x, y];
}
```

```html
<script src="./justjs/j.js"></script>
<script src="./script/script.js"></script>
<script>
    let x = 0;
    let y = 0;
    let returnValue = jjs(mainFunction);
    x = returnValue[0];
    y = returnValue[1];
    console.log(x); // Logs 12
    console.log(y); // Logs 500
</script>
```
#### Arguments are given to a function through an array which is the second parameter in the jjs function.

For example:

```js
function mainFunction(xValue, yValue) {
    let int_x = xValue * 2;
    let int_y = yValue * 4;
    return [x, y];
}
```

```html
<script src="./justjs/j.js"></script>
<script src="./script/script.js"></script>
<script>
    let x = 0;
    let y = 0;
    let returnValue = jjs(mainFunction, [12, 500]);
    x = returnValue[0];
    y = returnValue[1];
    console.log(x); // Logs 24
    console.log(y); // Logs 2000
</script>
```

#### Typed variables are treated like objects.
```js
function mainFunction() {
    for (let int_x = 0; x < 9; x++) {
        document.getElementById(x).onclick = () => {
            click(x);
        }
    }
}
      
// This code doesn't work properly.
// This is because type variables are treated as objects, and so by the time onclick tries to reference "click(x)", x will already be permanently 9.
```

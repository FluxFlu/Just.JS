![Just.JS](https://github.com/FluxFlu/Just.JS/blob/main/logo.png?raw=true)
# Just.JS
A JavaScript library that supports statically typed variables while still allowing for coercion between data types.


# How to import

In order to properly import Just.JS, the justjs folder must be right next to the file you are running the 'jjs' function in. Past that, you can place your actual scripts wherever you want.

    [*Base Folder]:
        - [justjs]
        - index.html

# How to run

Just.JS code is run by exporting code normally and then importing it through a specific async function, titled 'jjs.' 

It takes two parameters; file path and function name.

For example:

```
[Example Filestructure]
    [Test Code]
        [justjs]
        [script]
            main.js
        index.html
```
```
// This is where the function run in this example is declared.
// This is written within a js file which doesn't need to be imported through html.
    export function mainFunction() {
        let x = 3;

        document.getElementById('display').innerHTML = x;
    }
```

```
<!-- This is where you import the code, typically your 'index' file. -->
<!-- This example includes HTML to show that nothing other than "type='module'" is required for this code to run. -->
<body>
    <script type="module">
        import { jjs } from './justjs/j.js';
        jjs('./script/main.js', 'mainFunction');
        // This will only run mainFunction.
        // This allows you to store multiple different jjs functions within the same js file. 
    </script>
</body>
```

# How to use


`${datatype}_${variableName}` is used when declaring variables. This is optional, variables can still be declared as they would be in regular JavaScript, and they will then not have any assigned type. The data types implemented are int, float, string, and boolean.

    let int_x = 3;
    const boolean_y = true;


    // These values are then referred to regularly:

    console.log(x);

    if (y) {...}

#### Variable values always return to their original type, but only after an expression ends. This allows for temporary coercion between types.

    let int_x = 3;
    // x is integer 3.
    
    x += "" + 8;
    // x is integer 38.

    console.log(x + 2);
    ^ prints out 40.

#### You can also create arrays with a set type.

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
    
# Notes:

#### You must use semicolons properly and cannot have variables with the same variable name within the same imported function.

```
//For example:

export function mainFunc() {
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
```
//Class example:

export function mainFunction() {
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
#### Values are returned as an array through the jjs function. Await must be used since jjs is an async function.

For example:

``` 
export function mainFunction() {
    let int_x = 12;
    let int_y = 500;
    return x, y;
}
```

```
<script type="module">
    import { jjs } from './justjs/j.js';
    let x = 0;
    let y = 0;
    await jjs('./script/main.js', 'mainFunction').then(e => {
        x = e[0];
        y = e[1];
    });
    console.log(x); // Logs 12
    console.log(y); // Logs 500
</script>
```

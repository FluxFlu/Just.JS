

- When using backtick characters `` to create a string, if a statically typed variable name is referenced within them, '.evaluated().value' will be appended to the variable's name. This can be avoided through the use of a backslash.
  
  This bug occurs because of the way variable name replacement is implemented, which I am too lazy to put time into merely to solve a bug that rarely comes up and has an existing workaround.
  
  Example:
  ```js
  let int_foo = 3;
  console.log(`foo`);
  // Prints out 'foo.evaluated().value'
  ```

  Solution:
  ```js
  let int_foo = 3;
  console.log(`f\oo`);
  // Prints out 'foo'
  ```
  

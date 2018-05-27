---
title: Finally understanding closures in JavaScript
date: 2018-04-09
---

<div class="blog-header-image">
  <video src="https://media.giphy.com/media/l2YWgjNtuo8fSGwKI/source.mp4" type="video/mp4" autoplay="true" muted="true" loop="true"></video>
</div>




To understand something, I go to a lot of sources. Some speak to me, some don't. I try to take something useful from each and put together an understanding.

I want to write a post on understanding closures. Closures are a topic I had a tenuous grasp of—something that I could sort of explain to myself and others, but it's kind of got me in different situations, including an interview.

Here are some things that really helped me understand (the big one being that closures are not the same thing as scope...I've read that so many times, but it finally clicked for me):

1. Think of closures as functions with preserved data. (eh...this was kinda helpful, but not greatly).
  https://www.youtube.com/watch?v=71AtaJpJHw0
2. Closures are bubbles. (Getting closer...)
  https://www.youtube.com/watch?v=CQqwU2Ixu-U
3. A closure is when a function remembers its lexical scope even when that function is executing outside its lexical scope. (Def important, but still not really nailing it for me).
  https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch5.md
4. Scopes and closures are *not the same thing*. Kinda mind-blowing.
  [https://medium.freecodecamp.org/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c](https://medium.freecodecamp.org/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c) and [https://jscomplete.com/labs/what-are-closures-in-javascript](https://jscomplete.com/labs/what-are-closures-in-javascript)

  Also:
    Scopes have a lifetime. Consider:

```js
printA(); //scope crated, discarded right after execution
printA(); //new and different scope created, also discarded right after
```

Scopes are created on execution. Closures are created on definition.

  Closures have write access.

  Closures can share scopes.

  Here's an example of closures having write access:

```js
function parentFunction() {
  let a = 10;

  function double() {
    a = a + a;
    console.log(a);
  }

  function square() {
    a = a * a;
    console.log(a);
  }

  return {double, square};
}

let {double, square} = parentFunction();

double(); //20
square(); //400
double(); //800
```


5. Execution stacks are temporary, and are created/destroyed for each function execution. This is important. This post really explains step-by-step what is happening:
  https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8

Man, this post was really important. The closure example at the bottom, plus how the author breaks down each step, is really helpful. Here's an important thing to note:

*"Whenever you declare a new function and assign it to a variable, you store the function definition,* **as well as a closure**. *The closure contains all the variables that are in scope at the time of creation of the function. A function definition comes with a little backpack. And in its pack it stores all the variables that were in scope at the time that the function definition was created."*

This is a great example from the post...read the breakdown:
```js
function createCounter() {
  let counter = 0;
  const myFunction = function () {
    counter = counter + 1;
    return counter;
  };
  return myFunction;
}
const increment = createCounter();
const c1 = increment();
const c2 = increment();
const c3 = increment();
console.log(`example increment, ${c1} ${c2} ${c3}`); //1 2 3
```

The reason why this clicked for me is this:

We're defining `myFunction` within `createCounter`. When I first read this I was like, "Why return a function within a function?" Because this:

When we assign the return value of `createCounter` to the new variable increment, what we're doing is returning the function defintion of `myFunction` *and* the variable and value of counter...This combination of defintion and variables within scope is the closure. The closure *remembers* its lexical scope even when that function is executing outside its lexical scope.

Think of it this way: if we had just done this:

```js
function createCounter() {
  let counter = 0;
  counter = counter + 1;
  return counter;
}
// const increment = createCounter();
//First of all, we couldn't do something like
//const c1 = increment();
//bc increment is no longer a function. It's the single value returned from createCounter(). So if we did this:
const c1 = createCounter();
const c2 = createCounter();
const c3 = createCounter();
console.log(`example increment, ${c1} ${c2} ${c3}`); //1 1 1
```

We want to retain the value of `counter`, so we create a new function definition *within* `createCounter()`. This creates a new closure—`myFunction()`—which possesses the scope of `createCounter()`...iow, it has access to the variables within its own function definition, *plus* the variables within its parent function. So when a function is passed and it is called, a new execution context will be created for it. Before checking its local context (ie, parameters first, then locally declared variables within the function definition) and the global context, it will check its *backpack* (the closure) for variable values.


## Tackling partials
Partials always got me...here's how I finally understood them.

Take this example:

```js
let c = 4;
function addX(x) {
  return function (n) {
    return n + x;
  }
}
const addThree = addX(3);
let d = addThree(c);
let e = addThree(9);
console.log(`${addThree}`); //returns: function (n) {return n + x;}
console.log(`${d}`); //7
console.log(`${e}`); //12
```

When we console log `addThree`, what's returned is a function definition for the function we declare within `addX()`. That makes sense.

So when we do this:
```js
const addThree = addX(3);
```
We're calling `addX()` and assigning that function definition to the variable `addThree`. But we're also passing in a parameter, 3.

What's going on with 3? Where does it go? If you:
```js
console.log(`${addThree}`); //function (n) {return n + x;}
```
No sign of our argument, still the function definition being returned. But the value 3 is there...check it out:
```js
let c = 4;
function addX(x) {
  console.log(`x: ${x}`);
  return function (n) {
    return n + x;
  }
}
const addThree = addX(3);
console.log(`${addThree}`); //x: 3, function (n) {return n + x;}
```
All I did was add a console log statement to check what the value of the argument we pass to `addX()` will be. Sure enough, it's 3.

Ok, `x` is part of the closure, and closures retain the value of the scope when the passed function is executed...that means `x` will always be 3, right? At least whenever `addThree()` is executed. To test it out:
```js
let d = addThree(c);
let e = addThree(9);
console.log(`${d}`); //7
console.log(`${e}`); //12
```
In both cases—declaring `d()` while passing it the value of the global variable `c` as a second argument, and declaring `e()` while passing it the value of 9 as a second argument—the value of `x` still remains 3, the value we passed when we:
```
const addThree = addX(3);
```
That's pretty cool. You can create variations of the function without having to create a new function.


<div class="resources">
  <ul>
    <li><a href="https://www.youtube.com/watch?v=71AtaJpJHw0">JavaScript Closures Tutorial on YouTube</a></li>
    <li><a href="https://www.youtube.com/watch?v=CQqwU2Ixu-U">Closures—Part 5 of Functional Programming in JavaScript</a></li>
    <li><a href="https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch5.md">You Don't Know JS: Scope & Closures</a></li>
    <li><a href="https://medium.freecodecamp.org/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c">What's a JavaScript Closure? In Plain English, Please</a></li>
    <li><a href="https://jscomplete.com/labs/what-are-closures-in-javascript">js Complete Interactive Lab on Closures</a></li>
  </ul>
</div>
---
title: Key sequence detection
date: "2018-02-10"
---

<div class="blog-header-image">
  <img src="https://media.giphy.com/media/26Flt2Y401J6AAcjm/source.gif" alt="cheat code of the day">
</div>


Another fun exercise. So this demo is about key sequence detection.

Every time you type, you're entering a key...we want to match something you type to a pre-determined sequence.

The page will be blank, but start typing...once the correct sequence of keys is entered, stuff will start appearing on the page. Plus you can check the console for confirmation.

Check out:

[Codepen](https://codepen.io/whyohengee/pen/yjGwYG)

[Github Pages](https://whyohengee.github.io/keysequencedetection/)

[Github Repo](https://github.com/whyohengee/keysequencedetection/)



##What's the secret code?
Let's start with something simple. We want to know whenever someone types in the string:
```
holy cow
```
We can of course change it to whatever, but for now, keep it simple. Let's set up a variable to hold it:
```js
const secretCode = 'holy cow';
```


##How do we detect?
We're going to be listening for keystrokes on the `window`:
```js
window.addEventListener('keyup', () => {
  //listen for keystrokes
})
```
So here, we're not writing a function signature, but doing all the work in the callback. Each time someone hits a key (we're listening for the [`keyup` event](https://developer.mozilla.org/en-US/docs/Web/Events/keyup)), let's take a look at the event:
```js
window.addEventListener('keyup', (e) => {
  console.log(e);
})
```
On the event, `e`, there's a property called `key` that lets us see which key:
```js
window.addEventListener('keyup', (e) => {
  console.log(e.key);
})
```
If you hit the space bar, the console just logs a blank space.

Ok, every time someone hits a key, let's add that to an array. We can first declare the array outside of our function:

```js
let keysTyped = [];
```

And then add the keys that are typed to our array:

```js
window.addEventListener('keyup', (e) => {
  keysTyped.push(e.key);
  console.log(keysTyped);
})
```
Great, now every time someone hits a key, we're adding it to our `keysTyped` array.


Now, how do we match that to our key?


##Matching what's typed to the secret code with `Array.splice()`
We want to trim our `keysTyped` array to be the length of our secret code, which is 8 characters long:
```js
console.log(secretCode.length); //8
```


To trim the array, we're going to use the `Array.splice()` method. [The `splice()` method modifies an array, removing or adding elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice). This is what we'll do:
```js
window.addEventListener('keyup', (e) => {
  keysTyped.push(e.key);
  keysTyped.splice(-secretCode.length - 1, keysTyped.length - secretCode.length);
  console.log(keysTyped);
})
```
The first argument is called `start`. The `start` value tells the method at which index to start changing the array. We're using the value: `-secretcode.length - 1`, which is a negative number, and that means we're starting from the *end* of the array. Since `secretcode.length` is 8, and -8 - 1 = -9, we're saying start from index 0 at the end of the array, and go backward 9 elements.

The second argument is called `deleteCount`. The `deleteCount` is a number that tells the method how many old array elements need to be removed. If the `deleteCount` is omitted or if it's a number that's greater than the number of elements in the array, then all of the elements will be deleted. Nothing gets added if we were to do:
```js
window.addEventListener('keyup', (e) => {
  keysTyped.push(e.key);
  keysTyped.splice(-secretCode.length - 1);
  console.log(keysTyped);
})
```
Now if `deleteCount` is `0` or a negative number, then no elements are removed.

In our function, we have the `deleteCount` to be the value:

```js
keysTyped.length - secretCode.length
```
If you were to console log the array as you type, the array will be added to from length 0 up until length 8, then it stops being added to because our delete count is saying that as the array grows to 9, 9 - 8 = 1, so chop off 1 element from the end of the array. This makes our modifed array always a length of 8, the length of our `secretCode`.


Now how do we actually check if the modified array contains the `secretCode`? We first need to turn our modified array into a string so that we can compare it, then we use the [`String.includes()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes) to do the search:
```js
window.addEventListener('keyup', (e) => {
  keysTyped.push(e.key);
  keysTyped.splice(-secretCode.length - 1, keysTyped.length - secretCode.length);
  if (keysTyped.join('').includes(secretCode)) {
    console.log('KEY MATCHED!');
  }
  console.log(keysTyped);
})
```
Now, if there is a match, we'll console out the message `KEY MATCHED!`.


##Something to do with unicorns
Wes Bos mentioned this site, [https://www.cornify.com/](https://www.cornify.com/), the #1 Unicorn and Rainbow Service Worldwide. If you were to include this script in `index.html`:
```html
<script type="text/javascript" src="https://www.cornify.com/js/cornify.js"></script>
```
You can use a method called `cornify_add()` that, when called, will add a random unicorn or rainbow to your page. Adding it to our method:
```js
window.addEventListener('keyup', (e) => {
  keysTyped.push(e.key);
  keysTyped.splice(-secretCode.length - 1, keysTyped.length - secretCode.length);
  if (keysTyped.join('').includes(secretCode)) {
    console.log('KEY MATCHED!');
    cornify_add();
  }
  console.log(keysTyped);
})
```
Now when you match the `secretCode`, *magic* happens.






##Resources
<div class="resources">
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Events/keyup">MDN: keyup Event</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">MDN: Array.splice</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes">MDN: String.includes</a></li>
  </ul>
</div>
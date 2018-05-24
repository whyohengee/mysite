---
title: Slide in on Scroll
date: "2018-02-20"
---

<div class="blog-header-image">
  <img src="https://media.giphy.com/media/l41Ygr7sR5limRkek/giphy.gif" alt="keep scrolling">
</div>


You know those sites where images slide into view as you scroll down the page? This is one of those. In learning how to do this, I learned something new: [the debounce function](https://john-dugan.com/javascript-debounce/). What's happening in the demo is that there is text, and in certain places, a space for images. The images don't appear until you've scrolled down a certain way, then they transition into view.

Check out:

[Codepen](https://codepen.io/whyohengee/pen/ZoVPPG?editors=0010)

[Github Pages](https://whyohengee.github.io/slideinonscroll/)

[Github Repo]()


##Markup and styles
Since the purpose of this demo only has one main focus, the markup and stylesheet are pretty simple.
Basically, we have one main wrapper, `div.site-wrap`. Within that, we'll have a bunch of long paragraphs in `<p>` tags and some `<img>` tags. Let's focus on the main wrapper first.

```css
.site-wrap {
  max-width: 700px;
  margin: 100px auto;
}
```
We're not letting the width of our main content container to go beyond 700px. Additionally, the margins are set to be 100px for the top and bottom, and `auto` left and right, meaning that the content will be centered. If the viewport gets smaller, the margins will go away at a certain point.


```css
.site-wrap {
  max-width: 700px;
  margin: 100px auto;
  background: white;
  padding: 40px;
  text-align: justify;
}
```
The rest here just sets some padding, a background color, and aligns the text to [`justify`](https://css-tricks.com/almanac/properties/t/text-align/), which means that "Content spaces out such that as many blocks fit onto one line as possible and the first word on that line is along the left edge and the last word is along the right edge"


None of the `<p>` tags have special classes assigned to them, but the `<img>` tags do. Some have a class of `.align-left`, others a class of `.align-right`.
```css
.align-left {
  float: left;
  margin-right: 20px;
}

.align-right {
  float: right;
  margin-left: 20px;
}
```
Both of these rules are for the image in their final, slid-in and visible state. The `float` rules let the text wrap around the image, and the margins provide some breathing room between the image and the text.


These `<img>` tags also have another class called `.slide-in`:
```css
.slide-in {
  opacity: 0;
  transition: all .5s;
}
```
When dealing with [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), think in terms of a starting state and an ending state. In this class, we're saying the starting state will be `opacity: 0`, and we're going to apply a transition to all of the rules in this class. Remember how we have images on the left and the right? Here's how to handle those:
```css
.align-left.slide-in {
  transform: translateX(-30%) scale(.95);
}

.align-right.slide-in {
  transform: translateX(30%) scale(.95);
}
```
Ok, now we're setting up a [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) on both the left and right images, with the `translateX` being either a negative (for the left images) or positive (for the right images) value, which will start the image's transition off to either side. Additionally, we throw in a little scaling so that the image will "grow" slightly during the transition. Again, these are describing the *beginning* states of the transition, and because we specified the `transition: all` property on the `.slide-in` class, which these rules will inherit from, we're set to transition the `translateX` and `scale` properties.


Now, we need to define the *end* state:
```css
.slide-in.active {
  opacity: 1;
  transform: translateX(0%) scale(1);
}
```
What we're doing is specifying an `.active` class that we'll add to the elements that have the `.slide-in` class. We'll add this `.active` class via JavaScript. The ending state shows that the images will be moved along the horizontal axis, back to their final spot, and will be full-scale and full-opacity.


That's it for the markup and CSS. On to to the JavaScript.


##Detecting when to apply the transition based on page scroll
Let's go ahead and grab all of our images:
```js
const images = document.querySelectorAll(`.slide-in`);
```


Next, let's set up a function that we'll use to handle the scroll event:
```js
function checkSlide(e) {
  console.log(e);
}

window.addEventListener('scroll', checkSlide);
```
What we'll see, if we scroll and open up DevTools, is that there are a *ton* of scroll events being logged. So many in fact, that it can become a performance issue. Instead of `console.log(e)`, do a `console.count(e)` and scroll to the end of the page...it logs over 100 events.

So to handle, that, we'll use something called a debounce function.


##What's a debounce function?
So if I were explaining it to myself, a debounce function is sort of like a throttle on how often an event being fired is recognized. For example, when you scroll a page, the `scroll` event fires really quickly and really often; by the time you get to the bottom of a short page, it could have fired hundreds of times. For really long pages (and most pages on the web these days are super long), there are probably thousands of `scroll` events fired by the time you reach the bottom.

If we attach an event handler to something like a `scroll` event, this can mean a pretty big performance hit—you're literally doing something (whatever you write out in the event handler function) thousands of times, or at the very least, the event handler is being called thousands of times. This will add up.

So, a debounce function will limit how often the handler is called; you can set a time limit on how often the handler is called. [Here's](https://john-dugan.com/javascript-debounce/) a good explanation of it.

That post has a good breakdown, but for my own learning, I'm going to try and explain it to myself here.


##Breaking down the debounce function
Let's start with the function declaration:
```js
function debounce(func, wait = 20, immediate = true) {
  //debouncing
}
```
So there are three arguments here:

1. `func`: This is the callback function that is meant to be executed at certain time intervals
2. `wait`: The amount of time to not call the function, measured in milliseconds. Here, we're saying wait 20 milliseconds between calls.
3. `immediate`: A Boolean value that, when true, will call the function on the leading edge, rather than the trailing edge.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
}
```
So the `debounce()` function will work with JavaScript's [`setTimeout()` method](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout), which runs a function after a specified amount of time.

The `setTimeout()` method returns a positive integer called the `timeoutID`, which is used to identify the timer created in calling `setTimeout()`...this value can be passed to the [`clearTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout) method to cancel the timeout.

The `timeout` variable we're declaring here will hold that `timeoutID` from the `setTimeout()` call we'll use later in the `debounce()` function.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {

  };
}
```
Alright, we're going to be returning a function from `debounce()`. Let's get into it.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
  };
}
```
Within the return function, we're declaring a variable called `context` to refer to the `this` context within the return function. Later used for reference.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
  };
}
```
Any arguments passed to the return function will be stored in the `args` variable. Remember, JavaScript stores all arguments passed into a function in an [Array-like object called the Arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments).


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
  }
}
```
So we're setting up a function called `later()`. What `later()` will do when it's called is strip the numeric ID—the `timeout` variable—that's returned when `setTimeout()` is called. According to [that blog post](https://john-dugan.com/javascript-debounce/): "by the time the `later` function is called, the `setTimeout` function will have returned a numeric ID to the `timeout` variable. That numeric ID is removed by assiging `null` to `timeout`."

Within `later()`, we're checking to see if `immediate` is false, and if it is, call the function we passed into `debounce()` via the [`Function.apply()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), which takes an array of arguments. In this case, those arguments would be the context and args we declared earlier.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
  };
}
```
We setting up a flag, `callNow`. This flag is set to true if both the `immediate` parameter (the second argument passed into `debounce()`) and `setTimeout()` hasn't returned a `timeout` value.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
  };
}
```
Remember that `setTimeout()` returns a positive integer, which identifies the timer created by `setTimeout()`. We can pass that value—here, it's the variable `timeout`—to the [`clearTimeout()` function](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout) to cancel the timeout.

Turning to the [blog post again](https://john-dugan.com/javascript-debounce/): "As long as the event that our `debounce` method is bound to is still firing within the `wait` period, remove the numerical ID (returned to the `timeout` vaiable by `setTimeout`) from JavaScript's execution queue. This prevents the function passed in the `setTimeout` function from being invoked."


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```
We're finally calling `setTimeout()`, and passing into it the `later()` function, which calls our *actual* function if the `immediate` value is false and sets `timeout` to `null`. We're also passing into it the `wait` value, which was one of our original arguments, and is used to specify the amount of time to wait between function calls.


```js
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
```
We're checking the flag, `callNow`, which is set to True if the `immediate` variable is true (the function will be called on the leading edge of the timeout) and the `timeout` variable is false, meaning there's no associated ID with a `setTimeout()` call.


The [blog post](https://john-dugan.com/javascript-debounce/) has a much more in-depth breakdown of what's happening within `debounce()`, but I wanted to explain it to myself line-by-line to get a better understanding than if I had just read through the code.


##...Back to sliding images on scroll
To use the `debounce()` function, we'll wrap our event handler in the function call as an argument:
```js
window.addEventListener('scroll', debounce(checkSlide));
```

Now if you do a `console.count(e)`, there's only a dozen to two dozen scroll events being logged. Much better. On to what's happening within the event handler.


So we want to loop over every image and figure out where on scroll the image needs to be shown...a good place to show the image would be when the page is scrolled to its halfway point.

Ok, let's start with looping over the images:
```js
function checkSlide(e) {
  images.forEach( image => {

  });
}
```
We want to figure out, for each image, when it's been scrolled to its halfway point. The property we'll focus on is called `window.scrollY`...try this:
```js
function checkSlide(e) {
  console.log(window.scrollY);
  // images.forEach( image => {

  // });
}
```
What's being logged is how much the top of the window has been scrolled...a much simpler way to think about it is that `window.scrollY` shows how much you've scrolled down. We're not so much interested in how much the top of the window has been scrolled, but rather the scroll position of the *bottom* of the window. To find that, we can use this:
```js
function checkSlide(e) {
  images.forEach( image => {
    const slideInAt = window.scrollY + window.innerHeight;
    console.log({slideInAt});
  });
}
```
So now, we're assigning to the `slideInAt` variable the pixel value of where the bottom of the window is...I don't know why, but I kept overthinking this and had a hard time visualizing it. But if you were to check `window.innerHeight` in the console, then ran the above and *barely* scrolled, you'd see that the first values logged are pretty close to whatever `window.innerHeight`'s value would be, meaning that this number is representing the bottom of the viewport.
Ok...
So we don't want to slide in at the bottom of the page, we want to slide in at the midpoint of each image. So let's do:
```js
function checkSlide(e) {
  images.forEach( image => {
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);

  });
}
```
Now, `slideInAt` will be the pixel level value of when we want to slide these images into view; that is, their halfway point.

But wait—we also want to know where the bottom of the image is. Why? Well if we scroll past the image, we want it to slide back out, reason being that when we scroll back up the page, we want it to slide back in...it will work both ways.

So to figure out the bottom position of each image:
```js
function checkSlide(e) {
  images.forEach( image => {
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);
    const bottomOfImage = image.offsetTop + image.height;
  });
}
```
What the [`offsetTop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop) property gives us is the distance of the top of the element to the top of the offsetParent element. Ok...what's the `offsetParent`? The `offsetParent` is the closest *positioned* parent element. The parent of each of our `<img>` tags is `div.site-wrap`, but we never specified a `position` property on it, so the `position` of `div.site-wrap` is `static` by default. Meaning in this case, each `<img>` tag's `offsetParent` will be the `<body>` tag.

We add to `image.offsetTop` the image's height, and we get the pixel value of the bottom of the image.


So now we know the pixel values for the halfway point of the image, and the pixel value for the bottom of the image.
Now, let's figure out if:

1. Is the image half-shown?
2. Have we scrolled past the image?


Let's do the first one:
```js
function checkSlide(e) {
  images.forEach( image => {
    //Halfway point through the image
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);
    //Bottom of the image
    const bottomOfImage = image.offsetTop + image.height;
    //Is the image at its halfway point?
    const isHalfShown = slideInAt > image.offsetTop;
  });
}
```
The `isHalfShown` variable is a Boolean and will be true if the pixel value of the halfway point of the image—`slideInAt`—is greater than the pixel value of the top of the image, `image.offsetTop`.


We also want to make sure that we haven't scrolled completely by the image yet...if we have, then we want to remove the `.active` class so the image slides back off the page. To check this, we can create another Boolean variable:
```js
function checkSlide(e) {
  images.forEach( image => {
    //Halfway point through the image
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);
    //Bottom of the image
    const bottomOfImage = image.offsetTop + image.height;
    //Is the image at its halfway point?
    const isHalfShown = slideInAt > image.offsetTop;
    //We didn't scroll by the image yet, did we?
    const isNotScrolledBy = window.scrollY < bottomOfImage;
  });
}
```
The `isNotScrolledBy` variable is checking if the pixel value for the top of the viewport is less than the pixel value for the bottom of the image; if it's less, than we haven't scrolled by it yet.


Now that we have checked both—and I like the convention of naming these Boolean variables btw, check the "Other important lessons" section below—we can finally add the `.active` class to our images, which containse the ending state of our transitions:
```js
function checkSlide(e) {
  images.forEach( image => {
    //Halfway point through the image
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);
    //Bottom of the image
    const bottomOfImage = image.offsetTop + image.height;
    //Is the image at its halfway point?
    const isHalfShown = slideInAt > image.offsetTop;
    //We didn't scroll by the image yet, did we?
    const isNotScrolledBy = window.scrollY < bottomOfImage;
    if (isHalfShown && isNotScrolledBy) {
      image.classList.add('active');
    }
  });
}
```
Now if we start at the top of the page and scroll down, images will slide into view when the bottom of the viewport hits the halfway point of the image. But what if we've scrolled all the way past the image? Don't we want the image to slide away, then slide back into view if we scroll back up? Yup:
```js
function checkSlide(e) {
  images.forEach( image => {
    //Halfway point through the image
    const slideInAt = (window.scrollY + window.innerHeight) - (image.height / 2);
    //Bottom of the image
    const bottomOfImage = image.offsetTop + image.height;
    //Is the image at its halfway point?
    const isHalfShown = slideInAt > image.offsetTop;
    //We didn't scroll by the image yet, did we?
    const isNotScrolledBy = window.scrollY < bottomOfImage;
    if (isHalfShown && isNotScrolledBy) {
      image.classList.add('active');
    }
    else {
      image.classList.remove('active');
    }
  });
}
```
So this condition is saying if the image isn't both half-shown AND we haven't scrolled by it all the way, then slide that sucker into view. Otherwise, get it out of here.


##If any of the variable values for scroll position are hard to understand on a revisit...
don't worry about it, it can be confusing. Just console log the values and it should make more sense.




##Other important lessons
It's a good idea to put names to variable values like `isHalfShown`. These values were going to be used in `if` statements, and technically, the variable names wouldn't be needed.

But, in terms of readability, and maintenance (think about coming back to the code weeks or months later and having to figure out a complicated `if` condition), this saves so much time.

So it's a few extra lines, but so what? The performance hit can't be that bad, and the clarity/time savings are worth much more.

Also, adding the additional `scale` transform on the the image transition is a nice touch...it's barely noticeable, but it's one of those subtle touches that make it somehow more polished.





##Resources
<div class="resources">
  <ul>
    <li><a href="https://john-dugan.com/javascript-debounce/">Demistifying JavaScript Debounce</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions">MDN: Using CSS Transitions</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout">MDN: JavaScript setTimeout</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments">MDN: Arguments Object</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply">MDN: Function.apply</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout">MDN: JavaScript clearTimeout</a></li>
  </ul>
</div>
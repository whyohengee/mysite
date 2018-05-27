---
title: How to make a sound effects keyboard with JavaScript
date: "2017-12-06"
---

<div class="blog-header-image">

![typing](https://media.giphy.com/media/HIYW8sTRTHt1m/giphy.gif)

</div>


## Intro
This was a fun exercise to turn your keyboard into a sound effects machine using JavaScript.

I thought about sitting in long, boring meetings, and that they could be be more interesting if there were sounds effects.

Using JavaScript to listen for certain keys to be hit, which will be tied to specific sounds.

Maybe having it open during a meeting can help make it more entertaining 😛

You can check it out on Github:

[Github Pages](https://whyohengee.github.io/keyboarddrama/)

[Github Repo](https://github.com/whyohengee/keyboarddrama/)


## Event handling
In this demo, we're listening for an event called 'keydown', and we're listening for it on the `document` object (you can also listen on things like a specific input, or div, or whatever).

When that event fires, we're going to call the event handler, which is a function called `playsound()`:

```js
document.addEventListener('keydown', playSound)
```

So when the someone presses a key *down* on the keyboard, we're sending the event object—with details like which key was pressed—to the function `playSound()`.

In the `playSound()` function, we can take a look at the event details:

```
function playSound(e) {
  console.log(e);
}
```

In the Chrome console, `e` will be shown as a KeyboardEvent.
In the Firefox console, `e` will be shown with the event type listed first.
In both, info like which key was pressed is included.

We want 2 things to happen when someone hits one of the keys listed:

1. The corresponding sound effect to play

2. The `<div>` element with the key listed will show that it was hit, which will happen through temporarily adding a CSS class.

Each time a key is pressed, we call the function `playSound()`. And in each function call, we're looking for both a `<div>` and the `<audio>`:

```js
const audio  = document.querySelector(`audio[data-key="${e.keyCode}"]`);
const keyPressed = document.querySelector(`div[data-key="${e.keyCode}"]`);
```

Note we're using [ES6 template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), and as a result, we need to wrap the variable in quotes.


## The `<audio>` tag API
We'll also be digging into the HTML5 [`<audio>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio).

So still in the `playSound()` function, we first check if there is an audio file that we can play; if not, we just exit the function:

```js
if (!audio) return;
````

If there is an audio file to play, we can run the `play()` function on the `<audio>` element:

```js
audio.play()
```

So simple.

The only sort of "gotcha" is that the full audio file will play every time you hit the key; in other words, if you tap the key, it will play till the end and won't start over again on every keypress. To fix that, before you call `audio.play()`, "rewind" the audio clip like so:

```js
audio.currentTime = 0;
```

## HTML `data-` attributes
You can add any attributes you want to an HTML element by using [`data-` attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). They need to take this form:

`data-NAME`

where NAME will be a unique attribute name. In this exercise, the `data-key` value is the event `keycode` for each of the listed keys.

The `data-key` attribute is linking the `<div>`s, which are given the class "key", to the `<audio>` tags with the same `data-key` attribute.

As an example, here's the markup for one of the `<div>` elements:

```html
<div class="key" data-key="65">
      <img src="https://media.giphy.com/media/gQi6UyCjtKxwY/giphy.gif" alt="cat standoff">
        <kbd>A</kbd>
    </div>
```

And here's the corresponding `<audio>` tag, with the corresponding `data-key` value:

```html
<audio src="sounds/actionsequence.wav" data-key="65"></audio>
```

## Playing the right audio file on `keydown`
What we're doing is pretty simple: we're listening for a `keydown` event.
When it fires, we're capturing the keycode for that specific key. That keycode is a `data-key` attribute that matches one of the `<div>`s on the page with an `<audio>` tag.

We can then use the `<audio>` element API to call the `play()` function to play the audio.

Here's the full `playSound()` function, including how we attach the `keydown` event listener to the `playSound()` function:

```js
document.addEventListener('keydown', playSound);

function playSound(e) {

  // console.log(e); // See details of the event obj

  //Grab the "pressed" audio element
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);

  //Stop the function from running altogether if we don't have a sound for the key that was pressed
  if (!audio) return;

  //Grab the "pressed" div element
  const keyPressed = document.querySelector(`div[data-key="${e.keyCode}"]`);

  //Make sure the audio file doesn't play all the way through each time
  audio.currentTime = 0;

  audio.play();

  //We're going to add a class to visually represent the key was pressed
  keyPressed.classList.add('playing');
}
```


## CSS transitions, including adding/removing classes on events
So we want some visual indication to show that a key was pressed. We'll do this using a combination of CSS transitions and JavaScript to add/remove classes from the `<div>` elements that are pressed.

In this case, when a key is pressed down, we want to add a class called `.playing` to the key's `<div>`.

We've already created a variable for the element:

```
const keyPressed = document.querySelector(`div[data-key="${e.keyCode}"]`);
```

Note (again) that we're using ES6 template strings, and that the variable in the string is in double quotes.

Now, when we call the `playSound()` function, we're going to add the class to that element like so:

```js
keyPressed.classList.add('playing');
```

We need to remove the class though, and this has always been confusing to me for some reason.

Here's something simple: We're adding the `.playing` class on keydown, we'll remove it on keyup.

To do that, we'll need to listen for another event, the 'keyup' event. This means that on keyup, the class will be removed. I'm adding the event listener here, which will call a function called `revertKeyAppearance()` to remove the class:

```js
document.addEventListener('keyup', revertKeyAppearance);
```

In `revertKeyAppearance()`, here's how to remove the class:

```js
function revertKeyAppearance(e) {
  const keyPressed = document.querySelector(`div[data-key="${e.keyCode}"]`);
  keyPressed.classList.remove('playing');
}
```

Now, when the key is pressed down, the style for that `<div>` will change. Once the key is back up, the style is removed and the default appearance is back.


##Resources
<div class="resources">
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">JavaScript Template Literals</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio">HTML5 &lt;audio&gt; Element</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes">HTML5 data- Attributes</a></li>
  </ul>
</div>
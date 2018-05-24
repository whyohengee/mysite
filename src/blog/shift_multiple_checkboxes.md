---
title: Handle multiple checkboxes with the shift key
date: "2018-01-27"
---

<div class="blog-header-image">
  <video src="https://media.giphy.com/media/l2YWhZx01Ie6Q3k7m/source.mp4" type="video/mp4" autoplay="true" muted="true" loop="true"></video>
</div>


On web forms with check boxes, it can be a pain to have to check a bunch of boxes, one at a time. Often though it's possible to check a bunch of boxes by checking one, holding down the shift key, and checking another further along..all the boxes in-between should get checked.

In this demo, another from Wes Bos's amazing [JavaScript 30 course](https://javascript30.com), which teaches JavaScript fundamentals by making stuff with vanilla JS, we're doing the checking of the many boxes.

Check it out on:

[Codepen](https://codepen.io/whyohengee/pen/aGPyPK)

[Github Pages](https://whyohengee.github.io/shift-multiple-checkboxes/)

[Github Repo](https://github.com/whyohengee/shift-multiple-checkboxes/)


## Which event to listen for?
We're listening for the checkboxes on the [`form` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) to be checked.

So let's go ahead and grab the all of the checkbox inputs:

```js
const checkboxes = document.querySelectorAll('form input[type="checkbox"]');
```

Now how do we know when one of these gets checked?

The `change` event makes a lot of sense, but if you listen for the `click` event instead, it will fire even if you use your keyboard.

Let's go ahead and attach an event listener—a function we'll write in a bit that will be called `handleCheck()`—to all of the checkbox inputs:

```js
checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleCheck));
```

## The hard part
So we need to keep track of a few things:

* Was something checked?
* Was shift held down?
  * If shift was held down, what was the last thing checked? (then we know a sort of range in the array of inputs).

So we have a variable, `checkBoxes`, that we can loop over. Remember, when you use `.querySelectorAll()`, it doesn't return an Array, it returns something called a `NodeList`. But, `NodeList` has a `forEach()` method, so we can still loop over it. Looping over it is going to come in handy later, but for now, we need to loop over it to attach event listeners:

So every time a box is checked, our handler function, `handleCheck()` will be called. It makes sense then that if we're checking multiple boxes, the last box we checked can be kept track of...it'll be the last call to the handler function.

Let's keep track of which box was the last checked with a variable:

```js
let lastChecked; //Using let instead of const bc the value of this var will change a lot
```

Within our handler, assigning to that var will be the last thing the function does:

```js
function handleCheck(e) {
  //other stuff
  lastChecked = this;
}
```

So every time something is clicked, it will be logged as `lastChecked`. You can test it in the console...check one, and then enter the var name in console. You should see the input that was just checked.

The other thing we want to check is if the shift key was held down while clicking...we're passing the event as an argument into the event handler. If you take a look at the event, there's a property called `shiftKey`. Pretty convenient. This is a Boolean...so to check we if the shift key was held down while the box was checked, we can:

```js
if (e.shiftKey)
```

Easy enough. But wait—what if they're *un*checking the box? We don't want to flag those. In simple language, we're checking if the shift key is down and they're checking the box:

```js
if (e.shiftKey && this.checked)
```

Now it's within this condition where we're going to do most of the work. And this is going to happen every time a box is checked while the shift key is held down...basically, we're going to:

* Loop over all of the boxes.
* If the box is the one that was checked, or the last box that was checked, they get flagged.
* Any boxes between the one that was checked and the last box that was checked get flagged too.

We're going to create a flag for the boxes in-between the checked box and the last-checked box. That's got to be set before we loop over our checkboxes. Here it is within the full function for context:

```js
function handleCheck(e) {
  let inBetween = false;
  if (e.shiftKey && this.checked) {
    //magic about to happen
  }
  lastChecked = this;
}
```

Now we loop through all of the checkboxes; if a box is being checked, and the shift key is held down with it:

```js
function handleCheck(e) {
  let inBetween = false;
  if (e.shiftKey && this.checked) {
    //Loop through all checkboxes
    checkboxes.forEach( checkbox => {
      //About to set some flags
    });
  }
  lastChecked = this;
}
```

Now, we set the flag. In my post [Drawing with HTML5 Canvas](/drawing-on-canvas/), I mentioned flipping the flag to the opposite of what it is by using the negation operator: `!`. That means turn it to the opposite of what it is, and that's what we're going to use to flip the flag.

Ok, so we're looping over each checkbox. The box that was just checked with the shift key, and the last checked boxes will have their flags flipped (ie, `inBetween === true`). Because we're looping, the checkboxes in between those two will also have their flags flipped to true. Here's a way to see it in the console:

```js
function handleCheck(e) {
  let inBetween = false;
  if (e.shiftKey && this.checked) {
    //Loop through all checkboxes
    checkboxes.forEach( checkbox => {
      console.log(checkbox);
      if (checkbox === this || checkbox === lastChecked) {
        inBetween = !inBetween;
        console.log("Starting to check them in between")
      }
    });
  }
  lastChecked = this;
}
```

Another cool thing the loop does is make it irrelevant in which direction you've checked...you can make your first check box lower on the list, then hold down shift and check something near the top of the list, and the `inBetween` flag will still be flipped correctly.

And then finally, to actually make the check mark appear, we can check if the flag is on:

```js
function handleCheck(e) {
  let inBetween = false;
  if (e.shiftKey && this.checked) {
    //Loop through all checkboxes
    checkboxes.forEach( checkbox => {
      console.log(checkbox);
      if (checkbox === this || checkbox === lastChecked) {
        inBetween = !inBetween;
        console.log("Starting to check them in between")
      }
      if (inBetween) {
        checkbox.checked = true;
      }
    });
  }
  lastChecked = this;
}
```

When I went over this again, the `inBetween` flag confused me. I thought it was set for each checkbox, and it's not. It's a single flag...when we're looping, the first checkbox that's either `this` (the box that just got checked with the shift key) or the `lastChecked` will turn the flag ON...*then* the function checks if the flag is on; if it is, the box gets checked. The flag doesn't get turned OFF until the current checkbox in the loop is NOT either `this` or `lastChecked`.

Let's say `this` and `lastChecked` are the third and sixth checkboxes out of nine. So it's like:

* First checkbox: Are you `this` or `lastChecked`? No. Ok, flag doesn't get flipped and is still false.
* Second checkbox: Are you `this` or `lastChecked`? No. Ok, flag doesn't get flipped and is still false.
* THIRD checkbox: Are you `this` or `lastChecked`? Yes! Ok, flag gets flipped to true, and since you were checked by the user, your `checked = true`.
* Fourth checkbox: Are you `this` or `lastChecked`? No. Ok, flag doesn't get flipped and is stil true, you get checked.
* Fifth checkbox: Are you `this` or `lastChecked`? No. Ok, flag doesn't get flipped and is still true, you get checked.
* SIXTH checkbox: Are you `this` or `lastChecked`? Yes! Ok, flag gets flipped to false, but since you were checked by the user, your `checked = true`.
* Seventh checkbox: Are you `this` or `lastChecked`? Nope, no flag flipping.
* Eighth checkbox: Are you `this` or `lastChecked`? Nope, no flag flipping.
* Ninth checkbox: Are you `this` or `lastChecked`? Nope, no flag flipping.


## Thinking through the logic
Going over the logic for this reminded me of an online tutorial course I took recently about Flowcharting and Pseudocode. I took a course in college about this same thing, and I felt like I wanted a refresher. It's part of this whole reboot thing I'm doing—I want to get back to fundamentals.

That course I took in college is what got me interested in programming. Both instructors—the one I had in my live course way back then and the online instructor recently—both had the same message: break problems down into really small problems. They emphasized that a computer really only does one of these things:

1. Input stuff.

2. Output stuff.

3. Arithmetic.

4. Assign a value to a memory location.

5. Compare variables and select alternate actions.
  A lot of this in code logic...

6. Repeat one or a group of actions.

And this algorithm for finding the checked boxes is, like all algorithms, composed of one or more of those things. We're doing some comparing, we're looping, and we're assigning/re-assigning values to a variable.

Not trying to minimize it or anything, but it's kind of comforting to think that you can break problems down into chunks.



## Resources
<div class="resources">
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form">MDN: HTML form element</a></li>
  </ul>
</div>
---
title: Update CSS Variables with JavaScript
date: "2017-12-10"
---

<div class="blog-header-image">
  <img src="https://media.giphy.com/media/13XW2MJE0XCoM0/giphy.gif" alt="css vars make it easier"></video>
</div>



So the product of this exercise was a simple image editor. You have an image with some sliders, and the sliders allow you to change a few things about the image, like the type of filter, spacing around the image, and text colors.

I've really appreciated using variables with Sass/SCSS for a while, but now [CSS variables are part of the CSS spec](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

What's cool about CSS variables is that unlike SCSS/Sass variables, which are compiled and loaded, CSS variables can be updated with JavaScript. I guess you do this with `element.style.PROPERTY` with JS if you were using Sass vars anyway.

But with this method, when you update a single var with JS, it will update across the page. Neat~o~

This demo places the CSS vars on the `:root` element, but you can scope them to lower elements.

You can check it out on [Codepen here](https://codepen.io/whyohengee/pen/Pexjqe), or on [Github Pages here](https://whyohengee.github.io/update-css-vars-with-javascript/) or the [Github repo](https://github.com/whyohengee/update-css-vars-with-javascript/) here.


## HTML `<input>`
Form elements like text fields, radio buttons, and checkboxes aren't anything new. But I don't get too many chances to use sliders or color pickers. I didn't even know [color picker](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool) existed till now! Here's example markup for slider and color picker form inputs:


```html
//Slider
<label for="slider-name">Slider name</label>
<input type="range" name="slider-name">

//Color picker
<label for="color-picker">Pick a color</label>
<input type="color" name="color-picker">
```


For the slider, you can set attributes for `min`, `max`, and `value` (which will be the value on page load).


## CSS Variables: Declaring them and using them
To use CSS vars, you need to declare them on some element. You can also declare it on `root`, which is sort of the highest level element (I think this is similar to declaring it on the `html` element):

I'm also writing this rule at the top of the stylesheet, similar to declaring JavaScript vars at the top of the script. We're playing with 3 different vars in this example: the spacing, or padding, value for the image, the blur filter value over the image, and the color value for both the image' background and some of the tet on the page that are wrapped in `span.highlight`.

The syntax looks like this:
```css
--varName: varValue
```

so our variable declarations look like this:

```css
:root {
  --spacing: 10px;
  --blur: 5px;
  --colorChange: #ffc600;
}
```

Then, to use it somewhere, you use the `var(varValue)` syntax. So it looks like this:

```css
img {
  width: 80%;
  max-height: 500px;
  background-size: contain;
  padding: var(--spacing);
  background-color: var(--colorChange);
  filter: blur(var(--blur));
}
```

I have 3 CSS variables set in this example, and I'm going to use all 3 on the image (`--spacing` for the padding around the image, `--colorChange` for the `background-color` property, and `--blur` for the blur value). The values I set in the variable declarations will be the default values when the page loads.

I'm also using the `--colorChange` var on the CSS class `.highlight`, so it will change color along with the image's background color.


## JavaScript to update CSS Variables
So the first thing we need to do in order to change the variables when someone uses the sliders or color picker is to grab those inputs so we know when they're being used:

```js
const inputs = document.querySelectorAll('input');
```

Using `document.querySelectorAll()` returns something called a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), which is kind of like an Array in JS, except it's more limited. It has methods like `.length()`, but you can't call things like `.map()` or `.sort()` as you could on an Array. If you click on the NodeList in dev tools, then on its prototype (`__proto__`) you can see a list of the available NodeList methods.

So we have these input controls now. We want them to control the CSS vars. But how?

Let's break it down. Every time one of the inputs is used, or its value is changed, we want the CSS var to be updated with that value. So the first thing we want to know is: Was the input used?

There's no "use" event in the browser, but there is a [`change` event](https://developer.mozilla.org/en-US/docs/Web/Events/change). And that's the event we're listening for—every time one of the inputs changes, we want to know. This is a roundabout way of saying that we need to listen for the `change` event on the inputs. How do we assign an event listener to each one of the inputs?

We could do it the long way, where we would have a JavaScript var for each input, then assign `addEventListener()` to each. But what if more inputs are added? It's a lot to maintain. A quicker way would be—since we stored all of the input controls in a JavaScript variable using `document.querySelectorAll()`—is to loop through the NodeList and assign event listeners. Remember NodeList is like an Array, but doesn't have all of Array's methods? Fortunately, it does have `.forEach()`, which is how we're going to loop over each input:


```js
function updateCSS(e) {
  console.log(e.target.value);
}
inputs.forEach(input => addEventListener('change', updateCSS));
```


Note a couple of things:
1. We are using a handler function, `updateCSS()`, rather than writing the event handler in a callback function within the `forEach()` loop. Cleaner this way.

2. Note that the function declaration for `updateCSS()` comes *before* we add the event listener to each input control.

So this is great! One little thing though...the `change` event doesn't fire until the user has "let go" of the input control. How about if the user can actually see the changes happening *as* they're moving the slider, instead of only after they let go? We can do that too, using the [`mousemove` event](https://developer.mozilla.org/en-US/docs/Web/Events/mousemove).

```js
inputs.forEach(input => addEventListener('mousemove', updateCSS));
```

The only thing about this is that the event is firing and is calling the function as the mouse moves across the whole window, not just when the input control is being moved. Not ideal, but keeping it simple for now. When the input control is moved, we're still able to access the value of the control as it's happening; otherwise, the `mousemove` event is just reporting `undefined`.

Ok, at this point it's worth noting that the default values for the sliders are going to go from 0 to 100. This doesn't exactly correspond with the default values we have for our CSS vars, which were `--spacing: 10px` and `--blur: 5px`.

What we can do is set a min and max on the `<input>` element. Probably a good idea since 100px of blur isn't necessary. I'm setting the scale from 0px to 20px of blur. By default, the slider will load at the midpoint between the min and max.

For the spacing/padding around the image, I'm going to set min to be 0px, and the max to be 50px:

```html
<input type="range" name="spacing" min="0" max="50">
<input type="range" name="blur" min="0" max="20">
```

Notice that these values don't have units—ie, no "px" suffix. An easy way to handle this is by using the [`data-` attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) available in HTML. So for each of our sliders, we can add something like `data-sizing`:

```html
<input type="range" name="spacing" min="0" max="50" data-sizing="px">`
<input type="range" name="blur" min="0" max="20" data-sizing="px">
```

Now, how will we access this data attribute?


## HTML data attributes: `dataset`
Accessing HTML data attributes is easy by using something called a [`DOMStringMap`, which has a `dataset` property](https://developer.mozilla.org/en-US/docs/Web/API/DOMStringMap). Documentation about to use the `data-` attributes is [here](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access).

Long story short, within the event handler, you can get a list of all the element's associated data attributes like so:

```js
function updateCSS(e) {
  console.log(e.target.dataset);
}
```

This returns an object showing all of the `data-` attributes on `e.target`, including the `data-` attribute's name and value.


## Now to actually update the CSS vars...
So we now have a way of accessing the value of the input when it's changed, and a way to add a unit suffix like "px" to the end of that value so CSS will know what to do with it. Let's put it together.

First, in the event handler, let's assign the suffix to a var:

```js
let suffix = e.target.dataset.suffix || '';
```

(Notice that we have the condition that if there is no `data-suffix` attribute, we're assigning the variable to be an empty string. That's because not all of our inputs—the color picker—have "px" as the unit. We don't want to append `undefined` to the input's value.)

Now...how do we select a CSS variable through JS?

Remember how we set the CSS vars on the `:root`, or document? We're going to select that whole document, then set a property of `:root` that will be based on the `name` attribute of the `<input>`'s markup.

We could take a look at the value like so:

```js
function updateCSS() {
  console.log(this.name); //would output 'blur', 'spacing', or 'colorChange' depending on the input
}
```

This value is also part of the name of our CSS variables. To set the value, we can use a property called `.setProperty()`([docs here](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty)).

This is what the entire function looks like:

```js
function updateCSS() {
  let suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}
```

So what's going on in that last line?

The first thing to see in that last line is `document.documentElement`([docs here](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement)). What's being returned with this reference is the root element of the document, our `:root`. Quick reminder that this is the selector where we defined our CSS vars:

```css
:root {
  --spacing: 25px;
  --blur: 10px;
  --colorChange: #ffc600;
}
```

Then, we're passing this value into the `.setProperty()` method:

```js
`--${this.name}`, this.value + suffix
```

We're again using the awesome [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), which allow us to include variables in strings.

The first argument we pass into `.setProperty()` is the name of the CSS variable, `--${this.name}` where `this` is referring to the `<input>` that was changed, and `.name` being the value of the name attribute on that element, which we also made the name of our CSS variable.

The second argument is the value we want to pass in. `this.value` is the value of the `<input>` on `mousemove`, and if there's a suffix—like "px"—it will get attached.

And that's how we update the value of the CSS variables 😁



## Something I learned about adding event listeners that involves `this`
So originally—and I did this twice, so I know it's something that I wasn't paying attention to (but definitely will from here on)—I didn't notice this little difference:

```js
inputs.forEach(input => addEventListener('change', updateCSS))
```
vs

```js
inputs.forEach(input => input.addEventListener('change', updateCSS))
```

Notice the difference? In the first one, I'm adding the event listener without referring to `input`. That means in the `updateCSS` function, I need to access values and other stuff like so (I'm passing in the event object as the argument):

```js
function updateCSS(e) {
  console.log(e.target.value);
  console.log(e.target.value.dataset);
}
```

In the second, I'm adding the event listener by referencing the input: `input.addEventListener`. This means that in the `updateCSS()` function, I can access values and other stuff by using `this` (I'm not passing in the event object as an argument):

```js
function updateCSS() {
  console.log(this.value);
  console.log(this.dataset);
}
```



* Note: for sliders, you can also set things like granularity, hash marks, and labels:
[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)



##Resources
<div class="resources">
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables">MDN: Using CSS custom properties (variables)</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool">MDN: Color Picker Tool</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/NodeList">MDN: NodeList</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Events/change">MDN: change event</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/Events/mousemove">MDN: mousemove event</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes">MDN: HTML5 data- Attributes</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMStringMap">MDN: DOMStringMap</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty">MDN: setProperty()</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement">MDN: document.documentElement</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">Javascript Template Literals</a></li>
  </ul>
</div>
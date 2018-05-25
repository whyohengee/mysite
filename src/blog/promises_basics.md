---
title: JS Promises, the basics
date: 2018-04-10
---

<div class="blog-header-image">
  <img src="https://media.giphy.com/media/3o6ZtauAQ2KO9KNJn2/giphy.gif" alt="I give you my word">
</div>



Promises, a cleaner, better way to handle async code, right? I wanted to gain a deeper understanding of how Promises—now [native in JavaScript](https://developers.google.com/web/fundamentals/primers/promises)—can be used to write cleaner, easier-to-read and more predictable async code.


## My questions, including confusion with terminology
One of the most intriguing things for me when I first started hearing about Promises was the `.then()` handler method. It makes clear what is happening in the chain of events that happens when handling data fetching. But I was confused—there's also a `resolve()` method...I thought it sounded a lot like what `.then()` might be doing. So I wanted to clear up confusion on terminology.

So a Promise is a type of object which has methods attached to it. One of those methods is `then()`. But a Promise will be—depending on the state of the request and respose—in one of four states.

[A promise can be](https://developers.google.com/web/fundamentals/primers/promises):

fulfilled - The action relating to the promise succeeded

rejected - The action relating to the promise failed

pending - Hasn't fulfilled or rejected yet

settled - Has fulfilled or rejected

Here's something that really helped with understanding: let's first divide the construction of a Promise from the consumption of the Promise. Let's focus on the creation first.

I'll try to break down both, keeping it as simple as possible, then go through an example I found really helpful to understand this concept.


## The basics: Creating a Promise object
Here's what it looks like:

```js
const promiseMeData = new Promise( (resolve, reject) => {
  //Let's say we have code that made a GET call, which we're storing in a variable called 'data'.
  let data;
  //If the call returned something, we call the resolve method. Otherwise, we call the reject method:
  if (data) {
    resolve(data);
  }
  else {
    reject(error)
  }
});
```

In the Promise constructor, we define a callback function with two arguments: `resolve` and `reject`.

The constructor will return a Promise object on either the success or failure of what you're trying to do.

If what you're doing is completed successfully, you call `resolve()` and pass it the results.

If what you're doing doesn't complete successfully, you call `reject()` with an error or a message.


## The basics: Consuming a Promise object
Here's what it would look like:

```js
const isThereData = () => {
  promiseMeData
    .then( (fulfilledPromise) => {
      console.log(fulfilledPromise);
    })
    .catch( (error) => {
      console.log(error.message);
    })
};
```

So we have a function that, when called, will call our Promise creation method. That method returns a Promise object, which, if the action related to the Promise was successfull, will trigger the `.then()` method with the data received.

If the action related to the Promise is not successful, we skip `.then()` and the `.catch()` method is called with an error message.


## `.then()`
Promises have the `.then()` method, which allows you to chain asynchronous operations together, so that one operation starts after the other ends.

[Here's the magic: the `then` function returns a new promise, different from the original:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

Here's an example:

```js
doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);
```

The great thing about Promises over the old method of using multiple callbacks include:

* Callbacks will never be called before the completion of the current run of the JavaScript event loop.
* Callbacks added with `.then` even after the success or failure of the asynchronous operation, will be called, as above.
* Multiple callbacks may be added by calling `.then` several times, to be executed independently in insertion order.

But chaining is a big deal. It makes for code that's composable, easy to read, and more reliable.



## Promises for dummies like me
It's hard to look at abstracted examples, but [this example](https://scotch.io/tutorials/javascript-promises-for-dummies) from [Jecelyn Yeen](https://twitter.com/JecelynYeen) really helped me grasp what's happening.

In the example, let's say you're a teen that wants a new phone. You ask your mom for a phone, represented by a Promise (the function `willIGetANewPhone`—the creation of a Promise).

To find out if you got the phone, you ask your mom (the function `askMom`—consumption of the Promise).

If your mom is happy with you, she gets you a new phone, we can chain events together, like console logging the phone details, and calling a success method to show it off.

If not, you don't get a new phone, and you get an error.

Here's the code:
```js
//Result of promise depends on:
let isMomHappy = true;

//Create a Promise object
const willIGetANewPhone = new Promise( (resolve, reject) => {
  if (isMomHappy) {
    let phone = {
      brand: `samsung`,
      color: `black`
    }
    resolve(phone);
  }
  else {
    let reason = new Error(`mom ain't happy`);
    reject(reason);
  }
});

//Create another Promise object, but this is w/in another function & will be chained in Promise consumption
function showOff(phone) {
  let msg = ` hey friend check out my new ${phone}`;
  console.log(msg);
  let newMsg = `wrapping it up`;
  return Promise.resolve(newMsg);
}

//Consume the Promise, including some chaining
const askMom = () => {
  willIGetANewPhone
    .then( (phone) => {
      console.log(`I got a new ${phone}`);
      return phone;
    })
    .then(showOff)
    .then( (fulfilled) => {
      console.log(`fulfilled: ${fulfilled}`);
    })
    .catch( (error) => {
      console.log(error.message);
    })
}

askMom();
```


But don't forget, async will still get you:
```js
//Remember async...if you don't use .then(), here's what happens:
const askMom = () => {
  //log a message before Promise
  console.log('before asking mom');
  willIGetANewPhone
    .then( (phone) => {
      console.log(`I got a new ${phone}`);
      return phone;
    })
    .then(showOff)
    .then( (fulfilled) => {
      console.log(`fulfilled: ${fulfilled}`);
    })
    .catch( (error) => {
      console.log(error.message);
    })
    //log message after Promise
    console.log('after asking mom');
}

//output:
before asking mom
after asking mom
I got a new [object Object]
hey friend check out my new [object Object]
fulfilled: wrapping it up
```





## References
<div class="resources">
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">MDN: Promises</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">MDN: Using Promises</a></li>
    <li><a href="https://developers.google.com/web/fundamentals/primers/promises">JavaScript Promises: an Introduction</a></li>
    <li><a href="https://www.youtube.com/watch?v=swdWUWtGxR4">JavaScript Promises: The Basics</a></li>
    <li><a href="https://scotch.io/tutorials/javascript-promises-for-dummies">JavaScript Promises For Dummies</a></li>
  </ul>
</div>
## async-queue-throttler

This is a helper library that enables the asynchronous throttling of function calls.  It uses promises to allow
your program flow to continue until it is necessary to wait for the throttled functions to execute.

## Example Use Case

I built this library to assist in making API calls to GitHub.  They limit calls to 60/second and this library can enable your 
application logic to ignore the limit.  The throttler will take care of it.

    // Below 60 is our max calls per minute
    var qm = new QueueManager(60);
    var asyncPromisifiedFunction = function(){
       // Does some async work and returns a promise
    }
    var throttledFn = qm.createQueuedFunction(asyncPromisifiedFunction)

    throttledFn() //returns a promise that resolves to the original function result.
    //If you called throttledFn >60/min the calls over 60 would not execute until 60 seconds had passed.

## Requirements

- Moderate ES6 support - I made use of arrow functions in some places so you'll need support for them.  I plan
on transpiling to ES5 soon.

- At this time the library only works w/ async functions that return promises.  There are currently no plans to support callbacks.

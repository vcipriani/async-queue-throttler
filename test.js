/**
 * Test code that was written to help test QueueManager functionality.  Should be moved into a proper
 * testing framework when we have one
 */
'use strict';

var should = require('chai').should()
var sinon = require('sinon');

// Hijack the clock so we can control time for the throttling
// NOTE: THIS HAS TO COME BEFORE WE IMPORT THE QUEUE OR IT USES THE REAL SETTIMEOUT
var clock = sinon.useFakeTimers();

var QueueManager = require('./index');

describe('Test Queue Throttling', function() {

  // We'll use this to track the number of function executions
  var numberOfCalls = 0;

  /**
  * Returns a promise which resolves to true after a period of time
  * @return {Promise}
  */
  var dummyAsyncFunction = function(){
    return new Promise(function(resolve){
      setTimeout(()=> {
        // Should get rid of the side effect later
        numberOfCalls++;
        resolve(true)
      }, 100);
    });
  };

  // Create new queue
  var q = new QueueManager(2);
  var throttledDummy = q.createQueuedFunction(dummyAsyncFunction);

  before(function() {
    // We do this here to get the necessary 'this' binding;
    this.clock = clock;
  });

  beforeEach(function() {
    // Reset the counter
    numberOfCalls = 0;
  });

  it('Should execute 2 times before waiting 60 seconds to execute the third', function() {
    // Queue up some calls
    throttledDummy();
    throttledDummy();
    throttledDummy();

    // The first tick is to get past the initial sleep of 1000ms because the queue was empty
    // when initialized.
    this.clock.tick(1000);
    this.clock.tick(100);
    numberOfCalls.should.equal(1);

    this.clock.tick(100);
    numberOfCalls.should.equal(2);

    // After the previous two calls, we should hit the limit and not execute the third
    // Waiting 3s is random, we just need to make sure it didn't execute
    this.clock.tick(3000);
    numberOfCalls.should.equal(2);

    // Wait 60 secs and check to make sure the 3rd executes
    this.clock.tick(60000);
    numberOfCalls.should.equal(3);
  });
});


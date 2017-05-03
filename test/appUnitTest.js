/* global it */
/* global describe */

var sinon = require('sinon');
var assert = require('assert');
var tl = require('vsts-task-lib');
var task = require('../src/task.js');
var util = require('../src/util.js');

describe('app', function () {
   'use strict';

   it('should run the task', function () {
      /* Arrange */
      var taskStub = sinon.stub(task, 'run');
      taskStub.withArgs('https://api.mobile.azure.com', "someuser/someapp", 'apikey', 'VSTS (Task:VSMobileCenterBuild)', 'v1.0');

      sinon.stub(tl, 'debug');

      var utilStub = sinon.stub(util, 'getMobileCenterEndpointDetails');
      utilStub.withArgs('serverEndpoint').returns({ apiServer: 'https://api.mobile.azure.com', apiVersion: 'v1.0', authToken: 'apikey' });

      var input = sinon.stub(tl, 'getInput');
      input.withArgs('appSlug').returns('someuser/someapp');

      var getVar = sinon.stub(tl, 'getVariable');
      getVar.withArgs('MSDEPLOY_HTTP_USER_AGENT').returns(null);

      try {      
         /*   Act   */
         // requiring the app.js file should cause the task to be run
         require('../src/app.js');
      
         /*  Assert */
         // Test that the task was called
         assert.equal(taskStub.calledOnce, true, 'task.run was not called');
         
         // Test that is was called with the correct values
         assert.equal(taskStub.getCall(0).args[0], 'https://api.mobile.azure.com', 'apiServer arg is not correct. ' + taskStub.getCall(0).args[0]);
         assert.equal(taskStub.getCall(0).args[1], 'someuser/someapp', 'appSlug arg is not correct. ' + taskStub.getCall(0).args[1]);
         assert.equal(taskStub.getCall(0).args[2], 'apikey', 'apiToken arg is not correct. ' + taskStub.getCall(0).args[2]);
         assert.equal(taskStub.getCall(0).args[3], 'VSTS (Task:VSMobileCenterBuild)', 'userAgent arg is not correct. ' + taskStub.getCall(0).args[3]);
         assert.equal(taskStub.getCall(0).args[4], 'v1.0', 'apiVersion arg is not correct. ' + taskStub.getCall(0).args[4]);

         assert.equal(input.calledOnce, true, 'tl.getInput not called ' + input.callCount);
         assert.equal(input.calledOnce, true, 'tl.getVariable not called ' + getVar.callCount);
      }
      finally {
         taskStub.restore();
         tl.debug.restore();
         tl.getInput.restore();
         tl.getVariable.restore();
      }
   });
});
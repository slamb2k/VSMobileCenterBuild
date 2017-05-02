/*
 * This is written as a self calling function so I don't have to place
 * 'use strict' in global scope.
 * This prevents problems when concatenating scripts that are not strict.
 */
(function () {
    'use strict';
    
    var tl = require('vsts-task-lib');
    var util = require('./util.js');

    /*
     * This file bootstraps the code that does the real work.  Using this technique
     * makes testing very easy.
     */

    // Contains the code for this task.  It is put in a separate module to make 
    // testing the code easier.
    var task = require('./task.js');
    
    // Get the parameter values and cache them
    let appSlug = tl.getInput('appSlug', true);
    
    util.debug("Getting endpoint details...");
    let apiEndpointData = util.getMobileCenterEndpointDetails('serverEndpoint');
    let apiToken = apiEndpointData.authToken;
    let apiServer = apiEndpointData.apiServer;
    let apiVersion = apiEndpointData.apiVersion;

    let userAgent = tl.getVariable('MSDEPLOY_HTTP_USER_AGENT');
    if (!userAgent) {
        userAgent = 'VSTS';
    }
    userAgent = userAgent + ' (Task:VSMobileCenterBuild)';

    // Call the task
    task.run(apiServer, appSlug, apiToken, userAgent, apiVersion);
}());
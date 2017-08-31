/*
 * The purpose of this file is to run from the command line.
 * This is great for integration testing without having to run
 * from a build.
 */

var cli = require('cli');
var task = require('./task.js');

cli.parse({
    apiServer: ['a', 'Mobile Center API Server', 'string', "https://api.mobile.azure.com"],
    apiToken: ['t', 'Mobile Center API Token', 'string', "STEVE"],
    ownerName: ['o', 'Mobile Center Owner Name', 'string', null],
    appName: ['n', 'Mobile Center App Name', 'string', null],
    branch: ['b', 'Source Control Branch', 'string', "master"],
    userAgent: ['u', 'User Agent', 'string', "VSTS (Task:VSMobileCenterBuild)"],
    apiVersion: ['v', 'Mobile Center API Version', 'string', "v0.1"]
});

cli.main(function (args, options) {
    if (options.apiToken === null || options.appSlug === null) {
        cli.getUsage();
        return;
    }

    // Call the task
    task.run(options.apiServer, options.ownerName, options.appName, options.branch, options.apiToken, options.userAgent, options.apiVersion);
});
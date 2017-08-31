var request = require('request-promise');
var tl = require('vsts-task-lib');
var util = require('./util.js');
var fs = require('fs');
var Q = require("q");

/*
 * The entry point for the task. This can be called by VSTS, the CLI or our test runners.
 */
function run(apiServer, ownerName, appName, branch, apiToken, userAgent, apiVersion) {
    'use strict';

    util.debug("Received argument ownerName: {0}", ownerName);
    util.debug("Received argument appName: {0}", appName);
    util.debug("Received argument branch: {0}", branch);
    
    // How many seconds do we want to wait between checking the build status
    // after we have kicked off an asynchronous build.
    const waitTime = 5;

    // The name of the zipped file downloaded with the build output from Mobile Center
    const MobileCenterBuildArtifacts = "mobile-center-artifacts.zip";

    var mobileCenterBaseUrl = `${apiServer}/${apiVersion}/apps/${ownerName}/${appName}`;
    
    // Show a lovely splash screen with majestic unicorn. It's magic and stuff...
    util.showSplashScreen();

    // Construct build definition Url
    var buildDefinitionUrl = `${mobileCenterBaseUrl}/branches/${branch}/builds`;

    util.debug("Sending POST request to {0}", buildDefinitionUrl);

    var options = {
        url: buildDefinitionUrl,
        method: 'POST',
        headers: {
            "X-API-Token": apiToken,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };
    
    request(options)
        .then(function (body) {
            // Parse the response so we can get the id of the new version
            var buildDefinitionResponse = JSON.parse(body);
            var buildId = buildDefinitionResponse.id;

            return buildId;
        })
        .then(function (buildId) {
            util.debug("Starting build for Build Id: {0}", buildId);
            return waitForCompletion(buildId);
        })
        .then(function (buildId) {
            util.debug("Build is complete. Retrieving built output...");
            return downloadOutput(buildId);
        })
        .catch(function(err) {
            tl.error(err);
        });

    function waitForCompletion(buildId) {
        return Q.delay(waitTime * 1000)
            .then(function () {
                return checkForCompletion(buildId)
            })
            .then(function (finished) {
                return finished === true ? buildId : waitForCompletion(buildId);
            });
    }

    function checkForCompletion(buildId) {
        util.debug("Getting build detail for Build Id: {0}", buildId);

        // Construct build definition Url
        var buildDetailUrl = `${mobileCenterBaseUrl}/builds/${buildId}`;

        var options = {
            url: buildDetailUrl,
            headers: {
                "X-API-Token": apiToken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        return request(options)
            .then(function (body) {
                // Parse the response so we can get the build detail
                var buildDetail = JSON.parse(body);

                util.debug("Current build status: {0}", buildDetail.status);
                return (buildDetail.status === "completed");
            });
    }

    function downloadOutput(buildId) {
        util.debug("Getting build output for Build Id: {0}", buildId);

        // Construct build output Url
        var buildOutputUrl = `${mobileCenterBaseUrl}/builds/${buildId}/downloads/build`;

        var options = {
            url: buildOutputUrl,
            headers: {
                "X-API-Token": apiToken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        return request(options)
            .then(function (body) {
                // Parse the response so we can get the build detail
                var buildOutputDetail = JSON.parse(body);
                return (buildOutputDetail.uri);
            }).then(function (uri) {
                var file = fs.createWriteStream(MobileCenterBuildArtifacts);
                var downloadRequest = request(uri).pipe(file);
                downloadRequest.on('error', function (err) { util.debug("Error downloading build output: {0}", err); });
                downloadRequest.on('finish', function () { file.close(function () { util.debug("Download complete: {0}", MobileCenterBuildArtifacts); }) });
            });
    }
}

/*
 * Exports the portions of the file we want to share with files that require 
 * it.
 */
module.exports = {
    run: run
};
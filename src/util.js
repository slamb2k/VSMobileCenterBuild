/*
 * This file contains many common functions for use creating Visual Studio Team
 * Service tasks in Node.js.
 */

var fs = require('fs');
var os = require('os');
var path = require('path');
var yazl = require('yazl');
var unzip = require('unzip2');
var tl = require('vsts-task-lib');

function unzipFile(file, dir, callback) {
   var stream = fs.createReadStream(file).pipe(unzip.Extract({ path: dir }));
   stream.on('close', callback);
}

function zipFile(file, dir) {
   debug('starting zipFile {0}', dir);

   var allFiles = tl.find(dir);
   var zipFile = new yazl.ZipFile();
   
   // because Windows...
   dir = dir.replace(/\\/g, '/');

   allFiles.forEach(function (element, index, array) {
      var stats = fs.statSync(element);
      if (stats.isFile()) {
         // We want to start the zip at webapps. The replace make
         // sure any leading folders are removed.
         var location = element.replace(dir, 'webapps');

         debug('adding {0} at {1}', element, location);
         
         zipFile.addFile(element, location);
      }
   });

   debug('Zipping files');
   zipFile.outputStream.pipe(fs.createWriteStream(file)).on("close", function () {
      debug("Zip created.");
   });

   zipFile.end();
}

/*
 * Returns and array of files that match the path passed in.  The path passed
 * in can be in mini match format.
 */
function findFiles(path, baseDir) {
   'use strict';

   var matchingFiles = [path];
    
   // If they don't provide a base dir just use the current folder
   baseDir = baseDir || '.';

   debug('baseDir: {0}', baseDir);

   if (path.indexOf('*') >= 0 || path.indexOf('?') >= 0) {
      debug('Searching for file using {0}', path);
      var allFiles = tl.find(baseDir);
      matchingFiles = tl.match(allFiles, path, { matchBase: true });
   }

   if (!matchingFiles) {
      tl.warning('No files found.');
      return null;
   }

   return matchingFiles;
}

/*
 * Deletes a folder recursively
 */
function rmdir(folder) {
   'use strict';

   // Check that the folder exists. If it does not just return.
   if (fs.existsSync(folder)) {
        
      // Get a list of all the files and directory names in this folder.
      fs.readdirSync(folder).forEach(function (file, index) {
            
         // Join the file/folder name with the base folder.
         var curPath = path.join(folder, file);
            
         // Determine if we are working with a directory or a file.
         if (fs.lstatSync(curPath).isDirectory()) {
            // If it is a directory simply call this function again
            // to walk all files and folders.
            rmdir(curPath);
         } else {
            // Once you reach a file delete it.
            fs.unlinkSync(curPath);
         }
      });
        
      // Now we can delete the folder now that it is empty.
      fs.rmdirSync(folder);
   }
}

/*
 * Allows you to use C# syntax for string format i.e. 
 * String.format('{0} {1}', var1, var2);
 */
String.format = function () {
   'use strict';

   return format(arguments);
};

/*
 * Private format function to support C# string.Format syntax
 */
function format(args) {
   'use strict';

   var s = args[0];
   for (var i = 0; i < args.length - 1; i++) {
      var reg = new RegExp('\\{' + i + '\\}', 'gm');
      s = s.replace(reg, args[i + 1]);
   }

   return s;
}

/*
 * Allows you to use C# string.Format syntax to write debug messages.
 */
function debug() {
   'use strict';

   tl.debug(format(arguments));
}

/*
 * Allows you to use C# string.Format syntax to write info messages.
 */
function info() {
   'use strict';

   console.info(format(arguments));
}

/*
 * Retrieves the details from the service endpoint defined for Mobile Center in VSTS
 */
function getMobileCenterEndpointDetails(endpointInputFieldName) {
    'use strict';

    //var errorMessage = tl.loc("CannotDecodeEndpoint");
    var errorMessage = "Can't decode endpoint.";

    var endpoint = tl.getInput(endpointInputFieldName, true);
    info(`Endpoint: ${endpoint}`);
    
    if (!endpoint) {
        throw new Error(errorMessage);
    }

    let url = tl.getEndpointUrl(endpoint, false);
    //let url = "https://api.mobile.azure.com/v0.1/apps/silamb/magicunicorn.ios-01";
    info(`URL: ${url}`);
    let apiServer = url.substr(0, url.lastIndexOf('/'));
    info(`API Server: ${apiServer}`);
    let apiVersion = url.substr(url.lastIndexOf('/') + 1);
    info(`API Version: ${apiVersion}`);
    var authToken = tl.getEndpointAuthorizationParameter(endpoint, 'apitoken', false);

    if (!authToken)
    {
        info("NO AUTHTOKEN");
    }

    return {
        apiServer: apiServer,
        apiVersion: apiVersion,
        authToken: authToken
    };
}

/*
 * Shows an ASCII art splash screen because it looks cool and people love Unicorns.
 */
function showSplashScreen() {
    'use strict';

    console.log("                                                                                    ");
    console.log("                                                                                    ");
    console.log("                  /((((((\\\\                                                       ");
    console.log("          =======((((((((((\\\\\                                                    ");
    console.log("               ((           \\\\\\\                                                 ");
    console.log("               ( (*    _/      \\\\\\\                                              ");
    console.log("                 \    /  \      \\\\\\________________                              ");
    console.log("                  |  |   |       </                  ((\\\\                         ");
    console.log("                  o_|   /        /                      \ \\\\    \\\\\\\           ");
    console.log("                       |  ._    (                        \ \\\\\\\\\\\\\\\\         ");
    console.log("                       | /                       /       /    \\\\\\\     \\        ");
    console.log("               .______/\/     /                 /       /         \\\               ");
    console.log("              / __.____/    _/         ________(       /\                           ");
    console.log("             / / / ________/`---------'         \     /  \_                         ");
    console.log("            / /  \ \                             \   \ \_  \                        ");
    console.log("           ( <    \ \                             >  /    \ \                       ");
    console.log("            \/      \\_                          / /       > )                      ");
    console.log("                     \_|                        / /       / /                       ");
    console.log("                                              _//       _//                         ");
    console.log("                                             /_|       /_|                          ");
    console.log("                                                                                    ");
    console.log("                           https://simonlamb.codes                                  ");
    console.log("                                                                                    ");
    console.log("                                                                                    ");
}

/*
 * Exports the portions of the file we want to share with files that require 
 * it.
 */
module.exports = {
   rmdir: rmdir,
   debug: debug,
   info: info,
   findFiles: findFiles,
   unzipFile: unzipFile,
   zipFile: zipFile,
   getMobileCenterEndpointDetails: getMobileCenterEndpointDetails,
   showSplashScreen: showSplashScreen
};
# VSMobileCenterBuild
Start a build in Azure Mobile Center, wait for it to finish and retrieve the build output. This build output can then be published as artifacts against the current build.

# generator-team

## Build status
![](https://silamb.visualstudio.com/_apis/public/build/definitions/e679d9d5-a4ae-4f40-aad1-b2a04fb59e94/25/badge)

## See it in action
[Ignite New Zealand 2016](https://channel9.msdn.com/Events/Ignite/New-Zealand-2016/M328)

## Capabilities
VSMobileCenterBuild is a custom build task that allows a build definition to trigger a build in Visual Studio Mobile Center. The build task will loop repeatedly after triggering the build and continuously check the build status. Once the build status is complete then the resulting artifacts will be downloaded to a file **named mobile-center-artifacts.zip** in the current working directory. This file should be published as artifacts for the current build using the native [publish build task](https://www.visualstudio.com/en-us/docs/build/steps/utility/copy-and-publish-build-artifacts).

It allows you to deploy to the following platforms:
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/web/)
- [Docker](https://www.docker.com/)

## Requirements
- [Team Foundation Server 2017](https://www.visualstudio.com/downloads/) or [Visual Studio Team Services Account](https://app.vsaex.visualstudio.com/profile/account)
- [Visual Studio Mobile Center Subscription](https://mobile.azure.com)
   - [Service Principal](http://donovanbrown.com/post/Creating-an-Azure-Resource-Manager-Service-Endpoint-in-new-Portal)

## Install
You can read how to use it at [simonlamb.codes](http://simonlamb.codes/). 

## To test
`npm test`

## To generate Cobetura format coverage
`npm run coverage`

## Debug
You can debug the generator using [VS Code](http://code.visualstudio.com/). You need to update the launch.json. Replace any value in [] with your information.  Use [npm link](https://docs.npmjs.com/cli/link) from the root folder to load your local version.
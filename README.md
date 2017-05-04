# VSMobileCenterBuild
Start a build in Azure Mobile Center, wait for it to finish and retrieve the build output. This build output can then be published as artifacts against the current build.

## Build status
![](https://silamb.visualstudio.com/_apis/public/build/definitions/e679d9d5-a4ae-4f40-aad1-b2a04fb59e94/25/badge)

## Capabilities
VSMobileCenterBuild is a custom build task that allows a build definition to trigger a build in Visual Studio Mobile Center. The build task will loop repeatedly after triggering the build and continuously check the build status. Once the build status is complete then the resulting artifacts will be downloaded to a file **named mobile-center-artifacts.zip** in the current working directory. This file should be published as artifacts for the current build using the native [publish build task](https://www.visualstudio.com/en-us/docs/build/steps/utility/copy-and-publish-build-artifacts).

## Requirements
- [Team Foundation Server 2017](https://www.visualstudio.com/downloads/) or [Visual Studio Team Services Account](https://app.vsaex.visualstudio.com/profile/account)
- [Visual Studio Mobile Center Subscription](https://mobile.azure.com)
   - [Configure a build](https://docs.microsoft.com/en-us/mobile-center/build/) in Mobile Center and [connect to a source control repository](https://docs.microsoft.com/en-us/mobile-center/build/connect)
        - [Visual Studio Team Services](https://azure.microsoft.com/en-au/services/visual-studio-team-services/)
        - [GitHub](https://github.com/)
        - [Bitbucket](https://bitbucket.org/)


## Install
You can read how to use it at [simonlamb.codes](http://simonlamb.codes/). 

## To test
`npm test`

## To generate Cobetura format coverage
`npm run coverage`

## Debug
You can debug the generator using [VS Code](http://code.visualstudio.com/). You need to update the launch.json. Replace any value in [] with your information.  Use [npm link](https://docs.npmjs.com/cli/link) from the root folder to load your local version.
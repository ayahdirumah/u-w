## Getting Started

1. Make sure your Node.js version is ^10
2. Please follow **[this React Native getting started docs](https://facebook.github.io/react-native/docs/getting-started)** under **React Native CLI Quickstart** tab before run any scripts
2. Run `yarn` to install dependencies
3. Run `npm install -g code-push-cli` to install Code Push CLI
4. Run `code-push register` to login to [App Center](https://appcenter.ms/)
5. Run `code-push app add YourAppNameAndroid android react-native` to add app on App Center for Android app
6. Run `code-push app add YourAppNameIos ios react-native` to add app on App Center for iOS app

 _*don't forget to **save** your **Deployment key**_

7. Follow setup instruction for each device here: [Android](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md), [iOS](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md), [Windows Mobile](https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-windows.md)
8. Paste your Android and iOS **staging** deployment key in `packages/mobile/android/app/src/main/res/values/strings.xml` 

```
<string name="CodePushDeploymentKey" moduleConfig="true" translatable="false">deployment-key-here</string>
```

_*you can change to production deployment key later_.


## Development & Preview

### Web

Run `yarn web` to preview on web

### Desktop

Run `yarn desktop` to preview on desktop

#### Follow [this React Native instructions](https://facebook.github.io/react-native/docs/running-on-device) before run RN on _mobile_ or _physical device_ script below

### Android

Run `yarn android` to preview on android

### iOS

_Make sure you run this script before run on iOS_ `cd ios && pod install`

Run `yarn ios` to preview on iOS


## Hot Code Push

### Test Desktop App (Electron AutoUpdater)

1. Make new repository on GitHub and push this repo
2. Change `package.json` repository url on root folder with your new repo

```
...
"repository": {
  "type": "git",
  "url": "https://github.com/yourGitHubUsername/yourRepositoryName.git"
},
...
```
3. Change `dev-app-update.yml` owner & repo on root folder with your new repo
```
owner: yourGitHubUsername
repo: yourRepositoryName
provider: github

```
4. Create personal access token on GitHub. You can follow [the instructions here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).
5. Run `export GH_TOKEN=yourGithubPersonalAccessToken` via bash on your root folder
6. Run `export CSC_IDENTITY_AUTO_DISCOVERY=false` to disable code signing during the build process on Mac
7. Run `yarn desktop:deploy` to build and publish your app on GitHub release (see **All Script** to choose specific platform)
8. Go to your GitHub repository page, click **"releases"** tab. Click on **"Edit"**, and then **"Publish"** to finalize the release
9. Increment the **"version"** number in `package.json` and make any visual change so you can notice the update easily
```
...
"version": "0.0.2",
...
```
10. Run `yarn desktop:deploy` again and finalize your release
11. Download, install and run the previous version of your app from GitHub release page. Or you can decrease **"version"** number in `package.json` and undo any change on your repo. Then run `yarn desktop`.
12. After the new version of your app is downloaded, click **"Relaunch"** and wait until it open again with the latest version.

### Test Mobile App (AppCenter.ms Code-Push)

1. Run `yarn android` or `yarn ios`
2. "Disable Fast Refresh" in the React Native developer menu. See documentation [here](https://facebook.github.io/react-native/docs/debugging).
3. Make any visual change so you can notice the update easily
4. Run `code-push release-react YourAppNameAndroid android` (for iOS use **"YourAppNameIos ios"**)
5. Wait a while. You will see update popup on your mobile screen.

## Production

### Android APK Debug

1. Run `yarn android:clear` to clear cache gradlew
2. Run `yarn android:build-w` to build APK on Windows (for Mac use `yarn android:build-m`)
3. APK Debug created on the following folder `android/app/build/outputs/apk/`

## References & Usefull Link

### AppCenter.ms Code-Push

- [React Native: Code Push_(Part 1) Android Staging](https://www.youtube.com/watch?v=tuQO0T5vtbc)
- [React Native: Code Push_(Part 2) Android Production](https://www.youtube.com/watch?v=oIL7Taoly84)
- [React Native: Code Push_(Part 3) iOS Staging](https://www.youtube.com/watch?v=HRB3purgRdU)
- [React Native: Code Push_(Part 4) iOS Production](https://www.youtube.com/watch?v=0QmLWH5otZc)
- [How to rapidly update your React Native android project using Code Push without app store upload](https://www.youtube.com/watch?v=Jo7AV5etOsA)
- [Code Push API](https://github.com/microsoft/react-native-code-push/blob/master/docs/api-js.md#codepush)

### Electron.js AutoUpdater

- [Electron Documentation - autoUpdater](https://electronjs.org/docs/api/auto-updater)
- [Electron Builder Auto Update](https://www.electron.build/auto-update)
- [Creating and deploying an auto-updating Electron app for Mac and Windows using electron-builder](https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6)

### Production

- [Generate APK debug pada React-Native](https://medium.com/@rey1024/generate-apk-debug-pada-react-native-75c4d538d6df)

## All Script

- Run `yarn` to install dependencies

- Run `yarn web` to preview on web
- Run `yarn web-build` to build web version

- Run `yarn desktop` to preview on desktop
- Run `yarn desktop-build` to build desktop app for all platform (Mac, Windows & Linux) ***this script only support on Mac**
- Run `yarn desktop-build-m` to build desktop app for Mac only ***this script only support on Mac**
- Run `yarn desktop-build-w` to build desktop app for Windows only
- Run `yarn desktop-build-l` to build desktop app for Linux only

- Run `yarn makecert-w` to make certivication desktop app for Windows only ***this script only support on Windows**

- Run `yarn desktop-deploy` to publish release to GitHub for all platform (Mac, Windows & Linux) ***this script only support on Mac**
- Run `yarn desktop-deploy-m` to publish release to GitHub for Mac only ***this script only support on Mac**
- Run `yarn desktop-deploy-w` to publish release to GitHub for Windows only
- Run `yarn desktop-deploy-l` to publish release to GitHub for Linux only

- Run `yarn android` to preview on android
- Run `yarn ios` to preview on iOS

- Run `yarn clear` to clear dependencies and clear cache for Mac only ***this script only support on Mac**
- Run `yarn clear-w` to clear dependencies and clear cache for Windows only
- Run `yarn clear-a` to rebuild gradle Android

- Run `yarn uninstall-a` to uninstall app on Android device

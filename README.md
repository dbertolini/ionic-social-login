# Ionic and Firebase Social Authentication Starter

This is a starter template for social authentication, it offers:

* Login Page.
* Home Page.
* Profile Page.
* Authentication Provider.

In the authentication provider we use both Google and Facebook login processes.

## Description

The app has a login screen that allows the user to sign-in with either Facebook or Google, once the user signs in, the app gets redirected to the home page.

Once on the home page we have a profile button that users can click to go to the profile page.

## How to use

Open your terminal, navigate to this folder and run `npm install`, it will install all the node packages you need.

Next, go to https://console.firebase.google.com and look for your project, once you have your project opened in the **Overview** tab click the "Add Web App" to get your Firebase credentials.

Replace the `firebaseConfig` object inside `app.module.ts` with the credentials you just got from Firebase.

Now you will need to get your Google and Facebook credentials

## Getting your google credentials:

To get your Google credentials working the first thing we'll do is to create both iOS and Android apps in the google developers console.

### Generate iOS app

First iOS, go here: https://developers.google.com/mobile/add?platform=ios&cntapi=signin and start creating your iOS app.

It will ask you for the app name, when you start typing a name it will display your Firebase apps, pick the one where you got the credentials for the previous step.

Then it will ask you for an iOS Bundle ID, to get it, go into your app’s config.xml file and copy the package id you’re using, it’s the one that looks like com.ionicframework.something (_by the way, I strongly suggest you change it to something more custom to your project_).

Then it’s going to ask you to enable Google Sign-In, just click to generate and then it will show a big button that says Generate Configuration Files, go ahead and click it, it will let you download your **GoogleService-Info.plist** file.

### Generate Android app

You'll do the same process for Android here: https://developers.google.com/mobile/add?platform=android&cntapi=signin

When you link the account it’s going to ask you to enable Google SignIn, but this process is a bit (actually a lot) different that what we just did with iOS, you need to generate an Android Signing Certificate SHA-1 and pass it to the form.

Getting the SHA-1 signing certificate requires a bit of command line work, I’m going to do my best to make it as simple as possible.

There are 2 certificate signings you need, we’re going to do the first one right now, and you’re going to do the second one on your own if you are going to publish your app to Google Play (I’ll show you how you’ll do it).

The first one is the debug certificate, we’re going to get it to make sure everything works when we’re developing the app, since we’re using an un-signed apk to run it in our android devices.

To get it, you’re going to open your terminal and type:

```bash
$ keytool -exportcert -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
```

Where ~/.android/debug.keystore is where 99,99% of the time you’ll find it, if not, check your android SDK install to see where it is.

When you run that command, it’s going to ask you for the keystore password, the default one is **android**.

From the output copy the SHA1 certificate fingerprints and paste them into the Google Developers form, then click on Enable Google Sign-In, and that’s it, you can click on generate config files, but we’re not going to need them.


### Install the Cordova Plugin

We will use: https://github.com/EddyVerbruggen/cordova-plugin-googleplus

So go ahead and open the terminal and type:

```bash
$ cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=myreversedclientid
```

Where we’re going to replace `myreversedclientid` with the reversed version of the client id.

To get your `REVERSED_CLIENT_ID` go into the API Manager for the Google Developers Console and select the Credential for your project: https://console.developers.google.com/apis/credentials

When you choose your project and click on credentials it will show you android, iOS, and web credentials, copy the web client id, it's the one that looks like this:

`com.googleusercontent.apps.THE_REST_OF_YOUR_ID_HERE`

And use it in the plugin instalation.

After you install it run:

```bash
$ cordova prepare
```

All that is left is to enable Google Authentication inside Firebase, so go to your Firebase console, select your project, go to the authentication tab, and select sign-in methods, enable Google and use your `REVERSED_CLIENT_ID` there.

### Facebook Authentication

First thing you need is to go to https://developers.facebook.com/apps and create a new app (or use your existing app), it will ask you to generate a new app id, click it, it will show you your app id.

You'll use those when installing the plugin:

```bash
$ ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="123456789" --variable APP_NAME="myApplication"
```

Replace the app ID and name inside the command.

#### Add Platforms

Go back to your Facebook developers console and inside your app click on add platforms, create both android and iOS apps, in the ID input always put the package id we have in `config.xml`.

Now go back to Firebase console and in sign-in methods enable Facebook authentication, it will ask you for app ID and Secret, you know where to find those now :)
# About

HisabKitab is an app for tracking project expenses. The following video shows how it works.



<video src="https://github.com/user-attachments/assets/e801783a-a3f8-4984-b435-b56e3114b3a8"></video>



## Tech Stack

HisabKitab is built with Electron and React. You'll need a Node version > 18 to build it on your machine.

## Where is the Data stored?

By default the data is stored in a directory called `HisabKitab` inside `Dropbox` inside the user's home directory.

For windows the home directory is usually:

```
C:\users\{username}
```

On MacOS and Linux the home directory is often:

```
/users/{username}
```

To change the default directory, you can simply change the `DATA_DIR` constant in the file `./src/constants.ts`.

## Why Dropbox Directory?

The default directory is `{userhome}/Dropbox` because if you install and sign up for dropbox and have your Dropbox folder in that location, your data will be in sync with your Dropbox account. That means that if you for some reason lose your data on your own machine, you can alway download it from your dropbox account.

## How to Start in Development mode

Here's how to run it on your local machine in development mode. Make sure you have node version > 18 installed on your computer.

1. Create a directory called `Dropbox` inside your home directory and then create directory called `HisabKitab` inside it.
2. Clone the repo anywhere in your file system.
3. Navigate to the repo from command line and run `npm install`
4. Then run `npm start`.

## How to Build.

Same instructions as above apply except that for the last step you run `npm run package` instead. This will build the app for your platform. The app can be found inside `./out` in the repo.

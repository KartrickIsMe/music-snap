# What Is Music Snap
An [Capacitor](https://capacitorjs.com) powered app that downloads videos/audios, via [YTDLLIB](https://github.com/yausername/youtubedl-android).

Special Thanks to [Yausername](https://github.com/yausername) for his amazing library.
# Getting started
Installation, if you don't have basic dev.
## Install Git:
For debian based Linux:
```
sudo apt update
```
```
sudo apt install git -y
```
For windows with winget:
```
winget install --id Git.Git -e --source winget
```
Then reopen your terminal
or you can just download [Git for Windows](https://git-scm.com/install/windows).
## Clone the repository:
After installation,
For Windows and Linux:
```
git clone https://github.com/KartrickIsMe/music-snap
```
## Install NodeJs:
For Linux with NVM:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Then refresh your terminal:
```
source ~/.bashrc
```
or if you run zsh:
```
source ~/.zshrc
```
For Windows with NVM, download the [latest one](https://github.com/coreybutler/nvm/releases) and install it.
After you have installed NVM,
for Windows and Linux:
```
nvm install --lts
```
Go into the cloned repository directory
For Windows and Linux:
```
cd music-snap
```
```
npm install
```
## Install Java:
Fow windows download [Java JDK 21](https://download.oracle.com/java/21/archive/jdk-21.0.10_windows-x64_bin.exe) and install it.
For debian based linux:
```
sudo apt update
```
```
sudo apt install openjdk-21-jdk -y
```
# Running The Project
Copy the web assets to the app:
```
npx cap sync android
```
## Directly
If you have [android studio](https://developer.android.com/studio) installed:
```
npx cap open android
```
You can also import the music-snap/android directory in Android studio as a project and run it.

You can run directly if you have necessary Android SDK or Android VM image from Android Studio:
```
npx cap run android
```

## Building The App
When running with Android Studio, it automatically generates the app in:
`android/app/build/outputs/apk/debug` 
or 
`android/app/build/outputs/apk`
from where you can copy it to your phone.

Go to music-snap/android directory 
On Windows cmd:
```
gradlew assembleDebug
```
On Linux:
```
./gradlew assembleDebug
```
The  generated app will be here `android/app/build/outputs/apk/debug`

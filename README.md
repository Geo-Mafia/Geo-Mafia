# Geo-Mafia

Geo-Mafia is a real-time mafia game played in real life using players' real-time geo-locations

## 1) How to Compile
After cloning the repository, run the following commands to install necessary packages:
```bash
cd appGeo
npm install
```
Then, install all necessary dependencies as listed in https://docs.nativescript.org/environment-setup.html. For MacOS users, you may install
```bash
brew install ruby@2.7
brew link ruby@2.7
sudo gem install cocoapods
sudo gem install xcodeproj
python3 -m pip install --upgrade pip
python3 -m pip install six
npm install -g nativescript
```
for the iOS simulator. Check that your device is configured correctly by running 
```bash
tns doctor ios
```
### Apple Silicon ARM64 Processors (M1, M2) 
There is compilation error when you do the commands above. The error is not fixable from our side, because it seems to be a human error coming from the installation. **Therefore, ARM64 Processors users must do the followings.** This is recommended to be done between ```npm install``` and ```tns run ios```, but it is okay even if  you fix it after the last command ```tns run ios```. It just will print out error that looks like this:
```
** BUILD FAILED **

Unable to apply changes on device: F9C7C679-89F7-429B-A5F7-DD053033752A. Error is: Command xcodebuild failed with exit code 65.
```
If you see this error, then go to ```GeoApp/App_Resources/iOS/Podfile``` and delete all the contents, replace by copy pasting the following:
```
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings.delete 'IPHONEOS_DEPLOYMENT_TARGET'
    end
  end
end
```
It may seem like they are the same content, but there are indentation errors that cause the compilation problems for ARM64 users. 

### Firebase Credentials
Go to slack and download the GoogleService-Info.plist file and add that to the directory appGeo/App_Resources/iOS/
(For TAs or Professor, we'll email the file). This is to keep the credentials secure, and not exposed to the public. 

## 2) How to Run
Once you installed everything and the command above confirms that you have configured everything correctly, you may run the command 
```bash
tns run ios
```
to see the app. 

When running the app, you should see a single line "Google-signin", which when clicked will lead you to the google signin page. Following this you should be able to signin and information based on the signin will be console logged.

 
Possible bugs listed below.

Hopefully no errors appear, but if they do here are some steps you can take to bugfix them.
Follow https://docs.nativescript.org/environment-setup.html with your device + iOS if any errors pop up.
Try to run :
```
tns run ios
```

If it fails, Delete the node_modules folder in appGeo.
Then run :
```
npm install
```
Go to appGeo/platforms/iOS/Podfile and delete ALL the text in the file.
Then run :
```
tns run ios
```
You can also configure your iOS simulator setting by using the command 
```
tns doctor ios
```
You can also theoretically deploy to your device by plugging in your phone then finding the device with
```
tns device ios --available-devices
```
and select it to run with
```
tns device ios --device <device ID>
```

If something else happens which prevents you from running the program let us know.

### Google Logins
After making sure the simulator runs above, by following the aforementioned steps, and the app runs. As of now, there should be some text "Google sign-in" when you click on it, leads you to a google sign in page. In the next iteration, the UI will be changed by the frontend team and linked to individual players.

## 3) How to play

In order to play the game, you must first log into the game. Once you have joined the game, the first player to have logged in will be made the admin. The admin should have a tab labeled **Manage Game** in which there is a start game button. You may not start the game with less than 5 players.

Once the game starts, each player will be assigned either a civilian or a killer role. Killers will be able to kill players in the same bubble as them. Bubbles are based on buildings on campus. If you are not testing on a phone, you should make sure to set a custom location through your iOS simulator.

All players have the ability to check their location and to take snapshots. These should show the bubble they're in and the players with them.

The game cycle should be set up on a fifteen minute cycle, with a 5 minute voting window for testing purposes. During the voting time, each player should vote for who they want to vote out. That player will be ejected when the voting period ends. The admin also has buttons to manually trigger these events, but these are discouraged to use unless something isn't working, as they will run into issues with the timers.

Removing players from the game isn't currently built into the game, so if you want to have less accounts in the game, please let us know. 

Please email one of our members if you have an issue. Noah Klowden (noahklowden@uchicago.edu) can help if there are any database issues.

# Geo-Mafia
Geo-Mafia is a real-time mafia game played in real life using players' real-time geo-locations

## iOS Simulator
Run the following commands to install necessary packages:
```bash
cd appGeo
npm install
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
Then run :
```
tns run ios
```

### iOS Bugfixing
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
If something else happens which prevents you from running the program let us know (Kyu & Calvin).

## Google Logins
After making sure the simulator runs above, by following the aforementioned steps, and the app runs. As of now, there should be some text "Google sign-in" when you click on it, leads you to a google sign in page. In the next iteration, the UI will be changed by the frontend team and linked to individual players.

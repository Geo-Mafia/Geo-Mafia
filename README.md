# Geo-Mafia
Geo-Mafia is a real-time mafia game played in real life using players' real-time geo-locations

## iOS Simulator
Run the following commands after installing necessary packages:
```bash
cd appGeo
npm install
```
Go to slack and download the GoogleService-Info.plist file and add that to the directory appGeo/App_Resources/iOS/
(For TAs or Professor, we'll email the file)
Then run :
```
tns run ios
```

## Bugfixing
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
If something else happens which prevents you from running the program let us know (Kyu & Calvin).

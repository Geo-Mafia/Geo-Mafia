# Geo-Mafia
Geo-Mafia is a real-time mafia game played in real life using players' real-time geo-locations

# Milestone 4.A

## 1) A brief description about what you plan to implement in the 2nd iteration.
### Frontend

We intend to add the game timer and events such that the game start functionality, voting events, and end conditions can be met. We also intend to make the Snapshot Class functional so that we can integrate all things (player, map, chat, snapshot) and run them within the game logic of the game. Other implementation is the UI for the actual app where he we note that there is not _explicit_ unit testing that we can do; but there are acceptance & requirements tests that we've thought off for our app to be usable.

### Backend
We plan to implement chatting between players through firebase. When a snapshot is taken, the location will be shared to all players again through firebase. Also when the location of all players will be displayed on the map and sent to every player during the game.
## 2) A brief description about how the work will be divided among all pairs of people in your team.
### Frontend
1. Timer/Game Event Scheduling - Noah
2. Working on certain UI parts(Chat and Location) - Jose + Nanci
3. Snapshot Declaration and Tests - Annabelle + Fatimah
   * After finishing Snapshots (ideally won't take too long to finish implementation) Annabelle will help out with the UI 
### Backend
1. Chat firebase interactions - Calvin, Jason, Kyu
2. Location firebase interactions - Jason, Kyu
3. Map firebase interactions - Calvin
## 3) Unit test cases 
(Note : Include tests from iteration 1, and mention the new tests from iteration 2)

### Frontend
Here _new_ tests from iteration 2 will be:
* tests that handle game voting and killing that occurs in the game (can find this in game.spec.ts)
   * Extra detail: These unit tests added tests different stages of the game that could and _would_ occur in regular usage of our game such as: when killers win, when civilians win, when people are killed off but the game is still in Progress, how many Civilians and Killers are left.
* tests about Snapshot functionality (can find this in snapshot.spec.ts)
   * Extra detail: One of the things that the unit tests really capture is the following scenario. Consider a killing happeens in Bubble A and snapshot _alpha_ captures player1,2,& 3 to be in the bubble when it occurred. We want to make sure that when the bubble gets modified later on (let's say player1 leaves the bubble), that snapshot _alpha_ has a *different* memory location and still retains its information (i.e. that player1,2,&3 were preseent when killing occurred). This is achieved by doing a deep copy of the bubble information to memory.
* further tests about map reorganization that has been done (mixed/improved with previous unit test in map_tests.spec.ts)
* Tests for testing the new functionality for the game rules.

As mentioned in the brief description of what we plan to implement, UI is one of the items. For this, our description of testing is a working model of the game (not necessarily with pretty graphic as we would like). This can include things like first just listing out the chat content for the player to see rather than having it in a pretty overlay with border, details, etc. An interface where players can check who else is in their bubble, and if they are the killer, kill another player successfully. Geolocation accurately tracking players and mapping that to bubbles (just have to see the bubble, doesn't have to be fine detail of map). And that the game can end when condition is fulfilled (just a message in the chat would be fine for notifying players).
### Backend
1) Firebase has been configured to work with this repository and communication is confirmed. 
2) Firebase API has been setup and documented. 
3) Google logins have been setup and confirmed to be working.
4) Firebase message sending has been confirmed to be working (For chat, location and map)

## 4) Environment Setup (See Below)
# Milestone 3.B 
(I'm going to delete this later just for reference - Like take unit tests from here. After everyone is done, I'll consolidate this into one section)

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

## 3) How to Test
After installing everything from above, you need to configure project for unit testing on the testing framework we're using, QUnit. Then run the commands:

```bash
tns test init --framework qunit
tns test ios
```

## 4) Acceptance Tests
### Frontend 
No additional inputs required for map tests.


### Backend
Connection should be seen simply by running Unit Tests as mentioned in 3 above. 4/4 QUnit Tests should pass.



## 5) Text Description of what has been Implemented
### Frontend
1) The Player Class (and the subclasses of Civilian and Killer) have been declared and implemented. This includes the interaction between a Player and Chat Object where the Player wants to send a message to a specific Chat and _every_ player who is currently a part of that Chat will be able to retrive the message
2) The game class has been declared and implemented. It is able to manage the list of players involved in the game, chats in the game, and all snapshots taken.
3) The bubble class has been implemented and should have functionality for creating bubbles and adding, removing, and listing players. A specific campus map bubble has been initialized and there should be some UI functionality for seeing bubbles and who is in them.


### Backend
1) Firebase has been configured to work with this repository and communication is confirmed. 
2) Firebase API has been setup and documented. 
3) Google logins have been setup and confirmed to be working.


## 6) Who did What
### Frontend
1) Player Declaration and tests - Annabelle & Jose.
2) Chat Declaration and tests - Jose.
3) Game Logic - Annabelle & Noah.
4) Map and Bubble - Fatimah & Nanci

### Backend
1) Firebase Configuration - Kyu & Calvin.
2) Firebase API/Documentation - Kyu & Jason. 
3) Google Login/Authentication through Firebase (Also Button to test Google login) - Calvin & Jason.

## 7) Changes
### Frontend
1) Added Chats into this implementation when previous this was left for for next implementation cycle.
2) Developed UI features for bubbles.
3) Implemented all functions for game logic beyond the start and end game handling, which have been planned out.


### Backend
1) Dropped Android, and focused only on iOS.
2) Removed testing for security rules since those were unnecessary.

## 8) Other
### Frontend

### Backend
 
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
If something else happens which prevents you from running the program let us know (Kyu & Calvin).

### Google Logins
After making sure the simulator runs above, by following the aforementioned steps, and the app runs. As of now, there should be some text "Google sign-in" when you click on it, leads you to a google sign in page. In the next iteration, the UI will be changed by the frontend team and linked to individual players.

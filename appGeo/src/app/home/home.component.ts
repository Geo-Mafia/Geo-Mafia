import { Component, OnInit, NgZone } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Killer, Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'
import { Chat } from '../chat/chat.component'
import { Game } from '../game/game.component'
import { GameRules } from '../game/game-rules.component'
import { Observable } from 'rxjs'

import { Router } from '@angular/router'
import { GoogleLogin } from 'nativescript-google-login';
import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core/platform";
import { ChatComponent } from "../chat/chat.component";
import { firebase } from "@nativescript/firebase"
import { databaseAdd, databaseEventListener, databaseGet, databaseUpdate } from "../../modules/database"
import { toUIString } from '@nativescript/core/utils/types'

import { GameDataService } from '../services/game-data.service'

/* Imports required for Location Aspect Code */
import * as geolocation from '@nativescript/geolocation';
import { Location } from '../player/player.component'
/* End of imports required for Location Aspect Code */

const VOTE_OPEN_PATH = "settings/voteOpen"
const MAP_PATH = "/game/map"
const GAMERULE_PATH = "settings/gameRules"

@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  text : string = "Google Sign-In";

  public isKiller: Observable<Boolean>
  public isCivilian: Observable<Boolean>
  public isAlive: Observable<Boolean>
  public isDead: Observable<Boolean>
  public votingOpen: Boolean
  public component_isLoggedIn: Boolean
  public is_component_loggedIn: Observable<Boolean>
  public is_component_not_loggedIn: Observable<Boolean>

  public game: Game

  public latitude: number;
  public longitude: number;
  private watchId: number;


  textChange() {
    if (global.isLoggedIn) {
      this.text = "You are logged in as: " + global.player.username;
    }
    else {
      this.text = "Google Sign-In";
    }
  }

  constructor(private router: Router, private zone: NgZone, private gameData: GameDataService) {
    // Use the component constructor to inject providers.
    if(global.loggedIn){
      this.is_component_loggedIn = new Observable(observer=>observer.next(true));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
      if (global.player instanceof Killer || global.player.isKiller == true){
        this.isKiller = new Observable(observer=>observer.next(true));
        this.isCivilian = new Observable(observer=>observer.next(false));
      }
      else{
        this.isKiller = new Observable(observer=>observer.next(false));
        this.isCivilian = new Observable(observer=>observer.next(true));
      }
      if (global.player.alive == 1){
        this.isAlive = new Observable(observer=>observer.next(true));
        this.isDead = new Observable(observer=>observer.next(false));
      }
      else{
        this.isAlive = new Observable(observer=>observer.next(false));
        this.isDead = new Observable(observer=>observer.next(true));
      }
    }
    else{
      this.is_component_loggedIn = new Observable(observer=>observer.next(false));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(true));
      this.isKiller = new Observable(observer=>observer.next(false));
      this.isCivilian = new Observable(observer=>observer.next(true));
      this.isAlive = new Observable(observer=>observer.next(false))
      this.isDead = new Observable(observer=>observer.next(true));
    }
  }

  ngOnInit(): void {
    this.votingOpen = false; //This information should be received from Database with Game Info!!!
    console.log("Can we see this when we exit the page and then come back inside the page")
    // Init your component properties here.
    
    this.gameData.currentGame.subscribe(game => this.game = game)
    this.gameData.messageReceived$.subscribe(message => {
      if(message == "gameStart")
        console.log("Start game pressed and ", JSON.stringify(this))
        this.game.startGame()
    })

    var map = new CampusMap();
    databaseAdd(MAP_PATH, map)
    var gameRules = new GameRules();
    databaseAdd(GAMERULE_PATH, gameRules)
    this.game = new Game(gameRules, map, null)

    geolocation.enableLocationRequest();

    console.log("init");
    if(isIOS) {
      console.log("ios");
      let v =  setTimeout(()=>{
                     GoogleLogin.init({
                          google: {
                              initialize: true,
                              clientId: "822883682757-pdkj0u99hgj6sc5qrnegr57q1o9d860b.apps.googleusercontent.com",
                              serverClientId: "",
                              isRequestAuthCode: true
                          },
                          viewController: application.ios.rootController
                      });
                  clearTimeout(v)
              },500)
      }

    databaseEventListener(VOTE_OPEN_PATH, this.updateVoteOpenDatabase.bind(this))
  }

  login() {
    if (global.loggedIn) {
      this.zone.run(() => this.component_isLoggedIn = true)
      this.is_component_loggedIn = new Observable(observer=>observer.next(true));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
      if (global.player instanceof Killer || global.player.isKiller == true){
        this.isKiller = new Observable(observer=>observer.next(true));
        this.isCivilian = new Observable(observer=>observer.next(false));
      }
      else{
        this.isKiller = new Observable(observer=>observer.next(false));
        this.isCivilian = new Observable(observer=>observer.next(true));
      }
      if (global.player.alive == 1){
        this.isAlive = new Observable(observer=>observer.next(true));
        this.isDead = new Observable(observer=>observer.next(false));
      }
      else{
        this.isAlive = new Observable(observer=>observer.next(false));
        this.isDead = new Observable(observer=>observer.next(true));
      }

      let options = {
        title: "Error",
        message: "You already are signed in as: " + global.player.username,
        okButtonText: "OK"
      }
      alert(options);
      this.startWatchingLocation()
    }
    else {
      GoogleLogin.login(result=>{

        if (result["code"] != -2) {

          //console.log(result);
          let userID : string = result["id"];
          //console.log('/game/users/' + userID)
          firebase.getValue('/game/users/' + userID)
          .then(res =>{
            //new registration
            if(res["value"] == null) {
              console.log("-----------------------in new registration----------------");
              console.log(res);
              global.player.userIDString = result["id"];
              //global.player.username = result["displayName"];
              global.player.email = result["userToken"];
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
              if (global.player instanceof Killer || global.player.isKiller == true){
                this.isKiller = new Observable(observer=>observer.next(true));
                this.isCivilian = new Observable(observer=>observer.next(false));
              }
              else{
                this.isKiller = new Observable(observer=>observer.next(false));
                this.isCivilian = new Observable(observer=>observer.next(true));
              }
              this.isAlive = new Observable(observer=>observer.next(true));
              this.isDead = new Observable(observer=>observer.next(false));

              //admin if the player is the first one registered
              databaseGet("game/users").then(res0 => {
                console.log("Still in the case where we register a new player")
                //no player in the game
                if (res0 == null) {
                  global.player.isAdmin = true;
                }
                //double checking there IS a player thus not admin
                else if ((Object.keys(res0).length) != 0) {
                  global.player.isAdmin = false;
                }

                let location = new Location(0, 0); //TODO: change location to be actual later
                console.log("Case where new player is supposed to be initialized and all flags would get updated")
                //TODO UPDATE USERID NUMBER
                global.player.init(0, result["displayName"], location, 1);
                global.player.databasePath = "/game/users/" + global.player.userIDString;
                this.zone.run(() => this.component_isLoggedIn = true)
                this.is_component_loggedIn = new Observable(observer=>observer.next(true));
                this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
                if (global.player instanceof Killer || global.player.isKiller == true){
                  this.isKiller = new Observable(observer=>observer.next(true));
                  this.isCivilian = new Observable(observer=>observer.next(false));
                }
                else{
                  this.isKiller = new Observable(observer=>observer.next(false));
                  this.isCivilian = new Observable(observer=>observer.next(true));
                }
                if (global.player.alive == 1){
                  this.isAlive = new Observable(observer=>observer.next(true));
                  this.isDead = new Observable(observer=>observer.next(false));
                }
                else{
                  this.isAlive = new Observable(observer=>observer.next(false));
                  this.isDead = new Observable(observer=>observer.next(true));
                }
                console.log(global.player);

                databaseAdd('/game/users/' + userID, global.player)
                global.result = result;
                console.log("What is currently the component_isLoggedIn: ", this.component_isLoggedIn)
                global.loggedIn = true;
              })

            }
            //already exists
            else { 
              global.player = res["value"];
              console.log("user already exists, will not add new data but will pull from the database");
              console.log(global.player);
              console.log("At this point in time the isKiller flag for globabl is: ", global.player.isKiller)
              global.result = res;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
              if (global.player instanceof Killer || global.player.isKiller == true){
                this.isKiller = new Observable(observer=>observer.next(true));
                this.isCivilian = new Observable(observer=>observer.next(false));
              }
              else{
                this.isKiller = new Observable(observer=>observer.next(false));
                this.isCivilian = new Observable(observer=>observer.next(true));
              }
              if (global.player.alive == 1){
                this.isAlive = new Observable(observer=>observer.next(true));
                this.isDead = new Observable(observer=>observer.next(false));
              }
              else{
                this.isAlive = new Observable(observer=>observer.next(false));
                this.isDead = new Observable(observer=>observer.next(true));
              }
              this.startWatchingLocation();
              global.loggedIn = true;
            }
          }).then(res2 => {
            if(global.player.username != "") {
              global.loggedIn = true;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
              if (global.player instanceof Killer || global.player.isKiller == true){
                this.isKiller = new Observable(observer=>observer.next(true));
                this.isCivilian = new Observable(observer=>observer.next(false));
              }
              else{
                this.isKiller = new Observable(observer=>observer.next(false));
                this.isCivilian = new Observable(observer=>observer.next(true));
              }
              if (global.player.alive == 1){
                this.isAlive = new Observable(observer=>observer.next(true));
                this.isDead = new Observable(observer=>observer.next(false));
              }
              else{
                this.isAlive = new Observable(observer=>observer.next(false));
                this.isDead = new Observable(observer=>observer.next(true));
              }
              this.startWatchingLocation();
              console.log(global.loggedIn);
            }
          }).then(res3 => {
            global.loggedIn = true;
            this.textChange();
            //at this point, global.player should be intitialized
            databaseGet("game/users").then(res => {
              for (const [key, value] of Object.entries(res)) {
                let person = new Player();
                person.alive = value["alive"]
                person.databasePath = value["databasePath"]
                person.userID = value["userID"]
                person.username = value["username"]
                //TODO: let location = new Location();
                person.location = value["location"]
                person.votes = value["votes"]
                person.chat_lists = value["chat_lists"]
                person.isAdmin = value["isAdmin"]
                person.have_already_voted = value["have_already_voted"]
                person.email = value["email"]
                person.userIDString = value["userIDString"]

                global.playerlist.set(Number(key), person);
              }
              //console.log("Person 1 is : " + (global.playerlist.get(Number("101066060680979007193")) instanceof Player))
            })
            // global.playerlist.set(global.player.getUserID(), global.player);
          })
          .catch(error => {
            console.log("error: " + error);
          });
        }
      });
    
    
    
    
    }

    if(global.player.isadmin == true) {
      databaseEventListener("src/game/gameStarted", this.startGameDatabase.bind(this))
    }
  }

  updateVoteOpenDatabase(data: object) {
    this.votingOpen = data["value"]
  }

  startGameDatabase(data: object) {
    const hasStarted = data["value"]

    if(hasStarted) {
      this.game.startGame()
    }
  }
  /*-------------------------Location Code!!!---------------------------------*/

  getUserLocation() {
      // get Users current position
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          global.player.location = new Location(this.longitude, this.latitude)
          console.log("position longtidue: ", this.longitude, "and position latitude: ", this.latitude)
          console.log("If we grab from the global player object (longitude, latitude): ", global.player.getLocation)
        });
      }else{
        console.log("User not allowed")
      }
    }


  private getDeviceLocation(): Promise<any> {
      return new Promise((resolve, reject) => {
          geolocation.enableLocationRequest().then(() => {
              geolocation.getCurrentLocation({timeout: 10000}).then(location => {
                  resolve(location);
              }).catch(error => {
                  reject(error);
              });
          });
      });
  }

  public updateLocation() {
      this.getDeviceLocation().then(result => {
          this.latitude = result.latitude;
          this.longitude = result.longitude;
          console.log("Current position information; Latitude: ", this.latitude, "and Longitude: ", this.longitude)
          global.player.location = new Location(this.longitude, this.latitude)
          console.log("If we grab from the global player object (longitude, latitude): ", global.player.getLocation())
          databaseUpdate(global.player.databasePath, global.player)
      }, error => {
          console.error(error);
      });

  }

  public startWatchingLocation() {
      this.watchId = geolocation.watchLocation(location => {
          if(location) {
              this.zone.run(() => {
                  this.latitude = location.latitude;
                  this.longitude = location.longitude;
                  global.player.location = new Location(this.longitude, this.latitude)
                  console.log("We are currently watching location")
                  databaseUpdate(global.player.databasePath, global.player)
              });
          }
      }, error => {
          console.error(error);
      }, { updateDistance: 1, minimumUpdateTime: 1000 });
  }

  public stopWatchingLocation() {
      if(this.watchId) {
          geolocation.clearWatch(this.watchId);
          this.watchId = null;
      }
  }

}

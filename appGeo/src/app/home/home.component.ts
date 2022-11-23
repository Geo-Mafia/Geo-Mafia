import { Component, OnInit, NgZone } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'
import { Chat } from '../chat/chat.component'
import { Observable } from 'rxjs'

import { Router } from '@angular/router'
import { GoogleLogin } from 'nativescript-google-login';
import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core/platform";
import { ChatComponent } from "../chat/chat.component";
import { firebase } from "@nativescript/firebase"
import { databaseAdd, databaseEventListener, databaseGet } from "../../modules/database"
import { toUIString } from '@nativescript/core/utils/types'

const VOTE_OPEN_PATH = "src/settings/voteOpen"

@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  text : string = "Google Sign-In";

  public isKiller: Boolean
  public votingOpen: Boolean
  public component_isLoggedIn: Boolean
  public is_component_loggedIn: Observable<Boolean>
  public is_component_not_loggedIn: Observable<Boolean>


  textChange() {
    if (global.isLoggedIn) {
      this.text = "You are logged in as: " + global.player.username;
    }
    else {
      this.text = "Google Sign-In";
    }
  }

  constructor(private router: Router, private zone: NgZone) {
    // Use the component constructor to inject providers.
    if(global.loggedIn){
      this.is_component_loggedIn = new Observable(observer=>observer.next(true));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
    }
    else{
      this.is_component_loggedIn = new Observable(observer=>observer.next(false));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(true));
    }
  }

  ngOnInit(): void {
    this.isKiller = true;   //This information should be received from Database with Player Info!!!
    this.votingOpen = false; //This information should be received from Database with Game Info!!!
    console.log("Can we see this when we exit the page and then come back inside the page")
    // Init your component properties here.
    // Going to initialize a list of bubbles here;
    var map = new CampusMap;
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

      let options = {
        title: "Error",
        message: "You already are signed in as: " + global.player.username,
        okButtonText: "OK"
      }
      alert(options);
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
              //console.log("in new registration");
              //console.log(res);
              global.player.userIDString = result["id"];
              //global.player.username = result["displayName"];
              global.player.email = result["userToken"];
              

              //admin if the player is the first one registered
              databaseGet("game/users").then(res0 => {
      
                //no player in the game
                if (res0 == null) {
                  global.player.isAdmin = true;
                }
                //double checking there IS a player thus not admin
                else if ((Object.keys(res0).length) != 0) {
                  global.player.isAdmin = false;
                }
              
                let location = 0; //TODO: change location to be actual later
                
                //TODO UPDATE USERID NUMBER
                global.player.init(0, result["displayName"], location, 1);
                global.player.databasePath = "/game/users/" + global.player.userIDString;
                this.zone.run(() => this.component_isLoggedIn = true)
                this.is_component_loggedIn = new Observable(observer=>observer.next(true));
                this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
                //console.log(global.player);
    
                databaseAdd('/game/users/' + userID, global.player)
                global.result = result;

              })

            }
            //already exists
            else {
              global.player = res["value"];
              console.log("user already exists, will not add new data but will pull from the database");
              //console.log(global.player);
              global.result = res;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
            }
          }).then(res2 => {
            if(global.player.username != "") {
              global.loggedIn = true;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
              console.log(global.loggedIn);
            }
          }).then(res3 => {
            this.textChange();
          })
          .catch(error => {
            console.log("error: " + error);
          });
        }
      });
    }
  }

  updateVoteOpenDatabase(data: object) {
    this.votingOpen = data["value"]
  }


}

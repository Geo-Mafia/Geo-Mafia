import { Component, OnInit } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'
import { Chat } from '../chat/chat.component'
/*I'm adding the Chat Class here so that it can be represented on the home page
 *Because I cannot run the app on ios at the moment I cannot see anything *outside of homepage, but recommend adding a button that changes the page to *chat; the goToChat() function added here will do that just make a button for it.
 */

import { Router } from '@angular/router'
import { GoogleLogin } from 'nativescript-google-login';
import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core/platform";
import { ChatComponent } from "../chat/chat.component";
import { firebase } from "@nativescript/firebase"
import { databaseAdd } from "../../modules/database"
import { toUIString } from '@nativescript/core/utils/types'


@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  text : string = "Google Sign-In";

  public isKiller: Boolean
  public votingOpen: Boolean


  textChange() {
    if (global.isLoggedIn) {
      this.text = "You are logged in as: " + global.player.username;
    }
    else {
      this.text = "Google Sign-In";
    }
  }

  constructor(private router: Router) {
    // Use the component constructor to inject providers.


  }

  ngOnInit(): void {
    this.isKiller = true;   //This information should be received from Database with Player Info!!!
    this.votingOpen = false; //This information should be received from Database with Game Info!!!
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
  }

  login() {
    if (global.loggedIn) {

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
              global.player.userIDString = result["id"]
              global.player.username = result["displayName"];
              global.player.userToken = result["userToken"];
              //console.log(global.player);
  
              databaseAdd('/game/users/' + userID, global.player)
              global.result = result;
            }
            //already exists
            else {
              global.player = res["value"];
              console.log("user already exists, will not add new data but will pull from the database");
              //console.log(global.player);
              global.result = res;
            }
          }).then(res2 => {
            if(global.player.username != "") {
              global.loggedIn = true;
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


}

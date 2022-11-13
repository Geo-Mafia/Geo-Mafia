import { Component, OnInit } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'

import { GoogleLogin } from 'nativescript-google-login';
import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core/platform";

@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
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
    //console.log("function");
    
    GoogleLogin.login(result=>{
      console.log(result);
    });
    
  }

}

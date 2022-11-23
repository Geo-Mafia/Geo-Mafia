import { Component, Inject, Injectable, OnInit} from '@angular/core';
import {Bubble} from './map.component'
import {Player} from '../player/player.component'
import { push } from 'nativescript-plugin-firebase';
import { databaseAdd, databaseGet, databaseEventListener, databaseUpdate } from '../../modules/database' //copied over so I can access player variable




@Component({
  selector: 'campusMap',
  templateUrl: './campus-map.component.html',
  styleUrls: ['./campus-map.component.css']
})



export class CampusMap implements OnInit {
  public MapOfCampus: Map<string, Bubble>;
  public display: Bubble; //the CampusMap has a function inside to choose which Bubble the player will see to make things simpler
  public playerlist: Array<Player>;
  public offcampus : Bubble // moved over the offcampus Bubble here

  constructor() {
  //the MapOfCampus will be fully initialized on when called in game class OnInit will need to use getters and setters
    this.MapOfCampus = new Map<string, Bubble>;
    /* ============== Off Campus Bubble ================*/
    var OffCampus = new Bubble()
    OffCampus.init_bubble('The Outside of any assigned Campuse Buildings', 0, 0, 0, 0)
    this.offcampus = OffCampus
  }
  ngOnInit() : void {

    this.playerInBubble(global.player)

  }

    addToMap(name: string, toAdd: Bubble){
      //adds a bubble to our mapOfCampus
      this.MapOfCampus.set(name, toAdd);
    }

    playerInBubble(pToCheck: Player){
      //This will be the function to call to check if a player is in a Bubble within our list of Bubbles
      for (let bubb of this.MapOfCampus.values()) {
        this.checkBubble(bubb, pToCheck)
      }
      if (!this.display.playerArray.includes(pToCheck) && pToCheck.getAliveStatus()){
        this.offcampus.addPlayer(pToCheck)
        this.display = this.offcampus
        this.playerlist = this.offcampus.playerArray
      }
    }


    checkBubble(checkIfIn : Bubble, pToCheck : Player){
      //this is a function that calls on the bubble that is iterated through
      //when this is called on a bubble if true will change the bubble to display to the Player
      if(checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        if (!pToCheck.alive){
          checkIfIn.removePlayer(pToCheck)
          this.display = checkIfIn
          this.playerlist = checkIfIn.playerArray
          return
        }
      } else if(checkIfIn.inBubble(pToCheck) && !checkIfIn.List.has(pToCheck.userID)){ //should have more logic to remove a player that is in said bubble List but not in the bubble boundary
        if (this.offcampus.List.has(pToCheck.userID)){
          this.offcampus.removePlayer(pToCheck)
        }
        if (!pToCheck.alive){
          this.display = checkIfIn
          this.playerlist = checkIfIn.playerArray
          return
        }else {
          checkIfIn.addPlayer(pToCheck)
          this.display = checkIfIn;
          this.playerlist = checkIfIn.playerArray //reassigning our shallow copy of names
        }
      } else if(!checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        checkIfIn.removePlayer(pToCheck)
      }
    }
    get Display(){
      return this.display
    }
    get PList(){
      return this.playerlist
    }

    //for use in snapshot; returns the bubble a player is in
    playersBubble(player : Player) {
      this.playerInBubble(player)
      return this.Display
    }
}

export default CampusMap;

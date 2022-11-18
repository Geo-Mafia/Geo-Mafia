import { Component, Inject, Injectable, OnInit} from '@angular/core';
import {Bubble} from './map.component'
import {Player} from '../player/player.component'
import { push } from 'nativescript-plugin-firebase';



@Component({
  selector: 'campusMap',
  templateUrl: './campus-map.component.html',
})

export class CampusMap implements OnInit {
  public MapOfCampus: Map<string, Bubble>;
  public display: Bubble; //the CampusMap has a function inside to choose which Bubble the player will see to make things simpler
  playerlist: Array<Player>
  constructor() {
  //the MapOfCampus will be fully initialized on call, will need to make getters and setters
    this.MapOfCampus = new Map<string, Bubble>;
  }
  ngOnInit() : void {
    //===== Initializing Crerar ====
    var Crerar =  new Bubble()
    Crerar.init_bubble('Crerar', 41.7901331, 41.7909298, -87.6025138, -87.6031023)
  //==== Initializing Bookstore ====
    var Bookstore = new Bubble()
    Bookstore.init_bubble('Bookstore', 41.7896584,41.7899199,-87.6013954,-87.6018721)
  //==== Initializing Hinds Lab for Geophysical Scientists ====
    var GeoLab = new Bubble()
    GeoLab.init_bubble('Hinds Lab',41.790033,41.7905151, -87.601432,-87.601902)

  //==== Initializing Kovler Hall ====
    var Kovler = new Bubble()
    Kovler.init_bubble('Kovler',41.7896546,41.7901571, -87.6032333, -87.6035022)
  //==== Initializing Cobb Hall ====
    var Cobb = new Bubble()
    Cobb.init_bubble('Cobb Hall', 41.78873284336094,41.789193407299585, -87.60080074965704, -87.60109790155668)
  //==== Initializing Godspeed Hall ====
    var Godspeed = new Bubble()
    Godspeed.init_bubble('Godspeed Hall', 41.78803035339906, 41.78872707776446, -87.60088472281471, -87.60104646075854)
  //==== Initializing Wieboldt Hall ====
    var Weiboldt = new Bubble()
    Weiboldt.init_bubble('Weiboldt Hall', 41.78787764605307, 41.78805759030377, -87.60003025716154, -87.60107505494783)
  //==== Initializing Harper ====
    var Harper = new Bubble()
    Harper.init_bubble('Harper', 41.78787887161209,41.78804486314529, -87.59904541075865, -87.60003380475374 )
  //====

  //====

  //Players that will go in the `Crerar` Bubble
    var P1point = {x: 41.7901, y: -87.5999 };
    var Player1 = new Player()
    Player1.init(1, "SUUUper", P1point, 1);
    var P2point = {x: 41.000001, y: -87.590001};
    var Player2 = new Player()
    Player2.init(2, "FunnY_Name", P2point, 1);
    var Player3 = new Player()
    Player3.init(3, "checking", P2point, 1);

  // adding `Players` to the `List` within `Crerar`
    Crerar.addPlayer(Player1)
    Crerar.addPlayer(Player2)
    Crerar.addPlayer(Player3)


    //==== Adding our Bubbles to the CampusMap
    this.addToMap(Crerar.id, Crerar)
    this.addToMap(Bookstore.id, Bookstore)
    this.addToMap(GeoLab.id, GeoLab)
    this.addToMap(Kovler.id, Kovler)
    this.addToMap(Cobb.id, Cobb)
    this.addToMap(Godspeed.id, Godspeed)
    this.addToMap(Weiboldt.id, Weiboldt)
    this.addToMap(Harper.id, Harper)



    //idea: call PlayerInBubble to find the `Bubble` `Player` is in
    //display is currently set to Crerar-- will implement further logic soon

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
    }


    checkBubble(checkIfIn : Bubble, pToCheck : Player){
      //this is a function that calls on the bubble that is iterated through
      //when this is called on a bubble if true will change the bubble to display to the Player
      if(checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        //intentionally left blank
      } else if(checkIfIn.inBubble(pToCheck) && !checkIfIn.List.has(pToCheck.userID)){ //should have more logic to remove a player that is in said bubble List but not in the bubble boundary
        this.display = checkIfIn;
        this.playerlist = checkIfIn.playerArray //reassigning our shallow copy of names
      } else if(!checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        checkIfIn.removePlayer(pToCheck)
      }
    }

}

export default CampusMap;
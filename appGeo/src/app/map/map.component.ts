//file added for simplicity reasons so that it can work with the files added by player dev
import{Player} from '../player/player.component.js';

import { Component, Inject, Injectable} from '@angular/core';

@Component({
  selector: 'ng-Bubble',
  templateUrl: 'map.component.html',
})


export class Bubble{
  public id: string;
  public xLb: number;
  public xUb: number;
  public yLb: number;
  public yUb: number;
  public List: Map<number, Player>;


    constructor() {
      this.List = new Map<number, Player>(); //map<userID, Player>; initialized empty
    }

    init_bubble(id, xLb, xUb, yLb, yUb){
      //this fn exists because it asks for injection tokens from the constructor
      //if the params are but inside the constructor. otherwise this fn is not necessary
      this.id = id;
      this.xLb = xLb;
      this.xUb = xUb;
      this.yLb = yLb;
      this.yUb = yUb;
    }

    // adds player; returns true on success
    addPlayer(player){
      this.List = this.List.set(player.getUserID, player); //returns map
      return true;
    }

    // removes player, returns true on success
    removePlayer(Player){
      return this.List.delete(Player.getUserID); //returns bool
    }

    // returns bubble id
    get NameOfBubble(){
      return this.id;
    }

    // returns true if player is within bubble boundaries
    inBubble(Player){
      //longitude tracks x, latitiude tracks y
      return Player.location.longitude >= this.xLb && Player.location.longitude <= this.xUb &&
          Player.location.latitude >= this. yLb && Player.location.latitude <= this.yUb;
    }

    // returns list of players in bubble
    get returnPlayers() : Map<number, Player>{
      return this.List;
    }

    get playerArray(){
      var displayPlayers = Array.from(this.List.values())
      return displayPlayers
    }
}

export default Bubble;

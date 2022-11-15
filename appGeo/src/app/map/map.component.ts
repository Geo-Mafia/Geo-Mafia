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


    constructor(id: string, xLb: number, xUb: number, yLb: number, yUb: number) {
      this.id = id;
      this.xLb = xLb;
      this.xUb = xUb;
      this.yLb = yLb;
      this.yUb = yUb;  
      this.List = new Map<number, Player>(); //map<userID, Player>; initialized empty
    }

    // adds player; returns true on success
    addPlayer(Player){
      return this.List.set(Player.userID, Player);
    }

    // removes player, returns true on success
    removePlayer(Player){
      return this.List.delete(Player.userID);
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
}

export default Bubble;

//file added for simplicity reasons so that it can work with the files added by player dev
import{Player} from '../player/player.component.js';

import { Component, Inject, Injectable} from '@angular/core';

@Component({
  selector: 'ng-Bubble',
  templateUrl: 'map.component.html',
})


export class Bubble{
  //Variables we will be using
  public id: string;
  public xLb: number;
  public xUb: number;
  public yLb: number;
  public yUb: number;
  public List: Player[];


    constructor() {
      this.List = new Array(); //Bubbles will be initialized naturally with an empty list of Players

    }


    init_bubble( id: string, xLb: number, xUb: number, yLb: number, yUb: number){
      this.id = id;
      this.xLb = xLb;
      this.xUb = xUb;
      this.yLb = yLb;
      this.yUb = yUb;
    }

    // //methods
    addPlayer(Player){
      //returns a t bool if a player is added
      //adds player to array and updates arr_len
      return this.List.push(Player);
    }

    removePlayer(Player){
      // removes player from array and updates arr_len. returns bool
      const index = this.List.indexOf(Player, 0);
      if (index > -1){
        this.List.splice(index, 1);
        return true;
      } else {
        return false
      }
    }

    inBubble(Player){
      //checks player location to see if they are within bubble boundaries
      if (Player.location > this.xLb && Player.location < this.xUb &&
          Player.location[1] >= this. yLb && Player.location[1] <= this.yUb) {
        //for now implementation is simple based on playerdev's write up
        return true;
      } else {
        return false;
      }

    }

    get returnPlayers() : Array<Player>{
      //returns list of players in Bubble made this a get
      return this.List;
    }


}

export default Bubble;

//file added for simplicity reasons so that it can work with the files added by player dev
import{Player} from './player.component.js';

import { Component, Inject, Injectable } from '@angular/core';

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  //providers: [Player],
})


export class Bubble {
  //Variables we will be using
  public id: string;
  public xLb: number;
  public xUb: number;
  public yLb: number;
  public yUb: number;
  public List: Player[];


    constructor( id: string, xLb: number, xUb: number, yLb: number,
      yUb: number) {
      this.id = id;
      this.xLb = xLb;
      this.xUb = xUb;
      this.yLb = yLb;
      this.yUb = yUb;
      this.List = new Array(); //Bubbles will be initialized naturally with an empty list of Players
    }


    init_bubble( id: string, xLb: number, xUb: number, yLb: number, yUb: number){
      return new Bubble(id, xLb, xUb, yLb, yUb);
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
      if (Player.location > this.xLb && Player.location < this.xUb) {
        //for now implementation is simple based on playerdev's write up
        return true;
      } else {
        return false;
      }

    }

    returnPlayers(){
      //returns list of players in Bubble within the console
      //will use different implementation in html to display players
      this.List.forEach(console.log);
    }


}

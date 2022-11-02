import { Component } from '@angular/core';

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
})


export class bubble {
    //variables
    ID: string;
    x_lB: number;
    x_uB: number;
    y_lB: number;
    y_uB: number;
    arrlen: number;
    players: Array<Player>;

<<<<<<< HEAD
    constructor(ID: string, upperx: number, lowerx: number, lowery: number,
                uppery: number, arrlen = 0, List = Array<Player>) {
=======
    constructor(name: string, upperx: number, lowerx: number, lowery: number,
                uppery: number) {
>>>>>>> bfef8e029e5459f791e89ff73a68129146079896
      this.ID = name;
      this.x_lB = lowerx;
      this.x_uB = upperx;
      this.y_lB = lowery;
      this.y_uB = uppery;
      this.arrlen = 0;
      this.players = null; //going to set default as null for now, was "new List;"
    }

    //methods
    inBubble(Player) {
      // -bool inBubble(Player) //checks player location to see if they are within bubble boundaries
      return false;
    }

    addPlayer(Player) {
      // -bool addPlayer(Player) //adds player to array and updates arr_len
      return false;
    }

    removePlayer(Player) {
      // -bool removePlayer(Player) //removes player from array and updates arr_len
      return false;
    }

    returnPlayers() {
        // -Array<Players> retPlayers() //returns list of players in bubble
        return null;
    }
}

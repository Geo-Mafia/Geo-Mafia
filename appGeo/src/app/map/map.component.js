//file added for simplicity reasons so that it can work with the files added by player dev



export class bubble {
    //variables
    ID: string;
    x_lB: number;
    x_uB: number;
    y_lB: number;
    y_uB: number;
    arrlen: number;
    List: Array<Player>;

    constructor(name: string, upperx: number, lowerx: number, lowery: number,
                uppery: number, arrlen = 0, List = Array<Player>) {
      this.ID = name;
      this.x_lB = lowerx;
      this.x_uB = upperx;
      this.y_lB = lowery;
      this.y_uB = uppery;
      this.arrlen = arrlen;
      this.List = new List;
    }



    // //methods
    addPlayer(Player){

    }
    // -bool addPlayer(Player) //adds player to array and updates arr_len
    // -bool removePlayer(Player) //removes player from array and updates arr_len
    // -bool inBubble(Player) //checks player location to see if they are within bubble boundaries
    // -Array<Players> retPlayers() //returns list of players in bubble

}

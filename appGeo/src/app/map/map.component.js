//file added for simplicity reasons so that it can work with the files added by player dev
import{Player} from '../player/player.component.js';


export class Bubble {
    //variables
    id //float
    xLb //float
    xUb //float
    yLb //float
    yUb // float
    List // Array<Player>

    constructor() {
      this.List = new Array();
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

    // //methods
    addPlayer(Player){
      //returns a t bool if a player is added
      //adds player to array and updates arr_len
      return this.List.push(Player);
    }

    removePlayer(Player){
      // removes player from array and updates arr_len. returns bool
      const index = array.indexOf(Player);
      if (index > -1){
        splice(index, 1);
        return true;
      } else {
        return false
      }
    }

    inBubble(Player){
      //checks player location to see if they are within bubble boundaries
      /* implementation updated based on player dev intended implementation
       * of coord as a pair and to facilitate map testing; may have to be
       * updated further depending on playerdev implementation of pair */
      if (Player.location[0] >= this.xLb && Player.location[0] <= this.xUb &&
          Player.location[1] >= this. yLb && Player.location[1] <= this.yUb) {
        return true;
      }
      return false;
    }

    returnPlayers(){
      //returns list of players in Bubble
      this.List.forEach(console.log);
    }


}
module.exports = Bubble;

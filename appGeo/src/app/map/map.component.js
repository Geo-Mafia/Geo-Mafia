//file added for simplicity reasons so that it can work with the files added by player dev
import{Player} from './player.component.js';


export class bubble {
    //variables
    id //float
    x_lb //float
    x_ub //float
    y_lb //float
    y_ub // float
    arrlen //int
    List // Array<Player>

    constructor(id, x_lb, x_ub, y_lb, y_ub) {
      this.id = id;
      this.x_lb = lowerx;
      this.x_ub = upperx;
      this.y_lb = lowery;
      this.y_ub = uppery;
      this.arrlen = 0;
      this.List = new Array();
    }


    init_bubble(id, x_lb, x_ub, y_lb, y_ub){
      return bubble(id, x_lb, x_ub, y_lb, y_ub);
    }

    // //methods
    addPlayer(Player){
      //returns a t bool if a player is added
      //adds player to array and updates arr_len

    }

    removePlayer(Player){
      // removes player from array and updates arr_len. returns bool

    }
    inBubble(Player){
      //checks player location to see if they are within bubble boundaries

    }

    retPlayers(){
      //returns list of players in Bubble
    }


}

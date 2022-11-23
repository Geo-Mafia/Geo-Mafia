import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { InjectableAnimationEngine } from '@nativescript/angular';
import { ChangeType } from '@nativescript/core';
import { Bubble } from '../map/map.component';
import {Player, Civilian, Killer} from '../player/player.component'
import { fromObject, ScrollView, ScrollEventData} from '@nativescript/core';
import {GameRules} from '../game/game-rules.component'
import {Game} from '../game/game.component'
//import{Location} from './location_class_declaration';

const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

@Component({
  selector: 'voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})


export class VotingComponent implements OnInit{
    public DEAD = 0
    public ALIVE = 1
    public front_message: string = ""
    public selected_username: string = ""
    public yourself: Player
    public msg_if_voted: string = "You have already voted"
    public msg_if_not_voted: string = "You have not used your vote yet!"
    public have_not_voted: Boolean //Needs to be set upon initiating: Tells if we can vote (when true) or not (when false)
    public list_of_all_players: Array<Player>
    public selected_player_username: string = ""
    public typed_username: string = ""
    public selected_player: Player = null
    public is_alive: Boolean
    constructor(){

    }

    ngOnInit(): void {
        this.list_of_all_players = new Array()
        //Hard code some examples::
        var player1 = new Civilian()
        player1.init(1, "Testing 1", 1, this.ALIVE)
        var player2 = new Civilian()
        player2.init(2, "Testing 2", 1, this.ALIVE)
        var player3 = new Civilian()
        player3.init(3, "Testing 3", 1, this.ALIVE)

        //Note that it shouldn't matter if you are or are not a killer!!
        this.yourself = new Killer()
        this.yourself.init(4, "This is you, you killer", 1, this.ALIVE)
        var killer2 = new Killer()
        killer2.init(5, "Killer that should show up", 1, this.ALIVE)

        this.list_of_all_players.push(player1)
        this.list_of_all_players.push(player2)
        this.list_of_all_players.push(player3)
        this.list_of_all_players.push(this.yourself)
        this.list_of_all_players.push(killer2)


        this.front_message = this.msg_if_not_voted;
        if (this.yourself.have_already_voted == true){
            //In the case the user has already voted, then we set this.have_not_voted to FALSE:
            //  We cannot vote again!
            this.have_not_voted = false
        }
        else{
            //Otherwise, we can still vote!
            this.have_not_voted = true;
        }

        if (global.player.alive == this.ALIVE){
            //testing
            this.is_alive = true;
            console.log("We are in the case of having an alive player")
        }
        else{
            this.is_alive = false;
            console.log("We are in the case of having a dead player")
        }

        this.filterPlayers();
    }

    filterPlayers(){
        //console.log("Inside the filter Killer function")
        //console.log("The length of list of all nearby players is: ", this.list_of_all_nearby_players.length)
        var tmp: Array<Player> = new Array()
        for(var i = 0; i < this.list_of_all_players.length; i++){
            var curr_player = this.list_of_all_players[i];
            //We cannot kill an already dead player
            if (curr_player.getAliveStatus() != this.ALIVE){
                //Do nothing
            }
            else{
                tmp.push(curr_player);
                //console.log("We have just now added the following to available: ", curr_player.getUserID())
            }
        }

        this.list_of_all_players = tmp;
    }

    onScroll(args: ScrollEventData){
        const scrollView = args.object as ScrollView;
    
        console.log("scrollX: " + args.scrollX);
        console.log("scrollY: " + args.scrollY);
    }

    selectPlayer(){
        var found: boolean = false;

        for(var i = 0; i < this.list_of_all_players.length; i++){
            var curr_player = this.list_of_all_players[i];
            //Check if this is the player of who you want to kill
            if (curr_player.getUsername() == this.typed_username){
                this.selected_player = curr_player;
                this.selected_player_username = curr_player.getUsername();
                found = true;
                break;
            }
            else{
                //We keep iterating through to check
            }
        }

        if (found == false){
            this.selected_player_username = "You did not select a valid Player, either type another username or use buttons please"
        }
    }

    selectThroughButton(index_passed_in){
        //This function takes as input what index of the available players we want to select
        //console.log("The index we were given is: ", index_passed_in)

        //Retrieve the associated Player Object
        var player_passed_in = this.list_of_all_players[index_passed_in]

        //Do the selection process
        this.selected_player = player_passed_in;
        this.selected_player_username = player_passed_in.getUsername();
    }

    votePlayer(){
        if(this.selected_player == null){
            this.selected_player_username = "You did not select a valid Player, either type another username or use buttons please"
            return;
        }

        //Increase vote count of the selected player
        this.selected_player.increaseVoteCount();

        //Update so that the player has already voted
        this.front_message = this.msg_if_voted;
        this.yourself.have_already_voted = true; //Field inside the object gets set so it can go across pages
        this.have_not_voted = false; //Field that we use for the HTML in this page
    }
}
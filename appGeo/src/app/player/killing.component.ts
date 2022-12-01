import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener, databaseUpdate } from '../../modules/database'
import { firebase } from "@nativescript/firebase";
import { fromObject, ScrollView, ScrollEventData} from '@nativescript/core';
import { Player, Killer, Civilian } from './player.component'
import {CampusMap} from '../map/campus-map.component';
import {Bubble} from '../map/map.component';

@Component({
  selector: 'Killing',
  templateUrl: './killing.component.html',
  styleUrls: ['./killing.component.css']
})


export class KillingComponent implements OnInit {
    public DEAD = 0
    public ALIVE = 1

    public list_of_all_available_to_kill: Array<Player>
    public list_of_all_nearby_players: Array<Player>
    public yourself: Killer
    public kills_remaining: number
    public commited_kills: number
    public can_kill: Boolean
    public is_alive: Boolean

    public selected_player: Player
    public selected_player_username: string = ""
    public typed_username: string = ""

    kill() {
        console.log(this.selected_player_username, " has been killed");
        // Kills selected player
        
        this.selected_player = null;
        this.selected_player_username = "";
        this.typed_username = "";
    }

    constructor(){
        //console.log("Do we activate the constructor")
    }

    onScroll(args: ScrollEventData){
        const scrollView = args.object as ScrollView;
    
        console.log("scrollX: " + args.scrollX);
        console.log("scrollY: " + args.scrollY);
    }

    ngOnInit(): void {
        console.log("Got to Killing Screen")

        //Setting yourself from the global object
        this.yourself = global.player

        this.list_of_all_available_to_kill = new Array();
        this.list_of_all_nearby_players = new Array();
        this.selected_player = null;

        /* Create a new campus map object and then call playersBubble() to load 
         * depending on the user's location */
        let cm = new CampusMap();
        cm.playersBubble(global.player);

        //After getting map object, just extract the playerlist and reassign value
        this.list_of_all_nearby_players = cm.playerlist; 

    //The following lines would work whenevever have an appropriate 'yourself' object
        this.kills_remaining = this.yourself.remaining_daily_kill_count;
        this.commited_kills = this.yourself.total_kill_count;
        if (this.yourself.alive == this.ALIVE){
            this.is_alive = true;
        }
        else{
            this.is_alive = false;
        }

        if (this.kills_remaining > 0){
            this.can_kill = true;
        }
        else{
            this.can_kill = false;
        }
        //Then we want to filter list of all players in bubble:
        // 1) We want to make sure no dead players
        // 2) We want to make sure no other fellow killers
        this.filterPlayers();
    }

    filterPlayers(){
        for(var i = 0; i < this.list_of_all_nearby_players.length; i++){
            var curr_player = this.list_of_all_nearby_players[i];
            //We cannot kill an already dead player, and we also cannot kill another killer
            if (curr_player.alive != this.ALIVE || curr_player instanceof Killer || curr_player.username == this.yourself.username){
                //Do nothing
            }
            else{
                if (curr_player.username == this.yourself.username){
                    console.log("We have added the current user to the list of killable targets, OOOPS!")
                }
                this.list_of_all_available_to_kill.push(curr_player);
            }
        }
    }

    selectPlayer(){
        var found: boolean = false;

        for(var i = 0; i < this.list_of_all_nearby_players.length; i++){
            var curr_player = this.list_of_all_nearby_players[i];
            //Check if this is the player of who you want to kill
            if (curr_player.username == this.typed_username){
                this.selected_player = curr_player;
                this.selected_player_username = curr_player.username;
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
        //This function takes as input what index of the available to kill players we want to select
        //console.log("The index we were given is: ", index_passed_in)

        //Retrieve the associated Player Object
        var player_passed_in = this.list_of_all_available_to_kill[index_passed_in]

        //Do the selection process
        this.selected_player = player_passed_in;
        this.selected_player_username = player_passed_in.username;
    }

    removePlayer(){
        const index_we_found = this.list_of_all_available_to_kill.findIndex((object) => {
            return object.username === this.selected_player.username;
        });

        if (index_we_found !== -1) {
            this.list_of_all_available_to_kill.splice(index_we_found, 1);
        }
    }

    killPlayer(){
        if(this.selected_player == null){
            this.selected_player_username = "You did not select a valid Player, either type another username or use buttons please"
            return;
        }

        //Following line where all logic will be set appropriately including:
            // Selected player's alive status will be DEAD
            // The killer will have a decrease of remaining kills and an INCREASE of kills commited today
        this.yourself.killPlayer(this.selected_player) //Sets both selected player's and yourself fields
        this.removePlayer() //Removes dead player from available targets
        this.kills_remaining = this.yourself.getRemainingDailyKillCount(); //Get new kills remaining
        this.commited_kills = this.yourself.getTotalKillCount(); //Get new amount of total kills committed
        if (this.kills_remaining > 0){ //Check if we can still kill or not
            this.can_kill = true;
        }
        else{
            this.can_kill = false;
        }

        //Display satisfactory message for killing ;)
        this.selected_player_username = this.selected_player_username + " is now dead... Congrats ^_^"

        //Update things in terms of the database
        databaseUpdate(this.selected_player.databasePath, this.selected_player)
        databaseUpdate(this.yourself.databasePath, this.yourself)
    }

}
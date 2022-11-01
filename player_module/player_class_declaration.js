const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10
export class Player{
    userID // An int
    username // A String
    location // A Coordinate Object
    alive // A Boolean

    constructor(userID, username, location, alive){
        this.userID = userID
        this.username = username
        this.location = location
        this.alive = alive
    }

    getKilled(){
        this.alive = DEAD
        return SUCCESS
    }

    takeSnapshot(){
        const scene_capture = new Snapshot() //Create a Snapshot object
        // Note: Snapshot class not done yet, will want some function to add
        // all information required for a snapshot
    }

    open_snapshot(Snapshots){
        // TODO
    }

    see_people_in_bubble(Players){
        // Take in as input hash table from Map Class of Players
        // The hash table maps each player's userID to the player's location
        player_list = []
        // Sift through Hash Table and find nearby players
        for (var i in Players) {
            if (Players[i] = this.location) {
                player_list.push(Players[i])
            }
        }
        return player_list
    }

    open_chat(chat){
        // TODO
    }

    send_chat_message(chat, message){
        // TODO
    }

    receive_chat(chat, message){
        // TODO
    }

    voteForExecution(player){
        // TODO
    }

}

export class Civilian extends Player{
    /* Currently will be just the same as Player Superclass, however this info
    may change when implementing chat feature or in the future */
    constructor(userID, username, location, alive){
        super(userID, username, location, alive)
    }
}

export class Killer extends Player{
    //Define some maximum amount of kills per day
    max_daily_kill_count //An integer
    remaining_daily_kill_count //An integer
    total_kill_count //An integer

    constructor(userID, username, location, alive){
        super(userID, username, location, alive)
        this.max_daily_kill_count = DAILYMAXKILLCOUNT
        this.remaining_daily_kill_count = DAILYMAXKILLCOUNT
        this.total_kill_count = 0
    }
    kill_player(player_id, Players){
        //Take in from Game Class Players hash table and remove player_id
        if (this.remaining_daily_kill_count > 0){
            /*
            player_id.get_killed()
            remove_from_hash(player_id, Players)
            this.total_kill_count = this.total_kill_count + 1
            remaining_daily_kill_count = remaining_daily_kill_count - 1
            */
           return SUCCESS
        } else {
            //Notify User in some way that they don't have any kills left for the day
            return FAILURE
        }
    }
    get_total_kill_count(){
        return this.total_kill_count
    }
    get_remaining_daily_kill_count(){
        return this.remaining_daily_kill_count
    }
}
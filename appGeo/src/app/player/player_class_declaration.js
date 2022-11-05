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
    votes // An int

    constructor(userID, username, location, alive){
        this.userID = userID;
        this.username = username;
        this.location = location;
        this.alive = alive;
        this.votes = 0;
    }

    /* getAliveStatus: Return whether or not current player is Alive or Killed */
    getAliveStatus(){
        return this.alive;
    }

    getKilled(){
        this.alive = DEAD;
        return SUCCESS;
    }

    takeSnapshot(){
        const scene_capture = new Snapshot() //Create a Snapshot object
        // Note: Snapshot class not done yet, will want some function to add
        // all information required for a snapshot
        if (scene_capture == 1){
            return SUCCESS;
        }
        return FAILURE;
    }

    openSnapshot(Snapshot){
        const open = Snapshot.view();
        if (open == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }

    seePeopleInBubble(All_players){
        // Take in as input hash table from Map Class of Players
        // The hash table maps each player's userID to the player's location
        player_list = [];
        // Sift through Hash Table and find nearby players
        for (var i in All_players) {
            if (All_players[i] = this.location) {
                player_list.push(All_players[i]);
            }
        }
        return player_list;
    }

    openChat(chat){
        const open = chat.view()
        if (open == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }

    sendChatMessage(chat, message){
        const sent = chat.send(message);
        if (sent == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }

    receiveChat(chat, message){
        const received = chat.receive(message);
        if (received == 1) {
            return SUCCESS;
        }
        return FAILURE;
    }
    /* voteForExecution(): Let current player vote for _another_ player to be executed
     * Input: 
     *      - A Player object (?) [I think that it should be a username or ID and we do
     *        do some logic/map class does some logic such that it returns the player in question]
     *        Ex: Player A votes for Player B. Take as input Player B's username
     *        (which is the only thing that A can see)
    */
    voteForExecution(player){
        player.increaseVoteCount();
        return SUCCESS;
    }

    /* increaseVoteCount(): Increase current Player's number of votes
     * Note: This function added for privacy concersn (don't want other players
     * directly modifying the field of another player)
    */
    increaseVoteCount(){
        this.votes++;
    }

}

export class Civilian extends Player{
    /* Currently will be just the same as Player Superclass, however this info
    may change when implementing chat feature or in the future */
    constructor(userID, username, location, alive){
        super(userID, username, location, alive);
    }
}

export class Killer extends Player{
    //Define some maximum amount of kills per day
    max_daily_kill_count //An integer
    remaining_daily_kill_count //An integer
    total_kill_count //An integer

    constructor(userID, username, location, alive, votes){
        super(userID, username, location, alive, votes);
        this.max_daily_kill_count = DAILYMAXKILLCOUNT;
        this.remaining_daily_kill_count = DAILYMAXKILLCOUNT;
        this.total_kill_count = 0;
    }

    /* killPlayer: Allows a killer to eliminate a Player from the game
     * Input: 
     *      -player_id: Player ID of whoever will be eliminated
     *      -All_players: Hash Table that contains all players
     * 
    */
    killPlayer(player_id, All_players){
        //Take in from Game Class Players hash table and remove player_id
        people_can_be_killed = this.seePeopleInBubble()

        if (people_can_be_killed.includes(player_id) == false){
            // Then the person Killer attempted to kill is NOT in their own bubble
            // Invalid Move!
            return FAILURE;
        }
        if (this.getRemainingDailyKillCount() > 0 && this.getAliveStatus() == ALIVE){
            // Killer has kills remaining, victim is in bubble and alive, can kill
            player_id.getKilled();
            remove_from_hash(player_id, All_players);
            this.total_kill_count++;
            remaining_daily_kill_count--;
            
           return SUCCESS;
        } else {
            // Notify User in some way that they don't have any kills left for the day
            return FAILURE;
        }
    }
    getTotalKillCount(){
        return this.total_kill_count;
    }
    getRemainingDailyKillCount(){
        return this.remaining_daily_kill_count;
    }
}
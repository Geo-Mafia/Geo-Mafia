import {Chat} from '../app/chat/chat.component';
import {Snapshot} from '../app/snapshot/snapshot_class_declaration';
import {Player, Killer, Civilian} from '../app/player/player.component';
import {Game} from '../app/game/game.component';
import {Bubble} from '../app/map/map.component'
import {CampusMap} from '../app/map/campus-map.component'
import { GameRules } from '~/app/game/game-rules.component';
import { test } from 'qunit';

const INACTIVE = 0
const ACTIVE = 1
const DEAD = 0
const ALIVE = 1
const INPROGRESS = 5
const CIVILIAN = 7
const KILLER = 8
const SUCCESS = 10
const FAILURE = -10
const DAILYMAXKILLCOUNT = 2

export class Location{
    x
    constructor(integer){
        this.x = integer;
    }
}

QUnit.module("Game tests")

QUnit.test("Game Constructors and Basic Getters and Setters", function(assert) {
    const now = new Date();
    const endTime = new Date(now.getTime() + 1800 * 60 * 60 * 24 * 7);
    const gameRules = new GameRules();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Player()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Player()
    player3.init(3, 'player3', Location1, ALIVE);
    const playerArray = [player1, player2, player3];

    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const game1 = new Game(gameRules, test_map, undefined);

    assert.equal(game1.getGameActive(), INACTIVE, "New game is not active");
    assert.equal(game1.getEndTime().getTime(), endTime.getTime(), "endGame date is set time");

    //Because of lag when running the tests, give a 5 second timeframe to see if end time was set appropriately
    var bool = false;
    const actEndTime = game1.getEndTime().getTime()
    if (actEndTime - endTime.getTime() > -5 || actEndTime - endTime.getTime() < 5){
        bool = true;
    }
    assert.equal(bool, true, "End game time updates over time");

    //Because of lag when running the tests, give a 5 second timeframe to see if start time was set appropriately
    bool = false;
    const start_time = game1.getStartTime().getTime()
    if (start_time - now.getTime() > -5 || start_time - now.getTime() < 5){
        bool = true;
    }
    assert.equal(bool, true, "Start game time updates over time");
    assert.equal(game1.getMap(), test_map, "Map has been set properly");

    const three_days_from_now = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    assert.equal(game1.setEndTime(three_days_from_now), SUCCESS, "endGame date successfully set");
    assert.equal(game1.getEndTime(), three_days_from_now, "endGame date is new set time");

    const game2 = new Game(gameRules, test_map, player_map);
    assert.equal(game2.getPlayer(1).getUserID(), player1.getUserID());
    assert.equal(game2.getPlayer(2).getUserID(), player2.getUserID());
    assert.equal(game2.getPlayer(3).getUserID(), player3.getUserID());

});

QUnit.test("Game Hashtable Handling", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Player()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Player()
    player3.init(3, 'player3', Location1, ALIVE);
    const player4 = new Player()
    player4.init(4, 'player4', Location1, ALIVE);
    const player5 = new Player()
    player5.init(5, 'player5', Location1, ALIVE);
    const playerArray = [player1, player2, player3];

    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );
    const game1 = new Game(gameRules, test_map, player_map);
    assert.equal(game1.getPlayer(1).getUserID(), player1.getUserID(), "we can find player1");
    assert.equal(game1.getPlayer(2).getUserID(), player2.getUserID(), "we can find player2");
    assert.equal(game1.getPlayer(3).getUserID(), player3.getUserID(), "we can find player3");
    //Have set up all the appropriate players thus far
    
    assert.equal(game1.addPlayer(player4), SUCCESS, "Player added successfully");
    playerArray.push(player4);
    assert.equal(game1.getPlayer(4).getUserID(), player4.getUserID(), "players list successfully updated");

    assert.equal(game1.addPlayer(player5), SUCCESS, "Player added successfully");
    playerArray.push(player5);
    assert.equal(game1.getPlayer(5).getUserID(), player5.getUserID(), "players list successfully updated");

    assert.equal(game1.removePlayer(player5.getUserID()), true, "Player removed successfully");
    playerArray.pop();
    assert.equal(game1.getPlayer(5), undefined, "players list successfully updated");

    let bub = new Bubble();
    bub.init_bubble("Bubble", 0, 0, 0, 0);
    
    const snap1 = new Snapshot(1, bub);
    const snap2 = new Snapshot(2, bub);
    const snap3 = new Snapshot(3, bub);

    const snapArray = [snap1];

    assert.equal(game1.addSnapshot(snap1), SUCCESS, "Snapshot added successfully");
    assert.equal(game1.getSnapshot(1).getSnapshotID(), snap1.getSnapshotID(), "Snap list successfully updated");
    assert.equal(game1.getSnapshot(snap1.getSnapshotID()), snap1, "Can successfully get snapshot");

    assert.equal(game1.addSnapshot(snap2), SUCCESS, "Snapshot added successfully");
    snapArray.push(snap2);
    assert.equal(game1.getSnapshot(2).getSnapshotID(), snap2.getSnapshotID(), "Snap list successfully updated");
    assert.equal(game1.getSnapshot(snap2.getSnapshotID()), snap2, "Can successfully get snapshot");

    assert.equal(game1.addSnapshot(snap3), SUCCESS, "Snapshot added successfully");
    snapArray.push(snap3);
    assert.equal(game1.getSnapshot(3).getSnapshotID(), snap3.getSnapshotID(), "Snap list successfully updated");

    assert.equal(game1.getSnapshot(snap3.getSnapshotID()), snap3, "Can successfully get snapshot");

    assert.equal(game1.removeSnapshot(3), true, "Can successfully remove snapshot");
    snapArray.pop();

    assert.equal(game1.getSnapshot(3), undefined, "A lack of snapshot should return failure");

    const chat1 = new Chat(1);
    const chat2 = new Chat(2);

    const chatArray = [chat1];

    assert.equal(game1.addChat(chat1), SUCCESS, "Chat added successfully to game");
    assert.equal(game1.getChat(1).getChatID(), chat1.getChatID(), "chat list successfully updated for Game object");

    assert.equal(game1.addChat(chat2), SUCCESS, "Chat added successfully");
    chatArray.push(chat2);
    assert.equal(game1.getChat(2).getChatID(), chat2.getChatID(), "Can successfully get Chat 2");

    assert.equal(game1.removeChat(2), true, "Can successfully remove Chat");
    chatArray.pop();
    assert.equal(game1.getChat(2), undefined, "chat list successfully updated");

});

QUnit.test("Game Start and endGame", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Player()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Player()
    player3.init(3, 'player3', Location1, ALIVE);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);

    assert.equal(test_game.startGame(), FAILURE, "Game cannot start with too few players");
    assert.equal(test_game.getGameActive(), INACTIVE, "Started game is not active");
    assert.equal(test_game.endGame(), FAILURE, "Unstarted game cannot endGame");
    assert.equal(test_game.getGameActive(), INACTIVE, "Unstarted game is not active");

    const player4 = new Player()
    player4.init(4, 'player4', Location1, ALIVE);
    const player5 = new Player()
    player5.init(5, 'player5', Location1, ALIVE);

    test_game.addPlayer(player4);
    test_game.addPlayer(player5);

    assert.equal(test_game.getPlayerCount(), 5, "Can count players outside of game");
    assert.equal(test_game.getRoleCount(CIVILIAN), 0, "No role assigned, no civilians");
    assert.equal(test_game.getRoleCount(KILLER), 0, "No role assigned, no killers");

    assert.equal(test_game.getFractionRole(CIVILIAN), 0, "No role assigned, no civilians");
    assert.equal(test_game.getFractionRole(KILLER), 0, "No role assigned, no killers");

    assert.equal(test_game.startGame(), SUCCESS, "Game can start when meeting minimum players");
    assert.equal(test_game.getGameActive(), ACTIVE, "Started game is active")

    assert.equal(test_game.getPlayerCount(), 5, "Can count players in game");
    assert.equal(test_game.getRoleCount(CIVILIAN), 4, "Should start game with 4 civilians");
    assert.equal(test_game.getRoleCount(KILLER), 1, "Should start game with 1 killer");

    assert.equal(test_game.getFractionRole(CIVILIAN), 0.8, "Should be 80% civilians");
    assert.equal(test_game.getFractionRole(KILLER), 0.2, "Should be 20% killers");

    assert.equal(test_game.endGame(), SUCCESS, "Can stop a game");
    assert.equal(test_game.getGameActive(), INACTIVE, "Stopped game is not active");

    assert.equal(test_game.startGame(), SUCCESS, "Game can start with five or more players");

    setTimeout(() => {
    assert.equal(test_game.getGameActive(), INACTIVE, "Stopped game is not active")
    }, 10000)

});


QUnit.test("Vote Handler when player is voted off", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Player()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Player()
    player3.init(3, 'player3', Location1, ALIVE);

    //Initialize a Common chat so that players can vote for each other
    const chat1 = new Chat(1)
    chat1.insertPlayer(player1);
    chat1.insertPlayer(player2);
    chat1.insertPlayer(player3);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);
    test_game.addChat(chat1);

    player1.voteForExecution(2);
    player2.voteForExecution(3);
    player3.voteForExecution(2);
    //Player2 should be voted out
    test_game.countVoteProcess();
    //After killing the function a couple things should have occurred:
    // 1) Player 2 should be dead
    // 2) Player 1 and 3 should have their votes reset to 0 again
    assert.equal(player2.getAliveStatus(), DEAD, "player2 was voted off successfully");
    assert.equal(player1.getVotes(), 0, "Player1 votes should have reset");
    assert.equal(player3.getVotes(), 0, "Player3 votes should have reset");

});

QUnit.test("Vote Handler when player is NOT voted off", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Player()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Player()
    player3.init(3, 'player3', Location1, ALIVE);

    //Initialize a Common chat so that players can vote for each other
    const chat1 = new Chat(1)
    chat1.insertPlayer(player1);
    chat1.insertPlayer(player2);
    chat1.insertPlayer(player3);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);
    test_game.addChat(chat1);

    player1.voteForExecution(2);
    player2.voteForExecution(3);
    player3.voteForExecution(1);
    //NO player should have been voted off, no one has over 50% of the votes
    test_game.countVoteProcess();
    //After killing the function a couple things should have occurred:
    // 1) All players should still be alive
    // 2) All players should have their vote field reset back to 0
    assert.equal(player1.getAliveStatus(), ALIVE, "Player1 should still be alive");
    assert.equal(player2.getAliveStatus(), ALIVE, "Player2 should still be alive");
    assert.equal(player3.getAliveStatus(), ALIVE, "player 3 should still b e alive");
    assert.equal(player1.getVotes(), 0, "Votes for player 1 should have reset");
    assert.equal(player2.getVotes(), 0, "Votes for Player2 should have reset");
    assert.equal(player3.getVotes(), 0, "Votes for Player 3 should have reset");

});

QUnit.test("Players remaining plus no killers", function(assert) {
    const gameRules = new GameRules();
  
    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Civilian()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Civilian()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Civilian()
    player3.init(3, 'player3', Location1, ALIVE);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);

    const remaining_players = test_game.playersRemaining();
    const remaining_civilians = test_game.civiliansRemaining();
    const remaining_killers = test_game.killersRemaining();
    assert.equal(remaining_players, 3);
    assert.equal(remaining_civilians, 3);
    assert.equal(remaining_killers, 0);

    //Kill off Player 1
    player1.getKilled();
    assert.equal(player1.getAliveStatus(), DEAD, "Player 1 should have been killed");
    assert.equal(player2.getAliveStatus(), ALIVE, "Player 2 still alive");
    assert.equal(player3.getAliveStatus(), ALIVE, "Player 3 still alive");

    const new_remaining_civilians = test_game.civiliansRemaining();
    assert.equal(new_remaining_civilians, 2, "There are now only 2 remaining Civilians");

    const winning_con = test_game.winningCondition();
    assert.equal(winning_con, CIVILIAN, "No killers, so Civlians win");
});

QUnit.test("Players remainding + Killers win", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Civilian()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Civilian()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Killer()
    player3.init(3, 'player3', Location1, ALIVE);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);

    const remaining_players = test_game.playersRemaining();
    const remaining_civilians = test_game.civiliansRemaining();
    const remaining_killers = test_game.killersRemaining();
    assert.equal(remaining_players, 3, "Total players at init game");
    assert.equal(remaining_civilians, 2, "Total civilians at init game");
    assert.equal(remaining_killers, 1, "Total killers at init game");

    //Kill off Player 1 & 2
    player1.getKilled();
    player2.getKilled();
    assert.equal(player1.getAliveStatus(), DEAD, "Player 1 was killed off");
    assert.equal(player2.getAliveStatus(), DEAD, "Player 2 was killed off");
    assert.equal(player3.getAliveStatus(), ALIVE, "Killer should still be fine");

    const new_remaining_civilians = test_game.civiliansRemaining();
    assert.equal(new_remaining_civilians, 0, "All civilians were killed off");

    const winning_con = test_game.winningCondition();
    assert.equal(winning_con, KILLER, "Killers should have won");
});

QUnit.test("Players remainding + Game in Progress", function(assert) {
    const gameRules = new GameRules();

    const now = new Date();

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Civilian()
    player1.init(1, 'player1', Location1, ALIVE); 
    const player2 = new Civilian()
    player2.init(2, 'player2', Location1, ALIVE);
    const player3 = new Killer()
    player3.init(3, 'player3', Location1, ALIVE);

    const playerArray = [player1, player2, player3];
    const player_map = new Map(
        playerArray.map(object => {
          return [object.getUserID(), object];
        }),
      );

    const test_game = new Game(gameRules, test_map, player_map);

    const remaining_players = test_game.playersRemaining();
    const remaining_civilians = test_game.civiliansRemaining();
    const remaining_killers = test_game.killersRemaining();
    assert.equal(remaining_players, 3, "At the start theree are three players still alive");
    assert.equal(remaining_civilians, 2, "There are two Civlians");
    assert.equal(remaining_killers, 1, "And there is one killer");

    //Kill off Player 1
    player1.getKilled();
    assert.equal(player1.getAliveStatus(), DEAD, "Player 1 was killed off");
    assert.equal(player2.getAliveStatus(), ALIVE, "Player2 was still healthy");
    assert.equal(player3.getAliveStatus(), ALIVE, "Player3 was still healthy");

    const new_remaining_civilians = test_game.civiliansRemaining();
    const new_remaining_killers = test_game.killersRemaining();
    assert.equal(new_remaining_civilians, 1, "There is now only 1 civilians left standing");
    assert.equal(new_remaining_killers, 1, "there is now only 1 killer left standing");

    const winning_con = test_game.winningCondition();
    assert.equal(winning_con, INPROGRESS, "Game not over yet");
});
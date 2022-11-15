import {Game, CIVILIAN, KILLER} from '../app/game/game.component'
import {Player} from '../app/player/player_class_declaration';
import { CampusMap } from '../app/map/campus-map.component';
import {Chat} from '../app/chat/chat_class_declaration';

const DEAD = 0
const ALIVE = 1
const SUCCESS = 10
const FAILURE = -10

class Location{
    location // An int

    constructor(location){
        this.location = location
    }
}

QUnit.test("Game Constructors and Basic Getters and Setters", function(assert) {
    const now = new Date();
    const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player(1, 'player1', Location1, ALIVE); 
    const player2 = new Player(2, 'player2', Location1, ALIVE);
    const player3 = new Player(3, 'player3', Location1, ALIVE);
    const player4 = new Player(4, 'player4', Location1, ALIVE);
    const player5 = new Player(5, 'player4', Location1, ALIVE);
    const playerArray = [player1, player2, player3, player4, player5];

    const playersMap = new Map()
    for (const p of playerArray) {
        playersMap.set(p.userID, p)
      }

    const game1 = new Game(next_week, test_map, null);
    assert.false(game1.isGameActive(), "New game is not active");
    assert.equal(game1.getEndTime(), next_week, "End date is set time");
    assert.equal(game1.getCurrentTime(), now, "Current game time updates over time");
    assert.equal(game1.getMap(), test_map, "Map has been set properly");

    const three_days_from_now = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const test_map2 = new CampusMap();

    assert.equal(game1.setEndTime(three_days_from_now), SUCCESS, "End date successfully set");
    assert.equal(game1.getMap(), SUCCESS, "New map successfully set");

    assert.equal(game1.getEndTime(), three_days_from_now, "End date is new set time");
    assert.equal(game1.getMap(), test_map2, "Map has been set properly");

    const game2 = new Game(next_week, test_map, playersMap);
    assert.deepEqual(game2.getPlayers(), playerArray, "game players set properly in constructor");
    assert.false(game2.isGameActive(), "New game is not active");
    assert.equal(game2.getEndTime(), next_week, "End date is set time");
    assert.equal(game2.getCurrentTime(), now, "Current game time updates over time");
    assert.equal(game2.getMap(), test_map, "Map has been set properly");

    game1.startGame();

    assert.true(game1.isGameActive(), "Game reads as active after start");

});

QUnit.test("Game Hashtable Handling", function(assert) {
    const now = new Date();
    const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player(1, 'player1', Location1, ALIVE); 
    const player2 = new Player(2, 'player2', Location1, ALIVE);
    const player3 = new Player(3, 'player3', Location1, ALIVE);
    const player4 = new Player(4, 'player4', Location1, ALIVE);
    const player5 = new Player(5, 'player5', Location1, ALIVE);
    const playerArray = [player1, player2, player3];

    const playersMap = new Map()
    for (const p of playerArray) {
        playersMap.set(p.userID, p)
      }

    const game1 = new Game(next_week, test_map, playersMap);
    assert.deepEqual(game1.getPlayers(), playerArray, "game players set properly in constructor");
    
    assert.equal(game1.addPlayer(player4), SUCCESS, "Player added successfully");
    playerArray.push(player4);
    assert.deepEqual(game1.getPlayers(), playerArray, "players list successfully updated");
    assert.equal(game1.getPlayer(player4.getUserID()), player4, "Can get player from list");
    assert.equal(game1.addPlayer(player5), SUCCESS, "Player added successfully");
    playerArray.push(player5);
    assert.deepEqual(game1.getPlayers(), playerArray, "players list successfully updated");

    assert.equal(game1.removePlayer(player5.getUserID()), player5, "Player removed successfully");
    playerArray.pop();
    assert.deepEqual(game1.getPlayers(), playerArray, "players list successfully updated");

    assert.equal(game1.getPlayer(player5.getUserID()), "", "A lack of player should return failure");

    /*
    const snap1 = new GMSnapshot();
    const snap2 = new GMSnapshot();
    const snap3 = new GMSnapshot();

    const snapArray = [snap1];

    assert.equal(game1.addSnapshot(snap1), SUCCESS, "Snapshot added successfully");
    assert.equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");
    assert.equal(game1.getSnapshot(snap1.getSnapshotID()), snap1, "Can successfully get snapshot");

    assert.equal(game1.addSnapshot(snap2), SUCCESS, "Snapshot added successfully");
    snapArray.push(snap2);
    assert.equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");
    assert.equal(game1.getSnapshot(snap2.getSnapshotID()), snap2, "Can successfully get snapshot");

    assert.equal(game1.addSnapshot(snap3), SUCCESS, "Snapshot added successfully");
    snapArray.push(snap3);
    assert.equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");

    assert.equal(game1.getSnapshot(snap3.getSnapshotID()), snap3, "Can successfully get snapshot");

    assert.equal(game1.removeSnapshot(snap3.getSnapshotID()), snap3, "Can successfully remove snapshot");
    snapArray.pop();
    assert.equal(game1.getSnapshots(), snapArray, "Snap list successfully updated");

    assert.equal(game1.getSnapshot(snap3.getSnapshotID()), "", "A lack of snapshot should return failure");

    */

    const chat1 = new Chat(1);
    const chat2 = new Chat(2);
    const chat3 = new Chat(3);

    const chatArray = [chat1];

    assert.equal(game1.addChat(chat1), SUCCESS, "Chat added successfully");
    assert.deepEqual(game1.getChats(), chatArray, "chat list successfully updated");
    assert.equal(game1.getChat(chat1.getChatID()), chat1, "Can successfully get Chat");

    assert.equal(game1.addChat(chat2), SUCCESS, "Chat added successfully");
    chatArray.push(chat2);
    assert.deepEqual(game1.getChats(), chatArray, "chat list successfully updated");
    assert.equal(game1.getChat(chat2.getChatID()), chat2, "Can successfully get Chat");

    assert.equal(game1.addChat(chat3), SUCCESS, "Chat added successfully");
    chatArray.push(chat3);
    assert.deepEqual(game1.getChats(), chatArray, "chat list successfully updated");

    assert.equal(game1.getChat(chat3.getChatID()), chat3, "Can successfully get Chat");

    assert.equal(game1.removeChat(chat3.getChatID()), chat3, "Can successfully remove Chat");
    chatArray.pop();
    assert.deepEqual(game1.getChats(), chatArray, "chat list successfully updated");

    assert.equal(game1.getChat(chat3.getChatID()), "", "A lack of Chat should return failure");


});

QUnit.test("Game Start and End", function(assert) {
    const now = new Date();
    const next_week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const test_map = new CampusMap();

    const Location1 = new Location(1);

    const player1 = new Player(1, 'player1', Location1, ALIVE); 
    const player2 = new Player(2, 'player2', Location1, ALIVE);
    const player3 = new Player(3, 'player3', Location1, ALIVE);

   const playerArray = [player1, player2, player3];

   const playersMap = new Map()
    for (const p of playerArray) {
        playersMap.set(p.userID, p)
      }

    const test_game = new Game(next_week, test_map, playersMap);

    assert.equal(test_game.startGame(), FAILURE, "Game cannot start with too few players");
    assert.false(test_game.isGameActive(), "Unstarted game is not active");
    assert.equal(test_game.endGame(),FAILURE, "Unstarted game cannot end");
    assert.false(test_game.isGameActive(), "Unstarted game is not active");

    const player4 = new Player(4, 'player4', Location1, ALIVE);
    const player5 = new Player(5, 'player5', Location1, ALIVE);

    test_game.addPlayer(player4);
    test_game.addPlayer(player5);

    assert.equal(test_game.PlayerCount, 3, "Can count players outside of game");
    assert.equal(test_game.getRoleCount(CIVILIAN), 0, "No role assigned, no civilians");
    assert.equal(test_game.getRoleCount(KILLER), 0, "No role assigned, no killers");

    assert.equal(test_game.getFractionRole(CIVILIAN), 0, "No role assigned, no civilians");
    assert.equal(test_game.getFractionRole(KILLER), 0, "No role assigned, no killers");

    assert.equal(test_game.endGame(),FAILURE, "Unstarted game cannot end");
    assert.false(test_game.isGameActive(), "Unstarted game is not active");

    assert.equal(test_game.startGame(), SUCCESS, "Game can start with five or more players");
    assert.true(test_game.isGameActive(), "Started game is active");

    assert.equal(test_game.PlayerCount, 5, "Can count players in game");
    assert.equal(test_game.getRoleCount(CIVILIAN), 3, "Should start game with 3 civilians");
    assert.equal(test_game.getRoleCount(KILLER), 1, "Should start game with 1 killer");

    assert.equal(test_game.getFractionRole(CIVILIAN), 0.8, "Should be 80% civilians");
    assert.equal(test_game.getFractionRole(KILLER), 0.2, "Should be 20% killers");

    assert.equal(test_game.endGame(), SUCCESS, "Can stop a game");
    assert.false(test_game.isGameActive(), "Stopped game is not active");

    playersMap.set(player4.getUserID(), player4);
    playersMap.set(player5.getUserID(), player5);

    const soon = new Date(now.getTime() + 1000);

    const test_game2 = new Game(soon, test_map, playersMap);
    assert.equal(test_game2.startGame(), SUCCESS, "Game can start with five or more players");

    //should delay by 1 second, need to write this in

    assert.false(test_game.isGameActive(), "Stopped game is not active");

});
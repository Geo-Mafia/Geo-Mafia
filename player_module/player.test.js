const DEAD = 0
const ALIVE = 1
const SUCCESS = 10
const FAILURE = -10

test("a player gets killed", () => {
    expect(getKilled()).toBe(SUCCESS);
})

test("takes a snapshot of player locations", () => {
    expect(takeSnapshot()).toBe(SUCCESS)
})

test("player opens a snapshot", () => {
    expect(open_snapshot()).toBe(SUCCESS)
})

// inline classes

var playerMap = new Map();
playerMap.set('player2', Location1);
playerMap.set('player3', Location2);
Player player1 = new Player(1, 'player1', Location, ALIVE); 
// Need to user the player_class_declaration
test("player checks the info of other people in the same bubble", () => {
    expect(player1.see_people_in_bubble(playerMap)).toBe(['player2'])
})

test("player opens a chat message", () => {
    expect(open_chat()).toBe(SUCCESS)
})

test("player sends out a chat message", () => {
    expect(send_chat(message)).toBe(SUCCESS)
})



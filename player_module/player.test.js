test("a player gets killed", () => {
    expect(getKilled()).toBe(SUCCESS);
})

test("takes a snapshot of player locations", () => {
    expect(takeSnapshot()).toBe(SUCCESS)
})
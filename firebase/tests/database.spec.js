
const assert = require('assert');

const { readFileSync, createWriteStream } = require('fs');
const http = require('http');

const testing = require('@firebase/rules-unit-testing');
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;

const { ref, get, update } = require('firebase/database');

/** @type testing.RulesTestEnvironment */
let testEnv;

const projectId = "geo-mafia";

before(async () => {
  testEnv = await initializeTestEnvironment({
    database: {rules: readFileSync('../database.rules.json', 'utf8')},
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  testEnv.clearDatabase();
});

describe("firebase database security rules testing", () => {
  it('should allow anyone to read from database with rules disabled', async () => {
    // Setup: Create ref for testing (bypassing Security Rules)
    testEnv.withSecurityRulesDisabled(async context => {
      await context.database().ref('users/foobar').set({ foo: 'bar' });
    });
    // Setup: Create Rules Test Context
    const unauthedDb = testEnv.unauthenticatedContext().database();
    // Then test our security rules by trying to read it using the client SDK.
    await assertSucceeds(get(ref(unauthedDb, 'users/foobar')));
  });

});

describe("api unit testing", () => {
  it('able to write then read successfully', async () => {
    const successData = {
      username: "name",
      email: "email",
      profile_picture : "imageUrl"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(writeData(dir, data), true);

    // able to read data now
    const read = readData(dir);

    assert.deepEqual(read, successData);

  });

  it('able to delete successfully', async () => {
    const data = {
      username: "name",
      email: "email",
      profile_picture : "imageUrl"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(writeData(dir, data), true);

    // able to read data now
    const read = readData(dir);

    assert.deepEqual(read, data);

    // delete data now
    assert.equal(deleteData(dir, data), true);

    // shouldn't be able to read now
    const read2 = readData(dir);

    assert.equal(read2, 0);

  });

  it('able to update successfully', async () => {
    const data = {
      username: "name",
      email: "email",
      profile_picture : "imageUrl"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(writeData(dir, data), true);

    // able to read data now
    const read = readData(dir);

    assert.deepEqual(read, data);

    const data2 = {
      username: "new",
      email: "new email",
      profile_picture : "test2"
    };

    // update data now
    assert.equal(updateData(dir, data), true);

    // shouldn't be able to read now
    const read2 = readData(dir);

    assert.deepEqual(read2, data2);

  });

  it('able to reset database successfully', async () => {
    const data = {
      username: "name",
      email: "email",
      profile_picture : "imageUrl"
    };
    const data2 = {
      username: "new",
      email: "new email",
      profile_picture : "test2"
    };
    const dir = "users/test";
    // writeData should return true
    assert.equal(writeData(dir, data), true);
    assert.equal(writeData(dir, data2), true);


    // reset database now
    assert.equal(resetDatabase(), true);

    // shouldn't be able to read now
    const read = readData(dir);

    assert.equal(read, 0);

  });

});
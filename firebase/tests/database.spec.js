
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
  /*
  // Write the coverage report to a file
  const coverageFile = 'database-coverage.html';
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    const { host, port } = testEnv.emulators.database;
    const quotedHost = host.includes(':') ? `[${host}]` : host;
    http.get(`http://${quotedHost}:${port}/.inspect/coverage?ns=${testEnv.projectId}-default-rtdb`, (res) => {
      res.pipe(fstream, { end: true });

      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  console.log(`View database rule coverage information at ${coverageFile}\n`);
  */
});

beforeEach(async () => {
  testEnv.clearDatabase();
});

describe("firebase database testing", () => {
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
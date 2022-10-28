# Firebase Demo

This is a demo.js to demonstrate how we can add data to Firebase Realtime Database.  

## Installation

node_modules should already be included in the repository, but in the case you run into error, run
```bash
npm install firebase
```

## Links
* https://firebase.google.com/docs/database/web/start
* https://firebase.google.com/docs/database/web/structure-data
* https://firebase.google.com/docs/database/web/read-and-write
* https://firebase.google.com/docs/database/web/lists-of-data


## Explanation

When you run this demo via node.js
```bash
node demo.js
```

It will first create the config variable with the database URL:
```js
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://geo-mafia-default-rtdb.firebaseio.com/",
};
```
Note that currently the database is open to the public, and it allows reading and editing to the public, everyone who has the URL.  

Then, using the key we generate, we initialize Firebase or database as such:
```js
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
```

Once the database is initialized, we can add JSON info as such:

```js
function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
```

Notice that the ```'users/'``` part will create a directory of ```'users'``` in the database. In the ```'users'``` directory, a data object named ```userID``` will be created. This object will contain fields given by the program
which in this case ```username```, ```email```, ```profile_picture```. There is no set-rule which field to add, so presumably you can write two objects that have different fields.\

Now, we attempt to read what has been written on the database:
```js
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
```

Here, we attempt to grab the data object named ```users/${userId}```, and check if data exists. If so, we print out the fields of the data. 



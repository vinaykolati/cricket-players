const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketMatchDetails.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("server Running at http://localhost:3000/");
    );
  } catch(error) {
    console.log(`DB Error: ${error.message}`);
	process.exit(1);
  }
};

initializeDbAndServer();

const convertPlayerDbObjectToResponseObject = (playerObj) => {
  return {
    playerId: playerObj.player_id,
    playerName: playerObj.player_name,
  };
};

app.get("/players/", async (request,response) => {
  const playersQuery = `
    SELECT
      *
    FROM 
      player_details;`;
  const playersArray = await database.all(playersQuery);
  response.send(
    playersArray.map((player) => 
      convertPlayerDbObjectToResponseObject(player);
    )
  );
});

module.exports = app;

import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

function App() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [playerlist, setplayerlist] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [rows, setRows] = useState();
  const [email, setEmail] = useState("");
  const [info, setinfo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    getPlayerID();
  }

  function getPlayerID() {
    console.log(playerName);
    fetch(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
      .then((res) => res.json())
      .then(async (result) => {
        console.log(playerId);
        console.log(result);
        if (result.data[0].height_feet === null) {
          alert("This player does not exist");
        } else {
          
           setPlayerId(result.data[0].id);
          if (playerId != ""){
            
            await getPlayerStats();

          } else {
            alert("That player is trash btw");
          }
          
        }
      });
  }

  function getPlayerStats() {
    console.log(playerId);
    fetch(
      `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerId}`
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        console.log(result.data[0].games_played);
        const finalTable = (
          <tr>
            <th> {result.data[0].games_played} </th>
            <th> {result.data[0].min} </th>
            <th> {result.data[0].pts}</th>
            <th> {result.data[0].reb}</th>
            <th> {result.data[0].ast} </th>
            <th> {result.data[0].stl} </th>
            <th> {result.data[0].blk} </th>
            <th> {result.data[0].turnover} </th>
            <th> {result.data[0].fta} </th>
            <th> {result.data[0].ftm} </th>
            <th> {result.data[0].fg3a} </th>
            <th> {result.data[0].fg3m} </th>
            
          </tr>
        );
        setRows(finalTable);
      });
  }

  const addPlayer = () => {
    axios.post('https://cc-assignment-2-mern.herokuapp.com/addplayer', {
      name: name,
      description: description,
    }).then((response) => {
      setplayerlist([...playerlist, {_id:response.data._id, name: name, description: description}])
    });
  };
  
  const updatePlayer = (id) => {
    const newName = prompt("Enter new name: ");
    const newDescription = prompt("Enter new description: ")
    axios.put('https://cc-assignment-2-mern.herokuapp.com/update', {newName: newName, newDescription: newDescription, id: id}).then(() => {
      setplayerlist(playerlist.map((val) => {
        return val._id == id ? {_id: id, name: newName, description: newDescription}  : val
      }))
    });
  };

  const deletePlayer = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setplayerlist(playerlist.filter((val) => {
        return val._id != id;
      })
      );
    });
  };

  useEffect(() =>{
    axios.get('http://localhost:3001/read', {
    }).then((response) => {
      setplayerlist(response.data)
      // const update = prompt("Enter val: ");
      // console.log(update);
    }).catch(() => {
      console.log('ERROR');
    });
  }, []);


  const sendPlayer = () => {
    axios.post('https://cc-assignment-2-mern.herokuapp.com/sendplayer', {
      email: email,
      info: info,
    }).then(() => {
      alert("Check your email!");
    })
    alert("Check your email!");

  }

  return (
    <div className="App">

      <div className="jumbo"> 
        <Jumbotron fluid>
              <h1>NBA Player Application!</h1>
              <p>
                Keep track of your favourite players!
              </p>
            
            </Jumbotron> 
            </div>
      <div className="container">

        <div className="stats">
          <InputGroup className="mb-3">
            <FormControl
                  placeholder="Enter a Players name"
                  aria-label=""
                  aria-describedby="basic-addon2"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                  }}
            />
            <InputGroup.Append>
              <Button variant="secondary" onClick={handleSubmit}>
                    Submit
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Games Played</th>
                <th>Minutes per game</th>
                <th>Points per game</th>
                <th>Rebounds per game</th>
                <th>Assists per game</th>
                <th>Steals per game</th>
                <th>Blocks per game</th>
                <th>Turnovers per game</th>
                <th>FTA per game</th>
                <th>FTM per game</th>
                <th>3PA per game</th>
                <th>3PM per game</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      
      <div className="inputs">

        <h5>Player Name:</h5>
        <input id="name" type="text"
        label="Player Name" 
        onChange={(event) => {setName(event.target.value)
        }}/>
        
        <h5>Player Notes:</h5>
        <textarea id="info" type="text"
        onChange={(event) => {setDescription(event.target.value)
        }}/>
        <Button
        onClick={addPlayer}> Add Player</Button>
      </div>

      </div>
      <div className="final"> 
          {playerlist.map((val) =>{
          return (
          <div className="playerContainer">
            <div className="player"> 
            <h5>Player: </h5>{val.name} <h5>Information:</h5><p>{val.description}</p>
            </div>
            <Button  onClick={() => {updatePlayer(val._id)}} id="editButton"> Edit </Button>
            <Button id="removeButton" onClick={() => {deletePlayer(val._id)}}> Delete </Button>
            
            </div>)
          })}

      </div>

      <div className="email">
        <h4>Email yourself the deets!</h4>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Email"
              aria-label="Recipient's email"
              aria-describedby="basic-addon2"
              onChange={(event) => {setEmail(event.target.value)
              }}
            />
          </InputGroup>

          <textarea
              placeholder="Information"
              aria-describedby="basic-addon2"
              onChange={(event) => {setinfo(event.target.value)
              }}
            />

            <Button onClick={() => {sendPlayer()}}>Send!</Button>


      </div>
      
</div>
  );
}

export default App;

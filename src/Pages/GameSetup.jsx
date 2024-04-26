import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlayers } from './../API/api';
import '../Pages/styles/GameSetup.css';

const GameSetup = () => {
  const [selectedPlayers, setSelectedPlayers] = useState('single');
  const [selectedGame, setSelectedGame] = useState('301');
  const [selectedLegs, setSelectedLegs] = useState('1');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userIdCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_id='))
      ?.split('=')[1];

    if (userIdCookie) {
      const fetchUserData = async () => {
        try {
          const startTime = new Date();
          const response = await getPlayers();
          const endTime = new Date(); // Tijdregistratie beëindigen
          const elapsedTime = endTime - startTime; // Bereken de verstreken tijd in milliseconden

          // Sla de API-oproepstijd op in de lokale opslag
          localStorage.setItem('spelersOphalenStart', `starttijd: ${startTime}`);
          localStorage.setItem('spelersOphalenEind', `eindtijd: ${endTime}`);
          localStorage.setItem('spelersOphalenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);

          if (response.status === 200) {
            const player = response.data.players.find(player => player.id === parseInt(userIdCookie, 10));

            if (player) {
              setUser(player);
              setPlayers(response.data.players);
            } else {
              console.error('Geen speler gevonden met opgegeven gebruikers-ID.');
            }
          } else {
            console.error('Fout bij het ophalen van spelersgegevens.');
          }
        } catch (error) {
          console.error('Er is iets misgegaan:', error);
        }
      };

      fetchUserData();
    } else {
      setUser({ firstname: 'Guest'});
    }
  }, []);

  const filteredPlayers1 = players.filter(player => player.firstname === player1);
  const filteredPlayers2 = players.filter(player => player.firstname === player2);
  const player1Id = filteredPlayers1.map(player => player.id);
  const player2Id = filteredPlayers2.map(player => player.id);

  console.log('player1Id', player1Id);
  console.log('player2Id', player2Id);
  const handleStartGame = () => {
    // Controleer of er twee verschillende spelers zijn geselecteerd
    if (selectedPlayers === 'two' && player1 === 'select') {
      alert('Selecteer speler 1.');
      return;
    }
    if (selectedPlayers === 'two' && player2 === 'select') {
      alert('Selecteer speler 2.');
      return;
    }
    if (selectedPlayers === 'two' && player1 === 'guest' && player2 === 'guest') {
      navigate(`/board?players=${selectedPlayers}&game=${selectedGame}&legs=${selectedLegs}&player1=${player1}1&player2=${player2}2`);
      return;
    }
    if (selectedPlayers === 'two' && player1 === player2) {
      alert('Kies twee verschillende spelers om het spel te starten.');
      return;
    }
    if (selectedPlayers === 'two') {
      navigate(`/board?players=${selectedPlayers}&game=${selectedGame}&legs=${selectedLegs}&id1=${player1Id}&player1=${player1}&id2=${player2Id}&player2=${player2}`);
    } else {
      navigate(`/board?players=${selectedPlayers}&game=${selectedGame}&legs=${selectedLegs}&player1=${user.firstname}`);
    }
  };

  console.log('players', player1Id);

  return (
    <div className="flex flex-col items-center justify-center">
      <img src='../../public/logo.png' alt='Logo' className='logoSign ' />
      <div className="welkom flex flex-col items-center">
        {user && (
          <div className="user-info mb-5">
            <p>
              Welcome {user.firstname} {user.nickname && `"${user.nickname}"`} {user.name && user.name ? user.name : ''}
            </p>
          </div>
        )}
      </div>
      <div className='setup-all'>
        <div className='setup-row'>
          <label className="setup-label">Select players:</label>
          <select
            value={selectedPlayers}
            onChange={(e) => setSelectedPlayers(e.target.value)}
            className="setup-select"
          >
            <option value="single">Single player</option>
            <option value="two">Two players</option>
          </select>
        </div>

        {selectedPlayers === 'single' && (
          <div className='setup-row'>
            <label className="setup-label">Player:</label>
            <input
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              placeholder="Enter your name"
              className="setup-input"
            />
          </div>
        )}

        {selectedPlayers === 'two' && (
          <>
            <div className='setup-row'>
              <label className="setup-label">Player 1:</label>
              <input
                type="text"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="Enter Player 1's name"
                className="setup-input"
              />
            </div>
            <div className='setup-row'>
              <label className="setup-label">Player 2:</label>
              <input
                type="text"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                placeholder="Enter Player 2's name"
                className="setup-input"
              />
            </div>
          </>
        )}


        <div className='setup-row'>
          <label className="setup-label">Select game:</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="setup-select"
          >
            <option value="301">301</option>
            <option value="501">501</option>
            <option value="701">701</option>
          </select>
        </div>
        <div className='setup-row'>
          <label className="setup-label">Select legs:</label>
          <select
            value={selectedLegs}
            onChange={(e) => setSelectedLegs(e.target.value)}
            className="setup-select"
          >
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleStartGame}
        className="setup-button"
      >
       Start game
      </button>
    </div>
  );
};

export default GameSetup;

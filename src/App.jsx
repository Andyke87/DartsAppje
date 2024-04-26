import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getPlayers } from './API/api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userIdCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_id='))
      ?.split('=')[1];

    if (userIdCookie) {
      const fetchPlayersData = async () => {
        try {
          const startTime = new Date();
          const response = await getPlayers();
          const endTime = new Date();
          const elapsedTime = endTime - startTime;

          localStorage.setItem('spelersOphalenStart', `starttijd: ${startTime}`);
          localStorage.setItem('spelersOphalenEind', `eindtijd: ${endTime}`);
          localStorage.setItem('spelersOphalenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);

          if (response.status === 200) {
            const player = response.data.players.find(player => player.id === parseInt(userIdCookie, 10));

            if (player) {
              setUser(player);
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

      fetchPlayersData();
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='logo'>
        <img src="../public/logo.png" alt="Logo" />
      </div>
      <div>
        <div className='welkom flex flex-col items-center'>
          {user ? (
            <>
              <div className='user-info mb-5'>
                <p>Welkom {user.firstname} "{user.nickname}" {user.name}</p>
              </div>
              <div className='startBtn'>
                <NavLink to="/game">
                  Game
                </NavLink>
              </div>
              <div className='startBtn'>
                <NavLink to="/info">
                  Practical info
                </NavLink>
              </div>
              <div className='startBtn'>
                <NavLink to={`/playerdetails/${user.id}`}>
                  Player Details
                </NavLink>
              </div>
              <div className='startBtn'>
                <NavLink onClick={handleLogout} to="/">
                  Logout
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div className='startBtn'>
                <NavLink to="/game">
                  Game
                </NavLink>
              </div>
              <div className='startBtn'>
                <NavLink to="/info">
                  Practical info
                </NavLink>
              </div>
              {/* <div className='startBtn'>
                <NavLink to="/Login">
                  Login
                </NavLink>
              </div>
              <div className='startBtn'>
                <NavLink to="/Register">
                  Register
                </NavLink>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGames, getPlayers } from '../API/api';
import '../Pages/styles/PlayerDetails.css';

const PlayerDetails = () => {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const { userId } = useParams();

  const fetchAndSetGamesAndPlayers = async () => {
    try {
      const startTime = new Date();
      const [gamesResponse, playersResponse] = await Promise.all([getGames(), getPlayers()]);
      const endTime = new Date();
      const elapsedTime = endTime - startTime;

      localStorage.setItem('gamesOphalenStart', `starttijd: ${startTime}`);
      localStorage.setItem('gamesOphalenEind', `eindtijd: ${endTime}`);
      localStorage.setItem('gamesOphalenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);

      console.log('id:', userId);
      console.log('gamesResponse:', gamesResponse);
      console.log('playersResponse:', playersResponse);

      if (gamesResponse.status === 200 && playersResponse.status === 200) {
        const filteredGames = gamesResponse.data.games.filter(
          (game) => game.id_speler1.toString() === userId || game.id_speler2.toString() === userId
        );

        const uniquePlayerIds = [...new Set(filteredGames.map((game) => [game.id_speler1, game.id_speler2]).flat())];

        const filteredPlayers = playersResponse.data.players.filter(
          (player) => uniquePlayerIds.includes(player.id)
        );

        setGames(filteredGames);
        setPlayers(filteredPlayers);
      } else {
        console.error('Fout bij het ophalen van de games of spelers.');
      }
    } catch (error) {
      console.error('Error fetching games and players:', error);
    }
  };

  useEffect(() => {
    fetchAndSetGamesAndPlayers();
  }, [userId]);

   return (
    <div className="container mx-auto mt-8 flex items-center flex-col">
      <img src='../../public/logo.png' alt='Logo' className='logoSign mb-4' />
      <h2 className="titleDetail">Player Details</h2>
      {games.length > 0 ? (
        <div className="grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <p>
                <strong>ID:</strong> {game.id}
              </p>
              <p>
                <strong>Player 1:</strong> {getPlayerName(game.id_speler1)}
              </p>
              <p>
                <strong>Player 2:</strong> {getPlayerName(game.id_speler2)}
              </p>
              <p>
                <strong>Game Type:</strong> {game.gametype}
              </p>
              <p>
                <strong>Score:</strong> {game.score}
              </p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No games found for this player.</p>
      )}
    </div>
  );

  function getPlayerName(playerId) {
    const player = players.find((player) => player.id === playerId);
    return player ? `${player.firstname} "${player.nickname}" ${player.name}` : 'Unknown Player';
  }
};

export default PlayerDetails;

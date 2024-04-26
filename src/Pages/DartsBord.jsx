import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Score from '../components/Score';
import Border from '../components/Border';
import './styles/DartsBord.css';
import { addGame } from '../API/api';

let legs = 0;
let player1Legs = 0;
let player2Legs = 0;

const DartsBord = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const getInitialScore = (selectedGame) => {
    switch (selectedGame) {
      case '301':
        return 301;
      case '501':
        return 501;
      case '701':
        return 701;
      default:
        return 0;
    }
  };
  
  const [dartboard, setDartboard] = useState([]);
  const [selectedGame, setSelectedGame] = useState(searchParams.get('game') || '301');
  const [selectedPlayers, setSelectedPlayers] = useState(searchParams.get('players') || 'single');
  const [selectedLegs, setSelectedLegs] = useState(searchParams.get('legs') || '1');
  const [player1, setPlayer1] = useState(searchParams.get('player1') || '');
  const [player2, setPlayer2] = useState(searchParams.get('player2') || '');
  const [idPlayer1, setIdPlayer1] = useState(searchParams.get('id1') || '');
  const [idPlayer2, setIdPlayer2] = useState(searchParams.get('id2') || '');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [clicksRemaining, setClicksRemaining] = useState(3);
  const [initialScore, setInitialScore] = useState(() => getInitialScore(selectedGame));
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [totalThrow, setTotalThrow] = useState(0);
  const [trowsP1, setTrowsP1] = useState(0);
  const [trowsP2, setTrowsP2] = useState(0);
  const [throw1, setThrow1] = useState(null);
  const [throw2, setThrow2] = useState(null);
  const [throw3, setThrow3] = useState(null);

  const handleFieldClick = (field) => {
    if (clicksRemaining > 0) {
      const updatedDartboard = [...dartboard, { field, player: currentPlayer }];
      setDartboard(updatedDartboard);
      setClicksRemaining(clicksRemaining - 1);
      const total = getRemainingScore();
      const start = 0;
      const totalThrow = updatedDartboard.reduce((total, dart) => total + dart.field, start);
      console.log("field:", totalThrow);
      if (!throw1) {
        if (total - field < 0) {
          alert('Throw too high, try again.');
          setThrow1(null);
          setThrow2(null);
          setThrow3(null);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, 0,0,0]);
          }
          else {
            setTrowsP2([...trowsP2, 0,0,0]);
          }
          setClicksRemaining(0);
          return; 
        } else if (total - field === 0) {
          setThrow1(field);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, field]);
          }
          else {
            setTrowsP2([...trowsP2, field]);
          }
          handleGameEnd();
        } else {
          setThrow1(field);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, field]);
          } else {
            setTrowsP2([...trowsP2, field]);
          }
        }
      } else if (!throw2) {
        if (total - field < 0) {
          alert('Throw too high, try again.');
          setThrow2(null);
          setThrow3(null);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, 0]);
          } else {
            setTrowsP2([...trowsP2, 0]);
          }
          setClicksRemaining(0);
          return;
        } 
        else if (total - field === 0) {
          setThrow2(field);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, field]);
          } else {
            setTrowsP2([...trowsP2, field]);
          }
          handleGameEnd();
        } else {
          setThrow2(field);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, field]);
          } else {
            setTrowsP2([...trowsP2, field]);
          }
        }
      } else if (!throw3) {
        if (total - field < 0) {
          alert('Throw too high, try again.');
          setThrow3(null);
          if (currentPlayer === 1) {
            setTrowsP1([...trowsP1, 0]);
          }
          else {
            setTrowsP2([...trowsP2, 0]);
          }
          setClicksRemaining(3);
          return;
        }
        setThrow3(field);
        if (currentPlayer === 1) {
          setTrowsP1([...trowsP1, field]);
        }
        else {
          setTrowsP2([...trowsP2, field]);
      }
    }
    };
  };

  const handleGameStart = () => {
    legs = legs + 1;
    setInitialScore(getInitialScore(selectedGame));
    setPlayer1Score(getInitialScore(selectedGame));
    setPlayer2Score(getInitialScore(selectedGame));
    setTrowsP1([]);
    setTrowsP2([]);
      if (legs % 2 === 0) {
        setCurrentPlayer(1);
      }
      else {
        setCurrentPlayer(2);
      }
  };

  const handleGameEnd = async () => {    
    if (currentPlayer === 1) {
      player1Legs = player1Legs + 1;
      alert(`${player1} has won the leg!`);
    } else {
      player2Legs = player2Legs + 1;
      alert(`${player2} has won the leg!`);
    }

    if (legs > selectedLegs) {
      legs = 0;
      const gamescore = `${player1Legs} - ${player2Legs}`;

      if (player1 !== 'guest' && player2 !== 'guest') {
        try {
          if (player1 === 'guest') {
            setIdPlayer1(4);
          }
          if (player2 === 'guest') {
            setIdPlayer2(4);
          }
          const startTime = new Date();
          const response = await addGame({
            id_speler1: idPlayer1,
            id_speler2: idPlayer2,
            gametype: selectedGame,
            score: gamescore
          });
          const endTime = new Date(); // Tijdregistratie beëindigen
          const elapsedTime = endTime - startTime; // Bereken de verstreken tijd in milliseconden

          // Sla de API-oproepstijd op in de lokale opslag
          localStorage.setItem('gameOpslaanStart', `starttijd: ${startTime}`);
          localStorage.setItem('gameOpslaanEind', `eindtijd: ${endTime}`);
          localStorage.setItem('gameOpslaanVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);

          if (response.status === 200) {
            alert('Game saved!');
          }
          if (player1Legs > player2Legs) {
            alert(`${player1} has won the game with ${player1Legs} - ${player2Legs}`);
          } else {
            alert(`${player2} has won the game ${player1Legs} - ${player2Legs}`);
          }
          player1Legs = 0;
          player2Legs = 0;
          
          navigate('/');
        } catch (error) {
          alert('Error while adding game:', error);
        }
      } else {
        alert('Cannot save game when both players are guests.');
      }
    } else {
      handleGameStart();
    }
  };

  const setPlayerScore = (newScore) => {
    if (currentPlayer === 1) {
      setPlayer1Score(Math.max(newScore, 0));
    } else {
      setPlayer2Score(Math.max(newScore, 0));
    }
  };

  const getRemainingScore = () => {
    return currentPlayer === 1 ? player1Score : player2Score;
  };

  useEffect(() => {
    handleGameStart();
  }, []); 

  useEffect(() => {
    if (clicksRemaining === 0) {
    
      let totalThrow = dartboard.reduce((total, dart) => total + dart.field, 0);
      setTotalThrow(totalThrow);
      const remainingScore = getRemainingScore();

      if (totalThrow > remainingScore) {
        alert(`Turn is over, throw too high.`);
      } 
      else {
        let newScore = remainingScore - totalThrow;
        setPlayerScore(newScore);

        if (newScore === 0) {
          handleGameEnd();
        }
      }
      setTimeout(() => {
        setClicksRemaining(3);
        setCurrentPlayer(selectedPlayers === 'single' ? currentPlayer : (currentPlayer === 1 ? 2 : 1));
        setDartboard([]);
        setThrow1(null);
        setThrow2(null);
        setThrow3(null);
      }, 2000);
    }
  }, [clicksRemaining, selectedGame]);
  
  return (
    <div className='dartsGame'>
      <div className='spel'>
        <div className="thrown-darts">
          <div>
            <label htmlFor="arrow1"> Arrow 1</label>
            <div className="dart-throw">{throw1 !== null ? (throw1 === 0 ? '0' : throw1) : '-'}</div>
          </div>
          <div>
            <label htmlFor="arrow2"> Arrow 2</label>
            <div className="dart-throw">{throw2 !== null ? (throw2 === 0 ? '0' : throw2) : '-'}</div>
          </div>
          <div>
            <label htmlFor="arrow3"> Arrow 3</label>
            <div className="dart-throw">{throw3 !== null ? (throw3 === 0 ? '0' : throw3) : '-'}</div>
          </div>
        </div>
      </div>
      <div className="darts-players">
          <Score 
            className={'player'} 
            player={player1} 
            score={player1Score} 
            isCurrentPlayer={currentPlayer === 1} 
            legsWon={player1Legs}
            throws={trowsP1}
            selectedGame={selectedGame}

          />
        {selectedPlayers !== 'single' && selectedPlayers !== '' && (
            <Score 
              className={'player'} 
              player={player2} 
              score={player2Score} 
              isCurrentPlayer={currentPlayer === 2} 
              legsWon={player2Legs}
              throws={trowsP2}
              selectedGame={selectedGame}
            />
        )}
      </div>
      <div className='bord'>
          <Border handleFieldClick={handleFieldClick} />
        </div>
    </div>
  );
}
export default DartsBord;

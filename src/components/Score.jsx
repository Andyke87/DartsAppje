import React, { useState, useEffect } from 'react';
import dartPijl from '../../public/dartpijl.png';
import { getThrowouts } from '../API/api';

const Score = ({ player, score, isCurrentPlayer, legsWon, throws, selectedGame}) => {
  const [average, setAverage] = React.useState(undefined);
  const [throwoutsList, setThrowoutsList] = useState([]);

  const numberOfThrows = throws.length;

  const calculateAverage = () => {
    if (numberOfThrows === 0) {
      return 0;
    }

    const remainingScore = selectedGame - score;
    const averageValue = remainingScore / numberOfThrows;
    return averageValue;
  };

  const fetchAndSetThrowouts = async () => {
    const startTime = new Date();
    const response = await getThrowouts();
    const endTime = new Date(); // Tijdregistratie beëindigen
    const elapsedTime = endTime - startTime; // Bereken de verstreken tijd in milliseconden

    // Sla de API-oproepstijd op in de lokale opslag
    localStorage.setItem('throwoutsOphalenStart', `starttijd: ${startTime}`);
    localStorage.setItem('throwoutsOphalenEind', `eindtijd: ${endTime}`);
    localStorage.setItem('throwoutsOphalenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);
    console.log('response:', response);
    if (response.status === 200) {
      // Filter de throwouts op de juiste score en sorteer op id
      const filteredThrowouts = response.data.throwouts.filter((throwout) => throwout.score === score).sort((a, b) => a.id - b.id);
      setThrowoutsList(filteredThrowouts);
    } else {
      console.error('Fout bij het ophalen van de throwouts.');
    }
  };

  useEffect(() => {
    // Wanneer de throws veranderen, herbereken de average
    setAverage(calculateAverage());
    fetchAndSetThrowouts();
  }, [throws, selectedGame, score]);


  return (
    <div className={`score ${isCurrentPlayer ? 'current-player' : ''}`}>
      <h1 className="player-info">
        {player}
        {isCurrentPlayer && <img src={dartPijl} alt="Dart Pijl" className="dart-pijl" />}
      </h1>
      {score !== '' && (
        <>
          <p className="player-info">
            Score: {score}
          </p>
          <p className='scoreP'>
            Legs Won: {legsWon || 0}
          </p>
          <p className='scoreP'>
            Arrows: {numberOfThrows}
          </p>
          {average !== undefined && (
            <p className='scoreP'>
              Average: {average.toFixed(2) || 0}
            </p>
          )}
          {throwoutsList.map((throwout) => {
            if (throwout.score === score) {
              return (
                <div key={throwout.id}>
                  <div>
                   {throwout.arrow1 && <p className='scoreP underline'>Suggestion: </p>}
                    {throwout.arrow2 && <p className='scoreP'>{throwout.arrow1}  {throwout.arrow2}  {throwout.arrow3}</p>}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};

export default Score;

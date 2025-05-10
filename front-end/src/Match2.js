import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clearMatchInformation, getMatchInformation, reportMatch } from './api';
import { getLeague } from './league';
import { BlackButton } from './black-button';
import {
    getAllPlayers
} from './shared/player-store.js';
import * as _ from 'lodash';
import {
  players,
  randomImages
} from './player-images.js';

const portraitBackground = '#d7cab8 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAGFBMVEUAAADUxrTczrzUyrzUwrTcyrzUyrTMwrRyw8X/AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAydJREFUOI0VlL124zoMhPkKI4BQ7ePrbI1QomtGklNzZSk1Q8uuGf/k9S+3FQ+BmfmGMhEi5CS+gCm5FW2LLShgGH5MMSHmaBNCz2O4KobF9G+98sU5uorqsbPRU2jLDubir1Ta7rEW+5LDbx7S83C5ajS4dVCnSlHghHRA80NzrAfwoRftgVkW2Wh9wueoe/NN3PVaVLisCLs/n+ifvfPfZgsBzjVVIh2hEm2ek0hSk5VW4RgfqSmRNoq3/StzpLpDM2nuILQVe4cWWnRmGNoNrTaFaGrxa9893hoANprrFSM4LhLshnlVx9Xq96gmQil9XCySjgQ3h1YdKUaDU3gpgXgAU6J1/ls6q8Wa99WyxkQxDnnGWfsIwvldzB5pX9ae0Gr47BZP71mQRQ2qLIu1D/+kkL1TW0VRl0y6xEoK4fGFxCPQp7Uis85EanhXyYAbqbReh5rdyKEz7lolIUZlr8MOEnGMtAMbwlxCnQLsz9IuuNPBh90Ik+oXYlmxQ+vct13D0eVz6UwrbsMNVgMhQS66ONgdP02zyqWyHzIiukClJtBsloupQ0D3xAU08I22P7Qj7To1w5bWbbCijM5zKDaldJUHzOsMJLvsH6rVXBf/aV2UJ4MZC3rkdqoMceZE6BryZMbhv9uclk9CAWvvU4Jf+nlvfIFjnOq8jxaMFaV3A4bRlMhWIOv3GKPH4WxDTE1uxDSDFBucMDTBToQT6YTINRIONA12ahOqsHs6iYYpiqkt+BhD6ChXQpelQVe6WgYxCCEL+SiR8Vnk8mxaCRFPoyR31X6iB9fL1TTez/ADG2Yi3YJ836WvNYI26UcEtQxIuX+TOXxdZ05YH0+KXxl345FD7eDcBz8ttSCFeAuYvszWPqI0t4gptP5RT3Q81FGrOWmN/GfVGGT+25Q3kpHZ5mIyzu44nqMD2NYnlm4CHvq6XLSq/K0uBhsove7grkwXmH7pfjx/ZaodqLd8barW6JMhejaKMuStmkgFVwyXaaqgOHVNmjU7G2wKOLKlcDx+1R9AUkmnMHi8CEMtaxX8VrkZZ6HRzT24btjJmu4rNs4f/wMMAexu5PIhuAAAAABJRU5ErkJggg==)';


const getPlayerImage = (playerName) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstLetter = playerName.toUpperCase().charAt(0);
  const index = alphabet.indexOf(firstLetter);
  const imageIndex = index % randomImages.length;
  return randomImages[imageIndex];
};


const statBox = {
  background: portraitBackground,
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  textAlign: 'center',
  fontFamily: `'League Spartan', 'Arial Black', sans-serif`,
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase'
};

const statBoxLeft = {
  ...statBox,
  paddingLeft: '5px',
  textAlign: 'left',
  letterSpacing: '1px',
};

const statBoxRight = {
  ...statBoxLeft,
  paddingLeft: 'unset',
  paddingRight: '5px',
  textAlign: 'right',
  justifyContent: 'flex-end'
};



const Match = ({
  firstSelectedPlayer,
  secondSelectedPlayer,
  clearMatchInformation,
  getMatchInformation,
  playerOne,
  playerTwo,
  playerOneMatchInformation,
  playerTwoMatchInformation,
  matchStatistics,
  setSelectedPage,
  setFirstSelectedPlayer,
  setSecondSelectedPlayer,
  getAllPlayers,
  reportMatch,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [playerOneScore, setPlayerOneScore] = useState(false);
  const [playerTwoScore, setPlayerTwoScore] = useState(false);

  useEffect(() => {
    clearMatchInformation().then(() => getMatchInformation(firstSelectedPlayer, secondSelectedPlayer));
  }, [firstSelectedPlayer, secondSelectedPlayer, clearMatchInformation, getMatchInformation]);

  const foundPlayerOne = players.find(playerFinder => {
    return playerFinder.name.toUpperCase() === playerOne.name.toUpperCase();
  });
  const imgSrcPlayerOne = _.get(foundPlayerOne, 'src') || getPlayerImage(playerOne.name);

  const foundPlayerTwo = players.find(playerFinder => {
    return playerFinder.name.toUpperCase() === playerTwo.name.toUpperCase();
  });
  const imgSrcPlayerTwo = _.get(foundPlayerTwo, 'src') || getPlayerImage(playerTwo.name);

  if (!playerOne) return null;
  if (!playerTwo) return null;
  if (!matchStatistics) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    reportMatch({
      [playerOne.id]: Number(playerOneScore),
      [playerTwo.id]: Number(playerTwoScore)
    }).then(() => {
      getAllPlayers();
      getMatchInformation(playerOne.id, playerTwo.id);
      setModalOpen(false);
    });
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <img src="./images/MatchOfTheCentury_03.gif" style={{ marginTop: '45px', width: '330px', height: 'auto' }} />
      <div style={{
        backgroundImage: `url("./images/MatchOfTheCentury_05.gif")`,
        backgroundSize: '330px auto',
        backgroundRepeat: 'repeat-y',
        height: 'auto',
        width: '330px',
        display: 'flex',
        paddingTop: '10px',
        paddingBottom: '10px',
        justifyContent: 'center', // Changed from space-around to center
        alignItems: 'center',
        height: '10px',
      }}>
        <a href="#" style={{ fontSize: '15px', color: '#ddd', textDecoration: 'none', fontWeight: 'BOLD' }} onClick={() => { setSelectedPage('HOME'); setFirstSelectedPlayer(null); setSecondSelectedPlayer(null); }}> BACK TO HOMEPAGE </a>
      </div>
      <div style={{
        backgroundImage: `url("./images/MatchOfTheCentury_05.gif")`,
        backgroundSize: '330px auto',
        backgroundRepeat: 'repeat-y',
        height: 'auto',
        width: '330px',
        display: 'flex',
        justifyContent: 'center', // Changed from space-around to center
        alignItems: 'center',
        gap: '10px' // Added a specific gap between portraits
      }}>
        <div style={{
          background: portraitBackground,
          padding: '4px',
          display: 'inline-block',
          textAlign: 'center',
          fontSize: '10pt'
        }}>
          <div style={{ fontSize: '20pt', fontWeight: 'bold', marginBottom: '2px' }}>{playerOne.name.toUpperCase() || "Player One"}</div>
          <img
            src={imgSrcPlayerOne}
            alt={playerOne.name || "Player One"}
            style={{ height: '120px', width: 'auto' }}
          />
          <div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{getLeague(playerOne.elo).toUpperCase()}</div>
          <div>ELO {_.round(playerOne.elo)}</div>
        </div>
        <div style={{
          background: portraitBackground,
          padding: '4px',
          display: 'inline-block',
          textAlign: 'center',
          fontSize: '10pt'
        }}>
          <div style={{ fontSize: '20pt', fontWeight: 'bold', marginBottom: '2px' }}>{playerTwo.name.toUpperCase() || "PLAYER TWO"}</div>
          <img
            src={imgSrcPlayerTwo}
            alt={playerTwo.name || "Player Two"}
            style={{ height: '120px', width: 'auto' }}
          />
          <div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{getLeague(playerTwo.elo).toUpperCase()}</div>
          <div>ELO {_.round(playerTwo.elo)}</div>
        </div>
      </div>
      <img src="./images/MatchOfTheCentury_06.gif" style={{ width: '330px', height: 'auto' }} />
      <div style={{
        backgroundImage: `url("./images/MatchOfTheCentury_07.gif")`,
        backgroundSize: '330px auto',
        backgroundRepeat: 'repeat-y',
        height: 'auto',
        width: '330px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          borderWidth: '4px',
          borderStyle: 'solid',
          borderImage: `${portraitBackground.split(' ')[1]} 4 repeat`,
          padding: '4px',
          margin: '4px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(4, auto)',
            gap: '4px',
            width: '100%'
          }}>
            {/* SETS PLAYED */}
            <div style={statBoxLeft}>SETS PLAYED: {playerOne.totalGames}</div>
            <div style={statBoxRight}>SETS PLAYED: {playerTwo.totalGames}</div>

            {/* WIN % */}
            <div style={statBoxLeft}>
              WIN %: {_.round((playerOne.totalWins / playerOne.totalGames) * 100)}%
            </div>
            <div style={statBoxRight}>
              WIN %: {_.round((playerTwo.totalWins / playerTwo.totalGames) * 100)}%
            </div>

            {/* SET WIN PROB */}
            <div style={statBoxLeft}>
              SET WIN PROB {_.round((playerOneMatchInformation || {}).expectedScore * 100)}%
            </div>
            <div style={statBoxRight}>
              SET WIN PROB {_.round((playerTwoMatchInformation || {}).expectedScore * 100)}%
            </div>

            {/* EXPECTED SET SCORE */}
            <div style={statBoxLeft}>
              EXPECTED SCORE {_.round((playerOneMatchInformation || {}).expectedSetScore)}
            </div>
            <div style={statBoxRight}>
              EXPECTED SCORE {_.round((playerTwoMatchInformation || {}).expectedSetScore)}
            </div>

            {/* WIN PROB */}
            <div style={statBoxLeft}>
              Bo11 WIN PROB: {_.round((playerOneMatchInformation || {}).bo11WinProb * 100)}%
            </div>
            <div style={statBoxRight}>
              Bo11 WIN PROB: {_.round((playerTwoMatchInformation || {}).bo11WinProb * 100)}%
            </div>
          </div>
        </div>
      </div>
      <div style={{
        backgroundImage: `url("./images/MatchOfTheCentury_07.gif")`,
        backgroundSize: '330px auto',
        backgroundRepeat: 'repeat-y',
        height: 'auto',
        width: '330px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          borderWidth: '4px',
          borderStyle: 'solid',
          borderImage: `${portraitBackground.split(' ')[1]} 4 repeat`,
          padding: '4px',
          margin: '4px 0px',
          width: '270px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(3, auto)',
            gap: '4px',
            width: '100%'
          }}>
            {/* GAME HISTORY */}
            <div style={{
              gridColumn: '1 / -1',
              ...statBox,
              textAlign: 'center',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16pt'
            }}>GAME HISTORY</div>

            {/* PLAYER 2 SCORE HISTORY */}
            <div style={statBox}>{playerTwo.name}</div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`playerTwo-score-${index}`} style={statBox}>
                {(((matchStatistics || {}).history || []).slice(-1)[index] || {})[playerTwo.id] || '-'}
              </div>
            ))}

            {/* PLAYER 1 SCORE HISTORY */}
            <div style={statBox}>{playerOne.name}</div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`playerOne-score-${index}`} style={statBox}>
                {(((matchStatistics || {}).history || []).slice(-1)[index] || {})[playerOne.id] || '-'}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        backgroundImage: `url("./images/MatchOfTheCentury_07.gif")`,
        backgroundSize: '330px auto',
        backgroundRepeat: 'repeat-y',
        height: 'auto',
        width: '330px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div
          style={{
            background: `${portraitBackground.split(' ')[1]} 4 repeat`,
            textAlign: 'center',
            padding: '10px',
            margin: '5px 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#ddd'
          }}
          onClick={() => setModalOpen(true)}
        >
          REPORT MATCH RESULT
        </div>

        {modalOpen && (
          <div style={{
            position: 'fixed',
            zIndex: 1,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}>
            <div style={{
              backgroundColor: '#fefefe',
              margin: '15% auto',
              padding: '20px',
              border: '1px solid #888',
              width: '80%'
            }}>
              <span
                style={{
                  color: '#aaa',
                  float: 'right',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setModalOpen(false)}
              >
                &times;
              </span>
              <h2>Enter Match Result</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  {playerOne.name} Score:
                  <input
                    type="number"
                    value={playerOneScore}
                    onChange={(e) => setPlayerOneScore(e.target.value)}
                    required
                  />
                </label>
                <br />
                <label>
                  {playerTwo.name} Score:
                  <input
                    type="number"
                    value={playerTwoScore}
                    onChange={(e) => setPlayerTwoScore(e.target.value)}
                    required
                  />
                </label>
                <br />
                <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <img src="./images/MatchOfTheCentury_08.png" style={{ width: '330px', height: 'auto', marginBottom: '45px' }} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    playerOne: _.find(state.playerStore.allPlayers, { id: ownProps.firstSelectedPlayer }),
    playerTwo: _.find(state.playerStore.allPlayers, { id: ownProps.secondSelectedPlayer }),
    playerOneMatchInformation: _.get(state, `api.matchInformation.${ownProps.firstSelectedPlayer}`),
    playerTwoMatchInformation: _.get(state, `api.matchInformation.${ownProps.secondSelectedPlayer}`),
    matchStatistics: _.get(state, 'api.matchInformation.matchStatistics'),
  };
};

export default connect(mapStateToProps, {
  getAllPlayers,
  clearMatchInformation,
  getMatchInformation,
  reportMatch
})(Match);
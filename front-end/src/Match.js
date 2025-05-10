import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { clearMatchInformation, getMatchInformation } from './api';
import { getLeague } from './league';
import { BlackButton } from './black-button';
import _ from 'lodash';

import {
  base64BlackSquare,
  players
} from './player-images.js';

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
}) => {
  useEffect(() => {
    clearMatchInformation().then(() => getMatchInformation(firstSelectedPlayer, secondSelectedPlayer));
  }, [firstSelectedPlayer, secondSelectedPlayer, clearMatchInformation, getMatchInformation]);

  const renderStats = (player, matchInfo, alignRight = false) => (
    <div style={{ textAlign: alignRight ? 'right' : 'left' }}>
      <h2 style={{ fontSize: 'calc(18px + 1vw)', fontWeight: 'bold', margin: 0 }}>
        {player.name.toUpperCase()}
      </h2>
      <div style={{ fontSize: 'calc(12px + 0.5vw)', fontWeight: 'bold' }}>
        {getLeague(player.elo).toUpperCase()}
      </div>
      <div style={{ fontSize: 'calc(12px + 0.5vw)' }}>
        <b>ELO</b> {_.round(player.elo)}
      </div>
      <div style={{ fontSize: 'calc(10px + 0.5vw)' }}>
        <b>SETS PLAYED</b>: {player.totalGames}
      </div>
      <div style={{ fontSize: 'calc(10px + 0.5vw)' }}>
        <b>Win %</b>: {_.round((player.totalWins / player.totalGames) * 100)}%
      </div>
    </div>
  );

  const renderProbRow = (leftVal, label, rightVal) => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '3px solid #222' }}>
        <div style={{ fontSize: 28, fontWeight: 'bold' }}>{leftVal}</div>
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 'bold' }}>{rightVal}</div>
      </div>
    </>
  );
  
  const foundPlayerOne = players.find(playerFinder => {
    return playerFinder.name.toUpperCase() === playerOne.name.toUpperCase();
  });
  const imgSrcPlayerOne = foundPlayerOne.src || base64BlackSquare;

  const foundPlayerTwo = players.find(playerFinder => {
    return playerFinder.name.toUpperCase() === playerTwo.name.toUpperCase();
  });
  const imgSrcPlayerTwo = foundPlayerTwo.src || base64BlackSquare;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, color: '#222' }}>
      <div style={{ textAlign: 'center' }} onClick={() => setSelectedPage('HOME')}>
          <BlackButton text="HOMEPAGE" fontSize="clamp(14px, 3vw, 20px)"  />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div>
          <img src={imgSrcPlayerOne} alt={playerOne.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </div>
        <h1 style={{ textAlign: 'center', fontSize: 'calc(24px + 2vw)', fontWeight: 'bold' }}>
          {playerOne.name.toUpperCase()} VS {playerTwo.name.toUpperCase()}
        </h1>
        <div>
          <img src={imgSrcPlayerTwo} alt={playerTwo.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center', marginBottom: '35px', marginTop: '35px' }}>
        {renderStats(playerOne, playerOneMatchInformation)}
        <div style={{ fontSize: 'calc(24px + 2.5vw)', fontWeight: 'bold' }}>
          {matchStatistics.scores[firstSelectedPlayer]} - {matchStatistics.scores[secondSelectedPlayer]}
        </div>
        {renderStats(playerTwo, playerTwoMatchInformation, true)}
      </div>

      {renderProbRow(
        _.round(playerOneMatchInformation.expectedScore * 100),
        'SET WIN PROB',
        _.round(playerTwoMatchInformation.expectedScore * 100)
      )}

      {renderProbRow(
        _.round(playerOneMatchInformation.expectedSetScore),
        'EXPECTED SET SCORE',
        _.round(playerTwoMatchInformation.expectedSetScore)
      )}

      {renderProbRow(
        _.round(playerOneMatchInformation.bo11WinProb * 100),
        'BO11 WIN PROB',
        _.round(playerTwoMatchInformation.bo11WinProb * 100)
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '0px', border: '3px solid #222' }}>
        <div style={{ gridColumn: '1 / -1', fontSize: 24, fontWeight: 'bold', textAlign: 'center', padding: 5, borderBottom: '3px solid #222' }}>GAME HISTORY</div>
        {[playerOne, playerTwo].map((player, rowIdx) => (
          <React.Fragment key={player.id}>
            <div style={{ fontSize: 18, fontWeight: 'bold', padding: 5, borderBottom: rowIdx === 0 ? '3px solid #222' : 'none' }}>{player.name}</div>
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} style={{ fontSize: 18, textAlign: 'center', padding: 5, borderLeft: idx > 0 ? '3px solid #222' : 'none', borderBottom: rowIdx === 0 ? '3px solid #222' : 'none' }}>
                {matchStatistics.history[idx][player.id] || '-'}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <BlackButton text="REPORT MATCH RESULT" fontSize="clamp(14px, 3vw, 20px)" />
        <BlackButton text="SHOW ELO HISTORY" fontSize="clamp(14px, 3vw, 20px)" />
      </div>
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

export default connect(mapStateToProps, { clearMatchInformation, getMatchInformation })(Match);
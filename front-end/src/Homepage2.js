import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { resetStore } from './store-root';
import {
    getAllPlayers,
    selectPlayer,
    clearSelectedPlayers
} from './shared/player-store.js';
import _ from 'lodash';
import {
  randomImages,
  players
} from './player-images.js';

const calculateFontSize = (name) => {
  if (name.length <= 6) {
    return "6vw";
  } else {
    return "3vw";
  }
};

const getPlayerImage = (playerName) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstLetter = playerName.toUpperCase().charAt(0);
  const index = alphabet.indexOf(firstLetter);
  const imageIndex = index % randomImages.length;
  return randomImages[imageIndex];
};

const PlayerRankingGrid = (props) => {
  const {
    playersSortedByElo,
    firstSelectedPlayer,
    secondSelectedPlayer,
    setFirstSelectedPlayer,
    setSecondSelectedPlayer,
  } = props;

  const handlePlayerSelection = (playerId) => {
    if (playerId === firstSelectedPlayer) {
      setFirstSelectedPlayer(null);
    } else if (playerId === secondSelectedPlayer) {
      setSecondSelectedPlayer(null);
    } else if (firstSelectedPlayer === null) {
      setFirstSelectedPlayer(playerId);
    } else {
      setSecondSelectedPlayer(playerId);
    }
  };

  return (
    <div style={{
      width: "100%",
      margin: "0",
      padding: "0"
    }}>
      <div className="rankings-header" style={{
        display: "grid",
        gridTemplateColumns: "10% 60% 30%", // Adjusted to include ELO column
        borderBottom: "0.8vw solid black",
        padding: "1vw",
        fontWeight: "bolder",
        fontSize: "5vw",
      }}>
        <div>#</div>
        <div style={{ paddingLeft: "8vw" }}>PLAYER</div>
        <div style={{ textAlign: "center" }}>ELO</div>
      </div>

      {playersSortedByElo.map((player, idx) => {
        const foundPlayer = players.find(playerFinder => {
          return playerFinder.name.toUpperCase() === player.name.toUpperCase();
        });
        const imgSrc = (foundPlayer || {}).src || getPlayerImage(player.name);
        return (
          <div
            key={player.id}
            className="player-row"
            style={{
              display: "grid",
              gridTemplateColumns: "10% 14vw auto 30%",
              borderBottom: "0.8vw solid black",
              alignItems: "center",
              backgroundColor: firstSelectedPlayer === player.id || secondSelectedPlayer === player.id ? "black" : "transparent",
              color: firstSelectedPlayer === player.id || secondSelectedPlayer === player.id ? "#ecddc9" : "inherit",
            }}
            onClick={() => handlePlayerSelection(player.id)}
          >
            <div style={{
              padding: "1vw",
              fontSize: "8vw",
            }}>{idx + 1}</div>
            <div style={{
              width: "14vw",
              height: "14vw",
              padding: "0",
              margin: "0",
              position: "relative",
              overflow: "hidden"
            }}>
              <img src={imgSrc} alt={player.name} style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderLeft: "1px solid black",
                borderRight: "3px solid black",
              }} />
            </div>
            <div style={{
              // fontFamily: 'NewspaperFont',
              paddingLeft: "10px",
              fontWeight: "900",
              letterSpacing: "-0.05em",
              fontSize: calculateFontSize(player.name),
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{player.name.toUpperCase()}</div>
            <div style={{
              textAlign: "right",
              fontWeight: "900",
              padding: "1vw",
              fontSize: "6vw",
            }}>
              {_.round(player.elo)}
              <span style={{ marginLeft: "8px" }}>
                {player.direction === "up" ? "▲" : "▼"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  );
};

const PingPongLeague = (props) => {
  const {
    getAllPlayers,
    playersSortedByElo,
    firstSelectedPlayer,
    secondSelectedPlayer,
    setFirstSelectedPlayer,
    setSecondSelectedPlayer,
    setSelectedPage,
  } = props;

  useEffect(() => {
    getAllPlayers()
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <img src="/homepage2-01.svg" alt="Ping Pong League" style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        maxWidth: '100%',
        marginBottom: '2vw',
      }} />

      <div style={{
        borderBottom: '0.8vw solid black',
        width: '100%',
        marginTop: '3vw',
      }} />

      <div style={{
        borderBottom: '0.8vw solid black',
        width: '100%',
        marginTop: '8px',
      }} />

      <img src="/homepage2-02.svg" alt="Ping Pong League" style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        maxWidth: '100%',
        marginTop: '2vw'
      }} />

      <div style={{
        borderBottom: '0.8vw solid black',
        width: '100%',
        marginTop: '5vw',
      }} />

      <PlayerRankingGrid 
        playersSortedByElo={playersSortedByElo}
        firstSelectedPlayer={firstSelectedPlayer}
        secondSelectedPlayer={secondSelectedPlayer}
        setFirstSelectedPlayer={setFirstSelectedPlayer}
        setSecondSelectedPlayer={setSecondSelectedPlayer}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <img src="/homepage2-03.svg" alt="Ping Pong League" style={{
          width: '70%',
          height: 'auto',
          maxWidth: '100%',
          marginTop: '2vw',
          opacity: firstSelectedPlayer === null || secondSelectedPlayer === null ? 0.5 : 1,
          cursor: 'pointer'
        }} onClick={() => {
          if (firstSelectedPlayer !== null && secondSelectedPlayer !== null) {
            props.setSelectedPage('match');
          }
        }} />
      </div>
    </div>
  );
};

function sortByElo(players) {
  return _.chain(players)
    .orderBy("elo")
    .reverse()
    .value();
}

const mapStateToProps = state => {
  return {
    playersSortedByElo: sortByElo((state.playerStore || {}).allPlayers || []),
    page: (state.router || {}).page
  }
}

const mapDispatchToProps = {
  getAllPlayers,
  selectPlayer,
  clearSelectedPlayers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PingPongLeague)
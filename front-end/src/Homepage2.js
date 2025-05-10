import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    getAllPlayers,
    selectPlayer, // This might be related to how setFirst/SecondSelectedPlayer props are derived
    clearSelectedPlayers, // This Redux action clears ALL selected players
    addPlayer,
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

// --- MODAL COMPONENT ---
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  minWidth: '300px',
  maxWidth: 'calc(100% - 40px)', // Max width with some padding from screen edges
  color: '#333', // Ensuring text is visible on white background
  textAlign: 'left', // Align text to the left within the modal
};

const formInputStyle = {
  width: 'calc(100% - 22px)', // Account for padding and border
  padding: '10px',
  margin: '10px 0 20px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
};

const formButtonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  marginRight: '10px',
};

const cancelButtonModalStyle = {
  ...formButtonStyle,
  backgroundColor: '#6c757d',
};

const CreatePlayerModal = ({ isOpen, onClose, addPlayer, getAllPlayers, setIsCreatePlayerModalOpen }) => {
  const [playerNameInput, setPlayerNameInput] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (playerNameInput.trim()) {
      addPlayer({
        name: playerNameInput.trim(),
        elo: 2000
      }).then(() => {
        getAllPlayers();
        setIsCreatePlayerModalOpen();
      });
      setPlayerNameInput(''); // Reset input after submit
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}> {/* Close on overlay click */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking content */}
        <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Create Player</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="player-name-input" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Player Name:
            </label>            
            <input
              type="text"
              id="player-name-input"
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              placeholder="Enter player name to create"
              required
              style={formInputStyle}
            />
          </div>
          <div style={{ textAlign: 'right' }}> {/* Align buttons to the right */}
            <button type="submit" style={formButtonStyle}>
              Create
            </button>
            <button type="button" onClick={onClose} style={cancelButtonModalStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
        gridTemplateColumns: "10% 60% 30%",
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
    setFirstSelectedPlayer, // These props are assumed to be passed by the parent component
    setSecondSelectedPlayer, // to manage selected player state.
    setSelectedPage,
    addPlayer,
    // clearSelectedPlayers // Redux action from mapDispatchToProps
  } = props;

  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);

  useEffect(() => {
    getAllPlayers();
  }, [getAllPlayers]); // Added getAllPlayers to dependency array

  const handleOpenClearPlayerModal = () => setIsCreatePlayerModalOpen(true);
  const handleCloseCreatePlayerModal = () => setIsCreatePlayerModalOpen(false);


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
        <img src="/homepage2-03.svg" alt="VS - Go to Match" style={{
          width: '70%',
          height: 'auto',
          maxWidth: '100%',
          marginTop: '1vw', // Adjusted margin
          opacity: firstSelectedPlayer === null || secondSelectedPlayer === null ? 0.5 : 1,
          cursor: firstSelectedPlayer !== null && secondSelectedPlayer !== null ? 'pointer' : 'default'
        }} onClick={() => {
          if (firstSelectedPlayer !== null && secondSelectedPlayer !== null) {
            if (props.setSelectedPage) props.setSelectedPage('match');
          }
        }} />
      </div>
      
      {/* "Clear Player" Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4vw', marginBottom: '1vw' }}>
        <button
          onClick={handleOpenClearPlayerModal}
          style={{
            padding: '10px 20px',
            fontSize: '4rem', // Responsive font size
            cursor: 'pointer',
            backgroundColor: 'transparent', // A neutral color
            border: '4px solid black',
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          Create Player
        </button>
      </div>

      {/* Modal for Clearing Player */}
      <CreatePlayerModal
        isOpen={isCreatePlayerModalOpen}
        onClose={handleCloseCreatePlayerModal}
        addPlayer={addPlayer}
        getAllPlayers={getAllPlayers}
        setIsCreatePlayerModalOpen={setIsCreatePlayerModalOpen}
      />
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
    page: (state.router || {}).page,
    // firstSelectedPlayer and secondSelectedPlayer are NOT mapped from Redux state here.
    // This implies they are managed by a parent component or local state higher up,
    // and setFirstSelectedPlayer/setSecondSelectedPlayer are passed as props.
  }
}

// The existing mapDispatchToProps already includes clearSelectedPlayers,
// which likely clears *all* selected players.
// The new functionality to clear a *specific* player relies on
// setFirstSelectedPlayer/setSecondSelectedPlayer props.
const mapDispatchToProps = {
  getAllPlayers,
  selectPlayer,
  clearSelectedPlayers,
  addPlayer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PingPongLeague)
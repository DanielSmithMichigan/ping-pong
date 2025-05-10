import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { resetStore } from './store-root';
import {
    getAllPlayers,
    selectPlayer,
    clearSelectedPlayers
} from './shared/player-store.js';
import _ from 'lodash';

function Homepage(props) {

  useEffect(() => {
    props.getAllPlayers()
  }, []);

  return (
    <React.Fragment>
      <div style={{ margin: '30px 20px 0px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
          <img src={'./paddle.png'} style={{ width: '33%', height: 'auto', marginRight: '28px' }} />
        </div>
        <div style={{
          marginTop: '0px',
          fontFamily: 'Helvetica',
          fontSize: '12vw',
          fontWeight: 'bolder',
          lineHeight: '0.9',
          letterSpacing: '-0.03 em'
        }}>
          PING PONG /<br />ELO TRACKER
        </div>
        <div style={{
          marginTop: '12px',
          marginLeft: '15px',
          fontFamily: 'Helvetica',
          fontSize: '4vw',
          fontWeight: 'bold',
          letterSpacing: '-0.03 em'
        }}>
          TRACK THE RANKINGS OF YOUR FRIENDS
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50px',
          fontWeight: 'bolder',
          fontSize: '4vw',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>PLAYER</th>
                <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>RATING</th>
              </tr>
            </thead>
            <tbody>
              {props.playersSortedByElo.map((player, index) => (
                <tr key={index}>
                  <td style={{ borderBottom: '2px solid #000', padding: '10px' }}>{player.name}</td>
                  <td style={{ borderBottom: '2px solid #000', padding: '10px' }}>{_.round(player.elo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5%', marginRight: '5%', paddingBottom: '5%' }}>
          <button style={{
            background: '#23211f url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEUAAAAkIiQkJiQsJiQkIhyKweSUAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAqdJREFUOI0dlNG5xiAIQ10hwAKgC0BdAHX/mW7++9CH1n4QkoPDUHrx7DNkdB4JSNu1AWzREtFwaEJXuC80htztL9eE2NSK4waRG2e4y8MH81UqiDBH9tdnNIvi8y9O+zzPQuVzrTNivsCbz1hgi6zKA5eDgW0qEjsXMDs/SQHUa8Aow7z5pu5sfGx1bBl6UJHh4rbld44+lLCHY7LO01tRWRCOl3KxR+G9kiyTEEdVQiaWYQTFST3YlRXTZKbtxNljmWAvh5VbT0OvtxZ1D+25PKbow5kWN2jCNM6xqigI3e7xwgy44qtldNeS2xEUkKLXljptfUP8pK0sZuAbNunKO6I+2rXXYWWkw7NCisZ/a4jJOU3XvLxperONmdqoaSnnxp1n6zlCCxv+3fGpp0Qce+882qYqCdakV8aYwbFhe/Vj9s+dcnnOltUraNbXM0lJlGB8TEqWy6X10zaV6aa5e9jCcg3l82p53vjs0IlxONl/bvPmZU5HSo3tB97HyHP7upvUzETvIAZjzWL9Iol54uDy4wI94+SlCkaqT37OuxTfSOK9m70gpIFWfHH9hxM4R5PJJEBTZoP/TCc0j1Dj0yNHQSmHPaj+YcKH4hru5E5E5uu3CJPah1EfyVtLfEd0y5r75ETH2MmlYbMCQ8c3n3IpPGp8PzVyvmzhCZ/lvwJzaBitLdm0LPd7S1WbqNISwnrWbKXDCFsSjDdt/HaR1fD1D9O3nEgSXxkEBLrh2MV9FsNrMf4zTPqL6o2jKWQd5JN+0kRvfSd64uUFL4DH3ZU8o7LBAEL0IybED26/62EQN/JjBH3HREHJYRHS4aSA/OJyRbkPytPfGW2fILW/2+SxRS8CwGJBVQzp6etN4rp1Cy+E6p4DF5NYfsyGl8PR5saBwv8ASqakBvAHILAAAAAASUVORK5CYII=)',
            color: '#f6f4f3',
            border: '2px solid black',
            borderRadius: '9px',
            padding: '1% 2%',
            fontSize: '3.5vw',
            textShadow: '1px 1px 2px black',
            cursor: 'pointer',
            outline: 'none'
          }}>
            BEGIN MATCH
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

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
)(Homepage)

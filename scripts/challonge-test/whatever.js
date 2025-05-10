const axios = require('axios');
const crypto = require("crypto");

const uuid = () => crypto.randomBytes(16).toString("hex");

// Create a tournament and add participants
async function createTournamentWithPlayers(players) {
  const apiToken = 'GFyaeZSospvbeXVk0341nLHCdRCPImcfbXDLtwji';
  if (!apiToken) throw new Error('Missing CHALLONGE_API_KEY in environment');
  // 1. Create tournament
  const tournamentRes = await axios.post(
    'https://api.challonge.com/v2/tournaments',
    {
      "data": {
        "type": "Tournaments",
        "attributes": {
          "name": "Rainbow Six: Siege Tournament",
          "url": uuid(),
          "tournament_type": "double elimination",
          "game_name": "Test",
          "private": false,
          // "starts_at": "",
          // "description": "",
          // "notifications": {
          //   "upon_matches_open": true,
          //   "upon_tournament_ends": true
          // },
          // "match_options": {
          //   "consolation_matches_target_rank": 3,
          //   "accept_attachments": false
          // },
          // "registration_options": {
          //   "open_signup": false,
          //   "signup_cap": 0,
          //   "check_in_duration": 0
          // },
          // "seeding_options": {
          //   "hide_seeds": false,
          //   "sequential_pairings": false
          // },
          // "station_options": {
          //   "auto_assign": false,
          //   "only_start_matches_with_assigned_stations": false
          // },
          "group_stage_enabled": true,
          "group_stage_options": {
            "stage_type": "round robin",
            "group_size": 4,
          //   "participant_count_to_advance_per_group": 2,
          //   "rr_iterations": 1,
          //   "ranked_by": "",
          //   "rr_pts_for_match_win": 1,
          //   "rr_pts_for_match_tie": 0.5,
          //   "rr_pts_for_game_win": 0,
          //   "rr_pts_for_game_tie": 0,
          //   "split_participants": false
          },
          // "double_elimination_options": {
          //   "split_participants": false,
          //   "grand_finals_modifier": ""
          // },
          "round_robin_options": {
            "iterations": 1,
            "ranking": "",
            "pts_for_game_win": 1,
            "pts_for_game_tie": 0,
            "pts_for_match_win": 1,
            "pts_for_match_tie": 0.5
          }
        }
      }
    },
    {
      headers: {
        'Authorization-Type': 'v1',
        Authorization: apiToken,
        Accept: 'application/json',
        'Content-Type': "application/vnd.api+json",
      }
    }
  );

  const tournamentId = tournamentRes.data.data.id;

  // // 2. Add participants
  await axios.post(
    `https://api.challonge.com/v2/tournaments/${tournamentId}/participants/bulk_add`,
    {
      data: {
        type: 'Participants',
        attributes: {
          participants: players.map((p, idx) => ({
            name: p.playerName,
            username: p.playerName,
            seed: idx + 1,
            misc: p.playerId
          }))
        }
      }
    },
    {
      headers: {
        'Authorization-Type': 'v1',
        Authorization: apiToken,
        Accept: 'application/json',
        'Content-Type': "application/vnd.api+json",
      }
    }
  );

  return tournamentRes.data.data;
}

// Example usage
(async () => {
  const players = [
    { playerName: 'Alice', playerId: '001' },
    { playerName: 'Bob', playerId: '002' },
    { playerName: 'Charlie', playerId: '003' },
    { playerName: 'David', playerId: '004' },
    { playerName: 'Eva', playerId: '005' },
    { playerName: 'Fiona', playerId: '006' },
    { playerName: 'George', playerId: '007' },
    { playerName: 'Hannah', playerId: '008' },
    { playerName: 'Ian', playerId: '009' },
    { playerName: 'Julia', playerId: '010' },
    { playerName: 'Kevin', playerId: '011' },
    { playerName: 'Luna', playerId: '012' },
    { playerName: 'Mason', playerId: '013' },
    { playerName: 'Nora', playerId: '014' },
    { playerName: 'Oscar', playerId: '015' },
  ];

  try {
    const tournament = await createTournamentWithPlayers(players);
    console.log(`Tournament created: ${tournament.attributes.name} (ID: ${tournament.id})`);
  } catch (err) {
    console.log(
      JSON.stringify(
        err,
        null,
        4
      )
    )
    console.error('Error:', err.response?.data || err.message);
  }
})();
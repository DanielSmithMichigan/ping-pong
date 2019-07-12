const ApiBuilder = require('claudia-api-builder');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
const config = require('./config');
const _ = require("lodash");

const api = new ApiBuilder();
const DynamoDb = new AWS.DynamoDB.DocumentClient();

api.corsHeaders('Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Api-Version');
api.corsOrigin(function (request) {
    return "*";
});

api.post('/players/create', function (request) {
    return doCreatePlayer(request.body)
        .then((playerData) => {
            return recordElo(playerData, 0);
        });
});

function doCreatePlayer(playerData) {
    let playerJson = {
        id: uuid(),
        name: playerData.name,
        elo: Number(playerData.elo),
        totalGames: 0,
        totalWins: 0
    };
    return DynamoDb.put({
        TableName: 'ping-pong-players',
        Item: playerJson
    }).promise()
        .then(() => {
            return playerJson;
        })
        .catch((err) => {
            throw({
                code: "CREATE_PLAYER_FAILURE",
                message: err
            });
        });
}

api.get('/players/getAll', function (request) {
    return DynamoDb.scan({
        TableName: 'ping-pong-players'
    }).promise()
        .then((scanData) => {
            return scanData.Items;
        })
        .catch((err) => {
            throw({
                code: "GET_ALL_PLAYERS_FAILURE",
                message: err
            });
        });
});

api.post('/matches/report', function (request) {
    let playerIds = Object.keys(request.body);
    let playerStatOutput, playerJsons;
    return Promise.all(playerIds.map(getPlayer))
        .then((_playerJsons) => {
            playerJsons = _playerJsons;
            return Promise.all([
                updatePlayerStats(playerJsons[0], request.body, playerJsons[1].elo),
                updatePlayerStats(playerJsons[1], request.body, playerJsons[0].elo)
            ]);
        })
        .then((_playerStatOutput) => {
            playerStatOutput = _playerStatOutput;
            return Promise.all([
                recordElo(playerJsons[0], playerStatOutput[0].ratingAdjustment),
                recordElo(playerJsons[1], playerStatOutput[1].ratingAdjustment),
                reportMatch(request.body),
                updateMatchStatistics(request.body)
            ]);
        })
        .then(() => {
            return {
                [playerStatOutput[0].playerId]: playerStatOutput[0].ratingAdjustment,
                [playerStatOutput[1].playerId]: playerStatOutput[1].ratingAdjustment
            }
        });
});

function recordElo(playerData, ratingAdjustment) {
    let newElo = playerData.elo + ratingAdjustment;
    let timestamp = new Date().toISOString();
    return DynamoDb.put({
        TableName: 'ping-pong-elo-scores',
        Item: {
            playerId: playerData.id,
            timestamp,
            elo: newElo
        }
    }).promise()
        .catch((err) => {
            throw({
                code: "RECORD_ELO_FAILURE",
                message: err
            });
        });
}

api.get('/matches/getInformation/{playerOneId}/{playerTwoId}', function (request) {
    let playerIds = _.toArray(request.pathParams);
    let output = {};
    return Promise.all([
        getPlayer(playerIds[0]),
        getPlayer(playerIds[1]),
        getMatchStatisticsAllowNull.apply(null, playerIds)
    ]).then((promiseValues) => {
        promiseValues[0].expectedScore = calculateExpectedScore(promiseValues[0].elo, promiseValues[1].elo);
        promiseValues[1].expectedScore = calculateExpectedScore(promiseValues[1].elo, promiseValues[0].elo);
        promiseValues[0].expectedSetScore = calculateExpectedSetScore(promiseValues[0].elo, promiseValues[1].elo);
        promiseValues[1].expectedSetScore = calculateExpectedSetScore(promiseValues[1].elo, promiseValues[0].elo);
        output.matchStatistics = promiseValues[2];
        output[promiseValues[0].id] = promiseValues[0];
        output[promiseValues[1].id] = promiseValues[1];
        return output;
    });
});

// Todo:
// Use actual elo calculation
// Update player statistics table entry
// or create player statistics table entry

function updatePlayerStats(playerJson, scores, opponentElo) {
    let additionalWins = scores[playerJson.id];
    let additionalGames = calculateAdditionalGames(scores);
    let ratingAdjustment = calculateRatingAdjustment(playerJson.elo, opponentElo, additionalWins, additionalGames);
    return DynamoDb.update({
        TableName: 'ping-pong-players',
        Key: {
            id: playerJson.id
        },
        UpdateExpression: "add elo :additionalElo, totalGames :additionalGames, totalWins :additionalWins",
        ExpressionAttributeValues: {
            ':additionalElo': ratingAdjustment,
            ':additionalGames': additionalGames,
            ':additionalWins': additionalWins
        }
    }).promise()
    .then(() => {
        return {
            ratingAdjustment,
            playerId: playerJson.id
        };
    })
    .catch((err) => {
        throw({
            code: "UPDATE_STATS_FAILURE",
            message: err
        });
    });
}

function updateMatchStatistics(scores) {
    return getMatchStatisticsAllowNull.apply(null, Object.keys(scores))
        .then((oldMatchStatistics) => {
           return upsertMatchStatistics(oldMatchStatistics, scores);
        });
}

function getMatchStatisticsAllowNull(playerOneId, playerTwoId) {
    return getMatchStatistics(playerOneId, playerTwoId)
        .catch((err) => {
            if (_.get(err, "message.code") === "ITEM_NOT_FOUND") {
                return {};
            }
            throw err;
        })
}
function upsertMatchStatistics(oldStatistics, scores) {
    let matchId = getMatchId.apply(null, Object.keys(scores));
    let totalGames = _.get(oldStatistics, "totalGames", 0) + calculateAdditionalGames(scores);
    let newScores = {};
    for (let i in scores) {
        newScores[i] = scores[i] + _.get(oldStatistics, `scores.${i}`, 0);
    }
    let oldHistory = _.get(oldStatistics, "history", []);
    oldHistory.push(scores);
    return DynamoDb.put({
        TableName: 'ping-pong-statistics',
        Item: {
            matchId,
            scores: newScores,
            history: _.takeRight(oldHistory, config.scoreHistoryLength),
            totalGames
        }
    }).promise()
        .catch((err) => {
            throw({
                code: "UPSERT_MATCH_STATISTICS_FAILURE",
                message: err
            });
        });
}

function getMatchStatistics(playerOneId, playerTwoId) {
    let matchId = getMatchId(playerOneId, playerTwoId);
    return DynamoDb.get({
        Key: {
            matchId
        },
        TableName: 'ping-pong-statistics'
    }).promise()
        .then((response) => {
            if (!response.Item) {
                throw({
                    code: "ITEM_NOT_FOUND"
                });
            }
            return response.Item;
        })
        .catch((err) => {
            throw({
                code: "GET_MATCH_STATISTICS_FAILURE",
                message: err
            });
        });
}

function getMatchId(playerOneId, playerTwoId) {
    let bothIds = [
        playerOneId,
        playerTwoId
    ];
    bothIds.sort();
    return bothIds.join("-");
}

function getPlayer(playerId) {
    return DynamoDb.get({
        Key: {
            id: playerId
        },
        TableName: 'ping-pong-players'
    }).promise()
        .then((response) => {
            if (!response.Item) {
                throw({
                    code: "ITEM_NOT_FOUND"
                });
            }
            return response.Item;
        })
        .catch((err) => {
            throw({
                code: "CREATE_PLAYER_FAILURE",
                message: err
            });
        });
}

function reportMatch(scores) {
    let playerIds = Object.keys(scores);
    let matchId = getMatchId(
        playerIds[0],
        playerIds[1]
    );
    return DynamoDb.put({
        TableName: 'ping-pong-matches',
        Item: {
            matchId,
            id: uuid(),
            scores: scores,
            timestamp: new Date().toISOString()
        }
    }).promise()
    .catch((err) => {
        throw({
            code: "REPORT_MATCH_FAILURE",
            message: err
        });
    });
}

function calculateAdditionalGames(scores) {
    return _.chain(scores)
        .toArray()
        .sum()
        .value();
}

function transformedRating(rating) {
    return Math.pow(10, rating / 400);
}

function calculateExpectedScore(r1, r2) {
    r1 = transformedRating(r1);
    r2 = transformedRating(r2);
    return r1 / (r1 + r2);
}

function calculateExpectedSetScore(r1, r2) {
    let expectedScore = calculateExpectedScore(r1, r2);
    if (expectedScore >= .5) {
        return 11;
    }
    return _.round(11 * expectedScore / (1 - expectedScore));
}

function calculateRatingAdjustment(elo, opponentElo, points, games) {
    let expectedScore = calculateExpectedScore(elo, opponentElo);
    let actualScore = points / games;
    // return _.round(config.kFactor * (actualScore - expectedScore) * games, config.ratingDecimals);
    return _.round(config.kFactor * (actualScore - expectedScore), config.ratingDecimals);
}

module.exports = api;
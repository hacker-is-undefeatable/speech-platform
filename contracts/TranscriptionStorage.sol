// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TranscriptionStorage {
    struct Chunk {
        uint256 startTime; // stored as integer (e.g. multiplied by 100) or strings
        uint256 endTime;
        string speaker;
        string text;
        string audioUrl;
    }

    struct Session {
        string sessionId;
        string userId;
        uint256 timestamp;
        Chunk[] chunks;
    }

    // Mapping from user address -> list of Sessions
    mapping(address => Session[]) public userSessions;

    event SessionSaved(address indexed user, string sessionId, uint256 timestamp);

    function saveSession(string memory _sessionId, string memory _userId, Chunk[] memory _chunks) public {
        Session storage newSession = userSessions[msg.sender].push();
        newSession.sessionId = _sessionId;
        newSession.userId = _userId;
        newSession.timestamp = block.timestamp;

        for (uint i = 0; i < _chunks.length; i++) {
            newSession.chunks.push(_chunks[i]);
        }

        emit SessionSaved(msg.sender, _sessionId, block.timestamp);
    }

    function getUserSessions() public view returns (Session[] memory) {
        return userSessions[msg.sender];
    }
    
    function getSessionCount() public view returns (uint256) {
        return userSessions[msg.sender].length;
    }
}

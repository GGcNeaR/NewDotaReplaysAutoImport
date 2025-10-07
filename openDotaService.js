/**
 * Service for interacting with OpenDota API
 */
class OpenDotaService {
  constructor() {
    this.baseUrl = 'https://api.opendota.com/api';
  }

  async getRecentMatches(accountId) {
    const response = await fetch(`${this.baseUrl}/players/${accountId}/recentMatches`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recent matches: ${response.status}`);
    }
    return response.json();
  }

  async getMatchDetails(matchId) {
    const response = await fetch(`${this.baseUrl}/matches/${matchId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch match ${matchId}: ${response.status}`);
    }
    return response.json();
  }
}

module.exports = { OpenDotaService };

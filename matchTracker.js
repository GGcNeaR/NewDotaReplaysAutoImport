/**
 * Service for tracking and detecting new matches
 */
class MatchTracker {
  constructor(storage, apiService) {
    this.storage = storage;
    this.apiService = apiService;
  }

  async findNewMatches(accountId) {
    const recentMatches = await this.apiService.getRecentMatches(accountId);
    const newMatches = [];

    for (const match of recentMatches) {
      const matchId = match.match_id;
      const isKnown = await this.storage.hasMatch(matchId);

      if (!isKnown) {
        newMatches.push(matchId);
        await this.storage.addMatch(matchId);
      }
    }

    return newMatches;
  }

  async getMatchDetails(matchIds) {
    const matchDetails = [];

    for (const matchId of matchIds) {
      try {
        const details = await this.apiService.getMatchDetails(matchId);
        matchDetails.push(details);
      } catch (error) {
        console.error(`Error fetching match ${matchId}:`, error.message);
      }
    }

    return matchDetails;
  }
}

module.exports = { MatchTracker };

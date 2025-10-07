/**
 * Abstract storage interface for tracking processed matches
 */
class MatchStorage {
  async hasMatch(matchId) {
    throw new Error('hasMatch must be implemented');
  }

  async addMatch(matchId) {
    throw new Error('addMatch must be implemented');
  }

  async getAll() {
    throw new Error('getAll must be implemented');
  }
}

/**
 * In-memory implementation
 */
class InMemoryMatchStorage extends MatchStorage {
  constructor() {
    super();
    this.matches = new Set();
  }

  async hasMatch(matchId) {
    return this.matches.has(matchId);
  }

  async addMatch(matchId) {
    this.matches.add(matchId);
  }

  async getAll() {
    return Array.from(this.matches);
  }
}

module.exports = { MatchStorage, InMemoryMatchStorage };

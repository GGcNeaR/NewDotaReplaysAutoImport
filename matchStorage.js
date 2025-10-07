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

/**
 * File-based implementation
 */
class FileMatchStorage extends MatchStorage {
  constructor(filePath = './saved_matches.txt') {
    super();
    this.filePath = filePath;
    this.matches = new Set();
    this.initialized = false;
  }

  async _init() {
    if (this.initialized) return;

    const fs = require('fs').promises;
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const matchIds = content.split('\n').filter(line => line.trim());
      matchIds.forEach(id => this.matches.add(id));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist yet, will be created on first write
    }
    this.initialized = true;
  }

  async hasMatch(matchId) {
    await this._init();
    return this.matches.has(String(matchId));
  }

  async addMatch(matchId) {
    await this._init();
    const matchIdStr = String(matchId);

    if (!this.matches.has(matchIdStr)) {
      this.matches.add(matchIdStr);
      const fs = require('fs').promises;
      await fs.appendFile(this.filePath, matchIdStr + '\n', 'utf-8');
    }
  }

  async getAll() {
    await this._init();
    return Array.from(this.matches);
  }
}

module.exports = { MatchStorage, InMemoryMatchStorage, FileMatchStorage };

/**
 * Polling service that checks for new matches at regular intervals
 */
class MatchPoller {
  constructor(matchTracker, accountId, intervalMs = 30000) {
    this.matchTracker = matchTracker;
    this.accountId = accountId;
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.onNewMatches = null;
  }

  async poll() {
    try {
      const newMatchIds = await this.matchTracker.findNewMatches(this.accountId);

      if (newMatchIds.length > 0) {
        console.log(`Found ${newMatchIds.length} new match(es):`, newMatchIds);
        const matchDetails = await this.matchTracker.getMatchDetails(newMatchIds);

        if (this.onNewMatches) {
          this.onNewMatches(matchDetails);
        }
      }
    } catch (error) {
      console.error('Error during polling:', error.message);
    }
  }

  start(callback) {
    if (this.intervalId) {
      console.warn('Poller is already running');
      return;
    }

    this.onNewMatches = callback;
    console.log(`Starting poller for account ${this.accountId} (interval: ${this.intervalMs}ms)`);

    // Poll immediately, then at intervals
    this.poll();
    this.intervalId = setInterval(() => this.poll(), this.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Poller stopped');
    }
  }
}

module.exports = { MatchPoller };

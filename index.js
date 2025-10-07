const { InMemoryMatchStorage } = require('./matchStorage');
const { OpenDotaService } = require('./openDotaService');
const { MatchTracker } = require('./matchTracker');
const { MatchPoller } = require('./matchPoller');

// Example usage
const accountId = '270293472'; // Replace with actual account ID

// Initialize services
const storage = new InMemoryMatchStorage();
const apiService = new OpenDotaService();
const matchTracker = new MatchTracker(storage, apiService);
const poller = new MatchPoller(matchTracker, accountId, 30000);

// Start polling with callback for new matches
poller.start((newMatches) => {
  console.log('New matches received:', newMatches.length);
  newMatches.forEach((match) => {
    console.log(`Match ${match.match_id}: ${match.radiant_win ? 'Radiant' : 'Dire'} victory`);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  poller.stop();
  process.exit(0);
});

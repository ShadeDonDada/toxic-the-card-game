
import { Platform } from 'react-native';

// AdMob Ad Unit IDs - Replace with your actual Ad Unit IDs
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID - Replace with your actual iOS Ad Unit ID
  android: 'ca-app-pub-3940256099942544/1033173712', // Test ID - Replace with your actual Android Ad Unit ID
}) || '';

class AdManager {
  private isInitialized = false;
  private isAdLoaded = false;
  private isPremium = false;
  private roundsCompleted = 0;

  async initialize() {
    if (this.isInitialized) {
      console.log('AdManager: Already initialized');
      return;
    }

    try {
      console.log('AdManager: Initializing (ads temporarily disabled)');
      
      // Note: expo-ads-admob is deprecated and causing issues
      // For now, we'll disable ads until a proper solution is implemented
      // TODO: Migrate to react-native-google-mobile-ads or expo-ads-google
      
      this.isInitialized = true;
      console.log('AdManager: Initialization complete (ads disabled)');
    } catch (error) {
      console.error('AdManager: Error initializing:', error);
    }
  }

  async loadAd() {
    if (this.isPremium) {
      console.log('AdManager: User is premium, not loading ad');
      return;
    }

    if (this.isAdLoaded) {
      console.log('AdManager: Ad already loaded');
      return;
    }

    try {
      console.log('AdManager: Loading interstitial ad (disabled)');
      // TODO: Implement ad loading when migration is complete
    } catch (error) {
      console.error('AdManager: Error loading ad:', error);
    }
  }

  async showAdAtRoundEnd() {
    // Increment rounds completed
    this.roundsCompleted++;
    console.log('AdManager: Round completed. Total rounds:', this.roundsCompleted);

    // Don't show ads if premium
    if (this.isPremium) {
      console.log('AdManager: User is premium, skipping ad');
      return;
    }

    // Don't show ad on first round
    if (this.roundsCompleted === 1) {
      console.log('AdManager: First round completed, not showing ad yet');
      return;
    }

    console.log('AdManager: Would show ad here (ads temporarily disabled)');
    // TODO: Show ad when migration is complete
  }

  setPremiumStatus(premium: boolean) {
    console.log('AdManager: Setting premium status to:', premium);
    this.isPremium = premium;
    if (premium) {
      // Clear any loaded ads
      this.isAdLoaded = false;
    }
  }

  resetRoundCounter() {
    console.log('AdManager: Resetting round counter');
    this.roundsCompleted = 0;
  }
}

export const adManager = new AdManager();

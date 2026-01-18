
import { Platform } from 'react-native';

// AdMob Ad Unit IDs - Replace with your actual Ad Unit IDs
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID - Replace with your actual iOS Ad Unit ID
  android: 'ca-app-pub-9650063361649225~8605617788', // Test ID - Replace with your actual Android Ad Unit ID
}) || '';

class AdManager {
  private isInitialized = false;
  private isAdLoaded = false;
  private isPremium = false;
  private roundsCompleted = 0;
  private AdMobInterstitial: any = null;

  async initialize() {
    if (this.isInitialized) {
      console.log('AdManager: Already initialized');
      return;
    }

    try {
      console.log('AdManager: Initializing with Ad Unit ID:', INTERSTITIAL_AD_UNIT_ID);
      
      // Dynamically import expo-ads-admob to avoid early native module access
      const AdMobModule = await import('expo-ads-admob');
      this.AdMobInterstitial = AdMobModule.AdMobInterstitial;
      
      // Set test device for development (optional)
      // await AdMobModule.setTestDeviceIDAsync('EMULATOR');
      
      // Set up ad event listeners
      this.AdMobInterstitial.addEventListener('interstitialDidLoad', () => {
        console.log('AdManager: Interstitial ad loaded successfully');
        this.isAdLoaded = true;
      });

      this.AdMobInterstitial.addEventListener('interstitialDidFailToLoad', (error: any) => {
        console.error('AdManager: Interstitial ad failed to load:', error);
        this.isAdLoaded = false;
      });

      this.AdMobInterstitial.addEventListener('interstitialDidOpen', () => {
        console.log('AdManager: Interstitial ad opened');
      });

      this.AdMobInterstitial.addEventListener('interstitialDidClose', () => {
        console.log('AdManager: Interstitial ad closed, preloading next ad');
        this.isAdLoaded = false;
        // Preload next ad
        if (!this.isPremium) {
          this.loadAd();
        }
      });

      this.AdMobInterstitial.addEventListener('interstitialWillLeaveApplication', () => {
        console.log('AdManager: User clicked ad and left application');
      });

      this.isInitialized = true;
      console.log('AdManager: Initialization complete');
      
      // Preload first ad if not premium
      if (!this.isPremium) {
        console.log('AdManager: Preloading first ad');
        this.loadAd();
      }
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

    if (!this.AdMobInterstitial) {
      console.log('AdManager: AdMob not initialized yet');
      return;
    }

    try {
      console.log('AdManager: Loading interstitial ad');
      await this.AdMobInterstitial.setAdUnitID(INTERSTITIAL_AD_UNIT_ID);
      await this.AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      console.log('AdManager: Ad request sent');
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
      // Preload ad for next round
      this.loadAd();
      return;
    }

    // Show ad if loaded
    if (this.isAdLoaded && this.AdMobInterstitial) {
      try {
        console.log('AdManager: Showing interstitial ad');
        await this.AdMobInterstitial.showAdAsync();
      } catch (error) {
        console.error('AdManager: Error showing ad:', error);
        // Try to load a new ad
        this.loadAd();
      }
    } else {
      console.log('AdManager: Ad not loaded yet, loading now');
      // Try to load ad for next time
      this.loadAd();
    }
  }

  setPremiumStatus(premium: boolean) {
    console.log('AdManager: Setting premium status to:', premium);
    this.isPremium = premium;
    if (premium) {
      // Clear any loaded ads
      this.isAdLoaded = false;
    } else {
      // Preload ad for free users
      this.loadAd();
    }
  }

  resetRoundCounter() {
    console.log('AdManager: Resetting round counter');
    this.roundsCompleted = 0;
  }
}

export const adManager = new AdManager();

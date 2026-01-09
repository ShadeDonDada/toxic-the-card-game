
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { usePurchase } from '@/contexts/PurchaseContext';
// eslint-disable-next-line import/no-unresolved
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// AdMob Ad Unit IDs
// TODO: Replace with your actual AdMob ad unit IDs before publishing
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: TestIds.INTERSTITIAL, // Test ID - Replace with real ID: 'ca-app-pub-xxxxx/xxxxx'
  android: TestIds.INTERSTITIAL, // Test ID - Replace with real ID: 'ca-app-pub-xxxxx/xxxxx'
}) || TestIds.INTERSTITIAL;

interface AdManagerProps {
  roundNumber: number;
  onRoundEnd?: () => void;
}

export const AdManager = ({ roundNumber, onRoundEnd }: AdManagerProps) => {
  const { isPremium } = usePurchase();
  const lastAdRound = useRef(0);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only set up ads for free users
    if (isPremium) {
      console.log('Premium user - ads disabled');
      return;
    }

    // Create and load the interstitial ad
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    interstitialRef.current = interstitial;

    // Set up event listeners
    const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded successfully');
      isAdLoaded.current = true;
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error);
      isAdLoaded.current = false;
    });

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      isAdLoaded.current = false;
      
      // Preload the next ad
      setTimeout(() => {
        if (interstitialRef.current && !isPremium) {
          interstitialRef.current.load();
        }
      }, 1000);
    });

    // Load the ad
    interstitial.load();

    // Cleanup
    return () => {
      loadedListener();
      errorListener();
      closedListener();
    };
  }, [isPremium]);

  useEffect(() => {
    // Only show ads for free users
    if (isPremium) return;
    
    // Never show ads before first round (roundNumber starts at 1)
    if (roundNumber <= 1) return;
    
    // Show ad at round endings (not during gameplay)
    // Only show if this is a new round and we haven't shown an ad for this round yet
    if (roundNumber > lastAdRound.current && onRoundEnd) {
      showInterstitialAd();
      lastAdRound.current = roundNumber;
    }
  }, [roundNumber, isPremium, onRoundEnd]);

  const showInterstitialAd = async () => {
    try {
      if (!interstitialRef.current) {
        console.log('No interstitial ad instance');
        return;
      }

      if (!isAdLoaded.current) {
        console.log('Ad not loaded yet, skipping...');
        return;
      }

      console.log('Showing interstitial ad at round end');
      await interstitialRef.current.show();
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      isAdLoaded.current = false;
    }
  };

  return null;
};

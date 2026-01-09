
import React, { useEffect } from 'react';
import { usePurchase } from '@/contexts/PurchaseContext';

interface AdInterstitialProps {
  onAdClosed?: () => void;
  roundNumber: number;
}

/**
 * AdInterstitial Component
 * 
 * Shows interstitial ads at round endings for free users only.
 * Never shows ads:
 * - Before the first round (roundNumber === 0)
 * - After premium purchase (isPremium === true)
 * - During gameplay, card selection, menus, or onboarding
 * 
 * TODO: Backend Integration - Configure AdMob in your app.json:
 * {
 *   "expo": {
 *     "plugins": [
 *       [
 *         "expo-ads-admob",
 *         {
 *           "androidAppId": "ca-app-pub-xxxxx~xxxxx",
 *           "iosAppId": "ca-app-pub-xxxxx~xxxxx"
 *         }
 *       ]
 *     ]
 *   }
 * }
 * 
 * Then install: npx expo install expo-ads-admob
 * And implement AdMob interstitial ads here.
 */
export function AdInterstitial({ onAdClosed, roundNumber }: AdInterstitialProps) {
  const { isPremium } = usePurchase();

  useEffect(() => {
    // Never show ads if premium or before first round
    if (isPremium || roundNumber === 0) {
      onAdClosed?.();
      return;
    }

    // TODO: Backend Integration - Implement AdMob interstitial ad loading and display
    // Example implementation:
    // 
    // import { AdMobInterstitial } from 'expo-ads-admob';
    // 
    // const loadAndShowAd = async () => {
    //   try {
    //     await AdMobInterstitial.setAdUnitID('ca-app-pub-xxxxx/xxxxx');
    //     
    //     AdMobInterstitial.addEventListener('interstitialDidLoad', () => {
    //       AdMobInterstitial.showAdAsync();
    //     });
    //
    //     AdMobInterstitial.addEventListener('interstitialDidClose', () => {
    //       onAdClosed?.();
    //     });
    //
    //     AdMobInterstitial.addEventListener('interstitialDidFailToLoad', () => {
    //       onAdClosed?.(); // Continue even if ad fails
    //     });
    //
    //     await AdMobInterstitial.requestAdAsync();
    //   } catch (error) {
    //     console.error('Ad error:', error);
    //     onAdClosed?.(); // Continue game if ad fails
    //   }
    // };
    // 
    // loadAndShowAd();

    // For now, just continue without showing ad
    console.log('Ad would show here for round', roundNumber);
    onAdClosed?.();
  }, [isPremium, roundNumber, onAdClosed]);

  return null; // No UI component - ads are shown natively
}

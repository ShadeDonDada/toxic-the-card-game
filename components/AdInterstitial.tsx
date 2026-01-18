
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface AdInterstitialProps {
  visible: boolean;
  onAdComplete: () => void;
}

export function AdInterstitial({ visible, onAdComplete }: AdInterstitialProps) {
  const theme = useTheme();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!visible) {
      setCountdown(30);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onAdComplete();
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, onAdComplete]);

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Advertisement</Text>
          <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
            Please wait while we show you a message from our sponsors
          </Text>
          <View style={[styles.countdownContainer, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.countdownText, { color: theme.colors.text }]}>
              {countdown}s
            </Text>
          </View>
          <Text style={[styles.info, { color: theme.dark ? '#98989D' : '#666' }]}>
            Upgrade to remove ads and unlock unlimited gameplay
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  spinner: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  countdownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

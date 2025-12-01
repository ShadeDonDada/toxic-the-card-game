
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ThankYouScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol
          ios_icon_name="chevron.left"
          android_material_icon_name="arrow-back"
          size={24}
          color={colors.primary}
        />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Thank You</Text>

      <View style={styles.card}>
        <IconSymbol
          ios_icon_name="heart.fill"
          android_material_icon_name="favorite"
          size={64}
          color={colors.accent}
          style={styles.heartIcon}
        />
        <Text style={styles.bodyText}>
          First and foremost, I would like to thank you for the purchase and support. This game is intended to be a fun way to relies on what is toxic in every and any conversation/ relationship. Enjoy and have fun.
        </Text>
      </View>

      <View style={[styles.card, styles.messageCard]}>
        <IconSymbol
          ios_icon_name="face.smiling"
          android_material_icon_name="sentiment-satisfied"
          size={48}
          color={colors.primary}
          style={styles.smileyIcon}
        />
        <Text style={styles.messageText}>
          Remember to keep it light-hearted and enjoy the laughs with your friends!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
    alignItems: 'center',
  },
  heartIcon: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: colors.darkGreen,
    borderColor: colors.primary,
  },
  smileyIcon: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
});

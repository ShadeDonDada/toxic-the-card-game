
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ThankYouScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
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
        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primary, textShadowColor: colors.accent }]}>Thank You</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <IconSymbol
          ios_icon_name="heart.fill"
          android_material_icon_name="favorite"
          size={64}
          color={colors.accent}
          style={styles.heartIcon}
        />
        <Text style={[styles.bodyText, { color: colors.text }]}>
          First and foremost, I would like to thank you for the purchase and support. This game is intended to be a fun way to realize what is toxic in every and any conversation/ relationship. Enjoy and have fun.
        </Text>
      </View>

      <View style={[styles.card, styles.messageCard, { backgroundColor: colors.warningBackground, borderColor: colors.primary }]}>
        <IconSymbol
          ios_icon_name="face.smiling"
          android_material_icon_name="sentiment-satisfied"
          size={48}
          color={colors.primary}
          style={styles.smileyIcon}
        />
        <Text style={[styles.messageText, { color: colors.warningText }]}>
          Remember to keep it light-hearted and enjoy the laughs with your friends!
        </Text>
      </View>

      <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <IconSymbol
          ios_icon_name="envelope.fill"
          android_material_icon_name="email"
          size={32}
          color={colors.primary}
          style={styles.contactIcon}
        />
        <Text style={[styles.contactLabel, { color: colors.text }]}>Contact:</Text>
        <Text style={[styles.contactEmail, { color: colors.primary }]}>sa.pennant@gmail.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 30,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    borderWidth: 2,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
    alignItems: 'center',
  },
  heartIcon: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  messageCard: {
  },
  smileyIcon: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
  contactCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
    alignItems: 'center',
  },
  contactIcon: {
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 18,
    fontWeight: '700',
  },
});

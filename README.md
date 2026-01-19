
# Toxic – The Card Game

# Overview

**Toxic – The Card Game** is a fast-paced, humorous card game centred around petty comebacks, toxic scenarios, and unapologetic sarcasm. Designed as a **mobile app for iOS and Android**, the game challenges **2–10 players** to outwit, out-snark, and outlast their opponents using cleverly crafted cards and scenarios.

⚠️ **Age Rating:** 18+ (Mature language, themes, and humour)

Whether played casually or competitively, *Toxic* thrives on quick rounds, replay ability, and social interaction.

---

# Gameplay Summary

* Designed for **2–10 players**
* Players take turns drawing and playing cards in response to toxic scenarios.
* Each round presents a situation card and multiple response cards.
* A rotating judge (or automated system) selects the most fitting or entertaining response.
* Points are awarded per round; first player to the winning score takes the game.
* Over 160 scenarios & responses to play

---

# Game Modes

* **Demo Mode (Free)**

  * Limited to 3 rounds
  * 3 cards per player
  * 3 scenarios available
  * Full gameplay experience to try before you buy

* **Full Version ($6.99)**

  * Unlimited rounds
  * All 160+ cards unlocked
  * All scenarios available
  * No restrictions
  * One-time purchase via App Store or Google Play Store

---

# Platforms

* iOS (App Store)
* Android (Google Play Store)

**Format:** Native mobile app with in-app purchases

---

# Monetization

* **Free Demo:** Try the game with limited rounds and cards
* **One-Time Purchase:** $6.99 to unlock full access forever
* **Powered by Superwall:** Seamless native payment processing through App Store and Google Play Store
* **Restore Purchases:** Automatically restore your purchase on new devices

---

# Features

* Short, repayable rounds
* Multiplayer support (2-10 players)
* Clean and intuitive UI
* Native App Store and Play Store payments
* Automatic purchase restoration
* Cross-device purchase sync
* Regular updates and balance tweaks

---

# Installation

### For Players

1. Download from the App Store (iOS) or Google Play Store (Android)
2. Launch the game
3. Play the free demo or purchase full access

### For Developers

This app was built using [Natively.dev](https://natively.dev) and includes:

- **Expo 54** - React Native framework
- **Superwall** - In-app purchase management
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation

#### Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Superwall (see `SUPERWALL_SETUP_GUIDE.md`)
4. Run on iOS: `npx expo run:ios`
5. Run on Android: `npx expo run:android`

#### Required Configuration

Before launching, you must:
1. Create a Superwall account at https://superwall.com/
2. Add your Superwall API key to `contexts/PurchaseContext.tsx`
3. Create in-app purchase products in App Store Connect and Google Play Console
4. Configure your paywall in the Superwall dashboard

See `SUPERWALL_SETUP_GUIDE.md` for detailed setup instructions.

---

# How to Play

1. 18+.
2. Between 2 - 10 players.
3. Shuffle the response cards.
4. You choose the prize & points system, for the loss of each round.
5. Place the scenario cards face down in the middle of all players then turn over the top card.
6. Each player must draw 6 response cards.
7. Objective of the game is to create the most toxic scenario through the cards.
8. Players choose who goes first.
9. Play rotation is counterclockwise.
10. Only during play a player can request to exchange a card with any player once.
11. Each round is completed when every player hand is empty.
12. A player may pass if they cannot make a sensible response.
13. Playing while drinking is highly encouraged.

---

# Technical Stack

- **Framework:** Expo 54 + React Native
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Payments:** Superwall (native App Store & Play Store integration)
- **State Management:** React Context API
- **Storage:** AsyncStorage
- **Styling:** React Native StyleSheet

---

# Documentation

- `SUPERWALL_SETUP_GUIDE.md` - Quick start guide for Superwall integration
- `MONETIZATION_SETUP.md` - Detailed monetization setup instructions
- `LAUNCH_CHECKLIST.md` - Pre-launch checklist for App Store and Play Store submission

---

# License

© 2026 Steven A. Pennant. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, modification, or use without explicit permission is strictly prohibited.

---

# Contact

For support, feedback, or business inquiries:

* Email: sa.pennant@gmail.com

---

# Acknowledgments

Built with 💙 using [Natively.dev](https://natively.dev)

Payments powered by [Superwall](https://superwall.com/)

Made with 💙 for creativity.

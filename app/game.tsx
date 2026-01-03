const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
  const targetPlayer = direction === 'previous' ? getPreviousPlayer() : getNextPlayer();
  const targetPlayerData = gameState.players.find(p => p.id === targetPlayer);
  
  // Check if target player has any cards left
  if (!targetPlayerData || targetPlayerData.hand.length === 0) {
    Alert.alert(
      'Cannot Exchange',
      `${targetPlayerData?.name || 'This player'} has no more cards to exchange with.`,
      [{ text: 'OK' }]
    );
    return;
  }
  
  // Existing exchange logic continues here...
};

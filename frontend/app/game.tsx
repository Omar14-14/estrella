import React, { useCallback } from 'react';
import {
  View, TouchableWithoutFeedback,
  StyleSheet, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useGameLoop } from '../src/hooks/useGameLoop';
import { GameCanvas } from '../src/components/game/GameCanvas';
import { GameHUD } from '../src/components/game/GameHUD';
import { GameOverlay } from '../src/components/game/GameOverlay';
import { useTheme } from '../src/theme/ThemeProvider';

export default function GameScreen() {
  const { gameState, start, jump, restart } = useGameLoop();
  const { status, score, hiScore } = gameState;
  const { theme } = useTheme();

  const handleTap = useCallback(() => {
    if (status === 'running') jump();
  }, [status, jump]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar hidden />

        {/* Renderizado del juego */}
        <GameCanvas state={gameState} />

        {/* HUD — solo durante el juego */}
        {status === 'running' && (
          <GameHUD score={score} hiScore={hiScore} />
        )}

        {/* Overlays: idle y dead */}
        <GameOverlay
          status={status}
          score={score}
          hiScore={hiScore}
          onStart={start}
          onRestart={restart}
          onBack={handleBack}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

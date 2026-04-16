import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors, DarkColors, LightColors, ThemeMode } from '../constants/colors';
import { Layout } from '../constants/layout';

const THEME_KEY = 'estrella_theme_mode';

export interface AppTheme {
  mode: ThemeMode;
  isDark: boolean;
  colors: AppColors;
  radius: typeof Layout.borderRadius;
  spacing: typeof Layout.spacing;
  shadow: {
    soft: ViewStyle;
    glow: ViewStyle;
    floating: ViewStyle;
  };
}

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function normalizeMode(scheme: ColorSchemeName): ThemeMode {
  return scheme === 'dark' ? 'dark' : 'light';
}

function createTheme(mode: ThemeMode): AppTheme {
  const colors = mode === 'dark' ? DarkColors : LightColors;
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,
    colors,
    radius: Layout.borderRadius,
    spacing: Layout.spacing,
    shadow: {
      soft: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: isDark ? 10 : 12 },
        shadowOpacity: isDark ? 0.24 : 0.1,
        shadowRadius: isDark ? 18 : 24,
        elevation: 3,
      },
      glow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.28 : 0.18,
        shadowRadius: 22,
        elevation: 5,
      },
      floating: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: isDark ? 0.32 : 0.14,
        shadowRadius: 32,
        elevation: 8,
      },
    },
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(() => normalizeMode(systemScheme));

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setModeState(saved);
      }
    });
  }, []);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_KEY, nextMode);
  }, []);

  const toggleMode = useCallback(async () => {
    await setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const theme = useMemo(() => createTheme(mode), [mode]);

  const value = useMemo(() => ({ theme, mode, setMode, toggleMode }), [theme, mode, setMode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}


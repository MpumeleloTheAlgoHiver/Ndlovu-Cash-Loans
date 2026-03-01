const loadTheme = async () => {
  try {
    const { ensureThemeLoaded } = await import('./theme-runtime.js');
    return ensureThemeLoaded();
  } catch (error) {
    console.error('Theme init failed:', error);
    return Promise.resolve();
  }
};

loadTheme();

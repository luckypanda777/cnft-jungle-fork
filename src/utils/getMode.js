function getMode() {
  // TODO: make somth about it cuz there are conflict in render dark on client and light on server
  let mode = 'light';

  if (typeof window !== 'undefined') {
    const isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)');
    mode = localStorage.getItem('mode') || (isSystemThemeDark.matches ? 'dark' : 'light');
  }

  if (mode !== 'dark' && mode !== 'light') {
    mode = 'light';
  }
  return mode;
}

export { getMode };

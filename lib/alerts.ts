export async function alertAdmin(message: string, level: 'critical' | 'info' = 'info') {
  console[level === 'critical' ? 'error' : 'log']('[alertAdmin]', message);
}

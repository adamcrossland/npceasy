import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (normalizedId.includes('/src/spells.ts')) {
            return 'data-spells';
          }

          if (normalizedId.includes('/src/classes.ts')) {
            return 'data-classes';
          }

          if (normalizedId.includes('/src/races.ts')) {
            return 'data-races';
          }

          if (normalizedId.includes('/src/feats.ts')) {
            return 'data-feats';
          }

          if (normalizedId.includes('/src/weapons.ts') || normalizedId.includes('/src/armors.ts')) {
            return 'data-equipment';
          }

          return undefined;
        }
      }
    }
  }
});

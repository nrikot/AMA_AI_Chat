// esbuild.config.js
import esbuild from 'esbuild';

const config = {
  entryPoints: ['server/index.ts'],
  platform: 'node',
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  // Explicitly exclude dev/build-only packages
  external: [
    'vite',
    '@vitejs/*',
    'esbuild',
    'tailwindcss',
    'autoprefixer',
    'postcss',
    'drizzle-kit',
  ],
  // Target Node.js runtime version
  target: 'node20',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
} else {
  await esbuild.build(config);
}

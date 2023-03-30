import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [
		glsl({
			include: [
				// Glob pattern, or array of glob patterns to import
				'**/*.glsl',
				'**/*.wgsl',
				'**/*.vert',
				'**/*.frag',
				'**/*.vs',
				'**/*.fs',
			],
			compress: true,
		}),
	],
	// config options
	base: '/retro/',
	build: {
		chunkSizeWarningLimit: 500,
		rollupOptions: {
			output: {
				entryFileNames: `[name].js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[name].[ext]`,
			},
		},
	},
});

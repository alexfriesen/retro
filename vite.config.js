export default {
    // config options
    build: {
        chunkSizeWarningLimit: 520,
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }
        }
    }
}

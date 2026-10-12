const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    use: { baseURL: 'http://127.0.0.1:18080', browserName: 'chromium', screenshot: 'on' },
    webServer: {
        command: 'node node_modules/http-server/bin/http-server dist -p 18080 -c-1',
        url: 'http://127.0.0.1:18080',
        reuseExistingServer: false,
    },
})

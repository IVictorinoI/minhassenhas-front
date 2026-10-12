const { test, expect } = require('@playwright/test')
const user = { name: 'Teste', email: 'user@example.com', token: 'test-token' }
async function authenticate(page) {
    await page.route('**/oapi/login', (route) => route.fulfill({ json: user }))
    await page.goto('/')
    await page.getByPlaceholder('E-mail', { exact: true }).fill(user.email)
    await page.getByPlaceholder('Senha', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
}
test('corrupt stored session does not prevent login', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('_minhassenhas_user', '{invalid'))
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
})
test('expired restored session is removed', async ({ page }) => {
    await page.addInitScript(
        (value) => localStorage.setItem('_minhassenhas_user', JSON.stringify(value)),
        user
    )
    await page.route('**/oapi/validateToken', (route) => route.fulfill({ json: { valid: false } }))
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('_minhassenhas_user'))).toBeNull()
})
test('401 clears session and protected interface', async ({ page }) => {
    await page.route('**/api/passwords/myPasswords?*', (route) =>
        route.fulfill({ status: 401, json: {} })
    )
    await page.route('**/oapi/login', (route) => route.fulfill({ json: user }))
    await page.goto('/')
    await page.getByPlaceholder('E-mail', { exact: true }).fill(user.email)
    await page.getByPlaceholder('Senha', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeEnabled()
    expect(await page.evaluate(() => localStorage.getItem('_minhassenhas_user'))).toBeNull()
    await expect(page.getByRole('navigation')).toHaveCount(0)
})
test('late secret response cannot populate a reopened dialog', async ({ page }) => {
    await page.route('**/api/passwords/myPasswords?*', (route) =>
        route.fulfill({
            json: [{ _id: '1', description: 'Email', login: 'user@example.com', url: '' }],
        })
    )
    let release
    const gate = new Promise((resolve) => {
        release = resolve
    })
    await page.route('**/api/passwords/viewPassword?*', async (route) => {
        await gate
        await route.fulfill({ json: { password: 'old-secret' } }).catch(() => {})
    })
    await authenticate(page)
    await page.getByRole('link', { name: 'Senhas', exact: true }).click()
    await page.getByRole('button', { name: 'Editar', exact: true }).click()
    const request = page.waitForRequest('**/api/passwords/viewPassword?*')
    await page.getByRole('button', { name: 'Ver senha', exact: true }).click()
    await request
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
    await page.getByRole('button', { name: 'Novo', exact: true }).click()
    release()
    await expect(page.getByRole('dialog', { name: 'Nova senha' })).toBeVisible()
    await expect(page.getByText('old-secret', { exact: true })).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('_minhassenhas_user'))).not.toContain(
        'old-secret'
    )
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
})
test('mobile form validates and prevents duplicate writes', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.route('**/api/passwords/myPasswords?*', (route) => route.fulfill({ json: [] }))
    let release
    const gate = new Promise((resolve) => {
        release = resolve
    })
    let writes = 0
    await page.route('**/api/passwords/', async (route) => {
        writes++
        await gate
        await route.fulfill({ json: {} })
    })
    await authenticate(page)
    await page.getByRole('button', { name: 'Abrir menu', exact: true }).click()
    await page.getByRole('link', { name: 'Senhas', exact: true }).click()
    await page.getByRole('button', { name: 'Novo', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Incluir', exact: true }).click()
    await expect(dialog.getByText('Informe a descrição.', { exact: true })).toBeVisible()
    expect(writes).toBe(0)
    await dialog.getByPlaceholder('Informe a descrição').fill('Conta mobile')
    await dialog.getByPlaceholder('Informe a senha').fill('secret')
    await page.screenshot({
        animations: 'disabled',
        path: testInfo.outputPath('mui-dialog-mobile.png'),
    })
    const request = page.waitForRequest('**/api/passwords/')
    await dialog.getByRole('button', { name: 'Incluir', exact: true }).click()
    await request
    await expect(dialog.getByRole('button', { name: 'Aguarde…', exact: true })).toBeDisabled()
    await page.keyboard.press('Enter')
    release()
    await expect(dialog).not.toBeVisible()
    expect(writes).toBe(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

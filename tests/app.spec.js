const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
    page.on('pageerror', (error) => console.error('Browser error:', error.message))
})

test('login, restored session, password CRUD, navigation and logout', async ({
    page,
}, testInfo) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    let records = [
        { _id: '1', description: 'Email', login: 'user@example.com', url: 'https://example.com' },
    ]
    const writes = []
    await page.route(/\/(oapi|api)\//, async (route) => {
        const request = route.request()
        const url = new URL(request.url())
        let body
        if (url.pathname.endsWith('/login')) {
            expect(request.postDataJSON()).toMatchObject({
                email: 'user@example.com',
                password: 'test-password',
            })
            body = { name: 'Teste', email: 'user@example.com', token: 'test-token' }
        } else if (url.pathname.endsWith('/validateToken')) {
            body = { valid: true }
        } else if (url.pathname.endsWith('/myPasswords')) {
            expect(request.headers().authorization).toBe('test-token')
            body = records
        } else if (url.pathname.endsWith('/viewPassword')) {
            body = { password: 'revealed-password' }
        } else if (['POST', 'PUT', 'DELETE'].includes(request.method())) {
            const data = request.postDataJSON()
            const id = url.pathname.split('/').pop()
            expect(data).not.toHaveProperty('_id')
            writes.push({ method: request.method(), data })
            if (request.method() === 'POST') records.push({ ...data, _id: '2' })
            if (request.method() === 'PUT')
                records = records.map((record) =>
                    record._id === id ? { ...record, ...data } : record
                )
            if (request.method() === 'DELETE')
                records = records.filter((record) => record._id !== id)
            body = {}
        } else {
            throw new Error('Unexpected API call: ' + request.method() + ' ' + url)
        }
        await route.fulfill({ json: body })
    })
    await page.goto('/')
    await page.getByPlaceholder('E-mail', { exact: true }).fill('user@example.com')
    await page.getByPlaceholder('Senha', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByRole('heading', { name: /Dashboard/ })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: /Dashboard/ })).toBeVisible()
    await page.screenshot({
        animations: 'disabled',
        path: testInfo.outputPath('dashboard-desktop.png'),
    })
    await page.getByRole('link', { name: 'Senhas', exact: true }).click()
    await expect(page.getByRole('cell', { name: 'Email', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Novo', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Nova senha' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await page.getByRole('button', { name: 'Novo', exact: true }).click()
    const form = page.getByRole('dialog').locator('form')
    await form.getByPlaceholder('Informe a descrição').fill('Nova conta')
    await form.getByPlaceholder('Informe o login/e-mail').fill('new@example.com')
    await form.getByPlaceholder('Informe a URL').fill('https://new.example.com')
    await form.getByPlaceholder('Informe a senha').fill('new-password')
    await form.getByRole('button', { name: 'Incluir', exact: true }).click()
    const row = page.getByRole('row').filter({ hasText: 'Nova conta' })
    await expect(row).toBeVisible()
    await row.getByRole('button', { name: 'Editar', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Editar senha' })).toBeVisible()
    await expect(form.getByPlaceholder('Informe a descrição')).toHaveValue('Nova conta')
    await form.getByPlaceholder('Informe a descrição').fill('Conta renomeada')
    await form.getByRole('button', { name: 'Alterar', exact: true }).click()
    const renamed = page.getByRole('row').filter({ hasText: 'Conta renomeada' })
    await expect(renamed).toBeVisible()
    expect(writes[1].data).not.toHaveProperty('password')
    await renamed.getByRole('button').first().click()
    await page.screenshot({
        animations: 'disabled',
        path: testInfo.outputPath('password-form-desktop.png'),
    })
    await form.getByRole('button', { name: 'Ver senha', exact: true }).click()
    await expect(form.getByText('revealed-password', { exact: true })).toBeVisible()
    await form.getByRole('button', { name: 'Alterar senha', exact: true }).click()
    await form.getByPlaceholder('Informe a senha').fill('changed-password')
    await form.getByPlaceholder('Informe a descrição').fill('Conta alterada')
    await form.getByRole('button', { name: 'Alterar', exact: true }).click()
    const updated = page.getByRole('row').filter({ hasText: 'Conta alterada' })
    await expect(updated).toBeVisible()
    await updated.getByRole('button').last().click()
    await expect(form.getByPlaceholder('Informe a descrição')).toHaveAttribute('readonly', '')
    await form.getByRole('button', { name: 'Excluir', exact: true }).click()
    await expect(page.getByRole('cell', { name: 'Conta alterada', exact: true })).toHaveCount(0)
    expect(writes.map((write) => write.method)).toEqual(['POST', 'PUT', 'PUT', 'DELETE'])
    expect(writes[2].data).toMatchObject({ password: 'changed-password' })
    await page.getByRole('button', { name: 'Sair', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
    expect(errors).toEqual([])
})

test('signup and network errors remain usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.route('**/api/passwords/myPasswords?*', (route) => route.fulfill({ json: [] }))
    await page.route('**/oapi/signup', (route) =>
        route.fulfill({ json: { name: 'Novo', email: 'new@example.com', token: 'test-token' } })
    )
    await page.route('**/oapi/login', (route) => route.abort())
    await page.goto('/')
    await page.getByPlaceholder('E-mail', { exact: true }).fill('new@example.com')
    await page.getByPlaceholder('Senha', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText(/Não foi possível concluir/)).toBeVisible()
    await page.getByText('Novo usuário? Registrar aqui!').click()
    await page.getByPlaceholder('Nome', { exact: true }).fill('Novo')
    await page.getByPlaceholder('E-mail', { exact: true }).fill('new@example.com')
    await page.getByPlaceholder('Senha', { exact: true }).fill('test-password')
    await page.getByPlaceholder('Confirmar Senha', { exact: true }).fill('test-password')
    await page.getByRole('button', { name: 'Registrar', exact: true }).click()
    await expect(page.getByRole('heading', { name: /Dashboard/ })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Senhas', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Senhas', exact: true })).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

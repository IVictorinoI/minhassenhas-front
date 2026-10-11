# Minhas senhas — frontend

Use Node.js 22.22 ou superior da linha 22, ou Node.js 24.11 ou superior (recomendado: Node 24 LTS).

```sh
npm ci
npm run dev
```

Desenvolvimento: `http://localhost:8080`, com API em `http://localhost:3000`.

```sh
npm run build
npm start
```

O build gera os arquivos em `public/` e usa a URL de produção definida em `src/consts.js`. `npm run production` continua disponível como alias do build.

## Versões e migração

As dependências diretas usam versões exatas, sem `latest`, `^` ou `~`. O `package-lock.json` fixa a árvore transitiva; use `npm ci` para instalações reproduzíveis. O `.npmrc` configura `save-exact=true` para novas instalações.

Atualização: 11/10/2026, consultando a tag estável `latest` do registro npm e gravando somente o número exato no manifesto.

- React 19, React Redux 9, Redux 5 e React Router 8, com `createRoot` e roteamento por hash.
- Webpack 5, Babel 8, Mini CSS Extract Plugin e módulos de assets substituem o build legado.
- AdminLTE 4, Bootstrap 5 e Font Awesome 7, com layout e navegação responsiva adaptados.
- React Hook Form substitui Redux Form; React Toastify substitui React Redux Toastr. As versões atuais dos dois pacotes antigos não declaram compatibilidade com React 19.
- Redux Multi e Redux Promise foram substituídos por middlewares locais que preservam as ações existentes. Redux Thunk usa sua exportação atual.
- `react-select`, antes importado sem declaração no manifesto, agora é uma dependência explícita.
- Bibliotecas sem uso (Lodash e Ionicons), plugins antigos do Babel, loaders obsoletos e plugins jQuery do AdminLTE 2 foram removidos. O indicador de carregamento usa Bootstrap no lugar de React Loading.

## Testes de interface

```sh
npx playwright install chromium
npm test
```

Execute o build antes dos testes. Os testes simulam a API para validar login, restauração de sessão, cadastro de usuário, navegação, inclusão/edição/exclusão de senhas, visualização de senha, logout, erro de rede e tela móvel. Não modificam dados reais. A integração com um backend real deve ser validada no ambiente de destino.

Na auditoria de 11/10/2026, o npm apontou 5 alertas de severidade alta na cadeia de desenvolvimento `webpack-dev-server → http-proxy-middleware → micromatch → braces` (incluindo `webpack-cli`). A versão estável atual de `braces` ainda não tem correção. Não foi aplicado o downgrade para Webpack Dev Server 1 sugerido pelo `npm audit fix --force`. Esses pacotes não integram o bundle de produção; `npm audit --omit=dev` verifica as dependências de produção separadamente.

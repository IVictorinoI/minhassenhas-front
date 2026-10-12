# ADR 0001 — React, TypeScript estrito e SPA com Vite

- Data: 2026-10-11
- Status: Aceito

## Contexto

O frontend é uma aplicação pequena e autenticada, com API independente. A base
anterior usava React em JavaScript e configuração manual de Webpack/Babel.
A migração deve reduzir manutenção e preservar os fluxos sem alterar o backend.

## Decisão

Manter React e adotar TypeScript com strict, Vite e módulos ES no código-fonte.
Organizar por funcionalidades: auth, password e dashboard; lib concentra cliente
HTTP e cache. App compõe navegação e rotas; main compõe tema e providers.

Manter HashRouter para hospedagem estática sem regras de reescrita de URL.
Carregar as páginas sob demanda com lazy/Suspense. Gerar assets com hash em dist/.
O build executa a checagem de tipos antes de gerar o bundle.

## Alternativas

- Manter Webpack e adicionar TypeScript: viável, mas conserva configuração local.
- Next.js ou renderização no servidor: adiciona infraestrutura sem requisito atual.
- BrowserRouter: URLs sem hash, com necessidade de fallback para index.html no host.

## Consequências e revisão

A implantação passa a servir dist/, não public/. Variáveis de ambiente usadas no
bundle são definidas no build. TypeScript não valida respostas HTTP em runtime.
Reavaliar roteamento ou renderização no servidor se surgirem páginas públicas com
SEO, requisitos de renderização ou limitações concretas da hospedagem.

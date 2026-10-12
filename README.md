# Minhas senhas - frontend

SPA com React, TypeScript estrito, Vite, Material UI, TanStack Query e React Hook Form.

## Executar

Use Node.js 22.22+ da linha 22 ou 24.11+.

~~~sh
npm ci
npm run dev
~~~

Frontend: http://127.0.0.1:8080. Backend local: http://localhost:3000.
Copie .env.example para .env.local para configurar VITE_API_BASE_URL (URL base sem /api ou /oapi). Variaveis VITE_ sao publicas: nunca coloque segredos nelas. Sem configuracao, o build de producao conserva o backend https://minhassenhas-back.herokuapp.com.

~~~sh
npm run build
npm start
~~~

O build verifica os tipos e gera dist/ com assets com hash e carregamento por rota. O servidor deve servir dist/. O Procfile foi atualizado. O roteamento por hash continua funcionando em hospedagem estatica. dist/ nao e versionado; o deploy deve executar npm run build antes de iniciar o servidor.

## Estrutura

- src/auth: formularios e contexto de sessao.
- src/password: listagem, dialog compartilhado de cadastro/edicao/exclusao e consulta dos metadados.
- src/dashboard: resumo real da quantidade de contas cadastradas.
- src/lib: cliente HTTP tipado e configuracao do cache.
- src/App.tsx: navegacao e rotas com carregamento sob demanda.
- src/main.tsx: tema MUI, providers e entrada.

AdminLTE, Bootstrap, Font Awesome, Redux e Webpack foram removidos. O tema e os componentes de feedback usam MUI. Nao existem mais indicadores ficticios de qualidade das senhas.

## Sessao e dados sensiveis

O contrato do backend permanece inalterado: /oapi/login, /oapi/signup, /oapi/validateToken e /api/passwords, com o token original no header authorization. A sessao continua em localStorage para preservar a restauracao apos recarregar; isso mantem a exposicao do token a JavaScript/XSS. Cookies HttpOnly exigiriam uma alteracao futura no backend.

O cache TanStack Query armazena somente metadados. Senhas reveladas ficam no componente do dialog, sao ocultadas apos 30 segundos e descartadas ao fechar. Copiar usa Clipboard API (HTTPS ou localhost) e nao guarda a senha no cache. Logout e respostas 401 limpam sessao e cache; consultas e leitura de segredos usam AbortSignal. Cancelar uma requisicao nao garante desfazer uma gravacao ja recebida pelo servidor. Ao copiar, o conteudo passa a pertencer ao clipboard do sistema.

## Validacao

~~~sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
~~~

Os testes usam API simulada e validam CRUD, sessao restaurada/expirada/corrompida, logout, 401, falha de rede, validacao de formulario, resposta atrasada, bloqueio de envio duplicado e celular. O build deve ser executado antes dos testes. A integracao com backend real precisa ser validada no ambiente de destino. GitHub Actions executa instalacao reproduzivel, build e testes. Versoes diretas e transitivas sao fixadas em package.json e package-lock.json.

## Decisões arquiteturais

Consulte os [registros de decisões técnicas](docs/decisoes-arquiteturais/README.md) para contexto, alternativas, consequências e critérios de revisão da arquitetura.

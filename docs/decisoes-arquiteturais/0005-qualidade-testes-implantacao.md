# ADR 0005 — Qualidade, testes e implantação estática

- Data: 2026-10-11
- Status: Aceito

## Contexto

A troca completa de interface e ferramentas precisa preservar os fluxos e
produzir um artefato reproduzível, sem depender dos bundles legados versionados.

## Decisão

Fixar versões diretas e manter package-lock.json. Usar npm ci nas instalações
reproduzíveis e Node nas faixas declaradas em engines. Verificar formatação com
Prettier e tipos com tsc --noEmit; npm run build verifica tipos e executa Vite.

Usar Playwright/Chromium contra o build servido localmente, com API simulada.
Cobrir login, cadastro, restauração de sessão, CRUD, alteração/revelação de senha,
logout, celular, erro de rede, sessão corrompida/expirada, resposta 401, resposta
tardia de segredo, validação e bloqueio de gravação duplicada.

GitHub Actions executa npm ci, format:check, build, instalação do Chromium e testes.
Servir dist/ com http-server; atualizar Procfile para esse diretório. Não versionar
dist/, node_modules, relatórios de testes ou arquivos de ambiente locais.

## Alternativas

- Versionar bundles: aumenta diffs e risco de artefato desatualizado.
- Somente testes manuais: não oferece regressão reproduzível dos fluxos centrais.
- Somente testes unitários: não verifica integração de navegação, forms e dialogs.

## Consequências e revisão

O ambiente de implantação deve instalar ferramentas de build e gerar dist/ antes
de iniciar o servidor. npm test pressupõe um build atualizado. Testes simulados
não validam CORS, banco, criptografia ou integração com backend real. A CI está
configurada; seu sucesso remoto depende da execução no repositório hospedado.

Validar integração no ambiente de destino. Adicionar testes de componente ou
unidade quando houver regras isoladas que justifiquem; revisar orçamento de
bundle e desempenho a partir de medições. Auditorias de dependências devem ser
repetidas, pois resultados não são garantias permanentes de segurança.

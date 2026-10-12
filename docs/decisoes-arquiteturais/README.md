# Decisões arquiteturais

Os ADRs registram contexto, decisão, alternativas e consequências. Uma decisão
aceita só deve ser substituída por outro ADR que explique a mudança.

| ADR | Decisão | Status |
| --- | --- | --- |
| [0001](0001-react-typescript-vite-spa.md) | React, TypeScript estrito e SPA com Vite | Aceito |
| [0002](0002-interface-mui-formularios.md) | Material UI e React Hook Form | Aceito |
| [0003](0003-estado-cache-tanstack-query.md) | Separação de estado e cache com TanStack Query | Aceito |
| [0004](0004-sessao-api-dados-sensiveis.md) | Compatibilidade de API, sessão e dados sensíveis | Aceito |
| [0005](0005-qualidade-testes-implantacao.md) | Qualidade, testes e implantação estática | Aceito |

Para adicionar uma decisão, use o próximo número e registre: data, status,
contexto, decisão, alternativas, consequências e critérios de revisão.
As versões exatas estão em package.json e package-lock.json.
Estes registros descrevem o frontend implementado; não certificam a segurança
do backend nem substituem a validação integrada no ambiente de destino.

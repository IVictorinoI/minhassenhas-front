# ADR 0003 — Separação de estado e cache com TanStack Query

- Data: 2026-10-11
- Status: Aceito

## Contexto

Redux armazenava dados da API, seleção do registro, modal e senhas reveladas,
com actions, reducers e middlewares locais. O escopo não exige um store global
para todas essas responsabilidades.

## Decisão

Remover Redux. Usar TanStack Query para consultar e compartilhar somente
metadados dos registros entre dashboard e listagem. A chave inclui o e-mail do
usuário; login e logout limpam o cache. Após gravações bem-sucedidas, invalidar
as consultas de senhas.

Manter sessão em contexto, seleção/modal no componente da página e valores de
formulário no React Hook Form. Consultas usam AbortSignal, staleTime de 30 segundos,
sem retry automático ou refetch ao focar a janela. O cache fica apenas em memória.

Leitura de segredo e gravações usam Axios diretamente no dialog. Seus valores
não são enviados ao cache de queries ou mutations. AbortController e verificação
de montagem impedem respostas tardias de atualizar dialogs descartados.

## Alternativas

- Redux Toolkit + RTK Query: válido, mas mantém um store desnecessário neste escopo.
- Context para todos os dados: exigiria implementar cache e invalidação locais.
- Cache de senhas reveladas: amplia a exposição sem necessidade funcional.

## Consequências e revisão

Há uma biblioteca específica para estado remoto, com política explícita de
atualização. A lista ainda é carregada inteira, conforme contrato existente.
Reavaliar paginação e políticas de atualização com volume e requisitos reais.
Adicionar estado global somente quando houver compartilhamento concreto que
contexto e estado local não atendam de forma simples.

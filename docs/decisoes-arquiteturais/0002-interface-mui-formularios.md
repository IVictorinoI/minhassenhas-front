# ADR 0002 — Material UI e React Hook Form

- Data: 2026-10-11
- Status: Aceito

## Contexto

AdminLTE, Bootstrap, Font Awesome e wrappers locais mantinham convenções visuais
sobrepostas. Cadastro e edição precisam compartilhar um dialog acessível,
com comportamento consistente em desktop e celular.

## Decisão

Usar Material UI com Emotion e ícones MUI para layout, navegação, tabelas,
formulários, dialogs, alertas e notificações. Centralizar tema e CssBaseline em
src/main.tsx. Remover dependências e componentes legados sem uso.

Manter React Hook Form para valores, validação por campo e estado de envio.
Usar uma tabela simples e um único PasswordDialog para criar, editar e excluir.
A exclusão exige confirmação; editar sem alterar a senha não envia password.
Impedir submissões repetidas e fechamento durante a gravação.

O dashboard exibe quantidade real de registros, sem classificação fictícia de
qualidade de senhas. MUI fornece a base dos componentes; acessibilidade e
responsividade continuam exigindo validação da aplicação.

## Alternativas

- Manter Bootstrap/AdminLTE: menor mudança, mas conserva wrappers e ajustes locais.
- Componentes headless e estilos próprios: maior liberdade, com mais manutenção.
- MUI Data Grid: complexidade desnecessária para a listagem atual.

## Consequências e revisão

A interface passa a depender do tema e das APIs MUI. A validação no navegador
melhora a experiência, mas não substitui validação/autorização no servidor.
Reavaliar tabela avançada quando volume, filtros ou paginação justificarem.

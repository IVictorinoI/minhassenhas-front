# ADR 0004 — Compatibilidade de API, sessão e dados sensíveis

- Data: 2026-10-11
- Status: Aceito

## Contexto

A migração foi autorizada apenas no frontend. O backend recebe o token no header
authorization e disponibiliza login, cadastro, validação e operações de senhas.
A restauração de sessão após recarregar deve continuar funcionando.

## Decisão

Centralizar Axios em src/lib/api.ts, com timeout de 15 segundos. Preservar
/oapi/login, /oapi/signup, /oapi/validateToken e /api/passwords, incluindo
myPasswords e viewPassword, sem adicionar prefixo Bearer ao token existente.
Configurar a URL base por VITE_API_BASE_URL; manter os defaults atuais de
localhost em desenvolvimento e backend Heroku no build de produção.

Manter usuário/token em localStorage sob _minhassenhas_user. Tratar conteúdo
inválido sem impedir o login; validar sessão restaurada antes de exibir páginas
protegidas. Falha de rede permite tentar novamente. Logout e respostas 401
removem sessão, header e cache; alteração da chave em outra aba encerra a sessão
local. Falha no acesso ao storage permite sessão apenas em memória.

Senhas reveladas ficam no estado local do dialog, com ocultação após 30 segundos
ou por ação do usuário e descarte ao desmontar. Copiar usa Clipboard API e não
armazena o segredo no cache. Campos de senha são mascarados. A listagem projeta
somente _id, description, login e url antes de entrar no cache.

## Alternativas

- Cookies HttpOnly/Secure/SameSite: exigem decisão conjunta com backend e CSRF.
- Token apenas em memória: interrompe a restauração após recarregar.
- Persistir cache ou segredos: desnecessário para o produto atual.

## Consequências e revisão

localStorage continua acessível por JavaScript e exposto a XSS; compatibilidade
não elimina esse risco. Limpar estado não garante apagar strings da memória do
navegador. Clipboard exige contexto seguro (HTTPS ou localhost), pode falhar e
seu conteúdo fica sob controle do sistema operacional após copiar.

Abortar requisição não desfaz gravação já recebida pelo servidor. As variáveis
VITE_ são públicas e não devem conter segredos. Autorização e criptografia
continuam responsabilidades do backend. Reavaliar autenticação em mudança
coordenada de contrato; revisar limites de dados e validação de respostas quando
os contratos evoluírem.

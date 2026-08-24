STATUS: COMPLETED
VERSÃO: 5 — fecha os achados SEC-01 a SEC-09 e as ambiguidades AMB-01 a AMB-08 da revisão antecipada
do `security-engineer` (`handoff-03-security-engineer-preview.md`).
(v1: Astro + JSON no repo + Netlify. v2: Firestore + Firebase Auth + Cloudinary + painel próprio.
v3: Decap CMS com backend GitHub. v4: + ecrã de gestão de utilizadores. v5: correções de segurança.)

SUMMARY: A v5 **não altera a stack nem o âmbito** — fecha as lacunas do desenho da v4. A correção
estruturante é o **SEC-01**: a v4 assumia, sem enunciar, que manter a allowlist fora do repositório
bastava para separar editor de administrador. Não basta — **quem controla o código que lê o segredo,
controla o segredo**, e um editor tem `push` no repositório de onde a Vercel constrói esse código.
O utilizador decidiu **manter repositório único** (decisão 13) com mitigação por configuração, agora
**vinculativa**: segredos privilegiados apenas no ambiente Production, e proteção de `main` como
**pré-condição do entregável da Fase 6**. As restantes correções substituem adjetivos por regras:
TTL de sessão ≤ 60 min sem renovação deslizante e autorização com **duas** condições por pedido
(SEC-02); regex + `encodeURIComponent` no `username` (SEC-03); **dois cookies com políticas opostas**
porque `SameSite=Strict` não sobrevive ao retorno do GitHub (SEC-04); bundle do Decap auto-hospedado
em versão exata (SEC-05); alias estável e credenciais separadas por ambiente (SEC-06); guardas por
ID numérico no servidor (SEC-07); manuseio de PEM/JWT e proibição de cache em variável de módulo
(SEC-08). Acrescentadas as restrições **27-38** à secção 12.

ARTIFACTS: project/state/task-001-migracao-stack/architecture-proposal.md (v5 — decisão 13 nova em
0.1; 3.3 com a reponderação escrita da opção (b); 7A.1-7A.8 revistas; **9.8 a 9.12 novas**
(SEC-01, SEC-05, SEC-04, SEC-06, SEC-08); 9.6 com o 404 único; plano faseado com o estado dos gates;
secção 12 com 38 restrições). Nenhum ficheiro de projeto criado — sem scaffolding.

VALIDATIONS:
- **SEC-01 — fechado pela decisão 13 do utilizador, com a análise escrita.** A opção (b) (repositório
  de conteúdo separado) foi **reponderada por escrito em 3.3**, como o `security-engineer` exigiu, e
  rejeitada pelo utilizador. Fica registado que é **decisão de risco tomada com a análise à frente,
  não por omissão**. Mitigações agora vinculativas: (1) `GITHUB_APP_PRIVATE_KEY`,
  `GITHUB_APP_INSTALLATION_ID`, `ADMIN_GITHUB_USER_IDS`, `SESSION_SECRET` e `client_secret` **apenas
  em Production**, marcados como sensíveis; Preview usa **OAuth App e GitHub App distintas num
  repositório-sandbox descartável** com allowlist de teste; (2) **proteção de `main` como
  pré-condição do entregável da Fase 6**, não recomendação. **Risco residual declarado sem
  atenuação** (9.8): a defesa passou a ser configuração e não estrutura — basta definir uma variável
  sem escolher ambiente, ou desativar a proteção "só para este merge"; e com poucas pessoas a revisão
  obrigatória de PR pode degenerar em aprovação automática entre as mesmas duas pessoas.
- **SEC-02 — fechado, com o trade-off decidido explicitamente e a AMB-04 resolvida.** Decidido que
  **sim: ter acesso de escrita ao repositório é pré-requisito do papel de administrador.** A
  autorização privilegiada exige **duas condições por pedido** — ID na allowlist **e** permissão de
  escrita atual confirmada em tempo real. Razão: fecha o caso do ex-administrador, em que o poder
  maior sobreviveria ao menor porque o desligamento tem dois passos em dois sistemas e nenhum lembra
  o outro; assim **remover do GitHub basta**. **Trade-off aceite conscientemente:** reabre
  parcialmente o cenário de 7A.7 (um administrador que se remova a si próprio perde o papel), porque
  o caso do ex-administrador é um risco silencioso e o auto-bloqueio é um erro ruidoso, evitável por
  guardas e sempre recuperável pelo proprietário do repositório, que não é colaborador. Em
  consequência, as guardas de 7A.7 passam de "simples" a **vinculativas e verificadas no servidor**.
  Mais: TTL absoluto ≤ 60 min sem renovação deslizante; `SESSION_SECRET` dedicado; algoritmo fixado
  no código e nunca lido do token; comparação em tempo constante; payload mínimo. E escrito de forma
  inequívoca, por ser a leitura errada mais provável: **possuir sessão válida confere zero
  autoridade** — a sessão diz quem é a pessoa, não que ela pode fazer alguma coisa.
- **SEC-03 — fechado.** Regex `^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$` **e**
  `encodeURIComponent`, ambos, no servidor, nos três endpoints. Registada a razão: sem isto, um
  `username` com `../` reescreve o caminho e atinge outro endpoint da API do GitHub — **o vetor de
  7A.5 só está fechado se este parâmetro for estanque**.
- **SEC-04 / AMB-02 — fechado.** **Dois cookies com políticas opostas:** `state` em `SameSite=Lax`
  (tem de sobreviver à navegação de topo cross-site vinda de `github.com`; um cookie `Strict` não é
  enviado nessa navegação, e alguém "arranjaria" a verificação removendo-a), `Path` no callback,
  TTL ≤ 10 min, **uso único apagado antes de validar**, CSPRNG ≥ 128 bits, comparação em tempo
  constante; sessão em `SameSite=Strict`. Registado que **`SameSite` não é, por si, proteção CSRF
  suficiente** e que a validação de `Origin` **falha fechada** se o header faltar.
- **SEC-05 / AMB-07 — fechado.** Bundle do Decap **auto-hospedado, versão exata, lockfile
  commitado**; se CDN, versão exata + SRI (um range com SRI é impossível, o que é o próprio
  argumento para auto-hospedar). CSP permissiva **confinada a `/admin` por header de rota**.
  Requisito antecipado incorporado na **Fase 4**: montar a CSP **estrita por defeito**, para que a
  chegada do Decap não seja resolvida a enfraquecer a política global.
- **SEC-06 / AMB-03 — fechado.** Alias estável por ambiente na allowlist de `redirect_uri`, nunca URL
  efémero, nunca wildcard, **nunca `endsWith('.vercel.app')`** (domínio partilhado). OAuth App e
  GitHub App separadas para não-produção sobre repositório-sandbox; na App de produção registar
  **apenas** o callback exato de produção. Reconhecido no documento que a v4 "mandava fazer a coisa
  certa e criava as condições para a errada".
- **SEC-07 — fechado.** Guardas por **ID numérico**, resolvidas **no servidor**, com resolução
  username → ID **antes** de decidir; confirmação na UI apenas adicional.
- **SEC-08 — fechado.** PEM em **base64** em env var, erro de parsing nunca imprime a chave nem
  parcialmente; JWT `RS256` fixado, TTL ≤ 10 min, `iat` recuado; **proibição explícita de cache em
  variável de módulo**, que em serverless persiste entre invocações quentes e partilha a credencial
  entre pedidos de utilizadores diferentes; `code`, `state`, cookie e PEM proibidos em logs, e
  confirmar que o handler de erro global não serializa o pedido inteiro.
- **SEC-09 — endereçado.** Limite de taxa básico por IP/sessão nas mutações (a rota é alcançável por
  anónimos e cada pedido autorizado gera um token de instalação); notificação aos restantes
  administradores a rever **se a allowlist crescer**.
- **AMB-01 — fechado.** Removido o "404 ou 403": **um único código, 404, para todos os
  não-autorizados**, na página e na API, **gerado pelo mesmo caminho de código** — o "ou" era um
  oráculo, e caminhos distintos introduziriam diferença de temporização, corpo ou headers.
- **AMB-06 — fechado.** Qualquer caminho alternativo ao `/admin/users` (se houver conflito de
  routing) **herda obrigatoriamente** `noindex`, `Disallow`, verificação de sessão e resposta
  indistinguível. Requisito acompanha o caminho, para não se perder no meio de um problema técnico.
- **AMB-08 — fechado.** O ID numérico é obtido por **`GET /user` no servidor, com o token acabado de
  trocar**; nunca de valor vindo do cliente ou da query string.
- **Ordem de operações preservada e explicitada** (7A.3): validar cookie → allowlist (barato, sem
  credencial) → **só então** gerar o token de instalação → confirmar permissão viva → validar
  `username` e guardas → executar. A credencial privilegiada só existe **depois** da primeira decisão
  de autorização.
- **Restrições 27-38 acrescentadas à secção 12** conforme redigidas pelo `security-engineer`
  (acentuação normalizada para consistência do documento; conteúdo inalterado).
- **Inalterado:** stack, i18n, redirects, precedência de design, media no repositório, formulário
  fora de âmbito, risco Hobby aceite, `ux-ui-designer` não necessário.

ISSUES:
1. **RISCO ACEITE — Vercel Hobby proíbe uso comercial.** Exposto ao utilizador, que optou por manter
   e assumir. Não é blocker.
2. **RISCO RESIDUAL DECLARADO — SEC-01 fechado por configuração, não por estrutura** (decisão 13).
   Ver 9.8: configuração desfaz-se por engano ou por pressa, e a revisão obrigatória de PR entre duas
   pessoas pode degenerar em aprovação automática. **O `devops-engineer` deve verificar na Fase 0 e
   antes de cada deploy privilegiado** que as variáveis sensíveis não existem em Preview e que a
   proteção de `main` está ativa.
3. **A conta Vercel é tão sensível como a conta GitHub** — contém o mecanismo de autorização de
   administradores. 2FA obrigatório, lista de acessos curta. Reforçado pelo SEC-01.
4. **`Administration: write` não é inócua**: cobre visibilidade, proteção de branch, transferência e
   eliminação do repositório. É o mínimo que o GitHub oferece para gerir colaboradores — limitação de
   plataforma, contida (Git distribuído; último deploy continua servido), não eliminada.
5. **Auditoria à prova de adulteração não é alcançável a custo zero** neste desenho. Fonte primária é
   o registo do próprio GitHub, por ser externo ao sistema comprometível. Recomendada Organização
   GitHub gratuita (audit log completo + 2FA imposta).
6. **Token do Decap em `localStorage`** — inerente à ferramenta. A mitigação por CSP só é real com o
   bundle auto-hospedado (AMB-07), agora vinculativo.
7. **Privacidade do repositório público:** usernames dos editores e o que cada um alterou ficam
   publicamente associados à empresa. Quem for convidado deve sabê-lo.
8. **Vídeo no repositório** (D-7): armadilha futura. Embeber do YouTube.
9. **Site duplicado publicado hoje** (`publish = "."` serve `AvaliacaoAgroTrades/`) — existe agora,
   resolvido no cutover.
10. Repositório Git ainda não existe. Pré-requisito da Fase 0.

BLOCKERS: Nenhum. **As Fases 5 e 6 estavam BLOCKED no desenho e ficam desbloqueadas por esta v5:**
Fase 5 (SEC-02, SEC-04, SEC-05, SEC-06 fechados) e Fase 6 (SEC-01, SEC-02, SEC-03, SEC-06, SEC-07
fechados). **Desbloqueio de desenho não é aprovação de implementação** — ver abaixo.

REQUIRED_NEXT_ACTION:
1. **Fases 1-4: prontas para o Developer, uma de cada vez.** O `security-engineer` confirmou
   explicitamente que nada na revisão as trava. Um item com efeito antecipado: na **Fase 4**, montar
   a CSP e o HSTS **estritos por defeito**, prevendo header próprio por rota para `/admin` (SEC-05); e
   confirmar `.gitignore` de `.env*` **antes do primeiro commit**.
2. **Fase 0 tem trabalho novo de configuração:** duas OAuth Apps e duas GitHub Apps (produção e
   sandbox), alias estável para preview, variáveis sensíveis **só em Production** e marcadas como
   sensíveis, com **prova** de que não existem em Preview. Decisões humanas: confirmar a pessoa
   inicial e ponderar mover o repositório para uma **Organização GitHub gratuita** (2FA imposta +
   audit log). Confirmar a semântica das permissões da GitHub App **contra a documentação do GitHub**,
   não contra este documento.
3. **Fase 5 — CONFIRMAÇÃO HUMANA OBRIGATÓRIA + revisão do `security-engineer` CONTRA O CÓDIGO**, com
   evidência reproduzível. Desenho aprovado nunca é implementação aprovada.
4. **Fase 6 — CONFIRMAÇÃO HUMANA OBRIGATÓRIA + revisão do `security-engineer` CONTRA O CÓDIGO**, num
   gate **separado** do da Fase 5. Aprovar a Fase 5 não aprova esta. **Pré-condição adicional:
   proteção de `main` ativa antes de convidar o primeiro editor adicional.**
5. **Fase 7 (cutover) — CONFIRMAÇÃO HUMANA OBRIGATÓRIA**, com rollback confirmado pelo
   `devops-engineer` **antes**, não depois.
6. **O Gate 4 (security) NÃO está dado.** O que existe é uma checklist validada para quando as Fases
   5 e 6 chegarem. O `security-engineer` já enunciou o mínimo que exigirá contra o código:
   `redirect_uri` não-allowlisted rejeitado (não normalizado); `postMessage` sem `targetOrigin`
   literal em lado nenhum; `state` reutilizado rejeitado; chamada direta a `/api/admin/collaborators`
   por editor autenticado sem privilégio negada **com a mesma resposta que um anónimo**; `username`
   com `../` rejeitado; mutação sem `Origin` rejeitada; bundle do cliente sem qualquer segredo; e
   prova de que as variáveis sensíveis não existem em Preview.

CONTEXT_FOR_NEXT_AGENT: Ler `architecture-proposal.md` v5, em especial 7A (gestão de utilizadores),
9.8-9.12 (achados fechados) e a secção 12 (**38 restrições vinculativas**). As 12 novas (27-38) são o
resultado direto da revisão de segurança e não são negociáveis.
Para o `code-reviewer`, três pontos que passam despercebidos numa revisão normal: (i) `targetOrigin`
tem de ser **literal**, nunca variável derivada de `location`/`referrer`/query; (ii) qualquer
variável de módulo que guarde credenciais é, em serverless, **cache partilhada entre pedidos**, não
uma variável local; (iii) ramos `403`/`404` distintos para não-autorizados reintroduzem o oráculo de
AMB-01.
Para o `qa-engineer`/`tester`: **estes controlos são quase todos invisíveis num teste funcional** — o
login funciona igualmente bem com `state` reutilizável, com `targetOrigin: '*'` e com sessão de 30
dias. Os testes têm de ser **negativos e adversariais**: alterar o `redirect_uri`, replicar um
`state`, chamar a API como editor sem privilégio, `username` com `../`, pedido sem header `Origin`.
Um "correu tudo bem" não é evidência de nada aqui.
Para o `devops-engineer`: a separação de ambientes **deixou de ser higiene e passou a ser um controlo
de segurança**. Verificar na Fase 0 e antes de cada deploy privilegiado que as variáveis sensíveis
existem **apenas** em Production, que Preview aponta para App e repositório sandbox, e que a proteção
de `main` está ativa **antes** de existir um segundo colaborador. 2FA na conta Vercel e na
Organização GitHub.

HIGH_RISK_AREA: true — inalterado no âmbito, **reduzido no risco residual do desenho**.
As Fases 1-4 não são risco elevado e estão confirmadas como tal pelo `security-engineer`. O risco
elevado concentra-se nas Fases 5 (autenticação) e 6 (autorização privilegiada), cada uma com o seu
gate de confirmação humana e revisão de código.
**O ponto que o utilizador deve reter da v5:** o desenho da v4 tinha os vetores clássicos bem
identificados, mas era contornável por baixo — um editor convidado podia obter a chave da GitHub App
e a lista de administradores **escrevendo código no próprio repositório**, sem passar por nenhum dos
controlos desenhados. Esse caminho fica fechado por configuração (segredos só em Production +
proteção de `main` obrigatória antes do primeiro convite), por escolha explícita do utilizador de
manter repositório único em vez de separar. **A defesa é agora configuração, não estrutura, e isso é
mais frágil** — daí a verificação recorrente atribuída ao `devops-engineer`. Materializa-se apenas
no instante em que existir um segundo colaborador; enquanto houver um único utilizador, não é
explorável.
Os restantes vetores mantêm-se como antes e estão agora com regra concreta: open redirect no
`redirect_uri` (allowlist fixa, rejeitar em vez de normalizar, comparação exata — e **nunca**
correspondência por sufixo em `.vercel.app`, domínio partilhado); fuga do token por `postMessage`
(`targetOrigin` literal); `state` com ciclo de vida completo; injeção de caminho pelo `username`;
sessão sem revogação compensada por TTL ≤ 60 min e verificação de permissão viva; e contenção da
credencial da App, que não tem `Contents: write` mas cobre definições do repositório, sem alternativa
mais fina no GitHub.

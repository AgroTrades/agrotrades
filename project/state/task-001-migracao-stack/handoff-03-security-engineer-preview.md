# Handoff — Security Engineer (revisão de desenho ANTECIPADA)

**Task:** 001-migracao-stack
**Agente:** security-engineer
**Âmbito:** secções **7A (D-8 — gestão de utilizadores)** e **9 (risco/OAuth)** do
`architecture-proposal.md` v4, mais a secção 12 na parte que delas decorre.
**Natureza:** revisão de **desenho**. Não existe código. Nada aqui foi verificado por execução.

---

STATUS: READY — com **gate condicional** nas Fases 5 e 6 (ver BLOCKERS)

Traduzido sem ambiguidade:
- **Fases 1-4 (fundação, conteúdo, rotas/i18n, SEO): READY.** Não tocam em autenticação, autorização,
  credenciais nem no domínio de produção. Nada nesta revisão as trava. O Developer pode avançar.
- **Fases 5 e 6: BLOCKED até o desenho ser corrigido** nos pontos SEC-01 a SEC-04 e o
  `software-architect` publicar uma v5 (ou adenda) que os feche. Não é bloqueio da tarefa — é o gate
  próprio que a arquitetura já previa, agora com conteúdo concreto.
- Esta revisão **não substitui** a revisão do código. Quando as Fases 5 e 6 forem implementadas,
  volto a rever contra a checklist abaixo, com evidência reproduzível. Desenho aprovado nunca é
  implementação aprovada.

---

SUMMARY:
O desenho v4 é, no geral, invulgarmente bom para esta fase. Os vetores clássicos de um proxy OAuth
caseiro (open redirect, `postMessage` com `targetOrigin: '*'`, `state`, scope excessivo, segredo no
ficheiro servido ao browser) estão identificados **com a razão certa**, não por decoração; e a
distinção entre "estar autenticado" e "ter permissão real" está corretamente colocada no servidor,
com a frase que interessa escrita de forma explícita ("esconder o botão não é autorização").

O problema não está no que o desenho diz. Está numa premissa que o desenho **assume sem enunciar**:
que a fronteira entre *editor* e *administrador* se mantém pelo facto de a allowlist viver fora do
repositório. Não se mantém — não por si só. Um editor tem `push` no repositório de onde a Vercel
constrói e executa o código de servidor que **lê** essa variável de ambiente. Quem controla o código
que lê o segredo, controla o segredo. É o **SEC-01**, é `high`, e derruba a decisão que a própria
secção 9.5 identifica como aquela de que "o resto do desenho depende".

Há mais três lacunas de nível relevante (sessão sem revogação e desligada da permissão viva;
validação do `username` nunca especificada, com injeção de caminho na API do GitHub; ciclo de vida
do `state` e `SameSite=Strict` incompatível com o retorno do GitHub), e oito ambiguidades menores.
Nenhuma é difícil de fechar. Todas são muito mais baratas de fechar agora, em prosa, do que depois
de escritas em código.

---

ARTIFACTS:
- `project/state/task-001-migracao-stack/handoff-03-security-engineer-preview.md` (este ficheiro)
- Nenhum ficheiro de código lido, criado ou alterado — não existe código no projeto.

---

VALIDATIONS:

**Como foi feito.** Leitura adversarial das secções 7A e 9 e das 26 restrições da secção 12, com a
pergunta "que sequência concreta de ações, feita por quem, quebra isto?" aplicada a cada controlo.
Modelo de adversário usado, por ordem de probabilidade real neste projeto:

| # | Adversário | Capacidade assumida |
|---|---|---|
| A-1 | **Editor convidado** (interno, com `push`) | Escreve no repositório, abre PRs, tem sessão válida no `/admin`. **O adversário mais importante deste desenho** — é contra ele que existe a separação de papéis. |
| A-2 | Anónimo na Internet | Conhece todos os URLs (repositório público), forja pedidos, aloja um site malicioso. |
| A-3 | Editor/administrador **enganado** (phishing, CSRF) | Sessão legítima, ação não intencional. |
| A-4 | Conta GitHub comprometida | 2FA em falta ou contornada. |
| A-5 | Ex-colaborador | Removido do GitHub, credenciais residuais. |

**Não validado** (fora do alcance de uma revisão de desenho): que a implementação faça o que o
documento diz; comportamento efetivo do Decap CMS; semântica exata das permissões da GitHub App na
data da implementação — confirmar contra a documentação do GitHub na Fase 0, não contra este texto.

---

### (a) Vetores JÁ BEM ENDEREÇADOS — não repetir trabalho

Confirmo como corretos e suficientes **ao nível do desenho**. Passam a ser itens de verificação de
código, não de discussão de arquitetura.

| Ref | Vetor | Porque é que a mitigação está certa |
|---|---|---|
| 9.2 | **Open redirect no `redirect_uri`** | Allowlist fixa no servidor, **rejeitar em vez de corrigir/normalizar**, comparação **exata** de origem, com a armadilha do `startsWith` nomeada (`agrotrades.co.mz.atacante.com`). É a formulação certa: a maioria dos open redirects reais nasce de tentar "sanitizar" em vez de recusar. A caracterização do impacto (ataque contra as pessoas, com o domínio da empresa como instrumento) também está certa e é o que justifica a severidade. |
| 9.3 | **Fuga do token por `postMessage`** | `targetOrigin` explícito e fixo **e** validação de `event.origin` no recetor. Ter os dois lados é o que torna a mitigação completa; muitos desenhos só fazem um. |
| 9.4 | `client_secret` | Só em env de servidor; proibição explícita de `NEXT_PUBLIC_` e de `public/admin/config.yml`; `.gitignore` de `.env*` **antes do primeiro commit**; e o ponto que quase sempre falta — **segredo commitado tem de ser rotacionado, não basta apagar**, ainda mais num repositório público. |
| 9.4 | `state` no fluxo OAuth | Presente e obrigatório. *Mas o ciclo de vida não está especificado — ver SEC-04.* |
| 9.4 | Scope mínimo | `public_repo` em vez de `repo`, com a justificação certa (não expor os repositórios privados alheios de cada editor). A ligação entre "repositório público" e "scope menor" é um raciocínio de segurança genuíno, não uma racionalização a posteriori. |
| 9.4 | Callback como oráculo | Erro genérico, sem distinguir `state`/código/permissão. Correto. |
| 7A.1 | **Escolha da credencial** | GitHub App > fine-grained PAT > PAT clássico, pelas razões certas: âmbito a um repositório, `Administration: write` **sem** `Contents: write`, tokens de instalação de ~1h gerados no servidor, revogável, não presa a uma pessoa. A ressalva honesta de que `Administration: write` **não é inócua** (visibilidade, proteção de branch, transferência, eliminação) e de que **não existe permissão mais fina no GitHub** está correta, e é a atitude certa: limitação de plataforma assumida e contida, não escondida. |
| 7A.2 / 9.5 | **Autenticado ≠ autorizado** | Verificação de allowlist **server-side, por pedido**, com a ordem das operações escrita (valida cookie → obtém ID → allowlist → **só então** gera o token de instalação). Gerar a credencial privilegiada **depois** da decisão de autorização, e não antes, é um detalhe que muita gente erra. |
| 7A.2 | **Allowlist por ID numérico** | Correto e pela razão exata: usernames são libertados e re-registáveis por terceiros. Uma allowlist por username pode mudar de dono em silêncio. |
| 7A.2 | **Allowlist fora do repositório** | O raciocínio está certo — um ficheiro no repositório seria, ele próprio, o caminho de escalonamento. *A conclusão está certa; o que falha é que a medida, sozinha, não é suficiente — ver SEC-01.* |
| 7A.4 / 9.5 | **`permission: "push"` fixado no servidor** | Nunca vem do cliente. Fecha "convidar um editor" → "criar outro administrador". Não negociável. |
| 7A.4 | Convite exige aceitação | Não há adição silenciosa; estado pendente refletido na UI. Proteção da plataforma corretamente aproveitada em vez de reinventada. |
| 7A.4 | Fonte única de verdade | Lista lida em tempo real do GitHub, sem cópia local. Elimina toda uma classe de bugs de dessincronização de estado de autorização. |
| 7A.5 | **Sem proxy genérico para a API do GitHub** | Duas operações, parâmetros fixos, um único parâmetro variável. "É a diferença entre expor duas ações e expor uma credencial" é precisamente o critério certo. *O parâmetro variável precisa de regra de validação escrita — ver SEC-03.* |
| 7A.5 | Credencial nunca sai do servidor | Tokens de instalação por pedido, nunca guardados, nunca devolvidos ao cliente, nunca em logs. |
| 7A.6 | **Auditoria** | A hierarquia está certa: o registo do GitHub é a fonte primária **porque é externa ao sistema comprometível**. Rejeitar o ficheiro de log no repositório ("registo que o próprio suspeito pode editar") é a análise certa. E declarar que auditoria à prova de adulteração não é alcançável a custo zero é o tipo de honestidade que se quer num documento destes. |
| 7A.7 | **Último administrador** | Estruturalmente resistente pela razão certa: o papel não vive no GitHub, vive na Vercel, e nenhuma ação do ecrã altera a allowlist. Somado ao proprietário não ser colaborador, não existe sequência de cliques que deixe o sistema sem administrador. **Análise correta.** *Tem uma consequência no sentido inverso que o documento não trata — ver SEC-02 e AMB-04.* |
| 9.6 | **Não proteger `/admin` por obscuridade** | Correto, e dito ao Developer de forma direta: `noindex`/`Disallow` são higiene de indexação, não controlo de acesso. Distinção que se perde constantemente. |
| 8.2 / ISSUE-2 | Conta Vercel tão sensível como a GitHub | Já identificado pelo Architect. Confirmo — e o SEC-01 torna-o mais forte ainda. |

---

### (b) Vetores NÃO COBERTOS ou cobertos de forma incompleta

#### SEC-01 — `high` — Um editor pode exfiltrar a allowlist e a chave da GitHub App a partir do próprio repositório

**Achado principal. Invalida, sozinho, a separação de papéis desenhada em 7A.2.**

A secção 9.5 diz, e bem: *"Esta é a decisão que sustenta a separação de papéis — se for violada, o
resto do desenho cai."* Está violada. Não pelo caminho que o documento antecipa (editar um ficheiro
de allowlist no repositório), mas por um caminho equivalente que o documento não considera.

**Premissa não enunciada:** "a allowlist está fora do repositório, logo um editor não lhe chega".
Isto só seria verdade se o editor não controlasse o *código que lê* a variável de ambiente. Mas
controla — é a mesma pessoa com `push` no repositório de onde a Vercel constrói e executa esse código.

**Cadeia de ataque (A-1, editor convidado, nada de exótico):**

1. O editor tem `push` — concedido pelo próprio ecrã da Fase 6, com `permission: "push"`.
2. Cria um branch e acrescenta um route handler trivial, p. ex. `app/api/x/route.ts`, que devolve
   `process.env.ADMIN_GITHUB_USER_IDS` e `process.env.GITHUB_APP_PRIVATE_KEY`.
3. Faz push. A Vercel constrói automaticamente um **deploy preview** desse branch.
4. Se as variáveis sensíveis estiverem definidas para o ambiente *Preview* (o default, quando se
   define uma variável sem escolher ambiente, é aplicá-la a todos), o código dele corre **com elas**.
5. Abre o URL do preview e lê a chave privada da GitHub App e a allowlist.

Obtém a credencial mais poderosa do sistema e a lista de administradores **sem nunca tocar em
`/admin/users`, sem passar por nenhuma verificação de allowlist e sem deixar rasto no GitHub como
ação administrativa**. Todos os controlos de 7A.3, 7A.5 e 9.5 continuam corretos e continuam a ser
aplicados — e são simplesmente contornados por baixo. A chave "nunca sai do servidor", certo; o
problema é que o editor pode escrever o servidor.

**Variante sem preview, mais direta:** se `main` não tiver proteção de branch, o mesmo push vai
direto para produção, com as variáveis de *Production*. A secção 3.3 recomenda proteção de branch,
mas como **recomendação**, não como restrição vinculativa da secção 12. Um controlo de que depende
toda a separação de privilégios não pode ser uma recomendação.

**Porque é `high` e não `medium`:** o pré-requisito é ser editor convidado — exatamente o papel que a
Fase 6 existe para atribuir a mais pessoas, e exatamente o adversário contra o qual a separação de
papéis foi desenhada. Não é um privilégio raro; é o privilégio que a funcionalidade distribui. E o
impacto é total: administração do repositório, incluindo alterar visibilidade, desativar proteção de
branch, transferir ou apagar.

**Interação com a secção 3.3.** A opção (a) (repositório único) foi recomendada com o argumento de
que os editores são "de confiança da empresa". A secção 7A constrói depois um modelo que assume o
contrário — que um editor **não** deve poder tornar-se administrador. As duas coisas não podem ser
ambas verdade. Este achado é o argumento que faltava para reponderar a opção (b): com repositórios
separados, o editor deixa de ter `push` no repositório que contém as credenciais de administração, e
o SEC-01 desaparece por construção em vez de por configuração.

**Correções aceitáveis** (pelo menos uma; as três primeiras são cumulativas e recomendo as três):

1. **Segredos privilegiados apenas no ambiente Production da Vercel.** `GITHUB_APP_PRIVATE_KEY`,
   `GITHUB_APP_INSTALLATION_ID` e `ADMIN_GITHUB_USER_IDS` **nunca** definidos para Preview nem
   Development. Preview usa uma GitHub App distinta, instalada num repositório-sandbox descartável, e
   uma allowlist de teste. Um segredo de teste roubado não vale nada.
2. **Proteção de `main` como restrição vinculativa:** proibir push direto, exigir PR com revisão de
   alguém que não seja o autor, **antes** de convidar o primeiro editor adicional. Enquanto houver um
   único utilizador é irrelevante; passa a ser crítico no instante exato em que a Fase 6 cumpre o seu
   propósito.
3. **Reponderar a opção (b) da secção 3.3** (repositório de conteúdo separado do de código) à luz
   deste achado. É a única correção que elimina o vetor estruturalmente. Se for rejeitada, que seja
   com esta análise à frente e por escrito — é uma decisão de risco legítima, mas tem de ser tomada
   com conhecimento, não por omissão.
4. Isolar as rotas privilegiadas noutro projeto Vercel, com repositório próprio e sem editores,
   consumido pelo site por HTTP. Mais peças; fica registado por completude.

**Âmbito temporal:** enquanto a allowlist tiver uma entrada e o repositório um único utilizador
(decisão 11 / Fase 0), o SEC-01 não é explorável — não existe segundo ator. Materializa-se **no
instante em que o primeiro editor adicional é convidado**, que é o entregável da Fase 6. Daí ser
bloqueio da Fase 6 e não da tarefa.

---

#### SEC-02 — `high` — A sessão não tem revogação nem re-verificação de permissão viva

O cookie assinado (7A.3) transporta o ID GitHub verificado e uma "expiração curta". Não há sessão do
lado do servidor, logo **não há revogação**. Combinado com o facto de a autorização se decidir só
contra a allowlist, saem três problemas:

1. **Janela de zumbi.** Removida uma pessoa (colaborador do GitHub, ou entrada da allowlist), o
   cookie que ela já tem continua criptograficamente válido até expirar. O offboarding não tem efeito
   imediato. "Expiração curta" nunca é quantificada — sem número, alguém escreverá 30 dias.
2. **Allowlist e acesso real desacoplados.** 7A.2 define administrador como "tudo o que o editor faz,
   **mais** convidar e remover". Ambíguo: o pedido privilegiado exige **apenas** presença na
   allowlist, ou também acesso de escrita **atual** ao repositório? Como está escrito, é só a
   allowlist. Consequência prática: um ex-administrador removido do GitHub, cuja entrada na allowlist
   ninguém se lembrou de apagar do painel da Vercel, **continua a poder convidar pessoas** (A-5). Não
   há nada a ligar os dois sistemas, e o desligamento tem dois passos em dois sítios diferentes, sem
   que nenhum lembre o outro.
3. **O cookie é emitido a qualquer pessoa do planeta.** O entregável da Fase 5 é explícito: qualquer
   utilizador GitHub se autentica com sucesso. Logo qualquer pessoa obtém um cookie de sessão válido
   e assinado deste site. Isto é *aceitável* e coerente com o modelo, mas tem de ficar escrito de
   forma inequívoca: **possuir sessão válida confere zero autoridade**. Está implícito no passo 3 de
   7A.3; deve ser explícito, porque é a leitura errada mais provável de quem implementar.

**Correções:**
- Exigir na rota privilegiada, a cada pedido, **as duas condições**: (i) ID na allowlist **e**
  (ii) permissão de escrita **atual**, confirmada em tempo real contra a API do GitHub
  (`GET /repos/{owner}/{repo}/collaborators/{username}/permission`). Fecha o caso do
  ex-administrador e reaproveita uma fonte de verdade que o desenho já usa noutro sítio (7A.4).
  **Trade-off honesto:** isto reintroduz parcialmente o cenário de 7A.7 — passa a existir uma
  sequência que deixa o sistema sem administrador operacional (um administrador remove-se a si
  próprio como colaborador). Não é objeção; é a razão pela qual as guardas de 7A.7 (recusar
  auto-remoção, recusar remover o proprietário) deixam de ser conveniência e passam a ser
  **vinculativas e verificadas no servidor**. A recuperação continua garantida pelo proprietário do
  repositório, que não é colaborador. Vale a pena o Architect decidir esta troca explicitamente.
- **TTL numérico escrito no documento.** Recomendo **60 minutos ou menos**, absolutos, sem renovação
  deslizante, para o cookie usado nas rotas privilegiadas.
- Segredo de assinatura **dedicado** (`SESSION_SECRET`), distinto do `client_secret` e da chave da
  App. HMAC-SHA256 sobre payload compacto, com o algoritmo **fixado no código** e nunca lido do
  próprio token — evita a família `alg:none` / confusão de algoritmo. Validar assinatura e expiração,
  com comparação em tempo constante.
- Payload mínimo: ID numérico e expiração. Sem token GitHub, sem username, sem email.

---

#### SEC-03 — `medium-high` — O `username` é o único parâmetro variável e a sua validação nunca é definida

7A.5 diz "um único parâmetro variável (o username), **validado**". A palavra faz todo o trabalho e o
documento nunca diz como. Este valor é interpolado num caminho de URL da API do GitHub
(`PUT /repos/{owner}/{repo}/collaborators/{username}`), chamado com a credencial mais privilegiada
do sistema. Sem regra escrita, o resultado provável é uma verificação de "não vazio".

**Vetores concretos:**
- **Injeção de caminho.** Um `username` com `../` ou `/` não codificado reescreve o caminho e pode
  atingir **outro endpoint** da API do GitHub com a credencial de administração — transformando as
  "duas operações de parâmetros fixos" no proxy genérico que 7A.5 declara eliminado por desenho. O
  vetor só está eliminado se este parâmetro for estanque.
- Injeção de query (`?`, `#`) a alterar a semântica do pedido.
- Encoding: `%2e%2e%2f`, unicode, duplo encoding.

**Correções:**
- Validação por **allowlist de formato** (nunca blocklist), antes de qualquer uso: regra de username
  do GitHub, `^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$`. Rejeitar tudo o resto com erro
  genérico.
- **Além disso**, codificar sempre com `encodeURIComponent` na construção do caminho. Validação **e**
  codificação, não uma ou outra.
- Aplicar a mesma regra ao endpoint de remoção e ao de cancelamento de convite.
- Validação **no servidor**. Validação no cliente é usabilidade.

---

#### SEC-04 — `medium-high` — Ciclo de vida do `state`, e `SameSite=Strict` incompatível com o retorno do GitHub

Dois problemas que se cruzam, ambos gerados por o proxy ser **serverless e sem estado partilhado**
entre `/api/auth` e `/api/callback` — facto que o desenho nunca aborda.

**(i) O `state` existe mas não tem ciclo de vida.** 9.4 exige "parâmetro `state` aleatório, guardado
antes do redirect e verificado no callback". Não diz **onde** é guardado (não há base de dados nem
KV, e a decisão 8.2 proíbe expressamente o Vercel KV), nem que tem de ser **de uso único**, nem que
**expira**, nem qual a fonte de aleatoriedade. Um `state` guardado em cookie mas nunca invalidado
após uso é reutilizável; gerado com `Math.random()` é previsível; sem TTL fica válido
indefinidamente. Nenhuma destas três falhas é visível num teste funcional — o login funciona na mesma.

**(ii) `SameSite=Strict` e o retorno do GitHub.** O callback é alcançado por uma **navegação de topo
cross-site** vinda de `github.com`. Um cookie `SameSite=Strict` **não é enviado** nessa navegação.
Logo, se o `state` for guardado num cookie `Strict`, não chega ao callback, e a verificação ou falha
sempre — e alguém a vai "arranjar" removendo-a, que é o desfecho mau e realista — ou é silenciosamente
ignorada. O documento aplica `SameSite=Strict` de forma global (7A.3) sem distinguir os dois cookies,
que têm requisitos opostos.

**Correções:**
- **Dois cookies distintos, com políticas distintas.** Cookie de **`state`**: `httpOnly`, `Secure`,
  **`SameSite=Lax`**, `Path` restrito à rota de callback, TTL de 10 minutos ou menos, **apagado no
  callback antes de qualquer outra coisa** (uso único, mesmo quando a validação falha). Cookie de
  **sessão**: `httpOnly`, `Secure`, `SameSite=Strict`, TTL curto (SEC-02). O `Strict` no cookie de
  sessão está correto e deve manter-se — o problema é só no cookie de `state`.
- `state` gerado com CSPRNG (`crypto.randomUUID()` / `crypto.getRandomValues`), 128 bits ou mais.
  Nunca `Math.random()`.
- Comparação do `state` em **tempo constante**.
- Escrever no documento que **`SameSite` não é, por si, proteção CSRF suficiente**, e que a validação
  de `Origin` (7A.3 / restrição 12) tem de **falhar fechada quando o header `Origin` está ausente**.
  Um pedido sem `Origin` é rejeitado, não aceite por omissão. É aqui que a maioria das validações de
  `Origin` reais falha, e o desenho não o diz.

---

#### SEC-05 — `medium` — Origem do bundle do Decap: script de terceiros na página mais privilegiada do site

3.1 descreve `public/admin/index.html` como "página estática que carrega o Decap. **Sem build
próprio**". A forma habitual de o fazer é um `<script src="https://unpkg.com/decap-cms@^3/...">`. Ou
seja: a página que detém o token OAuth do editor em `localStorage` (limitação já assumida em 9.4)
carregaria **código executável de um CDN de terceiros, sem versão fixa e sem verificação de
integridade**. Um comprometimento do CDN, ou a publicação de uma versão maliciosa dentro de um range
`^`, entrega o token GitHub de todos os editores — sem tocar no nosso repositório nem na nossa
infraestrutura.

O desenho menciona "CSP restritiva" e "sem scripts de terceiros no site", mas essa frase está
enquadrada como mitigação de XSS no site **público**; `/admin` é precisamente onde a exceção seria
aberta, e é a única página onde o token existe. Contradição prática entre a intenção e o mecanismo.

**Correções:**
- **Auto-hospedar** o bundle do Decap: dependência npm com versão **exata** (sem `^`, sem `~`),
  servida do próprio domínio, com lockfile commitado.
- Se, por alguma razão, se mantiver o CDN: versão exata **e** `integrity` (SRI) **e**
  `crossorigin="anonymous"`. Um range de versão com SRI é impossível — o que é, por si, o argumento
  para o auto-hospedar.
- CSP específica de `/admin`, sem `script-src` permissivo herdado pelo resto do site. Assumir que o
  Decap exige diretivas mais frouxas (`unsafe-eval` / `unsafe-inline`) e **confinar** essa exceção a
  `/admin` por header por rota, em vez de relaxar a política global montada na Fase 4.
- Restrição derivada para a Fase 4: a CSP e o HSTS são definidos **antes** de o `/admin` existir. Não
  permitir que a chegada do Decap na Fase 5 seja resolvida a enfraquecer a política global.

---

#### SEC-06 — `medium` — Deploy previews privilegiados e publicamente alcançáveis

O plano é explícito: "as Fases 1-6 correm em *deploy preview* da Vercel". As Fases 5 e 6 são
autenticação e autorização privilegiada. No plano Hobby, os URLs de preview são **publicamente
acessíveis** (a proteção de deployments é funcionalidade de planos pagos). Um preview da Fase 6 com
credenciais reais é uma superfície privilegiada exposta à Internet, protegida apenas por o URL não
ser adivinhado — precisamente a "proteção por obscuridade" que a restrição 16 proíbe.

Acresce uma **tensão prática que o desenho não resolve** e que é a fonte mais provável de um open
redirect real neste projeto: a restrição 3 exige `redirect_uri` contra **allowlist fixa e comparação
exata de origem**, enquanto os previews têm URLs **que mudam a cada deploy**. Quem implementar a Fase
5 bate nisto no primeiro dia, e a saída fácil é um wildcard ou um `endsWith('.vercel.app')` — que
reabre 9.2 na forma exata que 9.2 avisa (`.vercel.app` é domínio partilhado; qualquer pessoa aloja lá
um projeto). O desenho manda fazer a coisa certa e cria as condições para a errada.

**Correções:**
- Um **alias/domínio estável** por ambiente (ex.: `staging.agrotrades.co.mz`, ou um alias fixo da
  Vercel) e a allowlist com **essa** origem exata. Nunca o URL efémero, nunca um wildcard, **nunca**
  correspondência por sufixo em `.vercel.app`.
- **OAuth App separada e GitHub App separada para não-produção**, apontadas a um repositório-sandbox.
  A OAuth App do GitHub tem a sua própria allowlist de callback: registar **apenas** o callback exato
  de produção na App de produção. Defesa em profundidade gratuita, fora do nosso código.
- É a mesma medida do ponto 1 do SEC-01, vista do outro lado. Uma configuração resolve os dois.

---

#### SEC-07 — `medium` — Guardas de 7A.7 sem critério de identidade e possivelmente só na UI

As guardas ("recusar auto-remoção", "recusar remover o proprietário") não dizem **por que campo** se
compara. Se compararem por **username**, herdam exatamente a fraqueza que 7A.2 identifica para a
allowlist — usernames mudam de dono. Uma guarda de segurança comparada por um identificador mutável
é uma guarda contornável por renomeação.

Além disso, a redação de 7A.7 ("guardas simples a implementar", "confirmação explícita antes de
remover") soa a comportamento de UI. Confirmação no ecrã é UX; a recusa tem de ser **do servidor**.

**Correções:**
- Todas as guardas comparam **ID numérico** do GitHub, obtido do cookie de sessão (o ator) e da API
  do GitHub (o alvo) — nunca strings vindas do cliente.
- Recusa aplicada **na rota de servidor**. A confirmação no ecrã é adicional, nunca substitutiva.
- Resolver o alvo username -> ID **antes** de decidir, para que renomear não contorne a guarda.

---

#### SEC-08 — `low-medium` — Chave privada da App, JWT e cache de token em ambiente serverless

Não é tratado, e são erros previsíveis:
- **PEM em variável de ambiente:** PEMs multi-linha em env vars corrompem-se com frequência, e a
  reação típica é uma transformação improvisada. Definir **um** formato (base64 do PEM, decodificado
  no servidor) e escrevê-lo. Erro de parsing nunca deve imprimir a chave — nem parcialmente.
- **JWT de autenticação da App:** TTL de 10 minutos ou menos (máximo do GitHub), `iat` recuado alguns
  segundos para tolerar desvio de relógio, algoritmo `RS256` fixado no código.
- **Cache do token de instalação:** 7A.5 diz "gerados por pedido, nunca guardados". Alerta concreto:
  em Next.js, uma variável de módulo **persiste entre invocações quentes** da mesma instância
  serverless. Um "cache simples" bem-intencionado guarda o token em memória partilhada entre pedidos.
  A regra "nunca guardados" tem de abranger explicitamente **estado de módulo**, não só disco e cookies.
- **Logs:** a restrição 2 proíbe tokens em logs. Estender explicitamente ao `code` do OAuth, ao
  `state`, ao conteúdo do cookie e ao PEM. E confirmar que o handler de erro global não serializa o
  objeto de pedido inteiro — o caminho mais comum para um segredo aparecer nos logs.

---

#### SEC-09 — `low` — Sem sinal para os restantes administradores; sem limites de taxa

- Um convite bem-sucedido notifica o proprietário do repositório por email (7A.6, correto), mas não
  há sinal para os **outros** administradores da allowlist. Com uma entrada é irrelevante; com três,
  é a diferença entre detetar um abuso em horas ou nunca. Rever se a allowlist crescer.
- 9.7 descarta limites de taxa e, para o volume de edição, concordo. Mas a rota privilegiada é
  **alcançável por anónimos** e será sondada. Recomendo um limite básico por IP/sessão nas mutações,
  sobretudo porque cada pedido autorizado gera um token de instalação (custo e ruído no rate limit da
  GitHub App). Não é material; fica pela completude, tal como o Architect fez.
- A restrição 14 exige `/admin/users` indistinguível entre anónimo e editor sem privilégio.
  Acrescentar que **as duas respostas devem ser geradas pelo mesmo caminho de código**, para não
  introduzir um oráculo de temporização ou uma diferença subtil de corpo/headers.

---

### (c) Contradições e ambiguidades entre as secções

| # | Onde | Problema |
|---|---|---|
| AMB-01 | 7A.3 passo 3 vs. 9.6 | 7A.3 diz "**404 ou 403**, sem detalhe"; 9.6 exige resposta **indistinguível** entre anónimo e editor sem privilégio. Um "ou" numa regra de segurança é um oráculo à espera de acontecer: se o código devolver 403 a quem tem sessão e 404 a quem não tem, confirma-se a existência da funcionalidade e a validade da sessão. **Fixar um único código para todos os casos** (recomendo **404**, na página e na API, gerado pelo mesmo caminho de código) e remover o "ou". |
| AMB-02 | 7A.3 vs. 9.4 / restrição 5 | `SameSite=Strict` é enunciado de forma global, mas o cookie de `state` **não pode** ser `Strict` — não sobrevive à navegação de retorno vinda de `github.com`. O documento trata dois cookies com requisitos opostos como se fossem um. Ver SEC-04. |
| AMB-03 | Restrição 3 vs. secção 10 | "Allowlist fixa de `redirect_uri`, comparação exata de origem" vs. "Fases 1-6 correm em deploy preview" (URLs mutáveis). Como está, as duas regras não são simultaneamente satisfazíveis, e a resolução informal produz um open redirect. Ver SEC-06. |
| AMB-04 | 7A.2, tabela de papéis | "Administrador: **tudo o que o editor faz**, mais convidar e remover". Não é claro se ter acesso de escrita ao repositório é **pré-requisito** do papel de administrador ou apenas descrição do que ele também consegue fazer. A diferença decide o caso do ex-administrador (SEC-02) e tem de ser resolvida explicitamente, não deixada ao critério de quem implementa. |
| AMB-05 | 3.3 opção (a) vs. 7A / 9.5 | A opção (a) é recomendada assumindo editores "de confiança"; toda a secção 7A é construída sobre o pressuposto contrário (um editor **não** deve poder tornar-se administrador). O SEC-01 é o ponto onde as duas premissas colidem em concreto. Precisa de decisão explícita sobre qual vale. |
| AMB-06 | 7A.3, "nota de implementação" | O possível conflito entre `public/admin/` estático e `app/admin/users/` é declarado "sem consequência arquitetural". Concordo quanto à arquitetura, mas **tem** consequência de segurança se resolvido à pressa: qualquer caminho alternativo (ex.: `/gestao/utilizadores`) tem de herdar `noindex`, `Disallow`, a mesma verificação de sessão e a mesma resposta indistinguível. Registar como requisito que acompanha o caminho, seja ele qual for — para não se perder no meio de um problema de routing. |
| AMB-07 | 9.4, "Token no `localStorage`" | Listado como limitação inerente ao Decap, mitigada por "CSP restritiva". Não é dito que essa mitigação depende inteiramente de a origem do bundle do Decap ser confiável (SEC-05). Uma CSP que permita `unpkg.com` em `/admin` torna a mitigação declarada em grande medida ilusória. |
| AMB-08 | 7A.3 | Não é dito **como** o servidor obtém o ID numérico verificado no callback. Tem de ser via `GET /user` na API do GitHub, no servidor, com o token acabado de trocar — **nunca** de um valor vindo do cliente ou da query string. Óbvio para quem sabe; é exatamente por ser óbvio que fica por escrever. |

---

ISSUES (consolidado, por severidade):

| Ref | Severidade | Título | Bloqueia |
|---|---|---|---|
| SEC-01 | **high** | Editor exfiltra allowlist e chave da GitHub App via código no repositório (preview ou main) | **Fase 6** (e Fase 5 na parte dos segredos em Preview) |
| SEC-02 | **high** | Sessão sem revogação, sem TTL definido e desligada da permissão real | **Fases 5 e 6** |
| SEC-03 | medium-high | Validação do `username` nunca especificada; injeção de caminho na API do GitHub | Fase 6 |
| SEC-04 | medium-high | Ciclo de vida do `state` indefinido; `SameSite=Strict` incompatível com o callback | Fase 5 |
| SEC-05 | medium | Bundle do Decap de CDN de terceiros na página que detém o token | Fase 5 |
| SEC-06 | medium | Previews privilegiados públicos; allowlist fixa vs. URLs efémeros | Fases 5 e 6 |
| SEC-07 | medium | Guardas de 7A.7 sem critério de identidade e possivelmente só na UI | Fase 6 |
| SEC-08 | low-medium | Manuseio do PEM, JWT da App e cache de token em estado de módulo | Fase 6 |
| SEC-09 | low | Sem sinal para outros administradores; sem limites de taxa na rota privilegiada | Não bloqueia |

Nenhuma vulnerabilidade é **explorável hoje**: não existe código, não existe repositório, não existe
credencial emitida. As severidades acima são a severidade que estes achados **teriam** se o desenho
fosse implementado tal como está escrito.

---

BLOCKERS:

- **Fases 1-4: nenhum.** Confirmo explicitamente que nada nesta revisão trava o Developer. Não há
  autenticação, autorização, credenciais nem exposição de produção nessas fases.
- **Fase 5: BLOCKED** até SEC-02, SEC-04, SEC-05 e SEC-06 estarem fechados no desenho.
- **Fase 6: BLOCKED** até SEC-01, SEC-02, SEC-03, SEC-06 e SEC-07 estarem fechados no desenho.
- **SEC-01 é o bloqueio determinante da Fase 6.** Fechá-lo exige uma **decisão do utilizador**, não
  apenas uma correção técnica: ou se aceita a mitigação por configuração (segredos só em Production +
  proteção de `main` vinculativa), ou se muda a estrutura (repositório de conteúdo separado). Não é
  decisão minha, nem do Architect sozinho.

---

REQUIRES_HUMAN_NOTIFICATION: **true**

Obrigatório: existem achados de severidade `high` (SEC-01, SEC-02). Aplica-se independentemente de
serem achados de desenho e não de código explorável, e independentemente de virem a ser corrigidos —
a regra não me dá margem para decidir que "ainda não é preciso incomodar", nem eu tenho essa
autoridade. O Orchestrator apresenta este relatório ao utilizador, com destaque para a decisão
estrutural exigida pelo SEC-01 (ver AMB-05: repositório único vs. separado).

---

REQUIRED_NEXT_ACTION:

**Para o Orchestrator (agora):**
1. Apresentar SEC-01 e SEC-02 ao utilizador. A decisão que precisa de resposta explícita é a do
   SEC-01: **manter repositório único, com proteção de `main` vinculativa e segredos só em
   Production, ou separar o repositório de conteúdo?** Recomendo que esta pergunta seja feita antes
   da Fase 6 e, idealmente, antes da Fase 0 — criar o repositório é mais barato do que o dividir
   depois.
2. Deixar o Developer avançar nas Fases 1-4 em paralelo. Não esperam por isto.

**Para o `software-architect` (antes da Fase 5):** adenda ou v5 que resolva SEC-02, SEC-04, SEC-05,
SEC-06 e as ambiguidades AMB-01, AMB-02, AMB-03, AMB-04, AMB-07 e AMB-08. Em concreto: TTL numérico
da sessão; separação dos dois cookies com políticas distintas; origem do bundle do Decap; domínio
estável e credenciais separadas por ambiente; código de resposta único para não-autorizados.

**Para o `software-architect` (antes da Fase 6):** resolver SEC-01 (com a decisão do utilizador),
SEC-03, SEC-07, e as ambiguidades AMB-04 e AMB-05. Reponderar por escrito a opção (b) da secção 3.3
à luz do SEC-01.

**Para o `developer` (nada agora; vinculativo quando chegarem as Fases 5 e 6):** acrescentar às 26
restrições da secção 12, como restrições 27-38:

```
27. Segredos privilegiados (GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_ID,
    ADMIN_GITHUB_USER_IDS, SESSION_SECRET) definidos APENAS no ambiente Production da Vercel.
    Nunca em Preview nem Development. Preview usa credenciais descartaveis e repositorio sandbox.
28. Protecao de `main` (sem push direto; PR com revisao de terceiro) configurada ANTES de convidar
    o primeiro editor adicional. Pre-condicao do entregavel da Fase 6, nao recomendacao.
29. Autorizacao privilegiada exige DUAS condicoes por pedido: ID na allowlist E permissao de
    escrita atual confirmada em tempo real contra a API do GitHub.
30. Cookie de sessao: TTL absoluto <= 60 min, sem renovacao deslizante; HMAC-SHA256 com
    SESSION_SECRET dedicado; algoritmo fixado no codigo, nunca lido do token; comparacao em tempo
    constante; payload minimo (ID numerico + expiracao), sem token GitHub.
31. Dois cookies distintos: `state` (httpOnly, Secure, SameSite=Lax, Path restrito ao callback,
    TTL <= 10 min, uso unico, apagado no callback antes de validar) e sessao (SameSite=Strict).
32. `state` gerado com CSPRNG, >= 128 bits, comparado em tempo constante. Nunca Math.random().
33. Validacao de `Origin` FALHA FECHADA quando o header esta ausente. SameSite sozinho nao e
    protecao CSRF suficiente.
34. `username` validado por allowlist de formato (regex de username do GitHub) E codificado com
    encodeURIComponent antes de entrar em qualquer caminho de URL da API do GitHub.
35. Guardas de auto-remocao e de remocao do proprietario comparadas por ID numerico e aplicadas na
    rota de servidor. Confirmacao na UI e adicional, nunca substitutiva.
36. Bundle do Decap auto-hospedado, versao exata, lockfile commitado. Se CDN: versao exata + SRI.
    CSP permissiva confinada a /admin por header de rota; nunca relaxar a CSP global da Fase 4.
37. Um unico codigo de resposta para todos os nao-autorizados (404), na pagina e na API, gerado
    pelo mesmo caminho de codigo. Sem ramo 403/404 distinto.
38. Tokens de instalacao nunca guardados - incluindo em variaveis de modulo, que persistem entre
    invocacoes quentes. Chave privada em base64 numa env var; erros de parsing nunca imprimem a
    chave. `code`, `state`, cookie e PEM proibidos em logs.
```

**Para mim (`security-engineer`), depois:** revalidação **contra o código**, em dois momentos
separados (Fase 5 e Fase 6), com evidência reproduzível — não com a afirmação de que foi feito. O
mínimo que exigirei: pedido com `redirect_uri` de origem não-allowlisted é rejeitado (não
normalizado); `postMessage` sem `targetOrigin` literal em lado nenhum; `state` reutilizado é
rejeitado; chamada direta a `/api/admin/collaborators` por editor autenticado sem privilégio é
negada, com a mesma resposta que um anónimo; `username` com `../` rejeitado; pedido de mutação sem
`Origin` rejeitado; bundle do cliente sem qualquer segredo; e prova de que as variáveis de ambiente
sensíveis não existem no ambiente Preview.

---

CONTEXT_FOR_NEXT_AGENT:

**Para o `developer` (Fases 1-4):** nada nesta revisão te trava nem te obriga a algo agora. Um único
item com efeito antecipado: ao montar a CSP e o HSTS na **Fase 4**, deixa a política **estrita por
defeito** e prevê que `/admin` venha a ter um header próprio por rota. Não construas uma CSP global
que depois precise de ser enfraquecida para o Decap caber (SEC-05). E confirma o `.gitignore` de
`.env*` **antes do primeiro commit** — o repositório é público, e um segredo commitado obriga a
rotação, não a `git rm`.

**Para o `code-reviewer`:** as 12 restrições novas (27-38) são verificáveis por leitura de código.
Três merecem atenção especial por passarem despercebidas numa revisão normal: (i) `targetOrigin`
literal, nunca uma variável derivada de `location` / `referrer` / query; (ii) qualquer variável de
módulo que guarde credenciais — em serverless isso é cache partilhada entre pedidos, não uma variável
local; (iii) ramos `403`/`404` distintos para não-autorizados, que reintroduzem o oráculo de AMB-01.

**Para o `qa-engineer` / `tester`:** os controlos desta revisão são quase todos **invisíveis num teste
funcional** — o login funciona igualmente bem com `state` reutilizável, com `targetOrigin: '*'` e com
uma sessão de 30 dias. Os testes têm de ser **negativos e adversariais**: o que acontece quando se
altera o `redirect_uri`, quando se replica um `state`, quando um editor chama a API diretamente,
quando o `username` contém `../`, quando falta o header `Origin`. Um "correu tudo bem" não é
evidência de nada aqui.

**Para o `devops-engineer`:** a separação de ambientes deixou de ser higiene e passou a ser **um
controlo de segurança**. Confirmar, na Fase 0 e antes de cada deploy privilegiado, que as variáveis
sensíveis existem **apenas** em Production; que Preview aponta para uma GitHub App e um repositório
sandbox; e que a proteção de `main` está ativa antes de existir um segundo colaborador. 2FA
obrigatório na conta Vercel e na Organização GitHub — a conta Vercel é agora tão sensível como a
GitHub (ISSUE-2 do Architect, reforçado pelo SEC-01).

**Estado dos gates:** o Gate 4 (security) **não** está dado. O que existe é uma checklist validada
para quando as Fases 5 e 6 chegarem, mais quatro correções de desenho a fazer antes disso, mais uma
decisão estrutural que pertence ao utilizador.

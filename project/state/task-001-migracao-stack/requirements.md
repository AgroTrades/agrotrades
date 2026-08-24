# Requisitos — Migração AgroTrades de site estático para stack editável (custo zero)

## 1. Contexto e objetivo (reformulado sem ambiguidade)

O site institucional da AGRO TRADES, LDA (empresa agrícola moçambicana, Nampula/Moma) é hoje
100% estático (HTML/CSS/JS vanilla, sem build, hospedado no Netlify), com todo o conteúdo
(textos, traduções PT/EN, dados de serviços) hardcoded em ficheiros HTML e no array `SERVICES`
de `js/main.js`.

O pedido é migrar para uma stack nova que:
1. Deixe de ser puramente estática (build/renderização pode continuar a existir, mas o
   **conteúdo** — textos, traduções, dados de serviços — deixa de estar hardcoded no código-fonte).
2. Permita conteúdo editável sem exigir alterar código-fonte para cada mudança de texto.
3. Use apenas soluções de custo zero garantido em todas as camadas (hosting, CMS/armazenamento
   de conteúdo, base de dados, i18n, formulários, etc.) — sem planos pagos e sem "free tier" que
   exija cartão de crédito com risco de cobrança automática.
4. Funda o melhor das duas variantes de design/conteúdo existentes hoje no repositório
   (raiz vs. `AvaliacaoAgroTrades/uploads/agrotrades/`).

Esta tarefa é classificada **LARGE** pelo Orchestrator por ser uma decisão de arquitetura de
fundação (reescrita completa da stack), não por envolver dados sensíveis, autenticação ou
pagamentos — confirma-se aqui, com base em `project/context.md`, que **este site não tem hoje**
autenticação, integração bancária, dados pessoais de clientes ou schema de produção. Isso só
mudará se, no âmbito desta migração, for introduzido um formulário que recolha e armazene dados
pessoais de visitantes (ver secção 6, ambiguidade aberta).

## 2. O que TEM de se manter (requisitos funcionais obrigatórios)

### 2.1 Conteúdo
- FR-01: Todo o conteúdo textual atualmente publicado em PT e EN (hero, about, stats, serviços,
  campanha, contactos, footer) deve continuar disponível nos dois idiomas, sem perda de
  informação face ao estado atual (`js/main.js` array `SERVICES` e objeto `translations`, mais
  os HTMLs de `index.html`, `servicos.html`, `servico.html`, `campanha.html`, `contactos.html`).
- FR-02: Os 8 serviços existentes (arroz, cereais, moageira, terras, campanha, mecanizacao,
  apoio-tecnico, comercializacao) devem manter os seus dados completos: ícone, título, resumo,
  descrição longa e lista de destaques ("highlights"), em PT e EN, tal como definidos hoje em
  `SERVICES`.
- FR-03: O CTA principal de contacto via WhatsApp (`https://wa.me/258841031220`, número
  `+258 84 103 1220`) deve manter-se visível e funcional em todas as páginas relevantes
  (botão no hero, botão flutuante fixo, secção de contactos).
- FR-04: Os dados de localização (Escritório Sede em Nampula — Rua de Tete n.º 370, Limoeiros;
  Machamba em Moma — Posto Administrativo de Chalaua) devem manter-se, em PT e EN.

### 2.2 Identidade visual
- FR-05: Paleta de cores atual deve manter-se: `--green: #3a8c2f`, `--green-dark: #2a6622`,
  `--green-light: #e8f5e4`, `--orange: #f5a623`, `--orange-dark: #d4891a`,
  `--orange-light: #fff8ec`, `--earth: #8b6914`.
- FR-06: Tipografia atual deve manter-se: Playfair Display (títulos) + DM Sans (corpo de texto).
- FR-07: Logótipo atual (`images/logo.jpeg`) deve manter-se, salvo decisão explícita em
  contrário pelo UX/UI designer.

### 2.3 Navegação e estrutura de páginas
- FR-08: Estrutura de navegação principal deve manter-se: Início / Serviços / Campanha 2025/26 /
  Contactos, disponível em PT e EN via troca de idioma.
- FR-09: Deve continuar a existir uma página de listagem de serviços e uma forma de aceder ao
  detalhe de cada serviço individual (ver secção 3 para a decisão sobre a forma técnica).

### 2.4 Internacionalização
- FR-10: Deve manter-se seletor de idioma PT/EN acessível em todas as páginas, com a preferência
  do utilizador persistida entre visitas (hoje via `localStorage`; a persistência tem de
  continuar a existir, o mecanismo técnico é decisão do Architect).
- FR-11: `<html lang>` deve refletir corretamente o idioma ativo em cada página (requisito de
  acessibilidade e SEO já cumprido hoje).

### 2.5 SEO e metadados (regra de precedência — ver secção 4)
- FR-12: Cada página deve manter/ganhar: `title`, `meta description`, `canonical`, `og:title`,
  `og:description`, `og:type` (já existentes na raiz hoje) — **mais** `favicon`, `og:image`,
  `og:url`, `twitter:card` e JSON-LD `Organization` (nome, telefone, email, endereço) trazidos da
  variante `AvaliacaoAgroTrades` — nenhuma destas propriedades pode regredir face ao melhor dos
  dois estados atuais.
- FR-13: Deve existir uma página 404 dedicada e personalizada (hoje só existe em
  `AvaliacaoAgroTrades`), coerente com a identidade visual do site.
- FR-14: `robots.txt` e `sitemap.xml` devem manter-se e refletir corretamente a estrutura final
  de URLs escolhida.

### 2.6 Domínio e hosting
- FR-15: O site final deve continuar a resolver em `agrotrades.co.mz` (domínio atual, ver
  `og:url`/`canonical` já configurados) — mudança de domínio não é objeto deste pedido.
- FR-16: Não pode haver qualquer camada (hosting, CMS, base de dados, i18n, formulários, CI/CD)
  com custo recorrente, nem "free tier" que exija cartão de crédito com risco de cobrança
  automática. Este requisito é transversal e não-negociável — o Architect deve validar cada
  serviço externo proposto contra este critério antes de o incluir na arquitetura.

## 3. O que PODE mudar (áreas de liberdade técnica, fora do âmbito do Product Analyst)

Estas decisões pertencem ao software-architect / ux-ui-designer, não a este documento — listadas
aqui apenas para deixar explícito que **não são requisitos fixos**:
- Framework e ferramenta de build (Next.js, Astro, Remix, ou outro).
- Onde e como o conteúdo editável é armazenado (JSON/MDX versionado no repo, headless CMS
  self-hosted, headless CMS free-tier sem cartão, base de dados gratuita, etc.), desde que
  cumpra FR-16 e permita edição de conteúdo sem exigir alteração de código para cada texto
  (ver NFR-01).
- Mecanismo técnico de i18n (framework vs. solução client-side custom).
- Forma de servir páginas de serviço individuais: página única com parâmetro dinâmico
  (`/servicos/[id]`) vs. rotas estáticas geradas por serviço — desde que URLs finais sejam
  amigáveis e cada serviço tenha uma URL própria partilhável (ver FR-17 abaixo, que é o único
  requisito fixo nesta área).
- Hosting concreto (Netlify, Vercel, ou outro), desde que gratuito sem risco de cobrança.
- Estrutura interna de pastas/componentes.

- FR-17 (requisito fixo, forma livre): Cada um dos 8 serviços deve ter uma URL própria,
  indexável e partilhável individualmente (não apenas acessível via scroll ou modal dentro da
  página de listagem). Isto é requisito de produto (SEO/partilha), a forma técnica de o
  cumprir é livre.

## 4. Precedência entre as duas variantes (raiz vs. AvaliacaoAgroTrades) onde divergem

Nenhuma das duas variantes deve ser tratada como "a definitiva" — a diretriz de produto é:
**usar o melhor de cada uma**, com as seguintes decisões explícitas:

| Aspeto | Prevalece | Razão |
|---|---|---|
| SEO (favicon, og:image/og:url, twitter:card, JSON-LD Organization) | **AvaliacaoAgroTrades** | Mais completo, sem trade-off — deve ser incorporado integralmente na versão final. |
| Estrutura de páginas de serviço (individuais vs. `?id=`) | **AvaliacaoAgroTrades** (URLs individuais), mas mantendo o **copy** da raiz (ver linha seguinte) | Melhor para SEO e partilha de links (FR-17); a raiz usa query param, que é inferior para indexação. |
| Copy dos serviços (resumos/descrições) | **Raiz** (`js/main.js`, array `SERVICES`) | Contém o texto mais completo e mais recentemente desenvolvido; deve ser o texto de referência a migrar para as páginas de serviço individuais. |
| Página 404 | **AvaliacaoAgroTrades** (única que tem) | Não existe alternativa na raiz — adotar diretamente, adaptando à identidade visual atual. |
| Carregamento de fontes (`<link preconnect>` vs. `@import` no CSS) | **AvaliacaoAgroTrades** | Melhoria de performance sem trade-off funcional. |
| CSS/paleta/tipografia | Indiferente — praticamente idênticos | Confirmado em `project/context.md`: CSS quase igual entre as duas variantes. |

**Resultado esperado:** a versão final deve ter SEO completo + páginas de serviço individuais
(estrutura de URL da AvaliacaoAgroTrades) + copy completo dos serviços (texto da raiz) + página
404 + carregamento de fontes otimizado. Isto não é uma escolha entre A ou B — é uma fusão
explícita, com a tabela acima a resolver cada divergência ponto a ponto.

## 5. Requisitos não-funcionais

- NFR-01 (editabilidade): Deve ser possível atualizar textos, traduções PT/EN e dados de
  serviços (título, resumo, descrição, destaques, ícone) sem exigir conhecimento de programação
  — nível de esforço aceitável é "editar um ficheiro de conteúdo estruturado (ex.: JSON/MDX)" ou
  "usar uma interface de CMS"; não é aceitável que qualquer alteração de texto exija tocar em
  código de layout/lógica.
- NFR-02 (custo zero): Nenhuma camada da arquitetura final pode gerar custo recorrente nem
  depender de cartão de crédito associado a um free tier com risco de lá vir cobrança (aplica-se
  a hosting, armazenamento de conteúdo/CMS, base de dados, envio de formulário, analytics, etc.).
- NFR-03 (desempenho): Tempo de carregamento da homepage não deve regredir face ao estado atual
  (site estático é rápido por natureza — a nova stack não pode introduzir regressão percetível).
- NFR-04 (SEO): Nenhuma página pode perder posicionamento de indexação face ao estado atual —
  URLs existentes devem manter-se ou ter redirects apropriados (ver ambiguidade em 6.3).
- NFR-05 (acessibilidade/i18n): Troca de idioma deve continuar instantânea (sem reload completo
  de página, exceto se a nova stack exigir navegação entre rotas `[locale]`, que é aceitável se
  documentado e sem perda de UX percetível).
- NFR-06 (manutenibilidade): A stack final deve ser suficientemente simples para ser mantida
  sem uma equipa de engenharia dedicada permanente (é um site institucional de baixo tráfego).

## 6. Ambiguidades identificadas (não resolvidas por este agente — reportar ao Architect/Orchestrator)

### 6.1 Onde e como armazenar conteúdo editável
Não está definido se "editável" significa:
(a) ficheiros JSON/MDX versionados no repositório, editados via Git/PR (custo zero garantido,
mas exige alguém confortável com Git para editar texto), ou
(b) um headless CMS com interface de edição visual (mais fácil para quem não é técnico, mas há
menos garantia de free tier realmente sem cartão de crédito a longo prazo).
**Isto é uma decisão de arquitetura, não de produto** — mas o Product Analyst sinala que não
existe hoje informação sobre quem vai editar o conteúdo no futuro (equipa técnica vs. não
técnica da AGRO TRADES). Esta resposta influencia diretamente a escolha do Architect e devia
ser confirmada com o utilizador antes do Gate 2.

### 6.2 Formulário de contacto vs. apenas link WhatsApp
`project/context.md` deixa em aberto se deve ser adicionado um formulário de contacto com envio
de email (via serviço gratuito). **Nota de risco:** se for adicionado um formulário que recolha
dados pessoais de visitantes (nome, email, telefone, mensagem), a classificação de risco deste
projeto deixa de ser garantidamente baixa — passa a envolver dados pessoais de clientes, o que
aciona a secção 1 do `CLAUDE.md` (LARGE) e a confirmação humana obrigatória da secção 4 antes de
implementar. Este documento **não assume** que o formulário será adicionado — fica registado
como decisão pendente de confirmação humana explícita, não como requisito.

### 6.3 Preservação exata de URLs existentes
Não há hoje um sitemap.xml/robots.txt confirmado como definitivo, e a mudança de
`servico.html?id=X` para URLs individuais (FR-17) implica que URLs antigas mudam de forma. Não
está definido se é necessário manter redirects 301 de `servico.html?id=X` para a nova URL de
cada serviço, para não perder eventual indexação/partilhas já existentes no motor de busca ou em
redes sociais. Recomenda-se ao Architect prever este redirect por precaução, mas fica como
ambiguidade aberta — não há dados de tráfego/indexação atual partilhados com este agente para
confirmar se é crítico.

### 6.4 Estatísticas do hero ("2+ anos", "∞ hectares", "8 serviços", "MZ Moma")
O valor "∞" para hectares cultivados e "2+" para anos de atividade são valores de marketing
atuais. Não foi pedido alterá-los, por isso mantêm-se como estão — mas fica registado que, se a
migração incluir dados dinâmicos, alguém deve confirmar se estes valores devem passar a ser
editáveis via conteúdo ou continuar fixos no código (assume-se editáveis, por default, dado o
objetivo geral de conteúdo editável — mas não há confirmação explícita disso).

Nenhuma destas ambiguidades impede a definição de critérios de aceitação (secção 7) — não são
bloqueantes para o Architect avançar com FR-01 a FR-17, mas devem ser trazidas à atenção do
utilizador antes de decisões irreversíveis nas áreas 6.1 e 6.2.

## 7. Critérios de aceitação (testáveis objetivamente)

1. AC-01: A homepage final apresenta, em PT e em EN, todo o texto presente hoje em
   `translations.pt`/`translations.en` de `js/main.js` e nos HTMLs da raiz, sem omissões
   verificáveis por comparação lado a lado.
2. AC-02: Existem 8 páginas/rotas de serviço, cada uma com URL própria e indexável, contendo
   ícone, título, resumo, descrição longa e lista de destaques, em PT e EN, com o texto
   correspondente ao array `SERVICES` da raiz (não o texto mais resumido de
   `AvaliacaoAgroTrades`, se divergir).
3. AC-03: Clicar no botão "Fale connosco no WhatsApp" (hero) e no botão flutuante abre
   `https://wa.me/258841031220` em todas as páginas testadas.
4. AC-04: Alternar entre PT e EN atualiza todo o texto visível na página atual e mantém a
   preferência ao navegar para outra página/rota (testável recarregando/navegando e confirmando
   que o idioma escolhido persiste).
5. AC-05: A árvore `<head>` de cada página contém: `title`, `meta description`, `canonical`,
   `og:title`, `og:description`, `og:type`, `og:image`, `og:url`, `twitter:card`, e existe um
   favicon acessível — verificável inspecionando o HTML gerado.
6. AC-06: Existe pelo menos um bloco de dados estruturados JSON-LD tipo `Organization` com nome,
   telefone e endereço da empresa, presente pelo menos na homepage — verificável por inspeção do
   HTML/validador de rich results.
7. AC-07: Aceder a uma URL inexistente no site final apresenta uma página 404 personalizada
   (não a página de erro genérica do serviço de hosting) — verificável navegando para uma rota
   inexistente.
8. AC-08: A homepage e as páginas de serviço/contactos usam exclusivamente as variáveis de cor
   `--green`, `--green-dark`, `--green-light`, `--orange`, `--orange-dark`, `--orange-light`,
   `--earth` (ou os valores hex equivalentes) e as fontes Playfair Display/DM Sans — verificável
   por inspeção do CSS computado.
9. AC-09: A navegação principal apresenta, nesta ordem, Início/Serviços/Campanha 2025-26/
   Contactos, em PT e EN, em todas as páginas.
10. AC-10: A secção de contactos apresenta os dois endereços (Escritório Sede em Nampula e
    Machamba em Moma) em PT e EN, com o texto correspondente ao conteúdo atual.
11. AC-11: Um editor de conteúdo consegue alterar o texto de um serviço (ex.: o resumo do
    serviço "arroz" em PT) sem editar ficheiros de código de layout/estilo/lógica, e a alteração
    reflete-se no site publicado — verificável fazendo essa alteração de teste e confirmando que
    aparece no site sem tocar em componentes/CSS/JS de layout.
12. AC-12: Nenhum serviço externo incluído na arquitetura final exige inserção de dados de
    cartão de crédito para ativar o plano gratuito usado — verificável revendo a documentação de
    pricing/signup de cada serviço antes de adotar.
13. AC-13: O site final resolve em `agrotrades.co.mz` (ou mantém a configuração de domínio atual
    sem regressão).
14. AC-14: `robots.txt` e `sitemap.xml` existem e listam corretamente todas as URLs finais do
    site (incluindo as 8 páginas de serviço com as suas URLs individuais).

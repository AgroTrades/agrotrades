STATUS: COMPLETED
SUMMARY: Pedido reformulado: migrar o site institucional estático da AGRO TRADES (HTML/CSS/JS
vanilla, sem build) para uma stack que torne o conteúdo (textos, traduções PT/EN, dados de
serviços) editável sem alterar código, usando exclusivamente soluções gratuitas garantidas em
todas as camadas (hosting, CMS/armazenamento de conteúdo, base de dados, formulários), e fundindo
o melhor das duas variantes de design/conteúdo existentes (raiz do repo vs.
AvaliacaoAgroTrades/uploads/agrotrades/). Confirma-se que o site não tem hoje autenticação, dados
pessoais de clientes, pagamentos nem schema de produção — a classificação LARGE dada pelo
Orchestrator deriva de ser decisão de arquitetura de fundação, não de risco de dados sensíveis
(que só se tornaria relevante se for adicionado um formulário de contacto que recolha dados
pessoais — ver ISSUES).
ARTIFACTS: project/state/task-001-migracao-stack/requirements.md (17 requisitos funcionais
FR-01..FR-17, 6 requisitos não-funcionais NFR-01..NFR-06, tabela de precedência raiz vs.
AvaliacaoAgroTrades por aspeto, 14 critérios de aceitação AC-01..AC-14, 4 ambiguidades abertas)
VALIDATIONS: Requisitos derivados por leitura direta de project/context.md, CLAUDE.md,
index.html, js/main.js (array SERVICES e objeto translations) e css/style.css (variáveis de cor e
tipografia) — nenhum requisito foi inventado sem base no conteúdo/código atual observado.
ISSUES:
1. Não está definido quem vai editar o conteúdo no futuro (equipa técnica vs. não técnica) —
   isto condiciona a escolha entre "conteúdo em JSON/MDX versionado" vs. "headless CMS com UI" e
   é decisão de arquitetura, mas falta o dado de produto sobre o utilizador final do sistema de
   edição. Recomenda-se confirmar com o cliente antes do Gate 2.
2. Não está confirmado se deve ser adicionado um formulário de contacto com envio de email (em
   alternativa/complemento ao link direto de WhatsApp). Se isso avançar e recolher dados pessoais
   de visitantes, a tarefa passa a acionar dados pessoais de clientes (CLAUDE.md secção 1) e exige
   confirmação humana obrigatória antes de implementar (secção 4) — não foi assumido que este
   formulário será construído; fica registado como decisão pendente, não como requisito.
3. Não está confirmado se é necessário manter redirects 301 de servico.html?id=X para as novas
   URLs individuais de serviço, por falta de dados de tráfego/indexação partilhados.
4. Os valores estatísticos do hero ("2+ anos", "∞ hectares") não têm confirmação explícita sobre
   se devem passar a ser editáveis via conteúdo ou continuar fixos — assumido como editáveis por
   default (alinhado com o objetivo geral), sem confirmação explícita do utilizador.
BLOCKERS: Nenhum — nenhuma das ambiguidades acima impede a definição de critérios de aceitação
nem bloqueia o Architect de avançar com FR-01 a FR-17; são pontos a esclarecer com o utilizador
antes de decisões irreversíveis (especialmente 1 e 2), não impedimentos ao trabalho de arquitetura.
REQUIRED_NEXT_ACTION: O próximo agente é o software-architect (Gate 2, obrigatório por
classificação LARGE). Deve propor a stack técnica (framework, forma de armazenar/servir
conteúdo editável, hosting, i18n técnico, estrutura de rotas de serviço) cumprindo estritamente
NFR-02 (custo zero garantido, sem cartão de crédito) e NFR-01 (conteúdo editável sem tocar em
código de layout), respeitando a tabela de precedência da secção 4 de requirements.md para fundir
as duas variantes de design. Antes de fechar a arquitetura, o Orchestrator deve levar as
ambiguidades 1 e 2 (ISSUES) ao utilizador, dado que condicionam decisões estruturais.
CONTEXT_FOR_NEXT_AGENT: Ver project/state/task-001-migracao-stack/requirements.md na íntegra.
Resumo dos pontos que não podem regredir: conteúdo PT/EN completo (SERVICES + translations de
js/main.js), CTA WhatsApp (+258 84 103 1220), paleta de cores (--green #3a8c2f, --orange #f5a623,
--earth #8b6914 e variantes light/dark), tipografia (Playfair Display + DM Sans), navegação
Início/Serviços/Campanha/Contactos, domínio agrotrades.co.mz, e o requisito transversal de custo
zero garantido (sem free tier com cartão de crédito) em todas as camadas técnicas escolhidas. A
fusão de design deve seguir: SEO completo + páginas de serviço com URL individual + carregamento
de fontes via preconnect + página 404 (todos de AvaliacaoAgroTrades) combinados com o copy de
serviços mais completo (da raiz, js/main.js).

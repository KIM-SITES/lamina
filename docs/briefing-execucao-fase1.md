# LÂMINA — EXECUÇÃO AUTÔNOMA DA FASE 1 COMPLETA

## INSTRUÇÃO PRINCIPAL

O planejamento criativo e técnico do projeto **Lâmina — Piscinas & Paisagens**, baseado no conceito **A Superfície**, está aprovado.

Você está autorizado a executar integralmente a **FASE 1 — DESENVOLVIMENTO DO PROTÓTIPO INTERATIVO**, incluindo suas três etapas.

**Não interrompa a execução entre as etapas para solicitar aprovação.**

Estou autorizando explicitamente, como exceção ao processo habitual descrito no AGENTS.md, a execução contínua das três etapas do protótipo nesta sessão.

Essa autorização NÃO inclui a implementação do website definitivo, commits, push, deploy ou alterações destrutivas.

Vou me ausentar enquanto você trabalha. Quero encontrar um protótipo funcional, visualmente refinado, testado e documentado quando retornar.

Você possui autonomia para tomar decisões técnicas, artísticas e de organização dentro do escopo aprovado.

Não pergunte sobre pequenas decisões de layout, paleta, animação, arquitetura, dependências justificadas ou ajustes de performance. Tome decisões fundamentadas, implemente, teste e documente.

Se encontrar problemas, procure resolvê-los antes de encerrar.

Não contorne solicitações de autorização do ambiente ou permissões de segurança. Caso uma ação necessária esteja bloqueada, documente o impedimento e avance apenas nas tarefas independentes que forem possíveis.

---

# 1. CONTEXTO E DIREÇÃO ARTÍSTICA

Estamos criando um website demonstrativo para a empresa fictícia:

**Lâmina — Piscinas & Paisagens**

Serviços:
- Projeto e construção de piscinas.
- Revitalização e reforma.
- Manutenção e tratamento.

Conceito aprovado: **A Superfície**.

A identidade explora a fronteira entre o mundo acima e abaixo da água.

A experiência deve transmitir:

- Luz solar.
- Água verde mineral.
- Profundidade.
- Refração.
- Movimento natural.
- Fotografia cinematográfica.
- Sofisticação arquitetônica.
- Sensação de imersão.

O objetivo é alcançar qualidade visual e de movimento comparável às boas experiências de creative development encontradas no Landing Love.

Referência:

https://www.landing.love/search/?q=pool

Não copie nenhum site existente.

Não quero um template convencional com efeitos adicionados posteriormente.

**Quero uma experiência autoral cuja composição, interação e movimento tenham sido concebidos como um único sistema.**

---

# 2. PREPARAÇÃO OBRIGATÓRIA

Antes de implementar:

1. Leia integralmente o AGENTS.md.
2. Consulte o planejamento aprovado da Lâmina.
3. Leia e utilize a Skill frontend-design.
4. Leia e utilize a Skill web-design-guidelines.
5. Inspecione os arquivos existentes e preserve os materiais de planejamento.
6. Verifique o ambiente disponível e determine a configuração de projeto apropriada.

Trabalhe no diretório atual.

Não modifique o projeto Entrear Climatização.

As tecnologias recomendadas pelo planejamento são:

- Astro.
- TypeScript.
- GSAP + ScrollTrigger.
- OGL + fragment shaders.
- CSS e APIs nativas.

Pode adotar essas tecnologias conforme a arquitetura aprovada.

Mantenha a implementação modular.

Separe componentes visuais, estado, renderização WebGL, animações, conteúdo e lógica comercial.

Evite concentrar todo o código em um único arquivo.

---

# 3. ETAPA 1 — HERO E EXPERIMENTO DA SUPERFÍCIE

Implemente um hero cinematográfico de alta fidelidade.

Conteúdo principal:

Marca: Lâmina — Piscinas & Paisagens.

Título:

**"A água transforma o espaço."**

Apoio:

"Projeto, construção, revitalização e manutenção de piscinas."

Ação principal:

"Simular orçamento".

Ação secundária:

"Conhecer os serviços".

Identificação visível:

"Projeto demonstrativo".

## Direção visual

Utilize a identidade planejada:

- Calcário: #F2F5EF.
- Profundidade: #123C3D.
- Água mineral: #5D998F.
- Reflexo: #CDE6DF.
- Luz solar: #E7D6A5.

Tipografia:
- Syne para títulos.
- Instrument Sans para textos e controles.

Utilize fotografias de piscinas contemporâneas, com composição e iluminação adequadas.

Os recursos devem possuir origem e licença documentadas.

A imagem principal precisa comunicar claramente que se trata de uma empresa de piscinas.

Não apresente fotografias ilustrativas como obras executadas pela empresa fictícia.

## Animação de assinatura

Implemente uma superfície aquática com refração convincente.

Explore por meio de shaders:

- Distorção óptica localizada.
- Ondulação natural.
- Variação suave da refração.
- Luz e brilho com moderação.
- Sensação de diferentes profundidades.
- Movimento orgânico sem repetição mecânica óbvia.

Textos e controles devem permanecer nítidos e independentes do canvas.

### Experimentação obrigatória

Não aceite a primeira configuração funcional.

Experimente pelo menos três calibrações do efeito:

1. Refração discreta e realista.
2. Refração moderada, com maior presença visual.
3. Refração expressiva e cinematográfica, ainda controlada.

Compare as três no navegador.

Considere naturalidade, sofisticação, legibilidade, desempenho e coerência com a marca.

Escolha a melhor configuração com base no resultado visual e técnico.

Registre as alternativas e a justificativa da escolha.

## Controle interativo

Implemente a interação:

**"Explorar a superfície"**.

Ela deve permitir movimentar a região de refração sobre a fotografia.

Obrigatoriamente funcionar por:
- Mouse.
- Toque.
- Teclado.

Não dependa de hover.

Não bloqueie a rolagem vertical em dispositivos móveis.

Permita movimentos repetidos e inversões rápidas sem falhas.

---

# 4. ETAPA 2 — INTEGRAÇÃO DO PROTÓTIPO

Após concluir a primeira etapa, avance automaticamente para a segunda.

Não peça aprovação.

## Transição cinematográfica

Implemente a passagem do hero para a seção de serviços.

A superfície deve participar dessa transição.

Explore uma sequência em que:

1. A fotografia inicial permanece reconhecível.
2. A lâmina óptica se expande durante a rolagem.
3. A refração conduz a uma segunda composição visual.
4. A transição revela o conteúdo dos serviços.
5. A experiência retorna naturalmente à rolagem convencional.

Utilize GSAP e ScrollTrigger quando apropriado.

Quero uma transição memorável, com coreografia intencional.

Não implemente scroll-jacking, captura artificial da roda do mouse ou seções presas durante distâncias excessivas.

A transição deve funcionar nos dois sentidos.

Retornar à seção anterior não pode causar saltos, flashes ou estados inconsistentes.

## Serviços

Implemente uma apresentação inicial dos serviços:

- Projeto e construção.
- Revitalização e reforma.
- Manutenção e tratamento.

Não utilize uma sequência convencional de três cards iguais.

Desenvolva uma composição editorial coerente com a linguagem aquática.

Mantenha clareza comercial.

## Ambientes demonstrativos

Adicione duas referências visuais de ambientes com piscinas.

Explore uma interação elegante para alternar fotografias ou revelar detalhes.

A mudança pode utilizar uma máscara ou transição inspirada na água.

Não repita integralmente a animação principal em todas as imagens.

Identifique as fotografias como ilustrativas.

## Orçamento demonstrativo

Implemente uma simulação simples.

Solicite apenas:
- Serviço desejado.
- Tipo de imóvel.

A ação "Ver resumo" deverá gerar uma apresentação clara das opções.

Informe que se trata de uma simulação.

Não peça dados pessoais.

Não envie informações a servidores.

Não implemente contatos ou números fictícios.

Não armazene os dados permanentemente.

## Navegação

Todas as ações devem levar a destinos funcionais.

A navegação precisa funcionar por teclado, mouse e toque.

Não sacrifique a usabilidade para valorizar as animações.

---

# 5. RESPONSIVIDADE — PRIORIDADE ABSOLUTA

O protótipo deve oferecer experiências de alta qualidade em:

**Mobile**
- 320px.
- 375px.
- 390px.
- 430px.

**Tablet**
- 768px.
- 820px.
- 1024px.

**Desktop**
- 1280px.
- 1440px.
- 1920px.

Não reduza mecanicamente o desktop.

## Desktop

Explore composição panorâmica, profundidade, efeitos ópticos elaborados e movimento cinematográfico.

## Tablet

Projete composições adequadas a orientações vertical e horizontal.

Garanta controles por toque e adaptação das animações.

## Mobile

Crie um enquadramento vertical próprio.

Preserve a qualidade visual da superfície.

Adapte tipografia, navegação, controles e intensidade gráfica.

O visitante deve compreender os serviços e acessar o orçamento sem dificuldade.

O resultado mobile não pode parecer uma versão incompleta do desktop.

A navegação vertical deve continuar natural.

Quando necessário, substitua um efeito pesado por uma alternativa visual igualmente cuidadosa.

---

# 6. PERFORMANCE E ROBUSTEZ

Esta implementação utiliza recursos gráficos avançados. Portanto, performance e fallback são obrigatórios.

Implemente:

- Imagens responsivas e otimizadas.
- Fontes locais, quando viável.
- HTML visível antes da inicialização gráfica.
- Carregamento progressivo do WebGL.
- Limite de DPR.
- Controle da resolução do canvas.
- Pausa de renderização quando a aba estiver oculta.
- Pausa ou redução de trabalho quando a área animada não estiver visível.
- Liberação de recursos gráficos.
- Tratamento de falha de carregamento de texturas.
- Tratamento de perda e restauração do contexto WebGL.
- Redução de qualidade em dispositivos modestos.
- Fallback sem WebGL.
- Suporte a prefers-reduced-motion.
- Conteúdo essencial disponível sem JavaScript.
- Ausência de deslocamentos inesperados de layout.

Não mantenha um loop de renderização em frequência máxima sem necessidade.

Não utilize bibliotecas adicionais sem justificativa.

Tente respeitar os orçamentos de desempenho definidos no planejamento.

Caso algum limite seja ultrapassado, registre a medição real, investigue o motivo e corrija quando viável.

---

# 7. ETAPA 3 — REVISÃO, REFINAMENTO E DOCUMENTAÇÃO

Depois de integrar o protótipo, avance automaticamente para a terceira etapa.

**Esta etapa não pode ser tratada apenas como execução de testes automatizados.**

Quero uma revisão visual crítica.

## Direção artística

Analise o resultado renderizado:

- A água parece realmente natural?
- O shader está convincente?
- Existe sensação de profundidade?
- A composição tem personalidade?
- A fotografia sustenta a identidade?
- O efeito parece sofisticado ou artificial?
- As transições são fluidas?
- A tipografia conversa com a fotografia?
- A experiência possui ritmo?
- O visitante compreende imediatamente a empresa?
- A versão mobile mantém a qualidade?

Se identificar problemas, faça refinamentos.

Se a refração parecer uma barra de vidro ou gelatina, ajuste o shader.

Se a fotografia prejudicar a composição, reavalie o enquadramento ou substitua a imagem por outra licenciada.

Se a transição estiver artificial, corrija a coreografia.

Se algum efeito não justificar seu custo, simplifique.

**Não quero que você defenda uma implementação ruim apenas porque ela funciona.**

## Testes técnicos

Execute verificações de:

- TypeScript.
- Build.
- Console do navegador.
- Navegação.
- Links e âncoras.
- Orçamento demonstrativo.
- Teclado e foco.
- Touch e interações equivalentes.
- Scroll reversível.
- Redimensionamento.
- Alteração de orientação.
- Fallback sem WebGL.
- Movimento reduzido.
- Ausência de JavaScript.
- Perda de contexto gráfico, quando possível.
- Ausência de rolagem horizontal indesejada.

Utilize Playwright ou ferramentas apropriadas para testes de navegador.

Teste em Chromium, Firefox e WebKit quando disponíveis.

Não afirme que testou um navegador ou aparelho que não conseguiu executar.

## Performance

Avalie carregamento e custo gráfico.

Registre:
- Tamanho do JavaScript.
- Peso das principais imagens.
- Métricas de carregamento disponíveis.
- Estabilidade visual.
- Comportamento durante as animações.
- Limitações da medição.

Diferencie emulação e hardware real.

Não confunda FPS de uma gravação automatizada com FPS efetivo do site.

---

# 8. EVIDÊNCIAS VISUAIS E DE MOVIMENTO

Preciso conseguir avaliar o resultado ao retornar.

Gere capturas reais do protótipo em:

- Desktop: 1440px.
- Tablet: 820px.
- Mobile: 390px.

Gere também capturas representativas dos demais tamanhos testados.

Registre diferentes estados da superfície e da transição.

Sempre que o ambiente permitir, gere vídeos curtos que mostrem:

1. O hero.
2. A exploração interativa da água.
3. A transição para os serviços.
4. A volta para o hero.
5. A adaptação da experiência em mobile.

Prefira gravações de navegador real.

Se não for possível gravar, explique a limitação e forneça capturas sequenciais dos estados, além de instruções para experimentar manualmente.

Organize as evidências em uma pasta de documentação.

Não crie arquivos de vídeo gigantes sem necessidade.

---

# 9. AUTONOMIA E CONTINUIDADE

Esta seção é especialmente importante.

Durante a Fase 1:

- Execute as três etapas continuamente.
- Não aguarde minha aprovação entre elas.
- Não interrompa por decisões estéticas comuns.
- Tome decisões técnicas dentro do escopo aprovado.
- Teste as implementações antes de avançar.
- Corrija problemas identificados.
- Faça revisões visuais iterativas.
- Registre decisões importantes.
- Continue até entregar o protótipo integrado e revisado.

Ao concluir cada etapa interna, registre um resumo breve em documentação local e prossiga.

Se ocorrer um problema técnico, tente diagnosticá-lo e resolvê-lo.

Caso uma ferramenta não esteja disponível, avalie alternativas adequadas sem abandonar prematuramente o objetivo.

Não alegue ter executado verificações que não realizou.

A autonomia concedida vale somente para o protótipo, não para a implementação definitiva do site.

---

# 10. VERSIONAMENTO

Não faça commits automaticamente.

Não execute push.

Não crie repositórios remotos.

Não faça deploy.

Não altere arquivos de projetos anteriores.

Não modifique o AGENTS.md sem autorização.

Ao finalizar, sugira três mensagens de commit semântico em português, correspondentes às três etapas implementadas.

Como esta execução ocorrerá sem commits intermediários, não declare que essas etapas já estão registradas no Git. Apresente as mensagens apenas como sugestões e recomende um commit único de consolidação se o trabalho já estiver integrado.

---

# 11. ENTREGA FINAL OBRIGATÓRIA

Ao concluir a Fase 1, apresente um relatório completo contendo:

1. Resumo da experiência desenvolvida.
2. Arquitetura e tecnologias utilizadas.
3. Arquivos criados e modificados.
4. Explicação da animação principal.
5. Comparação das três calibrações de refração.
6. Explicação das transições entre seções.
7. Funcionalidades e interações implementadas.
8. Soluções para desktop, tablet e mobile.
9. Estratégia de fallback e acessibilidade.
10. Resultado dos testes.
11. Medições de desempenho disponíveis.
12. Problemas e limitações ainda existentes.
13. Links locais para capturas e gravações.
14. Instruções para executar no VS Code.
15. Sugestões de commits semânticos em português.
16. Sua avaliação crítica do resultado, identificando o que ainda poderia melhorar.

Não esconda problemas.

Se a qualidade visual ainda estiver abaixo do objetivo, diga isso explicitamente.

## CRITÉRIO DE CONCLUSÃO

A fase só estará concluída quando existir um **protótipo navegável e integrado**, contendo hero, efeito de superfície, interação, transição para serviços, ambientes ilustrativos, orçamento demonstrativo e comportamento responsivo.

Não considero suficiente apresentar apenas código, screenshots ou um shader isolado.

Quero poder abrir o navegador e experimentar a experiência completa.

**Ao finalizar as três etapas, PARE.**

Não inicie a implementação do website definitivo.

Aguarde minha avaliação e minhas próximas instruções.

O objetivo desta execução é entregar a melhor primeira versão possível do protótipo da Lâmina, com liberdade para experimentar, refinar e corrigir dentro do escopo autorizado.
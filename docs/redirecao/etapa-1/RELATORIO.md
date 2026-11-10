# Lâmina — Etapa 1: composição e materiais

**Entrega restrita à Etapa 1. Recomendação: composição A, imersiva.**

Os estudos estão isolados em `/estudos/etapa-1/`; a central de revisão está em `/estudos/`. A página original continua em `/`, com seus componentes, recursos, controles, GSAP e WebGL preservados. A nova coreografia não foi iniciada.

Para abrir as páginas: `npm.cmd run dev`, depois `http://127.0.0.1:4321/estudos/`. A [galeria local](index.html) funciona sem servidor e oferece os PNGs originais, comparações e recursos. As prévias WebP da central são menores; não substituem as capturas originais.

## Preservação e organização

- Baseline confirmado: `1b5b6d4` — `feat: preserva prototipo inicial da Lamina`.
- A árvore de trabalho estava limpa antes dos estudos. A validação registra o hash completo e o resultado de `git diff --name-only HEAD`.
- Nenhum arquivo anteriormente rastreado foi alterado. Somente novas áreas de estudos, documentação, recursos e scripts foram criadas.
- Nenhum commit, push, alteração de Skills/AGENTS.md ou deploy foi realizado.

As novas páginas usam componentes próprios de estudo e CSS independente. Dados comerciais e o pequeno controlador existente da simulação são reutilizados por importação, sem modificar os originais. Nenhuma dependência foi adicionada.

## Direção visual e alternativas

**A — imersiva.** A fotografia ocupa o campo inteiro. O título “Piscinas,” tem escala de primeiro plano; “entre luz e paisagem.” atravessa a região inferior em outra escala e alinhamento. A arquitetura fica exposta acima do texto, e a borda da piscina permanece visível como referência espacial. Descrição dos quatro serviços e ação de orçamento continuam disponíveis na abertura.

**B — editorial.** A mesma imagem é contida por uma moldura sobre verde profundo. O título diminui e o enquadramento fica mais controlado. O restante do percurso é compartilhado: a comparação isola a escolha da abertura, em vez de trocar simultaneamente fotografia, conteúdo e todas as seções.

Recomendo **A** porque a água permanece como espaço da composição, e a futura passagem terá uma diferença clara entre o campo imersivo e a moldura dos serviços. B é mais previsível e reduz a sensação de entrar na paisagem; permanece disponível como alternativa real para avaliação.

### Crítica comparativa

| Critério | Versão anterior | Estudo A | Limite da conclusão |
| --- | --- | --- | --- |
| Originalidade | Título à esquerda, ações abaixo e controle de efeito no rodapé do hero. | Hierarquia distribuída sobre o plano da água; a piscina é nomeada em primeiro plano. | A escala tipográfica, sozinha, não demonstra autoria. A relação com a fotografia e a futura continuidade são decisivas. |
| Fotografia | Caustics dominantes e pedra muito luminosa. | Água mais serena, geometria limpa e uma borda seca contínua; duas matrizes de orientação. | Todas as cenas continuam sintéticas. |
| Composição | O texto invade o pavilhão; no mobile, o muro e os degraus dominam. | A arquitetura se apresenta antes do título; mobile retém a piscina e seu comprimento. | Algumas copas são recortadas nas proporções mais estreitas, de forma deliberada. |
| Sofisticação | Muitos sinais auxiliares competem com a imagem. | Menos elementos na abertura; variação entre campo fotográfico, moldura e fechamento tipográfico. | Não foi demonstrada equivalência a galerias de referência. |
| Hierarquia | Syne em quase todos os títulos, com tratamento próximo. | Syne na marca e no hero; Instrument Sans no conteúdo editorial e nos controles. | O nome permanece tipográfico; não houve criação de um novo logotipo exclusivo. |
| Coerência | A água desaparece nos serviços e reaparece na galeria. | A mesma cena recebe um recorte nos serviços; água, pedra e vegetação continuam nos demais momentos. | A passagem ainda é uma intenção estática. |
| Movimento | Revelação entre duas escalas da fotografia. | Matriz única por orientação e destino editorial com região documentada. | Só o protótipo da Etapa 2 poderá validar a transformação em movimento. |
| Mobile | Recorte panorâmico privilegia muro e degraus. | Tomada vertical específica; tipografia, ações e fluxos próprios; corpo legível. | Não houve aparelho físico. Em 320 × 700, o hero tem 740px para acomodar conteúdo; a ação principal fica visível, e a secundária continua no fluxo. |
| Clareza comercial | Serviços e simulação funcionais. | “Piscinas” explícito na primeira leitura; serviços nomeados, ações específicas e formulário local reutilizado. | Sem teste com visitantes externos ou medição de conversão. |

## Percurso e preparação para movimento

1. **Hero:** a cena se apresenta como paisagem, com borda e água claramente reconhecíveis. A região seca deve permanecer estável na futura refração.
2. **Serviços:** título “Da paisagem ao detalhe.”, a mesma matriz fotográfica numa moldura e as três categorias completas. Links pré-selecionam o serviço na simulação.
3. **Ambientes:** pátio em imagem ampla e jardim em vista elevada. São cenas demonstrativas identificadas; não há obras ou clientes inventados.
4. **Orçamento:** detalhe de borda encerra o trecho fotográfico, seguido por composição central para as escolhas locais. Nenhuma estimativa monetária ou solicitação é enviada.
5. **Encerramento:** a marca retorna em grande escala, com identificação do projeto e retorno ao início.

A central de revisão apresenta quatro quadros estáticos de intenção e o mapa da matriz horizontal. Eles **não** são uma animação, uma simulação física ou uma promessa de interpolação já resolvida. Nesta etapa não há canvas, ScrollTrigger, pinning, shader novo ou distorção de fotografias.

### Regiões a preservar

| Matriz | Hero | Destino editorial | Referência aproximada |
| --- | --- | --- | --- |
| Horizontal, 1586 × 992 | Desktop inteiro; tablet horizontal em recorte 4:3. | Retângulo de origem: x=440, y=0, largura=790, altura=992. | Canto da piscina em torno de (675, 478); diagonal da borda até a direita; degraus inferiores. |
| Vertical, 1024 × 1536 | Mobile com a tomada inteira; tablet vertical em recorte 3:4. | Retângulo de origem: x=102, y=160, largura=820, altura=1100. | Canto em torno de (515, 550); continuidade da borda direita e degraus. |

Os pontos são referências de direção artística, não coordenadas certificadas de uma máscara de materiais. Na Etapa 2, o ajuste precisa considerar o `cover` real e o viewport. A troca de orientação deve escolher e reinicializar a matriz correspondente; não se deve misturar uma fotografia horizontal com a vertical durante a passagem. A vista elevada do jardim é outra câmera e não deve ser usada como quadro intermediário.

## Materiais e identidade

Paleta preservada: calcário `#F2F5EF`, profundidade `#123C3D`, água mineral `#5D998F`, reflexo `#CDE6DF` e luz solar `#E7D6A5`. O calcário sustenta a leitura; profundidade marca ambientes e encerramento. O tom solar permanece pontual na marca.

Syne e Instrument Sans continuam locais, com as licenças existentes. A tipografia de primeiro plano e a marca final usam unidades relativas ao contêiner para manter proporção também sob zoom. Não há nova biblioteca tipográfica, fonte remota ou imagem de texto essencial.

Foram produzidos quatro originais com **image_gen integrado**: cena horizontal, reenquadramento vertical, pátio e vista elevada do jardim. Os arquivos foram copiados para a área do projeto; nada depende da pasta pessoal de geração. Os [prompts completos](prompts.json), [inventário com dimensões, pesos e SHA-256](inventario-recursos.json) e originais estão preservados.

Derivados WebP: desktop 1586 × 992; tablet horizontal 1280 × 960; tablet vertical 1024 × 1365; mobile 792 × 1188; editorial horizontal 790 × 992; editorial vertical 820 × 1100; pátio e jardim 1440 × 960; detalhe de material 952 × 600. Recortes e compressão são reproduzíveis com `node scripts/studies/prepare-stage1-assets.mjs`. Não houve ampliação nem retoque pictórico por código.

### Revisão dos originais

Foram examinados os originais e seus usos no navegador: continuidade das bordas, convergência da perspectiva, espessura e alinhamento dos degraus, plantio separado da lâmina, contato das árvores com o solo, direção da luz, reflexos e textura mineral. Não foi encontrado um erro geométrico inequívoco que justificasse rejeitar as quatro imagens na escala de estudo. As texturas e reflexos permanecem aproximações sintéticas; não são documentação construtiva.

O reenquadramento vertical e a vista elevada não são reproduções geometricamente certificadas. Por isso, cada passagem usará recortes da sua própria matriz, e a vista elevada ficará fora dela. Essa limitação foi incorporada à organização dos recursos.

## Problemas encontrados e corrigidos

- Texto pequeno sobre o céu tinha contraste insuficiente na primeira composição. A proteção superior foi reforçada; texto e controles permanecem HTML.
- O cabeçalho transbordava com zoom CSS de 200%. Passou a admitir quebra; a escala dos títulos e da marca foi vinculada ao contêiner. O cenário passou sem overflow.
- O destino editorial inicialmente reutilizava a matriz horizontal também em mobile. Foi criado e associado um recorte da matriz vertical.
- Em 320 × 700, o excesso de altura deslocava parte da ação principal para baixo da dobra. O enquadramento e o espaçamento foram ajustados para tela curta.
- Capturas iniciais de página inteira não haviam carregado todas as imagens lazy. O procedimento passou a aguardar fontes e decodificação antes de capturar; as evidências finais contêm as imagens completas.
- A primeira verificação sem JavaScript consultava `isDisabled()` no fieldset; o método foi substituído pela verificação do input efetivamente desabilitado. O HTML já mantinha os controles desabilitados corretamente.

## Verificação e evidências

`npm.cmd run check`: zero erros, avisos ou hints. `npm.cmd run build`: build estática concluída. A [validação detalhada](validacao.json) registra navegador, viewport, fonte selecionada, falhas de imagem, axe e verificações funcionais. O script `node scripts/studies/capture-stage1.mjs` gera capturas e comparações; `BASE_URL` permite escolher o servidor de produção.

Foram exercitadas as dez larguras pedidas, mais os limites intermediários de 600, 699 e 700px; tablet horizontal; 320 × 700; zoom de 200%; teclado e primeiro foco; âncoras; pré-seleção do serviço; simulação sem envio/persistência; limpeza do resumo; movimento reduzido e ausência de JavaScript. Axe foi aplicado às composições A e B em desktop, tablet e mobile. Isso não equivale a certificação de acessibilidade.

As capturas principais são PNG, DPR 1, nas dimensões reais dos viewports. As pranchas preservam os PNGs individuais e apenas acrescentam disposição lado a lado e identificação. Não há gravação de uma nova transição, pois nenhuma animação foi implementada nesta etapa.

Skills aplicadas: frontend-design para composição; ui-ux-pro-max para hierarquia e fontes responsivas; design-taste-frontend como crítica de automatismos e revisão de texto; design-motion-principles para preservação espacial e preparação dos estados; web-design-guidelines para semântica, foco, contraste e alternativas. O verificador de texto da design-taste retornou 0 FAIL e 0 WARN. Não foram impostos seus templates, sorteios de layout, remoção de WebGL ou alturas rígidas, por conflitarem com a direção aprovada e o escopo desta etapa. A revisão de interface usou a [fonte atual das diretrizes](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Limites e encaminhamento

- A Etapa 1 valida composições e materiais; não valida ritmo temporal, refração ou alinhamento canvas/HTML em movimento.
- Não houve Safari real, aparelhos físicos, leitor de tela, teste com visitantes ou medição de GPU/bateria.
- A imagem horizontal tem 1586px de largura. Em 1920px e telas de alta densidade existe ampliação pelo navegador; os arquivos não foram artificialmente aumentados. Uma matriz de resolução superior continua desejável para a entrega definitiva.
- A fotografia e a hierarquia estão preparadas para melhoria progressiva, mas o orçamento de desempenho do site definitivo será verificado com a implementação gráfica.
- A alternativa B é selecionada por parâmetro e script inicial; sem JavaScript a composição A continua disponível com o mesmo conteúdo.

**Encaminhamento recomendado:** levar a composição A e suas duas matrizes à Etapa 2, preservando B como comparação. A aprovação desta entrega não está presumida; a execução termina nos estudos, aguardando avaliação do proprietário.

Sugestão de commit, sem execução: `feat: adiciona estudos visuais da redireção artística da Lâmina`.

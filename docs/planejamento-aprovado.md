# Planejamento aprovado — A Superfície

Registro do planejamento aprovado na conversa, antes da implementação. Não substitui AGENTS.md.

## Direção

Lâmina — Piscinas & Paisagens é uma empresa fictícia. O protótipo demonstra design e desenvolvimento, sem obras, clientes, promessas, endereços ou contatos inventados. Público: proprietários de residências, condomínios e pequenos empreendimentos.

Atmosfera escolhida pelo proprietário: luz e profundidade. Assinatura escolhida: lâmina óptica sobre fotografia coerente, em lugar de montagem literal acima/abaixo d'água. Recursos sem compra; geração original permitida. Orçamento como simulação local sem dados pessoais.

Paleta: calcário #F2F5EF, profundidade #123C3D, água mineral #5D998F, reflexo #CDE6DF, luz solar #E7D6A5 e branco. Tipografia: Syne e Instrument Sans, locais e licenciadas. Fotografias contemporâneas com recortes próprios para mobile.

## Protótipo

Hero com título “A água transforma o espaço.”, explicação dos serviços, duas ações e identificação demonstrativa. Controle nativo “Explorar a superfície”, com mouse, toque e teclado. Textos independentes do canvas. Um gesto de refração localizado, sem loop decorativo permanente.

Transição reversível ligada à rolagem: faixa expande, altera a composição fotográfica e conduz a serviços. Sem scroll-jacking. Serviços em composição editorial, dois ambientes ilustrativos e orçamento com serviço e tipo de imóvel. Nenhum envio ou persistência.

Astro estático + TypeScript; GSAP/ScrollTrigger para coordenação; OGL e shader próprio para imagem. Conteúdo HTML primeiro, melhoria progressiva, fallback visual, movimento reduzido, controle de DPR/resolução, pausa fora da tela e recuperação de contexto. Separar conteúdo, apresentação, estado, animação e renderização.

## Validação

Larguras: 320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920 px. Tablet vertical e horizontal. Teclado, toque, contraste, foco, 200% de zoom, ausência de overflow, JavaScript desativado, WebGL indisponível, contexto perdido/restaurado, texturas indisponíveis e movimento reduzido.

Metas: JS até 120 KB gzip; hero até 300 KB mobile/550 KB desktop; fontes até 140 KB; LCP de laboratório até 2,5 s; CLS até 0,1; resposta local abaixo de 200 ms. Medições devem identificar ambiente e limites. Capturas e gravações reais, sem confundir FPS de gravação com FPS da experiência.

## Referências e limites da pesquisa

- https://www.landing.love/effect/image-animation/
- https://www.landing.love/effect/page-transition/
- https://www.landing.love/effect/scroll-animation/
- https://www.landing.love/section/gallery/
- https://www.landing.love/sites/blobmixer/
- https://www.14islands.com/work/blobmixer
- https://www.landing.love/sites/joffreyspitzer/
- https://www.landing.love/sites/clearwater/
- https://www.landing.love/sites/mihaeltomic/

Fichas e documentação acessadas na pesquisa; gravações não reproduzidas. Busca ?q=pool indisponível e acesso direto retornando 403. Não se atribuem observações de movimento não verificadas. Usar princípios de materialidade, hierarquia e clareza, sem copiar recursos, layout ou código.

## Etapas e autorização

1. Hero e três calibrações da assinatura.
2. Integração de transição, serviços, ambientes e orçamento.
3. Revisão visual, testes, evidências e documentação.

O proprietário autorizou explicitamente executar as três etapas continuamente nesta sessão, como exceção à aprovação entre etapas de AGENTS.md. Não autoriza website definitivo, commits, push, deploy ou alterações destrutivas.

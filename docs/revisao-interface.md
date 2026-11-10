# Revisão da interface

Skill aplicada: `.agents/skills/web-design-guidelines/SKILL.md`. Fonte consultada novamente durante a revisão: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## Achados corrigidos

- `src/styles/sections.css`: removida opacidade que reduzia o contraste do ambiente inativo; auditoria axe passou após a correção.
- `src/components/SurfaceHero.astro:21`: links com tabindex zero para participação no foco sequencial no WebKit Windows; sem índices positivos e sem reordenar o DOM.
- `src/pages/index.astro:23`: atalho de conteúdo leva ao título, após a navegação, com alvo programaticamente focável.
- `src/components/Quote.astro:19`: aviso sem JavaScript é HTML comum, ocultado somente depois da inicialização; fieldsets são habilitados pelo controlador, sem submissão utilizável no estado sem scripts.
- `src/styles/base.css:121`: áreas seguras laterais, complementadas no topo/rodapé do hero.
- `src/styles/surface.css`: área do range ampliada para 44 px; seta de navegação também mede pelo menos 44 px.
- `src/scripts/gallery.ts`: seleção pode ser compartilhada por `?ambiente=patio`; atualização por History API sem requisição de rede.

## Verificações

HTML semântico, hierarquia de títulos, alternativas textuais, canvas decorativo, links reais, controles nativos, foco visível, labels, fieldsets, status com aria-live, zoom de 200%, movimento reduzido e ausência de dependência de hover. Auditoria automática WCAG 2 A/AA e WCAG 2.1 AA passou nos três motores. Isso não equivale a certificação de acessibilidade.

## Escolhas específicas do briefing

A galeria usa uma máscara CSS com clip-path, deliberadamente localizada nas imagens, além de opacidade. É uma exceção à recomendação genérica de animar somente transform/opacity, necessária à linguagem de revelação solicitada. Sob movimento reduzido, a troca é imediata. O shader não processa texto ou controles.

Nenhuma ação essencial depende de arrastar: o range aceita teclado; os ambientes têm botões; a navegação usa âncoras. A rolagem vertical não tem preventDefault nem biblioteca de scroll suave.

## Limites

Leitor de tela físico/assistivo não foi executado; a semântica foi inspecionada e auditada automaticamente. Os testes de toque usam emulação. Contraste em fotografia requer revisão contínua se a imagem ou o enquadramento mudar. Capturas da primeira iteração permanecem em `evidencias/revisao`; a galeria principal aponta para as evidências finais.

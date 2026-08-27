<div align="center">

# ⚽ Só+1 — Landing

### A porta de entrada da plataforma que acaba com o _"falta um?"_ no grupo do WhatsApp.

Landing de conversão do **Só+1**: descubra partidas abertas, entre com um clique e sorteie os times na hora — sem grupo de WhatsApp, sem confusão, só jogo.

<p>
  <a href="https://so-mais-um.com"><img src="https://img.shields.io/badge/▶_Ver_ao_vivo-so--mais--um.com-22C55E?style=for-the-badge&logo=vercel&logoColor=white" alt="Ao vivo"/></a>
  <a href="https://app.so-mais-um.com"><img src="https://img.shields.io/badge/Abrir_o_app-app.so--mais--um.com-3B82F6?style=for-the-badge&logo=googlechrome&logoColor=white" alt="App"/></a>
</p>

<p>
  <img src="https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD"/>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4"/>
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP"/>
  <img src="https://img.shields.io/badge/deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

<sub>🟢 <strong>Em produção</strong> &nbsp;•&nbsp; 🏟️ <strong>12</strong> modalidades esportivas &nbsp;•&nbsp; 🎬 animações scroll-driven &nbsp;•&nbsp; ⚡ deploy contínuo</sub>

<br/><br/>

![Landing Só+1 — a cena rolando](docs/screenshots/landing.webp)

<sub><i>A narrativa se revela conforme o scroll — capturado do site em produção.</i></sub>

</div>

---

## 🎯 O que é

Organizar uma partida hoje é uma sequência de mensagens perdidas: alguém pergunta "fecha 12?", três confirmam, dois somem na hora, o time é dividido no olho e ninguém lembra quem furou semana passada. O **Só+1** resolve isso num app — partidas abertas com vagas visíveis, entrada em um clique, sorteio automático de times e reputação por avaliação. Este repositório é a **landing**: a página que o visitante encontra antes de saber que o app existe.

O papel dela no funil é único e estreito — **transformar visitante em jogador cadastrado**. Ela não guarda dado e não tem formulário: comunica a proposta em segundos e entrega o clique para `app.so-mais-um.com`. Do backend ela lê uma coisa só, e somente no servidor — os números públicos de `GET /stats`, que alimentam a prova social. Toda conversão sai daqui por link — cadastro e login para jogadores, portal de parceiros para donos de quadra. São **11 seções** encadeadas numa narrativa `Descobrir → Entrar → Jogar`, fechando com o que ainda está por vir, cada uma com sua própria animação de entrada.

```mermaid
flowchart LR
    V["🔍 Visitante<br/>busca · social · indicação"] --> L

    L["<b>Landing · Next.js 16</b><br/>Navbar · Hero · Stats · Features<br/>App Preview · How It Works · Owner<br/>Courts · FAQ · CTA · Footer"]

    L -->|"Começar grátis · Criar conta"| R["/register"]
    L -->|"Entrar"| G["/login"]
    L -->|"Quero cadastrar meu espaço"| P["/seja-parceiro"]

    R --> APP
    G --> APP
    P --> APP

    APP["⚽ <b>app.so-mais-um.com</b><br/>o produto"]

    style L fill:#22C55E,stroke:#14532d,color:#fff
    style APP fill:#3B82F6,stroke:#1e3a8a,color:#fff
    style V fill:#1f2937,stroke:#4b5563,color:#fff
```

> A landing é uma **folha do funil**: sem banco e sem estado. HTML pré-renderizado e servido pelo CDN da Vercel — o único trabalho dela é não perder o visitante antes do clique. A única variável de ambiente é `API_URL` (padrão `https://api.so-mais-um.com`), usada no servidor para ler `GET /stats` com revalidação de 5 minutos; se a API não responder, a prova social simplesmente some e a página continua de pé.

---

## ✨ Destaques de engenharia

**Uma landing sem uma única imagem.** Não existe `<img>` nem `next/image` no projeto. As linhas de campo do Hero, da seção de modalidades e do CTA são **SVG inline animado por `stroke-dasharray` / `strokeDashoffset`** — o campo se desenha sozinho no viewport. O resto é ícone Lucide (SVG), gradiente CSS e emoji. Zero bitmap para baixar, zero LCP esperando arquivo de imagem, zero `next/image` para configurar.

**Duas estratégias de animação, um breakpoint.** No desktop (`min-width: 768px`) as seções entram com GSAP `ScrollTrigger`. No mobile (`max-width: 767px`) cada componente **desiste do ScrollTrigger** e delega para `useMobileScrollAnimation` — um hook próprio com `IntersectionObserver` que só liga classes CSS com stagger. Scroll-linked animation é caro em tela pequena; keyframes CSS disparados uma vez, não. Cada componente checa `matchMedia` e monta **só um** dos dois caminhos.

**`gsap.context()` e `revert()` em todo componente.** Cada seção embrulha suas tweens em `gsap.context(..., sectionRef)` e devolve `ctx.revert()` no cleanup do effect. Sob o StrictMode do React 19 — que invoca o effect duas vezes em dev — nenhuma tween órfã e nenhum ScrollTrigger duplicado sobrevive. Sem isso, a segunda montagem deixaria triggers vazando e animações disparando em dobro.

**O preview que só liga quando é visto.** A seção de preview do app cicla partidas (3200 ms) e notificações (2400 ms) para simular o produto ao vivo. Os `setInterval` **não começam no mount**: ficam atrás de uma flag `active` que só o `onEnter` do ScrollTrigger levanta. Quem nunca rolou até lá não paga por dois timers rodando numa seção invisível.

**Fonte resolvida no build, não no runtime.** `next/font/google` carrega a Inter com `subsets: ['latin']` e `display: 'swap'`, exposta como a CSS var `--font-inter`. O arquivo é self-hospedado no build — nenhuma request para o Google Fonts no carregamento, nenhum FOIT, e o subset corta o que o português não usa.

**O artefato que o CI testa é o artefato que vai pro ar.** O workflow não empurra o repositório para a Vercel rebuildar do outro lado: ele roda `vercel pull`, `vercel build --prod` e publica com **`vercel deploy --prebuilt`**. O build validado pelo lint no runner é literalmente o bundle servido em produção — sem "passou no CI, quebrou no deploy".

**Composição sem framework de UI.** Cada seção é um componente isolado em `components/landing/`, orquestrado por um `page.tsx` que não faz nada além de empilhar. `Button` e `Badge` são primitivos próprios no padrão shadcn/ui — **CVA** para variantes tipadas e `cn()` (`clsx` + `tailwind-merge`) para resolver conflito de classe, com `focus-visible:ring` no lugar por padrão. Nenhuma dependência de biblioteca de componentes.

---

## 🎬 Seções da landing

<table>
  <thead>
    <tr><th>Seção</th><th>O que comunica</th><th>Animação</th></tr>
  </thead>
  <tbody>
    <tr><td><code>Navbar</code></td><td>Âncoras e os CTAs de <em>Entrar</em> / <em>Começar grátis</em>; fica sólida com blur após 40px de scroll</td><td>GSAP na entrada</td></tr>
    <tr><td><code>Hero</code></td><td>Headline, subheadline e um card de partida real (vagas 8/12, horário, quadra, Pix)</td><td>Timeline GSAP + campo em SVG que se desenha</td></tr>
    <tr><td><code>Stats</code></td><td>Dois cartões fixos (modalidades, gratuidade) + até quatro vindos de <code>GET /stats</code>, cada um sumindo abaixo do seu limiar</td><td>Stagger no scroll</td></tr>
    <tr><td><code>Features</code></td><td>9 cards — descoberta, sorteio Fisher-Yates, avaliações, tempo real (SSE), torneios, perfil, rateio por Pix, presença confirmada, controle de conta e dados</td><td><code>autoAlpha</code> + stagger</td></tr>
    <tr><td><code>App Preview</code></td><td>Mock vivo do produto: lista de partidas e notificações que ciclam sozinhas</td><td>Entrada lateral + ciclagem ativada no viewport</td></tr>
    <tr><td><code>How It Works</code></td><td>3 passos: criar conta → achar ou criar partida → jogar e avaliar</td><td>Linha tracejada em SVG que se desenha ligando os passos</td></tr>
    <tr><td><code>Owner</code></td><td>O outro público: dono de quadra, com mock do painel de parceiro, os módulos de estoque e equipamentos e a nota da assinatura</td><td>Entrada lateral</td></tr>
    <tr><td><code>Courts</code></td><td><strong>12 modalidades</strong> — do futsal ao poker, cada card entrando de uma direção diferente</td><td>Direção por card + campo em SVG</td></tr>
    <tr><td><code>Roadmap</code></td><td><strong>O que ainda não existe</strong> — 5 trilhas com card aberto no board. Desenhada para <em>não</em> parecer a de funcionalidades: borda tracejada, paleta âmbar e status por cartão</td><td>Stagger no scroll</td></tr>
    <tr><td><code>FAQ</code></td><td>8 objeções tratadas antes do cadastro (é grátis? como sorteia? como pago? e meus dados?)</td><td>Accordion + stagger</td></tr>
    <tr><td><code>CTA</code></td><td>O fechamento: criar conta gratuita ou entrar</td><td>Reveal no scroll</td></tr>
    <tr><td><code>Footer</code></td><td>Links de plataforma, portal de parceiros e contato</td><td>—</td></tr>
  </tbody>
</table>

---

## 🛠️ Stack

<table>
  <tbody>
    <tr>
      <td><strong>Runtime</strong></td>
      <td><img src="https://img.shields.io/badge/Next.js_16.2-000000?style=flat-square&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React_19.2-61DAFB?style=flat-square&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/TypeScript_5.9-3178C6?style=flat-square&logo=typescript&logoColor=white"/> — App Router, <code>strict: true</code></td>
    </tr>
    <tr>
      <td><strong>Estilo</strong></td>
      <td><img src="https://img.shields.io/badge/Tailwind_CSS_4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/CVA-000000?style=flat-square"/> <img src="https://img.shields.io/badge/tailwind--merge-38BDF8?style=flat-square"/> — tema via <code>@theme</code>, primitivos no padrão shadcn/ui</td>
    </tr>
    <tr>
      <td><strong>Animação</strong></td>
      <td><img src="https://img.shields.io/badge/GSAP_3.15-88CE02?style=flat-square&logo=greensock&logoColor=black"/> <img src="https://img.shields.io/badge/ScrollTrigger-88CE02?style=flat-square"/> <img src="https://img.shields.io/badge/IntersectionObserver-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/> — desktop e mobile por caminhos separados</td>
    </tr>
    <tr>
      <td><strong>Assets</strong></td>
      <td><img src="https://img.shields.io/badge/next/font_·_Inter-000000?style=flat-square&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/Lucide_1.16-F56565?style=flat-square&logo=lucide&logoColor=white"/> <img src="https://img.shields.io/badge/SVG_inline-FFB13B?style=flat-square&logo=svg&logoColor=black"/> — nenhuma imagem raster</td>
    </tr>
    <tr>
      <td><strong>SEO</strong></td>
      <td><img src="https://img.shields.io/badge/Metadata_API-000000?style=flat-square&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/Open_Graph-1877F2?style=flat-square"/> — title, description, keywords, OG e <code>lang="pt-BR"</code> no <code>layout.tsx</code></td>
    </tr>
    <tr>
      <td><strong>Qualidade</strong></td>
      <td><img src="https://img.shields.io/badge/ESLint_9-4B32C3?style=flat-square&logo=eslint&logoColor=white"/> <img src="https://img.shields.io/badge/Vitest_4-6E9F18?style=flat-square&logo=vitest&logoColor=white"/> <img src="https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testinglibrary&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white"/> — lint + typecheck + teste + build a cada push e PR</td>
    </tr>
    <tr>
      <td><strong>Deploy</strong></td>
      <td><img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/> — <code>vercel deploy --prebuilt</code> pelo CI; <code>main</code> vai para produção, o resto para preview</td>
    </tr>
  </tbody>
</table>

---

## 🚀 Rodando localmente

### 1. Pré-requisitos

| Requisito | Versão | Por quê |
|---|---|---|
| **Node.js** | **≥ 20.9.0** | exigido pelo `next@16.2.6`. O CI roda **Node 24** — use 20.9+ e prefira 24 se quiser reproduzir o pipeline |
| **npm** | o que vem com o Node | o repo versiona `package-lock.json` |

Não há banco, Docker, serviço externo nem conta em nada. É uma página estática — se o Node sobe, ela sobe.

```bash
node -v   # precisa ser >= v20.9.0
```

### 2. Passo a passo

```bash
# 1. clone o repositório
git clone https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing.git
cd so-mais-um-landing

# 2. instale as dependências (ci = instalação limpa a partir do lockfile, igual ao pipeline)
npm ci
#    ou, se for mexer nas deps:
npm install

# 3. suba o servidor de desenvolvimento
npm run dev
```

Pronto — **http://localhost:3000**. Não há passo 4: sem migration, sem seed, sem `.env` para preencher.

### 3. Variáveis de ambiente

**Não existe nenhuma.** Isso não é um resumo — é o estado real do repositório:

- não há `.env`, `.env.example` nem `.env.local` no projeto (`.env*` está no `.gitignore` por herança do template do Next);
- `grep -rn "process.env\|NEXT_PUBLIC_" src/` não retorna **nada**;
- o `next.config.ts` está vazio, sem `env` nem `publicRuntimeConfig`;
- os únicos "endereços configuráveis" — `app.so-mais-um.com/login`, `/register`, `/seja-parceiro` — são links literais nos componentes.

A landing não autentica, não consulta API e não persiste nada, então não há segredo para vazar. Os únicos secrets do projeto vivem no GitHub Actions (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) e servem **só ao deploy** — nada disso é necessário para rodar local.

> Se um dia a landing ganhar formulário ou analytics, é aqui que a lista aparece. Até lá, qualquer `.env` que você criar é ignorado pelo código.

### 4. Endereços locais

| O que | URL | Sobe com |
|---|---|---|
| Landing (dev, com hot-reload) | `http://localhost:3000` | `npm run dev` |
| Landing (build de produção) | `http://localhost:3000` | `npm run build && npm start` |

A porta 3000 é o default do Next. Para trocar: `npm run dev -- -p 3001`.

### 5. Como verificar que subiu

Abra `http://localhost:3000` e confira, nesta ordem:

1. **O Hero anima sozinho** no load — as linhas do campo se desenham e o card "Society da Quinta" sobe. Se aparecer estático, o GSAP não montou: olhe o console.
2. **Role a página.** Cada seção entra com sua animação. Seção que fica em branco até você rolar até ela é **comportamento esperado** — os triggers são `once: true`.
3. **A navbar muda** de transparente para escura com blur depois de ~40px de scroll.
4. **A seção "Plataforma"** começa a ciclar partidas e notificações assim que entra no viewport (e só então).

Pelo terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000   # 200
curl -s http://localhost:3000 | grep -o "<title>.*</title>"      # título da landing no HTML pré-renderizado
```

O `grep` no `curl` é o teste que importa: se o `<title>` e o texto do Hero vêm no HTML **sem JavaScript**, o prerender está funcionando.

### 6. Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| `npm run dev` falha logo no start com erro de sintaxe/engine | Node abaixo de 20.9 | `node -v` e atualize — o `next@16` não roda em Node antigo |
| Porta 3000 ocupada | outro app do produto (ex.: o web) já está nela | `npm run dev -- -p 3001` |
| Redimensionei a janela de mobile para desktop e as animações sumiram / não voltam | o `matchMedia` é lido **uma vez no mount**; não há listener de resize | recarregue a página no tamanho que quer testar — é o trade-off da estratégia de dois caminhos |
| Seções abaixo da dobra parecem vazias | os reveals são `once: true` e disparam no scroll | role até elas; não é bug |
| `npm ci` reclama de lockfile fora de sincronia | `package.json` alterado sem regerar o lock | rode `npm install` e commite o `package-lock.json` |

### 7. Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento com hot-reload em `http://localhost:3000` |
| `npm run build` | build de produção — é o que o CI roda antes de deixar passar |
| `npm start` | serve o build de produção localmente (exige `build` antes) |
| `npm run lint` | ESLint 9 com `eslint-config-next` |
| `npm run typecheck` | `tsc --noEmit` — checa os tipos sem gerar arquivo |
| `npm test` | Roda a suíte uma vez e sai — é o que o CI executa |
| `npm run test:watch` | Modo interativo: reexecuta só o que você mexeu |
| `npm run test:coverage` | Suíte + relatório em `coverage/index.html` |

> O CI roda, nesta ordem, `lint` → `typecheck` → `test` → `build`. Qualquer um vermelho barra o merge.

---

## 🧪 Testes

**Vitest + Testing Library + jsdom**, configurados em `vitest.config.mts`.

Diferente do [app web](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-web), aqui **não existe um `vite.config` para o Vitest reaproveitar** — a landing é Next.js, e o build é dele. Então a configuração de teste é própria, seguindo o guia oficial do Next (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`):

- `vite-tsconfig-paths` para o alias `@/*` continuar valendo dentro do teste
- `.mts` na extensão, porque o `package.json` não declara `"type": "module"`

### Onde o teste mora

Ao lado do componente, com sufixo `.test.tsx`:

```
src/components/landing/FAQSection.tsx  →  src/components/landing/FAQSection.test.tsx
```

`src/test/setup.ts` roda antes de cada arquivo: matchers do jest-dom, stub de `matchMedia` e de `IntersectionObserver`, e limpeza do DOM.

### O GSAP fica de fora dos testes

Não é preguiça, é necessidade. As seções entram com `autoAlpha`, que é opacidade **mais** `visibility`. Sem scroll — e não existe scroll no jsdom — o ScrollTrigger nunca dispara, tudo fica em `visibility: hidden`, e o que está escondido assim **some da árvore de acessibilidade**: `getByRole` deixa de achar os elementos.

Por isso os testes mockam o `gsap`, deixando o componente renderizar o estado final. O `onComplete` do dublê é chamado na hora, porque há comportamento que só vira estado quando a animação termina.

### O que já está coberto

| Comportamento | Onde |
|---|---|
| Acessibilidade do FAQ | `components/landing/FAQSection.test.tsx` |

São 18 testes sobre o que a revisão visual não pega: `inert` no bloco fechado, `aria-expanded` acompanhando o estado, o vínculo `aria-controls` ↔ `id` ↔ `aria-labelledby`, navegação por Tab, Enter e Espaço, o texto das respostas seguindo no HTML para o buscador — e as três promessas que a #64 tirou de lá, que só um teste sobre o conteúdo pega.

Foi o que motivou a suíte existir: são atributos que ninguém percebe quebrando — a tela continua idêntica, a animação continua funcionando, e só quem usa leitor de tela descobre.

**Sem meta de porcentagem.** O critério é cobrir o que dói quando quebra.

---

## 🌿 Fluxo & deploy

`main` (produção · [so-mais-um.com](https://so-mais-um.com)) ← `develop` ← `feature/*` · `fix/*`

O workflow `ci-cd.yml` roda em push e PR para `main` e `develop`: **Lint & Build** primeiro; só depois, e só em push, o job de deploy faz `vercel pull` → `vercel build` → `vercel deploy --prebuilt`. Push em `main` publica em produção; qualquer outro push vira preview. Commits em Conventional Commits (pt-BR).

---

## 🧭 Como a equipe trabalha

Áreas e responsabilidades, ritmo de sprint, fluxo de issue até deploy, Definition of Ready e Definition of Done: **[manual da equipe](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-api/blob/main/docs/EQUIPE.md)** — vale para os três repositórios do Só+1.

---

<div align="center">
<sub>Parte do produto <strong>Só+1</strong> · <a href="https://app.so-mais-um.com">app</a> · <a href="https://github.com/mateus-vitor-ferreira-dev/so-mais-um-web">repo do web app</a></sub>
</div>

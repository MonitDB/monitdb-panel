# monitdb-panel

Frontend do **MonitDB** — plataforma de observabilidade para SQL Server com assistente de IA.
É o painel web do DBA: dashboards em tempo real, análise histórica (19+ métricas), states,
alertas, relatórios, integrações, o chat **Monit AI**, a vigilância proativa (insights, regressão
de plano, anomalias) e as ferramentas de operação da 2.2 — **Terminal SSH**, **Arquivos (SFTP)** e
**Desktop remoto (RDP/VNC)** — além de toda a área de **Configurações**.

Faz parte do repositório umbrella `monitdbqua` (é um submódulo git). Toda a leitura de dados e ações
passam pela API [`monit-db-api`](../monit-db-api). Visão de produto em [`../README.md`](../README.md).

## Stack

- **Next.js 12** (**Pages Router**) + **React 17**
- **Ant Design 5** (AntD)
- **Zustand** (chat, config de IA, treino) + **React Context** (user, global, alerts, events)
- **ApexCharts** (gráficos das métricas)
- Tempo real: **SSE** (`/events`) com reconexão exponencial + **Socket.IO**
- Libs da 2.2: **xterm** / **xterm-addon-fit** (terminal), **guacamole-common-js** (canvas do
  desktop remoto — bundle estático em `public/`)
- ESLint + Prettier (pre-commit)

## Autenticação e permissões

- Token JWT em **cookie** + header **`x-api-key`** em toda requisição (`utils/client-api.js`).
- Permissões avaliadas **no cliente** (`utils/hasPermission.js`) sobre os *grants* do usuário —
  reforçadas no servidor pela API (RBAC). A UI esconde/mostra recursos; a API é a fonte de verdade.

## Estrutura de pastas

```
monitdb-panel/
├── pages/                 # rotas (Pages Router) — ver tabelas abaixo
│   └── configurations/    # área de administração
├── components/            # UI por feature (inclui monit AI/chat)
├── contexts/              # React Context (user, global, alerts, events/SSE)
├── store/                 # Zustand (chat, config IA, treino)
├── utils/                 # client-api, apiV2, hasPermission…
├── public/                # assets estáticos (inclui bundle guacamole-common-js)
└── next.config.js         # injeta as envs públicas no bundle
```

## Como rodar

### Desenvolvimento

```bash
npm install
npm run dev      # dotenv -e .env.development next dev → http://localhost:3000
npm run lint
```

### Docker

```bash
cd monitdb-panel
docker compose up -d   # webapp (porta 3000)
```

> ⚠️ **O host de produção não tem Node** — o build do painel roda **dentro da imagem** Docker. No
> deploy use `COPY --chown` e **nunca** `chown -R` (trava o disco apertado do host); **nunca** rode
> `docker volume prune`. Build/recreate, checkpoint e rollback em
> [`../docs/guia-deploy-operacao.md`](../docs/guia-deploy-operacao.md#4-build-e-deploy-de-mudanças-host-sem-node).

### Variáveis de ambiente principais

Injetadas no bundle por `next.config.js`: `siteUrl`, `apiV2` (API :3002), `socket` (:3003),
`apiBaseUrl` (legado), `apiLocalLLM`, `localLLMCollectionName`, `apiKey`, `gtmId`. **Lista completa**
em [`../docs/guia-deploy-operacao.md`](../docs/guia-deploy-operacao.md#2-variáveis-de-ambiente) — não
duplicar aqui.

## Páginas

| Rota | Função |
|---|---|
| `/` | Login |
| `/dashboard/[id]` | Status por servidor, CPU/mem/disco, Who is Active (KILL), query window |
| `/analysis` | Gráficos históricos (19+ métricas), sessões, profiling, plano de execução |
| `/states` | Versões, jobs do SQL Agent, backups, disco, capacity planning |
| `/alerts` | Gestão e filtragem de alertas |
| `/reports` | Relatórios por banco / tipo de servidor |
| `/integrations` | Integrações (Zabbix/Rundeck) |
| `/monit-ai/[chat-id]` | Chat Monit AI (streaming, citações, tokens/custo) |
| `/insights` | Insights proativos diários por servidor |
| `/anomalies` | Anomalias por baseline |
| `/plan-regressions` | Regressão de plano de execução |
| `/terminal` | **Terminal SSH** (xterm.js) |
| `/sftp` | **Arquivos** (SFTP: navegar/baixar/enviar/remover) |
| `/remote` | **Desktop remoto** RDP/VNC (canvas Guacamole) |

### Configurações (`/configurations/*`)

`servers`, `users`, `profiles`, `components`, `display-settings`, `installation-wizard`,
`integrations`, `logs`, `monit-ai-config`, `monit-ai-secrets`, `monit-ai-skills`,
`monit-ai-training`, `webhooks`, `data-masking`, `ssh-hosts`, `ssh-audit`, `remote-hosts`,
`remote-audit`, `update-new-version`.

## Integrações (com quem fala)

- **monit-db-api** (:3002 HTTP/SSE, :3003 Socket.IO) — toda leitura/escrita, autenticada com
  Bearer + `x-api-key`. Clientes em `utils/` (`apiV2`, `clientApi` legado).
- **llm-local** (opcional) — chat com LLM 100% local (`apiLocalLLM`).
- **API `/guac-ws`** (:3002) e namespace **`/ssh`** (:3003) — canais das telas de Desktop e Terminal.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`../docs/arquitetura.md`](../docs/arquitetura.md) | Componentes, fluxo de dados, frontend e tempo real |
| [`../docs/funcionalidades.md`](../docs/funcionalidades.md) | O que cada componente faz hoje |
| [`../docs/guia-deploy-operacao.md`](../docs/guia-deploy-operacao.md) | Deploy, env, operação, troubleshooting |
| [`../docs/terminal-ssh.md`](../docs/terminal-ssh.md) | Terminal SSH e SFTP (2.2) |
| [`../docs/remote-desktop.md`](../docs/remote-desktop.md) | Desktop remoto RDP/VNC (2.2) |
| [`../docs/api-e-modelo-de-dados.md`](../docs/api-e-modelo-de-dados.md) | Endpoints consumidos pelo painel |

# 🚀 MEGAMANIA 8-Bit — Shmup Espacial Retro

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/tech-VanillaJS-yellow.svg)
![HTML5 Canvas](https://img.shields.io/badge/tech-HTML5%20Canvas-red.svg)
![Web Audio API](https://img.shields.io/badge/audio-Procedural-green.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg)

Uma releitura moderna e retrô de **8-bit** do clássico shooter espacial no estilo *Megamania*. O jogo roda nativamente em qualquer navegador moderno sem a necessidade de dependências ou frameworks externos, oferecendo suporte fluido tanto para **Desktop** quanto para dispositivos **Mobile**.

---

## 🌟 Destaques & Recursos Arquiteturais

- **Zero Dependências Runtime:** Desenvolvido em Vanilla JS puro e HTML5 Canvas 2D para máxima performance e portabilidade.
- **Áudio Procedural:** Todos os efeitos sonoros (disparos, explosões, vinhetas de vitória) são sintetizados em tempo real via **Web Audio API** sem carregar arquivos mp3/wav externos.
- **Gráficos Pixel-Art Procedurais:** Sprites renderizados via matrizes de pixels com escalonamento preservado (`crisp-edges` / `pixelated`).
- **Game Loop 60 FPS:** Lógica de atualização com passo fixo e tratamento de variação de frame rate (`requestAnimationFrame` + *accumulator*).
- **Suporte Híbrido (Desktop + Mobile):**
  - **Desktop:** Controles via teclado (setas/WASD e barra de espaço).
  - **Mobile/Touch:** Botões de controle em tela + suporte a *drag and move* com disparos automáticos.
- **Progressão de Fases:** Variedade de ondas de inimigos (Hambúrgueres, Bolachas, Ferros, Gravatas, Diamantes) com aumento progressivo de velocidade e agressividade.
- **Sistema de Energia:** Mecânica de consumo contínuo de combustível por fase.
- **PWA (Progressive Web App):** Acompanha `manifest.json` para ser instalado na tela inicial em dispositivos móveis.

---

## 🛠️ Estrutura do Repositório

```text
├── index.html        # Estrutura do gabinete retro, marcação HUD e overlay
├── style.css         # Estilização arcade, layout flexbox/grid responsivo e temas
├── game.js           # Engine do jogo (Renderer, Physics, SFX, Game Loop, Eventos)
├── manifest.json     # Metadados de configuração PWA
├── package.json      # Configuração de scripts e metadados de publicação
├── .gitignore        # Regras de exclusão Git para ambiente limpo e seguro
└── .env.example      # Template de variáveis de ambiente (Boas práticas DevOps)
```

---

## 🕹️ Controles

### 💻 Desktop
- **Mover para Esquerda:** `←` (Seta Esquerda) ou `A`
- **Mover para Direita:** `→` (Seta Direita) ou `D`
- **Atirar / Iniciar:** `Espaço` ou `Enter`

### 📱 Dispositivos Móveis
- **Botões virtuais:** `◀` (Esquerda), `▶` (Direita) e `● FIRE` (Atirar)
- **Modo Arrastar:** Toque e arraste o caça na tela canvas.

---

## 🚀 Como Executar Localmente

### Opção 1: Execução Direta
Basta abrir o arquivo [`index.html`](file:///c:/Users/37577044873/Documents/ATG%202613/06%20Jogo/index.html) diretamente em qualquer navegador moderno.

### Opção 2: Servidor Local via Node.js / NPX
Caso possua o Node.js instalado no seu ambiente:

```bash
# Iniciar servidor estático rápido
npm start
# ou
npx serve .
```

Acesse no navegador: `http://localhost:3000`

---

## 🔐 Segurança e Boas Práticas DevOps

- **Auditoria de Código:** Nenhuma API Key, token ou dado sensível foi exposto no código-fonte.
- **Configuração Git:** Arquivo `.gitignore` configurado para impedir inclusão acidental de `.env`, `node_modules`, logs e arquivos temporários.
- **Env Template:** O arquivo `.env.example` serve de base para futuras integrações ou configurações de ambiente.

---

## 🌐 Publicação no GitHub

Este repositório está conectado ao seguinte ambiente remoto no GitHub:
- **Repositório:** [https://github.com/ofcrldesign-cpu/quelstudiomulher.git](https://github.com/ofcrldesign-cpu/quelstudiomulher.git)
- **Desenvolvedor:** [@ofcrldesign-cpu](https://github.com/ofcrldesign-cpu)

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Sinta-se livre para estudar, modificar e distribuir.

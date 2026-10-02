# Quel Studio — Mulher Ativa 🌸✨

[![GitHub Repository](https://img.shields.io/badge/GitHub-quelstudiomulher-181717?style=for-the-badge&logo=github)](https://github.com/ofcrldesign-cpu/quelstudiomulher)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](#licença)

Site institucional moderno, responsivo e exclusivo desenvolvido para o **Quel Studio — Mulher Ativa**, localizado na Vila Ema, São Paulo — SP.

Construído utilizando exclusivamente **HTML5, CSS3 e JavaScript Vanilla** (sem React, Node ou dependências de backend), seguindo rigorosamente as diretrizes de design de alta conversão, acessibilidade (WCAG) e SEO.

---

## 🔗 Repositório Oficial

- **URL:** [https://github.com/ofcrldesign-cpu/quelstudiomulher](https://github.com/ofcrldesign-cpu/quelstudiomulher)
- **Desenvolvedor / Organização:** `@ofcrldesign-cpu`

---

## 🎨 Identidade Visual & Design System

- **Logotipo Oficial:** Integrado com alta definição em formato transparente (`assets/images/logotipo-novo.png`).
- **Paleta de Cores Inspirada na Marca e Instagram:**
  - *Bordô / Vermelho Rubi:* `#b31b34`
  - *Terracota Acolhedor:* `#c4624d`
  - *Dourado Floral:* `#c59346`
  - *Fundo Acolhedor (Bege Rosado):* `#fcf8f5`
  - *Café Expresso Elegante (Tipografia):* `#251712`
  - *Gradiente Instagram:* Fusão fluida entre roxo, rosa vibrante, laranja e dourado (`#833ab4` ➔ `#e1306c` ➔ `#fd1d1d` ➔ `#fcb045`).
- **Tipografia:** Google Fonts (`Plus Jakarta Sans` para clareza e modernidade, e `Outfit` para títulos expressivos).

---

## 🚀 Funcionalidades Principais Implementadas

### 1. Sessões Animadas das Modalidades (Serviços)
- **10 Modalidades Oficiais:** Funcional, JUMP, Step, GAP, HIIT, RitBox, Yoga, Pilates Solo, Alongamento e Baby Class.
- **Filtros Interativos:** Filtre por *Todas*, *Cardio & Energia*, *Força & Tonificação*, *Corpo & Mente* ou *Infantil*.
- **Cards com Micro-Animações:** Efeitos de elevação, ícones flutuantes e tags de intensidade.
- **Modal Interativo de Detalhes:** Permite conhecer a proposta de cada treino e agendar aula experimental com mensagem pré-configurada para aquela modalidade específica.

### 2. Formulário Inteligente com Compilação para WhatsApp
- Campos com máscara automática de telefone: `(00) 00000-0000`.
- Compila os dados (Nome, WhatsApp, Modalidade de Interesse, Melhor Período e Mensagem) em uma mensagem estruturada com emojis.
- Redireciona diretamente para o WhatsApp oficial do Studio: `(11) 91560-6194`.

### 3. Animações de Scroll & Lazy Loading
- **IntersectionObserver nativo:** Animações suaves de entrada (`fade-up`, `fade-left`, `fade-right`, `fade-in`) com suporte a delays escalonados.
- **Lazy Loading de Imagens:** Carregamento progressivo com efeito suave de *blur-up* para máxima performance de Core Web Vitals.
- **Contadores Numéricos Animados:** Números como `5.0` estrelas e `38+` avaliações animam suavemente quando entram no campo de visão.

### 4. Localização, Google Maps & Horário em Tempo Real
- **Google Maps Incorporado:** Mapa interativo apontando para *Rua Francisco José da Cruz, 46 - Vila Ema, São Paulo - SP*.
- **Rotas Rápidas:** Botão para abrir direções no app do Google Maps e botão para copiar endereço com aviso via Toast.
- **Status Aberto / Fechado em Tempo Real:** Identifica o dia da semana e hora de São Paulo para indicar se o studio está aberto ou fechado no momento.

### 5. Botão Voltar ao Topo com Indicador de Progresso Circular
- Botão flutuante que surge após 350px de rolagem.
- Anel circular em SVG que preenche dinamicamente acompanhando a porcentagem exata de rolagem da página.
- Rola suavemente ao topo ao ser acionado.

### 6. Seções Especiais e Depoimentos
- **Seção Terceira Idade:** Destaque para o plano acessível a partir de R$ 89,90, atenção humanizada e depoimentos.
- **Para Quem É o Studio:** 5 perfis (Iniciantes, Retorno, Variedade, 3ª Idade e Baby Class infantil).
- **Depoimentos Reais do Google:** Claudia Marinho, Sueli Jacondino, Edy Miranda, Camila Cavalcanti, Sandra Regina Carbone e Bruna Verdú.
- **Planos Transparentes:** Destaques dos valores a partir de R$ 89,90 e R$ 149,50 com CTAs diretos.
- **FAQ Interativo:** Sanfona acessível com as dúvidas frequentes das alunas.
- **Botão Flutuante Permanente do WhatsApp:** Com efeito pulsante no canto inferior.

---

## 📁 Estrutura de Arquivos

```text
05 quel studio/
├── index.html               # Estrutura HTML5 semântica e acessível
├── css/
│   └── style.css            # Estilização completa com CSS Variables e Design System
├── js/
│   └── script.js            # Lógica Vanilla JS para animações e integração WhatsApp
├── assets/
│   └── images/              # Imagens otimizadas e logotipos
├── .env.example             # Modelo de variáveis de ambiente para futuras expansões
├── .gitignore               # Regras de exclusão para o Git
└── README.md                # Documentação técnica do projeto
```

---

## 🌐 Como Executar Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/ofcrldesign-cpu/quelstudiomulher.git
   cd quelstudiomulher
   ```

2. **Abrir no Navegador:**
   - Dê um duplo clique no arquivo `index.html`, ou
   - Utilize uma extensão como *Live Server* no VS Code / Antigravity IDE, ou
   - Execute um servidor HTTP local simples:
     ```bash
     python -m http.server 8000
     ```
     E acesse: `http://localhost:8000`.

---

## 🔒 Segurança e Boas Práticas

- Nenhum dado confidencial ou chave de API privada encontra-se hardcoded no repositório.
- Estrutura pronta para deploy imediato no **GitHub Pages**, Vercel, Netlify ou servidor HTTP/HTTPS estático.

---

## 📝 Licença

Este projeto é protegido e exclusivo para o **Quel Studio — Mulher Ativa**.

Desenvolvido por **[ofcrldesign-cpu](https://github.com/ofcrldesign-cpu)**.

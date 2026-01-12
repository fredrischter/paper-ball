# Bola de Papel (Paper Ball Game)

Um jogo divertido onde você controla a força e direção de uma mão que joga uma bola de papel no lixo. O cenário é um escritório com uma lixeira e um ventilador que gira, alterando a direção da bolinha e tornando mais difícil acertar.

## 🎮 Como Jogar

1. **Arraste** o mouse ou dedo na tela para ajustar a força e direção do lançamento
2. **Solte** para jogar a bola de papel
3. Acerte a lixeira para ganhar pontos
4. Cuidado com o ventilador que muda de direção e pode desviar sua bola!

## 🚀 Tecnologias

- HTML5 Canvas
- JavaScript Vanilla
- CSS3
- Física personalizada para simulação realista

## 📱 Multiplataforma

Este jogo foi desenvolvido em HTML5 puro e funciona em:

- ✅ **Web** - Qualquer navegador moderno
- ✅ **Mobile** - Android e iOS via browser
- ✅ **PWA** - Pode ser instalado como app
- 🔄 **Capacitor/Cordova** - Pode ser empacotado como app nativo

## 🛠️ Como Executar

### Opção 1: Abrir direto no navegador
Simplesmente abra o arquivo `index.html` em qualquer navegador moderno.

### Opção 2: Servidor local (recomendado para desenvolvimento)

```bash
# Instalar dependências (apenas http-server para desenvolvimento)
npm install -g http-server

# Iniciar servidor local
npm start
```

O jogo abrirá automaticamente em `http://localhost:8080`

### Opção 3: Qualquer servidor HTTP
Sirva os arquivos com qualquer servidor HTTP:

```bash
# Python 3
python -m http.server 8080

# Node.js
npx http-server . -p 8080
```

## 📦 Estrutura do Projeto

```
paper-ball/
├── index.html      # Página principal
├── style.css       # Estilos do jogo
├── game.js         # Lógica do jogo e física
├── package.json    # Configuração do projeto
└── README.md       # Este arquivo
```

## 🎯 Recursos Implementados

- ✅ Controle de força e direção por arrasto (drag)
- ✅ Física realista com gravidade
- ✅ Ventilador rotativo com efeito de vento
- ✅ Sistema de pontuação
- ✅ Interface responsiva para mobile e desktop
- ✅ Gráficos desenhados com Canvas
- ✅ Indicador visual de força do lançamento
- ✅ Animações suaves

## 📱 Deploy para Mobile

### Android/iOS com Capacitor

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Adicionar plataformas
npx cap add android
npx cap add ios

# Copiar arquivos web
npx cap copy

# Abrir no Android Studio ou Xcode
npx cap open android
npx cap open ios
```

## 🎨 Próximas Melhorias

- [ ] Sons e efeitos sonoros
- [ ] Múltiplos níveis de dificuldade
- [ ] Power-ups e obstáculos adicionais
- [ ] Placar de recordes
- [ ] Modo multiplayer
- [ ] Diferentes tipos de papel e lixeiras

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!

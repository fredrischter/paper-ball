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

### Automated Build with GitHub Actions

Este projeto possui um workflow do GitHub Actions que automaticamente compila a versão Android da aplicação. O workflow é executado:
- Em cada push para os branches `main` ou `master`
- Em cada Pull Request (apenas APK debug)
- Manualmente através do GitHub Actions (workflow_dispatch)

Os arquivos APK gerados ficam disponíveis como artefatos do workflow e podem ser baixados por 30 dias.

Para disparar manualmente o build:
1. Vá até a aba "Actions" no repositório GitHub
2. Selecione o workflow "Android Build"
3. Clique em "Run workflow"
4. Após a conclusão, baixe os APKs na seção "Artifacts"

#### Configurar APK Assinado para Google Play Store

Para gerar APKs assinados que podem ser enviados para a Google Play Store, configure os seguintes secrets no GitHub:

1. **Gerar um keystore** (se ainda não tiver):
```bash
keytool -genkey -v -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Converter keystore para Base64**:
```bash
# Linux/Mac
base64 release.keystore | tr -d '\n' > keystore.base64.txt

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Out-File -Encoding ASCII keystore.base64.txt
```

3. **Adicionar secrets no GitHub**:
   - Vá em Settings → Secrets and variables → Actions → New repository secret
   - Adicione os seguintes secrets:
     - `KEYSTORE_BASE64`: Conteúdo do arquivo keystore.base64.txt
     - `KEYSTORE_PASSWORD`: Senha do keystore
     - `KEY_ALIAS`: Alias da chave (ex: my-key-alias)
     - `KEY_PASSWORD`: Senha da chave

Após configurar os secrets, o workflow automaticamente gerará APKs assinados em builds dos branches main/master. O APK assinado estará disponível como artefato "paper-ball-release-signed".

**⚠️ Importante:** Nunca commite o arquivo keystore no repositório. Mantenha-o seguro e faça backup!

### Build Local - Android/iOS com Capacitor

```bash
# Instalar dependências
npm install

# Adicionar plataforma Android (primeira vez)
npx cap add android

# Compilar web assets e sincronizar
npm run build
npx cap sync android

# Build do APK Debug
npm run android:build-debug

# Build do APK Release
npm run android:build-release

# Ou abrir no Android Studio para build manual
npx cap open android
```

**Nota para usuários Windows:** O comando `./gradlew` pode não funcionar corretamente no prompt de comando do Windows. Recomendamos usar o GitHub Actions workflow para builds automáticos ou abrir o projeto no Android Studio (`npx cap open android`) e compilar através da IDE.

### iOS

```bash
# Instalar dependências
npm install

# Adicionar plataforma iOS (primeira vez, requer macOS)
npx cap add ios

# Compilar web assets e sincronizar
npm run build
npx cap sync ios

# Abrir no Xcode
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

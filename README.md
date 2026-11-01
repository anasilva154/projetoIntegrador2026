# Aplicativo Mobile - Projeto Integrador SENAC 2026 📱🎓

**Curso Técnico em Desenvolvimento de Sistemas / Programação**  
**Instituição:** SENAC (Serviço Nacional de Aprendizagem Comercial)

---

## 📌 Sobre o Projeto

Este repositório contém a **base do aplicativo mobile** desenvolvido em **React Native** com **Expo** e **TypeScript**.

Todos os projetos das equipes partem desta mesma base compartilhada de código e estrutura, porém **cada equipe desenvolverá um tema/nicho diferente** e terá total autonomia para criar suas próprias interfaces, navegação, componentes e regras de negócio.

---

## 👥 Organização das Equipes e Fluxo de Trabalho (Fork)

O backend e o banco de dados são gerenciados centralmente pelo professor e já se encontram hospedados em produção. As equipes têm acesso exclusivo ao código do aplicativo através do modelo de **Fork**.

```
  [ Repositório Base - Aplicativo ] (Professor)
                │
   ┌────────────┼────────────┐ (Forks de cada equipe)
   ▼            ▼            ▼
[Fork Equipe 1] [...]  [Fork Equipe 7]
 (Tema: X)              (Tema: Y)
```

### 📋 Diretrizes para a Equipe:
1. **Fork do Projeto:** O gestor ou um membro representante da equipe deve criar um **Fork** deste repositório na sua conta do GitHub/GitLab.
2. **Gerenciamento de Membros:** O gestor da equipe deve adicionar os demais integrantes como colaboradores do fork.
3. **Autonomia:** A equipe pode criar suas próprias branches, issues, quadros Kanban e convenções internas de commits.


---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de possuir em seu computador:
- [Node.js](https://nodejs.org/) (Versão LTS 18 ou superior instalada)
- [Git](https://git-scm.com/) instalado e configurado
- [Expo Go](https://expo.dev/go) instalado no seu celular (disponível na Google Play Store e Apple App Store) **OU** emulador configurado (Android Studio / Xcode).

---

## 🚀 Como Iniciar o Projeto (Passo a Passo)

### 1. Clonar o Fork da sua Equipe
```bash
git clone https://github.com/SEU-USUARIO-OU-EQUIPE/NOME-DO-FORK.git
cd NOME-DO-FORK
```

### 2. Instalar as Dependências
Execute o comando abaixo dentro da pasta do projeto:
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente (`.env`)
Copie o arquivo `.env.exemplo` para criar o seu `.env`:

- **No Windows (PowerShell):**
  ```powershell
  Copy-Item .env.exemplo .env
  ```
- **No Linux / macOS / Bash:**
  ```bash
  cp .env.exemplo .env
  ```

Abra o arquivo `.env` gerado e preencha com as credenciais da sua equipe:
```env
# URL oficial da API do servidor SENAC
EXPO_PUBLIC_API_URL=https://senac.pizzarapida.net/api

# Substitua pelo Token fornecido pelo professor ao gestor da sua equipe
EXPO_PUBLIC_API_TOKEN=seu_token_fornecido_pelo_professor
```

> ⚠️ **IMPORTANTE:** Nunca compartilhe nem comite o arquivo `.env` com chaves reais no Git! Ele já está listado no `.gitignore`.

---

### 4. Executar o Aplicativo

Inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```
*(ou simplesmente `npm start`)*

---

### 5. Abrir e Testar a Aplicação

Assim que o comando for executado, um **QR Code** e um menu interativo aparecerão no terminal:

- 📱 **No Celular Físico (Recomendado):**
  - Abra o aplicativo **Expo Go** no Android e selecione *"Scan QR Code"* (ou use a câmera no iOS) e aponte para o QR Code no terminal.
  - *Dica:* Certifique-se de que o computador e o celular estejam conectados na **mesma rede Wi-Fi**.
- 🤖 **No Emulador Android:** Pressione a tecla `a` no terminal.
- 🍏 **No Simulador iOS (macOS):** Pressione a tecla `i` no terminal.
- 🌐 **No Navegador Web:** Pressione a tecla `w` no terminal.

---

## 📂 Estrutura de Pastas

```
📁 Aplicativo/
├── 📁 app/                     # Rotas e Telas (Expo Router - baseado em arquivos)
│   ├── (tabs)/                # Navegação por abas inferiores
│   │   ├── index.tsx          # Tela inicial
│   │   ├── explore.tsx        # Tela de exploração
│   │   └── _layout.tsx        # Layout das abas
│   ├── _layout.tsx            # Layout raiz da aplicação
│   ├── 📁 components/         # Componentes visuais reutilizáveis
│   └── 📁 rotaServidor/       # Serviços de integração com a API Backend
│       ├── api.ts             # Cliente HTTP com fetch e suporte a Bearer Token
│       ├── produtos.tsx       # CRUD de Produtos
│       └── user.tsx           # CRUD de Usuários
│
├── 📁 assets/                  # Imagens, ícones e fontes
├── .env.exemplo               # Modelo de variáveis de ambiente
├── .env                       # Suas variáveis locais (não comitar)
├── app.json                   # Configurações do Expo (nome do app, ícones, slug)
├── package.json               # Dependências e scripts
└── tsconfig.json              # Configurações do TypeScript
```

---

## 💡 Dicas de Sucesso para a Equipe

1. **Personalização:** Atualize o `app.json` com o nome da sua aplicação e o nome da sua equipe.
2. **Design e Usabilidade:** Utilize componentes modernos, boas cores e tipografia clara para valorizar a apresentação do projeto integrador.
3. **Divisão de Tarefas:** Dividam as telas e componentes entre os membros da equipe para que todos participem ativamente do desenvolvimento.

---

## 📜 Licença

Projeto desenvolvido para fins educacionais no **SENAC (2026)**.

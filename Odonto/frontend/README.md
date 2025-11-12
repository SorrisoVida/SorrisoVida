# Sorriso Vida - Frontend

Este é o frontend da aplicação Sorriso Vida, desenvolvido com **Angular**. Ele fornece a interface de usuário para pacientes, atendentes, dentistas e administradores interagirem com o sistema da clínica.

## ✨ Funcionalidades

- Login e registro de usuários.
- Agendamento de consultas.
- Visualização de horários e profissionais.
- Painéis de controle baseados no perfil do usuário (paciente, atendente, dentista, admin).
- Gerenciamento de usuários e agendamentos (para perfis autorizados).

## 🚀 Tecnologias Utilizadas

- **Angular**: Framework principal para a construção da SPA (Single Page Application).
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **RxJS**: Para programação reativa e gerenciamento de estados e eventos assíncronos.
- **Angular Material / Bootstrap**: Componentes de UI para uma interface moderna e responsiva.
- **SCSS**: Pré-processador de CSS.

## ⚙️ Configuração do Ambiente

1.  **Instale as dependências:**
    Navegue até a pasta `Odonto/frontend` e execute:
    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    Execute o comando abaixo para iniciar a aplicação. O servidor de desenvolvimento do Angular irá recarregar automaticamente a página sempre que houver alterações nos arquivos.
    ```bash
    ng serve
    ```
    ou
    ```bash
    npm start
    ```
    A aplicação estará disponível em `http://localhost:4200/`.

    > **Nota:** O projeto está configurado com um proxy (`proxy.conf.json`) que redireciona as chamadas de API (`/api`) para o backend (por padrão, `http://localhost:3000`). Certifique-se de que o servidor backend esteja em execução.

## 📦 Build para Produção

Para gerar os arquivos otimizados para produção, execute o seguinte comando:
```bash
ng build --configuration=production
```
Os arquivos do build serão gerados no diretório `dist/frontend/browser`.
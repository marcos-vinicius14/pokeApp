# Pokédex App com Ionic e Angular

Uma Pokédex moderna e interativa construída com Ionic e Angular, utilizando os serviços da PokeAPI e enriquecida com IA generativa da API do Gemini.

### Abordagem e Estilo de Codificação

Optei por uma arquitetura moderna e escalável utilizando os novos componentes **Standalone** do Angular para um melhor encapsulamento e menor acoplamento. A lógica de negócio, como as chamadas à API e o gerenciamento de favoritos, foi abstraída em serviços dedicados, mantendo os componentes focados exclusivamente na apresentação. Para o gerenciamento de estado reativo, utilizei **Angular Signals** na lista principal, garantindo atualizações de UI eficientes e performáticas. O código segue as melhores práticas de tipagem forte do TypeScript, eliminando o uso de `any` para garantir a segurança e a manutenibilidade.

### Padrões de Design Adotados

O projeto foi fortemente baseado no padrão de **Injeção de Dependência (DI)**, um pilar do Angular, para desacoplar as classes e facilitar os testes. O **Padrão de Serviço** foi utilizado para centralizar e reutilizar a lógica de acesso a dados e de negócio em toda a aplicação. Adicionalmente, o **Padrão Observer**, através do RxJS, foi empregado para lidar com os fluxos de dados assíncronos provenientes das chamadas HTTP.

---

### Principais Funcionalidades

* **Listagem Infinita:** Navegue por uma lista de Pokémon que carrega mais itens conforme você rola a página.
* **Detalhes Completos:** Veja informações detalhadas de cada Pokémon, incluindo estatísticas, habilidades e tipos.
* **Sistema de Favoritos:** Marque seus Pokémon preferidos e veja-os em uma lista separada.
* **Pokédex com IA (Gemini):** Gere descrições criativas e únicas para cada Pokémon, como se fossem escritas por um Professor Pokémon.

### Tecnologias Utilizadas

* Ionic 8
* Angular 19 (Standalone Components & Signals)
* TypeScript
* SCSS
* RxJS
* Gemini API

---

### Como Executar o Projeto

#### Execução Local

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    ionic serve
    ```

A aplicação estará disponível em `http://localhost:8100`.

#### Executando com Docker (Futuramente)

Um `Dockerfile` será disponibilizado para facilitar a criação de um ambiente conteinerizado para a aplicação.

1.  **Construa a imagem Docker:**
    ```bash
    docker build -t pokedex-app .
    ```
2.  **Execute o container a partir da imagem:**
    ```bash
    docker run -d -p 8100:80 pokedex-app
    ```

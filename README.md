# Analisador de Imagens com Inteligência Artificial

## Descrição
Este projeto é um analisador de imagens utilizando inteligência artificial. Ele permite o upload de imagens, análise e armazenamento dos resultados em um banco de dados.

## Docker
Para rodar o projeto utilizando Docker, siga os passos abaixo:
1. Execute o projeto com o comando:
   ```sh
   docker-compose up
   ```

   
# Experiência de Desenvolvimento
Adicionando Rotas no Insomnia
Comecei adicionando as rotas no Insomnia para testar as requisições HTTP e garantir que o backend estava respondendo corretamente.

## Análise das Entidades do Projeto
Analisei quais seriam as entidades do projeto para definir a estrutura do banco de dados e as interações entre elas.

## Modelo de Roteamento
Criei um pequeno modelo de como funcionaria o roteamento, definindo as principais rotas e seus respectivos controladores.

## Criação dos Controllers e Rotas
Desenvolvi os controllers e rotas. Inicialmente, criei interfaces para os controllers para que as rotas não ficassem dependentes de uma classe específica, mas não gostei dessa ideia.

## Interface para Casos de Uso
O próximo passo foi criar interfaces para os casos de uso, garantindo que a lógica de negócio estivesse bem definida e desacoplada das outras camadas.

## Injeção de Dependência
Adicionei injeção de dependência na classe de rotas, pois ela ainda dependia do controller, o que dificultava os testes.

## Manipulação do Conteúdo do Body
Implementei a lógica para pegar o conteúdo do body das requisições, permitindo o processamento dos dados enviados pelo cliente.

## Salvamento de Imagens
Desenvolvi a funcionalidade para salvar imagens em uma pasta temporária ou estática e apagar depois. Foi necessário verificar a extensão da imagem, pois isso pode variar.

## Tratamento de Erros ao Deletar Imagens
Implementei a lógica para tratar erros ao deletar imagens, pois o usuário não tem como saber se houve um erro durante a exclusão.

## Servir Imagens com Node Puro
Pesquisei como servir imagens utilizando apenas Node.js, sem frameworks adicionais.

## Verificação de Registros Existentes
Implementei a verificação para saber se já existe registro para o mês atual e para o tipo de recibo antes de salvar os dados.

## Trabalhando com Workers
Explorei as possibilidades de trabalhar com workers para apagar arquivos depois de um tempo, escolhendo a abordagem mais segura.

## Alteração de Tipos de Dados
Mudei o campo has_confirmed para boolean ao invés de numérico, tornando o código mais claro e fácil de entender.

## Iniciar com Docker Compose
Configurei o Docker Compose para iniciar o banco de dados junto com a aplicação, facilitando o desenvolvimento e a implantação.

# Instalação

## Instalação
Clone o repositório:
git clone <URL_DO_REPOSITORIO>

Instale as dependências:
npm i
## Configuração
- Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias.
- Configure o banco de dados no arquivo docker-compose.yml.
# Uso
Inicie o servidor:
```sh
npm run build && npm start
```

## Acesse o aplicativo em http://localhost:3000.

# Testes
Para rodar os testes, utilize o comando:
npm test

# Contribuição
Faça um fork do projeto.
Crie uma nova branch `(git checkout -b feature/nova-feature)`.
Commit suas mudanças `(git commit -am 'Adiciona nova feature')`.
Faça o push para a branch `(git push origin feature/nova-feature)`.
Abra um Pull Request.
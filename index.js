const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Produto {
    id: String!
    nome: String!
    sku: String!
    descricao: String!
    preco: Float!
    categoria: Categoria
  }
  type Categoria {
    id: String!
    nome: String!
    produtos: [Produto]
  }
  type Query {
    produto(id: String): Produto
    produtos: [Produto]
  }
  type Mutation{
    produtou(id: String, nome: String, preco: Float): Produto
  }
`);

class Produto {
    constructor(id, nome, sku, descricao, preco, categoria) {
        this.id = id;
        this.nome = nome;
        this.sku = sku;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria
    }
}

class Categoria {
    constructor(id, nome, produtos) {
        this.id = id;
        this.nome = nome;
        this.produtos = produtos;
    }
}

const dadosProdutos = [
    new Produto("a", "Prod 1", "Sku 1", "Desc 1", 15.2,null),
    new Produto("b", "Prod 2", "Sku 2", "Desc 2", 16.2,null),
    new Produto("c", "Prod 3", "Sku 3", "Desc 3", 17.2,null),
    new Produto("d", "Prod 4", "Sku 4", "Desc 4", 18.2,null)
];

const dadosCategorias = [
    new Categoria("a", "Cat a", [dadosProdutos[0]]),
    new Categoria("b","Cat b", [dadosProdutos[1]]),
    new Categoria("c","Cat c", [dadosProdutos[2],dadosProdutos[3]]),
];

dadosProdutos[0].categoria = dadosCategorias[0];
dadosProdutos[1].categoria = dadosCategorias[1];
dadosProdutos[2].categoria = dadosCategorias[2];
dadosProdutos[3].categoria = dadosCategorias[2];

const query = {
    produto: ({id}) => dadosProdutos.find((e)=> e.id === id),
    produtos: () => dadosProdutos,
    produtou: ({id, nome, preco}) => {
        let dado = dadosProdutos.find((e)=> e.id === id);
        dado.nome = nome;
        dado.preco = preco;
        return dado;
    }
};


const app = express();
app.use('/produtos', graphqlHTTP({
    schema: schema,
    rootValue: query,
    graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/produtos');

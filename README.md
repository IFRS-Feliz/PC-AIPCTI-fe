# Sistema de auxílio a prestação de contas

### Para rodar no seu computador:

Basta clonar o repositório e executar o comando `yarn start`. 
Nenhuma variável de ambiente além das já incluídas no nos arquivos `/.env.development` e `/.env.production` são necessárias.

### Para rodar em produção:

Para gerar os arquivos estáticos otimizados para produção, basta clonar o repositório e executar o comando `yarn build`. Uma pasta `/build` será criada com os conteúdos dentro.


### Back-end:

Este projeto depende de sua API escrita em Node.js para funcionar, disponível em [PC-AIPCTI-be](https://github.com/IFRS-Feliz/PC-AIPCTI-be).


### Varáveis de ambiente requisitadas:

| Key                 | Value                         |
| ------------------- | ----------------------------- |
| REACT_APP_API_URL   | URL apontando para o Back-end |

As variáveis de ambiente devem ser setadas preferencialmente em `/.env.development` ou `/.env.production`, a depender do contexto.


### Contribuir

Sinta-se livre para criar issues e pull requests ou enviar uma mensagem para os contribuidores atuais.


\
\
\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

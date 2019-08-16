# PointingPoker

Esse projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 6.1.5.

## Servidor de desenvolvimento

Configurar a aplicação pelo arquivo src/environments/environment.ts.
|Chave           |Descrição                                                                                  |Exemplo               |
|----------------|-------------------------------------------------------------------------------------------|----------------------|
|API             |Onde o [backend](https://github.com/brunoritter123/backPointingPoker) está sendo executado.| API: 'localhost:3000'|
|production      |Se o servidor está em modo de produção                                                     | production: false    |
|google_client_id|Sua chave para a [API de autenticação do google](https://developers.google.com/identity/sign-in/web/sign-in)                                             | google_client_id: '490896064905-rlnp8cbqkarl6m23362s5tg1urbbftuj'|


Executar `ng serve` para subir servidor de desenvolvimento. Navegue para `http://localhost:4200/`.

## Build

Executar `ng build` para gerar o código do projeto para ser executado pelo [backend](https://github.com/brunoritter123/backPointingPoker). Use `ng build -prod` para gerar o código de produção, acatando as configuração contidas em src/environments/environment.prod.ts.


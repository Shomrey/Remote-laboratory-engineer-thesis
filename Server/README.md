## Serwer

Backendowe API systemu. Zrealizowane przy użyciu frameworku [Nest.js](https://nestjs.com/) do platformy Node.js.

## Instalacja zależności

```bash
$ npm install
```

## Uruchomienie aplikacji

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Baza danych
Serwer domyślnie tworzy bazę danych SQLite. W przypadku hostingu w serwisie Heroku 
używany jest oferowany przez ten serwis PostgreSQL. Tabele są tworzone automatycznie.

## Specyfikacja
Generowana automatycznie przy użyciu modułu Swagger UI do Nest.js. Interfejs domyślnie dostępny w ścieżce
`/api`.

[Specyfikacja serwera hostowanego na Heroku](https://remote-laboratory.herokuapp.com/api/)

## 0. Près requis

#### Installer MongoDB

```bash
brew update
brew install mongodb
mkdir -p /data/db
chmod 777 /data/db
```

#### Créer et peupler la collection restaurant

```bash
wget https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json
mongoimport --db test --collection restaurants --drop --file primer-dataset.json
```

## 1. Lancer l'API REST

#### Lancer le serveur MongoDB

```bash
mongod
```

#### Lancer l'API REST

```bash
cd restaurantServerWithMongo
npm install
npm run start
```

## 2. Lancer l'application web
```bash
cd restaurant
npm install
npm run start
```

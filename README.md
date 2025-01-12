ПРИМЕР СЕРВЕРНОГО ПРИЛОЖЕНИЯ - "ДОКУМЕНТИРОВАНИЕ"
=================================================
# Установка, компиляция и запуск
```
git clone https://github.com/ui-organizer/server-sample-docs.git
cd server-sample-docs
npm install
npm run build
node ./app-server.js
```
  
# Описание
Серверное приложение (один файл), которое мы запускаем: ```app-server.ts```.  
Клиентское приложение (один файл): ```src-client/app-client.ts``` собирается с помощью webpack в папку ```dist```.  

Контент (md-файлы) : ```content```.
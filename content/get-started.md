НАЧАЛО РАБОТЫ
=============

### Установка
Установите ```node.js```. Скачать можно здесь https://nodejs.org/.  

Создайте папку ```my-project```, перейдите в нее и инициализируйте проект:  
```
cd my-project
npm init
```  
Установите необходимые библиотеки:
```
npm install ui-organizer 
npm install --save-dev typescript 
```  
### Настройка typescript
Для настройки компилятора ```typescript``` в папке ```my-project``` создайте файл ```tsconfig.json``` и добавьте в него скрипт:  
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "es2022",
    "lib": [
      "es2022",
      "DOM",
      "DOM.Iterable"
    ],
    "moduleResolution": "nodenext",
    "sourceMap": true
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Настройка webpack
Для создания файлов ```javascript```, которые будут работать в браузере используйте любую библиотеку, например ```webpack```. Сначала установите ее:    
```
npm install webpack webpack-cli ts-loader ui-organizer-webpack-plugin --save-dev
```  

Создайте файл ```webpack.config.js``` и добавьте в него скрипт:  
```javascript
const path = require('path');
const UIOrganizerWebpackPlugin = require('ui-organizer-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './simple.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, `./dist`),
    assetModuleFilename: '[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        type: 'asset/resource',              
      },
      {
        test: /\.html$/,
        type: 'asset/resource',
      },      
    ],
  },
  plugins: [
    new UIOrganizerWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  }
};
```  
Здесь ```webpack``` находит файлы с расширением ```ts``` и использует загрузчик ```ts-loader``` для компиляции скриптов ```typescript``` в ```javascript```.  

Далее ```webpack``` используя плагин ```ui-organizer-webpack-plugin``` копирует файлы вендоров в католог, указанный в разделе конфигурации webpack - ```output.path```. Эти файлы поставляются с библиотекой ```ui-organizer```.

### Создание приложения
В папке ```my-project``` создайте файл ```simple.ts``` и добавьте программный код:
```typescript
/*Инструкции для WebPack, который скопирует эти файлы в ваш каталог ./dist*/
import './index.html';
import 'ui-organizer/page.css';
import 'ui-organizer/style.css';
import 'ui-organizer/vars.css';

/*Описание формы simpleForm*/
import type {IForm, IButton, IProperty} from "ui-organizer";
import { AppManager, Input, Position, AlignSelf} from "ui-organizer";

export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'simpleForm',
	  alignSelf: AlignSelf.topCenter,
    elements: [
        <IProperty>{
            type: 'IProperty',
            name: 'email',
            caption: 'Логин',
            input: Input.text,
            captionPosition: Position.none, //не отображать заголовок
            placeholder: 'Логин',
        },
        <IProperty>{
            type: 'IProperty',
            name: 'password',
            caption: 'Пароль',
            input: Input.password,
            captionPosition: Position.none, //не отображать заголовок
            placeholder: 'Пароль',
        },
        <IButton>{
            type: 'IButton',
            name: 'sendData',
            caption: 'Отправить',
            onClick: async function () {
                alert("Data sent!");
            }
        },
    ]
}

/*Инициализация приложения AppManager*/
var Global: any = window;
Global.AppManager = AppManager;
Global.onpopstate = AppManager.onPopState;

AppManager.add([form]);
AppManager.init(document.querySelector('#app'))
    .then(()=>{
        AppManager.open('simpleForm', {});
    })
```  
На форму добавлено два свойства: объекты typescript, которые реализуют интерфейс ```IProperty```, и кнопка: объект typescript, который реализует интерфейс ```IButton```.  Ну, и сама форма: объект, который реализует интерфейс ```IForm```.

Обратите внимание, что можно использовать файлы .css с настроенными стилями, которые поставляются с библиотекой. Для этого в начале файла указаны инструкции для пакета WebPack, где взять файлы с таблицами стилей. Файл ```page.css``` содержит описание компоновки элементов управления (этот файл нельзя изменять). Файл ```style.css``` содержит описание оформления, так называемую "тему" (этот файл может быть заменен любой другой темой).


В папке ```my-project``` создайте файл ```index.html``` и добавьте программный код:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ui-organizer simple form</title>
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Просто, поместили форму посередине страницы */
        body { width: 50%; margin: 0px auto 0px auto}
    </style>
</head>
<body>
    <div id="app">
    </div>
    <script type="text/javascript" src="index.js"></script>
</body>
</html>
```  
### Компиляция и запуск
Скомпилируйте и соберите файлы для работы в браузере с помощью ```webpack```:  
```
npx webpack --progress
```  
Пакет ```webpack``` скомпилирует ваш ```simple.ts``` в ```index.js```. И скопирует файлы ```page.css``` и ```style.css``` из библиотеки ```ui-organizer```. Все это поместит в папку ```./dist```.  

Запустите:  
```
./dist/index.html
```
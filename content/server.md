СЕРВЕРНЫЙ РЕНДЕРИНГ
===================

Если вас не устраивают простые экранные формы веб-приложения и вы хотите, чтобы ваши страницы отображались в результатах поиска, и могли быть использованы для поисковой оптимизации (SEO), тогда вам нужно использовать серверный рендеринг.
Библиотека ui-organizer представляет подсистему ui-organizer-server.
### Установка
Для установки сервера создайте папку ```my-project-server```, перейдите в нее и инициализируйте проект:  
```
cd my-project-server
npm init
```  
Установите необходимые библиотеки:
```
npm install ui-organizer-server
```  

### Настройка typescript
Для настройки компилятора ```typescript``` в папке ```my-project-server``` создайте файл ```tsconfig.json``` и добавьте в него скрипт:  
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "es2023",
    "lib": [
      "es2023"
    ]
  },
  "exclude": [
    "node_modules"
  ]
}
```

### Создание серверного приложения
В папке ```my-project-server``` создайте файл ```server.ts``` и добавьте программный код:
```typescript
import * as http from "http";
import * as Path from 'path';
import { Renderer } from 'ui-organizer-server';

const port: number = 80;
const distDir: string = Path.join(__dirname, `../my-project/dist`);//Папка в которой находятся файлы клиентского приложения
const host: string = `http://localhost:${port}`;//Url, по которому доступно приложение

const renderer = new Renderer(distDir, host);

var httpserver: http.Server = http.createServer((req, res)=>{
    renderer.response(req, res);
});
httpserver.listen(port, () => console.log(`Server UI app listening on port ${port}!`));
```  

### Компиляция и запуск
Скомпилируйте файл с помощью ```typescript compilator```:  
```
tsc
```  
Запустите:  
```
node webserver.js
```

### Особенности разработки приложений с серверным рендерингом
#### 1. Добавляйте модули приложения в метод AppManager.init()
Для правильной работы серверного рендеринга необходимо в клиентском приложении:
- **передать в AppManager все модули** используемые приложением;
- **экспортировать все используемые функции** (добавить приставку export).  
  
В примера в статье "Начало работы" мы описали в файле simple.ts  форму и инициировали AppManager. Т.е. все приложение у нас поместилось в одном файле. Для использования серверного рендеринга необходимо либо разделить приложение на модули, либо добавить описание формы внутрь namespace.  
  
<details>
<summary>Разделение на модули...</summary>
  
Для серверного рендеринга в файле simple.ts в метод ```AppManager.init()``` добавим:
- модули, например, ```[MyFormModule]``` 
- и url приложения, например, ```http://localhost```.   

```typescript
AppManager.init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
```     
  
Можем разделить наше приложение на модули. Создайте файл form.ts и перенесите туда описание переменной form.
```typescript
/*Описание формы simpleForm*/
import type {IForm, IButton, IProperty} from "ui-organizer";
import { Input, Position, AlignSelf} from "ui-organizer";

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
```
Исправьте файл simple.ts
```typescript
/*Инструкции для WebPack, который скопирует эти файлы в ваш каталог ./dist*/
import './index.html';
import 'ui-organizer/page.css';
import 'ui-organizer/style.css';
import 'ui-organizer/vars.css';

/*Описание формы simpleForm*/
import { AppManager} from "ui-organizer";
import * as MyFormModule from './form';

/*Инициализация приложения AppManager*/
var Global: any = window;
Global.AppManager = AppManager;
Global.onpopstate = AppManager.onPopState;

/**Для серерного рендеринга добавили модуль с формой в AppManager*/
AppManager.init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
    .then(()=>{
        AppManager.add([MyFormModule.form]);
        AppManager.open('simpleForm', {});
    })
```
</details>

<details>
<summary>Перенос внутрь namespace...</summary>

Для серверного рендеринга в файле simple.ts в метод ```AppManager.init()``` добавим:
- модули ```[MyFormModule]``` 
- и url приложения, например, ```http://localhost```.   

```typescript
AppManager.init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
```   
  
Можем поместить описание формы в отдельный namespace. Исправьте файл simple.ts добавив в него namespace MyFormModule.
```typescript
/*Инструкции для WebPack, который скопирует эти файлы в ваш каталог ./dist*/
import './index.html';
import 'ui-organizer/page.css';
import 'ui-organizer/style.css';
import 'ui-organizer/vars.css';

/*Описание формы simpleForm*/
import type {IForm, IButton, IProperty} from "ui-organizer";
import { AppManager, Input, Position, AlignSelf} from "ui-organizer";


namespace MyFormModule {
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
}
/*Инициализация приложения AppManager*/
var Global: any = window;
Global.AppManager = AppManager;
Global.onpopstate = AppManager.onPopState;

/**Для серверного рендеринга добавили модуль с формой в метод AppManager.init()*/
AppManager.init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
    .then(()=>{
        AppManager.add([MyFormModule.form]);
        AppManager.open('simpleForm', {});
    })
```  
</details>

#### 2. Отслеживайте место исполнения кода - свойство onServer
Вот этот скрипт при серверном рендеринге будет выполнятся и на клиенте и на сервере.  
```typescript
AppManager.init(document.querySelector('#app'))
    .then(()=>{
        AppManager.open('simpleForm', {});
    })
```  
  
Собственно, весь скрипт выполнятся и на сервере и на клиенте, но для нас важен этот скрипт. Метод ```AppManager.init``` на сервере создает объекты элементов управления и формирует html, а на клиенте получает готовый html и готовые объекты элементов управления, сформированные на сервере, и связывает html элементы с объектами элементов управления. Также метод ```AppManager.init``` заполняет свойство ```AppManager.onServer``` для того, чтобы отследить где выполняется скрипт. 

<details>
<summary>Например:</summary>
   
```typescript
AppManager
    .init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
    .then(async () => {
        AppManager.add([new MyForm.Form(Global.command)]);
        let data: any;
        if (AppManager.onServer) {
            data = await MyForm.xmlHttpRequest(`${AppManager.serverUrl}/${dataJsonFile}`);
            if (data) data = JSON.parse(data);
            else console.log(`Нет данных ${dataJsonFile}`);
        }
        AppManager.open('simpleForm', data);
    })    
```
</details>
  
AppManager.open одинаково работает на сервере и на клиенте, а как мы знаем, эта функция последовательно вызывает:
- AppManager.load()
- AppManager.setData()
- AppManager.activate()  
  
Поэтому, и на сервере и на клиенте вызываются методы onBeforeLoad, onBeforeSetData и другие. Чтобы во время исполнения программы отслеживать где выполняется код используйте свойство ```onServer``` и ```serverSideRendring```, которые доступны в объектах событий load и setData.  
  
```event.onServer``` - индикатор: выполняется ли код на клиенте или на сервере.  
  
```event.serverSideRendering``` - индикатор: был ли серверный рендеринг.  
  
<details>
<summary>Например:</summary>

```typescript
async onBeforeSetData(event, form, elem){
    if(event.onServer != event.serverSideRendering) {
      event.stop();
      return;
    }
}
```

При серверном рендеринге:
- на сервере:
  + event.onServer = true;
  + event.serverSideRendering = true;
- на клиенте:
  + event.onServer = false;
  + event.serverSideRendering = true;
  
Без серверного рендеринга:
- на клиенте:
  + event.onServer = false;
  + event.serverSideRendering = false;

</details>

#### 3. Указывайте url приложения в Renderer и в самом приложении
Указывайте serverUrl в Renderer сервера (в папке my-poject-server) и в клиентском приложении (в папке my-poject).  
  
**В Renderer сервера** передаем url в конструктор Renderer. Это необходимо, чтобы программа понимала, что запросы ресурсов на этот url выбираем из папки distDir:  
```typescript
const distDir: string = Path.join(__dirname, `../test/dist`);
const url: string = `http://localhost:${port}`;

/**В конструктор Renderer передаем папку с клиентскими формами и url приложения*/
const renderer = new Renderer(distDir, url);

var httpserver: http.Server = http.createServer((req, res)=>{
    renderer.response(req, res);
});
httpserver.listen(port, () => console.log(`UI app listening on port ${port}!`));
```
**В клиентском приложении** передаем url в метод AppManager.init(). Это необходимо, чтобы во время инициализации на клиенте метод ```AppManager.init``` запросил данные с сервера.
```typescript
/**В метод AppManager.init() передаем модули и url приложения*/
AppManager
    .init(document.querySelector('#app'), [MyFormModule], 'http://localhost')
    .then(async () => {
        AppManager.add([new MyFormModule.Form(Global.command)]);
        AppManager.open('simpleForm', data);
    })    
```
#### 4. Нельзя добавлять функции в Runtime
#### 5. Обработка url запроса в приложении на сервере
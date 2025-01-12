О БИБЛИОТЕКЕ
============

<div id="process">

### 1. Как пользоваться
Библиотека ui-organizer сравнима с библиотекой элементов управления для разработки обычного десктопного приложения.   

Библиотека ui-organizer - это набор элементов управления (компонентов, таких как поле ввода, таблица, список, кнопка и др.). В этой библиотеке не упоминаются шаблоны проектирования, такие как MVC или MVP, что не мешает вашему приложению поддерживать их. Плюс библиотеки ui-organizer в том, что Вы можете легко и быстро создать клиентское (т.е. ```frontend```) приложение любой сложности.  

Отличительной чертой библиотеки ui-organizer является то, что она, практически, не вводит новых понятий и абстракций. Все что Вам нужно - это иметь представление о ```html```, ```css``` и ```js (typescript)```.

* Вы можете использовать модули в вашем приложении - это обычные js модули es6. Вы можете разбить ваше приложение на отдельные модули и, в том числе, распространять отдельные компоненты как модули или работать по принципу повторного использования в других приложениях.  
* Вы можете использовать дополнительные сервисы в вашем приложении - это обычные классы с логикой, в том числе, взаимодействия с сервером. 
* AppManager позволит Вам осуществлять навигацию между формами и создавать приложения, состоящие из множества форм.

<div id="create">

#### 1.1. Создание объекта typescript
Для описания объекта интерфейса пользователя с помощью библиотеки ```ui-organizer``` используется ```typescript```. 

<div style='display: flex;'>
<div style='width: 60%; margin-right: 10px;'>

```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'simpleForm',
    caption: 'Приложение',
    flex: Flex.flexible,
    grouping: Grouping.vertical,
    alignSelf: AlignSelf.topCenter,
    elements: [
        <IProperty>{
            type: 'IProperty',
            name: 'login',
            caption: 'Логин',
            captionPosition: Position.none, //не отображать заголовок
            input: Input.text,
        },
        <IButton>{
            type: 'IButton',
            name: 'sendData',
            caption: 'Отправить',
        },
    ]
}
```
</div>
<div>

<div id="view-simpleForm">
    <div class="app topCenter readonly vertical ui-label" id="app-viewContent" style="">
        <div class="view readonly ui-property type-text equalize" id="view-email" style="">
            <div class="caption fixed" style="display: none;" wfd-invisible="true">Логин</div>
                <div class="field flexible">
                    <div class="content flexible">
                        <input type="text" name="email" readonly="readonly">
                        <div class="content-helper"></div>
                    </div>
                </div>
            </div>
            <div class="view readonly ui-button" id="view-sendData" style="">
                <button type="button">Отправить</button>
            </div>
        </div>
    </div>
</div>
</div>

Здесь переменной ```form``` присвоен объект, который реализует интерфейс ```IForm```. Этот объект описывает главный элемент управления - форму пользователя. Свойство ```elements``` этого объекта содержит массив подэлементов: два объекта typescript, которые реализуют интерфейсы ```IProperty``` и ```IButton```. Эти подэлементы описывают два элемента управления: поле ввода и кнопку соответственно. 
<div id="behavior">

#### 1.2. Описание поведения объекта typescript

<div style='display: flex;'>
<div style='width: 60%; margin-right: 10px;'>

```typescript
export var form: IForm = <IForm>{
    name: 'simpleForm',
    ...
    elements: [
        <IProperty>{
            name: 'login',
            ...
            onAfterLoad: async function(){
                (<IProperty>this).placeholder = 'Логин';
                return true;
            }
        },
        <IButton>{
            name: 'sendData',
            ...
            onClick: async function () {
                alert('Клик!');
                return true;
            }
        },
    ]
}
```
</div>
<div>
    <div class="app topCenter readonly vertical ui-label" id="app-viewContent" style="">
        <div class="view readonly ui-property type-text equalize" id="view-email" style="">
            <div class="caption fixed" style="display: none;" wfd-invisible="true">Логин</div>
                <div class="field flexible">
                    <div class="content flexible">
                        <input type="text" name="email" placeholder="Логин" readonly="readonly">
                        <div class="content-helper"></div>
                    </div>
                </div>
            </div>
            <div class="view readonly ui-button" id="view-sendData" style="">
                <button type="button" onclick="alert('Клик!')" >Отправить</button>
            </div>
        </div>
    </div>
</div>
</div>

Здесь в объект typescript, который реализует интерфейс ```IProperty```, добавлена реализация метода ```onAfterLoad()```. Этот метод вызывается после загрузки элемента управления - поле ввода.  
А в объект typescript, который реализует интерфейс ```IButton```, добавлена реализация метода ```onClick()```.
Этот метод вызывается при клике по элементу управления - кнопке.  

<div id="data">

#### 1.3. Открытие формы пользователя и установка данных

<div style='display: flex;'>
<div style='width: 60%; margin-right: 10px;'>

```typescript
export var form: IForm = <IForm>{
    name: 'simpleForm',
    ...
    elements: [
        <IProperty>{
            name: 'login',
            ...
            bindingProperty: 'id',
        },
        <IButton>{
            name: 'sendData',
            ...
        },
    ]
}

AppManager.add([form]);
AppManager.open(
    'simpleForm', /**Имя формы, которая открывается*/
    {"id": "support@ui-organizer.ru"}, /**данные, которые передаются форме*/
    undefined
);
```
</div>
<div>
    <div class="app topCenter readonly vertical ui-label" id="app-viewContent" style="">
        <div class="view readonly ui-property type-text equalize" id="view-email" style="">
            <div class="caption fixed" style="display: none;" wfd-invisible="true">Логин</div>
                <div class="field flexible">
                    <div class="content flexible">
                        <input type="text" name="email" placeholder="Логин" readonly="readonly" value="support@ui-organizer.ru" >
                        <div class="content-helper"></div>
                    </div>
                </div>
            </div>
            <div class="view readonly ui-button" id="view-sendData" style="">
                <button type="button" onclick="alert('Клик!')" >Отправить</button>
            </div>
        </div>
    </div>
</div>
</div>

Здесь в объект typescript, который реализует интерфейс ```IProperty```, добавлено свойство ```bindingProperty``` со значением ```id```.

А дальше ```AppManager``` добавляет объект ```form``` в список форм (```AppManager.forms.add([form]) ```) и открывает форму (```AppManager.forms.open(...)```).  
Форме передаются следующие данные: ```{"id": "support@ui-organizer.ru"}```. По значению свойства ```bindingProperty``` объекта typescript, программа определяет какие данные подставить.

<div id="inside">

### 2. Как это все работает

В файле typescript вы подключаете библиотеку ```ui-organizer```, создаете форму - объект ```typescript``` и с помощью ```AppManager``` запускаете эту форму:  

main.ts
```typescript
import type { IForm, ... } from "ui-organizer";
import { AppManager } from "ui-organizer";

export var form: IForm = <IForm>{
    name: 'simpleForm',
    ...
}

...
AppManager.parent = document.querySelector('#app');
AppManager.add([form]);
AppManager.open('simpleForm', ...);
```
Чтобы получить файл ```javascript```, который работает в браузере вы компилируете ваш файл ```typescript``` с помощью ```webpack```, например.  

если в ```typescript``` объект формы выглядел так:
```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'simpleForm',
    caption: 'Приложение',
    flex: Flex.flexible,
    grouping: Grouping.vertical,
    alignSelf: AlignSelf.topCenter
    ...
}
```
то в ```javascript``` объект формы выглядит так:
```javascript
var form = {
    type: 'IForm',
    name: 'simpleForm',
    caption: 'Приложение',
    flex: 'flexible',
    grouping: 'vertical',
    alignSelf: 'topCenter'
    ...
}
```
Собственно, вы можете сразу описывать объект на ```javascript```, но это будет приводить к ошибкам. Потому и используется ```typescript```, чтобы ваш редактор, в котором вы разрабатываете программу, подсказывал вам и заранее выявлял ошибки.

Создаете html файл, где подключаете полученный ```javascript``` файл с вашей программой:  

index.html
```html
...
<body>
    <div id="app"></div>
    <script type="text/javascript" src="main.js"></script>
</body>
...
```


Когда вы запускаете файл index.html, после того как загрузится страница, запустается подключенный файл ```javascript```. ```AppManager``` добавляет форму в список форм ``` AppManager.add([form]) ```и открывает ее ```AppManager.open('simpleForm', ...)```.  

На самом деле открытие формы разбивается на три этапа:
#### 2.1. Форма загружается
Вызывается метод ```AppManager.load('simpleForm', ...)```. AppManager загружает описанный вами объект. Кстати, в этот момент это голый ```json```. Вы преобразовали ваш ```typescript``` объект в ```javascript```, поэтому в процессе запуска программы и загрузки формы нет уже того описания интерфейсов доступных в ```typescript```.  

В процессе загрузки формы ```AppManager``` определяет тип объекта (каждого элемента управления), который задан в свойстве ```type```, например ```'IProperty'```, ```'IButton'``` или ```'IForm'```. На основании этого типа создается специальный *runtime* объект, который уже обладает всей функциональностью. И этому *runtime* объекту передаются значения всех свойств и методов, которые вы задали. 

Это *runtime* объект генерирует все события, например ```load```, ```show```, ```setData```, которые вы можете обрабатывать в своих обработчиках ```form.on('show', ()=>{/*do smph*/})```.  

Это *runtime* объект вызывает методы, которые вы задали ```form.onBeforeLoad: function() {/*do smph*/}```.  

Это *runtime* объект предоставляет дополнительные методы и свойства, которые вы не описывали, например ```form.setData({...})``` или ```form.addElement({})``` или ```form.parent``` или ```form.dom``` (эти методы есть у каждого элемента управления - у каждого свои свойства и методы).

Это *runtime* объект доступен, когда вы получаете форму или элемент управления с помощью ```AppManager```, например ```AppManager.activeform``` или ```AppManager.activeform.getElement('login')```. Таким образом в процессе выполнения ваш код взаимодействует уже с этим объектом, который также реализует соответствующий интерфейс, например ```IForm``` или ```IList```.

Это *runtime* объект создает html елементы и подключает их на страницу браузера. html жестко определен для каждого элемента управления и вы можете управлять только стилевым оформлением.

#### 2.2. На форму устанавливаются данные
Вызывается метод ```AppManager.setData('simpleForm', {...})```, которому передается ```json``` объект с данными. Этот метод рекурсивно вызывает метод ```setData()``` всех вложенных объектов, таким образом заполняя все элементы управления данными.  

#### 2.3. Форма активизируется
Вызывается метод ```AppManager.activate('simpleForm')```. Делает форму видимой.

<div id="organize">

### 3. Как элементы управления располагаются на форме
Свойство ```IGroup.grouping``` выравнивает элементы группы по вертикали или горизонтали.  

**ПРИМЕР 1:**  
У IForm (IForm наследник IGroup) свойство grouping = ***Grouping.vertical***.
```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'form',
    grouping: Grouping.vertical,
    ...
    elements: [
        <IElement>{
            type: 'IElement',
            name: 'elem1',
            ...
        },
        <IElement>{
            type: 'IElement',
            name: 'elem2',
            ...
        },
        ...
    ]
}
```

<table style="width: 100%; border: 1px solid gray;">
     <tr style="width: 100%;">
         <td style="width: 100%;">
            <b>IForm</b><br>
            <table style="width: 100%;border: 1px solid gray;">
                <tr>
                    <td>IElement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                </tr>
                <tr>
                    <td>IElement</td>
                </tr>
                <tr>
                    <td>IElement</td>
                </tr>
                <tr>
                    <td>IElement</td>
                </tr>                                
                <tr>
                    <td>IElement</td>
                </tr>                
            </table>
         </td>
     </tr>
</table>

**ПРИМЕР 2:**  
У IForm (IForm наследник IGroup) свойство grouping = ***Grouping.horizontal***.
```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'form',
    grouping: Grouping.horizontal,
    ...
    elements: [
        <IElement>{
            type: 'IElement',
            name: 'elem1',
            ...
        },
        <IElement>{
            type: 'IElement',
            name: 'elem2',
            ...
        },
        ...
    ]
}
```

<table style="width: 100%;border: 1px solid gray;">
     <tr style="width: 100%;">
         <td style="width: 100%;">
            <b>IForm</b><br>
            <table style="width: 100%;border: 1px solid gray;">
                <tr>
                    <td>IElement</td>
                    <td>IElement</td>
                    <td>IElement</td>
                    <td>IElement</td>
                    <td>IElement</td>
                    <td>IElement</td>
                </tr>
            </table>
         </td>
     </tr>
</table>

**ПРИМЕР 3:**  
У IForm (IForm наследник IGroup) свойство grouping = ***Grouping.horizontal***.  
А обе группы имеют grouping = ***Grouping.vertical***.
```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'form',
    grouping: Grouping.horizontal,
    ...
    elements: [
        <IGroup>{
            type: 'IGroup',
            name: 'group1',
            grouping: Grouping.vertical,
            ...
            elements: [
                <IElement>{
                    type: 'IElement',
                    name: 'elem11',
                    ...
                },
                <IElement>{
                    type: 'IElement',
                    name: 'elem12',
                    ...
                },
                ...
            ]
        },
        <IGroup>{
            type: 'IGroup',
            name: 'group2',
            grouping: Grouping.vertical,
            ...
            elements: [
                <IElement>{
                    type: 'IElement',
                    name: 'elem21',
                    ...
                },
                <IElement>{
                    type: 'IElement',
                    name: 'elem22',
                    ...
                },
                ...
            ]
        }
    ]
}
```

<table style="width: 100%;border: 1px solid gray;">
     <tr style="width: 100%;">
         <td style="width: 100%;">
            <b>IForm</b>.grouping = Grouping.horizontal<br>
            <table style="width: 100%;border: 1px solid gray;">
                <tr style="width: 100%;">
                    <td>
                        <b>IGroup</b>.grouping = Grouping.vertical<br>
                        <table style="width: 100%;border: 1px solid gray;">
                            <tr style="width: 100%;">
                                <td>IElement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>                                
                            <tr>
                                <td>IElement</td>
                            </tr>                
                        </table>
                    </td>
                    <td>
                        <b>IGroup</b>.grouping = Grouping.vertical<br>
                        <table style="width: 100%;border: 1px solid gray;">
                            <tr style="width: 100%;">
                                <td>IElement&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>
                            <tr>
                                <td>IElement</td>
                            </tr>                                
                            <tr>
                                <td>IElement</td>
                            </tr>                
                        </table>
                    </td>
                </tr>
            </table>
         </td>
     </tr>
</table>

<div id="work">

### 4. Свойства, методы, события элемента управления
Вы создаете объект ```typescript``` и указываете какой интерфейс он реализует. Например:
```typescript
<IElement>{
    type:'IElement',
    name: 'elem'
}
```
Этот объект реализует интерфейс ```IElement```, т.е. описан минимальный обязательный набор свойств и методов.
Когда на базе вашего описания ```AppManager``` создаст "runtime" объект, он тоже будет реализовывать интерфейс ```IElement``` и свойство ```name``` этого объекта тоже будет ```'elem'```.  

#### 4.1. Свойства и методы
Далее идет описание свойств и методов так, как реализовано в самом ```javascript```. Библиотека ui-organizer здесь ничего нового не добавляет. Она только реализует возможность описать эти свойства и методы для элементов.  

Рассмотрим что требует от нас интерфейс на примере базового интерфейса ```IElement```. Все остальные интерфейсы являются наследниками ```IElement```, т.е. во всех элементах управления доступны эти свойства и методы. Подробное описание смотрите в [api](https://ui-organizer.ru/reference).
```typescript
export interface IElement {
    type: string;
    name: string;
    caption?: string;
    visibility?: boolean;
    readonly?: boolean;
    justifyContent?: JustifyContent;
    textSelect?: boolean;
    positionAbsolute?: boolean; 
    alignSelf?: AlignSelf;
    onBeforeLoad?(form: IForm, elem: IElement, data: any): Promise<boolean>;
    onAfterLoad?(form: IForm, elem: IElement, data: any): Promise<boolean>;
    /*runtime*/ value?: string | number | string[]    
    /*runtime*/ parent?: IGroup;
    /*runtime*/ form?: IForm;
    /*runtime*/ dom?: HTMLElement;
    /*runtime*/ addClass?(className: string): void;
    /*runtime*/ removeClass?(className: string): void;
    /*runtime*/ isType?(type: string | typeof UIElement): boolean;
}
```
Те свойства и методы, которые помечены словом ```/*runtime*/``` не доступны в процессе описания формы. Если вы их опишите, ```AppManager``` их проигнорирует. Эти свойства и методы доступны только у "runtime" объекта.  

Например, вы можете задать свойство ```value``` и добавить класс ```addClass()``` в процессе выполнения:
```typescript
export var baseElem: IElement = <IElement>{
    type: 'IElement',
    name: 'baseElem',
    caption: 'Базовый элемент',
    onAfterLoad: async function (form: IForm, elem: IElement, data: any) {
        elem.value = elem.caption;
        elem.addClass('someclass');
        return true;
    }
}
```
Все остальные свойства вы можете задавать по своему усмотрению для достижения нужного размещения на форме и поведения элемента управления. Причем, обязательно задать только два свойства: ```type``` и ```name```. 
Из предыдущего примера видно, что задано три свойства и один метод:
- обязательные свойства: ```type``` и ```name```,
- необязательные свойства: ```caption```,
- необязательный метод: ```onAfterLoad```, который вызывается "runtime" объектом после своей загрузки.
Все необязательные методы, доступные в процессе описания являются обработчиками событий и начинаются с префикса "on", например ```onAfterLoad```.

#### 4.2. События
Далее идет описание событий так как реализовано в модуле "event" node js и браузера. Библиотека ui-organizer здесь ничего нового не добавляет. Она только реализует возможность описать эти события.  

Каждый элемент управления генерирует события. Например, объект (элемент управления), который реализует интерфейс ```IElement``` генерирует следующие события. Все остальные интерфейсы являются наследниками ```IElement```, поэтому все элементы управления также генерируют эти события.   
```typescript
export interface IElementEvents {
    beforeLoad(form: IForm, elem: IElement, data: any): void,
    afterLoad(form: IForm, elem: IElement, data: any): void, 
    show(form: IForm, element: IElement): void,    
    hide(form: IForm, element: IElement): void,
}
```
Обработчики этих событий создаются в ```runtime```, например:
```typescript
export var baseElem: IElement = <IElement>{
    type: 'IElement',
    name: 'baseElem',
    caption: 'Базовый элемент',
    onAfterLoad: async function (form: IForm, elem: IElement, data: any) {
        elem.on("show", (_form, _elem) => {
            elem.addClass('visible');
        });
        elem.on("hide", (_form, _elem) => {
            elem.removeClass('visible');
        })
        return true;
    }
}
```
Почему в интерфейсе IElement указаны методы ```onBeforeLoad```, ```onAfterLoad``` и события 
```beforeLoad```, ```afterLoad```?  

Потому что обработчики события могут быть разными, например:
```typescript
export var form: IForm = <IForm>{
    type: 'IForm',
    name: 'simpleForm',
    flex: Flex.flexible,
    grouping: Grouping.vertical,
    elements: [
        <IElement>{
            type: 'IElement',
            name: 'header',
            onAfterLoad: async function (form: IForm, elem: IElement, data: any) {
                elem.addClass('header');
                return true;
            }
        },
    ],
    onBeforeLoad: async function (form: IForm, /*это форма*/elem: IElement, data: any) {
        var header: IElement = form.getElement('header');
        header.on("afterLoad", (_form, _elem) => {
            _elem.value = 'Мое приложение';
        })
        return true;
    }
}
```
В примере элемент ```IElement``` имеет обработчик события ```onAfterLoad``` со своей логикой. Форма добавляет к событию ```afterLoad``` элемента дополнительную логику.
#### 4.3. Расширение интерфейсов
Например, вы хотите, чтобы ваш элемент управления имел дополнительное обязательное свойство ```someProperty```, метод ```setSomeProperty``` и генерировал событие ```someSetted```. Для этого задайте интерфейс. Конечно, вы можете не создавать интерфейс, это и так будет работать, но задание интерфейса убережет вас от ошибок и сэкономит кучу времени в будущем.  
```typescript
export interface ISomeElement<T=ISomeElementEvents> extends IElement<T>  {
    someProperty: string;
    setSomeProperty(val: string): void;
}

export interface ISomeElementEvents {
    someSetted(form: IForm, element: IElement): void,
}
```
Описание вашего элемента управления может быть следующим:
```typescript
export var elem: ISomeElement = <ISomeElement>{
    type: 'IElement',
    name: 'elem',
    someProperty: undefined,
    setSomeProperty: function (val: string) {
        someProperty = val;
        this.emit("someSetted", this.form, this);
    }
}
```
Обратите внимание свойство ```type``` указывает на изначальный интерфейс ```IElement```.

<div id="classes">

### 5. Работа с классами
Когда вы работаете с объектами, вы можете использовать объект один раз. Если вы присвоите объект, например ```let elem = <IElement>{...}```,  двум разным формам, то эти формы будут работать с одним и тем же объектом.  
Но, вы можете работать с классами. Вы точно так же описываете класс, который реализует интерфейс нужного элемента управления и наследуете этот класс от специального класса этого элемента управления как показано на примере ниже. Потом, добавляя на форму элемент управления вы просто вызываете ```new MyElement()```:  

```typescript

class MyElement extends UIElement/**Специальный класс, реализующий IElement*/{
    async onAfterLoad(){
        this.value = 'Мой элемент.';
        return true;
    }
}

class MyExtraElement extends MyElement {
    async onAfterLoad(){
        this.value = 'Мой экстра элемент.';
        return true;
    }
}

export class MyForm extends UIForm {
    constructor(name: string){
        super();
        this.name = name;
        this.elements.push(new MyElement());
        this.elements.push(new MyExtraElement());
    }
}
let formName: string = 'simpleForm';
AppManager.add([new MyForm(formName)]);
AppManager.open(formName, undefined, undefined);
```

Для каждого интерфейса создан специальный класс, который реализует этот интерфейс и от которого вы можете создавать наследников для описания элементов управления:  
- interface IElement - class UIElement;
- interface IDataElement - class UIDataElement;
- interface IGroup - class UIGroup;
- ... и так далее для всех интерфейсов.  
  
Если вы не наследуете от класса UIElement, то вам нужно указать свойство type:  
```typescript
class MyElement implements IElement{
    type = UIElement;
    async onAfterLoad(){
        this.value = 'Мой элемент.';
        return true;
    }
}
```
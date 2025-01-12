/*Инструкции для WebPack, который скопирует эти файлы в ваш каталог*/
import './index.html';
import './custom.css';
import 'ui-organizer/page.css';
import 'ui-organizer/style.css';
import 'ui-organizer/vars.css';

/*Описание формы simpleForm*/
import type { IStr, IForm, IButton, IProperty, IElement, IElementEvents, UILoadEvent, IList, IDataElement, IListItem, UISetDataEvent, IGroup, IImage, IFigAwesome, IDataElementEvents, AppManagerMarkdown } from /**'../Organizer/src/organizer';*/ "ui-organizer";
import { AppManager, Grouping, Flex, Input, Position, AlignSelf, UIForm, ContentType, UIGroup, UIList, UIStr, AlignItems } from /**'../Organizer/src/organizer';*/"ui-organizer";

/**
 * Путь к файлу, содержащему объект с двумя свойствами:
 *      default - reference по умолчанию, если в адресной строке нет пути, кроме host.
 *      items - корневой список.
 * У элементов:
 *      reference - путь к md документу от той папки где лежит приложение, обычно dist (например, "ingeo/about"). Всегда должен быть задан. Если необходимо пустую страницу отобразить, то устанавливаем несуществующий путь.
 *      caption  - заголовок. Всегда должен быть задан, иначе в списке документов отобразится undefined. 
 *      items - может быть или не быть.
 */
const dataJsonFile: string = 'content/data.json';
const formName: string = 'docsForm';

namespace MyApp {
    export let figExpand: IFigAwesome = <IFigAwesome>{
        faClass: ['fa', 'fa-regular', 'fa-square-plus', 'fa-fw'],
        // faStyle: ['color: grey']
    }

    export let figCollapse: IFigAwesome = <IFigAwesome>{
        faClass: ['fa', 'fa-regular', 'fa-square-minus', 'fa-fw'],
        // faStyle: ['color: grey']
    }

    export let figEmpty: IFigAwesome = <IFigAwesome>{
        faClass: ['fa', 'fa-fw'],
        // faStyle: ['color: grey']
    }

    export class TreeList extends UIGroup {
        name: string = 'TreeList';
        grouping: Grouping = Grouping.vertical;
        isRoot: boolean;
        selected: IElement;
        collapsed: boolean;
        captionElement: CaptionElement;
        itemsElement: ItemsElement;
        constructor(isRoot: boolean = false) {
            super();
            this.isRoot = isRoot;
            if (this.isRoot) {
                this.size = '20%';
                this.allowOverflow = true;
                this.collapsed = false;
            }
            else this.collapsed = true;
        }

        /**
         * Заполняет дерево команд (ссылок на документы) слева.
         * Выполняется на сервере.
         * На клиенте форма останавливает установку данных.
         */
        async onAfterSetData(event: UISetDataEvent, form: IForm, elem: IDataElement): Promise<void> {
            if (this.isRoot) this.itemsElement = await this.addElement(new ItemsElement(), event.data) as ItemsElement;
            else {
                if (event.data.items && Array.isArray(event.data.items)) {
                    this.captionElement = await this.addElement(new CaptionElement(figExpand, false), event.data) as CaptionElement;
                    this.itemsElement = await this.addElement(new ItemsElement(), event.data) as ItemsElement;
                    this.collapse(this.collapsed);
                }
                else {
                    this.captionElement = await this.addElement(new CaptionElement(figEmpty, true), event.data) as CaptionElement;
                }
            }
        }

        /**
         * Выделяет строку IStr в CaptionElement.
         * Выполняется на сервере в момент загрузки документа.
         */
        selectItem(name: string) {
            let elem = this.getElement(name);
            if (!elem) return;

            if (this.selected) this.selected.removeClass('selected');
            this.selected = elem;
            elem.addClass('selected');

            if (name == (<Form>this.form).reference) {
                let parentTreeList = (<CaptionElement>elem.parent).parent as TreeList;
                if (parentTreeList) parentTreeList.collapse(false);
            }
        }

        /**
         * Скрывает или раскрывает список.
         * Если аргумент undefined, то инвертирует свойство this.collapsed
         * Устанавливает иконку строки списка.
         */
        collapse(collapse: boolean = undefined) {
            this.collapsed = collapse == undefined ? !this.collapsed : collapse;

            //Скрываем-Раскрываем список
            if (this.itemsElement) {
                this.itemsElement.visibility = !this.collapsed;
            }

            //Устанаваливаем иконку: плюс или минус
            if (this.captionElement && this.itemsElement) {
                if (this.collapsed) this.captionElement.setIcon(figExpand);
                else this.captionElement.setIcon(figCollapse);
            }

            //Раскрываем также родительский TreeList, если collapsed == false
            let parentTreeList = this.owner?.parent as TreeList;
            if (!this.collapsed && parentTreeList) parentTreeList.collapse(false);
        }

        getFirstReference(): string {
            let reference: string;
            if (this.captionElement) reference = this.captionElement.getReference();
            else if (this.itemsElement) reference = this.itemsElement.getFirstReference();
            return reference;
        }
    }

    /**
     * Заголовок строки TreeList. Состоит из иконки IImage (collapse/expand) и текста строки IStr.
     * Текст строки является гиперссылкой. Т.е. мы не обрабатываем click, а переходим по ссылке.
     * В this.captionStrElement.name храним reference
     * В this.captionStrElement.value храним caption
     */
    export class CaptionElement extends UIGroup {
        name = 'CaptionElement';
        grouping: Grouping = Grouping.horizontal;
        collapsed: boolean;
        isLeast: boolean;
        captionIconElement: IImage;
        captionStrElement: IStr;
        constructor(faIcon: IFigAwesome, isLeast: boolean = true) {
            super();
            (<IImage>this.elements[0]).figAwesome = faIcon;//До загрузки this.captionIconElement еще undefined
            this.isLeast = isLeast;
        }
        elements = [
            <IImage>{
                type: 'IImage',
                alignItems: AlignItems.center
            },
            <IDataElement>{
                type: 'IDataElement',
                flex: Flex.flexible
            }
        ]

        async onAfterLoad(event: UILoadEvent, form: IForm, elem: IElement): Promise<void> {
            this.captionIconElement = this.elements[0];
            this.captionStrElement = this.elements[1];

            //Выполняем на всплытии, иначе перехватывают вышележащие списки
            elem.on('click', (event, form, elem, item) => {
                if (item && item === this.captionIconElement) {
                    let treeList = elem.parent as TreeList;
                    if (treeList) treeList.collapse();
                }
            }, { capture: false });

            if (!this.isLeast && event.onServer) this.captionStrElement.addStyle('font-weight', '600');//Semi Bold
        }

        /**
         * Выполняется на сервере.
         * На клиенте форма останавливает установку данных.
         */
        async onAfterSetData(event, form: Form, elem) {
            this.captionStrElement.name = event.data?.reference;
            this.captionStrElement.value = event.data?.caption;
            this.captionStrElement.href = `${AppManager.serverUrl}/${event.data?.reference}`;
        }

        setIcon(figAwesome: IFigAwesome) {
            this.captionIconElement.figAwesome = figAwesome;
        }

        getReference() {
            return this.captionStrElement.name;
        }
    }

    /**
     * Подсписок строки TreeList, где каждый элемент тоже TreeList.
     */
    export class ItemsElement extends UIList {
        name = 'ItemsElement';
        bindingProperty = 'items';
        itemsElement = new TreeList();
        async onClick(event, form, elem, item) {
            event.preventDefault();
        }
        async onAfterLoad(event: UILoadEvent, form: IForm, elem: IElement): Promise<void> {
            if (!(<TreeList>this.parent).isRoot) this.addStyle('margin-left', '15px');
        }
        getFirstReference() {
            let first = this.items.get(0)?.element as TreeList;
            return first?.getFirstReference();
        }
    }

    /**
     * Список заголовков отображаемого документа с правой стороны от документа.
     * Заполняется на сервере во время заполнения команды (открытия документа).
     */
    export class ListOfHeaders extends UIList {
        name: string = 'ListOfHeaders';
        headersElements: Array<HTMLElement> = [];
        itemsElement = <IDataElement>{
            type: 'IDataElement',
            flex: Flex.flexible
        }
        allowOverflow = true;
        constructor() {
            super();
        }
        async onAfterLoad(event: UILoadEvent, form: IForm, elem: IElement): Promise<void> {
            this.addStyle('font-size', '0.8em');
        }
        /**
         * Устанавливает список заголовков, но НЕ заполняет headersElements - соответсвие заголовка элементу dom.
         * ВЫполняется на серере.
         */
        setHeaders(mdDoc: string, dom: HTMLElement) {
            this.clear();
            //Получаем массив всех заголовков md текста, начинающиеся c #, ##, ###, ..., ######
            let headers: Array<string>;
            if (mdDoc && dom) headers = mdDoc.match(/(?<=(^#{1,6})\s).*/gm);
            else console.log('Один из аргументов undefined');

            //Перебираем заголовки и получаем HTMLElement в dom (IStr.domContent), который соответствует заголовку.
            if (headers) headers.forEach(async (header, index) => {
                let elem = this.getElementByXpath(dom, `//*[(self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6) and text()='${header.trim()}']`) as HTMLElement
                if (elem) {
                    //Устанавливаем элементу идентификатор
                    elem.id = `header${index.toString()}`;

                    //Добавляем строку списка
                    let item: IListItem = await this.addItem(header.trim());
                    (<IStr>item.element).name = elem.id;
                    (<IStr>item.element).href = `#${elem.id}`;

                    //Устанавливаем отступ строки списка, в зависимости от номера заголовка
                    let tag: number = parseInt(elem.tagName.substring(1, 2));//h1, h2, h3 ...
                    (<IStr>item.element).addStyle('margin-left', `${(tag-1) * 10}px`);
                }
            })
        }

        /**
         * Устанавливает соответствие между заголовком и элементом дом. Заполняет headersElements.
         */
        linkHeadersToDom(dom: HTMLElement) {
            this.headersElements = [];
            this.items.forEach(item => {
                let elem = dom.querySelector(`#${item.element.name}`) as HTMLElement;
                this.headersElements.push(elem);
            })
        }

        getElementByXpath(dom, path) {
            return document.evaluate(path, dom, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
    }

    export class Form extends UIForm {
        name: string = formName;
        reference: string;
        constructor(command: string) {
            super();
            this.reference = command;
        }

        grouping: Grouping = Grouping.horizontal;
        elements: IElement<IElementEvents>[] = [
            new TreeList(true),
            <IStr>{
                type: 'IStr',
                name: 'str',
                allowOverflow: true,
                contentType: ContentType.md,

            },
            <IGroup>{
                type: 'IGroup',
                size: '20%',
                name: 'rightPanel',
                elements: [
                    <IImage>{
                        type: 'IImage',
                        visibility: false,//Для будущего разворачивания/сворачивания
                        figAwesome: <IFigAwesome>{
                            faClass: ['fa', 'fa-chevron-left', 'fa-lg'],
                            // faStyle: ['color: grey']
                        }
                    },
                    <IStr>{
                        type: 'IStr',
                        contentType: ContentType.html,
                        flex: Flex.fixed,
                        value: '<span style="font-weight:700;">Содержание документа</span>'
                    },
                    new ListOfHeaders()
                ],
            },
        ];

        /**
         * Устанваливает прослушиватель событий scroll документа, чтобы при скролировании выделялся соответсвующий заголовок
         * в оглавлении с правой стороны.
         * 
         * ВЫполняет позиционирование на заголовке из url.
         * 
         * Выполняется на клиенте.
         */
        async onAfterLoad(event: UILoadEvent, form: IForm, elem: IElement): Promise<void> {
            if (event.onServer) return;

            let str = form.getElement('str') as IStr;
            let listOfHeaders = form.getElement('ListOfHeaders') as ListOfHeaders;

            listOfHeaders.linkHeadersToDom(str.domContent);

            str.dom.addEventListener('scroll', (event) => {
                listOfHeaders.headersElements.every(elem => {
                    if(!elem) return true;

                    let bound = elem.getBoundingClientRect();
                    if (bound.top > 0 && bound.top < window.innerHeight / 2) {
                        let listItem = listOfHeaders.items.find(item => {
                            return item.element.name == elem.id;
                        })
                        listOfHeaders.select(listItem);
                        return false;
                    }
                    return true;
                })
            })


            let header: HTMLElement;
            let headerId = window.location?.hash;
            if (headerId) header = str.dom.querySelector(headerId);
            if (header) header.scrollIntoView();
        }

        /**
         * На клиенте форма останавливает установку данных.
         */
        async onBeforeSetData(event: UISetDataEvent, form: IForm, elem: IForm) {
            if (event.onServer != event.serverSideRendering) { event.stop(); return };
        }

        async onAfterSetData(event: UISetDataEvent, form: IForm, elem: IForm) {
            if (!this.reference || this.reference == '') this.reference = event.data?.default;
            await this.setReference(form, this.reference, event.onServer);
        }

        /**
         * Загружает документ.
         * Выделяет команду в дереве слева.
         * Заполняет оглавление в списке справа.
         */
        async setReference(form: IForm, reference: string, onServer: boolean = false) {
            let rootList = form.getElement('TreeList') as TreeList;
            let str = form.getElement('str') as IStr;
            let listOfHeaders = form.getElement('ListOfHeaders') as ListOfHeaders;

            if (!reference || reference == '') reference = rootList.getFirstReference();

            let value: string = await getContent(reference, onServer);
            await str.setValue(value);

            if (rootList) rootList.selectItem(reference);

            listOfHeaders.setHeaders(value, str.domContent);

            if (!onServer) listOfHeaders.linkHeadersToDom(str.domContent);
        }
    }

    export async function getContent(reference: string, onServer: boolean) {
        if (!reference || reference == '') return `Не найден файл контента "${reference}"`;
        let value: string = await MyApp.xmlHttpRequest(`${AppManager.serverUrl}/${reference}.md`);
        return value;
    }

    export async function xmlHttpRequest(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let xhr = new document.defaultView.XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();
            xhr.onload = function () {
                if (xhr.status != 200) {
                    console.log(`Ошибка xmlHttpRequest ${xhr.status}: ${xhr.statusText}.`);
                    resolve(undefined);
                } else {
                    resolve(xhr.response);
                }
            };

            xhr.onerror = function () {
                console.log("Запрос не удался");
            };
        })
    }
}
/*Инициализация приложения AppManager*/
var Global: any = window;
Global.AppManager = AppManager;
Global.onpopstate = AppManager.onPopState;

AppManager
    .init(document.querySelector('#app'), [MyApp])
    .then(async () => {
        AppManager.add([new MyApp.Form(Global.command)]);
        let data: any;
        if (AppManager.onServer) {
            data = await MyApp.xmlHttpRequest(`${AppManager.serverUrl}/${dataJsonFile}`);
            if (data) data = JSON.parse(data);
            else console.log(`Нет данных ${dataJsonFile}`);

            console.log(Global.command);
            console.log(Global.commandArgs);
        }
        AppManager.open(formName, data);
    })    

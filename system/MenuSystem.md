# Menu System 

메뉴 시스템은 크게 2가지로 나뉩니다. 

1. toolbar, menu 등에서 사용되는 메뉴 리스트 
2. context menu 에서 사용 되는 메뉴 리스트 

두 개의 데이타는 기본 적으로 같습니다. 

다만 표현하는 부분만 다릅니다. 

즉, 하나의 메뉴 아이템 정의 하는 방법을 알게 되면 나머지도 어렵지 않게 적용 할 수 있습니다. 

## 메뉴 데이타 등록 

메뉴는 regiterMenu 라는 함수를 통해서  특정 영역의 메뉴로 매칭 시켜줄 수 있습니다. 

```js
editor.registerMenu('toolbar.left', [
    ....items
]);

```

## Toolbar 에서 메뉴 사용하기 

Toolbar는 기본적으로 ToolbarRenderer 를 가집니다.  메뉴는 렌더러에 의해서 그려집니다. 

```js

class MyToolbar extends EditorElement {
    template() {
        return `
            ${createComponent("ToolBarRenderer", {
                items: this.$menu.getTargetMenu("toolbar.center"),
            })}       
        `
    }
}

```

## Context 메뉴 사용하기 

Context 메뉴의 경우 마지막으로 떠 있는 하나만 존재합니다. 그렇기 때문에 ContextMenu 를 오픈하는 커맨드를 이용해서 사용합니다. 

```js

class MyButton extends EditorElement {
    template() {
        return `<button>MyButton</button>`
    }
    [CLICK()] (e) {
        this.emit('openContextMenu', {
            x: e.clientX,
            y: e.clientY,
            target: 'menu.id',
            items: [
                ...menus
            ]
        })
    }
}

```

`openContextMenu` 라는 커맨드를 사용해서 ContextMenu 가 표시되길 원하는 위치와 메뉴에 대한 데이타를 넣습니다. 

메뉴 데이타는 `target` 과 `items` 로 정의 됩니다. 

target 읜 editor.registerMenu() 를 통해서 정의된 리스트입니다. 
items 는 유저가 동적으로 만들어서 넣는 메뉴 리스트입니다. 

두 가지는 기본적을 동일합니다. 데이타를 어디에 정의하는지만 다릅니다. 

# Menu Item 

메뉴는 몇가지 아이템들을 가집니다. 

## Button 

클릭만 가능한 Button 형 메뉴 아이템입니다. 

```js
{
    type: 'button',
    title: 'my button',
    action: () => {
        console.log('my button is clicked');
    },
    icon: 'icon dom string', 
    shortcut: 'Alt+F'
}
```

## Dropdown 

메뉴 내에서 다시 메뉴를 확장하기 위해서 사용되어집니다. 

```js
{
    type: 'dropdown',
    title: 'my dropdown',
    items: [
        ...menuItems
    ]
}

```

## Divider 

메뉴를 중간에 구분하기 위해서 사용되어 집니다. 

```js

'-' 

// or 

{
    type: 'divider'
}

```

# 메세지 전달하기 

## command 실행 
```js
{
    type: 'button',
    title: '사각형',
    command: 'addLayerView',
    args: ['rect', {
        width: 100,
        height: 100,
        backgroundColor: 'yellow',
    }]
}

```

## action 실행 

```js
{
    type: 'button',
    title: '사각형',
    action: (editor) => {
        editor.context.commands.emit('addLayerView', 'rect', { 
            width: 100, 
            height: 100,
            backgroundColor: 'yellow'
        });
    }
}

```
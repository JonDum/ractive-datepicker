# ractive-datepicker

![ractive-datepicker](https://zippy.gfycat.com/DizzySecondaryEagle.gif)

### Demo

[Live Demo](http://jondum.github.com/ractive-datepicker/demo/)

### Install


```
npm install ractive-datepicker --save
```

### Usage

Add the datepicker to your Ractive instance:

```js
Ractive.extend({
    ...
    components: {
        datepicker: require('ractive-datepicker')
    },
    ...
});
```

Use it like a normal datepicker element

```html
<datepicker date='{{ myValue }}'>
</datepicker>
```


### TODO

* Text Input / Dropdown buttons
* Period selection



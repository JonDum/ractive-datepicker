# ractive-datepicker

![ractive-datepicker](https://zippy.gfycat.com/DizzySecondaryEagle.gif)

### Demo

[Live Demo](http://jondum.github.com/ractive-datepicker/demo/)

### Install

```
npm install ractive-datepicker --save
```

NOTE: `ractive-datepicker` requires ractive version 0.8.x


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

Use it in your template:

```html
<datepicker date='{{myDate}}'></datepicker>
```

Use `mode` to disable/enable time selection. Default is `'datetime'` which shows time pickers.

```html
<datepicker date='{{myDate}}' mode='date'></datepicker>
```

To enable ranges

```html
<datepicker range='true' start='{{startDate}}' end='{{endDate}}'></datepicker>
```

### Changelog

0.2.0 - Add date ranges and a significant UI/styles overhaul

0.1.0 - Initial

### TODO

* Moment.js integration for locales



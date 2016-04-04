# ractive-datepicker


A replacement for `<datepicker>` tags that allows full styling and customizability.

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
<datepicker value='{{ myValue }}'>
 {{#each options}}
 <option>{{this}}</option>
 {{/each}}
 <option>some other option</option>
</datepicker>
```

Or if you already have an array:

```html
<datepicker items='{{options}}'></datepicker>
```

```js
...
data: {
    // can either be array of primitives
    items: ["foo", "bar", "baz"],

    // or array of objects with `value` and `label` -> <option value='{{value}}'>{{label}}</option>
    items: [{label: "foo", value: "_FOO", ...}],
},
...
```

### TODO

* Keyboard events — Selecting elements via string matching and up/down arrows (PRs welcome)



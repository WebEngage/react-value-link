# ValueLink
An alternative to React's [LinkedStateMixin](https://www.npmjs.com/package/react-addons-linked-state-mixin) for [two way data bindings](https://facebook.github.io/react/docs/two-way-binding-helpers.html)


### Advantages over LinkedStateMix
- Support for binding any data object and not necessarily the component's state
- Deep path based data bindings
- Not a mixin so it just works with ES6 style React


### Use it
Install with npm
```
npm install --save react-value-link
```
...then require it (assumes a [frontend module bundler](http://www.slant.co/topics/3900/~frontend-javascript-module-bundlers))
```js
var ValueLink = require('react-value-link');
```

Or directly include on the page
```html
<script type="text/javascript" src="react-value-link.js"></script>
```

### API
#### ValueLink(data, onDataChange)
Returns a **link** associated to `data`

###### Arguments
`data` - object whose constituent values will be binded to `<input>` elements  
`onDataChange` - callback called when `<input>` values change or when `requestChange()` is called explicity. It receives the changed `data` as first argument. 
`onDataChange` is where you would usually update the store, trigger an action or mutate the component's state

#### link
A [functor](https://en.wikipedia.org/wiki/Function_object#In_JavaScript) used to create bindings or futher nested links. 
Every link has an associated path. The link returned by `ValueLink` has an empty path and directly points to `data`

A link is like `ReactLink` and similarly can be passed in the `valueLink` prop to React `<input>` elements to "bind" them with `data` at the associated path 
```jsx
<input ... valueLink={link} />
```

#### link(p1, [p2, [p3, [...]]])
Extends the path from `link` with `p1`, `p2`, `p3`, `...` in that order and returns another link based of the extended path

###### Arguments
`p1`, `p2`, `p3`, `...` - string or integer property names 

This is used to create nested links
```js
contactLink = link('contact');
...
nameLink    = contactLink('name');
```

#### link.value
Is the value within `data` at **this** link's path or `null` if there are missing objects in the path

#### link.requestChange(newValue)
Sets `newValue` at **this** link's path within `data` and calls `onDataChange`. 
Any missing objects in the path are automatically created if necessary

#### link.onChange
Since React 15 deprecated ReactLink, `<input>` components no longer support the `valueLink` prop. You can still use this library with React 15 by passing the value and onChange props seperately  

```jsx
<input ... value={link.value} onChange={link.onChange} />
```

#### link.handleChange
A hook to intercept a `requestChange` call on **this** link. This is good for validating, transforming or invoking a related action.

`link.handleChange` must be assigned a function accepting two arguments.
```js
link.handleChange = function(newValue, change) {
    ...

    change(newValue);
};
```

###### Arguments
`newValue` - value passed to `requestChange()`  
`change` - a function to set `newValue` or any other substitute in `data` and then invoke the `onDataChange` callback. You may decide to not call `change` at all in which case no changes are made to `data` and `onDataChange` is not invoked.


### Example

```js
var Hello = React.createClass({
   // unlike LinkedStateMixin, ValueLink is not a mixin
   getInitialState: function() {
       return { 
           values: {
             list: [
               { type: "translateX", x: 10 },
               { type: "scaleX", x: 1.2 }
             ]
           }
         };
   },
   render: function() {
       var that = this;

       var link = ValueLink(this.state.values, function(values) { that.setState({values: values}) } );

       // a partial valueLink binding which can be sent (as props) to child components that understand only a sub portion of the data structure
       var partial = link('list');
     
       return (
         <div>
           {
             this.state.values.list.map(function(item, i) {
               return (
                 <div>
                   <input valueLink={partial(i)('type')} />
                   <input valueLink={link('list', i, 'x')} />
                 </div>
               );
             })
           }
           <pre>{JSON.stringify(this.state)}</pre>
         </div>
       );
   }
});

React.render(<Hello name="World" />, document.body);
```

#### License - [WTFPL](http://www.wtfpl.net/)
```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 WebEngage <geeks {at} webengage.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

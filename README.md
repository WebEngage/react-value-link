# ValueLink
An alternate to `React.addons.LinkedStateMixin` with support for binding to any data object (not necessarily the component's state).
See [facebook.github.io/react - Two-Way Binding Helpers](https://facebook.github.io/react/docs/two-way-binding-helpers.html)

#### Usage
Install it with `npm install --save react-value-link`

...and then require it
```js
var ValueLink = require('react-value-link');
```

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
       /*
        * ValueLink(data, onChange)
        *     data - object whose constituent values need to be binded to <input> elements
        *     onChange - a callback that is called when anything changes within data and which is passed the changed data object
        *   returns a function that can be used to create bindings
        */
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

 Copyright (C) 2015 WebEngage <opensource {at} webengage.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

# webcomponents
A extended set of features that provide a standard component model for the Web allowing for encapsulation and interoperability of individual HTML elements.

Custom Elements – APIs to define and create new HTML elements
Shadow DOM – Encapsulated DOM and styling, with composition
HTML Templates, an HTML fragment is not rendered, but stored until it is instantiated via JavaScript
Template Strings - Optinal Tagged Template Literals html` ` implamented via tag-html module or lit-html

## Advanteges over webcomponents
- extended customElements api and offers advanced CustomElementsRegistry implamentation allow scoped registrys or createElement based registrys and modify the registry after a element is defined also allows expression to definition
the following API's don't need extends HTMLElement as they work with nativ implamentations.
  - customElement.create('name',definition,{ extends: 'p'}) //=> returns a CustomElement without registration
  - customElement.upgrade(el,definition) //=> returns a CustomElement without registration
  - customElement.Registry(root) //=> returns a customElementRegistry that accepts expression filters
  
## Usage of customElementRegistry
here we list some general usecases

register a unknown-element for general 
```js
// Create a global registry if you replace document with a other dom node that dom node gets a scoped registry
const myRegistry = customElement.Registry(document)

// Create a shared registry
const sharedRegistry = customElement.Registry()
sharedRegistry.listen(document)

// Register a element with a expression
const expression = function(elem) {
  if (elem.connectedCallback) {
      elem.connectedCallback()
  }
}
myRegistry.define(expression) //=> 


// Register a element with a expression
const expression = function(elem) {
  if (elem.is === 'my-component-name') {
      elem.connectedCallback = function() { this.innerText = 'Yahh works'} }
      elem.connectedCallback()
  }
}
myRegistry.define(expression) //=> 



```

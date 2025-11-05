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

## Revolutionizing DOM Manipulation: A Custom Element Observer in JavaScript

A powerful new approach to dynamic web development is emerging, leveraging a combination of `MutationObserver` and a custom element registry to transform elements on the fly as they are added to the DOM. This technique allows for a more declarative and modular way to build interactive user interfaces.

At its core, this implementation utilizes a `MutationObserver` to listen for changes to the document's `body`. When new elements are detected, a custom registry is consulted to see if any of the new nodes match a predefined expression. If a match is found, the element is "upgraded" with the specified behaviors.

### The Custom Element Registry

Central to this pattern is the concept of a `customElement.Registry`. While not a standard browser feature, it can be implemented in JavaScript to manage the registration and application of custom element definitions. This registry can be instantiated globally or scoped to a specific DOM node, providing greater control over component application.

A global registry, for instance, would be created by passing the `document` object to its constructor. This allows any element added to the document to be a candidate for transformation.

```javascript
const myRegistry = customElement.Registry(document);
```

Conversely, a shared or scoped registry can be created without a DOM node, and then later attached to one or more nodes to listen for changes within those specific scopes.

```javascript
const sharedRegistry = customElement.Registry();
sharedRegistry.listen(document);
```

### Defining Elements with Expressions

A key innovation of this approach is the ability to define custom element behaviors using simple functions, or "expressions," rather than the more verbose class-based syntax of standard Web Components. The `define` method of the custom registry accepts a function that receives the matched element as an argument. Inside this function, developers can directly manipulate the element's properties and methods.

For instance, a simple expression could add a `connectedCallback` to an element, which is a standard lifecycle method for custom elements that is invoked when the element is connected to the DOM.

```javascript
const expression = function(elem) {
  if (elem.connectedCallback) {
      elem.connectedCallback();
  }
};
myRegistry.define(expression);
```

A more complex expression could target elements with a specific `is` attribute and dynamically add a `connectedCallback` to modify its content.

```javascript
const anotherExpression = function(elem) {
  if (elem.is === 'my-component-name') {
      elem.connectedCallback = function() { this.innerText = 'Yahh works'};
      elem.connectedCallback();
  }
};
myRegistry.define(anotherExpression);
```

### How It Works Under the Hood

The `customElement.Registry` class would internally manage a list of these definition expressions. The `listen` method would set up a `MutationObserver` on the specified DOM node. This observer would be configured to watch for the addition of new child nodes.

When the `MutationObserver`'s callback is fired, it iterates over the added nodes. For each new node, the registry loops through its stored expressions and executes each one, passing the new node as an argument. This allows for a flexible and dynamic way to apply behaviors to elements as they appear in the DOM.

This pattern represents a significant step forward in creating dynamic and maintainable web applications. By combining the power of `MutationObserver` with a flexible and expressive custom element registry, developers can build complex user interfaces in a more component-based and declarative manner.

# Advanced Web Components

This library extends the standard Web Components model, offering an advanced feature set for creating encapsulated and interoperable HTML elements. It builds upon the core pillars of Web Components:

*   **Custom Elements:** APIs to define new HTML elements with custom behaviors.
*   **Shadow DOM:** Provides encapsulated DOM and styling for components.
*   **HTML Templates:** Allows for inert fragments of HTML to be defined and instantiated on demand.
*   **Tagged Template Literals:** Optionally supports `html` literals via modules like `tag-html` or `lit-html` for declarative rendering.

---

## Advantages Over Standard Web Components

This implementation provides a more flexible and dynamic approach to Custom Elements, overcoming some limitations of the native APIs.

*   **Scoped & Dynamic Registries:** Unlike the single, global `customElements` registry, this library provides a `customElement.Registry` implementation that can be scoped to any DOM node (e.g., just one section of your page).
*   **Define with Expressions:** Instead of being locked into class-based definitions, you can define element behaviors with simple functions ("expressions"). This allows for a more functional and declarative pattern.
*   **On-the-Fly Upgrades:** Apply custom behaviors to elements dynamically as they are added to the DOM, without needing a formal `customElements.define()` call for each one.
*   **No `extends HTMLElement` Requirement:** The provided APIs work with native elements directly, allowing you to upgrade any element without the boilerplate of extending a base class.

### Core API

*   `customElement.Registry(rootNode)`: Creates a new registry. If a `rootNode` (like `document.body`) is provided, it immediately starts listening for changes within that node.
*   `registry.listen(rootNode)`: Attaches a registry to a DOM node, activating it for that scope.
*   `registry.define(expression)`: Adds a function to the registry that will be executed against any new elements added to the scoped node.
*   `customElement.create('name', definition, { extends: 'p' })`: (Future API) Returns a custom element without global registration.
*   `customElement.upgrade(el, definition)`: (Future API) Upgrades a single element with a definition without global registration.

---

## Usage: The `customElement.Registry`

The `customElement.Registry` uses a `MutationObserver` to watch for new elements being added to the DOM and then applies your defined logic to them.

### Example: Creating and Using a Registry

Here are a few common use cases.

```javascript
// 1. Create a global registry listening on the entire document.
// If you replace 'document' with another DOM node, the registry becomes scoped to that node.
const myRegistry = customElement.Registry(document);

// Alternatively, create a registry now and attach it to a DOM node later.
const sharedRegistry = customElement.Registry();
sharedRegistry.listen(document.getElementById('my-app-root'));

// 2. Define an "expression" to run on every new element.
// This is a function that receives the newly added element as an argument.
const generalExpression = function(elem) {
  console.log(`${elem.tagName} was added to the DOM.`);
  // We can mimic the standard connectedCallback behavior
  if (typeof elem.connectedCallback === 'function') {
      elem.connectedCallback();
  }
};

// Add the expression to the registry.
myRegistry.define(generalExpression);


// 3. Define a more specific expression to create a component on-the-fly.
// This expression looks for an element with an 'is' attribute and upgrades it.
const componentExpression = function(elem) {
  // Check for a specific attribute to identify our component
  if (elem.getAttribute('is') === 'my-component-name') {
      // Define and immediately invoke its connectedCallback
      elem.connectedCallback = function() {
          this.innerText = 'Yahh, this works!';
          this.style.color = 'blue';
          this.style.fontWeight = 'bold';
      };
      elem.connectedCallback();
  }
};

// Add this more specific expression to the same registry.
myRegistry.define(componentExpression);
```

Now, anytime an element is added to the document, both expressions will run against it. If you add `<div is="my-component-name"></div>` to the page, it will be automatically transformed into your component.

---

## How It Works: Dynamic DOM Manipulation

This powerful approach leverages a `MutationObserver` and a custom element registry to transform elements on the fly as they are added to the DOM, allowing for a more declarative and modular way to build interactive user interfaces.

### The Custom Element Registry

Central to this pattern is the `customElement.Registry`. This JavaScript class manages the registration and application of your custom definitions. Because it can be scoped to any DOM node, it gives you precise control over where and when your components are activated.

### Defining Elements with Expressions

A key innovation here is defining element behaviors with simple functions ("expressions") rather than the more verbose class-based syntax of standard Web Components. The `define()` method accepts a function that receives the matched element as an argument. Inside this function, you can directly manipulate the element's properties, styles, and methods. This allows for lightweight, functional, and highly dynamic components.

This pattern represents a significant step forward in creating maintainable web applications. By combining the power of `MutationObserver` with a flexible and expressive custom element registry, developers can build complex user interfaces in a more component-based and declarative manner.

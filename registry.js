     /**
         * ---------------------------------------------------------------------
         *  CUSTOM ELEMENT REGISTRY IMPLEMENTATION
         * ---------------------------------------------------------------------
         */
        const customElement = {};

        customElement.Registry = class Registry {
            /**
             * @param {Node} [domNode] - An optional DOM node to listen to immediately.
             */
            constructor(domNode) {
                this.expressions = [];
                this.observer = null;

                if (domNode) {
                    this.listen(domNode);
                }
            }

            /**
             * Defines a new expression to be run against new elements.
             * @param {Function} expression - A function that takes a DOM element as its argument.
             */
            define(expression) {
                if (typeof expression !== 'function') {
                    throw new Error('Registry.define() expects a function.');
                }
                this.expressions.push(expression);
            }

            /**
             * Starts listening for changes on a given DOM node.
             * @param {Node} domNode - The DOM node to observe for added elements.
             */
            listen(domNode) {
                if (!domNode || typeof domNode.nodeType === 'undefined') {
                    throw new Error('Registry.listen() expects a valid DOM node.');
                }

                // Disconnect any previous observer
                if (this.observer) {
                    this.observer.disconnect();
                }

                const observerCallback = (mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                // We only care about element nodes
                                if (node.nodeType === 1) {
                                    this.expressions.forEach(expression => {
                                        try {
                                            expression(node);
                                        } catch (e) {
                                            console.error("Error applying expression:", e);
                                        }
                                    });
                                }
                            });
                        }
                    }
                };

                this.observer = new MutationObserver(observerCallback);
                this.observer.observe(domNode, {
                    childList: true,
                    subtree: true
                });
            }

            /**
             * Stops the observer from listening for changes.
             */
            disconnect() {
                if (this.observer) {
                    this.observer.disconnect();
                }
            }
        };

        /**
         * ---------------------------------------------------------------------
         *  EXAMPLE USAGE
         * ---------------------------------------------------------------------
         */

        // // 1. Create a global registry listening on the entire document body
        // const myRegistry = new customElement.Registry(document.body);

        // // 2. Register an expression that applies a connectedCallback-like function to every new element.
        // // This expression will turn the border of any new element green.
        // const expressionOne = function(elem) {
        //     console.log('Expression 1 applied to:', elem.tagName);
        //     elem.style.border = '2px solid green';
        //     // Mimic connectedCallback
        //     if (typeof elem.connectedCallback === 'function') {
        //         elem.connectedCallback();
        //     }
        // };
        // myRegistry.define(expressionOne);

        // // 3. Register a more specific expression for elements with is="my-component-name"
        // const expressionTwo = function(elem) {
        //     if (elem.getAttribute('is') === 'my-component-name') {
        //         console.log('Expression 2 applied to my-component-name');
        //         // Define and immediately call a "connectedCallback"
        //         elem.connectedCallback = function() {
        //             this.innerText = 'Yahh works';
        //             this.style.backgroundColor = 'yellow';
        //             this.style.padding = '10px';
        //             this.style.display = 'block'; // Make div visible
        //         };
        //         elem.connectedCallback();
        //     }
        // };
        // myRegistry.define(expressionTwo);


        // /**
        //  * ---------------------------------------------------------------------
        //  *  DEMO FUNCTIONS
        //  * ---------------------------------------------------------------------
        //  */
        // const container = document.getElementById('container');

        // function addGenericElement() {
        //     const newDiv = document.createElement('div');
        //     newDiv.innerText = 'I am a generic element.';
        //     newDiv.style.margin = '10px 0';
        //     container.appendChild(newDiv);
        // }

        // function addMyComponent() {
        //     const newComp = document.createElement('div');
        //     // 'is' is traditionally for extending built-in elements, 
        //     // but we use it here as a simple selector for our expression.
        //     newComp.setAttribute('is', 'my-component-name');
        //     newComp.style.margin = '10px 0';
        //     container.appendChild(newComp);
        // }

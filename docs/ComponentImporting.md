# [ZephJS](../README.md) > Writing Components > Importing ZephJS

### Sections

- [Quick Start](./ComponentQuickStart.md)
- [Component Concepts](./ComponentConcepts.md)
- **Importing ZephJS**
- [Defining the Component](./ComponentDefinition.md)
- [HTML](./ComponentMarkup.md)
- [CSS](./ComponentStyling.md)
- [Attributes](./ComponentAttributes.md)
- [Properties](./ComponentProperties.md)
- [Lifecycle Handlers](./ComponentLifecycleHandlers.md)
- [Bindings](./ComponentBindings.md)
- [Event Handlers](./ComponentEvents.md)
- [Bundling for Distribution](./docs/ComponentBundling.md)

### Importing ZephJS

Writing a web component with ZephJS is done with the ZephComponents library.  To use ZephComponents we must first import it into our JavaScript:

```
import {ZephComponents} from "./Zeph.js";
```

Additionally, all of the the definition methods we are going to use in our component definition need to be imported as well.  You could just wildcard this, but we prefer to call this out specifically.

```
import {ZephComponents} from "./Zeph.js";
import {html,css,attribute,property} from "./Zeph.js";
```

The following items can be imported from ZephJS:

 - ZephComponents
 - ZephServices
 - ZephService

The following definition methods can be imported from ZephJS:

 - **html**: Sets the HTML content of the element we are defining.

 - **css**: Sets the CSS content of the element we are defining.

 - **attribute**: Adds an attribute to the element we are defining.

 - **property**: Adds a property to the element we are defining.

 - **onInit**: Adds a handler for the Initialization Lifecycle Event the element we are defining.

 - **onCreate**: Adds a handler for the Creation Lifecycle Event the element we are defining.

 - **onAdd**: Adds a handler for the Addition Lifecycle Event the element we are defining.

 - **onRemove**: Adds a handler for the Removal Lifecycle Event the element we are defining.

 - **onAdopt**: Adds a handler for the Adoption Lifecycle Event the element we are defining.

 - **onAttribute**: Adds a handler for the Attribute Lifecycle Event the element we are defining.

 - **bind**: Bind an attribute, property, or content of the element we are defining to another attribute, property, or content of the element we are defining or its internal content.

 - **bindAt**: Bind an attribute, property, or content of the element we are defining or its internal content to another attribute, property, or content of the element we are defining or its internal content.

 - **onEvent**: Handle an event that occurs on the element we are defining.

 - **onEventAt**: Handle an event that occurs on the internal content of an element we are defining.

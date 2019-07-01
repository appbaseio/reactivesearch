---
title: 'Classname Injection'
meta_title: 'Importing Data'
meta_description: 'Bring your data from JSON or CSV files into appbase.io via the Import GUI.'
keywords:
    - reactivesearch
    - importing
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

ReactiveSearch components also allow `className` injections to overwrite the default styles for any component at a more granular level. This can be achieved with the `innerClass` prop.

## Usage

The `innerClass` prop accepts an object with keys as defined in the **Styles** section of each component. You can add the desired `className` value for each key and refer to them in your CSS.

## Examples

Here's an example of how to use `innerClass` with a [TextField](base-components/textfield.html) component:

![TextField annotated image](https://imgur.com/f20AvrZ.png)

```js
<TextField
    ...
    innerClass={{
        title: 'text-title',
        input: 'text-input'
    }}
/>
```

Then refer to them in your stylesheet.

```css
.text-title {
	font-size: 2rem;
}

.text-input {
	border: none;
}
```

## CSS Specificity

While writing styles using `innerClass`, it's important to keep [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) in mind in order to get the desired results.

In order for your classes to overwrite the default classes of ReactiveSearch components we recommend combining the `innerClass` classes with a container class. This will also give the correct results without depending on the order of loading of the stylesheets in production. For example:

```js
<TextField
    ...
    innerClass={{
        title: 'text-title',
        input: 'text-input'
    }}
    className="text-field"
/>
```

Then refer to them in your stylesheet with the container class as:

```css
.text-field .text-title {
	font-size: 2rem;
}

.text-field .text-input {
	border: none;
}
```

> Note
>
> Here we're using the `className` prop in the component to act as the container class, however, depending on your needs, this can also be acheived by surrounding the ReactiveSearch component in a container `<div className="container-class">...</div>`

---
title: 'Themes'
meta_title: 'Importing Data'
meta_description: 'Bring your data from JSON or CSV files into appbase.io via the Import GUI.'
keywords:
    - reactivesearch
    - importing
    - appbase
    - elasticsearch
sidebar: 'web-v2-reactivesearch'
---

Themes can be used to change the default styles for all the ReactiveSearch components. These include basic styles like fonts, colors or component styles. The component styles are applied to most of the components.

## Usage

[ReactiveBase](/getting-started/reactivebase.html) acts as the theme provider for all the child ReactiveSearch components. It supports a `theme` prop which accepts an object with the following defaults:

```js
{
	typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: '16px',
  },

	colors: {
		textColor: '#424242',
		primaryTextColor: '#fff',
		primaryColor: '#0B6AFF',
		titleColor: '#424242',
		alertColor: '#d9534f',
	}
};
```

[ReactiveBase](/getting-started/reactivebase.html) also supports a `themePreset` prop which defaults to `light` with the above defaults. You may pass a `themePreset` of `dark` which applies the following defaults instead:

```js
{
	typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: '16px',
  },

	colors: {
		textColor: '#fff',
		backgroundColor: '#212121',
		primaryTextColor: '#fff',
		primaryColor: '#2196F3',
		titleColor: '#fff',
		alertColor: '#d9534f',
		borderColor: '#666',
	}
};
```

## Extending theming

It's possible to use the same theming object used by the ReactiveSearch components in your own React components which are not connected with ReactiveSearch. All the child components of `ReactiveBase` receive the theming context which can be used as explained by the following example:

```js
// your component should be a child of ReactiveBase
<ReactiveBase
  ...
>
  <CustomComponent />
</ReactiveBase>
```

Using the `withTheme` higher order component from `emotion-theming` in our component:

```js
import { withTheme } from 'emotion-theming'

class CustomComponent extends React.Component {
  ...
  render() {
    const { theme } = this.props; // the theme object is received in the props
    return (
      ...
    );
  }
}

export default withTheme(CustomComponent);  // using the HOC from emotion-theming
```

## Examples

You can overwrite the aforementioned default styles by providing the respective key/values as `theme` prop. The supported keys are `typography`, `colors` and `component`. For example:

```js{4-15}
<ReactiveBase
  app="appname"
  credentials="abcdef123:abcdef12-ab12-ab12-ab12-abcdef123456"
  theme={{
    typography: {
      fontFamily: 'Raleway, Helvetica, sans-serif',
    },
    colors: {
      primaryColor: '#008000',
      titleColor: 'white',
    },
    component: {
      padding: 10
    }
  }}>
    <Component1 .. />
    <Component2 .. />
</ReactiveBase>
```

Check out the stories for `themePreset` set to `dark` on <a href="https://opensource.appbase.io/playground/?knob-themePreset=dark&selectedKind=theme&selectedStory=Dark%20Preset%20with%20ResultList&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs" target="_blank">playground</a>.

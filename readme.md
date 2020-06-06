# Overview

This is an unstable side project where I'm trying to use PrismJs, but as a [pure function](https://en.wikipedia.org/wiki/Pure_function).

## Usage

First, install `prism-functional` from `npm`:

```shell
npm install prism-functional
```

Import the module, import the language you need, and run the function on the code you need to highlight.

```
import prism from "prism-functional"
import langJavascript from "prism-functional/languages/javascript

const codeSnippet = 'console.log("Hello world!")'
const highlightedHtml = prism(codeSnippet, langJavascript)
```

## Available Languages

I've copy-pasta'd the following languages from [Prism's source](https://github.com/PrismJS/prism/tree/master/components). The original language files have to be modified slightly to declare and export the grammer rather than append it to the global `Prism` object. In addition, many languages use properties of the global `Prism` object, such as `Prism.languages.extend`. These had to be replaced with more pure-function-like versions.

The following languages can be imported immediately:

```js
// bash
import lang_bash from "prism-functional/languages/bash";
// clike
import lang_clike from "prism-functional/languages/clike";
// ebnf
import lang_ebnf from "prism-functional/languages/ebnf";
// go (extends "clike")
import lang_go from "prism-functional/languages/go";
// hcl - hashicorp configuration language
import lang_hcl from "prism-functional/languages/hcl";
//  javascript (extends "clike")
import lang_javascript from "prism-functional/languages/javascript";
//  sentinel (extends "clike")
import lang_sentinel from "prism-functional/languages/sentinel";
//  shell-session (uses "bash")
import lang_shell_session from "prism-functional/languages/shell-session";
```

So far, moving languages over has been a relatively straightforward and quick task. Ideally, I'd find a way to use the Prism source directly somehow rather than copying-and-pasting it, but frankly I don't know enough about javascript to even know whether that would be possible 😬

## Plugins and hooks

The proper version of PrismJS seems to have [a very robust plugin ecosystem](https://github.com/PrismJS/prism/tree/master/plugins). I have not attempted to recreate it in this "functional" version. I think it's probably possible, but I have much less experience with this kind of implementation, so I'm honestly not sure.

## Background

I was curious how PrismJS could be used in as simple of a way as possible, in a portable way. For example, I wanted to be able to use Prism to highlight code when processing markdown, and also wanted to use it in a React component. I found it challenging to do these things - it seems like [typical usage](https://prismjs.com) is targeted at running Prism in the browser.

However, I didn't want to give up on Prism - I really like how lightweight it is, and I really like the number of languages available, and the tools for defining new language grammars.

I feel more familiar with functional programming paradigms, and the more I thought about, the more I landed on wanting to use Prism like this:

```js
const highlightedHtml = prism(code, language);
```

This led me towards trying to lazily adapt PrismJS to meet this need. I've basically just tried to recreate [`Prism.highlight`](https://github.com/PrismJS/prism/blob/1e3f542be065f04bf9f9f109e92c08b1370572ad/prism.js#L327) in a more pure-function-ish way.

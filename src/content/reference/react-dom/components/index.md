---
title: "مكوّنات React DOM"
---

<Intro>

يدعم React جميع مكوّنات [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) و [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) المدمجة في المتصفح.

</Intro>

---

## المكوّنات الشائعة {/*common-components*/}

تدعم جميع مكوّنات المتصفح المدمجة بعض الخصائص والأحداث.

* [مكوّنات شائعة (مثل `<div>`)](/reference/react-dom/components/common)

يشمل ذلك خصائص React الخاصة مثل `ref` و `dangerouslySetInnerHTML`.

---

## مكوّنات النماذج {/*form-components*/}

تقبل مكوّنات المتصفح المدمجة هذه إدخال المستخدم:

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

تتميّز في React لأن تمرير خاصية `value` إليها يجعلها *[متحكَّمًا فيها.](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)*

---

## مكوّنات الموارد والبيانات الوصفية {/*resource-and-metadata-components*/}

تتيح لك مكوّنات المتصفح المدمجة هذه تحميل موارد خارجية أو إثراء المستند ببيانات وصفية:

* [`<link>`](/reference/react-dom/components/link)
* [`<meta>`](/reference/react-dom/components/meta)
* [`<script>`](/reference/react-dom/components/script)
* [`<style>`](/reference/react-dom/components/style)
* [`<title>`](/reference/react-dom/components/title)

تتميّز في React لأن React يمكنه تصييرها في رأس المستند، وتعليق التنفيذ أثناء تحميل الموارد، وتطبيق سلوكيات أخرى تُوضَّح في صفحة المرجع لكل مكوّن.

---

## جميع مكوّنات HTML {/*all-html-components*/}

يدعم React جميع مكوّنات HTML المدمجة في المتصفح. من ذلك:

* [`<aside>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h1)
* [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)

<Note>

مثل [معيار DOM،](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) يستخدم React تسمية `camelCase` لأسماء الخصائص. مثلاً تكتب `tabIndex` بدلًا من `tabindex`. يمكنك تحويل HTML الحالي إلى JSX باستخدام [محوّل على الويب.](https://transform.tools/html-to-jsx)

</Note>

---

### عناصر HTML مخصصة {/*custom-html-elements*/}

إذا صيّرت وسمًا يحتوي على شرطة، مثل `<my-element>`، فسيفترض React أنك تريد تصيير [عنصر HTML مخصص.](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

إذا صيّرت عنصر HTML مدمجًا مع سمة [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is)، فسيُعامل أيضًا كعنصر مخصص.

#### تعيين القيم على العناصر المخصصة {/*attributes-vs-properties*/}

للعناصر المخصصة طريقتان لتمرير البيانات إليها:

1) السمات: تظهر في التعليمات ولا يمكن تعيينها إلا لقيم نصية  
2) الخصائص: لا تظهر في التعليمات ويمكن تعيينها لقيم JavaScript بأي نوع

بشكل افتراضي، يمرّر React القيم المربوطة في JSX كسمات:

```jsx
<my-element value="Hello, world!"></my-element>
```

تُسلسل القيم غير النصية الممرَّرة للعناصر المخصصة افتراضيًا:

```jsx
// ستُمرَّر كـ `"1,2,3"` أي ناتج `[1,2,3].toString()`
<my-element value={[1,2,3]}></my-element>
```

سيتعرّف React مع ذلك على خاصية عنصر مخصص يمكنه تمرير قيم بأي نوع إليها إذا ظهر اسم الخاصية على الصنف أثناء الإنشاء:

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```js src/MyElement.js active
export class MyElement extends HTMLElement {
  constructor() {
    super();
    // The value here will be overwritten by React 
    // when initialized as an element
    this.value = undefined;
  }

  connectedCallback() {
    this.innerHTML = this.value.join(", ");
  }
}
```

```js src/App.js
export function App() {
  return <my-element value={[1,2,3]}></my-element>
}
```

</Sandpack>

#### الاستماع للأحداث على العناصر المخصصة {/*custom-element-events*/}

من الأنماط الشائعة مع العناصر المخصصة أنها قد ترسل [`CustomEvent`s](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) بدل قبول دالة تُستدعى عند حدوث الحدث. يمكنك الاستماع لهذه الأحداث باستخدام بادئة `on` عند الربط عبر JSX.

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```javascript src/MyElement.js
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.test = undefined;
    this.emitEvent = this._emitEvent.bind(this);
  }

  _emitEvent() {
    const event = new CustomEvent('speak', {
      detail: {
        message: 'Hello, world!',
      },
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.el = document.createElement('button');
    this.el.innerText = 'Say hi';
    this.el.addEventListener('click', this.emitEvent);
    this.appendChild(this.el);
  }

  disconnectedCallback() {
    this.el.removeEventListener('click', this.emitEvent);
  }
}
```

```jsx src/App.js active
export function App() {
  return (
    <my-element
      onspeak={e => console.log(e.detail.message)}
    ></my-element>
  )
}
```

</Sandpack>

<Note>

الأحداث حسّاسة لحالة الأحرف وتدعم الشرطات (`-`). احفظ حالة الأحرف في اسم الحدث وضمّن كل الشرطات عند الاستماع لأحداث العنصر المخصص:

```jsx
// Listens for `say-hi` events
<my-element onsay-hi={console.log}></my-element>
// Listens for `sayHi` events
<my-element onsayHi={console.log}></my-element>
```

</Note>
---

## جميع مكوّنات SVG {/*all-svg-components*/}

يدعم React جميع مكوّنات SVG المدمجة في المتصفح. من ذلك:

* [`<a>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/view)

<Note>

مثل [معيار DOM،](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) يستخدم React تسمية `camelCase` لأسماء الخصائص. مثلاً تكتب `tabIndex` بدلًا من `tabindex`. يمكنك تحويل SVG الحالي إلى JSX باستخدام [محوّل على الويب.](https://transform.tools/)

يجب كتابة السمات ذات المساحة الاسمية بدون النقطتين:

* `xlink:actuate` تصبح `xlinkActuate`.
* `xlink:arcrole` تصبح `xlinkArcrole`.
* `xlink:href` تصبح `xlinkHref`.
* `xlink:role` تصبح `xlinkRole`.
* `xlink:show` تصبح `xlinkShow`.
* `xlink:title` تصبح `xlinkTitle`.
* `xlink:type` تصبح `xlinkType`.
* `xml:base` تصبح `xmlBase`.
* `xml:lang` تصبح `xmlLang`.
* `xml:space` تصبح `xmlSpace`.
* `xmlns:xlink` تصبح `xmlnsXlink`.

</Note>

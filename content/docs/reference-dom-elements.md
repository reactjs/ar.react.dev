---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

تعتمد React نظام DOM معتمد على المتصفّح من أجل الأداء والتوافقية بين المتصفحات. أخذنا عند بناء React الفرصة لتجاوز بعض الصعوبات في طريقة اعتماد DOM في المتصفّح.

يجب في React كتابة جميع خاصيّات HTML وخاصيّات الكائنات في DOM (بما في ذلك معالجات الأحداث) بطريقة سنام الجمل (camelCase). على سبيل المثال تتوافق خاصيّة HTML التي تُدعى `tabindex` مع الخاصيّة `tabindex` في React. الاستثناء الوحيد هو خاصيّات `aria-*‎` `و data-*`‎، والتي يجب كتابتها بأحرف صغيرة. على سبيل المثال بإمكانك الاحتفاظ بالخاصيّة `aria-label` باسمها `aria-label`.

## الفوارق بين خاصيّات HTML {#differences-in-attributes}

هنالك عدد من خاصيّات HTML التي تعمل بشكل مختلف بين React و HTML:

### checked {#checked}

الخاصيّة `checked` مدعومة من قبل مكوّنات `‎<input>‎` من النوع `checkbox` أو `radio`. بإمكانك استخدامها لتحديد ما إذا كان المكوّن مُختارًا أم لا. يُفيد ذلك لبناء مكوّنات مضبوطة. إنّ الخاصيّة `defaultChecked` هي المكافئة في المكوّنات غير المضبوطة والتي تُحدّد ما إذا كان المكوّن مختارًا عند وصله.

### className {#classname}

استخدم الخاصيّة `className` لتحديد صنف CSS. ينطبق ذلك على جميع عناصر DOM و SVG الاعتيادية مثل ‎`<div>`‎ و `‎<a>‎`، وغيرها.

إن كنت تستخدم React مع مكوّنات الويب (وهو أمرٌ غير شائع) فاستخدم الخاصيّة class بدلًا من ذلك.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

الخاصيّة `dangerouslySetInnerHTML` هي بديل React لاستخدام `innerHTML` في DOM المتصفح. يكون تعيين HTML من الشيفرة أمرًا خطيرًا بشكلٍ عام لأنّه من السهل تعريق مستخدميك إلى [هجمات (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack `dangerouslySetInnerHTML`وتمرير كائن مع المفتاح `__html` key, لتذكير نفسك بخطر فعل ذلك. على سبيل المثال:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

لمّا كانت `for` كلمة محجوزة في JavaScript، فتستخدم عناصر React الخاصيّة `htmlFor` بدلًا من ذلك.

### onChange {#onchange}

يسلك الحدث `onChange` السلوك الذي تتوقعه منه، فعند تغيّر حقل إدخال يُطلَق هذا الحدث. لا نستخدم عن قصد السلوك الحالي للمتصفح لأنّ الحدث `onChange` هو تسمية خاطئة لسلوكه وتعتمد React على هذا الحدث للتعامل مع مدخلات المستخدم في الزمن الحقيقي.

### selected {#selected}

الخاصيّة `selected` مدعومة من قبل المكوّن ‎`<option>‎`. تستطيع استخدامها لتحديد ما إذا كان المكوّن مُحدَّدًا. يُفيد هذا لبناء مكوّنات مضبوطة.

### style {#style}

>ملاحظة
>
> تستخدم بعض الأمثلة في التوثيق الخاصيّة `style` للسهولة، ولكنّ استخدام الخاصيّة `‎<option>‎` كوسيلة أساسية لتنسيق العناصر هو أمر غير مفضّل بشكلٍ عام. يجب في معظم الحالات استخدام الخاصيّة `className` للإشارة إلى الأصناف المعرّفة في ملف تنسيق `CSS` خارجي. تُستخدَم الخاصيّة `style` غالبًا في تطبيقات React لإضافة تنسيقات محسوبة بشكل ديناميكي في الزمن الحقيقي. انظر أيضًا: [الأسئلة الأكثر شيوعًا: التنسيق و CSS](/docs/faq-styling.html).

تقبل الخاصيّة `style` كائن JavaScript مع خاصيّات مكتوبة بشكل camelCase بدلًا من سلاسل نصيّة في CSS. يتوافق ذلك مع خاصيّة `style` في JavaScript، وهو أكثر كفاءة، ويمنع هجمات XSS. على سبيل المثال:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

انتبه إلى عدم إرفاق لاحقة بشكل تلقائي للتنسيقات. لدعم المتصفحات الأقدم تحتاج إلى تزويد خاصيّات التنسيق الموافقة:

```js
const divStyle = {
  WebkitTransition: 'all', // الكبير هنا W انتبه إلى حرف
  msTransition: 'all' // ms هي البادئة الوحيدة المكتوبة بأحرف صغيرة
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

مفاتيح التنسيق مكتوبة بالشكل camelCase لكي تكون متوافقة مع الوصول إلى الخاصيّات في عقد DOM من JavaScript (مثل `node.style.backgroundImage`). أي بادئة [ما عدا `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) يجب أن تبدأ بحرف كبير، ولهذا السبب تبدأ`WebkitTransition` بحرف  "W" كبير.

تُضيف React بشكل تلقائي اللاحقة `px` لبعض الخاصيّات العددية السطرية. إن أردت استخدام وحدات أخرى غير `px` فحدد القيمة كسلسلة نصية باسم الواحدة المطلوبة، على سبيل المثال:

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

انتبه إلى تحويل كافة خاصيّات التنسيق إلى الواحدة `pixel` على الرغم من ذلك. وتبقى بعض الخاصيّات بدون واحدات مثل `zoom`، و `order`، و `flex`). للحصول على لائحة كاملة بالخاصيّات التي لا تملك واحدة [انظر هنا](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

ينتج عادة تحذير عند وضع العلامة`contentEditable`, على أي عنصر له عناصر أبناء لأنّها لن تعمل. توقف هذه الخاصيّة ذلك التحذير. لا تستخدم هذه الخاصيّة ما لم تكن تبني مكتبة مثل[Draft.js](https://facebook.github.io/draft-js/) والتي تُدير `contentEditable` بشكلٍ يدوي.

### suppressHydrationWarning {#suppresshydrationwarning}

إن كنت تستخدم تصيير React من جانب الخادم فهناك بشكل طبيعي تحذير عند تصيير الخادم والعميل لمحتوى مختلف. ولكن في بعض الحالات النادرة من الصعب أو المستحيل ضمان التطابق التام. مثلًا من المتوقع أن يختلف التوقيت بين الخادم والعميل.

إن عيّنتَ قيمة  `suppressHydrationWarning` إلى `true`, فلن تحذرك React حول عدم التطابق في الخاصيّات والمحتوى لذلك العنصر. تعمل هذه الخاصيّة فقط في مستوى واحد من المكوّنات. لا تفرط في استخدامها. بإمكانك قراءة المزيد حول hydration في توثيق [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).

### value {#value}

تكون الخاصيّة value مدعومة من المكوّنين `<input>` و `<textarea>`  بإمكانك استخدامها لتعيين قيمة المكوّن. يُفيد هذا في بناء مكوّنات مضبوطة. الخاصيّة `defaultValue` هي المكافئ في المكوّنات غير المضبوطة، والتي تُعيِّن قيمة المكوّن عند الوصل.

## كافة خاصيّات HTML المدعومة {#all-supported-html-attributes}

بدءًا من إصدار React 16 فإنّ أي خاصيّات DOM معياريّة أو [مخصصة](/blog/2017/09/08/dom-attributes-in-react-16.html) مدعومة بشكل كامل.

تزوّدنا React بواجهة برمجة تطبيق مرتكزة على JavaScript لأجل DOM. بما أنّ مكونات React تأخذ عادةً خاصيّات مخصصة أو متعلقة بـ DOM، فإنّ React تستخدم طريقة الكتابة camelCase مثل واجهات برمجة تطبيق DOM:

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

تعمل هذه الخاصيّات بشكل مماثل لخاصيّات HTML الموافقة لها باستثناء الحالات الخاصيّة التي وثقناها بالأعلى. تتضمّن بعض خاصيّات DOM المدعومة من React:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

وبشكل مماثل تكون جميع خاصيّات SVG مدعومة بشكل كامل:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

بإمكانك أيضًا استخدام خاصيّات HTML مخصّصة طالما أنّها مكتوبة بأحرف صغيرة بشكلٍ كامل.

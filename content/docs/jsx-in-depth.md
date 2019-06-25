---
id: jsx-in-depth
title: شرح JSX بالتفصيل
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

توفِّر JSX علينا عناء إنشاء العناصر بإستخدام الدالة `React.createElement(component, props, ...children)`. انظر إلى الشيفرة التالية في JSX:


```js
<MyButton color="blue" shadowSize={2}>
  انقر هنا
</MyButton>
```

تُترجَم الشيفرة السّابقة إلى:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'انقر هنا'
)
```

بإمكانك أيضًا استخدام الشكل ذاتي الإغلاق للعنصر إن كان لا يحتوي على أيّة عناصر أبناء:

```js
<div className="sidebar" />
```

تُترجَم الشيفرة السّابقة إلى:

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

إن أردتَ اختبار كيفيّة تحويل بعض شيفرات JSX إلى JavaScript فبإمكانك تجريب [مُترجِم Babel على الإنترنت](babel://jsx-simple-example).

## تحديد نوع عنصر React {#specifying-the-react-element-type}

يُحدِّد الحرف الأول في وسم JSX نوعَ عنصر React.

تُشير الأنواع التي تبدأ بحرف كبيرة (Capitalized types) إلى أنّ العنصر المذكور هو مُكوِّن React. تُترجَم هذه العناصر إلى مرجع مباشر إلى المتغيّر الذي يحمل اسمها، لذا إن استخدمت التعبير ‎`<Foo />`‎ في JSX يجب أن يكون المتغيّر `Foo` في نفس المجال.

### يجب على React أن تكون في نفس المجال {#react-must-be-in-scope}

لمّا كانت JSX تُترجَم إلى نداءات للتابع `React.createElement`، فيجب على مكتبة `React` أن تكون في نفس المجال الذي تكون فيه شيفرة JSX.

على سبيل المثال الاستيراد التالي ضروري في هذه الشّيفرة على الرغم من أنّ `React` و `CustomButton` لا يُشار إليهما بشكل مباشر من JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

إن لم تستخدم مُحزِّم JavaScript وطلبتَ `React` من داخل عنصر `<script>`، فهي موجودة مُسبقًا في نفس المدى لأنّها عامّة (global).

### استخدام النقطة لأنواع JSX {#using-dot-notation-for-jsx-type}

بإمكانك الإشارة أيضًا إلى مُكوِّن React باستخدام النقطة من داخل JSX. وهو أمرٌ جيّد إن كانت لديك وحدة (module) وحيدة والتي تُصدِّر عدّة مُكوِّنات React. على سبيل المثال إن كان `MyComponents.DatePicker` مُكوِّنًا، فيُمكِنك استخدامه بشكلٍ مباشر من JSX كما يلي:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>تخيّل وجود {props.color} انتقاء للتاريخ هنا.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### يجب كتابة المكونات المعرفة من قبل المستخدم بأحرف كبيرة {#user-defined-components-must-be-capitalized}

عندما يبدأ نوع العنصر بحرف صغير، فهو يُشير إلى مُكوِّنات داخليّة مثل `<div>` أو `<span>` وينتج عنه السلسلة النصيّة `'div'` أو `'span'` والتي تُمرَّر إلى التّابع `React.createElement`. أمّا الأنواع التي تبدأ بأحرف كبيرة مثل ‎`<Foo />` فتُترجَم إلى `React.createElement(Foo)` وتُوافِق مُكوِّنات مُعرَّفة أو مُستوردة في ملّف JavaScript لديك.

نوصي بتسمية المُكوِّنات بأحرف كبيرة، وإن كان لديك مُكوِّن يبدأ بحرف صغير فعيّنه إلى مُتغيّر يبدأ بحرف كبير قبل استخدامه في JSX.

على سبيل المثال لن تعمل الشيفرة التالية كما هو مُتوقَّع:

```js{3,4,10,11}
import React from 'react';

// :خطأ! هذا مُكوِّن ويجب أن يبدأ بحرف كبير
function hello(props) {
  // صحيح! هنا استخدام العنصر div صحيح كونه عنصر في HTML
  return <div>أهلًا  {props.toWhat}</div>;
}

function HelloWorld() {
  // خطأ! تعتقد React أنّ العنصر hello هو عنصر في HTML لأنّه لا يبدأ بحرف كبير
  return <hello toWhat="بالعالم" />;
}
```

لإصلاح ذلك سنُعيد تسمية `hello` إلى `Hello` وسنستخدم `<Hello />`‎ للإشارة إليه:

```js{3,4,10,11}
import React from 'react';

// صحيح! هذا مُكوِّن ويجب أن يبدأ بحرف كبير
function Hello(props) {
  // صحيح! هنا استخدام العنصر div صحيح كونه عنصر في HTML
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // صحيح! تعلم React أنّ Hello هو مُكوِّن لأنّه يبدأ بحرف كبير
  return <Hello toWhat="World" />;
}
```

### اختيار النوع في زمن التنفيذ {#choosing-the-type-at-runtime}

لا يُمكنِك استخدام تعبير عام كنوع لعنصر React، فإن لم ترغب باستخدام تعبير عام للإشارة لنوع العنصر، فعيّنه فقط إلى متغيّر يبدأ بحرف كبير أولًا. يحدث هذا عادةً عندما تريد تصيير مُكوِّن آخر بناءً على خاصيّة prop:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // خطأ! لا يمكن أن يكون نوع JSX عبارة عن تعبير
  return <components[props.storyType] story={props.story} />;
}
```

لإصلاح ذلك سنُعيِّن النوع إلى متغيّر يبدأ بحرف كبير أولًا:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // صحيح! يُمكِن لنوع JSX أن يكون متغيّرًا يبدأ بحرف كبير
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## الخاصيات props في JSX {#props-in-jsx}

هنالك عدّة طرق لتحديد الخاصيّات في JSX.

### تعابير JavaScript كخاصيات {#javascript-expressions-as-props}

بإمكانك تمرير أي تعبير JavaScript كخاصيّة prop عن طريق إحاطته بالقوسين `{}`. على سبيل المثال:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

بالنسبة للمُكوِّن `MyComponent` تكون قيمة `props.foo` هي `10` بسبب تقييم التعبير ‎`1 + 2 + 3 + 4`.

لا تُعدُّ جمل `if` الشرطيّة و حلقات `for` تعابيرًا في JavaScript، لذلك لا يُمكِن استخدامها في JSX بشكلٍ مباشر، وبدلًا من ذلك بإمكاننا وضعها في الشيفرة المُحيطة. على سبيل المثال:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>فردي</i>;
  }
  return <div>{props.number} هو عدد {description}</div>;
}
```

يُمكِنك تعلّم المزيد حول [التصيير الشرطي](/docs/conditional-rendering.html) واستخدام [loops](/docs/lists-and-keys.html) في أقسامها الخاصّة.

### استخدام السلاسل النصيّة الحرفيّة {#string-literals}

بإمكانك تمرير سلسلة نصيّة حرفيّة كخاصيّة، فالتعبيران التاليان في JSX مُتكافئان:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

عندما تُمرِّر سلسلة نصيّة حرفيّة، ستُهرَّب قيمتها (HTML-unescaped) بشكلٍ افتراضي. لذلك التعبيران التاليان مُتكافئان أيضًا:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

لا علاقة لهذا السّلوك بموضوعنا، ولكن ذكرناه هنا من أجل الفائدة.

### القيمة الافتراضيّة للخاصيّات props هي true {#props-default-to-true}

إن لم تُمرِّر أي قيمة للخاصيّة فقيمتها الافتراضيّة هي `true`. التعبيران التاليان مُتكافئان:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

لا نُوصي إجمالًا بفعل ذلك بسبب الارتباك الذي يُسبّبه التشابه مع [ الصيغة المختصرة للكائنات في ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015)، حيث تكون `{foo}` اختصارًا إلى `{foo: foo}` بدلًا من ‎`{foo: true}`‎ كما قد تظن. هذا السّلوك موجود هنا فقط للتوافق مع سلوك HTML.

### خاصيّات النشر {#spread-attributes}

إن كانت لديك خاصيّات `props` على شكل كائنات، وأردتَ تمريرها في JSX، فبإمكانك استخدام مُعامِل النشر `...` لتمرير كائن الخاصيّات بشكلٍ كامل. المُكوِّنان التاليان مُتكافئان:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

بإمكانك أيضًا اختيار خاصيّات مُحدّدة يُحدِّد قيمتها مُكوِّنك وتمرير الخاصيّات الأخرى باستخدام مُعامِل النشر:

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        أهلًا بالعالم!
      </Button>
    </div>
  );
};
```

في المثال السّابق، حدّدنا قيمة الخاصيّة `kind` و*لم* نُمرِّرها إلى العنصر `<button>` في DOM. تُمرَّر كافّة الخاصيّات الأخرى عبر الكائن ‎`...other`‎ ممّا يجعل هذا المُكوِّن مرنًا بشدّة. بإمكانك أن ترى أنّه يُمرِّر خاصيّات `onClick` و `children`.

قد تكون خاصيّات النشر مفيدة ولكنّها تُسهِّل تمرير خاصيّات غير ضروريّة إلى المُكوِّنات التي لا تُبالي لها، أو تمرير خاصيّات HTML خطأ إلى DOM. نُوصي باستخدام هذه الصّياغة بحذر. 

## العناصر الأبناء في JSX {#children-in-jsx}

يُمرَّر المحتوى الموجود بين عنصر البدء وعنصر الإغلاق في JSX كخاصيّة مُميّزة وهي `props.children`. هنالك عدّة طرق مختلفة لتمرير العناصر الأبناء:

### السلاسل النصيّة الحرفيّة {#string-literals-1}

بإمكانك وضع سلسلة نصيّة بين عنصري البدء والإغلاق وستكون قيمة الخاصيّة `props.children` هي تلك السلسلة النصيّة. يُفيد ذلك من أجل العديد من عناصر HTML الداخليّة، على سبيل المثال:

```js
<MyComponent>أهلًا بالعالم!</MyComponent>
```

هذه الصيغة صحيحة في JSX، وستكون قيمة `props.children` في المُكوِّن `MyComponent` هي السلسلة النصيّة `"أهلًا بالعالم!"`. تُهرَّب السلسلة النصيّة لذلك بإمكانك كتابة JSX كما تكتب HTML بهذه الطريقة:

```html
<div>هذه السلسلة النصيّة صالحة بنفس الوقت في HTML &amp; JSX</div>
```

تُزيل JSX المسافات الفارغة في بداية ونهاية السطر، كما تُزيل الأسطر الفارغة والأسطر الجديدة التي تسبق العناصر. تُجمَّع الأسطر الجديدة التي تكون في وسط السلسلة النصيّة إلى مسافة فارغة واحدة. لذا يكون ناتج هذه الأمثلة مُتماثلًا:

```js
<div>أهلًا بالعالم</div>

<div>
  أهلًا بالعالم
</div>

<div>
  أهلًا
  بالعالم
</div>

<div>

  أهلًا بالعالم
</div>
```

### العناصر الأبناء {#jsx-children}

بإمكانك إضافة المزيد من عناصر JSX كأبناء، وهذا يُفيد في عرض المُكوِّنات المتداخلة:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

بإمكانك دمج عدّة أنواع مختلفة من العناصر الأبناء معًا، أي يُمكِنك استخدام السلاسل النصيّة الحرفيّة مع العناصر. وهذا أمرٌ آخر تتشابه فيه JSX مع HTML، لذا يكون المثال التالي صحيحًا في JSX و HTML:

```html
<div>
  هذه هي القائمة:
  <ul>
    <li>العنصر 1</li>
    <li>العنصر 2</li>
  </ul>
</div>
```

يستطيع مُكوِّن React أن يُعيد مصفوفة من العناصر:

```js
render() {
  // لا حاجة لوضع عناصر القائمة ضمن عنصر إضافي
  return [
	// لاتنس المفاتيح :) 
    <li key="A">العنصر الأول</li>,
    <li key="B">العنصر الثاني</li>,
    <li key="C">العنصر الثالث</li>,
  ];
}
```

### استخدام تعابير JavaScript كعناصر أبناء {#javascript-expressions-as-children}

بإمكانك تمرير أي تعبير في JavaScript كعنصر ابن عن طريق تغليفه باستخدام القوسين `{}`. فمثلًا هذا التعبيران مُتكافئان:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

يُفيد هذا عادةً في تصيير قائمة من تعابير JSX ذات أطوال مختلفة كما يلي:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['إنهاء المستند', 'تقديم الطلبات', 'مراجعة الطلب'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

يُمكِن دمج تعابير JavaScript مع أنواع مختلفة من العناصر الأبناء:

```js{2}
function Hello(props) {
  return <div>أهلًا {props.addressee}!</div>;
}
```

### استخدام الدوال كعناصر أبناء {#functions-as-children}

تُقيَّم عادةً تعابير JavaScript المُدخلَة في JSX إلى سلاسل نصيّة، عناصر React، أو قائمة من هذه الأشياء. ولكن يعمل `props.children` مثل أي خاصيّة في أنّه يستطيع تمرير أي نوع من البيانات وليس فقط الأنواع التي تعلم React كيفيّة تصييرها. فمثلًا إن كان لديك مُكوِّن مُخصَّص تستطيع أن تجعله يأخذ رد نداء مثل `props.children`:

```js{4,13}
// استدعاء رد نداء العناصر الأبناء عدد من المرات لإنشاء مُكوِن مُكرّر
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>هذا هو العنصر {index} في القائمة</div>}
    </Repeat>
  );
}
```

يُمكِن للعناصر الأبناء المُمرَّرة للمُكوِّن المُخصَّص أن تكون أي شيء طالما يُحوِّلها هذا المُكوِّن إلى شيء تفهمه React قبل تصييرها. هذا الاستعمال ليس شائعًا ولكنّه موجود إن أردت.

### تتجاهل JSX القيم المنطقيّة (Booleans)، و Null، والقيم غير المُعرَّفة Undefined{#booleans-null-and-undefined-are-ignored}

تُعدُّ القيم `false` و `null`، و `undefined`، و `true` عناصر أبناء صحيحة، ولكنّها ببساطة لا تُصيَّر. حيث ينتج عن التعابير التالية في JSX نفس النتيجة:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

يُفيد هذا في التصيير الشرطي لعناصر React. ففي المثال التالي تُصيِّر JSX فقط المُكوِّن `<Header />`‎ إن كانت قيمة `showHeader` هي `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

تُصيِّر React [القيم الكاذبة](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) مثل العدد صفر. فمثلًا لن تعمل الشيفرة التالية كما تتوقّع لأنّه ستطبع العدد `0` عندما تكون المصفوفة  `props.messages` فارغة:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

لإصلاح ذلك احرص أن يكون التعبير قبل المُعامِل `&&` قيمة منطقيّة دومًا:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

إن أردتَ بشكلٍ مُعاكِس أن تظهر القيم مثل `false`، و `true`، و `null`، و `undefined` في الناتج، فيجب عليك [تحويلها إلى سلسلة نصيّة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) أولًا:

```js{2}
<div>
  متغير JavaScript قيمته {String(myVariable)}.
</div>
```

---
id: tutorial
title: الدليل التطبيقي: مدخل إلى React
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

لا يفترض هذا الدليل أي معرفة مسبقة بمكتبة React.

## قبل أن نبدأ بالدليل التطبيقي {#before-we-start-the-tutorial}

سنبني لعبة صغيرة خلال هذا الدليل التطبيقي. **ربّما قد ترغب بتخطي هذا الدليل لأنّك لا تريد بناء الألعاب، ولكن أعطيها فرصة.** إنّ التقنيات التي ستتعلمها في هذا الدليل أساسيّة لبناء أي تطبيق React، وسيعطيك إتقانها فهمًا أعمق لمكتبة React.

>نصيحة
>
>هذا الدليل مُصمَّم للأشخاص الذين يُفضّلون **التعلّم بالممارسة**. إن كنت تُفضّل تعلّم المفاهيم من البداية فارجع إلى [مستندات React من البداية خطوة بخطوة](/docs/hello-world.html). قد تجد هذا الدليل متكاملًا مع مستندات React.

هذا الدليل مقسّم إلى عدّة أقسام:

* يُعطيك قسم [الإعداد من أجل الدليل التطبيقي](#setup-for-the-tutorial) **نقطة بداية** لمتابعة الدليل.
* يُعلّمك قسم [لمحة عامّة](#overview) **أساسيات** React: المكوّنات، والخاصيّات، والحالة.
* يُعلِّمك قسم [إكمال اللعبة](#completing-the-game) **أشيع التقنيات** في تطوير React.
* يُعطيك قسم [إضافة السفر عبر الزمن](#adding-time-travel) **نظرة أعمق** إلى نقاط القوة الفريدة لمكتبة React.

لا يجب عليك إكمال جميع الأقسام دفعة واحدة للحصول على الفائدة المرجوة من هذا الدليل. حاول الذهاب أبعد ما يمكن حتى ولو كان قسمًا أو قسمين.

لا بأس من نسخ ولصق الشيفرة عند متابعتك مع هذا الدليل، ولكن نوصي أن تكتبها بيدك. سيُساعدك ذلك بتطوير ذاكرتك وبإعطائك فهمًا أعمق لمكتبة React.

###ماذا سنبني؟ {#what-are-we-building}

سنرى في هذا الدليل كيفيّة بناء لعبة إكس-أو (اسمها بالإنجليزيّة tic-tac-toe) باستخدام React.

بإمكانك أن ترى **[النتيجة النهائيّة لما سنبنيه من هنا](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. إن كانت الشيفرة غير مفهومة بالنسبة لك أو كنتَ غير متآلف مع صياغة الشيفرة، فلا تقلق! فالهدف من هذا الدليل هو مساعدتك على فهم React وصياغتها.

نوصي بأن تلقي نظرة على لعبة إكس-أو قبل المتابعة. إحدى الميزات التي ستلاحظها وجود قائمة مُرقّمة على يمين لوحة اللعبة. تُعطيك هذه القائمة سجلًّا عن كل التحركات التي حصلت في اللعبة، وتُحدَّث بينما تستمر اللعبة.

تستطيع إغلاق لعبة إكس-أو بعدما تتآلف معها. سننطلق من قالب بسيط في هذا الدليل. خطوتنا التالية هي إتمام الإعداد لكي تستطيع البدء ببناء اللعبة.

### المتطلّبات الأساسيّة {#prerequisites}

سنفترض أنّك متآلف مع HTML و JavaScript، ولكن يجب أن تكون قادرًا على المتابعة حتى ولو كنت قادمًا من لغة برمجة أخرى. سنفترض أنّك متآلف مع المفاهيم البرمجيّة مثل الدوال، والكائنات، والمصفوفات، وبدرجة أقل الأصناف.

إن احتجت لمراجعة JavaScript نوصيك بالرجوع إلى [مستندات JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) في موسوعة حسوب. لاحظ أنّنا نستخدم بعض الميزات من ES6، وهي إصدار جديد من JavaScript. سنستخدم في هذا الدليل [الدوال السهمية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)، [الأصناف](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)، والتصريحين [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) و [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). بإمكانك استخدام [Babel REPL](babel://es5-syntax-example) لتتحقّق إلى ماذا تُصرَّف شيفرة ES6.

## الإعداد من أجل الدليل {#setup-for-the-tutorial}

هناك طريقتان لإكمال هذا الدليل، بإمكانك إمّا كتابة الشيفرة في متصفحك، أو إعداد بيئة تطوير محلية على حاسوبك.

### الخيار الأول للإعداد: كتابة الشيفرة في المتصفح {#setup-option-1-write-code-in-the-browser}

هذه أسرع طريقة للبدء.

في البداية افتح **[هذه الشيفرة المبدئيّة](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** في نافذة جديدة. يجب أن تعرض النافذة الجديدة لوحة لعبة إكس-أو وشيفرة React. سنُعدِّل شيفرة React في هذا الدليل.

بإمكانك الآن تجاوز الخيار الثاني للإعداد والذهاب إلى قسم [لمحة عامّة](#overview) للحصول على لمحة عامّة عن React.

### الخيار الثاني للإعداد: بيئة التطوير المحليّة {#setup-option-2-local-development-environment}

هذا الخيار اختياري وغير مطلوب من أجل هذا الدليل.

<br>

<details>

<summary><b>اختياري: تعليمات للمتابعة بشكل محلي باستخدام مُحرِّر النصوص المفضّل لديك</b></summary>

يتطلّب هذا الإعداد المزيد من العمل ولكنّه يسمح لك بمتابعة هذا الدليل باستخدام مُحرِّر نصوص من اختيارك. هذه هي الخطوات التي يجب عليك اتباعها:

1. تأكّد من امتلاكك لأحدث إصدار من [Node.js](https://nodejs.org/en/).
2. اتبع [تعليمات التثبيت لإنشاء تطبيق React](/docs/create-a-new-react-app.html#create-react-app) لصنع مشروع جديد

```bash
npx create-react-app my-app
```

1. احذف كافة الملفات الموجودة في المجلّد src/‎ للمشروع الجديد (لا تحذف هذا المجلّد، فقط محتوياته).

```bash
cd my-app
cd src

# إن كنت تستخدم نظام ماك او لينكس
rm -f *

# أو، إن كنت تستخدم نظام ويندوز
del *

# ثم، عد إلى مجلد المشروع 
cd ..
```

1. أضف ملفًّا يُدعى `index.css` في المجلّد `src/`‎ مع [وضع شيفرة CSS هذه ضمنه](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

2. أضف ملفًّا يُدعى `index.js` في المجلّد `src/`‎ مع [ضع شيفرة JavaScript هذه ضمنه](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

3. أضف هذه الأسطر الثلاثة إلى بداية الملف `index.js` في المجلّد `src/`‎:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

إن نفّذت الآن الأمر `npm start` في مجلّد المشروع وفتحت الرابط `http://localhost:3000` في المتصفّح، فبإمكانك أن ترى حقل فارغ للعبة إكس-أو.

نوصي بمتابعة [هذه التعليمات](https://babeljs.io/docs/editors/) لإعداد ميّزة تعليم الصياغة (syntax highlighting) في مُحرِّر النصوص لديك.

</details>

### ساعدني، أنا عالق! {#help-im-stuck}

إن وجدت أيّة صعوبات، تحقّق من [مصادر مجتمع React](/community/support.html)، بالأخص [دردشة Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) هي طريقة رائعة للحصول على المساعدة بسرعة. إن لم تتلقى أي إجابة أو بقيت عالقًا عند مشكلة ما، يُرجى تقديم المشكلة وسنساعدك في حلّها.

## لمحة عامّة {#overview}

الآن بعد أن قمت بالإعداد ، دعنا نلقي نظرة عامة على React!

### ما هي React؟ {#what-is-react}

React هي مكتبة JavaScript مرنة، وفعّالة، وتصريحيّة لبناء واجهات المستخدم. تُتيح لك تركيب واجهات مستخدم مُعقّدة من قطع معزولة وصغيرة من الشيفرة تُدعى المكوّنات "components".

تمتلك React أنواع مختلفة من المكوّنات، ولكن سنبدأ بالمكوّنات التي هي أصناف فرعية من الصنف `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>قائمة تسوق لأجل {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// مثال عن استخدام المكون <ShoppingList name="Mark" />
```

سنتحدّث قريبًا عن هذه العناصر التي تشبه عناصر XML. نستخدم المكوّنات لنخبر React ما الذي نرغب برؤيته على الشاشة. عندما تتغيّر بياناتنا ستُحدِّث React بكفاءة وتُعيد تصيير مكوّناتنا.

في المثال السابق ShoppingList هي **مكوّن React على شكل صنف**، وهي **من نوع المكوّنات في React**. يأخذ المكوّن مُعامِلات تُدعى الخاصيّات `props` (اختصارًا للكلمة "properties")، وتُعيد تسلسل هيكلي من المشاهد التي يجب عرضها عبر التابع `render`.

يُعيد تابع التصيير `render` وصفًا لما ترغب برؤيته على الشاشة. تأخذ React الوصف وتعرض النتيجة. يُعيد التابع `render` بشكلٍ خاص **عنصر React**، والذي هو وصف بسيط لما ترغب بتصييره. يستخدم معظم مطوري React صياغة خاصّة تُدعى "JSX" والتي تُسهِّل عمليّة كتابة مثل هذه البُنى. فمثلًا تُحوَّل الصياغة `<div />` في زمن البناء إلى `React.createElement('div')`. يُكافِئ المثال السابق ما يلي:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[انظر إلى الإصدار الكامل الموسّع من هذا المثال.](babel://tutorial-expanded-version)

إن كنت فضوليًّا فالتابع `createElement()`‎ مشروح بالتفصيل في [مرجع واجهة برمجة التطبيق](/docs/react-api.html#createelement) في React، ولكنّنا لن نستخدمه في هذا الدليل، بل سنستمر في استخدام JSX بدلًا من ذلك.

تأتي JSX مع القوة الكاملة للغة JavaScript. بإمكانك وضع **أي** تعابير JavaScript ضمن الأقواس بداخل JSX. كل عنصر React هو كائن JavaScript تستطيع تخزينه في متغيّر أو تمريره ضمن برنامجك.

يُصيِّر المكوّن `ShoppingList` المذكور في الأعلى مكوّنات مُضمَّنة في DOM مثل ‎`<div />` و `<li />`، ولكن تستطيع تركيب وتصيير مكوّنات React مُخصَّصة أيضًا. على سبيل المثال تستطيع الآن الإشارة إلى كامل قائمة التسوّق عن طريقة كتابة `<ShoppingList />`‎. يكون كل مكوّن React مُغلّفًا وبإمكانه العمل بشكل مستقل. يسمح لك ذلك ببناء واجهات مستخدم مُعقّدة من مكوّنات بسيطة.

## تفحّص شيفرة البدء {#inspecting-the-starter-code}

إن كنت ستجرّب شيفرة الدليل التطبيقي **على متصفحك،** افتح **[شيفرة البدء](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** في نافذة جديدة. أمّا إن كنت ستجرّبها بشكل **محلّي،** فافتح الملف ‎`src/index.js`‎ الموجود في مجلّد مشروعك (لقد تعرّفت مسبقًا على هذا الملف خلال [خطوة الإعداد](#setup-option-2-local-development-environment)).

شيفرة البدء هذه هي الأساس لما نبنيه. زوّدناك بتنسيق CSS لكي تحتاج للتركيز فقط على تعلّم React وبرمجة لعبة إكس-أو.

ستلاحظ بتفحّص الشيفرة أنّنا نمتلك ثلاثة مكوّنات:

* مكوّن المربّع `Square`
* مكوّن لوحة اللعبة `Board`
* مكوّن اللعبة `Game`

يُصيِّر المكوّن `Square` عنصر زر `<button>` واحد، ويُصيِّر المكوّن `Board` تسعة مربّعات. يُصيِّر المكوّن `Game` لوحة مع وجود قيم للتلميح والتي سنُعدّلها لاحقًا. لا يوجد حتى الآن أي مكوّن تفاعلي.

### تمرير البيانات عبر الخاصيّات {#passing-data-through-props}

لتدريب أنفسنا فلنحاول تمرير بعض البيانات من المكوّن `Board` إلى المكوّن `Square`.

في التابع `renderSquare` الموجود في المكوّن `Board`، غيّر الشيفرة لتمرير خاصيّة تُدعى `value` إلى المكوّن `Square`:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

غيّر التابع `render` في المكوّن Square لإظهار القيم عن طريق وضع ‎`{this.props.value}`‎ بدلًا من `{/* TODO */}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

قبل التغييرات:

![React Devtools](../images/tutorial/tictac-empty.png)

بعد التغييرات: يجب أن ترى عددًا في كل مربّع من الناتج المُصيَّر:

![React Devtools](../images/tutorial/tictac-numbers.png)

**[انظر إلى كامل الشيفرة عند هذه النقطة.](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

تهانينا! لقد "مرّرت الآن خاصيّة `prop`" من المكوّن `Board` الأب إلى المكوّن `Square` الابن. تمرير الخاصيّات هو طريقة عبور المعلومات في تطبيقات React، من المكوّنات الآباء إلى المكوّنات الأبناء.

### صنع مكوّن تفاعلي{#making-an-interactive-component}

فلنملأ المكوّن `Square` بإشارة "X" عند النقر عليه. فلنغيّر أولًا العنصر `button` الذي يُعاد من تابع التصيير الخاص بالمكوّن `Square` إلى ما يلي:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('نقرة'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

إن قمت بالنقر على المربّع فينبغي ظهور تحذير في المتصفح. 

>ملاحظة:
>
>لتقليل الكتابة وتجنّب [ السلوك المُربِك للكلمة المفتاحية `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)، سنستخدم صياغة [الدوال السهمية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) من أجل مُعالِجات الأحداث هنا وحتى في باقي أجزاء الشيفرة:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('نقرة')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>لاحظ كيف في الشيفرة ‎`onClick={() => alert('نقرة')}`‎ نقوم بتمرير *دالة* إلى الخاصيّة `onClick`. وهي تُطلَق فقط عند النقر. من الشائع نسيان `() =>` وكتابة ‎`onClick={alert('نقرة')}`‎، والذي يُؤدّي إلى إطلاق التحذير في كل مرّة يُعاد فيها تصيير المكوّن.

في الخطوة التالية سنريد من المكوّن `Square` أن يتذكر أنّه نُقِر عليه وأن يملأ نفسه بالعلامة `X`. لتذكر الأشياء تستخدم المكوّنات الحالة **state**.

تستطيع مكوّنات React أن تمتلك حالة عن طريق تعيين `this.state` في الدالة البانية لها. يجب اعتبار `this.state` خاصّة (private) بالنسبة لمكوّن React المُعرَّفة ضمنه. فلنُخزِّن القيمة الحاليّة للمربّع في `this.state` ونُغيّرها عند النقر عليه.

سنضيف في البداية دالة بانية إلى الصنف لتهيئة الحالة:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('نقرة')}>
        {this.props.value}
      </button>
    );
  }
}
```

>ملاحظة:
>
>يجب عليك دومًا في [أصناف JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) أن تستدعي الكلمة `super` عند تعريف الدالة البانية للصنف الفرعي. يجب أن تبدأ جميع مكوّنات الأصناف في React التي تمتلك دالة بانية `constructor` باستدعاء `super(props)`.

سنُغيّر الآن تابع التصيير `render` للمكوّن Square ليعرض قيمة الحالة الحاليّة عند النقر عليه:

* ضع `this.state.value` بدلًا من `this.props.value` بداخل العنصر `<button>`.
* ضع ‎`onClick={() => this.setState({value: 'X'})}`‎ بدلًا من `onClick={...}`.
* ضع الخاصيّتين `className` و `onClick` في أسطر منفصلة لسهولة القراءة.

بعد هذه التغييرات سيبدو العنصر ‎`<button>` المُعاد من تابع التصيير للمكوّن `Square` كما يلي:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

عن طريق استدعاء `this.setState` من مُعالِج الأحداث `onClick` في تابع التصيير للمكوّن Square، نُخبِر React بأن تُعيد تصيير المكوّن Square عند النقر على الزر `<button>` الخاص به. بعد التحديث ستُصبِح قيمة `this.state.value` هي ‎`'X'`‎، لذا سنرى ‎`'X'`‎ في لوحة اللعبة. إن نقرت على أي مربّع يجب أن تظهر الإشارة `X`.

عندما تستدعي التابع `setState` في المكوّن، تُحدِّث React بشكل تلقائي المكوّنات الأبناء بداخله أيضًا.

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### أدوات المطوّر {#developer-tools}

تُتيح لك إضافة أدوات تطوير React من أجل متصفّح [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) و [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) أن تتفحّص شجرة مكوّنات React باستخدام أدوات تطوير المتصفّح.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

تُتيح لك أدوات تطوير React التحقّق من خاصيّات وحالة المكوّنات.

تستطيع بعد تثبيت أدوات تطوير React أن تنقر بالزر الأيمن على أي عنصر في الصفحة، ثمّ تضغط على كلمة "Inspect" لفتح أدوات المطوّر، وستظهر نافذة React كآخر نافذة إلى اليمين.

**لاحظ وجود بعض الخطوات الإضافيّة لكي تعمل الأدوات مع CodePen:**

1. سجّل الدخول إلى الموقع أو سجّل في الموقع مع تأكيد بريدك الإلكتروني (مطلوب لتجنّب البريد المزعج spam).
2. اضغط على الزر "Fork".
3. اضغط على "Change View" واختر بعدها "Debug mode".
4. ستملك الآن أدوات التطوير نافذة React ضمن النافذة الجديدة التي ستفتح.

## إكمال اللعبة {#completing-the-game}

لدينا الآن أساسات البناء للعبة إكس-أو. للحصول على لعبة كاملة سنحتاج الآن إلى وضع إشارات "X" و "O" على لوحة اللعبة، وإلى إيجاد طريقة لتحديد الفائز.

### رفع الحالة للمستوى الأعلى {#lifting-state-up}

يحتفظ حاليًّا كل مكوّن مربّع `Square` بحالة اللعبة. لتحديد الفائز يجب علينا إبقاء قيمة كل مربّع من المربّعات التسعة في مكان واحد.

قد تعتقد أنّه من الأفضل أن يسأل مكوّن لوحة اللعبة `Board` كل مكوّن مربّع `Square` عن حالته. على الرغم من أنّ هذه الطريقة ممكنة في React ولكنّنا لا نفضّلها لأنّ الشيفرة ستصبح صعبة الفهم، وقابلة لوجود أخطاء فيها، ومن الصعب إعادة استخدامها. أفضل طريقة هي تخزين حالة اللعبة في مكوّن لوحة اللعبة `Board` واعتباره مكوّن أب بدلًا من تخزينها في كل مربّع. يتمكّن المكوّن `Board` من إخبار كل مربّع بما يجب عرضه عن طريق تمرير خاصيّة `prop`،[كما فعلنا عندما مرّرنا عددًا لكل مربّع](#passing-data-through-props).

**لتجميع البيانات من المكوّنات الأبناء المتعددة، ولامتلاك مكوّنين أبناء يتواصلان مع بعضهما البعض، يجب التصريح عن الحالة المشتركة في المكوّن الأب لها. يستطيع المكوّن الأب تمرير الحالة إلى المكوّنات الأبناء له عن طريق الخاصيّات. يُبقي هذا المكوّنات الأبناء بحالة تزامن مع بعضها ومع المكوّن الأب.**

رفع الحالة إلى المكوّن الأب هو أسلوب شائع عند إعادة تصنيع المكوّنات (refactoring).

سنضيف دالة بانية إلى لوحة اللعبة وسنُعيّن الحالة المبدئيّة لمكوّن اللوحة كي تحتوي على مصفوفة تتضمّن 9 قيم `null`. تتوافق هذه القيم التسعة مع المربعات التسعة الموجودة في اللعبة:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

عندما نملأ لوحة اللعبة لاحقًا فستبدو كما يلي:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

يبدو حاليًّا التابع `renderSquare` الموجود في المكوّن `Board` كما يلي:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

في البداية [مرّرنا الخاصيّة `value`](#passing-data-through-props) من المكوّن `Board` لإظهار الأعداد من 0 إلى 8 في كل مربّع، وفي خطوة سابقة وضعنا إشارات `X` بدلًا من الأعداد، حيث [يُحدِّد هذه الإشارة حالة المكوّن `Sqaure`](#making-an-interactive-component). ولهذا يتجاهل حاليًّا الخاصيّة `value` المُمرَّرة إليه عن طريق المكوّن `Board`.

سنستخدم الآن آليّة تمرير الخاصيّة مرّة أخرى. سنُعدِّل المكوّن Board ليستعلم من كل مربّع عن قيمته الحاليّة (`'X'`، أو `'O'`، أو `null`). لقد عرّفنا مسبقًا المصفوفة `squares` في الدالة البانية للمكوّن `Board`، وسنُعدِّل التابع `renderSquare` الموجود ضمنه ليقرأ من تلك المصفوفة:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

سيستقبل كل مربّع الآن الخاصيّة `value` والتي ستكون إمّا `'X'`، أو `'O'`، أو `null` بالنسبة للمربّعات الفارغة.

سنحتاج الآن إلى تغيير ما يحدث عند النقر على المربّع. يعرف الآن المكوّن `Board` ما هي المربّعات الممتلئة. يجب علينا إيجاد طريقة للمكوّن `Square` لكي يُحدِّث حالة المكوّن `Board`. بما أنّ الحالة تُعتبر خاصّة (private) للمكوّن الذي يُعرفها، فلن نستطيع تحديث حالة المكوّن `Board` مباشرةً من المكوّن `Square`.

للحفاظ على خصوصيّة حالة المكوّن `Board` سنُمرِّر دالة من المكوّن `Board` إلى `Square`. تُستدعى هذه الدالة عند النقر على المربّع. سنغيّر التابع `renderSquare` في المكوّن `Board` إلى:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>ملاحظة:
>
>نُقسِّم العنصر المُعاد إلى عدّة أسطر لسهولة القراءة، وأضفنا أقواس لكي لا تُدخِل JavaScript فاصلة منقوطة بعد الكلمة `return` وتؤدي إلى حدوث خطأ في شيفرتنا.

نُمرِّر الآن خاصيتين من المكوّن `Board` إلى `Square` وهما `value` و `onClick`. الخاصيّة `onClick` هي عبارة عن دالة يستطيع المكوّن `Square` استدعاءها عند النقر عليه. سنجري التغييرات التالية بالمكوّن `Square`:

* نضع `this.props.value` بدلًا من `this.state.value` في تابع التصيير `render` له.
* نضع `this.props.onClick()` بدلًا من `this.setState()`‎ في تابع التصيير `render` له.
* نحذف الدالة البانية `constructor` منه لأنّ المربّع لم يعد يحتاج لتتبع حالة اللعبة.
  
سيبدو المكوّن `Square` بعد التغييرات كما يلي:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

عند النقر على المربّع تُستدعى الدالة `onClick` المُزوَّدة من قبل المكوّن `Board`. وهذا ملخّص لكيفية تحقيق ذلك:

1. تُخبِر الخاصيّة `onClick` الموجودة في المكوّن `<button>` مكتبة React بأن تُعِد مُستمِع لحدث النقر.
2. عند النقر على الزر، ستستدعي React مُعالِج الحدث `onClick` المُعرَّف في التابع `render()` للمكوّن Square.
3. يستدعي مُعالِج الأحداث هذا `this.props.onClick()`‎. الخاصيّة `onClick` الموجودة في المكوّن Square مُحدَّدة من قبل المكوّن `Board`.
4. بما أنّ المكوّن `Board` مرَّر `onClick={() => this.handleClick(i)}` إلى `Square`، فسيستدعي هذا الأخير ‎`this.handleClick(i)` عند النقر عليه.
5. لم نُعرِّف التابع `handleClick()` حتى الآن، لذا تنهار الشيفرة لدينا.

>ملاحظة:
>
>تمتلك الخاصيّة `onClick` الموجودة في العنصر `<button>` معنى مميز بالنسبة لمكتبة React لأنّه مكوّن مُضمَّن في DOM. أمّا بالنسبة للمكوّنات المُخصَّصة مثل `Square` فلك حريّة اختيار أسماء الخاصيّات. كان بإمكاننا تسمية الخاصيّة `onClick` في المكوّن `Square` أو التابع `handleClick` في المكوّن `Board` بشكلٍ مختلف. على أيّة حال هناك اتفاق في React باستخدام النمط ‎`on[Event]`‎ لتسمية الخاصيّة التي تُمثِّل أحداثًا والنمط `handle[Event]`‎ لتسمية التوابع التي تُعالِج هذه الأحداث.

عندما نحاول الآن النقر على المربّع يجب أن نحصل على خطأ لأنّنا لم نُعرِّف التابع `handleClick` حتى الآن. سنضيف التابع `handleClick` إلى صنف المكوّن `Board`:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[انظر إلى كامل الشيفرة عند هذه النقط](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

بعد هذه التغييرات أصبحنا قادرين على النقر على المربّعات لملئها مع تخزين الحالة ضمن المكوّن `Board` بدلًا من وضعها ضمن كل مكوّن مربّع `Square`. عندما تتغير حالة المكوّن `Board` فستُعيد مكوّنات المربّعات التصيير بشكل تلقائي. سيسمح لك الاحتفاظ بحالة جميع المربعات ضمن المكوّن `Board` بتحديد الفائز لاحقًا.

بما أنّ مكوّنات المربعات لم تعد تحتفظ بالحالة فسيستقبل المكوّن `Square` القيم من المكوّن `Board` ويُخبره عند النقر عليه. بمصطلحات React نستطيع القول عن المكوّن `Square` بأنّه **مكوّن مضبوط**، لأنّ المكوّن `Board` أصبح يمتلك كامل التحكم به.

لاحظ كيف أنّنا نستدعي ضمن `handleClick` التابع ‎`.slice()`‎ لإنشاء نسخة عن المصفوفة `squares` لتعديلها بدلًا من تعديل المصفوفة الموجودة. لنشرح لماذا نفعل ذلك في القسم التالي.

### لماذا تكون عدم القابلية للتغير مهمة؟ {#why-immutability-is-important}

اقترحنا في مثال الشيفرة السابق استخدام المُعامِل `.slice()`‎ لإنشاء نسخة عن المصفوفة `squares` لتعديلها بدلًا من تعديل المصفوفة الموجودة. سنناقش الآن عدم القابلية للتعديل (immutability) وأهمية تعلّمها.

هنالك طريقتان لتغيير البيانات. الطريقة الأولى هي **تعديل** البيانات مباشرة بتغيير قيمها. والطريقة الثانية هي الحصول على نسخة جديدة من البيانات تمتلك التغييرات المطلوبة ووضعها بدل البيانات الأصليّة.

#### تغيير البيانات عن طريق تعديلها بشكل مباشر {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// قيمة الـ player الان : {score: 2, name: 'Jeff'}
```

#### تغيير البيانات بدون تعديلها بشكل مباشر {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// الآن يبقى player بدون تغيير
// ولكن تكون قيمة newPlayer هي {score: 2, name: 'Jeff'}

/// أو إن كنت تستخدم اقتراح صياغة نشر الكائنات تستطيع كتابة
// var newPlayer = {...player, score: 2};
```

النتيجة النهائيّة هي نفسها ولكن نكسب عدّة فوائد عن طريق عدم تغيير البيانات بشكل مباشر، سنذكر هذه الفوائد الآن.

#### تبسيط الميزات المعقدة {#complex-features-become-simple}

تجعل عدم قابلية التغيير من الأسهل تنفيذ الميزات المعقدة. لاحقًا في هذا الدليل سنُنفِّذ ميزة السفر عبر الزمن والتي تسمح لنا بمراجعة تاريخ الحركات السابقة في لعبة إكس-أو مع إمكانية القفز إلى الحركات السابقة. هذه الميزة ليست خاصة بالألعاب، فالقدرة على التراجع والعودة عن أفعال محددة هي متطلب شائع في التطبيقات. يسمح لك تجنّب التعديل المباشر للبيانات بالاحتفاظ بإصدارات من تاريخ تحركات اللعبة وإعادة استخدامها لاحقًا.

#### كشف التغيرات {#detecting-changes}

يصعب كشف التغيّرات في الكائنات القابلة للتعديل لأنّها تُعدَّل بشكل مباشر. يتطلب هذا الكشف مقارنة الكائنات القابلة للتعديل مع النسخ السابقة منها وكامل شجرة الكائنات المطلوبة.

يُعتبَر كشف التغيّرات في الكائنات غير القابلة للتعديل أسهل. إن كان الكائن غير القابل للتعديل مختلفًا عن السابق فنعتبر أنّ الكائن قد تغيّر.

#### تحديد وقت إعادة التصيير في React {#determining-when-to-re-render-in-react}

الفائدة الأساسيّة من عدم القابلية للتعديل هي أنّها تساعدك على بناء __مكوّنات نقيّة__ في React. تستطيع البيانات غير القابلة للتعديل أن تُحدِّد بسهولة إذا ما قد أُجريت أي تغييرات، والذي يُساعد بتحديد متى يحتاج المكوّن لإعادة التصيير.

بإمكانك تعلّم المزيد حول التابع `shouldComponentUpdate()` وكيفيّة بناء *مكوّنات نقية* من خلال قراءة مستند [تحسين الأداء](/docs/optimizing-performance.html#examples).

### مكونات الدوال {#function-components}

سنغيّر الآن المكوّن `Square` ليُصبِح **مكوّن دالّة**.

**مكوّنات الدوال** في React هي طريقة أبسط لكتابة المكوّنات التي تحتوي فقط على تابع التصيير `render` بدون أن تمتلك حالتها الخاصّة. فبدلًا من تعريف صنف يمتد إلى الصنف `React.Component` نستطيع كتابة دالة تأخذ خاصيّات `props` وحقل إدخال وتُعيد ما ينبغي تصييره. من الأسهل كتابة مكوّنات الدوال بدلًا من الأصناف، ويُمكِن التعبير عن الكثير من المكوّنات بهذه الطريقة.

ضع هذه الدالة بدلًا من الصنف `Square`:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

غيّرنا `this.props` إلى `props` في المرّات التي ظهرت فيها.

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>ملاحظة
>
>عندما عدّلنا المكوّن Square ليصبح مكوّن دالة، فقد غيّرنا أيضًا ‎`onClick={() => this.props.onClick()}`‎ إلى الشكل المختصر `onClick={props.onClick}`‎ (لاحظ عدم وجود الأقواس على الجانبين). في حال الصنف استخدمنا الدوال السهميّة للوصول إلى قيمة `this` الصحيحة، ولكن في مكوّنات الدوال لا حاجة للقلق حول `this`.

### أخذ الأدوار {#taking-turns}

نحتاج الآن لإصلاح عيب واضح في لعبة إكس-أو لدينا، فلا يُمكِن وضع الإشارة "O" على لوحة اللعبة.

سنُعيِّن أول خطوة لتكون "X" افتراضيًّا. نستطيع تعيين هذه القيمة الافتراضيّة عن طريق تعديل الحالة المبدئيّة في الدالة البانية للمكوّن `Board`:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

في كل مرة يتحرّك بها اللاعب ستنقلب قيمة المتغيّر `xIsNext` (متغير منطقي) لتحديد أي لاعب سيلعب الخطوة التالية وستُحفَظ حالة اللعبة. سنُحدِّث الدالة `handleClick` للمكوّن `Board` لتقلب قيمة `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

بها التغيير تستطيع `X` و `O` أخذ الأدوار. 

فلنُغيِّر أيضًا نص الحالة في التابع `render` للمكوّن `Board` بحيث يعرض من هو اللاعب الذي سيلعب الدور التالي:

```javascript{2}
  render() {
    const status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // لم تتغير بقية الشيفرة
```

بعد تطبيق هذه التغييرات يجب أن تملك مكوّن `Board` مماثل لما يلي:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### التصريح عن الفائز {#declaring-a-winner}

الآن بعد أن عرضنا من هو اللاعب الذي سيلعب الدور التالي، فيجب علينا أن نعرض عبارة عندما يفوز اللاعب باللعبة ولا تتبقى أيّة أدوار للعبها. نستطيع تحديد الفائز عن طريق إضافة هذه الدالة المساعدة إلى نهاية الملف:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

سنستدعي التابع `calculateWinner(squares)`‎ في تابع التصيير `render` للمكوّن `Board` للتحقّق من فوز اللاعب. إن فاز اللاعب فنستطيع عرض نص مثل "الفائز: X" أو "الفائز: O". سنضع هذه الشيفرة بدلًا من تصريح `الحالة` الموجود في التابع `render` للمكوّن `Board`:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'الفائز: ' + winner;
    } else {
      status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // لم تتغير بقية الشيفرة
```

نستطيع الآن تغيير الدالة `handleClick` للمكوّن `Board` لتُعيد قيمتها باكرًا عن طريق تجاهل النقرة إن فاز أحد باللعبة أو إن كان المربّع يحتوي على قيمة مسبقًا:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[انظر إلى كامل الشيفرة عند هذه النقطة.](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

تهانينا! تمتلك الآن لعبة إكس-أو تعمل بشكل جيّد. وقد تعلّمت أساسيّات React أيضًا. لذا قد تكون أنت الرابح الحقيقي هنا.

## إضافة السفر عبر الزمن {#adding-time-travel}

كتمرين أخير فلنجعل من الممكن الرجوع إلى الخلف بالوقت إلى التحركات السابقة في اللعبة.

### تخزين تاريخ التحركات {#storing-a-history-of-moves}

إن عدّلنا المصفوفة `squares` سيكون تنفيذ السفر عبر الزمن أمرًا صعبًا.

ولكننا استخدمنا التابع `slice()`‎ لإنشاء نسخة من المصفوفة `squares` بعد كل تحرّك، [والتعامل معها كمصفوفة غير قابلة للتعديل](#why-immutability-is-important). يسمح لك ذلك بتخزين كل إصدار قديم من هذه المصفوفة، والتنقل بين الأدوار التي حدثت سابقًا.

سنُخزِّن مصفوفات `squares` السابقة ضمن مصفوفة أخرى تُدعى `history` والتي تُمثِّل حالات لوحة اللعبة من أو إلى آخر تحرّك، ويكون شكلها كما يلي:

```javascript
history = [
  // قبل التحرك الأول
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // بعد التحرك الأول
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // بعد التحرك الثاني
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

نحتاج الآن إلى أن نقرّر أي مكوّن ينبغي أن يمتلك الحالة `history`.

### رفع الحالة مرّة أخرى {#lifting-state-up-again}

نريد من المكوّن الموجود في أعلى مستوى من اللعبة أن يعرض قائمة بالتحركات السابقة. سيحتاج إلى الوصول إلى الحالة `history` لفعل ذلك، لذا سنضعها في المكوّن ذو المستوى الأعلى في اللعبة واسمه `Game`.

يُتيح لنا وضع الحالة `history` في المكوّن `Game` أن نزيل الحالة `squares` من المكوّن الابن له وهو `Board`. كما [رفعنا الحالة](#lifting-state-up) من المكوّن `Square` إلى `Board`، سنرفعها الآن من `Board` إلى المكوّن ذو المستوى الأعلى في اللعبة `Game`. يُعطي هذا المكوّن `Game` التحكّم الكامل ببيانات المكوّن `Board`، ويسمح له بأن يأمر المكوّن `Board` بتصيير الأدوار السابقة من `history`.

سنُعِد في البداية الحالة المبدئيّة للمكوّن `Game` ضمن الدالة البانية له:


```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

نمتلك الآن المكوّن `Board` الذي يستقبل الخاصيّتين `squares` و `onClick` من المكوّن `Game`. بما أنّنا نمتلك الآن مُعالِج وحيد لحدث النقر في المكوّن `Board` للعديد من مكوّنات `Square`، فسنحتاج لتمرير موقع كل مكوّن `Square` إلى المُعالِج `onClick` للإشارة إلى أي مربّع هو الذي نقرنا عليه. هذه هي الخطوات المطلوبة لتحويل المكوّن `Board`:

* احذف الدالة البانية `constructor` من المكوّن `Board`.
* ضع `this.props.squares[i]` بدلًا من `this.state.squares[i]`‎ في التابع `renderSquare` الموجود ضمن المكوّن `Board`.
* ضع `this.props.onClick(i)` بدلًا من `this.handleClick(i)` في التابع `renderSquare` الموجود ضمن المكوّن `Board`.

يبدو المكوّن `Board` الآن على الشكل التالي:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'الفائز: ' + winner;
    } else {
      status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

سنُحدِّث التابع `render`  للمكوّن `Game` ليستخدم آخر حالة `history` موجودة لتحديد وعرض حالة اللعبة:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'الفائز: ' + winner;
    } else {
      status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

بما أنّ المكوّن `Game` يُصيّر الآن حالة اللعبة فنستطيع إزالة الشيفرة الموافقة من التابع `render` للمكوّن `Board`. بعد فعل ذلك سيبدو التابع `render` للمكوّن `Board` كما يلي:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

نحتاج أخيرًا لنقل التابع `handleClick` من المكوّن `Board` إلى المكوّن `Game`. نحتاج أيضًا لتعديل الدالة `handleClick` لأنّ حالة مكوّن اللعبة `Game` مبنية بشكل مختلف. سنجمع الآن مُدخلات التاريخ الجديد مع الحالة `history` ضمن الدالة `handleClick` في المكوّن `Game`:

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>ملاحظة
>
>على عكس التابع `push()`‎ الخاص بالمصفوفات والذي قد تكون مُتآلفًا معه، فإنّ التابع `concat()`‎ لا يُعدِّل المصفوفة الأصليّة لذلك نُفضّله.

عند هذه النقطة يحتاج المكوّن `Board` فقط إلى التابعين `render` و `renderSquare`. يجب أن تكون حالة اللعبة والتابع `handleClick` فيجب أن تكون في المكوّن `Game`.

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### عرض التحركات السابقة {#showing-the-past-moves}

بما أنّنا نُسجِّل تاريخ تحرّكات لعبة إكس-أو، فبإمكاننا الآن عرضها للاعب كقائمة من التحركات السابقة.

تعلمنا سابقًا أنّ عناصر React هي عبارة عن كائنات JavaScript نستطيع تمريرها في تطبيقنا. لتصيير عناصر متعددة في React نستطيع استخدام مصفوفة من عناصر React.

تمتلك المصفوفات في JavaScript [التابع `map()`‎](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)‎ والذي من الشائع استخدامه لربط بيانات إلى بيانات أخرى كما يلي:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

نستطيع باستخدام التابع `map` أن نربط تاريخ التحركات بعناصر React التي تمثل أزرار على الشاشة، ومن ثمّ نعرض قائمة بالأزرار للتنقل إلى التحركات السابقة.

فلنربط الحالة `history` في التابع `render` للمكوّن `Game`:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'الفائز: ' + winner;
    } else {
      status = 'اللاعب التالي: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

نُنشِئ لكل تحرك في تاريخ اللعبة عنصرًا بالقائمة `<li>` يحتوي على زر `<button>`. يمتلك الزر مُعالِج للأحداث `onClick` والذي يستدعي تابًعا يُدعى `this.jumpTo()`‎. لم ننفذ هذا التابع حتى الآن. ينبغي أن نرى الآن قائمة بالتحركات التي حصلت في اللعبة وتحذير في النافذة console ضمن أدوات التطوير يقول:

>  تحذير:
>  يجب أن يمتلك كل عنصر ابن في المصفوفة خاصية مفتاح `key`. تحقق من التابع `render` للمكوّن `Game`.

فلنناقش معنى التحذير السابق.

### انتقاء مفتاح {#picking-a-key}

عند تصيير قائمة تُخزن React بعض المعلومات حول كل عنصر منها. عندما نحدث القائمة تحتاج React لتحديد ما تغيّر. بإمكاننا إضافة، وإزالة، وإعادة ترتيب، وتحديث عناصر القائمة.

تخيل الانتقال من:

```html
<li>أليكسا: 7 مهام متبقية</li>
<li>بَنْ: 5 مهام متبقية</li>
```

إلى:

```html
<li>بَنْ: 9 مهام متبقية</li>
<li>كلوديا: 8 مهام متبقية</li>
<li>أليكسا: 5 مهام متبقية</li>
```

من وجهة نظرنا، بدل الانتقال بين ترتيب أليكسا وبن وأدخل كلوديا بينهما، ولكنّ React هي برنامج حاسوب ولا تفهم مقصدنا من ذلك، نحتاج لتحديد خاصيّة مفتاح *key* لكل عنصر قائمة لتمييزه عن العناصر الأشقاء له. بإمكاننا استخدام السلاسل النصيّة "`أليكسا`"، و "`بَنْ`"، و "`كلوديا`" كمفاتيح. إن كان لدينا الوصول إلى قاعدة البيانات فنستطيع استخدام المُعرِّفات (IDs) لأليكسا وكلوديا وبَنْ من قاعدة البيانات كمفاتيح:

```html
<li key={user.id}>{user.name}: {user.taskCount} مهام متبقية</li>
```

عند إعادة تصيير القائمة، تأخذ React مفتاح كل عنصر وتبحث بالقائمة القديمة عن مفتاح مُطابِق. إن كانت القائمة الحالية تحتوي على مفتاح غير موجود بالقائمة السابقة، فستُنشِئ React مكوّنًا جديدًا. وإن كانت القائمة الحاليّة تفتقد لمفتاح موجود في القائمة السابقة، فستُدمِّر React المكوّن. تُخبِر المفاتيح React عن هوية كل مكوّن والتي تسمح لمكتبة React بأن تُحافِظ على الحالة بين إعادات التصيير. إن تغيّر مفتاح المكوّن سيُدمَّر ويُعاد إنشاؤه مع حالة جديدة.

المفتاح `key` هو خاصيّة محجوزة في React (مع الخاصيّة `ref`، وهي ميزة أكثر تقدّمًا). عند إنشاء عنصر تستخرج React الخاصيّة `key` وتخزن المفتاح بشكل مباشر في العنصر المُعاد. على الرغم من أنّ المفتاح يبدو أنّه ينتمي للخاصيّات `props` فلا يمكننا الرجوع إليه عن طريق `this.props.key`. تستخدم React الكلمة `key` تلقائيًّا لتقرر أي مكوّن يجب تحديثه. لا يستطيع المكوّن الاستعلام عن `مفتاحـ`ـه.

**من المفضل أن تُعيّن المفاتيح الملائمة عندما تبني قوائم ديناميكيّة.** إن لم تمتلك المفتاح المناسب فانظر في إعادة بناء بياناتك بحيث يُصبِح لديك مفتاح ملائم للاستخدام.

إن لم يُحدَّد مفتاح، فستعرض React تحذيرًا وستستخدم فهرس المصفوفة كمفتاح بشكل افتراضي. يكون استخدام الفهرس كمفتاح مشكلة عند محاولة إعادة ترتيب عناصر القائمة أو عند إدخال وإزالة العناصر. يؤدي تمرير `key={i}` إلى إيقاف التحذير ولكن يمتلك نفس المشاكل لأنّ فهرس المصفوفات غير مفضّل كمفتاح في معظم الحالات.

لا يجب على المفاتيح أن تكون فريدة ضمن المجال العام (global)، بل يجب فقط أن تكون فريدة بين المكوّنات وأشقائها.


### تنفيذ ميزة السفر عبر الزمن {#implementing-time-travel}

في تاريخ لعبة إكس-أو يملك كل تحرّك سابق مُعرِّف (ID) فريد مرتبط معه، وهو الرقم التسلسلي للتحرّك. لا يُعاد ترتيب التحركات، أو حذفها، أو إدخالها في الوسط، لذا من الآن استخدام فهرس التحرّك كمفتاح هنا.

نستطيع في تابع التصيير `render` للمكوّن `Game` أن نُضيف المفتاح ‎`<li key={move}>` وسيختفي تحذير React حول المفاتيح:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'انتقل إلى التحرك #' + move :
        'انتقل إلى بداية اللعبة';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[انظر إلى كامل الشيفرة عند هذه النقطة](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

سيُظهر "يرمي" النقر على أي زر من عناصر القائمة خطأً لأنّ التابع `jumpTo` غير مُعرَّف. قبل تنفيذ التابع `jumpTo` سنُضيف رقم الخطوة `stepNumber` إلى حالة مكوّن اللعبة `Game` للإشارة إلى رقم الخطوة التي نشاهدها حاليًّا.

أضف في البداية `stepNumber: 0` إلى الحالة المبدئيّة في `الدالة البانية` للمكوّن `Game`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

سنُعرِّف الآن التابع `jumpTo` في المكوّن `Game` لتحديث رقم الخطوة `stepNumber`. نُعيِّن أيضًا قيمة `xIsNext` إلى `true` إن كان الرقم الذي نُغيّره زوجيًّا:

```javascript{5-10}
  handleClick(i) {
    // لم يتغير هذا التابع
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // لم يتغير هذا التابع
  }
```

سنجري الآن بعض التغييرات على التابع `handleClick` للمكوّن `Game` والذي يُطلَق عند النقر على المربّع.

تعكس الحالة `stepNumber` التي أضفناها التحرّك المعروض للمستخدم حاليًّا. بعد إجراء تحرّك جديد سنحتاج إلى تحديث `stepNumber` عن طريق إضافة `stepNumber: history.length` كجزء من الوسيط `this.setState`. يضمن هذا ألّا نعلق بإظهار نفس التحرك بعد القيام بتحرك جديد.

سنضع أيضًا `this.state.history.slice(0, this.state.stepNumber + 1)`‎ بدلًا من `this.state.history` . يضمن هذا أنّنا عندما نعود في الزمن ونجري تحرّك جديد من تلك النقطة، أن نمسح كل التاريخ المستقبلي الذي سيصبح الآن غير صحيح:

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

أخيرًا سنُعدِّل التابع `render` للمكوّن `Game` من تصيير التحرك الأخير دومًا إلى تصيير التحرك المُختار حاليًّا وفق قيمة `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // بقية الشيفرة لم تتغير
```

إن نقرنا على أي تحرك في تاريخ اللعبة، فستُحدَّث لوحة اللعبة فورًا لتظهر بالشكل المفروض بعد حدوث ذلك التحرّك.

**[انظر إلى كامل الشيفرة عند هذه النقطة.](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### الملخص {#wrapping-up}

تهانينا! لقد أنشأتَ لعبة إكس-أو والَّتي:

* تُتيح لك لعب إكس-أو.
* تُخبرنا عندما يفوز اللاعب.
* تُخزِّن تاريخ اللعبة أثناء تقدمّ اللعبة.
* تسمح للاعبين بمراجعة تاريخ اللعبة ورؤية الإصدارات القديمة للوحة اللعبة.

عمل رائع! نتمنى أن تشعر الآن بأنك تمتلك لمحة حول آليّة عمل React.

تحقّق من النتيجة النهائيّة هن : **[النتيجةالنهائيّة](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

إن كان لديك المزيد من الوقت أو أردت ممارسة مهاراتك الجديدة التي تعلمتها في React، فهذه بعض الأفكار للتحسين والتي قد تجريها على لعبة إكس-أو وهي مرتبة بشكل تصاعدي حسب الصعوبة:

1. عرض موقع كل تحرك بصيغة العامود والصف في قائمة تاريخ التحركات.
2. تعيين تنسيق عريض (Bold) للعنصر المُحدَّد حاليًّا في قائمة التحركات.
3. إعادة كتابة المكوّن `Board` ليستخدم حلقتين لإنشاء المربعات بدلًا من كتابتها حرفيًّا.
4. إضافة زر لترتيب التحركات تصاعديًّا أو تنازليًّا.
5. تعليم المربعات الثلاث عند فوز أحد اللاعبين والتي سببت فوزه.
6. عرض رسالة بنتيجة التعادل عندما لا يفوز أحد.

تعلمنا خلال هذا الدليل مفاهيم في React تتضمّن العناصر، والمكوّنات، والخاصيّات، والحالة. للحصول على شرح مُفصَّل عن كل من هذه المواضيع تحقّق من [باقي مستندات React](/docs/hello-world.html). لتعلّم المزيد حول تعريف المكوّنات تحقّق من [مرجع واجهة برمجة التطبيق `React.Component`](/docs/react-component.html).

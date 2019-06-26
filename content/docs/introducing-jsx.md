---
id: introducing-jsx
title: مقدمة إلى JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

فلننظر إلى تعريف هذا المتغير:

```js
const element = <h1>Hello, world!</h1>;
```

إنّ الصّياغة الغريبة السّابقة التي تحتوي على وسم هي ليست سلسلة نصيّة ولا حتى HTML.

تُدعى الصّياغة السّابقة JSX وهي عبارة عن امتداد لصياغة JavaScript، نوصي باستخدامها مع React لوصف المظهر الذي ينبغي أن تكون عليه واجهة المستخدم. قد تُذكِّرك JSX بلغات القوالب، ولكنها تمتلك قوة JavaScript الكاملة.

تُنتِج JSX عناصر React. سنستعرض إظهار هذه العناصر في DOM في [القسم التالي](/docs/rendering-elements.html). سنتحدّث في الفقرات التالية عن أساسيّات JSX الضرورية للبدء.

### لماذا JSX؟ {#why-jsx}

تتقبّل React حقيقة أنّ منطق التصيير مرتبط بشكل متوارث مع المنطق الآخر لواجهة المستخدم، والذي نقصد به كيفية التعامل مع الأحداث، وكيفية تغيّر الحالة مع مرور الزمن، وكيفية تحضير البيانات لعرضها.

بدلًا من الفصل بين *التقنيات* عن طريق وضع اللغة الترميزيّة (markup) والمنطق في ملفّات منفصلة، [تفصل](https://en.wikipedia.org/wiki/Separation_of_concerns) React بين المهام عبر وحدات مرتبطة بإحكام تدعى المكونات "components" والتي تحتوي على كليهما معًا. سنعود للحديث عن المكونات في [ القسم الخاص به](/docs/components-and-props.html), ولكن إن لم تكن مرتاحًا لوضع اللغة الترميزيّة ضمن JS فاطلع على [هذه المناقشة](https://www.youtube.com/watch?v=x7cQ3mrcKaY) التي قد تقنعك بعكس ذلك.

[لا تشترط React استخدام JSX](/docs/react-without-jsx.html), ولكن يجدها الغالبيّة كمساعدة بصريّة عند التعامل مع واجهة المستخدم بداخل شيفرة JavaScript، فهي تسمح لمكتبة React بأن تُظهِر المزيد من الأخطاء المفيدة والرسائل التحذيريّة.

### تضمين التعابير في JSX {#embedding-expressions-in-jsx}

نُعرِّف في المثال التالي متغيّرًا يُدعى name ونستخدمه بداخل JSX عن طريق تغليفه بين قوسين:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

بإمكانك وضع أي [تعبير صحيح في JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) داخل القوسين في JSX، على سبيل المثال `2 + 2`, `user.firstName`, أو `formatName(user)` جميعها تعابير JavaScript صحيحة.

نُضمِّن في المثال التالي نتيجة استدعاء دالة JavaScript، وهي `formatName(user)`, بداخل عنصر `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

فصلنا JSX عبر عدّة أسطر لتسهيل القراءة،  نُوصي أيضًا عند فعل هذا بتغليفها بين قوسين لتجنّب هفوات [الإدخال التلقائي للفاصلة المنقوطة](https://stackoverflow.com/q/2846283).

### JSX هي عبارة عن تعبير أيضًا {#jsx-is-an-expression-too}

بعد انتهاء مرحلة تصريف الشيفرة (compilation)، تُصبِح تعابير JSX استدعاءات لدوال JavaScript اعتياديّة وتُقيَّم إلى كائنات JavaScript.

يعني هذا أنّك تستطيع استخدام JSX بداخل جمل `if` الشرطيّة وحلقات `for`، بتعيينها إلى متغيّرات، وقبولها كوسائط، وإعادتها من الدوال:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### تحديد خاصيّات  Attributes" HTML" عن طريق JSX {#specifying-attributes-with-jsx}

بإمكانك استخدام علامتي الاقتباس لتحديد قيم ثابتة نصيّة لخاصيّات HTML:

```js
const element = <div tabIndex="0"></div>;
```

بإمكانك أيضًا استخدام الأقواس لتضمين تعبير JavaScript بداخل خاصيّة HTML:

```js
const element = <img src={user.avatarUrl}></img>;
```

لا تضع علامتي اقتباس حول القوسين عند تضمين تعابير JavaScript بداخل الخاصيّات، حيث ينبغي أن تستخدم علامتي الاقتباس فقط من أجل القيم النصيّة والأقواس من أجل التعابير وليس كلاهما معًا.

>**تحذيرa:**
>
>لمّا كانت JSX أقرب إلى JavaScript من HTML، فتستخدم React DOM طريقة تسمية خاصيّات الكائنات `camelCase` بدلًا من أسماء خاصيّات HTML
>
>على سبيل المثال, الخاصيّة `class` تُصبِح  [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) في JSX, و `tabindex` تُصبِح [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### تحديد العناصر الأبناء باستخدام JSX {#specifying-children-with-jsx}

إن كان العنصر من عناصر HTML الفارغة فبإمكانك إغلاقه مباشرةً باستخدام `/>`, كما في XML:

```js
const element = <img src={user.avatarUrl} />;
```

يُمكِن لعناصر JSX أن تحتوي على عناصر أبناء:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### تمنع JSX هجمات الحقن {#jsx-prevents-injection-attacks}

من الآمن تضمين مُدخلات المستخدم في JSX:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

حيث أنّ React DOM [تُهرِّب (escape)](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) أي قيم مُضمَّنة افتراضيًّا في JSX قبل عرضها، وبهذا تضمن أنّه لن يكون بإمكانك حقن أي شيء غير مكتوب بشكل صريح في تطبيقك. تُحوَّل أي قيمة إلى سلسلة نصيّة قبل عرضها، والذي يُساعِد على منع هجمات [cross-site-scripting) XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)

### تمثل الكائنات في JSX {#jsx-represents-objects}

 يُترجِم Babel صياغة JSX إلى استدعاءات للتابع `React.createElement()` لذلك يكون المثالان التاليان متطابقين:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

يُنفِّذ التّابع `React.createElement()` بعض الاختبارات ليُساعدك على كتابة شيفرة خالية من الأخطاء، ولكنّه بشكل أساسي يُنشِئ كائنًا مُشابِهًا لما يلي:

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

تُدعى هذه الكائنات عناصر React. بإمكانك اعتبارها كتوصيفات لما ترغب برؤيته على الشّاشة. تقرأ React هذه الكائنات وتستخدمها لبناء DOM وإبقائه مُحدَّثًا.

سيتم تغطية تصيير عناصر React إلى DOM في القسم التالي.

>**ملاحظة:**
>
>نوصي باستخدام [تعريف لغة Babel](https://babeljs.io/docs/editors) إلى المُحرِّر الذي تستخدمه بحيث يتعرَّف على صياغة شيفرة JSX و ES6 ويُظهرها بالألوان المناسبة. بإمكانك استخدام مُخطَّط الألوان [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) المتوافق معها أيضًا.

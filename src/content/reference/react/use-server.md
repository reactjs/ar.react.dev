---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

هذه التوجيهات لازمة فقط إذا كنت [تستخدم RSC (مكونات الخادم)](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) أو تبني مكتبة متوافقة معها.

</Canary>


<Intro>

`'use server'` يميّز دوال الخادم (server-side functions) التي يمكن استدعاؤها في الكود من جانب العميل (client-side).

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `'use server'` {/*use-server*/}

أضف `'use server';` في أعلى دالة غير متزامنة (async) لتمييز أن الدالة يمكن تنفيذها من قبل العميل. نسمي هذه الدوال Server Actions.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

يمكن تمرير هذه الدالة إلى العميل، عندما تُستدعى، ستنفذ طلب شبكة إلى الخادم يتضمن نسخة متسلسلة من أي معاملات تم تمريرها. إذا كان Server Action ترجع قيمة، سيتم تسلسلها وإرجاعها إلى العميل.

بدلا من وضع `'use server'` في أول الدالة، يمكنك إضافة `'use server';` في أعلى ملف لتمييز كل التصديرات في هذا الملف كدوال خادم غير متزامنة يمكن استخدامها في أي مكان، بما في ذلك استيرادها في ملفات مكونات العميل.

#### ملاحظات {/*caveats*/}

* يجب أن تكون `'use server'` في بداية الدالة أو الملف. فوق أي كود آخر، بما في ذلك الاستيرادات (التعليقات قبل `'use server'` مسموح به) يجب كتابتها بعلامة تنصيص مفردة أو مزدوجة. ليس backticks.
* يمكن استخدام `'use server'` في ملفات الخادم فقط، ومن ثَمّ يمكن تمرير Server Actions إلى مكونات العميل من خلال الخصائص (props). اقرأ أيضًا [أنواع التسلسل](#serializable-parameters-and-return-values).
* عند استيراد Server Action من [كود Client](/reference/react/use-client)، يجب استخدام التوجيهات على مستوى الملف وليس الدالة.
* لأن الاستدعاءات الشبكية الأساسية دائمًا غير متزامنة، يمكن استخدام `'use server'` فقط في دوال غير متزامنة (async).
* تذكر أن المعاملات الممررة إلى دالة مميزة بـ `'use server'` متحكم بها بالكامل من جانب العميل. للأمان، عاملها دائمًا كإدخال غير موثوق به، وتأكد من التحقق من صحتها وتصفيتها كما يناسبك.
* يفضل استعمال Server Actions في [`useTranistion`](/reference/react/useTransition)، أما Server Actions التي يتم تمريرها إلى [`<form action>`](/reference/react-dom/components/form#props) أو [`formAction`](/reference/react-dom/components/input#props) سيتم إضافة transition لهم تلقائيًا.
* تم تصميم Server Actions لعمليات تعديل حالة الخادم. لا ينصح باستخدامهم في جلب البيانات، ووفقًا لذلك، فإن الإطارات التي تنفذ Server Actions عادة تعالج إجراء واحد في كل مرة وليس لديها طريقة لتخزين قيمة الإرجاع.

### الاعتبارات الأمنية {/*security*/}

تُحكم الوسائط المُرسَلة إلى Server Actions بالكامل من قبل العميل. من أجل الأمان، دائمًا عاملها كمُدخَلات غير موثوق بها، وتأكد دائمًا من التحقق وتهيئة الوسائط بالطريقة المناسبة.

في أي Server Action، تأكد من التحقق من أن المستخدم الذي سجل دخوله مسموح له بأداء تلك العملية.

<Wip>

لمنع إرسال بيانات حساسة من إجراء خادمي، هناك واجهات برمجة تجريبية لمنع تمرير القيم والكائنات الفريدة إلى كود العميل.

اطلع على [`experimental_taintUniqueValue`](/reference/react/experimental_taintUniqueValue) و [`experimental_taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Wip>

### وسائط وقيم الإرجاع قابلة للتسلسل {/*serializable-parameters-and-return-values*/}

عندما يستدعي كود العميل Server Action عبر الشبكة، فإن أي وسائط يتم تمريرها ستحتاج إلى أن تكون قابلة للتسلسل.

فيما يلي الأنواع المدعومة لوسائط إجراء الخادم:

* البيانات الأساسية
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), الرموز المُسجَّلة فقط في سجل الرموز من خلال [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)

* مجموعات تحتوي على قيم قابلة للتسلسل
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* نماذد [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [كائنات عادية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): تلك التي تم إنشاؤها باستخدام [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), مع خصائص متسلسلة
* دوال Server Actions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

<<<<<<< HEAD
وتجدر الإشارة إلى عدم دعم ما يلي:
* عناصر React، أو [JSX](https://react.dev/learn/writing-markup-with-jsx)
* الدوال بما في ذلك المكونات أو أي دوال ليست Server Action
=======
Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Action
>>>>>>> 081d1008dd1eebffb9550a3ff623860a7d977acf
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* كائنات تكون مثيلات من أي Class (بخلاف المدمجة المذكورة) أو كائنات ب [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* الرموز التي لم تُسجل عالمياً، مثل `Symbol('my new symbol')`

قيم الإرجاع القابلة للتسلسل المدعومة هي نفسها كالخصائص القابلة للتسلسل لـ Boundry Client Component.

## الاستخدام {/*usage*/}

### Server Actions في النماذج `<form>` {/*server-actions-in-forms*/}

إن أشهر استخدام للـ Server Actions سيكون مناداة هذه الدوال لتحديث البيانات. في المتصفح، يعتبر عنصر [HTML `<from>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) الطريقة التقليدية للمستخدم لإرسال تعديل. مع React Server Components، تقدم React دعمًا متكاملاً للـ Server Actions في [النماذج](/reference/react-dom/components/form)..

هذا النموذج يطلب من المستخدم ادخال اسمه:

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

في هذا المثال، يتم تمرير `requestUsername` كـ Server Action إلى `<form>`. عندما يقوم المستخدم بإرسال هذا النموذج، يتم إرسال طلب شبكة إلى دالة الخادم `requestUsername`. عند استدعاء Server Action في نموذج، ستقوم React بتزويد <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> النموذج كالوسيط الأول للـ Server Action.

من خلال تمرير Server Action إلى `action`، يمكن لـ React [تحسين النموذج تدريجيًا](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). وهذا يعني أنه يمكن إرسال النماذج قبل تحميل ملف JavaScript.

#### معالجة القيم الراجعة من النماذج {/*handling-return-values*/}

في نموذج اسم المستخدم السابق، من المحتمل ألا يوجد username. في هذه الحالة يجب على `requrestUsername` أن يخبرنا إن كان فشل أم لا.

لتحديث واجهة المستخدم اعتماد على نتيجة Server Action يمكنك استخدام [`useFormState`](/reference/react-dom/hooks/useFormState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useFormState } from 'react-dom';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [returnValue, action] = useFormState(requestUsername, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {returnValue}</p>
    </>
  );
}
```

لاحظ أن `useFormState` يمكن استخدامها فقط في <CodeStep step={1}>[client code](/reference/react/use-client)</CodeStep>.

### استخدام Server Action خارج `<form>` {/*calling-a-server-action-outside-of-form*/}

تعتبر Server Actions نقاط نهاية خادم (Endpoint) ويمكن استدعاؤها في أي مكان في كود العميل.

عند استخدام Server Action خارج `<form>`، استدعها في [transition](/reference/react/useTransition)، والذي يسمح لك بعرض مؤشر التحميل، وعرض [تحديثات الحالة التفاؤلية](/reference/react/useOptimistic)، والتعامل مع الأخطاء غير المتوقعة. ستقوم النماذج تلقائيًا بتغليف Server Actions في transitions.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

لقراءة القيمة المرجعة، ستحتاج إلى `await` الـ Promise المرجعة.
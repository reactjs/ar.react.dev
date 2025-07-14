---
title: "'use server'"
titleForTitleTag: "'use server' directive"
---

<RSC>

<<<<<<< HEAD
هذه التوجيهات لازمة فقط إذا كنت [تستخدم RSC (مكونات الخادم)](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) أو تبني مكتبة متوافقة معها.
=======
`'use server'` is for use with [using React Server Components](/reference/rsc/server-components).
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

</RSC>


<Intro>

`'use server'` يميّز دوال الخادم (server-side functions) التي يمكن استدعاؤها في الكود من جانب العميل (client-side).

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
أضف `'use server';` في أعلى دالة غير متزامنة (async) لتمييز أن الدالة يمكن تنفيذها من قبل العميل. نسمي هذه الدوال Server Actions.
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions [_Server Functions_](/reference/rsc/server-functions).
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
يمكن تمرير هذه الدالة إلى العميل، عندما تُستدعى، ستنفذ طلب شبكة إلى الخادم يتضمن نسخة متسلسلة من أي معاملات تم تمريرها. إذا كان Server Action ترجع قيمة، سيتم تسلسلها وإرجاعها إلى العميل.

بدلا من وضع `'use server'` في أول الدالة، يمكنك إضافة `'use server';` في أعلى ملف لتمييز كل التصديرات في هذا الملف كدوال خادم غير متزامنة يمكن استخدامها في أي مكان، بما في ذلك استيرادها في ملفات مكونات العميل.

#### ملاحظات {/*caveats*/}
=======
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Functions from [client code](/reference/rsc/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Functions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Functions should be called in a [Transition](/reference/react/useTransition). Server Functions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

* يجب أن تكون `'use server'` في بداية الدالة أو الملف. فوق أي كود آخر، بما في ذلك الاستيرادات (التعليقات قبل `'use server'` مسموح به) يجب كتابتها بعلامة تنصيص مفردة أو مزدوجة. ليس backticks.
* يمكن استخدام `'use server'` في ملفات الخادم فقط، ومن ثَمّ يمكن تمرير Server Actions إلى مكونات العميل من خلال الخصائص (props). اقرأ أيضًا [أنواع التسلسل](#serializable-parameters-and-return-values).
* عند استيراد Server Action من [كود Client](/reference/rsc/use-client)، يجب استخدام التوجيهات على مستوى الملف وليس الدالة.
* لأن الاستدعاءات الشبكية الأساسية دائمًا غير متزامنة، يمكن استخدام `'use server'` فقط في دوال غير متزامنة (async).
* تذكر أن المعاملات الممررة إلى دالة مميزة بـ `'use server'` متحكم بها بالكامل من جانب العميل. للأمان، عاملها دائمًا كإدخال غير موثوق به، وتأكد من التحقق من صحتها وتصفيتها كما يناسبك.
* يفضل استعمال Server Actions في [`useTranistion`](/reference/rsc/useTransition)، أما Server Actions التي يتم تمريرها إلى [`<form action>`](/reference/react-dom/components/form#props) أو [`formAction`](/reference/react-dom/components/input#props) سيتم إضافة transition لهم تلقائيًا.
* تم تصميم Server Actions لعمليات تعديل حالة الخادم. لا ينصح باستخدامهم في جلب البيانات، ووفقًا لذلك، فإن الإطارات التي تنفذ Server Actions عادة تعالج إجراء واحد في كل مرة وليس لديها طريقة لتخزين قيمة الإرجاع.

<<<<<<< HEAD
### الاعتبارات الأمنية {/*security*/}

تُحكم الوسائط المُرسَلة إلى Server Actions بالكامل من قبل العميل. من أجل الأمان، دائمًا عاملها كمُدخَلات غير موثوق بها، وتأكد دائمًا من التحقق وتهيئة الوسائط بالطريقة المناسبة.

في أي Server Action، تأكد من التحقق من أن المستخدم الذي سجل دخوله مسموح له بأداء تلك العملية.

<Wip>

لمنع إرسال بيانات حساسة من إجراء خادمي، هناك واجهات برمجة تجريبية لمنع تمرير القيم والكائنات الفريدة إلى كود العميل.
=======
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

اطلع على [`experimental_taintUniqueValue`](/reference/react/experimental_taintUniqueValue) و [`experimental_taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Wip>

### وسائط وقيم الإرجاع قابلة للتسلسل {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
عندما يستدعي كود العميل Server Action عبر الشبكة، فإن أي وسائط يتم تمريرها ستحتاج إلى أن تكون قابلة للتسلسل.

فيما يلي الأنواع المدعومة لوسائط إجراء الخادم:
=======
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.

Here are supported types for Server Function arguments:
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

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
<<<<<<< HEAD
* نماذد [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [كائنات عادية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): تلك التي تم إنشاؤها باستخدام [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), مع خصائص متسلسلة
* دوال Server Actions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

وتجدر الإشارة إلى عدم دعم ما يلي:
* عناصر React، أو [JSX](/learn/writing-markup-with-jsx)
* الدوال بما في ذلك المكونات أو أي دوال ليست Server Action
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* كائنات تكون مثيلات من أي Class (بخلاف المدمجة المذكورة) أو كائنات ب [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* الرموز التي لم تُسجل عالمياً، مثل `Symbol('my new symbol')`
=======
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
* Events from event handlers
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

قيم الإرجاع القابلة للتسلسل المدعومة هي نفسها كالخصائص القابلة للتسلسل لـ Boundry Client Component.

## الاستخدام {/*usage*/}

### Server Actions في النماذج `<form>` {/*server-actions-in-forms*/}

إن أشهر استخدام للـ Server Actions سيكون مناداة هذه الدوال لتحديث البيانات. في المتصفح، يعتبر عنصر [HTML `<from>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) الطريقة التقليدية للمستخدم لإرسال تعديل. مع React Server Components، تقدم React دعمًا متكاملاً للـ Server Actions في [النماذج](/reference/react-dom/components/form)..

<<<<<<< HEAD
هذا النموذج يطلب من المستخدم ادخال اسمه:
=======
### Server Functions in forms {/*server-functions-in-forms*/}

The most common use case of Server Functions will be calling functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

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

<<<<<<< HEAD
في هذا المثال، يتم تمرير `requestUsername` كـ Server Action إلى `<form>`. عندما يقوم المستخدم بإرسال هذا النموذج، يتم إرسال طلب شبكة إلى دالة الخادم `requestUsername`. عند استدعاء Server Action في نموذج، ستقوم React بتزويد <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> النموذج كالوسيط الأول للـ Server Action.

من خلال تمرير Server Action إلى `action`، يمكن لـ React [تحسين النموذج تدريجيًا](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). وهذا يعني أنه يمكن إرسال النماذج قبل تحميل ملف JavaScript.
=======
In this example `requestUsername` is a Server Function passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Function in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Function.

By passing a Server Function to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

#### معالجة القيم الراجعة من النماذج {/*handling-return-values*/}

في نموذج اسم المستخدم السابق، من المحتمل ألا يوجد username. في هذه الحالة يجب على `requrestUsername` أن يخبرنا إن كان فشل أم لا.

<<<<<<< HEAD
لتحديث واجهة المستخدم اعتماد على نتيجة Server Action يمكنك استخدام [`useActionState`](/reference/react/useActionState).
=======
To update the UI based on the result of a Server Function while supporting progressive enhancement, use [`useActionState`](/reference/react/useActionState).
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

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

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

لاحظ أن `useActionState` يمكن استخدامها فقط في <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep>.

<<<<<<< HEAD
### استخدام Server Action خارج `<form>` {/*calling-a-server-action-outside-of-form*/}

تعتبر Server Actions نقاط نهاية خادم (Endpoint) ويمكن استدعاؤها في أي مكان في كود العميل.

عند استخدام Server Action خارج `<form>`، استدعها في [Transition](/reference/react/useTransition)، والذي يسمح لك بعرض مؤشر التحميل، وعرض [تحديثات الحالة التفاؤلية](/reference/react/useOptimistic)، والتعامل مع الأخطاء غير المتوقعة. ستقوم النماذج تلقائيًا بتغليف Server Actions في Transition.
=======
### Calling a Server Function outside of `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions are exposed server endpoints and can be called anywhere in client code.

When using a Server Function outside a [form](/reference/react-dom/components/form), call the Server Function in a [Transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

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

<<<<<<< HEAD
لقراءة القيمة المرجعة، ستحتاج إلى `await` الـ Promise المرجعة.
=======
To read a Server Function return value, you'll need to `await` the promise returned.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

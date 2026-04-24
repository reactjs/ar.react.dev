---
title: "'use server'"
titleForTitleTag: "توجيه 'use server'"
---

<RSC>

`'use server'` مخصص للاستخدام مع [استخدام مكونات React من جانب الخادم](/reference/rsc/server-components).

</RSC>


<Intro>

`'use server'` يوسم دوالًا من جانب الخادم يمكن استدعاؤها من كود جانب العميل.

</Intro>

<InlineToc />

---

## مرجع {/*reference*/}

### `'use server'` {/*use-server*/}

أضف `'use server'` في بداية جسم دالة غير متزامنة (`async`) لوسم الدالة على أنها قابلة للاستدعاء من العميل. نسمي هذه الدوال [_دوال خادم_](/reference/rsc/server-functions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

عند استدعاء دالة خادم على العميل، يُجرى طلب شبكة إلى الخادم يتضمن نسخة مُسلسلة من أي معاملات مُمرَّرة. إذا أرجعت دالة الخادم قيمة، تُسلسل هذه القيمة وتُعاد إلى العميل.

بدلًا من وسم كل دالة على حدة بـ `'use server'`، يمكنك إضافة التوجيه في أعلى الملف لوسم كل الصادرات في ذلك الملف على أنها دوال خادم يمكن استخدامها في أي مكان، بما في ذلك الاستيراد في كود العميل.

#### تحذيرات {/*caveats*/}
* يجب أن يكون `'use server'` في بداية الدالة أو الوحدة تمامًا؛ فوق أي كود آخر بما في ذلك الاستيراد (التعليقات فوق التوجيهات مسموحة). يجب كتابته بعلامتي اقتباس مفردتين أو مزدوجتين، وليس بعلامات الاقتباس الخلفية.
* يمكن استخدام `'use server'` فقط في ملفات من جانب الخادم. يمكن تمرير دوال الخادم الناتجة إلى مكوّنات العميل عبر الخصائص. انظر [الأنواع المدعومة للتسلسل](#serializable-parameters-and-return-values).
* لاستيراد دوال خادم من [كود العميل](/reference/rsc/use-client)، يجب استخدام التوجيه على مستوى الوحدة.
* لأن طلبات الشبكة الأساسية دائمًا غير متزامنة، يمكن استخدام `'use server'` فقط مع دوال `async`.
* اعُد معاملات دوال الخادم دائمًا مدخلات غير موثوقة، وتأكد من تفويض أي تعديلات قبل تنفيذها. انظر [اعتبارات الأمان](#security).
* يُفضَّل استدعاء دوال الخادم داخل [Transition](/reference/react/useTransition). دوال الخادم المُمرَّرة إلى [`<form action>`](/reference/react-dom/components/form#props) أو [`formAction`](/reference/react-dom/components/input#props) تُستدعى تلقائيًا داخل انتقال (transition).
* دوال الخادم مصممة للتعديلات التي تحدّث الحالة على الخادم؛ لا يُنصح بها لجلب البيانات. وفقًا لذلك، تُعالج أطر العمل التي تنفّذ دوال الخادم عادةً إجراءً واحدًا في المرة ولا تملك طريقة لتخزين القيمة المُرجعة مؤقتًا.

### اعتبارات الأمان {/*security*/}

معاملات دوال الخادم تخضع بالكامل لسيطرة العميل. لأسباب أمنية، عاملها دائمًا كمدخلات غير موثوقة، وتأكد من التحقق من صحتها وتعقيمها (escape) حسب الحاجة.

في أي دالة خادم، تأكد من أن المستخدم المسجَّل دخوله مخوّل لتنفيذ ذلك الإجراء.

<Wip>

لمنع إرسال بيانات حساسة من دالة خادم، توجد واجهات برمجة تجريبية (taint) تمنع تمرير قيم وفريدة أو كائنات إلى كود العميل.

انظر [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) و[experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### معاملات وقيم إرجاع قابلة للتسلسل {/*serializable-parameters-and-return-values*/}

بما أن كود العميل يستدعي دالة الخادم عبر الشبكة، يجب أن تكون أي معاملات مُمرَّرة قابلة للتسلسل.

إليك الأنواع المدعومة لمعاملات دوال الخادم:

* القيم البدائية
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)، فقط الرموز المسجَّلة في سجل Symbol العام عبر [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* تكرارات تحتوي قيمًا قابلة للتسلسل
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* مثيلات [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) عادية: المُنشأة بـ [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)، وخصائصها قابلة للتسلسل
* دوال هي دوال خادم
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ومما يلفت الانتباه أن هذه **غير** مدعومة:
* عناصر React، أو [JSX](/learn/writing-markup-with-jsx)
* دوال، بما في ذلك دوال المكوّنات أو أي دالة ليست دالة خادم
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* كائنات هي مثيلات لأي صنف (غير المدمجة المذكورة) أو كائنات ذات [نموذج أولي فارغ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* رموز غير مسجَّلة عالميًا، مثل `Symbol('my new symbol')`
* أحداث من معالجات الأحداث


قيم الإرجاع القابلة للتسلسل المدعومة هي نفسها [خصائص قابلة للتسلسل](/reference/rsc/use-client#serializable-types) لمكوّن عميل عند الحدّ.


## الاستخدام {/*usage*/}

### دوال الخادم في النماذج {/*server-functions-in-forms*/}

أكثر حالات استخدام دوال الخادم شيوعًا هي استدعاء دوال تعدّل البيانات. في المتصفح، [عنصر نموذج HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) هو الأسلوب التقليدي ليُرسل المستخدم تعديلًا. مع مكونات React من جانب الخادم، تقدّم React دعمًا من الدرجة الأولى لدوال الخادم كإجراءات (Actions) في [النماذج](/reference/react-dom/components/form).

إليك نموذجًا يتيح للمستخدم طلب اسم مستخدم.

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

في هذا المثال `requestUsername` هي دالة خادم مُمرَّرة إلى `<form>`. عند إرسال المستخدم لهذا النموذج، يُجرى طلب شبكة إلى دالة الخادم `requestUsername`. عند استدعاء دالة خادم في نموذج، يمرّر React <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> الخاص بالنموذج كأول معامل لدالة الخادم.

بتمرير دالة خادم إلى `action` النموذج، يمكن لـ React [تحسين النموذج تدريجيًا](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). أي يمكن إرسال النماذج قبل تحميل حزمة JavaScript.

#### التعامل مع قيم الإرجاع في النماذج {/*handling-return-values*/}

في نموذج طلب اسم المستخدم، قد لا يكون اسم المستخدم متاحًا. يجب أن تخبرنا `requestUsername` إن فشل الأمر أم لا.

لتحديث الواجهة بناءً على نتيجة دالة الخادم مع دعم التحسين التدريجي، استخدم [`useActionState`](/reference/react/useActionState).

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

لاحظ أنه كمعظم الـ Hooks، لا يمكن استدعاء `useActionState` إلا في <CodeStep step={1}>[كود العميل](/reference/rsc/use-client)</CodeStep>.

### استدعاء دالة خادم خارج `<form>` {/*calling-a-server-function-outside-of-form*/}

دوال الخادم هي نقاط نهاية على الخادم ويمكن استدعاؤها من أي مكان في كود العميل.

عند استخدام دالة خادم خارج [نموذج](/reference/react-dom/components/form)، استدعِ دالة الخادم داخل [Transition](/reference/react/useTransition)، مما يتيح عرض مؤشر تحميل، وعرض [تحديثات حالة متفائلة](/reference/react/useOptimistic)، والتعامل مع أخطاء غير متوقعة. تُغلِّف النماذج دوال الخادم تلقائيًا داخل انتقالات.

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

لقراءة قيمة إرجاع دالة خادم، ستحتاج إلى `await` للوعد (Promise) المُرجع.

---
title: useActionState
---

<Intro>

`useActionState` هو Hook يتيح لك تحديث الحالة بناءً على نتيجة إجراء نموذج (form action).

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

في إصدارات React Canary الأقدم، كانت هذه الواجهة جزءًا من React DOM وتُسمى `useFormState`.

</Note>


<InlineToc />

---

## Reference {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

استدعِ `useActionState` في أعلى مكوّنك لإنشاء حالة للمكوّن تُحدَّث [عند استدعاء إجراء نموذج](/reference/react-dom/components/form). تمرّر إلى `useActionState` دالة إجراء نموذج موجودة بالإضافة إلى حالة أولية، فيُرجع إجراءً جديدًا تستخدمه في النموذج، مع أحدث حالة للنموذج وما إذا كان الإجراء لا يزال قيد التنفيذ. تُمرَّر أحدث حالة النموذج أيضًا إلى الدالة التي زوّدتها.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

حالة النموذج هي القيمة التي أرجعها الإجراء عند آخر إرسال للنموذج. إذا لم يُرسَل النموذج بعد، فهي الحالة الأولية التي مررتها.

عند الاستخدام مع دالة خادم (Server Function)، يتيح `useActionState` عرض استجابة الخادم من إرسال النموذج حتى قبل اكتمال الترطيب (hydration).

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `fn`: الدالة المُستدعاة عند إرسال النموذج أو الضغط على زر. عند استدعائها، تستلم الحالة السابقة للنموذج (في البداية `initialState` التي مررتها، ثم قيمة إرجاعها السابقة) كأول معامل، يليها المعاملات التي يستلمها إجراء النموذج عادةً.
* `initialState`: القيمة التي تريد أن تبدأ بها الحالة. يمكن أن تكون أي قيمة قابلة للتسلسل. يُتجاهل هذا المعامل بعد أول استدعاء للإجراء.
* **اختياري** `permalink`: سلسلة تحتوي على عنوان URL الفريد للصفحة التي يعدّلها هذا النموذج. للاستخدام في صفحات ذات محتوى ديناميكي (مثل الخلاصات) مع التحسين التدريجي: إذا كانت `fn` [دالة خادم](/reference/rsc/server-functions) وأُرسِل النموذج قبل تحميل حزمة JavaScript، فسينتقل المتصفح إلى عنوان `permalink` المحدد بدلًا من عنوان الصفحة الحالية. تأكد من عرض مكوّن النموذج نفسه في صفحة الوجهة (بما في ذلك نفس الإجراء `fn` و`permalink`) حتى يعرف React كيف يمرّر الحالة. بعد ترطيب النموذج، لا يكون لهذا المعامل أثر.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Returns {/*returns*/}

`useActionState` يُرجع مصفوفة بالقيم التالية:

1. الحالة الحالية. أثناء أول رسم، تطابق `initialState` التي مررتها. بعد استدعاء الإجراء، تطابق القيمة التي أرجعها الإجراء.
2. إجراء جديد يمكنك تمريره كـ prop `action` لمكوّن `form` أو كـ prop `formAction` لأي زر `button` داخل النموذج. يمكن أيضًا استدعاء الإجراء يدويًا داخل [`startTransition`](/reference/react/startTransition).
3. العلم `isPending` الذي يخبرك ما إذا كان هناك انتقال (Transition) قيد التنفيذ.

#### Caveats {/*caveats*/}

* عند الاستخدام مع إطار يدعم React Server Components، يتيح `useActionState` جعل النماذج تفاعلية قبل تنفيذ JavaScript على العميل. بدون Server Components، يعادل الحالة المحلية للمكوّن.
* الدالة المُمرَّرة إلى `useActionState` تستلم معاملًا إضافيًا، وهو الحالة السابقة أو الأولية للنموذج، كأول معامل. هذا يجعل توقيعها مختلفًا عن استخدامها مباشرة كإجراء نموذج دون `useActionState`.

---

## Usage {/*usage*/}

### Using information returned by a form action {/*using-information-returned-by-a-form-action*/}

استدعِ `useActionState` في أعلى مكوّنك للوصول إلى القيمة المُرجعة من إجراء آخر مرة أُرسِل فيها نموذج.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` يُرجع مصفوفة بالعناصر التالية:

1. <CodeStep step={1}>الحالة الحالية</CodeStep> للنموذج، وتُضبط في البداية إلى <CodeStep step={4}>الحالة الأولية</CodeStep> التي زوّدت بها، وبعد إرسال النموذج تُضبط إلى القيمة المُرجعة من <CodeStep step={3}>الإجراء</CodeStep> الذي زوّدت به.
2. <CodeStep step={2}>إجراء جديد</CodeStep> تمرّره إلى `<form>` كـ prop `action` أو تستدعيه يدويًا داخل `startTransition`.
3. <CodeStep step={1}>حالة انتظار</CodeStep> يمكنك استخدامها أثناء معالجة الإجراء.

عند إرسال النموذج، تُستدعى دالة <CodeStep step={3}>الإجراء</CodeStep> التي زوّدت بها. تصبح قيمة إرجاعها <CodeStep step={1}>الحالة الحالية</CodeStep> الجديدة للنموذج.

يستلم <CodeStep step={3}>الإجراء</CodeStep> الذي زوّدت به أيضًا معاملًا أولًا جديدًا، وهو <CodeStep step={1}>الحالة الحالية</CodeStep> للنموذج. عند أول إرسال، تكون هذه هي <CodeStep step={4}>الحالة الأولية</CodeStep> التي زوّدت بها، وفي الإرسالات اللاحقة تكون قيمة الإرجاع من آخر استدعاء للإجراء. بقية المعاملات كما لو لم تُستخدم `useActionState`.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Display information after submitting a form" titleId="display-information-after-submitting-a-form">

#### Display form errors {/*display-form-errors*/}

لعرض رسائل مثل رسالة خطأ أو toast تُرجعها دالة خادم، لفّ الإجراء باستدعاء `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### Display structured information after submitting a form {/*display-structured-information-after-submitting-a-form*/}

يمكن أن تكون القيمة المُرجعة من دالة الخادم أي قيمة قابلة للتسلسل. على سبيل المثال، قد يكون كائنًا يتضمن قيمة منطقية تشير إلى نجاح الإجراء، أو رسالة خطأ، أو معلومات محدَّثة.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## Troubleshooting {/*troubleshooting*/}

### My action can no longer read the submitted form data {/*my-action-can-no-longer-read-the-submitted-form-data*/}

عند لفّ إجراء بـ `useActionState`، يُضاف معامل إضافي *كأول معامل*. بيانات النموذج المُرسَل تكون إذن معاملها *الثاني* بدل الأول كما هو المعتاد. المعامل الأول الجديد هو الحالة الحالية للنموذج.

```js
function action(currentState, formData) {
  // ...
}
```

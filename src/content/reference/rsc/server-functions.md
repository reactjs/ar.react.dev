---
title: دوال الخادم
---

<RSC>

[دوال الخادم](/reference/rsc/server-functions) مخصّصة للاستخدام مع [مكوّنات خادم React](/reference/rsc/server-components).

**ملاحظة:** حتى سبتمبر 2024، كنّا نسمّي كل دوال الخادم «Server Actions». إذا اُمرّرت دالة خادم إلى خاصّية `action` أو استُدعيت من داخل action فهي Server Action، لكن ليست كل دوال الخادم هي Server Actions. حُدّثت التسمية في هذا التوثيق ليعكس أن دوال الخادم يمكن استخدامها لأغراض متعددة.

</RSC>

<Intro>

تتيح دوال الخادم لمكوّنات العميل استدعاء دوال async تُنفَّذ على الخادم.

</Intro>

<InlineToc />

<Note>

#### كيف أبني دعماً لدوال الخادم؟ {/*how-do-i-build-support-for-server-functions*/}

بينما دوال الخادم في React 19 مستقرة ولن تنكسر بين الإصدارات الفرعية، فإن واجهات البرمجة الأساسية المستخدمة لتنفيذ دوال الخادم في مُجمّع أو إطار عمل لـ React Server Components لا تتبع semver وقد تنكسر بين الإصدارات الفرعية في React 19.x.

لدعم دوال الخادم كمُجمّع أو إطار عمل، نوصي بتثبيت إصدار محدّد من React، أو استخدام إصدار Canary. سنواصل العمل مع المُجمّعات والأطر لاستقرار واجهات تنفيذ دوال الخادم لاحقاً.

</Note>

عند تعريف دالة خادم بتوجيه [`"use server"`](/reference/rsc/use-server)، ينشئ إطار العمل تلقائياً مرجعاً إلى دالة الخادم ويُمرّره إلى مكوّن العميل. عند استدعاء الدالة على العميل، يرسل React طلباً إلى الخادم لتنفيذ الدالة وإرجاع النتيجة.

يمكن إنشاء دوال الخادم في مكوّنات الخادم وتمريرها كـ props إلى مكوّنات العميل، أو استيرادها واستخدامها داخل مكوّنات العميل.

## الاستخدام {/*usage*/}

### إنشاء دالة خادم من مكوّن خادم {/*creating-a-server-function-from-a-server-component*/}

يمكن لمكوّنات الخادم تعريف دوال خادم بتوجيه `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

عندما يُصيّر React مكوّن الخادم `EmptyNote`، ينشئ مرجعاً إلى الدالة `createNoteAction` ويُمرّره إلى مكوّن العميل `Button`. عند النقر على الزر، يرسل React طلباً إلى الخادم لتنفيذ `createNoteAction` بالمرجع الموفَّر:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

لمزيد من التفاصيل، راجع [`"use server"`](/reference/rsc/use-server).


### استيراد دوال الخادم من مكوّنات العميل {/*importing-server-functions-from-client-components*/}

يمكن لمكوّنات العميل استيراد دوال الخادم من ملفات تستخدم توجيه `"use server"`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

عندما يُجمّع المُجمّع مكوّن العميل `EmptyNote`، ينشئ مرجعاً إلى الدالة `createNote` في الحزمة. عند النقر على الزر، يرسل React طلباً إلى الخادم لتنفيذ `createNote` باستخدام المرجع:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

لمزيد من التفاصيل، راجع [`"use server"`](/reference/rsc/use-server).

### دوال الخادم مع Actions {/*server-functions-with-actions*/}

يمكن استدعاء دوال الخادم من Actions على العميل:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

هذا يتيح الوصول إلى حالة `isPending` لدالة الخادم بلفّها في Action على العميل.

لمزيد من التفاصيل، راجع [استدعاء دالة خادم خارج `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### دوال الخادم مع Form Actions {/*using-server-functions-with-form-actions*/}

تعمل دوال الخادم مع ميزات النماذج الجديدة في React 19.

يمكنك تمرير دالة خادم إلى `<form>` لإرسال النموذج تلقائياً إلى الخادم:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

عند نجاح إرسال النموذج، يُصفّر React النموذج تلقائياً. يمكنك إضافة `useActionState` للوصول إلى حالة التعليق، آخر استجابة، أو لدعم التحسين التدريجي.

لمزيد من التفاصيل، راجع [دوال الخادم في النماذج](/reference/rsc/use-server#server-functions-in-forms).

### دوال الخادم مع `useActionState` {/*server-functions-with-use-action-state*/}

يمكن استدعاء دوال الخادم مع `useActionState` للحالة الشائعة التي تحتاج فيها فقط إلى حالة تعليق الـ action وآخر استجابة:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

عند استخدام `useActionState` مع دوال الخادم، يعيد React أيضاً تشغيل إرسالات النموذج التي أُدخلت قبل انتهاء الترطيب. يعني ذلك أن المستخدمين يمكنهم التفاعل مع تطبيقك حتى قبل اكتمال الترطيب.

لمزيد من التفاصيل، راجع [`useActionState`](/reference/react/useActionState).

### التحسين التدريجي مع `useActionState` {/*progressive-enhancement-with-useactionstate*/}

تدعم دوال الخادم التحسين التدريجي عبر الوسيط الثالث لـ `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

عند تمرير <CodeStep step={2}>permalink</CodeStep> إلى `useActionState`، يُعيد React التوجيه إلى عنوان URL الموفَّر إذا أُرسل النموذج قبل تحميل حزمة JavaScript.

لمزيد من التفاصيل، راجع [`useActionState`](/reference/react/useActionState).

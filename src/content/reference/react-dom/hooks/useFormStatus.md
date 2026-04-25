---
title: "حالة النموذج (useFormStatus)"
---

<Intro>

`useFormStatus` خطاف يعطيك معلومات حالة عن آخر إرسال لنموذج.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

يوفّر خطاف `useFormStatus` معلومات حالة عن آخر إرسال لنموذج.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>إرسال</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

للحصول على معلومات الحالة، يجب أن يُصَيَّر مكوّن `Submit` داخل `<form>`. يُرجِع الخطاف معلومات مثل خاصية <CodeStep step={1}>`pending`</CodeStep> التي تخبرك إن كان النموذج قيد الإرسال.

في المثال أعلاه، يستخدم `Submit` ذلك لتعطيل النقر على `<button>` أثناء إرسال النموذج.

[المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

لا يقبل `useFormStatus` أي معاملات.

#### القيمة المُرجَعة {/*returns*/}

كائن `status` بالخصائص التالية:

* `pending`: قيمة منطقية. إن كانت `true`، فنموذج `<form>` الأب قيد الإرسال. وإلا `false`.

* `data`: كائن يطبّق [واجهة FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ويحتوي بيانات النموذج الأب المُرسَلَة. إن لم يكن هناك إرسال نشط أو لا يوجد `<form>` أب، تكون القيمة `null`.

* `method`: سلسلة إما `'get'` أو `'post'`. تمثّل ما إن كان النموذج الأب يُرسَل بـ GET أو POST [وفق طريقة HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). افتراضيًا يستخدم `<form>` طريقة `GET` ويمكن ضبطها بخاصية [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: مرجع إلى الدالة الممرَّرة لخاصية `action` على `<form>` الأب. إن لم يكن هناك `<form>` أب، الخاصية `null`. إن وُجدت قيمة URI لـ `action` أو لم تُحدَّد خاصية `action`، يكون `status.action` هو `null`.

#### ملاحظات {/*caveats*/}

* يجب استدعاء خطاف `useFormStatus` من مكوّن يُصَيَّر داخل `<form>`.
* يُرجِع `useFormStatus` معلومات الحالة لـ `<form>` أب فقط. لا يُرجِع معلومات لأي `<form>` يُصَيَّر في ذلك المكوّن نفسه أو في أبنائه.

---

## الاستخدام {/*usage*/}

### عرض حالة التعليق أثناء إرسال النموذج {/*display-a-pending-state-during-form-submission*/}
لعرض حالة تعليق أثناء إرسال النموذج، استدعِ خطاف `useFormStatus` في مكوّن يُصَيَّر داخل `<form>` واقرأ الخاصية `pending` المُرجَعة.

هنا نستخدم `pending` لإظهار أن النموذج يُرسَل.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "جارٍ الإرسال..." : "إرسال"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>  

<Pitfall>

##### لن يُرجِع `useFormStatus` معلومات حالة لـ `<form>` يُصَيَّر في المكوّن نفسه. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

يُرجِع خطاف `useFormStatus` معلومات الحالة لـ `<form>` أب فقط، لا لأي `<form>` يُصَيَّر في المكوّن الذي يستدعي الخطاف أو في أبنائه.

```js
function Form() {
  // 🚩 لن تكون `pending` أبدًا true
  // useFormStatus لا يتتبع النموذج المُصَيَّر في هذا المكوّن
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

بدلًا من ذلك استدعِ `useFormStatus` من داخل مكوّن يقع داخل `<form>`.

```js
function Submit() {
  // ✅ تُشتق `pending` من النموذج الذي يلف مكوّن Submit
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // هذا هو `<form>` الذي يتتبعه useFormStatus
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### قراءة بيانات النموذج المُرسَلَة {/*read-form-data-being-submitted*/}

يمكنك استخدام خاصية `data` من معلومات الحالة المُرجَعة من `useFormStatus` لعرض البيانات التي يُرسِلها المستخدم.

هنا نموذج يطلب اسم مستخدم. نستخدم `useFormStatus` لعرض رسالة حالة مؤقتة تؤكد اسم المستخدم المطلوب.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>طلب اسم مستخدم: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        إرسال
      </button>
      <br />
      <p>{data ? `جارٍ طلب ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>  

---

## حل المشكلات {/*troubleshooting*/}

### `status.pending` لا تكون أبدًا `true` {/*pending-is-never-true*/}

يُرجِع `useFormStatus` معلومات الحالة لـ `<form>` أب فقط.

إن لم يكن المكوّن الذي يستدعي `useFormStatus` متداخلًا في `<form>`، ستكون `status.pending` دائمًا `false`. تحقق أن `useFormStatus` يُستدعى من مكوّن هو ابن عنصر `<form>`.

لن يتتبع `useFormStatus` حالة `<form>` يُصَيَّر في المكوّن نفسه. انظر [الفخ](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) للمزيد.

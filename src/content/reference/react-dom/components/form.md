---
title: "<form>"
---

<Intro>

يتيح لك [مكوّن `<form>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) إنشاء عناصر تحكم تفاعلية لإرسال المعلومات.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<form>` {/*form*/}

لإنشاء عناصر تحكم تفاعلية لإرسال المعلومات، صيّر [مكوّن `<form>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<form>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): عنوان URL أو دالة. عند تمرير عنوان URL إلى `action` يتصرف النموذج مثل مكوّن نموذج HTML. عند تمرير دالة إلى `action` تتولى الدالة إرسال النموذج داخل انتقال (Transition) وفق [نمط خاصية Action](/reference/react/useTransition#exposing-action-props-from-components). يمكن أن تكون الدالة الممرَّرة إلى `action` غير متزامنة (async) ويُستدعَى مع وسيط واحد يحتوي على [بيانات النموذج](https://developer.mozilla.org/en-US/docs/Web/API/FormData) للنموذج المُرسَل. يمكن تجاوز خاصية `action` بسمة `formAction` على مكوّن `<button>` أو `<input type="submit">` أو `<input type="image">`.

#### تنبيهات {/*caveats*/}

* عند تمرير دالة إلى `action` أو `formAction` ستكون طريقة HTTP هي POST بغضّ النظر عن قيمة خاصية `method`.

---

## الاستخدام {/*usage*/}

### معالجة إرسال النموذج على العميل {/*handle-form-submission-on-the-client*/}

مرِّر دالة إلى خاصية `action` للنموذج لتشغيل الدالة عند إرسال النموذج. تُمرَّر [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) إلى الدالة كوسيط حتى تتمكن من الوصول إلى البيانات المُرسَلة. يختلف ذلك عن [إجراء HTML التقليدي](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) الذي يقبل عناوين URL فقط. بعد نجاح دالة `action`، تُعاد تهيئة جميع حقول النموذج غير المتحكَّم فيها.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

### معالجة إرسال النموذج بدالة خادم {/*handle-form-submission-with-a-server-function*/}

صيّر `<form>` مع حقل إدخال وزر إرسال. مرِّر دالة خادم (دالة مُعلَّمة بـ [`'use server'`](/reference/rsc/use-server)) إلى خاصية `action` للنموذج لتشغيلها عند الإرسال.

تسمح تمرير دالة خادم إلى `<form action>` للمستخدمين بإرسال النماذج دون تفعيل JavaScript أو قبل تحميل الشيفرة. ذلك مفيد لمن لديهم اتصالًا بطيئًا أو جهازًا بطيئًا أو JavaScript معطّل، وهو مشابه لسلوك النماذج عند تمرير URL إلى خاصية `action`.

يمكنك استخدام حقول نموذج مخفية لتوفير بيانات لإجراء `<form>`. تُستدعى دالة الخادم مع بيانات الحقول المخفية كمثيل من [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

بدلًا من حقول مخفية لتوفير بيانات لإجراء `<form>`، يمكنك استدعاء طريقة <CodeStep step={1}>`bind`</CodeStep> لتزويدها بوسائط إضافية. ذلك يربط وسيطًا جديدًا (<CodeStep step={2}>`productId`</CodeStep>) بالدالة بالإضافة إلى <CodeStep step={3}>`formData`</CodeStep> المُمرَّرة كوسيط للدالة.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

عندما يُصيَّر `<form>` من [مكوّن خادم](/reference/rsc/use-client)، وتُمرَّر [دالة خادم](/reference/rsc/server-functions) إلى خاصية `action` للنموذج، يكون النموذج [معزَّزًا تدريجيًا](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### عرض حالة تعليق أثناء إرسال النموذج {/*display-a-pending-state-during-form-submission*/}
لعرض حالة تعليق أثناء إرسال النموذج، يمكنك استدعاء خطاف `useFormStatus` في مكوّن يُصيَّر داخل `<form>` وقراءة الخاصية `pending` المُعادة.

هنا نستخدم `pending` لإظهار أن النموذج قيد الإرسال.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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

لمعرفة المزيد عن خطاف `useFormStatus` راجع [صفحة المرجع](/reference/react-dom/hooks/useFormStatus).

### تحديث بيانات النموذج بتفاؤل {/*optimistically-updating-form-data*/}
يوفّر خطاف `useOptimistic` طريقة لتحديث واجهة المستخدم بتفاؤل قبل اكتمال عملية خلفية، مثل طلب شبكة. في سياق النماذج، يساعد ذلك على جعل التطبيقات تبدو أكثر استجابة. عند إرسال المستخدم لنموذج، بدل انتظار استجابة الخادم لعكس التغييرات، تُحدَّث الواجهة فورًا بالنتيجة المتوقعة.

مثلاً، عندما يكتب المستخدم رسالة في النموذج ويضغط زر «Send»، يسمح `useOptimistic` بظهور الرسالة فورًا في القائمة مع تسمية «Sending...» حتى قبل إرسالها فعليًا إلى الخادم. يعطي هذا الانطباع بالسرعة والاستجابة. يحاول النموذج بعدها إرسال الرسالة فعليًا في الخلفية. عندما يؤكد الخادم استلام الرسالة، تُزال تسمية «Sending...».

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentation page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/useOptimistic).'

### معالجة أخطاء إرسال النموذج {/*handling-form-submission-errors*/}

في بعض الحالات ترمي الدالة المُستدعاة من خاصية `action` للنموذج خطأ. يمكنك معالجة هذه الأخطاء بلف `<form>` داخل حدود خطأ (Error Boundary). إذا رمت الدالة خطأ، يُعرض بديل حدود الخطأ.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### عرض خطأ إرسال النموذج دون JavaScript {/*display-a-form-submission-error-without-javascript*/}

لعرض رسالة خطأ إرسال النموذج قبل تحميل حزمة JavaScript (للتعزيز التدريجي) يلزم:

1. أن يُصيَّر `<form>` من [مكوّن عميل](/reference/rsc/use-client)
1. أن تكون الدالة الممرَّرة إلى خاصية `action` للنموذج [دالة خادم](/reference/rsc/server-functions)
1. استخدام خطاف `useActionState` لعرض رسالة الخطأ

يأخذ `useActionState` وسيطين: [دالة خادم](/reference/rsc/server-functions) وحالة ابتدائية. يعيد `useActionState` قيمتين: متغير حالة وإجراءًا. يجب تمرير الإجراء المُعاد من `useActionState` إلى خاصية `action` للنموذج. يمكن استخدام متغير الحالة المُعاد لعرض رسالة الخطأ. تُستخدم القيمة التي تُعيدها دالة الخادم الممرَّرة إلى `useActionState` لتحديث متغير الحالة.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

تعرّف أكثر على تحديث الحالة من إجراء نموذج في وثائق [`useActionState`](/reference/react/useActionState)

### التعامل مع أنواع إرسال متعددة {/*handling-multiple-submission-types*/}

يمكن تصميم النماذج لدعم عدة إجراءات إرسال بحسب الزر الذي يضغطه المستخدم. يمكن ربط كل زر داخل النموذج بإجراء أو سلوك مميز عبر تعيين خاصية `formAction`.

عند ضغط زر معين، يُرسَل النموذج ويُنفَّذ الإجراء المقابل المعرَّف بخصائص ذلك الزر وإجرائه. مثلاً قد يُرسَل المقال للمراجعة افتراضيًا مع زر منفصل و`formAction` لحفظ المسودة.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>

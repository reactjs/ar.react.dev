---
title: useOptimistic
---

<Intro>

`useOptimistic` هو Hook في React يتيح لك تحديث الواجهة تفاؤليًا.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` هو Hook في React يتيح لك عرض حالة مختلفة أثناء تنفيذ إجراء غير متزامن. يقبل حالة كمعامل ويُرجع نسخة من تلك الحالة قد تختلف أثناء عملية غير متزامنة مثل طلب شبكة. تزوّد بدالة تأخذ الحالة الحالية ومدخل الإجراء، وتُرجع الحالة التفاؤلية المستخدمة أثناء انتظار الإجراء.

تُسمى هذه الحالة «تفاؤلية» لأنها تُستخدم عادةً لعرض نتيجة الإجراء للمستخدم فورًا حتى لو استغرق الإجراء وقتًا ليُكمَل.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // دمج وإرجاع حالة جديدة
      // مع القيمة التفاؤلية
    }
  );
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `state`: القيمة المُرجعة في البداية وكلما لم يكن هناك إجراء قيد التنفيذ.
* `updateFn(currentState, optimisticValue)`: دالة تأخذ الحالة الحالية والقيمة التفاؤلية المُمرَّرة إلى `addOptimistic` وتُرجع الحالة التفاؤلية الناتجة. يجب أن تكون دالة نقية. تأخذ `updateFn` معاملين: `currentState` و`optimisticValue`. القيمة المُرجعة ستكون الدمج بين `currentState` و`optimisticValue`.


#### Returns {/*returns*/}

* `optimisticState`: الحالة التفاؤلية الناتجة. تساوي `state` ما لم يكن هناك إجراء قيد التنفيذ، وفي هذه الحالة تساوي القيمة التي تُرجعها `updateFn`.
* `addOptimistic`: دالة الإرسال التي تستدعيها عند وجود تحديث تفاؤلي. تأخذ معاملًا واحدًا `optimisticValue` من أي نوع وتستدعي `updateFn` مع `state` و`optimisticValue`.

---

## Usage {/*usage*/}

### Optimistically updating forms {/*optimistically-updating-with-forms*/}

يوفّر Hook `useOptimistic` طريقة لتحديث واجهة المستخدم تفاؤليًا قبل اكتمال عملية خلفية مثل طلب شبكة. في سياق النماذج، تساعد هذه التقنية على جعل التطبيقات تبدو أكثر استجابة. عند إرسال نموذج، بدل انتظار استجابة الخادم لعرض التغييرات، تُحدَّث الواجهة فورًا بالنتيجة المتوقعة.

على سبيل المثال، عندما يكتب المستخدم رسالة في النموذج ويضغط «إرسال»، يسمح Hook `useOptimistic` بظهور الرسالة فورًا في القائمة مع تسمية «جاري الإرسال...» حتى قبل إرسال الرسالة فعليًا إلى الخادم. هذا النهج «التفاؤلي» يعطي انطباعًا بالسرعة والاستجابة. يحاول النموذج بعدها إرسال الرسالة فعليًا في الخلفية. عند تأكيد الخادم استلام الرسالة، تُزال تسمية «جاري الإرسال...».

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


</Sandpack>

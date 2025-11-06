````markdown
---
title: startTransition
---

<Intro>

تتيح لك `startTransition` تحديث state دون حظر واجهة المستخدم.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

تتيح لك دالة `startTransition` وضع علامة على تحديث state كـ Transition.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### المعاملات {/*parameters*/}

* `scope`: دالة تحدّث بعض state عن طريق استدعاء واحدة أو أكثر من [`دوال set`.](/reference/react/useState#setstate) تستدعي React على الفور `scope` بدون وسائط وتضع علامة على جميع تحديثات state المجدولة بشكل متزامن أثناء استدعاء دالة `scope` كـ Transitions. ستكون [غير محظورة](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) و[لن تعرض مؤشرات تحميل غير مرغوب فيها.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### القيم المرجعة {/*returns*/}

لا تُرجع `startTransition` أي شيء.

#### تنبيهات {/*caveats*/}

* لا توفر `startTransition` طريقة لتتبع ما إذا كان Transition معلقًا. لإظهار مؤشر معلق أثناء استمرار Transition، تحتاج إلى [`useTransition`](/reference/react/useTransition) بدلاً من ذلك.

* يمكنك تغليف تحديث في Transition فقط إذا كان لديك وصول إلى دالة `set` لتلك state. إذا كنت تريد بدء Transition استجابةً لبعض prop أو قيمة إرجاع Hook مخصص، جرب [`useDeferredValue`](/reference/react/useDeferredValue) بدلاً من ذلك.

* يجب أن تكون الدالة التي تمررها إلى `startTransition` متزامنة. تنفذ React هذه الدالة على الفور، وتضع علامة على جميع تحديثات state التي تحدث أثناء تنفيذها كـ Transitions. إذا حاولت إجراء المزيد من تحديثات state لاحقًا (على سبيل المثال، في timeout)، فلن يتم وضع علامة عليها كـ Transitions.

* سيتم مقاطعة تحديث state الموسوم كـ Transition بواسطة تحديثات state الأخرى. على سبيل المثال، إذا قمت بتحديث مكون مخطط داخل Transition، ولكن بعد ذلك بدأت الكتابة في input أثناء إعادة تصيير المخطط، فسيعيد React تشغيل عمل التصيير على مكون المخطط بعد معالجة تحديث state الخاص بـ input.

* لا يمكن استخدام تحديثات Transition للتحكم في مدخلات النص.

* إذا كان هناك عدة Transitions جارية، فإن React حاليًا تجمعها معًا. هذا قيد من المحتمل أن يتم إزالته في إصدار مستقبلي.

---

## الاستخدام {/*usage*/}

### وضع علامة على تحديث state كـ Transition غير محظور {/*marking-a-state-update-as-a-non-blocking-transition*/}

يمكنك وضع علامة على تحديث state كـ *Transition* عن طريق تغليفه في استدعاء `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

تتيح لك Transitions الحفاظ على استجابة تحديثات واجهة المستخدم حتى على الأجهزة البطيئة.

مع Transition، تظل واجهة المستخدم الخاصة بك مستجيبة في منتصف إعادة التصيير. على سبيل المثال، إذا نقر المستخدم على تبويب ثم غير رأيه ونقر على تبويب آخر، فيمكنه القيام بذلك دون انتظار انتهاء إعادة التصيير الأولى.

<Note>

`startTransition` مشابهة جدًا لـ [`useTransition`](/reference/react/useTransition)، باستثناء أنها لا توفر علامة `isPending` لتتبع ما إذا كان Transition جاريًا. يمكنك استدعاء `startTransition` عندما لا يكون `useTransition` متاحًا. على سبيل المثال، تعمل `startTransition` خارج المكونات، مثل من مكتبة بيانات.

[تعرف على Transitions وشاهد الأمثلة في صفحة `useTransition`.](/reference/react/useTransition)

</Note>

````
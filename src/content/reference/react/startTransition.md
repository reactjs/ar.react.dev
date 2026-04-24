---
title: startTransition
---

<Intro>

`startTransition` تتيح لك عرض جزء من الواجهة في الخلفية.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

دالة `startTransition` تتيح لك وضع علامة على تحديث الحالة بأنه انتقال (Transition).

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

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `action`: دالة تحدّث بعض الحالة باستدعاء دالة [`set` واحدة أو أكثر](/reference/react/useState#setstate). يستدعي React الدالة `action` فورًا دون معاملات ويضع علامة على جميع تحديثات الحالة المجدولة بشكل متزامن أثناء استدعاء دالة `action` كانتقالات. تُدرج أي استدعاءات غير متزامنة تُنتظر داخل `action` في الانتقال، لكنها حاليًا تتطلب لفّ أي دوال `set` بعد `await` داخل `startTransition` إضافي (انظر [استكشاف الأخطاء](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). تحديثات الحالة المعلَّمة كانتقالات ستكون [غير حاجزة](#marking-a-state-update-as-a-non-blocking-transition) و[لن تعرض مؤشرات تحميل غير مرغوبة.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Returns {/*returns*/}

`startTransition` لا تُرجع أي قيمة.

#### Caveats {/*caveats*/}

* `startTransition` لا توفر وسيلة لتتبع ما إذا كان الانتقال قيد التنفيذ. لعرض مؤشر انتظار أثناء الانتقال، تحتاج إلى [`useTransition`](/reference/react/useTransition) بدلًا من ذلك.

* يمكنك لفّ تحديث داخل انتقال فقط إذا كان بإمكانك الوصول إلى دالة `set` لتلك الحالة. إذا أردت بدء انتقال استجابةً لبعض الـ props أو قيمة مُرجعة من Hook مخصص، جرّب [`useDeferredValue`](/reference/react/useDeferredValue) بدلًا من ذلك.

* الدالة التي تمرّرها إلى `startTransition` تُستدعى فورًا، ويُعلَم على جميع تحديثات الحالة التي تحدث أثناء تنفيذها كانتقالات. إذا حاولت تنفيذ تحديثات الحالة داخل `setTimeout` مثلًا، فلن تُعلَّم كانتقالات.

* يجب لفّ أي تحديثات حالة بعد أي طلبات غير متزامنة داخل `startTransition` آخر لتعليمها كانتقالات. هذا قيد معروف وسيُعالج مستقبلًا (انظر [استكشاف الأخطاء](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* تحديث الحالة المعلَّم كانتقال سيُقاطع بتحديثات حالة أخرى. على سبيل المثال، إذا حدّثت مكوّن مخططًا داخل انتقال ثم بدأت الكتابة في حقل إدخال بينما المخطط في منتصف إعادة الرسم، سيعيد React بدء عملية الرسم على المخطط بعد معالجة تحديث حالة الإدخال.

* لا يمكن استخدام تحديثات الانتقال للتحكم في حقول إدخال النص.

* إذا كان هناك عدة انتقالات جارية، يجمع React حاليًا بينها. هذا قيد قد يُزال في إصدار لاحق.

---

## Usage {/*usage*/}

### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

يمكنك وضع علامة على تحديث الحالة كـ *انتقال* بلفّه داخل استدعاء `startTransition`:

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

الانتقالات تتيح لك إبقاء تحديثات الواجهة سريعة الاستجابة حتى على الأجهزة البطيئة.

مع الانتقال، تبقى واجهتك سريعة الاستجابة أثناء إعادة الرسم. على سبيل المثال، إذا نقر المستخدم تبويبًا ثم غيّر رأيه ونقر تبويبًا آخر، يمكنه ذلك دون انتظار انتهاء إعادة الرسم الأولى.

<Note>

`startTransition` مشابه جدًا لـ [`useTransition`](/reference/react/useTransition)، باستثناء أنه لا يوفّر العلم `isPending` لتتبع ما إذا كان الانتقال جاريًا. يمكنك استدعاء `startTransition` عندما لا يكون `useTransition` متاحًا. على سبيل المثال، `startTransition` يعمل خارج المكوّنات، مثلًا من مكتبة بيانات.

[تعرّف على الانتقالات واطلع على أمثلة في صفحة `useTransition`.](/reference/react/useTransition)

</Note>

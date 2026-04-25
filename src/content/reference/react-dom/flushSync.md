---
title: "التنفيذ المتزامن (flushSync)"
---

<Pitfall>

استخدام `flushSync` نادر وقد يضر بأداء تطبيقك.

</Pitfall>

<Intro>

تمكنك `flushSync` من إجبار React على دفع أي تحديثات داخل الدالة الممرَّرة بشكل متزامن. يضمن ذلك تحديث DOM فورًا.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

استدعِ `flushSync` لإجبار React على دفع أي عمل معلّق وتحديث DOM بشكل متزامن.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

في أغلب الأحيان يمكن تجنّب `flushSync`. استخدمه كملاذ أخير.

[المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}


* `callback`: دالة. يستدعيها React فورًا ويدفع أي تحديثات بداخلها بشكل متزامن. قد يدفع أيضًا تحديثات معلّقة أو Effects أو تحديثات داخل Effects. إن علّق تحديث نتيجة استدعاء `flushSync` هذا، قد تُعاد إظهار حالات الـ fallback.

#### القيمة المُرجَعة {/*returns*/}

تُرجِع `flushSync` القيمة `undefined`.

#### ملاحظات {/*caveats*/}

* قد يضر `flushSync` بالأداء بشكل كبير. استخدمه باعتدال.
* قد يجبر `flushSync` حدود Suspense المعلّقة على إظهار حالة `fallback`.
* قد يشغّل `flushSync` Effects معلّقة ويطبّق أي تحديثات فيها متزامنًا قبل العودة.
* قد يدفع `flushSync` تحديثات خارج الدالة عند الحاجة لدفع ما بداخلها. مثلاً، إن وُجدت تحديثات معلّقة من نقرة، قد يدفع React تلك قبل تحديثات داخل الدالة.

---

## الاستخدام {/*usage*/}

### دفع التحديثات لتكاملات الطرف الثالث {/*flushing-updates-for-third-party-integrations*/}

عند التكامل مع شيفرة خارجية مثل واجهات المتصفح أو مكتبات واجهة، قد تحتاج لإجبار React على دفع التحديثات. استخدم `flushSync` لدفع أي <CodeStep step={1}>تحديثات حالة</CodeStep> داخل الدالة بشكل متزامن:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// عند هذا السطر، DOM محدّث.
```

يضمن ذلك أن React حدّث DOM قبل تنفيذ السطر التالي.

**استخدام `flushSync` نادر، وكثرته تضر بالأداء بشكل كبير.** إن كان تطبيقك يعتمد فقط على واجهات React ولا يتكامل مع مكتبات خارجية، فغالبًا لا حاجة لـ `flushSync`.

ومع ذلك قد يفيد في التكامل مع شيفرة مثل واجهات المتصفح.

تتوقع بعض واجهات المتصفح أن تُكتب نتائج داخل دوال الاستدعاء إلى DOM متزامنًا بحلول نهاية الدالة ليتمكن المتصفح من استخدام DOM المُصَيَّر. في أغلب الحالات يتولى React ذلك تلقائيًا. لكن أحيانًا يلزم إجبار تحديث متزامن.

مثلاً، واجهة `onbeforeprint` تسمح بتغيير الصفحة مباشرة قبل فتح حوار الطباعة، مفيدة لتطبيق أنماط طباعة مخصّصة. في المثال أدناه، تستخدم `flushSync` داخل `onbeforeprint` لـ«دفع» حالة React إلى DOM فورًا. بحلول فتح حوار الطباعة، يعرض `isPrinting` «نعم»:

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'نعم' : 'لا'}</h1>
      <button onClick={() => window.print()}>
        طباعة
      </button>
    </>
  );
}
```

</Sandpack>

بدون `flushSync`، يعرض حوار الطباعة `isPrinting` كـ«لا» لأن React يجمع التحديثات بشكل غير متزامن ويُفتح الحوار قبل تحديث الحالة.

<Pitfall>

قد يضر `flushSync` بالأداء بشكل كبير، وقد يجبر حدود Suspense المعلّقة غير متوقعًا على إظهار حالة fallback.

في أغلب الأحيان يمكن تجنّب `flushSync`، فاستخدمه كملاذ أخير.

</Pitfall>

---

## حل المشكلات {/*troubleshooting*/}

### أتلقى خطأ: "flushSync was called from inside a lifecycle method" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}


لا يستطيع React تنفيذ `flushSync` وسط التصيير. إن فعلت، يتجاهل التنفيذ ويُحذّر:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

يشمل ذلك استدعاء `flushSync` داخل:

- تصيير مكوّن.
- خطافي `useLayoutEffect` أو `useEffect`.
- دوال دورة حياة مكوّنات الصنف.

مثلاً، استدعاء `flushSync` داخل Effect يتجاهل ويُحذّر:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 خطأ: استدعاء flushSync داخل effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

للإصلاح، غالبًا تنقل استدعاء `flushSync` إلى حدث:

```js
function handleClick() {
  // ✅ صحيح: flushSync في معالجات الأحداث آمن
  flushSync(() => {
    setSomething(newValue);
  });
}
```


إن كان نقله إلى حدث صعبًا، يمكنك تأجيل `flushSync` في microtask:

```js {3,7}
useEffect(() => {
  // ✅ صحيح: تأجيل flushSync إلى microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

يسمح ذلك بإنهاء التصيير الحالي وجدولة تصيير متزامن آخر لدفع التحديثات.

<Pitfall>

قد يضر `flushSync` بالأداء، وهذا النمط أسوأ للأداء. استنفد كل الخيارات قبل استدعاء `flushSync` في microtask كمخرج طوارئ.

</Pitfall>

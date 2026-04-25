---
title: "دالة addTransitionType"
version: canary
---

<Canary>

**واجهة `addTransitionType` متاحة حاليًا فقط في قناتي React Canary و Experimental.**

[تعرّف على قنوات إصدارات React هنا.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

`addTransitionType` تسمح لك بتحديد سبب الانتقال (transition).


```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### المعاملات {/*parameters*/}

- `type`: نوع الانتقال المراد إضافته. يمكن أن يكون أي سلسلة.

#### القيمة المُرجَعة {/*returns*/}

`startTransition` لا تُرجع أي قيمة.

#### ملاحظات {/*caveats*/}

- إذا دُمجت عدة انتقالات، تُجمع كل أنواع الانتقال. يمكنك أيضًا إضافة أكثر من نوع لانتقال واحد.
- تُعاد تهيئة أنواع الانتقال بعد كل commit. يعني ذلك أن `<Suspense>` fallback سيربط الأنواع بعد `startTransition`، لكن كشف المحتوى لا يربطها.

---

## الاستخدام {/*usage*/}

### إضافة سبب الانتقال {/*adding-the-cause-of-a-transition*/}

استدعِ `addTransitionType` داخل `startTransition` للإشارة إلى سبب الانتقال:

``` [[1, 6, "addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

عند استدعاء <CodeStep step={1}>addTransitionType</CodeStep> ضمن نطاق <CodeStep step={2}>startTransition</CodeStep>، تربط React <CodeStep step={3}>submit-click</CodeStep> كأحد أسباب الانتقال.

حاليًا، يمكن استخدام أنواع الانتقال لتخصيص رسوم مختلفة حسب ما سبب الانتقال. لديك ثلاث طرق:

- [تخصيص الرسوم باستخدام أنواع انتقال العرض في المتصفح](#customize-animations-using-browser-view-transition-types)
- [تخصيص الرسوم باستخدام صنف `View Transition`](#customize-animations-using-view-transition-class)
- [تخصيص الرسوم باستخدام أحداث `ViewTransition`](#customize-animations-using-viewtransition-events)

مستقبلًا، نخطط لدعم حالات استخدام أخرى لسبب الانتقال.

---
### تخصيص الرسوم باستخدام أنواع انتقال العرض في المتصفح {/*customize-animations-using-browser-view-transition-types*/}

عندما يُفعَّل [`ViewTransition`](/reference/react/ViewTransition) من انتقال، تضيف React كل أنواع الانتقال كـ [أنواع انتقال العرض (view transition types)](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) في المتصفح إلى العنصر.

يتيح لك تخصيص رسوم مختلفة حسب نطاقات CSS:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### تخصيص الرسوم باستخدام صنف `View Transition` {/*customize-animations-using-view-transition-class*/}

يمكنك تخصيص الرسوم لـ `ViewTransition` المُفعَّل حسب النوع بتمرير كائن إلى صنف انتقال العرض:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

إذا تطابقت عدة أنواع، تُدمج معًا. إذا لم يطابق أي نوع، يُستخدم الإدخال الخاص «default». إذا كانت قيمة أي نوع «none» فتلك تفوز ويُعطّل ViewTransition (لا يُعيَّن له اسم).

يمكن دمجها مع خصائص enter/exit/update/layout/share لمطابقة نوع المُحفّز ونوع الانتقال.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### تخصيص الرسوم باستخدام أحداث `ViewTransition` {/*customize-animations-using-viewtransition-events*/}

يمكنك تخصيص الرسوم أمرًا لـ `ViewTransition` المُفعَّل حسب النوع باستخدام أحداث انتقال العرض:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

يتيح لك اختيار رسوم أمرية مختلفة حسب السبب.

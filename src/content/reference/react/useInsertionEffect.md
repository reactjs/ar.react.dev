---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` مخصص لمؤلفي مكتبات CSS-in-JS. ما لم تكن تعمل على مكتبة CSS-in-JS وتحتاج نقطة لحقن الأنماط، فغالبًا تريد [`useEffect`](/reference/react/useEffect) أو [`useLayoutEffect`](/reference/react/useLayoutEffect) بدلًا من ذلك.

</Pitfall>

<Intro>

`useInsertionEffect` يسمح بإدراج عناصر في DOM قبل أن تُطلَق أي تأثيرات تخطيط قد تحتاج لقراءة التخطيط.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

استدعِ `useInsertionEffect` لإدراج الأنماط قبل أن تُطلَق أي تأثيرات قد تحتاج لقراءة التخطيط:

```js
import { useInsertionEffect } from 'react';

// داخل مكتبة CSS-in-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... حقن وسوم <style> هنا ...
  });
  return rule;
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `setup`: الدالة التي تحتوي منطق التأثير. قد تُرجع دالة تنظيف اختيارية. عند إضافة المكوّن إلى DOM، لكن قبل إطلاق أي تأثيرات تخطيط، يشغّل React دالة الإعداد. بعد كل إعادة رسم بتغيّر التبعيات، يشغّل React أولًا دالة التنظيف (إن وُجدت) بالقيم القديمة، ثم دالة الإعداد بالقيم الجديدة. عند إزالة المكوّن من DOM، يشغّل React دالة التنظيف.
 
* **اختياري** `dependencies`: قائمة بجميع القيم التفاعلية المُشار إليها داخل كود `setup`. تشمل القيم التفاعلية الـ props والحالة وجميع المتغيرات والدوال المعرّفة مباشرة في جسم المكوّن. إذا كان linter الخاص بك [مهيأ لـ React](/learn/editor-setup#linting)، فسيتحقق من أن كل قيمة تفاعلية مُحدَّدة كتبعية. يجب أن يكون عدد عناصر قائمة التبعيات ثابتًا وتُكتب مضمّنة مثل `[dep1, dep2, dep3]`. يقارن React كل تبعية بقيمتها السابقة باستخدام خوارزمية [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). إذا لم تحدد التبعيات على الإطلاق، يُعاد تشغيل التأثير بعد كل إعادة رسم للمكوّن.

#### Returns {/*returns*/}

`useInsertionEffect` تُرجع `undefined`.

#### Caveats {/*caveats*/}

* التأثيرات تعمل فقط على العميل. لا تعمل أثناء العرض على الخادم.
* لا يمكنك تحديث الحالة من داخل `useInsertionEffect`.
* بحلول وقت تشغيل `useInsertionEffect`، لم تُربَط الـ refs بعد.
* قد يعمل `useInsertionEffect` قبل أو بعد تحديث DOM. لا يجب الاعتماد على تحديث DOM في وقت محدد.
* على عكس أنواع التأثيرات الأخرى التي تُطلَق دالة تنظيف لكل تأثير ثم إعداد لكل تأثير، يُطلَق `useInsertionEffect` تنظيفًا وإعدادًا لمكوّن واحد في كل مرة. هذا يؤدي إلى «تداخل» دوال التنظيف والإعداد.
---

## Usage {/*usage*/}

### Injecting dynamic styles from CSS-in-JS libraries {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

تقليديًا، كنت تُنسّق مكوّنات React باستخدام CSS عادي.

```js
// في ملف JS:
<button className="success" />

// في ملف CSS:
.success { color: green; }
```

يفضّل بعض الفرق كتابة الأنماط مباشرة في JavaScript بدل ملفات CSS. يتطلب ذلك عادةً مكتبة CSS-in-JS أو أداة. هناك ثلاث طرق شائعة لـ CSS-in-JS:

1. استخراج ثابت إلى ملفات CSS بمُجمّع
2. أنماط مضمّنة، مثل `<div style={{ opacity: 1 }}>`
3. حقن وسوم `<style>` في وقت التشغيل

إذا استخدمت CSS-in-JS، نوصي بمزيج من الطريقتين الأولى والثانية (ملفات CSS للأنماط الثابتة، أنماط مضمّنة للأنماط الديناميكية). **لا نوصي بحقن وسوم `<style>` في وقت التشغيل لسببين:**

1. الحقن في وقت التشغيل يجبر المتصفح على إعادة حساب الأنماط أكثر بكثير.
2. قد يكون الحقن في وقت التشغيل بطيئًا جدًا إذا حدث في الوقت الخاطئ من دورة حياة React.

المشكلة الأولى غير قابلة للحل، لكن `useInsertionEffect` يساعدك على حل الثانية.

استدعِ `useInsertionEffect` لإدراج الأنماط قبل إطلاق أي تأثيرات تخطيط:

```js {4-11}
// داخل مكتبة CSS-in-JS
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // كما أوضحنا سابقًا، لا نوصي بحقن وسوم <style> في وقت التشغيل.
    // لكن إذا اضطررت، فمن المهم فعل ذلك في useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

بشكل مشابه لـ `useEffect`، لا يعمل `useInsertionEffect` على الخادم. إذا احتجت لجمع قواعد CSS المستخدمة على الخادم، يمكنك فعل ذلك أثناء الرسم:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[اقرأ المزيد عن ترقية مكتبات CSS-in-JS ذات الحقن في وقت التشغيل إلى `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### How is this better than injecting styles during rendering or useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

إذا أدرجت الأنماط أثناء الرسم وكان React يعالج [تحديثًا غير حاجز،](/reference/react/useTransition#perform-non-blocking-updates-with-actions) فسيعيد المتصفح حساب الأنماط في كل إطار أثناء رسم شجرة المكوّنات، وهذا قد يكون **بطيئًا جدًا.**

`useInsertionEffect` أفضل من الإدراج أثناء [`useLayoutEffect`](/reference/react/useLayoutEffect) أو [`useEffect`](/reference/react/useEffect) لأنه يضمن أنه بحلول وقت تشغيل التأثيرات الأخرى في مكوّناتك، تكون وسوم `<style>` قد أُدرجت بالفعل. وإلا فقد تكون حسابات التخطيط في التأثيرات العادية خاطئة بسبب أنماط قديمة.

</DeepDive>

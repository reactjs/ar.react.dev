---
title: "use no memo"
titleForTitleTag: "توجيه 'use no memo'"
---

<Intro>

`"use no memo"` يمنع React Compiler من تحسين دالة معيّنة.

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

أضف `"use no memo"` في بداية الدالة لمنع تحسين React Compiler.

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

عندما تحتوي الدالة على `"use no memo"`، يتخطّاها المُصرّف بالكامل أثناء التحسين. مفيد كمخرج طارئ مؤقت أثناء التصحيح أو مع شيفرة لا تعمل جيداً مع المُصرّف.

#### ملاحظات {/*caveats*/}

* يجب أن يكون `"use no memo"` في بداية جسم الدالة قبل أي شيفرة أخرى (التعليقات مسموحة).
* يُكتب بعلامتي اقتباس مزدوجتين أو مفردتين، لا بفواصل خلفية.
* يجب أن يطابق حرفياً `"use no memo"` أو الاسم المستعار `"use no forget"`.
* لهذا التوجيه أسبقية على كل أوضاع التجميع والتوجيهات الأخرى.
* مخصّص كأداة تصحيح مؤقتة، وليس حلاً دائماً.

### كيف يستبعد `"use no memo"` التحسين {/*how-use-no-memo-opts-out*/}

يحلّل React Compiler شيفرتك وقت البناء لتطبيق التحسينات. `"use no memo"` يضع حداً صريحاً يطلب تخطّي الدالة بالكامل.

لهذا التوجيه أسبقية على الإعدادات الأخرى:
* في وضع `all`: تُستبعد الدالة رغم الإعداد العام
* في وضع `infer`: تُستبعد حتى لو اقترح الاستدلال تحسينها

تُعامَل هذه الدوال كما لو أن المُصرّف غير مفعّل، وتبقى كما كتبت.

### متى تستخدم `"use no memo"` {/*when-to-use*/}

استخدم `"use no memo"` باعتدال وبشكل مؤقت. سيناريوهات شائعة:

#### تصحيح مشاكل المُصرّف {/*debugging-compiler*/}
عند الاشتباه أن المُصرّف يسبب المشكلة، عطّل التحسين مؤقتاً لعزل السبب:

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: إزالة بعد إصلاح المشكلة #123

  // مخالفات لقواعد React لم تُكتشف ساكنياً
  // ...
}
```

#### تكامل مكتبة طرف ثالث {/*third-party*/}
مع مكتبات قد لا تكون متوافقة مع المُصرّف:

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // له تأثيرات جانبية قد يُحسّنها المُصرّف بشكل خاطئ
  // ...
}
```

---

## الاستخدام {/*usage*/}

يُوضَع `"use no memo"` في بداية جسم الدالة ليمنع تحسين تلك الدالة:

```js
function MyComponent() {
  "use no memo";
  // جسم الدالة
}
```

يمكن وضعه في أعلى الملف لتأثيره على كل الدوال في الوحدة:

```js
"use no memo";

// كل الدوال في هذا الملف يتخطّاها المُصرّف
```

`"use no memo"` على مستوى الدالة يتجاوز توجيه الوحدة.

---

## استكشاف الأعطال {/*troubleshooting*/}

### التوجيه لا يمنع التجميع {/*not-preventing*/}

إذا لم يعمل `"use no memo"`:

```js
// ❌ خطأ — التوجيه بعد شيفرة
function Component() {
  const data = getData();
  "use no memo"; // متأخر جداً!
}

// ✅ صحيح — التوجيه أولاً
function Component() {
  "use no memo";
  const data = getData();
}
```

تحقق أيضاً من:
* الإملاء — يجب أن يكون بالضبط `"use no memo"`
* علامات الاقتباس — مفردة أو مزدوجة، لا backticks

### أفضل الممارسات {/*best-practices*/}

**وثّق السبب** دائماً عند تعطيل التحسين:

```js
// ✅ جيد — شرح وتتبّع
function DataProcessor() {
  "use no memo"; // TODO: إزالة بعد إصلاح مخالفة قواعد React
  // ...
}

// ❌ سيء — بلا تفسير
function Mystery() {
  "use no memo";
  // ...
}
```

### انظر أيضاً {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) — الإدخال في التجميع
* [React Compiler](/learn/react-compiler) — دليل البدء

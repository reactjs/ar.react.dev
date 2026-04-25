---
title: التوجيهات
---

<Intro>
توجيهات React Compiler هي حرفيات نصية خاصة تتحكم فيما إذا كانت دوال معيّنة تُجمَّع أم لا.
</Intro>

```js
function MyComponent() {
  "use memo"; // إدخال هذا المكوّن في التجميع
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## نظرة عامة {/*overview*/}

توفّر توجيهات React Compiler تحكّماً دقيقاً في أي الدوال يُحسِّنها المُصرّف. هي حرفيات نصية تُوضَع في بداية جسم الدالة أو في أعلى الوحدة.

### التوجيهات المتاحة {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** — إدخال دالة في التجميع
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** — استبعاد دالة من التجميع

### مقارنة سريعة {/*quick-comparison*/}

| التوجيه | الغرض | متى تستخدمه |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | فرض التجميع | في وضع `annotation` أو لتجاوز استدلال وضع `infer` |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | منع التجميع | أثناء التصحيح أو مع شيفرة غير متوافقة |

---

## الاستخدام {/*usage*/}

### توجيهات على مستوى الدالة {/*function-level*/}

ضع التوجيهات في بداية الدالة للتحكم في تجميعها:

```js
// الإدخال في التجميع
function OptimizedComponent() {
  "use memo";
  return <div>This will be optimized</div>;
}

// الاستبعاد من التجميع
function UnoptimizedComponent() {
  "use no memo";
  return <div>This won't be optimized</div>;
}
```

### توجيهات على مستوى الوحدة {/*module-level*/}

ضع التوجيه في أعلى الملف لتأثيره على كل الدوال في تلك الوحدة:

```js
// في أعلى الملف تماماً
"use memo";

// كل الدوال في هذا الملف ستُجمَّع
function Component1() {
  return <div>Compiled</div>;
}

function Component2() {
  return <div>Also compiled</div>;
}

// يمكن تجاوزه على مستوى الدالة
function Component3() {
  "use no memo"; // يتجاوز توجيه الوحدة
  return <div>Not compiled</div>;
}
```

### التفاعل مع أوضاع التجميع {/*compilation-modes*/}

تختلف سلوكيات التوجيهات حسب [`compilationMode`](/reference/react-compiler/compilationMode):

* **وضع `annotation`**: تُجمَّع فقط الدوال التي تحتوي `"use memo"`
* **وضع `infer`**: المُصرّف يقرر ما يُجمَّع، والتوجيهات تتجاوز القرار
* **وضع `all`**: يُجمَّع كل شيء، و`"use no memo"` يمكنه استبعاد دوال محدّدة

---

## أفضل الممارسات {/*best-practices*/}

### استخدم التوجيهات باعتدال {/*use-sparingly*/}

التوجيهات مخارج طارئة. فضّل إعداد المُصرّف على مستوى المشروع:

```js
// ✅ جيد — إعداد للمشروع كله
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ استخدم التوجيهات عند الحاجة فقط
function SpecialCase() {
  "use no memo"; // وثّق سبب الحاجة
  // ...
}
```

### وثّق استخدام التوجيه {/*document-usage*/}

اشرح دائماً لماذا يُستخدم التوجيه:

```js
// ✅ جيد — شرح واضح
function DataGrid() {
  "use no memo"; // TODO: إزالة بعد إصلاح مشكلة ارتفاع الصفوف الديناميكي (JIRA-123)
  // تنفيذ شبكة معقّدة
}

// ❌ سيء — بلا تفسير
function Mystery() {
  "use no memo";
  // ...
}
```

### خطّ للإزالة {/*plan-removal*/}

توجيهات الاستبعاد يفترض أن تكون مؤقتة:

1. أضف التوجيه مع تعليق TODO
2. أنشئ مهمة تتبّع
3. أصلح السبب الجذري
4. أزل التوجيه

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: إزالة بعد ترقية ThirdPartyLib إلى v2.0
  return <ThirdPartyComponent />;
}
```

---

## أنماط شائعة {/*common-patterns*/}

### تبنّي تدريجي {/*gradual-adoption*/}

عند تبنّي React Compiler في قاعدة شيفرة كبيرة:

```js
// ابدأ بوضع annotation
{
  compilationMode: 'annotation'
}

// أدخل المكوّنات المستقرة
function StableComponent() {
  "use memo";
  // مكوّن مختبر جيداً
}

// لاحقاً انتقل إلى infer واستبعد المشكلات
function ProblematicComponent() {
  "use no memo"; // أصلح المشاكل قبل الإزالة
  // ...
}
```


---

## استكشاف الأعطال {/*troubleshooting*/}

لمشكلات محدّدة مع التوجيهات، راجع أقسام استكشاف الأعطال في:

* [استكشاف أعطال `"use memo"`](/reference/react-compiler/directives/use-memo#troubleshooting)
* [استكشاف أعطال `"use no memo"`](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### مشاكل شائعة {/*common-issues*/}

1. **التوجيه مُتجاهَل**: تحقق من الموضع (يجب أن يكون أولاً) والإملاء
2. **التجميع ما زال يحدث**: راجع إعداد `ignoreUseNoForget`
3. **توجيه الوحدة لا يعمل**: تأكد أنه قبل كل الـ imports

---

## انظر أيضاً {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) — ضبط كيفية اختيار المُصرّف لما يُحسَّن
* [`Configuration`](/reference/react-compiler/configuration) — كل خيارات إعداد المُصرّف
* [توثيق React Compiler](https://react.dev/learn/react-compiler) — دليل البدء

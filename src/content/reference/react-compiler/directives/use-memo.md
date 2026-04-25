---
title: "use memo"
titleForTitleTag: "توجيه 'use memo'"
---

<Intro>

`"use memo"` يوسم دالة لتحسينها بواسطة React Compiler.

</Intro>

<Note>

في أغلب الحالات لا تحتاج `"use memo"`. يُستخدم أساساً في وضع `annotation` حيث يجب تمييز الدوال صراحة للتحسين. في وضع `infer` يكتشف المُصرّف المكوّنات والـ hooks تلقائياً من الأنماط (PascalCase للمكوّنات، بادئة `use` للـ hooks). إذا لم يُجمَّع مكوّن أو hook في `infer`، صحّح التسمية بدل فرض التجميع بـ `"use memo"`.

</Note>

<InlineToc />

---

## المرجع {/*reference*/}

### `"use memo"` {/*use-memo*/}

أضف `"use memo"` في بداية الدالة لتمييزها لتحسين React Compiler.

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

عندما تحتوي الدالة على `"use memo"`، يحلّلها React Compiler ويُحسّنها وقت البناء. يذكّر المُصرّف القيم والمكوّنات تلقائياً لتجنّب إعادة حساب أو تصيير غير لازمة.

#### ملاحظات {/*caveats*/}

* يجب أن يكون `"use memo"` في بداية جسم الدالة، قبل أي شيفرة أخرى (التعليقات مسموحة).
* يُكتب التوجيه بعلامتي اقتباس مزدوجتين أو مفردتين، لا بفواصل خلفية (backticks).
* يجب أن يطابق التوجيه حرفياً `"use memo"`.
* يُعالَج أول توجيه في الدالة فقط؛ التوجيهات الإضافية تُتجاهَل.
* أثر التوجيه يعتمد على إعداد [`compilationMode`](/reference/react-compiler/compilationMode).

### كيف يوسم `"use memo"` الدوال {/*how-use-memo-marks*/}

في تطبيق يستخدم React Compiler، تُحلَّل الدوال وقت البناء لمعرفة إن كانت قابلة للتحسين. افتراضياً يستنتج المُصرّف المكوّنات، وقد يعتمد ذلك على [`compilationMode`](/reference/react-compiler/compilationMode).

`"use memo"` يوسم الدالة صراحة للتحسين، متجاوزاً السلوك الافتراضي:

* في وضع `annotation`: تُحسَّن فقط الدوال التي تحتوي `"use memo"`
* في وضع `infer`: يستخدم المُصرّف استدلالاً، لكن `"use memo"` يفرض التحسين
* في وضع `all`: يُحسَّن كل شيء افتراضياً، فيصبح `"use memo"` غالباً زائداً

يخلق التوجيه حداً واضحاً بين الشيفرة المُحسَّنة وغير المُحسَّنة.

### متى تستخدم `"use memo"` {/*when-to-use*/}

فكّر في `"use memo"` عندما:

#### تستخدم وضع annotation {/*annotation-mode-use*/}
في `compilationMode: 'annotation'`، التوجيه مطلوب لأي دالة تريد تحسينها:

```js
// ✅ سيُحسَّن هذا المكوّن
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ لن يُحسَّن هذا المكوّن
function SimpleWrapper() {
  // ...
}
```

#### تتبنّى React Compiler تدريجياً {/*gradual-adoption*/}
ابدأ بـ `annotation` وحسّن المكوّنات الورقية المستقرة:

```js
// ابدأ بتحسين المكوّنات الورقية
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// ثم اصعد في الشجرة بعد التحقق من السلوك
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## الاستخدام {/*usage*/}

### العمل مع أوضاع تجميع مختلفة {/*compilation-modes*/}

يختلف سلوك `"use memo"` حسب إعداد المُصرّف:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // أو 'infer' أو 'all'
    }]
  ]
};
```

#### وضع annotation {/*annotation-mode-example*/}
```js
// ✅ يُحسَّن مع "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ لا يُحسَّن (لا يوجد توجيه)
function ProductList({ products }) {
  // ...
}
```

#### وضع infer (الافتراضي) {/*infer-mode-example*/}
```js
// يُذكَّر تلقائياً لأن الاسم كمكوّن
function ComplexDashboard({ data }) {
  // ...
}

// يُتخطّى: الاسم ليس كمكوّن
function simpleDisplay({ text }) {
  // ...
}
```

في `infer` يكتشف المُصرّف المكوّنات والـ hooks من التسمية. إذا لم يُجمَّع مكوّن، صحّح التسمية بدل `"use memo"`.

---

## استكشاف الأعطال {/*troubleshooting*/}

### التحقق من التحسين {/*verifying-optimization*/}

للتأكد أن المكوّن يُحسَّن:

1. راجع المخرجات المُجمَّعة في البناء
2. استخدم React DevTools للبحث عن شارة Memo ✨

### انظر أيضاً {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) — الاستبعاد من التجميع
* [`compilationMode`](/reference/react-compiler/compilationMode) — ضبط سلوك التجميع
* [React Compiler](/learn/react-compiler) — دليل البدء

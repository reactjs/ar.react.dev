---
title: الإعداد
---

<Intro>

تسرد هذه الصفحة كل خيارات إعداد React Compiler المتاحة.

</Intro>

<Note>

في أغلب التطبيقات، الخيارات الافتراضية كافية دون تعديل. إن كان لديك حاجة خاصة، استخدم هذه الخيارات المتقدمة.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // خيارات المُصرّف
      }
    ]
  ]
};
```

---

## التحكّم في التجميع {/*compilation-control*/}

تتحكم هذه الخيارات في *ما* يُحسّنه المُصرّف و*كيف* يختار المكوّنات والـ hooks المراد تجميعها.

* [`compilationMode`](/reference/react-compiler/compilationMode) يحدد استراتيجية اختيار الدوال للتجميع (مثلاً: كل الدوال، أو الموسومة فقط، أو الاستنتاج الذكي).

```js
{
  compilationMode: 'annotation' // تجميع دوال «use memo» فقط
}
```

---

## توافق الإصدارات {/*version-compatibility*/}

يضمن إعداد إصدار React أن يُولّد المُصرّف شيفرة متوافقة مع إصدار React لديك.

[`target`](/reference/react-compiler/target) يحدد إصدار React الذي تستخدمه (17 أو 18 أو 19).

```js
// لمشاريع React 18
{
  target: '18' // يتطلب أيضاً حزمة react-compiler-runtime
}
```

---

## التعامل مع الأخطاء {/*error-handling*/}

تتحكم هذه الخيارات في ردّ المُصرّف على شيفرة لا تتبع [قواعد React](/reference/rules).

[`panicThreshold`](/reference/react-compiler/panicThreshold) يحدد ما إذا كان يجب إفشال البناء أو تخطّي المكوّنات المشكِلة.

```js
// موصى به للإنتاج
{
  panicThreshold: 'none' // تخطّي المكوّنات ذات الأخطاء بدل إيقاف البناء
}
```

---

## التصحيح {/*debugging*/}

خيارات التسجيل والتحليل تساعدك على فهم ما يفعله المُصرّف.

[`logger`](/reference/react-compiler/logger) يوفّر تسجيلاً مخصّصاً لأحداث التجميع.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## ميزات التفعيل (Feature flags) {/*feature-flags*/}

التجميع الشرطي يتيح لك التحكّم في وقت استخدام الشيفرة المُحسَّنة.

[`gating`](/reference/react-compiler/gating) يفعّل ميزات وقت التشغيل لاختبار A/B أو الطرح التدريجي.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## أنماط إعداد شائعة {/*common-patterns*/}

### الإعداد الافتراضي {/*default-configuration*/}

في أغلب تطبيقات React 19 يعمل المُصرّف دون إعداد:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### مشاريع React 17/18 {/*react-17-18*/}

إصدارات React الأقدم تحتاج حزمة التشغيل وإعداد `target`:

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // أو '17'
}
```

### التبنّي التدريجي {/*incremental-adoption*/}

ابدأ بمجلدات محدّدة وتوسّع تدريجياً:

```js
{
  compilationMode: 'annotation' // تجميع دوال «use memo» فقط
}
```

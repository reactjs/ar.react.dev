---
title: panicThreshold
---

<Intro>

يتحكم خيار `panicThreshold` في كيفية تعامل React Compiler مع الأخطاء أثناء التجميع.

</Intro>

```js
{
  panicThreshold: 'none' // موصى به
}
```

<InlineToc />

---

## المرجع {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

يحدد ما إذا كانت أخطاء التجميع تُفشِل البناء أم تُتخطّى التحسينات.

#### النوع {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### القيمة الافتراضية {/*default-value*/}

`'none'`

#### الخيارات {/*options*/}

- **`'none'`** (الافتراضي، موصى به): تخطّي المكوّنات التي لا يمكن تجميعها ومتابعة البناء
- **`'critical_errors'`**: إفشال البناء فقط عند أخطاء مُصرّف حرجة
- **`'all_errors'`**: إفشال البناء عند أي تشخيص من المُصرّف

#### ملاحظات {/*caveats*/}

- يفترض أن تستخدم إصدارات الإنتاج دائماً `'none'`
- إفشال البناء يمنع بناء التطبيق
- مع `'none'` يكتشف المُصرّف ويتخطّى الشيفرة المشكِلة تلقائياً
- العتبات الأشدّ مفيدة أثناء التطوير للتصحيح فقط

---

## الاستخدام {/*usage*/}

### إعداد الإنتاج (موصى به) {/*production-configuration*/}

في بناء الإنتاج استخدم دائماً `'none'` — وهي القيمة الافتراضية:

```js
{
  panicThreshold: 'none'
}
```

هذا يضمن:
- ألا يفشل البناء بسبب المُصرّف
- أن المكوّنات غير القابلة للتحسين تعمل بشكل عادي
- أقصى عدد من المكوّنات يُحسَّن
- نشر إنتاج مستقر

### تصحيح أثناء التطوير {/*development-debugging*/}

استخدم عتبات أشدّ مؤقتاً لاكتشاف المشاكل:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```

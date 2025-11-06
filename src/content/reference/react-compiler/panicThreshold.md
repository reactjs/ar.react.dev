````markdown
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

يحدد ما إذا كان يجب أن تفشل أخطاء التجميع في البناء أو تخطي التحسين.

#### النوع {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### القيمة الافتراضية {/*default-value*/}

`'none'`

#### الخيارات {/*options*/}

- **`'none'`** (افتراضي، موصى به): تخطي المكونات التي لا يمكن تجميعها ومتابعة البناء
- **`'critical_errors'`**: فشل البناء فقط عند أخطاء المُجمّع الحرجة
- **`'all_errors'`**: فشل البناء عند أي تشخيص للمُجمّع

#### تنبيهات {/*caveats*/}

- يجب أن تستخدم بيئات الإنتاج دائمًا `'none'`
- فشل البناء يمنع تطبيقك من البناء
- يكتشف المُجمّع تلقائيًا ويتخطى الكود الإشكالي مع `'none'`
- العتبات الأعلى مفيدة فقط أثناء التطوير لتصحيح الأخطاء

---

## الاستخدام {/*usage*/}

### إعداد الإنتاج (موصى به) {/*production-configuration*/}

لبيئات الإنتاج، استخدم دائمًا `'none'`. هذه هي القيمة الافتراضية:

```js
{
  panicThreshold: 'none'
}
```

يضمن هذا:
- لن يفشل بناؤك أبدًا بسبب مشاكل المُجمّع
- المكونات التي لا يمكن تحسينها تعمل بشكل طبيعي
- الحد الأقصى من المكونات يتم تحسينها
- نشر إنتاج مستقر

### تصحيح أخطاء التطوير {/*development-debugging*/}

استخدم مؤقتًا عتبات أكثر صرامة للعثور على المشاكل:

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
````
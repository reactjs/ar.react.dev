---
title: gating
---

<Intro>

يُمكّن خيار `gating` التجميع الشرطي، فتتحكم في وقت استخدام الشيفرة المُحسَّنة وقت التشغيل.

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## المرجع {/*reference*/}

### `gating` {/*gating*/}

يضبط تفعيل ميزات وقت التشغيل (gating) للدوال المُجمَّعة.

#### النوع {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### القيمة الافتراضية {/*default-value*/}

`null`

#### الخصائص {/*properties*/}

- **`source`**: مسار الوحدة لاستيراد دالة الميزة منها
- **`importSpecifierName`**: اسم الدالة المُصدَرة المطلوب استيرادها

#### ملاحظات {/*caveats*/}

- يجب أن تُرجِع دالة gating قيمة منطقية
- النسختان المُجمَّعة والأصلية تزيدان حجم الحزمة
- يُضاف الاستيراد إلى كل ملف فيه دوال مُجمَّعة

---

## الاستخدام {/*usage*/}

### إعداد أساسي لميزة {/*basic-setup*/}

1. أنشئ وحدة ميزات:

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // منطقك هنا
  return getFeatureFlag('react-compiler-enabled');
}
```

2. اضبط المُصرّف:

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3. يُولّد المُصرّف شيفرة مع gating:

```js
// المدخلات
function Button(props) {
  return <button>{props.label}</button>;
}

// المخرجات (مبسّطة)
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* نسخة مُجمَّعة */ }
  : function Button_original(props) { /* نسخة أصلية */ };
```

تُقيَّم دالة gating مرة عند تحميل الوحدة، لذا بعد تحليل حزمة JS وتقييمها يبقى اختيار المكوّن ثابتاً طوال جلسة المتصفّح.

---

## استكشاف الأعطال {/*troubleshooting*/}

### الميزة لا تعمل {/*flag-not-working*/}

تحقق أن الوحدة تُصدِر الدالة الصحيحة:

```js
// ❌ خطأ: تصدير افتراضي
export default function shouldUseCompiler() {
  return true;
}

// ✅ صحيح: تصدير مُسمّى يطابق importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### أخطاء استيراد {/*import-errors*/}

تأكد من صحة مسار `source`:

```js
// ❌ خطأ: نسبي إلى babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ صحيح: مسار يحلّه المحلّل
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ صحيح أيضاً: مسار مطلق من جذر المشروع
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```

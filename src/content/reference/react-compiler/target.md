---
title: target
---

<Intro>

يحدد خيار `target` إصدار React الذي يجب أن يُولِّد المُصرّف شيفرة متوافقة معه.

</Intro>

```js
{
  target: '19' // أو '18' أو '17'
}
```

<InlineToc />

---

## المرجع {/*reference*/}

### `target` {/*target*/}

يضبط توافق إصدار React مع المخرجات المُجمَّعة.

#### النوع {/*type*/}

```
'17' | '18' | '19'
```

#### القيمة الافتراضية {/*default-value*/}

`'19'`

#### القيم الصالحة {/*valid-values*/}

- **`'19'`**: يستهدف React 19 (الافتراضي). لا حاجة لتشغيل إضافي.
- **`'18'`**: يستهدف React 18. يتطلّب حزمة `react-compiler-runtime`.
- **`'17'`**: يستهدف React 17. يتطلّب حزمة `react-compiler-runtime`.

#### ملاحظات {/*caveats*/}

- استخدم دائماً قيماً نصّياً لا أرقاماً (مثلاً `'17'` وليس `17`)
- لا تضمّن إصدارات التصحيح (استخدم `'18'` وليس `'18.2.0'`)
- React 19 يتضمّن واجهات التشغيل المدمجة للمُصرّف
- React 17 و18 يتطلّبان تثبيت `react-compiler-runtime@latest`

---

## الاستخدام {/*usage*/}

### استهداف React 19 (الافتراضي) {/*targeting-react-19*/}

مع React 19 لا حاجة لإعداد خاص:

```js
{
  // الافتراضي target: '19'
}
```

يستخدم المُصرّف واجهات React 19 الأصلية:

```js
// المخرجات تستخدم واجهات React 19 المدمجة
import { c as _c } from 'react/compiler-runtime';
```

### استهداف React 17 أو 18 {/*targeting-react-17-or-18*/}

لمشروعي React 17 و18 تحتاج خطوتين:

1. ثبّت حزمة التشغيل:

```bash
npm install react-compiler-runtime@latest
```

2. اضبط `target`:

```js
// لـ React 18
{
  target: '18'
}

// لـ React 17
{
  target: '17'
}
```

يستخدم المُصرّف تشغيل polyfill لكلا الإصدارين:

```js
// المخرجات تستخدم polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## استكشاف الأعطال {/*troubleshooting*/}

### أخطاء تشغيل عن نقص compiler runtime {/*missing-runtime*/}

إذا ظهرت أخطاء مثل «Cannot find module 'react/compiler-runtime'»:

1. تحقق من إصدار React:
   ```bash
   npm why react
   ```

2. إن كنت على React 17 أو 18، ثبّت التشغيل:
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. تأكد أن `target` يطابق إصدار React الرئيسي:
   ```js
   {
     target: '18' // يجب أن يطابق الإصدار الرئيسي لـ React
   }
   ```

### حزمة التشغيل لا تعمل {/*runtime-not-working*/}

تأكد أن:

1. الحزمة مثبّتة في المشروع (ليس عمومياً)
2. مدرجة في `dependencies` في `package.json`
3. الإصدار صحيح (وسم `@latest`)
4. ليست في `devDependencies` (مطلوبة وقت التشغيل)

### التحقق من المخرجات {/*checking-output*/}

للتأكد من التشغيل الصحيح، لاحظ اختلاف الاستيراد (`react/compiler-runtime` مدمج، `react-compiler-runtime` لـ 17/18):

```js
// لـ React 19 (تشغيل مدمج)
import { c } from 'react/compiler-runtime'
//                      ^

// لـ React 17/18 (polyfill)
import { c } from 'react-compiler-runtime'
//                      ^
```

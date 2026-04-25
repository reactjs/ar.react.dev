---
title: config
---

<Intro>

يتحقق من [خيارات إعداد](/reference/react-compiler/configuration) المُصرّف.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يقبل React Compiler عدة [خيارات إعداد](/reference/react-compiler/configuration) للتحكّم في سلوكه. تتحقق هذه القاعدة من أن إعدادك يستخدم أسماء خيارات صحيحة وأنواع قيم صحيحة، لتجنّب فشل صامت بسبب أخطاء مطبعية أو إعدادات خاطئة.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ اسم خيار غير معروف
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // خطأ مطبعي: يجب أن يكون compilationMode
    }]
  ]
};

// ❌ قيمة خيار غير صالحة
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // غير صالح: استخدم 'all' أو 'infer'
    }]
  ]
};
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ إعداد مُصرّف صالح
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## استكشاف الأعطال {/*troubleshooting*/}

### الإعداد لا يعمل كما تتوقع {/*config-not-working*/}

قد يحتوي إعداد المُصرّف على أخطاء مطبعية أو قيم خاطئة:

```js
// ❌ خطأ: أخطاء إعداد شائعة
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // خطأ مطبعي في اسم الخيار
      compilationMod: 'all',
      // نوع قيمة خاطئ
      panicThreshold: true,
      // خيار غير معروف
      optimizationLevel: 'max'
    }]
  ]
};
```

راجع [توثيق الإعداد](/reference/react-compiler/configuration) للخيارات الصالحة:

```js
// ✅ أفضل: إعداد صالح
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // أو 'infer'
      panicThreshold: 'none', // أو 'critical_errors' أو 'all_errors'
      // استخدم فقط الخيارات الموثّقة
    }]
  ]
};
```

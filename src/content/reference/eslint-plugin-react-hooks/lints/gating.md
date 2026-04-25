---
title: gating
---

<Intro>

يتحقق من إعداد [وضع gating](/reference/react-compiler/gating).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

يتيح وضع gating تبنّي React Compiler تدريجياً بوسم مكوّنات محددة للتحسين. تضمن هذه القاعدة أن إعداد gating صالحاً حتى يعرف المُصرّف أي المكوّنات يعالج.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ حقول مطلوبة ناقصة
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // حقل 'source' ناقص
      }
    }]
  ]
};

// ❌ نوع gating غير صالح
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // يجب أن يكون كائناً
    }]
  ]
};
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ إعداد gating كامل
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // اسم الدالة المُصدَرة
        source: 'featureFlags' // اسم الوحدة
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ بدون gating (تجميع كل شيء)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // لا حقل gating — يجمّع كل المكوّنات
    }]
  ]
};
```

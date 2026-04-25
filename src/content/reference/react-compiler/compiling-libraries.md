---
title: تجميع المكتبات
---

<Intro>
يساعدك هذا الدليل كمؤلف مكتبة على استخدام React Compiler لنشر شيفرة مكتبتك مُحسَّنة لمستخدميك.
</Intro>

<InlineToc />

## لماذا تنشر شيفرة مُجمَّعة؟ {/*why-ship-compiled-code*/}

كمؤلف مكتبة يمكنك تجميع شيفرة المكتبة قبل النشر إلى npm. الفوائد تشمل:

- **تحسين الأداء لجميع المستخدمين** — يحصل مستخدمو مكتبتك على شيفرة مُحسَّنة حتى إن لم يفعّلوا React Compiler بعد
- **لا إعداد مطلوب من المستخدمين** — التحسينات تعمل مباشرة
- **سلوك متسق** — كل المستخدمون يحصلون على النسخة المُحسَّنة بغض النظر عن إعداد البناء

## إعداد التجميع {/*setting-up-compilation*/}

أضف React Compiler إلى عملية بناء مكتبتك:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

اضبط أداة البناء لتجميع المكتبة. مثال مع Babel:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... إعداد آخر
};
```

## التوافق مع الإصدارات السابقة {/*backwards-compatibility*/}

إذا كانت مكتبتك تدعم إصدارات React أقل من 19، ستحتاج إعداداً إضافياً:

### 1. تثبيت حزمة التشغيل {/*install-runtime-package*/}

نوصي بتثبيت `react-compiler-runtime` كتبعية مباشرة:

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. ضبط إصدار الاستهداف {/*configure-target-version*/}

عيّن أقل إصدار React تدعمه المكتبة:

```js
{
  target: '17', // أقل إصدار React مدعوم
}
```

## استراتيجية الاختبار {/*testing-strategy*/}

اختبر مكتبتك مع التجميع وبدونه لضمان التوافق. شغّل مجموعة الاختبارات الحالية على الشيفرة المُجمَّعة، وأنشئ إعداد اختبار منفصلاً يتخطّى المُصرّف. يساعد ذلك على اكتشاف مشاكل قد تنشأ عن التجميع ويضمن عمل المكتبة في كل السيناريوهات.

## استكشاف الأعطال {/*troubleshooting*/}

### المكتبة لا تعمل مع React أقدم {/*library-doesnt-work-with-older-react-versions*/}

إذا رمت المكتبة المُجمَّعة أخطاء في React 17 أو 18:

1. تحقق من تثبيت `react-compiler-runtime` كتبعية
2. تأكد أن إعداد `target` يطابق أقل إصدار React تدعمه
3. تأكد من تضمين حزمة التشغيل في الحزمة المنشورة

### تعارض التجميع مع إضافات Babel أخرى {/*compilation-conflicts-with-other-babel-plugins*/}

قد تتعارض بعض إضافات Babel مع React Compiler:

1. ضع `babel-plugin-react-compiler` مبكراً في قائمة الإضافات
2. عطّل تحسينات متعارضة في إضافات أخرى
3. اختبر مخرجات البناء بدقة

### وحدة التشغيل غير موجودة {/*runtime-module-not-found*/}

إذا رأى المستخدمون «Cannot find module 'react-compiler-runtime'»:

1. تأكد أن التشغيل في `dependencies` وليس `devDependencies`
2. تحقق أن المُجمّع يضمّن التشغيل في المخرجات
3. تأكد أن الحزمة منشورة على npm مع مكتبتك

## الخطوات التالية {/*next-steps*/}

- تعرّف على [تقنيات التصحيح](/learn/react-compiler/debugging) للشيفرة المُجمَّعة
- راجع [خيارات الإعداد](/reference/react-compiler/configuration) لكل خيارات المُصرّف
- استكشف [أوضاع التجميع](/reference/react-compiler/compilationMode) للتحسين الانتقائي

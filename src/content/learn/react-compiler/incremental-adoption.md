---
title: التبنّي التدريجي
---

<Intro>
يمكن تبنّي React Compiler بشكل تدريجي، مما يتيح لك اختباره على أجزاء محددة من قاعدة الشيفرة أولًا. يوضّح هذا الدليل كيفية نشر المُجمِّع تدريجيًا في المشاريع الحالية.
</Intro>

<YouWillLearn>

* لماذا يُنصح بالتبنّي التدريجي
* استخدام تَجاوزات Babel للتبنّي على مستوى المجلدات
* استخدام توجيه `"use memo"` للاشتراك اليدوي في التجميع
* استخدام توجيه `"use no memo"` لاستبعاد المكوّنات
* علامات الميزات وقت التشغيل (gating)
* مراقبة تقدّم عملية التبنّي

</YouWillLearn>

## لماذا التبنّي التدريجي؟ {/*why-incremental-adoption*/}

تم تصميم React Compiler لتحسين قاعدة الشيفرة بأكملها تلقائيًا، لكن ليس عليك تفعيله في كل شيء دفعة واحدة. يمنحك التبنّي التدريجي سيطرة أفضل على عملية النشر، ويسمح لك باختبار المُجمِّع على أجزاء صغيرة من التطبيق قبل توسيع النطاق.

البدء بأجزاء صغيرة يساعدك على بناء الثقة في تحسينات المُجمِّع. يمكنك التحقق من أن تطبيقك يعمل بشكل صحيح بالشيفرة المُجمَّعة، قياس تحسينات الأداء، وتحديد أي حواف خاصة بقاعدة الشيفرة لديك. هذا النهج مفيد بشكل خاص للتطبيقات الإنتاجية حيث تكون الاستقرارية مهمة.

كما يسهل التبنّي التدريجي معالجة أي انتهاكات لقواعد React قد يعثر عليها المُجمِّع، إذ يمكنك إصلاحها منهجيًا أثناء توسيع نطاق التجميع، مما يجعل الترحيل أكثر قابلية للإدارة ويقلل مخاطر إدخال أخطاء.

بواسطة التحكم في الأجزاء التي تُجمَّع، يمكنك أيضًا إجراء اختبارات A/B لقياس التأثير الواقعي لتحسينات المُجمِّع، مما يساعدك على اتخاذ قرار مستنير بشأن التبنّي الكامل وإظهار القيمة للفريق.

## نهج التبنّي التدريجي {/*approaches-to-incremental-adoption*/}

هناك ثلاث طرق رئيسية لتبنّي React Compiler تدريجيًا:

1. **تجاوزات Babel (Babel overrides)** - تطبيق المُجمِّع على مجلّدات محددة
2. **الاشتراك اليدوي بـ `"use memo"`** - تجميع المكوّنات التي تشترك صراحة فقط
3. **التحكّم وقت التشغيل (Runtime gating)** - التحكم في التجميع بواسطة أعلام الميزات

تسمح جميع هذه الأساليب باختبار المُجمِّع على أجزاء محددة من التطبيق قبل نشره بالكامل.

## التبنّي على مستوى الدليل باستخدام تجاوزات Babel {/*directory-based-adoption*/}

تتيح لك خاصية `overrides` في Babel تطبيق إضافات مختلفة على أجزاء متفرقة من قاعدة الشيفرة. هذا مثالي لتبنّي React Compiler بشكل تدريجي حسب المجلّد.

### الإعداد الأساسي {/*basic-configuration*/}

ابدأ بتطبيق المُجمِّع على مجلّد محدد:

```js
// babel.config.js
module.exports = {
  plugins: [
    // الإضافات العامة التي تنطبق على كل الملفات
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### توسيع التغطية {/*expanding-coverage*/}

مع ازدياد ثقتك، أضف مجلدات أخرى:

```js
// babel.config.js
module.exports = {
  plugins: [
    // الإضافات العامة
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // إضافات مختلفة للكود القديم
      ]
    }
  ]
};
```

### مع خيارات المُجمِّع {/*with-compiler-options*/}

يمكنك أيضًا تكوين خيارات المُجمِّع لكل تجاوز:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // خيارات ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // خيارات ...
        }]
      ]
    }
  ]
};
```


## وضع الاشتراك اليدوي باستخدام `"use memo"` {/*opt-in-mode-with-use-memo*/}

للحصول على أقصى درجات التحكم، يمكنك استخدام `compilationMode: 'annotation'` لتجميع المكونات والخُطَف (hooks) التي تشترك صراحةً فقط عبر توجيه `"use memo"`.

<Note>
يوفّر هذا النهج تحكمًا دقيقًا على مستوى المكونات والخطافات. يكون مفيدًا عندما تريد اختبار المُجمِّع على مكوّنات محددة دون التأثير على مجلدات كاملة.
</Note>

### إعداد وضع التعليقات التوضيحية {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### كيفية استخدام التوجيه {/*using-the-directive*/}

أضف `"use memo"` في بداية الوظائف التي تريد تجميعها:

```js
function TodoList({ todos }) {
  "use memo"; // اشترك بهذا المكوّن في التجميع

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // اشترك بهذا الهُوك في التجميع

  return data.slice().sort();
}
```

مع `compilationMode: 'annotation'` يجب عليك:
- إضافة `"use memo"` إلى كل مكوّن ترغب في تحسينه
- إضافة `"use memo"` إلى كل هُوك مُخصص
- تذكّر إضافته للمكوّنات الجديدة

يوفر ذلك تحكمًا دقيقًا في المكوّنات التي تُجمَّع أثناء تقييم تأثير المُجمِّع.

## أعلام الميزات وقت التشغيل مع التحكّم (Gating) {/*runtime-feature-flags-with-gating*/}

تتيح لك خاصية `gating` التحكم في التجميع وقت التشغيل باستخدام أعلام الميزات. هذا مفيد عند إجراء اختبارات A/B أو النشر التدريجي للمُجمِّع على أساس مجموعات المستخدمين.

### كيف تعمل آلية الـ Gating {/*how-gating-works*/}

يقوم المُجمِّع بلفّ الشيفرة المحسّنة في فحص وقت التشغيل. إذا أعاد gate قيمة `true`، تعمل النسخة المحسّنة، وإلا تعمل النسخة الأصلية.

### تكوين الـ Gating {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### تنفيذ دالة علامة الميزة {/*implementing-the-feature-flag*/}

أنشئ وحدة تُصدّر دالة gate:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // استخدم نظام أعلام الميزات لديك
  return getFeatureFlag('react-compiler-enabled');
}
```

## استكشاف مشكلات التبنّي {/*troubleshooting-adoption*/}

إذا واجهت مشاكل أثناء التبنّي:

1. استخدم `"use no memo"` لاستبعاد المكوّنات المُشكّلة مؤقتًا
2. راجع [دليل التصحيح](/learn/react-compiler/debugging) للمشكلات الشائعة
3. أصل انتهاكات قواعد React التي يحددها مكوّن ESLint
4. فكّر في استخدام `compilationMode: 'annotation'` لنهج أكثر تدريجيّة

## الخطوات التالية {/*next-steps*/}

- اطلع على [دليل التكوين](/reference/react-compiler/configuration) لمزيد من الخيارات
- تعرّف على [تقنيات التصحيح](/learn/react-compiler/debugging)
- راجع [المرجع البرمجي](/reference/react-compiler/configuration) للحصول على كل خيارات المُجمِّع

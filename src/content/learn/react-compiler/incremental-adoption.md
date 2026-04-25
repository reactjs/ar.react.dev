---
title: التبني التدريجي
---

<Intro>
يمكن تبني مُصرّف React تدريجياً، فيسمح لك بتجربته على أجزاء محددة من قاعدة الشيفرة أولاً. يوضح هذا الدليل كيفية تفعيل المُصرّف تدريجياً في مشاريع قائمة.
</Intro>

<YouWillLearn>

* لماذا يُنصح بالتبني التدريجي
* استخدام تجاوزات Babel للتبني حسب المجلد
* استخدام توجيه «use memo» للاشتراك في التجميع
* استخدام توجيه «use no memo» لاستبعاد مكوّنات
* أعلام الميزات وقت التشغيل مع البوابات (gating)
* مراقبة تقدّم التبني

</YouWillLearn>

## لماذا التبني التدريجي؟ {/*why-incremental-adoption*/}

صُمم مُصرّف React ليُحسِّن قاعدة الشيفرة بأكملها تلقائياً، لكن لا يلزمك تبنيه دفعة واحدة. يمنحك التبني التدريجي تحكماً في عملية التفعيل، لتختبر المُصرّف على أجزاء صغيرة من التطبيق قبل التوسع.

البدء بجزء صغير يبني ثقتك في تحسينات المُصرّف. يمكنك التحقق من أن التطبيق يتصرف بشكل صحيح مع الشيفرة المُجمَّعة، وقياس تحسينات الأداء، وتحديد أي حالات حافة خاصة بقاعدة الشيفرة. هذا مفيد خصوصاً للتطبيقات الإنتاجية حيث الاستقرار حاسم.

يسهّل التبني التدريجي أيضاً معالجة أي مخالفات لقواعد React قد يجدها المُصرّف. بدلاً من إصلاح المخالفات في كل القاعدة دفعة واحدة، يمكنك معالجتها بشكل منظم مع توسيع تغطية المُصرّف. يبقي ذلك الهجرة قابلة للإدارة ويقلل خطر إدخال أخطاء.

بالتحكم في الأجزاء المُجمَّعة من الشيفرة، يمكنك أيضاً تشغيل اختبارات A/B لقياس أثر التحسينات في الواقع. تساعدك هذه البيانات على اتخاذ قرارات مستنيرة بشأن التبني الكامل وإظهار القيمة لفريقك.

## أساليب التبني التدريجي {/*approaches-to-incremental-adoption*/}

هناك ثلاثة أساليب رئيسية لتبني مُصرّف React تدريجياً:

1. **تجاوزات Babel** — تطبيق المُصرّف على مجلدات محددة
2. **الاشتراك بتوجيه «use memo»** — تجميع المكوّنات التي تختار صراحةً الاشتراك فقط
3. **البوابات وقت التشغيل** — التحكم في التجميع بأعلام ميزات

كل الأساليب تسمح لك باختبار المُصرّف على أجزاء محددة من التطبيق قبل التفعيل الكامل.

## التبني حسب المجلد بتجاوزات Babel {/*directory-based-adoption-with-babel-overrides*/}

خيار `overrides` في Babel يتيح تطبيق إضافات مختلفة على أجزاء مختلفة من قاعدة الشيفرة. مثالي لتبني مُصرّف React مجلداً مجلداً.

### الإعداد الأساسي {/*basic-configuration*/}

ابدأ بتطبيق المُصرّف على مجلد محدد:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
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

مع ازدياد الثقة، أضف مجلدات أكثر:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
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
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### مع خيارات المُصرّف {/*with-compiler-options*/}

يمكنك أيضاً ضبط خيارات المُصرّف لكل تجاوز:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    }
  ]
};
```


## وضع الاشتراك بتوجيه «use memo» {/*opt-in-mode-with-use-memo*/}

لأقصى تحكم، يمكنك استخدام `compilationMode: 'annotation'` لتجميع المكوّنات والخطافات التي تختار صراحةً الاشتراك بتوجيه `"use memo"` فقط.

<Note>
يمنحك هذا الأسلوب تحكماً دقيقاً في كل مكوّن وخطاف. مفيد عندما تريد اختبار المُصرّف على مكوّنات محددة دون تأثير مجلدات بأكملها.
</Note>

### إعداد وضع التعليقات {/*annotation-mode-configuration*/}

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

### استخدام التوجيه {/*using-the-directive*/}

أضف `"use memo"` في بداية الدوال التي تريد تجميعها:

```js
function TodoList({ todos }) {
  "use memo"; // Opt this component into compilation

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
  "use memo"; // Opt this hook into compilation

  return data.slice().sort();
}
```

مع `compilationMode: 'annotation'`، يجب أن:
- تضيف `"use memo"` إلى كل مكوّن تريد تحسينه
- تضيف `"use memo"` إلى كل خطاف مخصص
- تتذكر إضافته للمكوّنات الجديدة

يمنحك ذلك تحكماً دقيقاً في المكوّنات المُجمَّعة أثناء تقييم أثر المُصرّف.

## أعلام الميزات وقت التشغيل مع البوابات {/*runtime-feature-flags-with-gating*/}

خيار `gating` يتيح التحكم في التجميع وقت التشغيل باستخدام أعلام ميزات. مفيد لتشغيل اختبارات A/B أو تفعيل المُصرّف تدريجياً حسب شرائح المستخدمين.

### كيف تعمل البوابات {/*how-gating-works*/}

يلفّ المُصرّف الشيفرة المُحسَّنة بفحص وقت تشغيل. إن أعادت البوابة `true`، يعمل الإصدار المُحسَّن. وإلا تعمل الشيفرة الأصلية.

### إعداد البوابات {/*gating-configuration*/}

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

### تنفيذ علم الميزة {/*implementing-the-feature-flag*/}

أنشئ وحدة تصدّر دالة البوابة:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

## استكشاف أخطاء التبني {/*troubleshooting-adoption*/}

إن واجهت مشكلات أثناء التبني:

1. استخدم `"use no memo"` لاستبعاد المكوّنات المشكوك فيها مؤقتاً
2. راجع [دليل التصحيح](/learn/react-compiler/debugging) للمشكلات الشائعة
3. أصلح مخالفات قواعد React التي يحددها إضافة ESLint
4. فكّر في `compilationMode: 'annotation'` لتبني أكثر تدرجاً

## الخطوات التالية {/*next-steps*/}

- اقرأ [دليل الإعداد](/reference/react-compiler/configuration) لمزيد من الخيارات
- تعرّف على [تقنيات التصحيح](/learn/react-compiler/debugging)
- راجع [مرجع واجهة البرمجة](/reference/react-compiler/configuration) لكل خيارات المُصرّف

---
title: التثبيت
---

<Intro>
يساعدك هذا الدليل على تثبيت مُصرّف React وضبطه في تطبيق React لديك.
</Intro>

<YouWillLearn>

* كيفية تثبيت مُصرّف React
* الإعداد الأساسي لأدوات بناء مختلفة
* كيفية التحقق من أن الإعداد يعمل

</YouWillLearn>

## المتطلبات {/*prerequisites*/}

صُمم مُصرّف React ليعمل أفضل مع React 19، لكنه يدعم أيضاً React 17 و18. اطّلع على [توافق إصدارات React](/reference/react-compiler/target).

## التثبيت {/*installation*/}

ثبّت مُصرّف React كـ `devDependency`:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

أو مع Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

أو مع pnpm:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## الإعداد الأساسي {/*basic-setup*/}

صُمم مُصرّف React ليعمل افتراضياً بلا إعداد. لكن إن احتجت إلى ضبطه في حالات خاصة (مثلاً لاستهداف إصدارات React أقل من 19)، راجع [مرجع خيارات المُصرّف](/reference/react-compiler/configuration).

تعتمد خطوات الإعداد على أداة البناء لديك. يتضمّن مُصرّف React إضافة Babel تندمج مع مسار البناء.

<Pitfall>
يجب أن يعمل مُصرّف React **أولاً** في سلسلة إضافات Babel. يحتاج المُصرّف إلى معلومات المصدر الأصلية للتحليل الصحيح، فيجب أن يعالج شيفرتك قبل التحويلات الأخرى.
</Pitfall>

### Babel {/*babel*/}

أنشئ أو حدّث `babel.config.js`:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite {/*vite*/}

إن كنت تستخدم Vite، يمكنك إضافة الإضافة إلى vite-plugin-react:

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

بديلاً، إن فضّلت إضافة Babel منفصلة لـ Vite:

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

راجع [وثائق Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) لمزيد من المعلومات.

### React Router {/*usage-with-react-router*/}
ثبّت `vite-plugin-babel`، وأضف إضافة Babel للمُصرّف:

<TerminalBlock>
{`npm install vite-plugin-babel`}
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

مُحمّل Webpack مجتمعي [متاح هنا](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

راجع [وثائق Expo](https://docs.expo.dev/guides/react-compiler/) لتفعيل واستخدام مُصرّف React في تطبيقات Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

يستخدم React Native ‏Babel عبر Metro، فارجع إلى قسم [الاستخدام مع Babel](#babel) لتعليمات التثبيت.

### Rspack {/*usage-with-rspack*/}

راجع [وثائق Rspack](https://rspack.dev/guide/tech/react#react-compiler) لتفعيل واستخدام مُصرّف React في تطبيقات Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

راجع [وثائق Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) لتفعيل واستخدام مُصرّف React في تطبيقات Rsbuild.


## تكامل ESLint {/*eslint-integration*/}

يتضمّن مُصرّف React قاعدة ESLint تساعد على تحديد الشيفرة التي لا يمكن تحسينها. عندما تُبلغ القاعدة عن خطأ، يعني ذلك أن المُصرّف سيتخطى تحسين ذلك المكوّن أو الخطاف تحديداً. هذا آمِن: سيستمر المُصرّف في تحسين أجزاء أخرى من قاعدة الشيفرة. لا يلزم إصلاح كل المخالفات فوراً. عالجها بوتيرتك لزيادة عدد المكوّنات المُحسَّنة تدريجياً.

ثبّت إضافة ESLint:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

إن لم تكن قد ضبطت `eslint-plugin-react-hooks` بعد، اتبع [تعليمات التثبيت في الملف README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation). قواعد المُصرّف متاحة في الإعداد المسبق `recommended-latest`.

ستقوم قاعدة ESLint بـ:
- تحديد مخالفات [قواعد React](/reference/rules)
- إظهار المكوّنات التي لا يمكن تحسينها
- تقديم رسائل خطأ مفيدة لإصلاح المشكلات

## التحقق من الإعداد {/*verify-your-setup*/}

بعد التثبيت، تحقق من أن مُصرّف React يعمل بشكل صحيح.

### التحقق عبر React DevTools {/*check-react-devtools*/}

المكوّنات التي يُحسِّنها مُصرّف React تعرض شارة «Memo ✨» في React DevTools:

1. ثبّت [إضافة React Developer Tools](/learn/react-developer-tools) للمتصفّح
2. افتح تطبيقك في وضع التطوير
3. افتح React DevTools
4. ابحث عن الرمز ✨ بجانب أسماء المكوّنات

إن كان المُصرّف يعمل:
- ستظهر شارة «Memo ✨» في React DevTools
- ستُذكَّر الحسابات المكلفة تلقائياً
- لا حاجة إلى `useMemo` يدوي

### التحقق من مخرجات البناء {/*check-build-output*/}

يمكنك أيضاً التحقق من تشغيل المُصرّف بفحص مخرجات البناء. ستتضمّن الشيفرة المُجمَّعة منطق التذكّر التلقائي الذي يضيفه المُصرّف.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## استكشاف الأخطاء {/*troubleshooting*/}

### استبعاد مكوّنات محددة {/*opting-out-specific-components*/}

إن سبب مكوّن ما مشكلات بعد التجميع، يمكنك استبعاده مؤقتاً بتوجيه `"use no memo"`:

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

يخبر ذلك المُصرّف بتخطي التحسين لهذا المكوّن. يجب إصلاح السبب الجذري وإزالة التوجيه بعد الحل.

لمزيد من المساعدة في استكشاف الأخطاء، راجع [دليل التصحيح](/learn/react-compiler/debugging).

## الخطوات التالية {/*next-steps*/}

بعد تثبيت مُصرّف React، تعرّف على:

- [توافق إصدارات React](/reference/react-compiler/target) لـ React 17 و18
- [خيارات الإعداد](/reference/react-compiler/configuration) لتخصيص المُصرّف
- [استراتيجيات التبني التدريجي](/learn/react-compiler/incremental-adoption) لقواعد شيفرة قائمة
- [تقنيات التصحيح](/learn/react-compiler/debugging) لاستكشاف المشكلات
- [دليل تجميع المكتبات](/reference/react-compiler/compiling-libraries) لتجميع مكتبة React لديك

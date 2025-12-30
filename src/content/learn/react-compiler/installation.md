---
title: التثبيت
---

<Intro>
يساعدك هذا الدليل على تثبيت وتكوين React Compiler في تطبيق React الخاص بك.
</Intro>

<YouWillLearn>

* كيفية تثبيت React Compiler
* إعدادات أساسية لأدوات البناء المختلفة
* كيفية التحقق من أن الإعداد يعمل بشكل صحيح

</YouWillLearn>

## المتطلبات الأساسية {/*prerequisites*/}

تم تصميم React Compiler للعمل بشكل أمثل مع React 19، لكنه يدعم أيضًا React 17 و 18. اطلع على مزيد من التفاصيل حول [توافق إصدارات React](/reference/react-compiler/target).

## التثبيت {/*installation*/}

ثبّت React Compiler كـ `devDependency`:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

أو باستخدام Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

أو باستخدام pnpm:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## الإعداد الأساسي {/*basic-setup*/}

يعمل React Compiler بشكل افتراضي دون الحاجة إلى تكوين. ومع ذلك، إذا احتجت إلى تخصيص إعدادات خاصة (مثل استهداف إصدارات React أقدم من 19)، راجع [مرجع خيارات المُجمِّع](/reference/react-compiler/configuration).

تعتمد عملية الإعداد على أداة البناء التي تستخدمها. يتضمن React Compiler مكوّن Babel plugin يتكامل مع سير البناء لديك.

<Pitfall>
يجب أن يعمل React Compiler **أولًا** في سلسلة إضافات Babel. يحتاج المُجمِّع إلى معلومات المصدر الأصلية للتحليل الصحيح، لذلك يجب أن يعالج الشيفرة قبل أي تحويلات أخرى.
</Pitfall>

### Babel {/*babel*/}

أنشئ أو حدّث `babel.config.js`:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // يجب أن يعمل أولًا!
    // ... إضافات أخرى
  ],
  // ... إعدادات أخرى
};
```

### Vite {/*vite*/}

إذا كنت تستخدم Vite، يمكنك إضافة الإضافة إلى `vite-plugin-react`:

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

بديلًا، إذا رغبت باستخدام إضافة Babel منفصلة لـ Vite:

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

راجع توثيق [Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) لمزيد من المعلومات.

### React Router {/*usage-with-react-router*/}
ثبت `vite-plugin-babel` وأضف إضافة Babel الخاصة بالمُجمِّع إليه:

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
        presets: ["@babel/preset-typescript"], // إذا كنت تستخدم TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

توفّر مجتمع المطورين محمل Webpack متاحًا [هنا](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

راجع توثيق [Expo](https://docs.expo.dev/guides/react-compiler/) لتمكين واستخدام React Compiler في تطبيقات Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

يستخدم React Native Babel عبر Metro، لذا راجع قسم [استخدام Babel](#babel) للحصول على تعليمات التثبيت.

### Rspack {/*usage-with-rspack*/}

راجع توثيق [Rspack](https://rspack.dev/guide/tech/react#react-compiler) لتمكين واستخدام React Compiler في تطبيقات Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

راجع توثيق [Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) لتمكين واستخدام React Compiler في Rsbuild.


## دمج ESLint {/*eslint-integration*/}

يتضمن React Compiler قاعدة قواعد ESLint تساعد في تحديد الشيفرة التي لا يمكن تحسينها. عندما تبلغ قاعدة ESLint عن خطأ، فهذا يعني أن المُجمِّع سيتجاهل تحسين ذلك المكوّن أو الهُوك الخاص به. هذا أمر آمن: سيستمر المُجمِّع في تحسين أجزاء أخرى من قاعدة الشيفرة. ليس من الضروري إصلاح كل الانتهاكات فورًا؛ عالجها بوتيرتك لزيادة عدد المكونات المحسنة تدريجيًا.

ثبّت إضافة ESLint:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

إذا لم تكن قد أعددت `eslint-plugin-react-hooks` بعد، اتبع تعليمات التثبيت في README الخاص بها. قواعد المُجمِّع متاحة في مجموعة `recommended-latest`.

ستقوم قاعدة ESLint بـ:
- تحديد انتهاكات [قواعد React](/reference/rules)
- إظهار المكونات التي لا يمكن تحسينها
- تقديم رسائل خطأ مفيدة لإصلاح المشكلات

## التحقق من إعدادك {/*verify-your-setup*/}

بعد التثبيت، تحقق من أن React Compiler يعمل بشكل صحيح.

### التحقق عبر React DevTools {/*check-react-devtools*/}

ستُظهر المكوّنات المحسنة بواسطة React Compiler شارة "Memo ✨" في React DevTools:

1. ثبّت امتداد [React Developer Tools](/learn/react-developer-tools)
2. افتح تطبيقك في وضع التطوير
3. افتح React DevTools
4. ابحث عن رمز ✨ بجانب أسماء المكونات

إذا كان المُجمِّع يعمل:
- ستعرض المكوّنات شارة "Memo ✨" في React DevTools
- ستُحفظ العمليات الحسابية المكلفة تلقائيًا
- لن تكون الحاجة إلى `useMemo` اليدوي

### التحقق من مخرجات البناء {/*check-build-output*/}

يمكنك أيضًا التحقق من تشغيل المُجمِّع من خلال فحص مخرجات البناء؛ ستتضمن الشيفرة المجمعة منطق التذكُّر التلقائي الذي يضيفه المُجمِّع.

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

## استكشاف المشكلات {/*troubleshooting*/}

### استبعاد مكوّنات محددة {/*opting-out-specific-components*/}

إذا تسبّب مكوّن بمشكلات بعد التجميع، يمكنك مؤقتًا استبعاده باستخدام توجيه `"use no memo"`:

```js
function ProblematicComponent() {
  "use no memo";
  // هنا كود المكوّن
}
```

يخبر هذا المُجمِّع بتخطي تحسين هذا المكوّن المحدد. يجب عليك إصلاح السبب الجذري وإزالة التوجيه بمجرد حل المشكلة.

لمزيد من المساعدة، راجع [دليل التصحيح](/learn/react-compiler/debugging).

## الخطوات التالية {/*next-steps*/}

الآن بعد أن ثبتت React Compiler، تعرّف على المزيد حول:

- [توافق إصدارات React](/reference/react-compiler/target) لإصدارات React 17 و 18
- [خيارات التكوين](/reference/react-compiler/configuration) لتخصيص المُجمِّع
- [استراتيجيات التبنّي التدريجي](/learn/react-compiler/incremental-adoption) للمشاريع الحالية
- [تقنيات التصحيح](/learn/react-compiler/debugging) لاستكشاف المشكلات
- [دليل تجميع المكتبات](/reference/react-compiler/compiling-libraries) لتجميع مكتبتك

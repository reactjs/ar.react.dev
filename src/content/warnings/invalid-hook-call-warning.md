---
title: Rules of Hooks
---

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
 أنت على الأرجح هُنا بسبب الخطأ التالي:

 > Hooks can only be called inside the body of a function component. \
 > يُمكن استِدعاء الخطافات فقط داخل مُكوّن دالّة.
=======
You are probably here because you got the following error message:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

هُناك ثلاثة أسباب شائعه لظهور الخطأ أعلاه:

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
1. لِديك **نُسخ غير مُتوافقة** من React و React DOM.
2. قد تكون **تخرق [قواعد الخطافات](/docs/hooks-rules.html)**.
3. من المُحتمل أن يكون لديك **أكثر من نسخة React** في نفس التطبيق.
=======
1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

دَعنا ننظُر إلى كُل من الحالات أعلاه.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## نُسخ غير مُتوافقة من React و React DOM {#mismatching-versions-of-react-and-react-dom}

قد تكون تستخدم نسخة `react-dom` أقل من v16.8.0 أو نُسخة `react-native` أقل من 0.59 واللَّتَانِ لا يدعمان الخطافات بعد. يُمكنك تنفيذ "run" أمر `npm ls react-dom` أو `npm ls react-native` في مُجلّد التطبيق خاصتك لمعرفة النُسخة التي تستخدمها. إن وجدت أكثر من نُسخة فقد يخلق ذلك مشاكل (المزيد على ذلك أدناه).

## خرق قواعد الخطافات {#breaking-the-rules-of-hooks}

يُكمنك استدعاء الخظافات **رَيْثَمَا تٌصيير React مكوّن دالّة** فقط:

* ✅ استدعيهم في المُتسوى الأعلى من بدن "body" مُكوّن الداّلة:
* ✅ استدعيهم في المُستوى الأعلى من بدن [خطاف مُخَصص](/docs/hooks-custom.html).

**تَعلّم المزيد عن ذلك في [قواعد الخطافات](/docs/hooks-rules.html)**
=======
## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
لِتَجنُّب الإرباك ، استدعاء الخطافات في الحالات الأُخرى **ليس** مدعومًا:

* 🔴 لا تَستدعِ الخطافات في مكوّنات الصنف.
* 🔴 لا تستدعِ الخطافات في مُعامِلات الأحداث "event handlers".
* 🔴 لا تستدعِ الخطافات داخل الدوال المُمَرَرة إلى `useMemo` أو `useReducer` أو `useEffect`.
=======
It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

إن خرقت تلك القواعد فمن المُمكن ان ترى هذا الخطأ.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
يُمكنك استخدام مُلحق [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) لألتقاط بعضًا من هذه الأخطاء.

>مُلاحظة
>
>[الخطافات المُخصّصة](/docs/hooks-custom.html) *من المُحتمل* أن تستدعي خطافات أُخرى (فذلك هو الهدف منها أساسًا). يعمل ذلك لأنه من المفروض أن الخطافات المُخصّصة تُستدعى فقط رَيْثَمَا يُصّيَّر يكون مكوّن الدالّة.
=======
You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## نُسخَتين مِن React {#duplicate-react}
=======
</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

حتى تعمل الخطافات ، يجب ان يكون امر الاستيراد "import" في شيفرة التطبيق خاصّتِك يُحَلَّل "resolve" إلى نفس الواجهة "module" التي في أمر الاستيراد داخل حُزمة `react-dom`.

إن حُلِّلا أمرا استيراد `react` إلى كائنين تصدير مُختَلِفَين ، فأنك سترى هذا الخطأ. يحدث ذلك إن **كانت لديك نسختان** من حُزمة `react`. 

إن كُنت تستخدم Node لتنظيم الحُزم "package management" ، فيُكمنك تنفيذ الأمر الفحص التالي في مُجلّد المشروح خاصّتك:

<TerminalBlock>

npm ls react

</TerminalBlock>

إن كُنت ترى أكثر من React واحدة فيجب عليك إكتشاف سبب حصول ذلك و إصلاح شًجرة الإعتماديات خاصّتك "dependency tree". فمن المُمكن أن تكون مَكتبة تَستخدِمُها تُحدد `react` كأعتمادية مُباشِرة بدلًا من تحديدها كأعتمادية نظيرة. حتى يتم إصلاح تِلك المَكتبة فأن [اقتِراحات Yarn](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) تُعتبر حلًا بديلًا.

يُمكنك أيضًا مُعالجة هذه المُشكلة من خلال إضافة بعض السجلات "logs" و إعادة تشغيل خادِم التطوير "development server":

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

إن طُبِعَ `false` فأنّه من المُمكن أن يكون لديك اثنان من React و عليك معرفة سبب حصول ذلك. [هذه التذكره "issue"](https://github.com/facebook/react/issues/13991) تحتوي على بعض الأسباب الشائعة.

هذه المُشكلة قد تظهر عند تنفيذك لأمر `npm link` أو أمرًا مشابه له. في تلك الحالة ، فأن المُجَمِّع "bundler" قد يَرى اثنان React - واحدة في مُجلّد التطبيق والأُخرى في مُجلّد المكتبة. اعتِبارًا `myapp` و `mylib` مُجلّدان إخوة (على نفس المُستوى) فقد يكون تنفيذ أمر `npm link ../myapp/node_modules/react` من `mylib` حلًا مُحتَملًا. يقوم ذلك بجعل المكتبة تستخدم نسخة React للتطبيق. 

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
>ملاحظة
>
>غالبًا ، تدعم React استخدام نُسخ مُتعددة مُنفصة على صفحة واحدة (فمثلا، تُستَخدَم React من قِبَل كل من تطبيق وواجهة من الطرف الثالث "third-party widget"). تَحدُث المشاكل فقط عندما يُحَلَّل `require('react')` إلى نتيجة مُختلفة في المُكوّن عمّا يُحَلَّل من نُسخة `react-dom` التي يُصييرهُ.

## أسباب أُخرى {#other-causes}
=======
<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Other Causes {/*other-causes*/}
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171:src/content/warnings/invalid-hook-call-warning.md

إن كُنت لازلت تواجه المشاكل، الرجاء ترك تعليف في [هذه التذكره](https://github.com/facebook/react/issues/13991) وسَنُحاول مُساعدَتُك. إن أمكن، حاوِل انشاء مثال لإعادة إنتاج الخطأ فقد تكتشف المُشكلة حينها.

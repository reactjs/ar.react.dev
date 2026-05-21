---
title: Rules of Hooks
---

أنت على الأرجح هُنا بسبب الخطأ التالي:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component. \
يُمكن استِدعاء الخطاطيف فقط داخل مكون دالّة.
</ConsoleBlock>

هُناك ثلاثة أسباب شائعه لظهور الخطأ أعلاه:

1. لِديك **نُسخ غير مُتوافقة** من React و React DOM.
2. قد تكون **تخرق [قواعد الخطاطيف](/reference/rules/rules-of-hooks)**.
3. من المُحتمل أن يكون لديك **أكثر من نسخة React** في نفس التطبيق.

دَعنا ننظُر إلى كُل من الحالات أعلاه.

## نُسخ غير مُتوافقة من React و React DOM {/*mismatching-versions-of-react-and-react-dom*/}

قد تكون تستخدم نسخة `react-dom` أقل من v16.8.0 أو نُسخة `react-native` أقل من 0.59 واللَّتَانِ لا يدعمان الخطاطيف بعد. يُمكنك تنفيذ أمر `npm ls react-dom` أو `npm ls react-native` في مُجلّد التطبيق خاصتك لمعرفة النُسخة التي تستخدمها. إن وجدت أكثر من نُسخة فقد يخلق ذلك مشاكل (المزيد على ذلك أدناه).

## خرق قواعد الخطاطيف {/*breaking-the-rules-of-hooks*/}

يُكمنك استدعاء الخظافات **رَيْثَمَا تٌصيير React مكوّن دالّة** فقط:

* ✅ استدعهم في المُتسوى الأعلى من بدن "body" مُكوّن الداّلة:
* ✅ استدعهم في المُستوى الأعلى من بدن [خطاف مُخَصص](/learn/reusing-logic-with-custom-hooks).

**تَعلّم المزيد عن ذلك في [قواعد الخطاطيف](/reference/rules/rules-of-hooks)**

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

لِتَجنُّب الإرباك ، استدعاء الخطاطيف في الحالات الأُخرى **ليس** مدعومًا:

* 🔴 لا تَستدعِ الخطاطيف في مكوّنات الصنف.
* 🔴 لا تستدعِ الخطاطيف في مُعامِلات الأحداث "event handlers".
* 🔴 لا تستدعِ الخطاطيف داخل الدوال المُمَرَرة إلى `useMemo` أو `useReducer` أو `useEffect`.

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

يُمكنك استخدام مُلحق [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) لألتقاط بعضًا من هذه الأخطاء.

<Note>

>[الخطاطيف المُخصّصة](/learn/reusing-logic-with-custom-hooks) *من المُحتمل* أن تستدعي خطاطيف أُخرى (فذلك هو الهدف منها أساسًا). يعمل ذلك لأنه من المفروض أن الخطاطيف المُخصّصة تُستدعى فقط رَيْثَمَا يُصّيَّر يكون مكوّن الدالّة.

</Note>

## نُسخَتين مِن React {/*duplicate-react*/}

حتى تعمل الخطاطيف ، يجب ان يكون امر الاستيراد "import" في شيفرة التطبيق خاصّتِك يُحَلَّل "resolve" إلى نفس الواجهة "module" التي في أمر الاستيراد داخل حُزمة `react-dom`.

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

<Note>

>غالبًا ، تدعم React استخدام نُسخ مُتعددة مُنفصة على صفحة واحدة (فمثلا، تُستَخدَم React من قِبَل كل من تطبيق وواجهة من الطرف الثالث "third-party widget"). تَحدُث المشاكل فقط عندما يُحَلَّل `require('react')` إلى نتيجة مُختلفة في المُكوّن عمّا يُحَلَّل من نُسخة `react-dom` التي يُصييرهُ.

</Note>

## أسباب أُخرى {/*other-causes*/}

إن كُنت لازلت تواجه المشاكل، الرجاء ترك تعليف في [هذه التذكره](https://github.com/facebook/react/issues/13991) وسَنُحاول مُساعدَتُك. إن أمكن، حاوِل انشاء مثال لإعادة إنتاج الخطأ فقد تكتشف المُشكلة حينها.

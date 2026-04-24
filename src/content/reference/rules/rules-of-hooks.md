---
title: قواعد Hooks
---

<Intro>
تُعرَّف الـ Hooks بدوال JavaScript، لكنها تمثّل نوعاً خاصاً من منطق واجهة المستخدم القابل لإعادة الاستخدام مع قيود على أماكن استدعائها.
</Intro>

<InlineToc />

---

## استدعِ الـ Hooks في المستوى الأعلى فقط {/*only-call-hooks-at-the-top-level*/}

الدوال التي أسماؤها تبدأ بـ `use` تُسمّى [*Hooks*](/reference/react) في React.

**لا تستدعِ الـ Hooks داخل حلقات أو شروط أو دوال متداخلة أو كتل `try`/`catch`/`finally`.** استخدم الـ Hooks دائماً في أعلى مستوى دالة React، قبل أي `return` مبكر. يمكنك استدعاء الـ Hooks فقط أثناء تصيير مكوّن دالة:

* ✅ استدعِها في أعلى مستوى جسم [مكوّن دالة](/learn/your-first-component).
* ✅ استدعِها في أعلى مستوى جسم [Hook مخصّص](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ جيد: في المستوى الأعلى داخل مكوّن دالة
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ جيد: في المستوى الأعلى داخل hook مخصّص
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

**لا** يُدعَم استدعاء الـ Hooks (دوال تبدأ بـ `use`) في أي حالات أخرى، مثلاً:

* 🔴 لا تستدعِ الـ Hooks داخل شروط أو حلقات.
* 🔴 لا تستدعِ الـ Hooks بعد `return` شرطي.
* 🔴 لا تستدعِ الـ Hooks في معالجات الأحداث.
* 🔴 لا تستدعِ الـ Hooks في مكوّنات صنفية.
* 🔴 لا تستدعِ الـ Hooks داخل دوال تُمرَّر إلى `useMemo` أو `useReducer` أو `useEffect`.
* 🔴 لا تستدعِ الـ Hooks داخل كتل `try`/`catch`/`finally`.

إذا خالفت هذه القواعد، قد ترى الخطأ التالي.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 سيء: داخل شرط (للإصلاح: انقله للخارج!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 سيء: داخل حلقة (للإصلاح: انقله للخارج!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 سيء: بعد return شرطي (للإصلاح: ضعه قبل return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 سيء: داخل معالج حدث (للإصلاح: انقله للخارج!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 سيء: داخل useMemo (للإصلاح: انقله للخارج!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  }, []);
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 سيء: داخل مكوّن صنفي (للإصلاح: اكتب مكوّن دالة بدلاً من صنف!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 سيء: داخل try/catch/finally (للإصلاح: انقله للخارج!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

يمكنك استخدام [إضافة `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) لالتقاط هذه الأخطاء.

<Note>

[الـ Hooks المخصّصة](/learn/reusing-logic-with-custom-hooks) *قد* تستدعي Hooks أخرى (لهذا الغرض أصلاً). يعمل ذلك لأن الـ Hooks المخصّصة يفترض أن تُستدعى فقط أثناء تصيير مكوّن دالة أيضاً.

</Note>

---

## استدعِ الـ Hooks فقط من دوال React {/*only-call-hooks-from-react-functions*/}

لا تستدعِ الـ Hooks من دوال JavaScript عادية. بدلاً من ذلك:

✅ استدعِ الـ Hooks من مكوّنات دالة React.
✅ استدعِ الـ Hooks من [Hooks مخصّصة](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

باتباع هذه القاعدة، تضمن أن كل المنطق ذي الحالة في المكوّن واضح من شيفرته.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ ليست مكوّناً ولا hook مخصّصاً!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```

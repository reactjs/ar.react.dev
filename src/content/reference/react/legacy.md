---
title: "واجهات React القديمة"
---

<Intro>

تُصدَر هذه الواجهات من حزمة `react`، لكنها غير موصى بها في شيفرة جديدة. راجع صفحة كل واجهة للبدائل المقترحة.

</Intro>

---

## واجهات قديمة {/*legacy-apis*/}

* [`Children`](/reference/react/Children) لمعالجة وتحويل JSX المستلم كخاصّية `children`. [بدائل](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) لإنشاء عنصر React انطلاقاً من عنصر آخر. [بدائل](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) لتعريف مكوّن React كصنف JavaScript. [بدائل](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) لإنشاء عنصر React. المعتاد استخدام JSX.
* [`createRef`](/reference/react/createRef) ينشئ كائن ref يمكن أن يحمل أي قيمة. [بدائل](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) يتيح لمكوّنك كشف عقدة DOM للأب عبر [ref](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) يتحقق ما إذا كانت القيمة عنصر React. غالباً مع [`cloneElement`](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) شبيه بـ [`Component`](/reference/react/Component) لكنه يتخطّى إعادة التصيير عند نفس الـ props. [بدائل](/reference/react/PureComponent#alternatives)

---

## واجهات أُزيلت {/*removed-apis*/}

أُزيلت في React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): استخدم JSX.
* مكوّنات صنفية: [`static contextTypes`](https://18.react.dev/reference/react/Component#static-contexttypes): استخدم [`static contextType`](#static-contexttype).
* مكوّنات صنفية: [`static childContextTypes`](https://18.react.dev/reference/react/Component#static-childcontexttypes): استخدم [`static contextType`](#static-contexttype).
* مكوّنات صنفية: [`static getChildContext`](https://18.react.dev/reference/react/Component#getchildcontext): استخدم [`Context`](/reference/react/createContext#provider).
* مكوّنات صنفية: [`static propTypes`](https://18.react.dev/reference/react/Component#static-proptypes): استخدم نظام أنماط مثل [TypeScript](https://www.typescriptlang.org/).
* مكوّنات صنفية: [`this.refs`](https://18.react.dev/reference/react/Component#refs): استخدم [`createRef`](/reference/react/createRef).

---
title: "الواجهات البرمجية APIs المدمجة في React"
---

<Intro>

إضافةً إلى [الخطاطيف](/reference/react) و[المكونات](/reference/react/components)، تصدر حزمة `react` بعض الواجهات البرمجية الأخرى المفيدة لتعريف المكونات. تعرض هذه الصفحة جميع واجهات React الحديثة المتبقية.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) تتيح لك تعريف السياق وتوفيره للمكونات الفرعية. تستخدم مع [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) تتيح لمكونك عرض عنصر DOM كمرجع للمكون الأصلي. تستخدم مع [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) تتيح لك تأجيل تحميل كود المكون حتى الحاجة إليه.
* [`memo`](/reference/react/memo) تتيح لمكونك تخطي إعادة العرض مع نفس الخصائص. تستخدم مع [`useMemo`](/reference/react/useMemo) و[`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) تتيح لك تحديد تحديث الحالة على أنه غير ضروري. مشابهة لـ [`useTransition`.](/reference/react/useTransition)
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
>>>>>>> 9967ded394d85af74e0ecdbf00feeb7921a28142

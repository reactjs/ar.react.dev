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
* [`act`](/reference/react/act) يتيح لك عرض العمليات والتفاعلات في الاختبارات لضمان معالجة التحديثات قبل إجراء التحققات.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

---

## Resource APIs {/*resource-apis*/}

يمكن الوصول إلى الموارد من قبل المكون دون أن تكون جزءًا من حالته. على سبيل المثال، يمكن لمكون قراءة رسالة من Promise أو قراءة معلومات تنسيق من سياق.

استخدم هذه الواجهة البرمجية لقراءة قيمة من مورد:

* [`use`](/reference/react/use) تتيح لك قراءة قيمة مورد مثل [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
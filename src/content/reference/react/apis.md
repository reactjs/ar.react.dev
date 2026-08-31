---
title: "الواجهات البرمجية APIs المدمجة في React"
---

<Intro>

إضافةً إلى [الخطاطيف](/reference/react/hooks) و[المكونات](/reference/react/components)، تصدر حزمة `react` بعض الواجهات البرمجية الأخرى المفيدة لتعريف المكونات. تعرض هذه الصفحة جميع واجهات React الحديثة المتبقية.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) تتيح لك تعريف السياق وتوفيره للمكونات الفرعية. تستخدم مع [`useContext`.](/reference/react/useContext)
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
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

---

## Resource APIs {/*resource-apis*/}

يمكن الوصول إلى الموارد من قبل المكون دون أن تكون جزءًا من حالته. على سبيل المثال، يمكن لمكون قراءة رسالة من Promise أو قراءة معلومات تنسيق من سياق.

<<<<<<< HEAD
استخدم هذه الواجهة البرمجية لقراءة قيمة من مورد:

* [`use`](/reference/react/use) تتيح لك قراءة قيمة مورد مثل [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [context](/learn/passing-data-deeply-with-context).
=======
You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* <CanaryBadge /> The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.

>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```

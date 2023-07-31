---
title: React DOM APIs
---

<Intro>

تحتوي حزمة `react-dom` على الوظائف المدعومة لتطبيقات الويب فقط (التي تعمل في بيئة المتصفح DOM). أي أنها غير مدعومة لـ React Native.

</Intro>

---

## APIs {/*apis*/}

هذه الوظائف يمكن استيرادها في مكوناتك. لكن نادراً ما يتم استخدامها:

* تتيح لك [`createPortal`](/reference/react-dom/createPortal) تقديم مكونات فرعية في جزء مختلف من شجرة DOM.
* تتيح لك [`flushSync`](/reference/react-dom/flushSync) إجبار React على تفريغ تحديث الحالة وتحديث DOM بشكل متزامن.

---

## نقاط البداية {/*entry-points*/}

تقدم حزمة `react-dom` نقطتي بداية إضافيتين:

* تحتوي [`react-dom/client`](/reference/react-dom/client) على وظائف لتصيير مكونات React في جانب العميل (في المتصفح).
* تحتوي [`react-dom/server`](/reference/react-dom/server) على وظائف لتصيير مكونات React في الخادم.

---

## وظائف ملغاه {/*deprecated-apis*/}

<Deprecated>

ستتم إزالة هذه الوظائف في إصدار رئيسي مستقبلي من React.

</Deprecated>

<<<<<<< HEAD
* تجد [`findDOMNode`](/reference/react-dom/findDOMNode) أقرب عنصر DOM يتوافق مع مثيل مكون `class`.
* تقوم [`hydrate`](/reference/react-dom/hydrate) بتركيب شجرة في DOM التي تم إنشاؤها من HTML الذي تم تصييره في الخادم. مهجور لصالح [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* تقوم [`render`](/reference/react-dom/render) بتركيب شجرة في DOM. مهجور لصالح [`createRoot`](/reference/react-dom/client/createRoot).
* تقوم [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) بإلغاء تركيب شجرة من DOM. مهجور لصالح [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)
=======
* [`findDOMNode`](/reference/react-dom/findDOMNode) finds the closest DOM node corresponding to a class component instance.
* [`hydrate`](/reference/react-dom/hydrate) mounts a tree into the DOM created from server HTML. Deprecated in favor of [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) mounts a tree into the DOM. Deprecated in favor of [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) unmounts a tree from the DOM. Deprecated in favor of [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

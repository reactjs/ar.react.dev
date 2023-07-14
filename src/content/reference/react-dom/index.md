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

* تجد [`findDOMNode`](/reference/react-dom/findDOMNode) أقرب عنصر DOM يتوافق مع مثيل مكون `class`.
* تقوم [`hydrate`](/reference/react-dom/hydrate) بتركيب شجرة في DOM التي تم إنشاؤها من HTML الذي تم تصييره في الخادم. مهجور لصالح [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* تقوم [`render`](/reference/react-dom/render) بتركيب شجرة في DOM. مهجور لصالح [`createRoot`](/reference/react-dom/client/createRoot).
* تقوم [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) بإلغاء تركيب شجرة من DOM. مهجور لصالح [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)

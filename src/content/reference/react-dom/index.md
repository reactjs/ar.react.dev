---
title: React DOM APIs
---

<Intro>

تحتوي حزمة `react-dom` الوظائف المدعومة لتطبيقات الويب فقط (التي تعمل في بيئة المستعرض DOM). أي أنها غير مدعومة لـ React Native.

</Intro>

---

## APIs {/*apis*/}

هذه الوظائف يمكن استيرادها في مكوناتك. لكن نادراً ما يتم استخدامها:

* تتيح لك [`createPortal`](/reference/react-dom/createPortal) تقديم مكونات فرعية في جزء مختلف من شجرة DOM.
* تتيح لك [`flushSync`](/reference/react-dom/flushSync) إجبار React على تفريغ تحديث الحالة وتحديث DOM بشكل متزامن.

---

## نقطة البداية {/*entry-points*/}

تقدم حزمة `react-dom` نقطتي بداية إضافيتين:

* تحتوي [`react-dom/client`](/reference/react-dom/client) على وظائف لتصيير مكونات React على العميل (في المستعرض).
* تحتوي [`react-dom/server`](/reference/react-dom/server) على وظائف لتصيير مكونات React على الخادم.

---

## وظائف ملغاه {/*deprecated-apis*/}

<Deprecated>

ستتم إزالة هذه الوظائف في إصدار رئيسي مستقبلي من React.

</Deprecated>

* تجد [`findDOMNode`](/reference/react-dom/findDOMNode) أقرب عنصر DOM تتوافق مع مثيل مكون `class` component.
* تقوم [`hydrate`](/reference/react-dom/hydrate) بتركيب شجرة في DOM التي تم إنشاؤها من HTML الخادم. مهجور لصالح [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* تقوم [`render`](/reference/react-dom/render) بتركيب شجرة في DOM. مهجور لصالح [`createRoot`](/reference/react-dom/client/createRoot).
* تقوم [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) بإلغاء تركيب شجرة من DOM. مهجور لصالح [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)

---
title: واجهات React DOM البرمجية
---

<Intro>

تحتوي حزمة `react-dom` على الوظائف المدعومة لتطبيقات الويب فقط (التي تعمل في بيئة المتصفح DOM). أي أنها غير مدعومة لـ React Native.

</Intro>

---

## APIs {/*apis*/}

هذه الوظائف يمكن استيرادها في مكوناتك. لكن نادراً ما يتم استخدامها:

* تتيح لك [`createPortal`](/reference/react-dom/createPortal) تقديم مكونات فرعية في جزء مختلف من شجرة DOM.
* تتيح لك [`flushSync`](/reference/react-dom/flushSync) إجبار React على تفريغ تحديث الحالة وتحديث DOM بشكل متزامن.

## Resource Preloading APIs {/*resource-preloading-apis*/}

يمكن استخدام هذه الواجهات لتسريع التطبيقات عبر تحميل الموارد مسبقاً — مثل السكربتات وأوراق الأنماط والخطوط — بمجرد أن تعرف أنك ستحتاج إليها، مثلاً قبل الانتقال إلى صفحة أخرى ستُستخدم فيها هذه الموارد.

غالباً ما تتولى [أطر العمل المبنية على React](/learn/creating-a-react-app) تحميل الموارد نيابةً عنك، فقد لا تحتاج إلى استدعاء هذه الواجهات بنفسك. راجع توثيق إطار عملك للتفاصيل.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) تتيح لك جلب عنوان IP لاسم نطاق DNS تتوقع الاتصال به مسبقاً.
* [`preconnect`](/reference/react-dom/preconnect) تتيح لك الاتصال بخادم تتوقع طلب موارد منه، حتى لو لم تعرف بعد الموارد التي ستحتاجها.
* [`preload`](/reference/react-dom/preload) تتيح لك جلب ورقة أنماط أو خط أو صورة أو سكربت خارجي تتوقع استخدامه.
* [`preloadModule`](/reference/react-dom/preloadModule) تتيح لك جلب وحدة ESM تتوقع استخدامها.
* [`preinit`](/reference/react-dom/preinit) تتيح لك جلب سكربت خارجي وتقييمه، أو جلب ورقة أنماط وإدراجها.
* [`preinitModule`](/reference/react-dom/preinitModule) تتيح لك جلب وحدة ESM وتقييمها.

---

## نقاط البداية {/*entry-points*/}

تقدم حزمة `react-dom` نقطتي بداية إضافيتين:

* تحتوي [`react-dom/client`](/reference/react-dom/client) على وظائف لتصيير مكونات React في جانب العميل (في المتصفح).
* تحتوي [`react-dom/server`](/reference/react-dom/server) على وظائف لتصيير مكونات React في الخادم.

---

## APIs محذوفة {/*deprecated-apis*/}

<Deprecated>

ستتم إزالة هذه الوظائف في إصدار رئيسي مستقبلي من React.

</Deprecated>

* تجد [`findDOMNode`](/reference/react-dom/findDOMNode) أقرب عنصر DOM يتوافق مع مثيل مكون `class`.
* تقوم [`hydrate`](/reference/react-dom/hydrate) بتركيب شجرة في DOM التي تم إنشاؤها من HTML الذي تم تصييره في الخادم. مهجور لصالح [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* تقوم [`render`](/reference/react-dom/render) بتركيب شجرة في DOM. مهجور لصالح [`createRoot`](/reference/react-dom/client/createRoot).
* تقوم [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) بإلغاء تركيب شجرة من DOM. مهجور لصالح [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): استخدم واجهات [`react-dom/server`](/reference/react-dom/server) بدلاً منها.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): استخدم واجهات [`react-dom/server`](/reference/react-dom/server) بدلاً منها.

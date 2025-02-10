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

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## نقاط البداية {/*entry-points*/}

تقدم حزمة `react-dom` نقطتي بداية إضافيتين:

* تحتوي [`react-dom/client`](/reference/react-dom/client) على وظائف لتصيير مكونات React في جانب العميل (في المتصفح).
* تحتوي [`react-dom/server`](/reference/react-dom/server) على وظائف لتصيير مكونات React في الخادم.

---

<<<<<<< HEAD
## وظائف ملغاه {/*deprecated-apis*/}

<Deprecated>

ستتم إزالة هذه الوظائف في إصدار رئيسي مستقبلي من React.

</Deprecated>

* تجد [`findDOMNode`](/reference/react-dom/findDOMNode) أقرب عنصر DOM يتوافق مع مثيل مكون `class`.
* تقوم [`hydrate`](/reference/react-dom/hydrate) بتركيب شجرة في DOM التي تم إنشاؤها من HTML الذي تم تصييره في الخادم. مهجور لصالح [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* تقوم [`render`](/reference/react-dom/render) بتركيب شجرة في DOM. مهجور لصالح [`createRoot`](/reference/react-dom/client/createRoot).
* تقوم [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) بإلغاء تركيب شجرة من DOM. مهجور لصالح [`root.unmount()`.](/reference/react-dom/client/createRoot#root-unmount)
=======
## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
>>>>>>> 91614a51a1be9078777bc337ba83fc62e606cc14

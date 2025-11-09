---
title: واجبات Server React DOM
---

<Intro>

تتيح لك واجهات `react-dom/server` تصيير مكونات React إلى HTML على الخادم. يتم استخدام هذه الواجهات فقط على الخادم في المستوى الأعلى من تطبيقك لإنشاء HTML الأولي. قد يستدعيها [إطار العمل](/learn/start-a-new-react-project#production-grade-react-frameworks) نيابةً عنك. معظم مكوناتك لا تحتاج لاستيرادها أو استخدامها.

</Intro>

---

## واجهات Server لـ Node.js Streams {/*server-apis-for-nodejs-streams*/}

هذه الطرق متاحة فقط في البيئات التي تدعم [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) تصيّر شجرة React إلى [Node.js Stream](https://nodejs.org/api/stream.html) قابل للأنابيب.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) تصيّر شجرة React غير تفاعلية إلى [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

---

## واجهات Server لـ Web Streams {/*server-apis-for-web-streams*/}

هذه الطرق متاحة فقط في البيئات التي تدعم [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، والتي تشمل المتصفحات و Deno وبعض بيئات edge الحديثة:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) تصيّر شجرة React إلى [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## واجهات Server للبيئات غير المدعومة للـ streaming {/*server-apis-for-non-streaming-environments*/}

يمكن استخدام هذه الطرق في البيئات التي لا تدعم streams:

* [`renderToString`](/reference/react-dom/server/renderToString) تصيّر شجرة React إلى string.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) تصيّر شجرة React غير تفاعلية إلى string.

لديها وظائف محدودة مقارنة بواجهات streaming.

---

## واجهات Server المُهملة {/*deprecated-server-apis*/}

<Deprecated>

سيتم إزالة هذه الواجهات في إصدار رئيسي مستقبلي من React.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) تصيّر شجرة React إلى [Node.js Readable stream.](https://nodejs.org/api/stream.html#readable-streams) (مُهملة.)

---
title: واجهات Static React DOM
---

<Intro>

تتيح لك واجهات `react-dom/static` إنشاء HTML ثابت لمكونات React. لديها وظائف محدودة مقارنة بواجهات streaming. قد يستدعيها [إطار العمل](/learn/start-a-new-react-project#full-stack-frameworks) نيابةً عنك. معظم مكوناتك لا تحتاج لاستيرادها أو استخدامها.

</Intro>

---

## واجهات Static لـ Web Streams {/*static-apis-for-web-streams*/}

هذه الطرق متاحة فقط في البيئات التي تدعم [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، والتي تشمل المتصفحات و Deno وبعض بيئات edge الحديثة:

* [`prerender`](/reference/react-dom/static/prerender) تصيّر شجرة React إلى HTML ثابت باستخدام [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) تكمل شجرة React مُصيّرة مسبقًا إلى HTML ثابت باستخدام [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

يتضمن Node.js أيضًا هذه الطرق من أجل التوافق، لكن لا يُنصح بها بسبب الأداء الأسوأ. استخدم [واجهات Node.js المخصصة](#static-apis-for-nodejs-streams) بدلاً من ذلك.

---

## واجهات Static لـ Node.js Streams {/*static-apis-for-nodejs-streams*/}

هذه الطرق متاحة فقط في البيئات التي تدعم [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) تصيّر شجرة React إلى HTML ثابت باستخدام [Node.js Stream.](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) تكمل شجرة React مُصيّرة مسبقًا إلى HTML ثابت باستخدام [Node.js Stream.](https://nodejs.org/api/stream.html)


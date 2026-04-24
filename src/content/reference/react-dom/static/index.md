---
title: واجهات react-dom/static
---

<Intro>

تتيح واجهات `react-dom/static` توليد HTML ساكن لمكوّنات React. نطاقها أضيق من واجهات البث (streaming). قد تستدعيها [إطار العمل](/learn/creating-a-react-app#full-stack-frameworks) نيابةً عنك. أغلب مكوّناتك لا تحتاج استيرادها أو استخدامها.

</Intro>

---

## واجهات ساكنة لـ Web Streams {/*static-apis-for-web-streams*/}

تتوفر هذه الدوال فقط في البيئات التي تدعم [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، بما فيها المتصفّحات وDeno وبعض بيئات الحافة الحديثة:

* [`prerender`](/reference/react-dom/static/prerender) يصيّر شجرة React إلى HTML ساكن مع [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) يكمل شجرة React مُسبَقة التصيير إلى HTML ساكن مع [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

تتضمّن Node.js هذه الدوال للتوافق، لكنها غير موصى بها لأداء أضعف. استخدم [واجهات Node.js المخصّصة](#static-apis-for-nodejs-streams).

---

## واجهات ساكنة لـ Node.js Streams {/*static-apis-for-nodejs-streams*/}

تتوفر هذه الدوال فقط حيث تتوفر [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) يصيّر شجرة React إلى HTML ساكن مع [Node.js Stream](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) يكمل شجرة React مُسبَقة التصيير إلى HTML ساكن مع [Node.js Stream](https://nodejs.org/api/stream.html)


---
title: واجهات React DOM للخادم
---

<Intro>

تتيح لك واجهات `react-dom/server` تصيير مكوّنات React إلى HTML على الخادم. تُستخدَم هذه الواجهات على الخادم فقط عند أعلى مستوى في تطبيقك لتوليد HTML الأولي. قد تستدعيها [إطار العمل](/learn/creating-a-react-app#full-stack-frameworks) نيابةً عنك. لا تحتاج معظم مكوّناتك إلى استيرادها أو استخدامها.

</Intro>

---

## واجهات الخادم لتيارات الويب (Web Streams) {/*server-apis-for-web-streams*/}

تتوفر هذه الدوال فقط في البيئات التي تدعم [تيارات الويب (Web Streams)](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، بما في ذلك المتصفحات وDeno وبعض بيئات الحافة الحديثة:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) يصيّر شجرة React إلى [تيار ويب للقراءة (Readable Web Stream).](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/resume) يُكمِل [`prerender`](/reference/react-dom/static/prerender) إلى [تيار ويب للقراءة (Readable Web Stream)](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).


<Note>

تتضمّن Node.js هذه الدوال أيضاً للتوافق، لكنها غير مُوصى بها بسبب أداء أضعف. استخدم [واجهات Node.js المخصّصة](#server-apis-for-nodejs-streams) بدلاً من ذلك.

</Note>
---

## واجهات الخادم لتيارات Node.js {/*server-apis-for-nodejs-streams*/}

تتوفر هذه الدوال فقط في البيئات التي تدعم [تيارات Node.js:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) يصيّر شجرة React إلى [تيار Node.js](https://nodejs.org/api/stream.html) قابل للربط بالأنابيب (pipeable).
* [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) يُكمِل [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) إلى [تيار Node.js](https://nodejs.org/api/stream.html) قابل للربط بالأنابيب.

---

## واجهات الخادم القديمة لبيئات غير داعمة للتيارات {/*legacy-server-apis-for-non-streaming-environments*/}

يمكن استخدام هذه الدوال في البيئات التي لا تدعم التيارات:

* [`renderToString`](/reference/react-dom/server/renderToString) يصيّر شجرة React إلى سلسلة نصية.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) يصيّر شجرة React غير تفاعلية إلى سلسلة نصية.

وظائفها أقل مقارنةً بواجهات التدفق (streaming).

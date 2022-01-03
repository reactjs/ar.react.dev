---
id: testing-environments
title: اختبار البيئات
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

يتناول هذا المستند العوامل التي يمكن أن تؤثر على بيئتك والتوصيات المتعلقة ببعض السيناريوهات.

### منفذو الاختبار {#test-runners}

- يتيح لك منفذو الاختبار مثل [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) كتابة مجموعات اختبار على هيئه JavaScript وتشغيلها بصفتها جزءا من عملية التطوير الخاصة بك. بالإضافة إلى ذلك يتم تشغيل مجموعات الاختبار بصفتها جزءا من التكامل المستمر (CI).
- Jest متوافق على نطاق واسع مع مشاريع React، ودعم مميزات جديدة مثل [الوحدات النمطية](#moking-modules)و [العداد](#moking-timers) ودعم [`jsdom`](#mocking-a-rendering-surface`). **إذا كنت تستخدم Create React App إذن [Jest موجود بالفعل](https://facebook.github.io/create-react-app/docs/running-tests) مع تسطيب افتراضي مفيد**.
- المكتبات مثل [mocha](https://mochajs.org/#running-mocha-in-the-browser) تعمل بشكل جيد في بيئات المتصفح الحقيقي، ويمكن أن تساعد في الاختبارات التي تحتاجها بشكل صريح.
- تُستخدم اختبارات End-to-End لاختبار تدفقات أطول عبر عدة صفحات، وتتطلب [إعدادات مختلفة](#end-to-end-tests-aka-e2e-tests).

### محاكاة واجهة التصيير {#mocking-a-rendering-surface}

تعمل الاختبارات غالبًا في بيئة دون الوصول إلى واجهة التصيير الحقيقية مثل المتصفح. بالنسبة لهذه البيئات، نوصي بمحاكاة متصفح باستخدام [`jsdom`](https://github.com/jsdom/jsdom) ، وهو تطبيق متصفح خفيف الوزن يعمل داخل Node.js.

في معظم الحالات، يتصرف jsdom كالمتصفح العادي، لكن ليس به ميزات مثل [layout و navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). لا يزال هذا مفيدًا لمعظم اختبارات المكونات المستندة إلى الويب، لأنه يعمل بشكل أسرع من إعادة بدء تشغيل متصفح لكل اختبار. يتم تشغيله أيضًا في نفس عملية الاختبارات الخاصة بك، حتى تتمكن من كتابة التعليمات البرمجية لفحصها وتأكيدها على DOM.

تمامًا كما في المتصفح الحقيقي، تتيح لنا jsdom تصميم تفاعلات المستخدم؛ يمكن للاختبارات إرسال الأحداث في عقدات DOM، ثم مراقبة الآثار الجانبية لهذه الإجراءات والتأكيد عليها [<small>(مثال)</small>](/docs/testing-recipes.html#events).

يمكن كتابة جزء كبير من اختبارات واجهة المستخدم باستخدام الإعداد أعلاه: استخدام Jest كمنفذ للاختبار، يتم تصييره إلى jsdom ، مع تفاعلات المستخدم المحددة كسلسلة من أحداث المتصفح، مدعومًا بـالمساعد `act ()`  [<small>(مثال)</small>](/docs/testing-recipes.html). على سبيل المثال، تتم كتابة الكثير من اختبارات React الخاصة مع هذه التركيبة.

إذا كنت تكتب مكتبة تختبر في الغالب السلوك الخاص بالمتصفح، وتتطلب سلوك المتصفح الأصلي مثل الـ layout أو حقول الإدخال الحقيقية، يمكنك استخدام إطار عمل مثل [mocha.](https://mochajs.org/)

في بيئة لا يمكنك فيها محاكاة DOM (على سبيل المثال، اختبار مكونات React Native على Node.js) ، يمكنك استخدام [مساعدي محاكاة الأحداث](/docs/test-utils.html#simulate) لمحاكاة التفاعلات مع العناصر. بالتناوب، يمكنك استخدام `fireEvent` المساعد من <span dir='ltr'>[`@ testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro)<span>.

إطارات عمل مثل [Cypress](https://www.cypress.io/) و [puppeteer](https://github.com/GoogleChrome/puppeteer) و [webdriver](https://www.seleniumhq.org/projects/webdriver /) مفيدة لتشغيل [اختبارات end-to-end](#end-to-end-tests-aka-e2e-tests).

### محاكاة الدوال {#mocking-functions}

عند كتابة الاختبارات، نود أن نحاكى الشفرة الخاص بنا التي لا تحتوى على مُمَاثل لها فى بيئة الاختبار الخاصة بنا (على سبيل المثال التحقق من حالة `navigator.onLin` داخل Node.js). يمكن للاختبارات أيضًا التجسس على بعض الدوال، ومراقبة كيفية تفاعل أجزاء أخرى من الاختبار معها. من المفيد عندئذ أن تكون قادرًا على محاكاة هذه الدوال باصدارات سهلة الاستخدام بشكل الانتقائي.

هذا مفيد بشكل خاص لجلب البيانات. من المفضل عادة استخدام البيانات "المزيفة" للاختبارات لتجنب البطء والضعف بسبب الجلب من نقاط الوصول النهائية لواجهة برمجة التطبيقات الحقيقية. [<small>(مثال) </small>](/docs/testing-recipes.html#data-fetching ). هذا يساعد على جعل الاختبارات يمكن التنبؤ بها. مكتبات مثل [Jest](https://jestjs.io/) و [sinon](https://sinonjs.org/)، من بين مكونات أخرى، تدعم محاكاه الدوال. بالنسبة لاختبارات الـ end-to-end ، يمكن أن تكون محاكاة الشبكة أكثر صعوبة، ولكن قد ترغب أيضًا في اختبار نقاط الوصول الحقيقية لواجهة برمجة التطبيقات فيها.

### محاكاه الوحدات {#mocking-modules}

تحتوي بعض المكونات على تبعيات للوحدات النمطية التي قد لا تعمل بشكل جيد في بيئات الاختبار، أو ليست ضرورية لاختباراتنا. قد يكون من المفيد الاستغناء عن هذه الوحدات بشكل انتقائي مع بدائل مناسبة [<small>(مثال)</small>](/docs/testing-recipes.html#mocking-modules).

على Node.js ، يقوم منفذو الاختبارات مثل Jest [بدعم محاكاة الوحدات](https://jestjs.io/docs/en/manual-mocks). يمكنك أيضًا استخدام مكتبات مثل [`mock-require`](https://www.npmjs.com/package/mock-require).

### محاكاة المؤقتات {#mocking-timers}

قد تستخدم المكونات وظائف تستند إلى الوقت مثل `setTimeout` أو` setInterval` أو `Date.now`. في بيئات الاختبار، قد يكون من المفيد الاستغناء عن هذه الوظائف مع البدائل التي تتيح لك "التقدم" يدويًا. هذا شيء عظيم للتأكد من أن اختباراتك تعمل بسرعة! الاختبارات التي تعتمد على العداد ستظل قائمة بالترتيب، ولكن أسرع [<small>(مثال)</small>](/docs/testing-recipes.html#timers). معظم أطر العمل، بما في ذلك [Jest](https://jestjs.io/docs/en/timer-mocks) ، [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) و [lolex](https://github.com/sinonjs/lolex) ، تتيح لك محاكاة العداد في اختباراتك.

في بعض الأحيان، قد لا ترغب في محاكاة العداد. على سبيل المثال، ربما تقوم باختبار رسم متحرك، أو تتفاعل مع نقطة نهاية حساسة للتوقيت (مثل واجهة برمجة التطبيقات من نوع API rate limiter). تتيح لك المكتبات التي بها محاكاه العداد تمكينها وتعطيلها على أساس كل اختبار/مجموعة، بحيث يمكنك اختيار كيفية تشغيل هذه الاختبارات بشكل صريح.

### اختبارات end-to-end {#end-to-end-tests-aka-e2e-tests}

تعد اختبارات end-to-end مفيدة لاختبار سير عمل أطول، خاصةً عندما تكون مهمة لنشاطك التجاري (مثل المدفوعات أو الاشتراكات). بالنسبة لهذه الاختبارات، قد ترغب في اختبار كلٍّ من كيفية عرض المتصفح الحقيقي للتطبيق بأكمله، وجلب البيانات من نقاط الوصول الحقيقية لواجهة برمجة التطبيقات، واستخدام الجلسات (session) وملفات تعريف الارتباط (cookies)، والتنقل بين الروابط المختلفة. قد ترغب أيضًا في تقديم تأكيدات ليس فقط في حالة DOM، ولكن أيضًا على بيانات النسخ الاحتياطي (على سبيل المثال للتحقق من استمرار التحديثات في قاعدة البيانات).

<<<<<<< HEAD
في هذا السيناريو، يمكنك استخدام إطار عمل مثل [Cypress](https://www.cypress.io/) أو مكتبة مثل [puppeteer](https://github.com/GoogleChrome/puppeteer) حتى تتمكن من التنقل و تصفح بين نقاط الوصول والطرق (routes) المتعددة والتأكيد على الآثار الجانبية ليس فقط في المتصفح، ولكن يحتمل أن يكون على الواجهة الخلفية (back-end) أيضًا.
=======
End-to-end tests are useful for testing longer workflows, especially when they're critical to your business (such as payments or signups). For these tests, you'd probably want to test how a real browser renders the whole app, fetches data from the real API endpoints, uses sessions and cookies, navigates between different links. You might also likely want to make assertions not just on the DOM state, but on the backing data as well (e.g. to verify whether the updates have been persisted to the database).

In this scenario, you would use a framework like [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev) or a library like [Puppeteer](https://pptr.dev/) so you can navigate between multiple routes and assert on side effects not just in the browser, but potentially on the backend as well.
>>>>>>> b41b1dc35679c01c3252e7d512ce28c5e100d0a4

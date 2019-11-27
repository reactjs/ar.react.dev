---
id: testing-environments
title: بيئات الاختبار
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

يتناول هذا المستند العوامل التي يمكن أن تؤثر على بيئتك والتوصيات المتعلقة ببعض السيناريوهات.


### منفذي الاختبار {#test-runners}

يتيح لك منفذى الاختبار مثل  [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) كتابة مجموعات اختبار على هيئه JavaScript و تشغيلها كجزء من عملية التطوير الخاصة بك. بالاضافة الى ذلك يتم تشغبل مجموعات الاختبار كجزء من التكامل المستمر.

- Jest متوافق على نطاق واسع مع مشاريع React, و دعم مميزات جديده مثل [الوحدات النمطية ](#moking-modules)و [العداد](#moking-timers) و دعم [`jsdom`](#mocking-a-rendering-surface`). **اذا كنت تستخدم Create React App اذن [Jest موجود بالفعل](https://facebook.github.io/create-react-app/docs/running-tests) مع افتراضات مفيده**.
- المكتبات مثل [mocha](https://mochajs.org/#running-mocha-in-the-browser) تعمل بشكل جيد في بيئات المتصفح الحقيقي ، ويمكن أن تساعد في الاختبارات التي تحتاجها بشكل صريح.
- تُستخدم الاختبارات من طرف إلى طرف لاختبار تدفقات أطول عبر عدة صفحات ، وتتطلب [إعداد مختلف](#end-to-end-tests-aka-e2e-tests).

### محاكاة سطح التصيير {#mocking-a-rendering-surface}

تعمل الاختبارات غالبًا في بيئة دون الوصول إلى سطح التصيير الحقيقي مثل المستعرض. بالنسبة لهذه البيئات ، نوصي بمحاكاة مستعرض باستخدام [`jsdom`](https://github.com/jsdom/jsdom) ، وهو تطبيق متصفح خفيف الوزن يعمل داخل Node.js.

في معظم الحالات ، يتصرف jsdom كالمتصفح العادي ، لكن ليس به ميزات مثل [layout and navigation ](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). لا يزال هذا مفيدًا لمعظم اختبارات المكونات المستندة إلى الويب ، لأنه يعمل بشكل أسرع من الاضطرار إلى بدء تشغيل مستعرض لكل اختبار. يتم تشغيله أيضًا في نفس عملية الاختبارات الخاصة بك ، حتى تتمكن من كتابة التعليمات البرمجية لفحصها وتأكيدها على DOM.

تمامًا كما في المتصفح الحقيقي ، تتيح لنا jsdom تصميم تفاعلات المستخدم ؛ يمكن للاختبارات إرسال الأحداث على عقد DOM ، ثم مراقبة الآثار الجانبية لهذه الإجراءات والتأكيد عليها [<small>(مثال)</small>](/docs/testing-recipes.html#events).


يمكن كتابة جزء كبير من اختبارات واجهة المستخدم باستخدام الإعداد أعلاه: استخدام Jest كمنفذ للاختبار ، يتم تصييره إلى jsdom ، مع تفاعلات المستخدم المحددة كسلسلة من أحداث المتصفح ، مدعومًا بـ `act ()` helper [<small>(مثال)</small>](/docs/testing-recipes.html). على سبيل المثال ، تتم كتابة الكثير من اختبارات React الخاصة مع هذه المجموعة.

إذا كنت تكتب مكتبة تختبر في الغالب السلوك الخاص بالمتصفح ، وتتطلب سلوك المستعرض الأصلي مثل التخطيط أو المدخلات الحقيقية ، يمكنك استخدام إطار عمل مثل [mocha.](https://mochajs.org/)

في بيئة لا يمكنك فيها محاكاة DOM (على سبيل المثال ، اختبار مكونات React Native على Node.js) ، يمكنك استخدام [مساعدي محاكاة الأحداث](https://reactjs.org/docs/test-utils.html#simulate) لمحاكاة التفاعلات مع العناصر. بالتناوب ، يمكنك استخدام "fireEvent" المساعد من [`@ testing-library / react-native`](https://testing-library.com/docs/native-testing-library).

اطارات العمل مثل [Cypress](https://www.cypress.io/) و [puppeteer](https://github.com/GoogleChrome/puppeteer) و [webdriver](https://www.seleniumhq.org/projects / webdriver /) مفيدة لتشغيل [end-to-end test ](#end-to-end-tests-aka-e2e-tests).

### محاكاة الدوال {#mocking-functions}

عند كتابة الاختبارات ، نود أن نحاكى  الكود الخاص بنا الذى لا يحتوى على مكافئ له فى بيئة الاختبار الخاصة بنا (على سبيل المثال التحقق من حالة `navigator.onLin` داخل Node.js). يمكن للاختبارات أيضًا التجسس على بعض الوظائف ، ومراقبة كيفية تفاعل أجزاء أخرى من الاختبار معها. من المفيد عندئذ أن تكون قادرًا على محاكاة هذه الدوال باصدارات سهلة الاستخدام بشكل الانتقائى.

هذا مفيد بشكل خاص لجلب البيانات. من المفضل عادة استخدام البيانات "المزيفة" للاختبارات لتجنب البطء والضعف بسبب جلب نقاط نهاية API الحقيقية [<small>(مثال) </small>](/docs/testing-recipes.html#data-fetching ). هذا يساعد على جعل الاختبارات يمكن التنبؤ بها. المكتبات مثل [Jest](https://jestjs.io/) و [sinon](https://sinonjs.org/)، من بين أمور أخرى ، تدعم محاكاه الدوال. بالنسبة للاختبارات الشاملة ، يمكن أن تكون محاكاة الشبكة أكثر صعوبة ، ولكن قد ترغب أيضًا في اختبار نقاط النهاية الحقيقية لواجهة برمجة التطبيقات فيها.

### محاكاه الوحدات {#mocking-modules}

تحتوي بعض المكونات على تبعيات للوحدات النمطية التي قد لا تعمل بشكل جيد في بيئات الاختبار ، أو ليست ضرورية لاختباراتنا. قد يكون من المفيد الاستغناء عن هذه الوحدات بشكل انتقائي مع بدائل مناسبة [<small>(مثال)</small>](/docs/testing-recipes.html#mocking-modules).

على Node.js ، يقوم منفذى الاختبارات مثل Jest [بدعم محاكاة الوحدات](https://jestjs.io/docs/en/manual-mocks). يمكنك أيضًا استخدام مكتبات مثل [`mock-require`](https://www.npmjs.com/package/mock-require).

### محاكاة العداد {#mocking-timers}

قد تستخدم المكونات وظائف تستند إلى الوقت مثل `setTimeout` أو` setInterval` أو `Date.now`. في بيئات الاختبار ، قد يكون من المفيد الاستغناء عن هذه الوظائف مع البدائل التي تتيح لك "التقدم" يدويًا. هذا شيء عظيم للتأكد من أن اختباراتك تعمل بسرعة! الاختبارات التي تعتمد على العداد ستظل قائمة بالترتيب ، ولكن أسرع [<small>(مثال)</small>](/docs/testing-recipes.html#timers). معظم اطارات العمل ، بما في ذلك [Jest](https://jestjs.io/docs/en/timer-mocks) ، [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) و [lolex](https://github.com/sinonjs/lolex) ، تتيح لك محاكاة العداد في اختباراتك.

في بعض الأحيان ، قد لا ترغب في محاكاة العداد. على سبيل المثال ، ربما تقوم باختبار رسم متحرك ، أو تتفاعل مع نقطة نهاية حساسة للتوقيت (like an API rate limiter). تتيح لك المكتبات التي بها محاكاه العداد تمكينها وتعطيلها على أساس كل اختبار / مجموعة ، بحيث يمكنك اختيار كيفية تشغيل هذه الاختبارات بشكل صريح.

### اختبارات طرف الى طرف {#end-to-end-tests-aka-e2e-tests}

تعد اختبارات طرف الى طرف مفيدة لاختبار سير عمل أطول ، خاصةً عندما تكون مهمة لنشاطك التجاري (مثل المدفوعات أو الاشتراكات). بالنسبة لهذه الاختبارات ، قد ترغب في اختبار كلٍّ من كيفية عرض المتصفح الحقيقي للتطبيق بأكمله ، وجلب البيانات من نقاط النهاية الحقيقية لواجهة برمجة التطبيقات ، واستخدام الجلسات وملفات تعريف الارتباط ، والتنقل بين الروابط المختلفة. قد ترغب أيضًا في تقديم تأكيدات ليس فقط في حالة DOM ، ولكن أيضًا على بيانات النسخ الاحتياطي (على سبيل المثال للتحقق من استمرار التحديثات في قاعدة البيانات).

في هذا السيناريو ، يمكنك استخدام إطار عمل مثل [Cypress](https://www.cypress.io/) أو مكتبة مثل [puppeteer](https://github.com/GoogleChrome/puppeteer) حتى تتمكن من التنقل بين طرق متعددة والتأكيد على الآثار الجانبية ليس فقط في المتصفح ، ولكن يحتمل أن يكون على الواجهة الخلفية أيضًا.

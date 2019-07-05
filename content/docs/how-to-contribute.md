---
id: how-to-contribute
title: دليل المساهمين
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

تعتبر React من أوائل المشاريع مفتوحة المصدر والتي ﻻزالت تحت التطوير المستمر والتي يتم استعمالها في شفرات برمجية للجميع في [facebook.com](https://www.facebook.com). ﻻزلنا مستمرّين في العمل على إصلاح العلل لجعل المُساهمة في هذا المشروع أسهل وأكثر شفافية قدر الإمكان. لم نبلغ ذلك حقّا، لكن نتمنى أن يوضّح هذا المستند مراحل المساهمة ويجيب عن الأسئلة التي يمكن أن تُراودك.

### [القواعد السلوكيّة](https://code.facebook.com/codeofconduct) {#code-of-conduct}

لقد سطّرت Facebook قواعد للسلوك والتي تتطلع أن يحترمها المساهمون في مشاريعها. من فضلك اقرأ [النص الكامل](https://code.fb.com/codeofconduct/) حتى تتفهم أن بعض الأفعال غير مسموح بها.

### التطوير المفتوح {#open-development}

كل العمل على React يحدث عل موقع[GitHub](https://github.com/facebook/react). كل من الفريق الرئيسي والمساهمون الآخرون يساهمون بإرسال طلبات السحب (Pull requests) والتي تدخل نفس مراحل المراجعة.

### تنظيم الفروع (Branch Organization) {#branch-organization}

نحرص على أن يكون [الفرع الرئيسي (`master` branch)](https://github.com/facebook/react/tree/master) في أفضل حالة، بالاختبارات التي تمرّ بنجاح في كل مرّة. لكن حتى نتقدّم بسرعة، سنحدث تغييرات على الواجهة البرمجية (API) والتي ربما ستجعل تطبيقك غير متوافق معها. ننصحك باستعمال [آخر اصدار مستقر من  React](/downloads.html).

من فضلك احرص على أن يكون طلب السحب (pull request) الذي تقوم به نحو الفرع الرئيسي `master`. نُبقي الفروع المستقرّة المختلفة للإصدارات الجذرية لكننا لن نقبل طلبات السحب نحوها مباشرة. بل ننتقي التغييرات التي ﻻ تُحدث تغييرات هدّامة من الفرع الرئيسي إلى آخر اصدار مستقر.

### الإدارة الدلالية لنُسخ البرمجيات {#semantic-versioning}

تتبع React [الإدارة الدلالية لنُسخ البرمجيات](https://semver.org/lang/ar/). نُصدر اصدارات ترقيع (patch versions) عند القيام بإصلاحات للعلل والثغرات، اصدارات صُغرى عند إضافة ميزات ووظائف جديدة، وإصدارات جذرية عند القيام بتغيرات جذرية. عند القيام بتغيير جذري نقوم باستخدام تحذيرات بعدم الصلاحية (deprecation warnings) في الإصدارات الصغرى حتى يعلم مستخدمونا بالتغيرات التي ستطرأ وحتى يرقّوا شفراتهم البرمجية مُسبقا.

كل طلب سحب يحمل وسمًا يحدد ما إذا كان سيذهب إلى [الترقيع (patch)](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch) أو إلى [الإصدار الصغير (minor)](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor) أو [الإصدار الجذري (major)](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major). نُصدر نسخ الترقيع في كلّ أسبوع ونُصدر الإصدارات الصُغرى كل بضعة أشهر وأما الإصدارات الجذرية تكون مرّة أو مرّتين في السنة.

كل تغيير معتبر موثّق في [جدول التغييرات (changelog)](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### العلل (Bugs) {#bugs}

#### أين تجد المشاكل المعروفة {#where-to-find-known-issues}

نستعمل [GitHub Issues](https://github.com/facebook/react/issues) للمشاكل العامّة، نبقى على إطلاع على ذلك ونحاول أن نوضّح الأمر إن كنا بصدد عمل إصلاح داخلي. قبل طرح مهمّة جديدة، حاول أن تتأكد أنه لم يتم طرحها من قبل.

#### التبليغ عن مشكل جديد {#reporting-new-issues}

تقديم حالة اختبارية موجزة هي أفضل طريقة لإصلاح العلّة التي تواجهك. هذا [النموذج على JSFiddle](https://jsfiddle.net/Luktwrdm/) يُعدّ نقطة بداية مهمّة.

#### الثغرات الأمنية {#security-bugs}

لدى Facebook [برنامج مكفآت](https://ar-ar.facebook.com/whitehat/) للتبليغ الآمن عن الثغرات الأمنية. وبالتالي يرجى عدم التطرّق لذلك في العلن في (الـ issues). اذهب لتلك الصفحة واتبع الخطوات الموضحة هناك.

### سُبُل التواصل {#how-to-get-in-touch}

* IRC: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* منتدى المحادثة: [discuss.reactjs.org](https://discuss.reactjs.org/)

هناك كذلك [مجتمع نشيط من مستخدمي React على منصّة Discord للمحادثة](https://www.reactiflux.com/) إذا ما احتجت للمساعدة فيما يتعلّق بـReact.

### اقتراح تغيير {#proposing-a-change}

إن أردت احداث تغيير بالواجهة البرمجية (API)، أو احداث أي تغييرات مُعتَبرة ننصحك [بأن تقدم طلب مُشكلة (issue)](https://github.com/facebook/react/issues/new). هذا يُمكننا من مناقشة اقتراحك قبل أن تستثمر جهدك فيه.

إن كنت تُقدم على إصلاح مشكلة فحسب، ﻻ بأس بإرسال طلب سحب (pull request) مباشرة، لكن من المهم أن تقدم طلب مُشكلة (issue) تُحدّد فيها بالتفصيل ما أنت بصدد إصلاحه. هذا مُهم في حالة ما إذا كنّا ﻻ نقبل ذاك الإصلاح بالتحديد لكن يمكننا الاستمرار في العمل على تلك المُشكلة.

### أول طلب سحب (Pull Request) لك {#your-first-pull-request}

هل تعمل على أول طلب سحب (Pull Request) لك؟ يمكنك أن تتعلّم  كيفية عمل ذلك من سلسلة الفيديوهات المجانيّة التالية:

**[كيف تُساهم في مشروع مفتوح المصدر على Github (How to Contribute to an Open Source Project on GitHub)](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

حتى نساعدك في تَبليل قَدَمَيْك (الإنطلاق لأوّل مرّة) وحتى تَعتاد على نظام المُساهمة الخاص بنا، لدينا قائمة **[ببعض المشاكل السهلة على المبتدئين (good first issues)](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** والتي تحوي عِلَلا ذات نطاق محدود نسبيّا فتعتبَرُ مكانًا جيدا للإنطلاق منه.

إن قررت أن تُصلحَ مُشكلة (issue) قد تم طرحها، من فضلك ألقِ نظرة على النقاش في التعليقات لترى ما إذا كان أحدهم يعمل على إصلاحها. وإن لم يكن أي أحد يعمل عليها في ذلك الحين، الرجاء ترك تعليق بوضّح بأنك تريد العمل عليها حتى ﻻ يكرر الآخرون مَجهوداتك.

إن اقرّ أحدهم بأن هناك مشكلة ولم يعقّب على ذلك لأكثر من أسبوعين، ﻻ بأس أن تتناولها أنت لكن يجب عليك أن تَترُك تعليقًا على كلّ حال.

### إرسال طلب سحب (Pull Request) {#sending-a-pull-request}

يراقب الفريق الرئيسي طلبات السحب (pull requests). سنقوم بمراجعة طلب السحب الخاص بك وبعدها يمكنن أن ندمجه أو نطلب من أن تُحدث تغييرات به، أو يمكن أن نغلقه مع شرح الأسباب. أما التغيّرات التي تمسّ الواجهة البرمجية (API) قد تتطلب منا إحداث تغييرات وإصلاحات في استخدماتنا الداخلية في Facebook.com، والتي قد تُسبب تأخرًا. سنبذل قصارى جهدنا في تقديم التحديثات والنتائج المحصلّة خلال العمليّة.

**قبل تسجيل طلب السحب،** الرجاء التحقق من إتمام ما يلي:

1. قم باستنساخ المستودع [المستودع](https://github.com/facebook/react) (بعمل Fork) وبعدها أنشأ الفرع الخاص بك من الفرع الرئيسي `master`
2. نفّذ الأمل `yarn` في مجلّد المستودع.
3. إن أصلحت علّة أو أضفت شيفرة برمجية والتي تحتاج إلى اختبار، أضف الإختبارات.
4. تأكّد من نجاح سلسلة الإختبارات (`yarn test`). نصيحة: `yarn test --watch TestName` مفيدة أثناء التطوير.
5. نفّذ الأمر `yarn test-prod` للإختبار في وضع الإنتاج. الأمر يقبل نفس الخيارات (options) المتوفّرة مع الأمر `yarn test`.
6. إن كنت تحتاج مُنقّحًا، نفّذ `yarn debug-test --watch TestName`، وافتح `chrome://inspect`، ثمّ اضغط على تفحّص(Inspect).
7. نظّم شيفرتك البرمجية مع [prettier](https://github.com/prettier/prettier) بالأمر (`yarn prettier`).
8. تأكّد من أن شيفرتك البرمجية متناسقة بالأمر (`yarn lint`). نصيحة: `yarn linc` للتحقق فقط من الملفّات المُتَغيّرة.
9. نفّذ [Flow](https://flowtype.org/) للتحقق من الأصناف (typechecks) بالأمر (`yarn flow`).
10. راجع اتفاقية ترخيص المساهم (CLA)، إن لم تقم بذلك بعد.

### اتفاقية ترخيص المساهم (CLA) {#contributor-license-agreement-cla}

حتى يتمّ قبول طلب السحب الخاص بك، يجب عليك أولا أن تقوم بتسجيل إتفاقية ترخيص المساهم (CLA). عليك أن تفعل ذلك مرّة واحدة فحسب، لذا لو أردت المشاركة في أحد المشاريع مفتوحة المصدر من Facebook، فستكون جاهزا للإنطلاق. إن كنت تقوم بتسجيل طلب سحب للمرّة الأولى، أخبرنا بأنك أكملت مراجعة الإتفاقية (CLA) وعندها يمكننا أن نتحقق من ذلك باسم المستخدم الخاص بك على Github.

**[أكمل الـCLA الخاصّة بك من هنا](https://code.facebook.com/cla)**

### مُتطلّبات للمساهمة {#contribution-prerequisites}

* You have [Node](https://nodejs.org) installed at v8.0.0+ and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* لديك [Node](https://nodejs.org) مثبّت بنسخته الـv8.0.0+ و [Yarn](https://yarnpkg.com/en/) بالنسخة v1.2.0+.
* لديك `gcc` مُثبّت أو أنت مُعتاد على تثبيت المُتَرجمات (compilers) إذا ما احتجتها. بعض الإعتماديات (dependencies) تحتاج إلى مرحلة تَرجَمة (compilation step). في نظام OS X, طرفية Xcode (Xcode Command Line Tools) ستتكفّل بذلك، على Ubuntu، أمر `apt-get install build-essential` سيثبّت الحزم المطلوبة، أوامر مشابة يمكن أن تشتغل على توزعات لينُكس الأخرى. نظام ويندوز (Windows) سيتطلّب مراحل إضافية، راجع [إرشادات تثبيت `node-gyp`](https://github.com/nodejs/node-gyp#installation) لمزيد من التفاصيل.
* أنت مُعتاد على Git.

### آليّة التطوير {#development-workflow}

بعد استنساخ مشروع React على جهازك، نفّذ الأمر `yarn` لتحميل كل إعتماديّاته.
بعدها يمكنك تنفيذ بعض الأوامر:

* `yarn lint` للتحقق من تنسيق الشيفرة البرمجية.
* `yarn linc` مثل `yarn lint` لكن أسرع ﻷنه يتحقق من الملفّات التي تغيّرت فحسب.
* `yarn test` يشغّل كل سلسلة الإختبارات.
* `yarn test --watch` يشغّل مُراقب الإختبارات التفاعلي (interactive tests watcher).
* `yarn test <نمط(pattern)>` يشغلّ الإختبارات التي الموافقة لاسم الملف.
* `yarn test-prod` runs tests in the production environment. It supports all the same options as `yarn test`.
* `yarn debug-test` is just like `yarn test` but with a debugger. Open `chrome://inspect` and press "Inspect".
* `yarn flow` runs the [Flow](https://flowtype.org/) typechecks.
* `yarn build` creates a `build` folder with all the packages.
* `yarn build react/index,react-dom/index --type=UMD` creates UMD builds of just React and ReactDOM.

We recommend running `yarn test` (or its variations above) to make sure you don't introduce any regressions as you work on your change. However it can be handy to try your build of React in a real project.

First, run `yarn build`. This will produce pre-built bundles in `build` folder, as well as prepare npm packages inside `build/packages`.

The easiest way to try your changes is to run `yarn build react/index,react-dom/index --type=UMD` and then open `fixtures/packaging/babel-standalone/dev.html`. This file already uses `react.development.js` from the `build` folder so it will pick up your changes.

If you want to try your changes in your existing React project, you may copy `build/dist/react.development.js`, `build/dist/react-dom.development.js`, or any other build products into your app and use them instead of the stable version. If your project uses React from npm, you may delete `react` and `react-dom` in its dependencies and use `yarn link` to point them to your local `build` folder:

```sh
cd ~/path_to_your_react_clone/build/node_modules/react
yarn link
cd ~/path_to_your_react_clone/build/node_modules/react-dom
yarn link
cd /path/to/your/project
yarn link react react-dom
```

Every time you run `yarn build` in the React folder, the updated versions will appear in your project's `node_modules`. You can then rebuild your project to try your changes.

We still require that your pull request contains unit tests for any new functionality. This way we can ensure that we don't break your code in the future.

### Style Guide {#style-guide}

We use an automatic code formatter called [Prettier](https://prettier.io/).
Run `yarn prettier` after making any changes to the code.

Then, our linter will catch most issues that may exist in your code.
You can check the status of your code styling by simply running `yarn linc`.

However, there are still some styles that the linter cannot pick up. If you are unsure about something, looking at [Airbnb's Style Guide](https://github.com/airbnb/javascript) will guide you in the right direction.

### Introductory Video {#introductory-video}

You may be interested in watching [this short video](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 mins) which gives an introduction on how to contribute to React.

#### Video highlights: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Building and testing React locally
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Creating and sending pull requests
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Organizing code
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - React npm registry
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Adding new React features

For a realistic overview of what it _feels_ like to contribute to React for the first time, check out [this entertaining ReactNYC talk](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Request for Comments (RFC) {#request-for-comments-rfc}

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes though are "substantial", and we ask that these be put through a bit of a design process and produce a consensus among the React core team.

The "RFC" (request for comments) process is intended to provide a consistent and controlled path for new features to enter the project. You can contribute by visiting the [rfcs repository](https://github.com/reactjs/rfcs).

### License {#license}

By contributing to React, you agree that your contributions will be licensed under its MIT license.

### What Next? {#what-next}

Read the [next section](/docs/codebase-overview.html) to learn how the codebase is organized.

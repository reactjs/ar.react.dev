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

If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend [filing an issue](https://github.com/facebook/react/issues/new). This lets us reach an agreement on your proposal before you put significant effort into it.

If you're only fixing a bug, it's fine to submit a pull request right away but we still recommend to file an issue detailing what you're fixing. This is helpful in case we don't accept that specific fix but want to keep track of the issue.

### Your First Pull Request {#your-first-pull-request}

Working on your first Pull Request? You can learn how from this free video series:

**[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

To help you get your feet wet and get you familiar with our contribution process, we have a list of **[good first issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than two weeks, it's fine to take it over but you should still leave a comment.

### Sending a Pull Request {#sending-a-pull-request}

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. For API changes we may need to fix our internal uses at Facebook.com, which could cause some delay. We'll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request,** please make sure the following is done:

1. Fork [the repository](https://github.com/facebook/react) and create your branch from `master`.
2. Run `yarn` in the repository root.
3. If you've fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`yarn test`). Tip: `yarn test --watch TestName` is helpful in development.
5. Run `yarn test-prod` to test in the production environment. It supports the same options as `yarn test`.
6. If you need a debugger, run `yarn debug-test --watch TestName`, open `chrome://inspect`, and press "Inspect".
7. Format your code with [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Make sure your code lints (`yarn lint`). Tip: `yarn linc` to only check changed files.
9. Run the [Flow](https://flowtype.org/) typechecks (`yarn flow`).
10. If you haven't already, complete the CLA.

### Contributor License Agreement (CLA) {#contributor-license-agreement-cla}

In order to accept your pull request, we need you to submit a CLA. You only need to do this once, so if you've done this for another Facebook open source project, you're good to go. If you are submitting a pull request for the first time, just let us know that you have completed the CLA and we can cross-check with your GitHub username.

**[Complete your CLA here.](https://code.facebook.com/cla)**

### Contribution Prerequisites {#contribution-prerequisites}

* You have [Node](https://nodejs.org) installed at v8.0.0+ and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* You have `gcc` installed or are comfortable installing a compiler if needed. Some of our dependencies may require a compilation step. On OS X, the Xcode Command Line Tools will cover this. On Ubuntu, `apt-get install build-essential` will install the required packages. Similar commands should work on other Linux distros. Windows will require some additional steps, see the [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) for details.
* You are familiar with Git.

### Development Workflow {#development-workflow}

After cloning React, run `yarn` to fetch its dependencies.
Then, you can run several commands:

* `yarn lint` checks the code style.
* `yarn linc` is like `yarn lint` but faster because it only checks files that differ in your branch.
* `yarn test` runs the complete test suite.
* `yarn test --watch` runs an interactive test watcher.
* `yarn test <pattern>` runs tests with matching filenames.
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

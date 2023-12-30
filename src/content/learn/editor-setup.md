---
title: تجهيز محرر الأكواد
---

<Intro>

يمكن للمحرر المجهز بشكل صحيح أن يجعل الكود أكثر وضوحًا للقراءة وأسرع في الكتابة، ويمكن أن يساعد حتى في اكتشاف الأخطاء البرمجية أثناء الكتابة! إذا كانت هذه هي المرة الأولى التي تقوم فيها بإعداد محرر أو إذا كنت تبحث عن تحسين محررك الحالي، فلدينا بعض التوصيات.

</Intro>

<YouWillLearn>

* ما هي المحررات الأكثر شيوعًا
* كيفية تنسيق الكود تلقائيًا

</YouWillLearn>

## محررك {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) هو أحد المحررات الأكثر استخدامًا اليوم. لديه معرض كبير من الإضافات، ويتكامل بشكل جيد مع الخدمات الشائعة مثل GitHub. يمكن إضافة معظم الميزات المدرجة فيه إلى VS Code كإضافات أيضًا، مما يجعله قابلًا للتكوين بشكل كبير!

محررات النصوص الشائعة الأخرى المستخدمة في مجتمع React تشمل:

* [WebStorm](https://www.jetbrains.com/webstorm/) هو بيئة تطوير متكاملة مصممة خصيصًا لـ JavaScript.
* [Sublime Text](https://www.sublimetext.com/) لديه دعم لـ JSX و TypeScript، [تمييز الصيغة](https://stackoverflow.com/a/70960574/458193) وإكمال تلقائي مدمج.
* [Vim](https://www.vim.org/) هو محرر نصوص قابل للتكوين بشكل كبير مصمم لجعل إنشاء وتغيير أي نوع من النصوص فعالًا للغاية. وهو مدرج كـ "vi" مع معظم أنظمة UNIX ومع Apple OS X.

## ميزات محرر النصوص الموصى بها {/*recommended-text-editor-features*/}

قد تأتي بعض المحررات مع هذه الميزات مدمجة، ولكن قد تتطلب المحررات الأخرى تثبيت إضافةٍ. تحقق من الدعم الذي يوفره محررك المفضل لديك للتأكد!

### الفحص {/*linting*/}

فحص الكود لاكتشاف الأخطاء في الكود أثناء الكتابة، مما يساعدك على إصلاحها في وقت مبكر. 
[ESLint](https://eslint.org/) هو فاحص شائع ومفتوح المصدر لـ JavaScript.

* [قم بتثبيت ESLint مع التكوين الموصى به لـ React](https://www.npmjs.com/package/eslint-config-react-app) (تأكد من تثبيت [Node!](https://nodejs.org/en/download/current/))
* [دمج ESLint في VSCode مع الإضافة الرسمية](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**تأكد من تمكين جميع قواعد [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) لمشروعك.** إنها ضرورية وتكشف أكثر الأخطاء خطورة في وقت مبكر. يتضمن التكوين الموصى به [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) بالفعل هذه القواعد.

### التنسيق {/*formatting*/}

آخر شيء تريد القيام به عند مشاركة الكود مع مساهم آخر هو الدخول في مناقشة حول [التباعد بالمسافة الكبيرة tab أم التباعد بالمسافة space](https://www.google.com/search?q=tabs+vs+spaces)! لحسن الحظ، سيقوم [Prettier](https://prettier.io/) بتنظيف الكود الخاص بك عن طريق إعادة تنسيقه ليتوافق مع قواعد مسبقة وقابلة للتكوين. قم بتشغيل Prettier، وسيتم تحويل جميع علامات التبويب إلى مسافات - وسيتم تغيير المسافة البادئة والاقتباسات وما إلى ذلك أيضًا ليتوافق مع التكوين. في الإعداد المثالي، سيتم تشغيل Prettier عند حفظ الملف، مما يجعل هذه التعديلات بسرعة بالنسبة لك.

يمكنك تثبيت [إضافة Prettier في VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) عن طريق اتباع هذه الخطوات:

1. قم بتشغيل VS Code
2. استخدم البحث السريع (اضغط على Ctrl/Cmd+P)
3. الصق `ext install esbenp.prettier-vscode`
4. اضغط على Enter

#### التنسيق عند الحفظ {/*formatting-on-save*/}

في الواقع، يجب عليك تنسيق الكود في كل مرة تقوم فيها بحفظه. يحتوي VS Code على إعدادات لهذا الغرض!

1. في VS Code، اضغط على `CTRL/CMD + SHIFT + P`.
2. اكتب "settings"
3. اضغط على Enter
4. في شريط البحث، اكتب "format on save"
5. تأكد من تحديد خيار "format on save"!

> إذا كانت لديك قواعد تنسيق في إعدادات ESLint، فقد تتعارض مع Prettier. نوصي بتعطيل جميع قواعد التنسيق في إعدادات ESLint الخاصة بك باستخدام [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) بحيث يتم استخدام ESLint *فقط* للكشف عن الأخطاء المنطقية. إذا كنت ترغب في فرض تنسيق الملفات قبل دمج طلب سحب (Pull Request)، استخدم [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) للتكامل المستمر.

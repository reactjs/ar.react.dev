---
id: static-type-checking
title: التحقّق من الأنواع الثابتة
permalink: docs/static-type-checking.html
prev: typechecking-with-proptypes.html
next: refs-and-the-dom.html
---

تتعرّف أدوات التحقّق من الأنواع الثابتة (Static type checkers، والمقصود بها التحقّق من الأنواع في زمن التصريف compile-time حيث لا يُسمَح بتغيير أنواع المتغيّرات في زمن التنفيذ) مثل Flow و TypeScript على بعض أنواع المشاكل قبل تنفيذ الشيفرة، وتُحسِّن سير عمل المُطوِّر عن طريق إضافة ميّزات مثل الإكمال التلقائي. نُوصي لهذا السّبب باستخدام [Flow](https://flow.org/) أو [TypeScript](https://www.typescriptlang.org/) بدلًأ من `PropTypes` للشيفرات الكبيرة.

## Flow {#flow}

تُعدُّ [Flow](https://flow.org/) أداة تحقّق من الأنواع الثابتة لشيفرة JavaScript، وهي مُطوِّرة من قبل Facebook وتُستخدَم عادةً مع React. تسمح لك هذه الأداة بتوصيف المتغيّرات والدوال ومُكوِّنات React عن طريق صياغة خاصّة للأنواع، كما تسمح باكتشاف الأخطاء باكرًا. بإمكانك قراءة [هذه المقدّمة إلى Flow](https://flow.org/en/docs/getting-started/) وتعلّم مبادئها.

تحتاج لاستخدام Flow إلى ما يلي:

* إضافة Flow إلى مشروعك كاعتماديّة (dependency).
* التأكّد من إزالة صياغة Flow من الشيفرة المُصرَّفة.
* إضافة توصيفات الأنواع (type annotations) لتشغيل Flow والتحقّق من هذه الأنواع.

سنشرح هذه الخطوات بالتفصيل الآن.

### إضافة Flow إلى مشروعك {#adding-flow-to-a-project}

انتقل أولًا إلى مجلّد مشروعك باستخدام واجهة سطر الأوامر، ستحتاج إلى تنفيذ الأوامر التالية:

إن كنتَ تستخدم [Yarn](https://yarnpkg.com/) فاكتب ما يلي:

```bash
yarn add --dev flow-bin
```

إن كنتَ تستخدم [npm](https://www.npmjs.com/) فاكتب ما يلي:

```bash
npm install --save-dev flow-bin
```

يُثبِّت هذا الأمر الإصدار الأخير من Flow في مشروعك.

أضف الآن `flow` إلى القسم `"scripts"` من ملف `package.json` لتتمكّن من استخدام هذا الأمر من خلال واجهة سطر الأوامر:


```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```
وأخيرًا نفِّذ أحد الأوامر التالية: 

إن كنتَ تستخدم [Yarn](https://yarnpkg.com/) فاكتب ما يلي:

```bash
yarn run flow init
```

إن كنتَ تستخدم [npm](https://www.npmjs.com/) فاكتب ما يلي:

```bash
npm run flow init
```

سيُنشِئ هذا الأمر ملف إعدادت Flow.

### إزالة صياغة Flow من الشيفرة المصرفة {#stripping-flow-syntax-from-the-compiled-code}

تُمِد Flow لغة JavaScript بصياغة خاصّة لتوصيف الأنواع، ولكن على الرغم من ذلك لا تكون المتصفّحات على دراية بهذه الصياغة، لذلك نحتاج إلى التأكّد من ألّا تنتهي هذه الصياغة ضمن حزمة JavaScript المُصرفة المُرسلَة إلى المتصفّح.

تعتمد الطريقة الصحيحة لفعل ذلك على الأدوات التي تستخدمها لتصريف شيفرة JavaScript.

#### إنشاء تطبيق React {#create-react-app}

إن أعددتَ مشروعك باستخدام الأمر [Create React App](https://github.com/facebookincubator/create-react-app) فستُزال توصيفات Flow افتراضيًّا لذا لن تحتاج لفعل أي شيء في هذه الخطوة.

#### Babel {#babel}

>ملاحظة:
>
>هذه التعليمات ليست للمستخدمين الذين يبنون مشروعهم باستخدام الأمر create-react-app، حتى ولو كان هذا الأمر يستخدم Babel ضمنيًّا،  فهو مُعَد لفهم Flow مُسبقًا. اتبع هذه الخطوات فقط في حالة لم تكن تستخدم الأمر create-react-app.

إن أعددت Babel يدويًّا لمشروعك فستحتاج إلى تثبيت إعداد مُسبَق خاص من أجل Flow.

إن كنتَ تستخدم Yarn فاكتب ما يلي:

```bash
yarn add --dev babel-preset-flow
```

إن كنتَ تستخدم npm فاكتب ما يلي:

```bash
npm install --save-dev babel-preset-flow
```

أضف الآن إعداد `flow` إلى [إعدادات Babel](https://babeljs.io/docs/usage/babelrc/). فإن أعددتَ Babel باستخدام الملف `.babelrc` فسيبدو كما يلي:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

سيسمح لك ذلك باستخدام صياغة Flow في شيفرتك.

>ملاحظة:
>
>لا تتطلّب Flow وجود الإعداد المُسبَق `react`، ولكنّهما عادةً يُستخدمَان معًا. تفهم Flow بحدّ ذاتها صياغة JSX.


#### إعدادات البناء الأخرى {#other-build-setups}

إن لم تكن تستخدم الأمر Create React App أو Babel فبإمكانك استعمال [flow-remove-types](https://github.com/flowtype/flow-remove-types) لإزالة توصيفات الأنواع.

### تشغيل Flow {#running-flow}

إن اتبعتَ التعليمات السّابقة فينبغي أن تكون قادرًا على تشغيل Flow للمرّة الأولى:

```bash
yarn flow
```

وإن كنتَ تستخدم npm فاكتب ما يلي:

```bash
npm run flow
```

يجب أن تظهر لك رسالة كما يلي:

```
No errors!
✨  Done in 0.17s.
```

### إضافة توصيفات أنواع Flow {#adding-flow-type-annotations}

تتحقّق Flow افتراضيًّا فقط من الملفّات التي تحتوي على علامة التوصيف هذه:

```js
// @flow
```

يجب وضعها في بداية الملف. جرّب إضافة بعض الملفات إلى مشروعك وتنفيذ الأمر `yarn flow` أو `npm run flow` لترى إن وجدت Flow أيّة مشاكل.

هنالك أيضًا [خيار](https://flow.org/en/docs/config/options/#toc-all-boolean) لإجبار Flow على التحقّق من كل الملفّات بغض النظر عن علامة التوصيف السابقة الموجودة في بداية الملف. قد يكون هذا مُزعجًا للمشاريع الموجودة حاليًّا ولكنّه خيار منطقي للمشاريع الجديدة.

الآن بعد أن انتهينا من إعداد كل شيء نُوصي بالاطلاع على هذه المصادر لتعلّم المزيد حول Flow:

* [توثيق Flow: توصيفات الأنواع](https://flow.org/en/docs/types/)
* [توثيق Flow: المُحرِّرات](https://flow.org/en/docs/editors/)
* [توثيق Flow: استخدام Flow مع React](https://flow.org/en/docs/react/)
* [التحقّق من الأخطاء في Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

إنّ [TypeScript](https://www.typescriptlang.org/) هي لغة برمجة مُطوَّرة من قبل Microsoft. وهي مجموعة عُليا من JavaScript تتضمّن مُصرِّف خاص بها. ولكونها لغةً ثابتة الأنواع فهي قادرة على اكتشاف الأخطاء في زمن البناء قبل أن يُصبِح تطبيقك مُتاحًا للعامّة بفترة طويلة. بإمكانك معرفة المزيد حول استخدام TypeScript مع React من [هنا](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

لاستخدام TypeScript تحتاج إلى ما يلي:
* إضافة TypeScript كاعتماديّة (dependency) في مشروعك.
* إعداد خيارات مُصرِّف TypeScript.
* استخدام الامتداد الصحيح للملفّات.
* إضافة تعريفات للمكتبات التي تستخدمها.

فلنتعرّف بشكل مفصّل إلى هذه المتطلّبات.

### استخدام TypeScript مع الأمر Create React App {#using-typescript-with-create-react-app}

لكتابة **مشروع جديد**  بإستخدام TypeScript, فاكتب ما يلي:

```bash
npx create-react-app my-app --typescript
```

يمكنك أيضا إضافة TypeScript لمشروعك الذي تم بنائه سابقا بإستخدام Create React App التوثيق من خلال [هنا](https://facebook.github.io/create-react-app/docs/adding-typescript)


>ملاحظة:
>
> ان كنت تعتمد على أمر create-react-app في بناء تطبقاتك, يمكنك تجاوز ما تبقى من الصفحة لأننا نقوم بشرح الإعدادات اليدوية للبناء.

### إضافة TypeScript إلى مشروعك {#adding-typescript-to-a-project}
تُضاف TypeScript إلى مشروعك باستخدام أمر واحد.

إن كنتَ تستخدم [Yarn](https://yarnpkg.com/) فاكتب ما يلي:

```bash
yarn add --dev typescript
```

إن كنتَ تستخدم [npm](https://www.npmjs.com/) فاكتب ما يلي:

```bash
npm install --save-dev typescript
```
مبروك!بهذا يكون لديك آخر إصدار من TypeScript في مشروعك. يُتيح لك تثبيت TypeScript الوصول إلى الأمر `tsc`. قبل الإعداد فلنُضِف هذا الأمر إلى قسم "scripts" في ملف  `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### إعداد مصرف TypeScript {#configuring-the-typescript-compiler}
لن يُفيدنا المُصرِّف (Compiler) ما لم نُخبره ماذا سيفعل. تُعرَّف هذه القواعد في TypeScript عن طريق ملف خاص يُدعى `tsconfig.json`. لتوليد هذا الملف نفّذ الأمر التالي:

إن كنتَ تستخدم [Yarn](https://yarnpkg.com/) فاكتب ما يلي:

```bash
yarn run tsc --init
```

إن كنتَ تستخدم [npm](https://www.npmjs.com/) فاكتب ما يلي:

```bash
npx tsc --init
```

بإمكانك أن ترى الآن العديد من الخيارات في هذا الملف والتي تستخدم لإعداد المُصرِّف. للحصول على شرح مفصّل عن كل الخيارات انتقل إلى هذه [الصفحة](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

سنتحدّث من بين هذه الخيارات عن `rootDir` و `outDir`. ففي الواقع يأخذ المُصرِّف ملفّات typescript ويولِّد من خلالها ملفّات JavaScript، ولكن لا نرغب بان تختلط تلك الملفّات الناتجة مع ملفّاتنا المصدرية.

سنحل هذه المشكلة بخطوتين:
* فلنُرتِّب أولًا بنية مشروعنا كالتالي، حيث سنضع كافّة ملفّات شيفرتنا المصدرية في المجلّد `src`:

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* بعد ذلك نُخبِر المُصرِّف أين تقع ملفّات شيفرتنا المصدريّة وأين ينبغي أن يضع الملفّات الناتجة:

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

رائع! عندما نُنفِّذ الآن أوامر البناء سيضع المُصرِّف ملفّات JavaScript الناتجة في المجلّد `build`. بإمكانك تحميل ملف الإعدادات [`tsconfig.json`](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) بشكلٍ جاهز للبدء والتعامل مع React حيث يحتوي على مجموعة جيدة من القواعد للبدء.

لا ترغب بشكلٍ عام أن تحتفظ بملفّات JavaScript الناتجة مع الملفّات المصدريّة لذا احرص على إضافة المجلّد build إلى الملف `.gitignore`.

### امتدادات الملفات {#file-extensions}

تكتب عادةً مُكوِّناتك في React باستخدام ملفّات ذات الامتداد ‎.js، أمّا في TypeScript فلدينا امتدادان للملفّات، الأول هو ‎.ts وهو الامتداد الافتراضي، والثاني ‎.tsx وهو امتداد خاص يُستخدَم للملفّات التي تحتوي على صياغة JSX.

### تشغيل TypeScript {#running-typescript}

إن اتبعتَ التعليمات السّابقة فستكون قادرًا على تشغيل TypeScript للمرّة الأولى:

```bash
yarn build
```

إن كنتَ تستخدم npm فاكتب ما يلي:

```bash
npm run build
```

إن لم يظهر لديك أي ناتج فهذا يعني أنّك أتممت الخطوات بنجاح.



### تعريفات الأنواع {#type-definitions}
يعتمد المُصرِّف على ملفات التعريف لإظهار الأخطاء والتلميحات من الحزم الأخرى. يُزوِّدنا ملف التعريف بمعلومات الأنواع لمكتبة ما. يُمِكّننا ذلك من استخدام مكتبات JavaScript في مشروعنا كتلك التي نحصل عليها من npm.

هناك طريقتان أساسيتان للحصول على تعريفات المكتبة:

- __Bundled__ **( مُضمَّنة مع المكتبة ) :**  حيث تُضمِّن المكتبة ملف تعريفاتها الخاص. وهو أمرٌ جيّد لنا لأنّ كل ما يجب فعله هو تثبيت المكتبة ومن ثمّ يُمكننا استخدامها فورًا. لتعرف إن كانت المكتبة تُضمِّن تعاريف الأنواع ابحث عن الملف `index.d.ts` في المشروع. تمتلك بعض المكتبات هذا الملف مُحدّدًا ضمن الملف `package.json` في القسم `typings` أو `types`.

- **عن طريق [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped):** وهو مستودع كبير لتعريفات المكتبات التي لا تُضمِّن ملف تعريفات. تُدار هذه التعريفات من قبل Microsoft ومُساهمين يُقدّمون تعريفات مفتوحة المصدر. فمثلًا لا تُضمِّن React ملف تعريفات لها ونحصل عليه بدلًا من ذلك عن طريق DefinitelyTyped. لفعل ذلك نفّذ الأمر التالي:
- 
```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```
- **التعريفات المحلية:** قد لا تُضمِّن بعض الحزم تعريفاتها ولا نجد لها تعريفًا في مستودع DefinitelyTyped. في تلك الحالة بإمكاننا الحصول على ملف تعريفات محلي. لفعل ذلك أنشئ الملف `declarations.d.ts` في المجلد الجذر الخاص بالملفات المصدرية. يبدو التعريف البسيط كما يلي:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

أصبحتَ الآن جاهزًا لكتابة الشيفرة. نُوصي بالاطلاع على المصادر التالية لتعلم المزيد حول TypeScript:

* [توثيق TypeScript: الأنواع الأساسية](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [توثيق TypeScript: الانتقال من JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [توثيق TypeScript: استخدام React مع Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

لا تُعتبر [Reason](https://reasonml.github.io/) لغة جديدة، بل هي صياغة جديدة وسلسلة أدوات مدعومة من قبل لغة [OCaml](https://ocaml.org/). تعطي Reason لغة OCaml صياغة مألوفة موجهة لمبرمجي JavaScript مع دعم npm و Yarn.

تُطوَّر Reason من قبل Facebook وتُستخدَم في بعض منتجاتها مثل Messenger. تُعتَبر هذه الصياغة تجريبية نوعًا ما ولكن لها [ارتباطات قوية مع React](https://reasonml.github.io/reason-react/) ومدعومة من قبل Facebook و[مجتمع كبير على github](https://reasonml.github.io/docs/en/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) هي لغة برمجة ثابتة الأنواع (statically typed أي لا تسمح بتغيير أنواع المتغيرات في زمن التنفيذ) مُطوَّرة من قبل JetBrains. تتضمّن المنصات الموجهة لها نظام الأندرويد، وبيئة JVM، و LLVM، و [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html).

تُطوِّر JetBrains أدوات عديدة مُخصّصة لمجتمع React، منها [React bindings](https://github.com/JetBrains/kotlin-wrappers) و [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). تُساعِدك هذه الأداة الأخيرة على بناء تطبيقات React باستخدام Kotlin بدون الحاجة لإعدادات.

## Other Languages {#other-languages}

هنالك بعض لغات البرمجة الأخرى ثابتة الأنواع التي تُصرَّف شيفرتها إلى JavaScript ولذلك هي متوافقة مع React، نجد منها [F#/Fable](https://fable.io/) مع [elmish-react](https://elmish.github.io/react). اطّلع على مواقع هذه اللغات للمزيد من المعلومات وأخبرنا عن أي لغات أخرى ثابتة الأنواع متوافقة مع React لإضافتها لهذه الصفحة.


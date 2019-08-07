---
id: optimizing-performance
title: تحسين الأداء
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

تستخدم React العديد من التقنيّات الذكية داخليًا للتقليل من عدد عمليات DOM المكلفة المطلوبة لتحديث واجهة المستخدم. يؤدي استعمال React إلى الحصول على واجهات مستخدم سريعة دون الحاجة إلى القيام بعمل كبير من أجل تحسين الأداء. بالرغم من ذلك يوجد العديد من الطرق لتسريع تطبيق React الخاص بك

## استخدام نسخة الإنتاج {#use-the-production-build}

إذا كنت تقيّم أو تواجه مشاكل في الأداء في تطبيقات React الخاصة بك، تأكد من أنك تختبر باستخدام نسخة الإنتاج المصغّرة من React.

توفّر React بشكل افتراضي العطيط من رسائل التحذير المفيدة أثناء التطوير. ولكنّها تجعل من React أكبر حجما وأبطأ، عليك أن تتأكد من استخدامك لاصدار الإنتاج عند توزيع التطبيق.

إن لم تكن مُتأكدًا من أن عمليّة بناء التطبيق معُدًّة بشكل صحيح، يُمكنك أن تتحقق بتثبيت أداة [أداة تطوير React لمُتصفّح Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). إن تَزُر موقعا موقعًا مبنيًّا باستخدام React في وضع الإنتاج، فسيكون للأيقونة خلفية ذاة لون داكن.

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="أداة تطوير React في موقع يستعمل React في وضع الإنتاج.">

أمّا إن زُرتَ موقعًا مبنيًّا باستخدام React في وضع التطوير، فسيكون لأيقونة هذه الأداة خلفية حمراء: 

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="أداة تطوير React في موقع يستعمل React في وضع التطوير">

من المُفترض أن تستخدم وضع التطوير أثناء عملك على تطبيقك، ووضع الإنتاج عند توزيع التطبيق للمتسخدمين.

يمكنك أن تجد فيما يلي التعليمات لبناء تطبيقك لوضع الإنتاج.

### Create React App {#create-react-app}

إذا كان مشروعة مبنية باستخدام [Create React App](https://github.com/facebookincubator/create-react-app), نفّذ:

```
npm run build
```

سينشئ هذا الأمر نسخة الإنتاج من تطبيقك في مجلّد  `build/` من مشروعك.

تذكّر أن هذا ضروري قبل نشر تطبيقك للإنتاج. أما بالنسبة للتطوير العادي استخدم الأمر `npm start`.

### النسخ المبنية المكوّنة من ملف واحد (Single-File Builds) {#single-file-builds}

 نُوفِّر إصدارات جاهزة للإنتاج من React و React DOM كملف واحد فقط:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

تذكّر أنّ ملفّات React التي تنتهي باللاحقة `.production.min.js` هي فقط المُلائِمة للإنتاج.

### Brunch {#brunch}

للحصول على النسخة الأكثر كفاءةً للإنتاج من أجل Brunch، ثبِّت الإضافة [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# إن كنت تستخدم npm
npm install --save-dev terser-brunch

#إن كنت تستخدم Yarn
yarn add --dev terser-brunch
```

ولإنشاء نسخة للإنتاج بعد ذلك، أضف العَلَم `-p` لأمر البناء `build`:

```
brunch build -p
```

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تمرير العَلَم ‎`-p` أو تطبيق هذه الإضافة أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ. 

### Browserify {#browserify}

 للحصول على النسخة الأكثر كفاءةً للإنتاج من أجل Browserify، ثبِّت بعض الإضافات:

```
# إن كنت تستخدم npm
npm install --save-dev envify terser uglifyify 

# إن كنت تستخدم Yarn
yarn add --dev envify terser uglifyify 
```

لإنشاء نُسخة للإنتاج، تأكَّد من أن تُضيف هذه المٌحَوّلات **(الترتيب مهم)**:

* يضمن المُحَوّل [`envify`](https://github.com/hughsk/envify) عيين البيئة الصحيحة للبناء. اجعله عامًّا عن طريق العَلَم (‎`-g`).
* يُزيل المُحَوّل [`uglifyify`](https://github.com/hughsk/uglifyify) استيرادات التطوير، اجعله عامًّا أيضًا (`-g`).
* وأخيرًا نُمرِّر الحزمة الناتجة إلى الأمر [`terser`](https://github.com/terser-js/terser) ([تعرف على السبب من هنا](https://github.com/hughsk/uglifyify#motivationusage)).

على سبيل المثال:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

>**ملاحظة:**
>
>اسم الحزمة هو `uglify-js`, ولكن الملف الثنائي الذي تُعطينا إيّاه يُدعى `uglifyjs`.<br>
> هذا ليس خطأ في الكتابة هنا. 

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تطبيق هذه الإضافات أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ. 

### Rollup {#rollup}

 للحصول على النسخة الأكثر كفاءةً للإنتاج من أجل Rollup، ثبِّت بعض الإضافات:

```
# إن كنت تستخدم npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser 

# إن كنت تستخدم Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser 
```

لإنشاء نُسخة للإنتاج، تأكَّد من أن تُضيف هذه الإضافات **(الترتيب مُهم)**:

* تضمن الإضافة [`replace`](https://github.com/rollup/rollup-plugin-replace) تعيين البيئة الصحيحة للبناء.
* تُزوِّد الإضافة [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) دعمًا لأجل CommonJS في Rollup.
* تضغط الإضافة [`terser`](https://github.com/TrySound/rollup-plugin-terser) الحزمة النهائيّة.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

للحصول على مثال كامل عن طريقة الإعداد [انظر هنا](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تطبيق الإضافة `terser` أو الإضافة `replace` أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ.

### webpack {#webpack}

>**ملاحظة:**
>
>إن كُنتَ تستخدم الأمر Create React App, رجاءً اتبع [التعليمات السّابقة](#create-react-app).<br>
>هذا القسم يُفيدك فقط إن كنت تريد ضبط إعدادات webpack بشكلٍ مباشر.

نسخة Webpack v4+ ستضغط الشفرة البرمجية الخاصة بك تلقائيًا في طور الإنتاج `Production`.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production'
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

بإمكانك تعلّم المزيد حول هذا الموضوع في [webpack توثيق](https://webpack.js.org/guides/production/).

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تطبيق الإضافة `TerserPlugin` أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ.

## تفحص المكونات باستخدام نافذة الأداء في متصفح Chrome {#profiling-components-with-the-chrome-performance-tab}

يُمكنِك في **وضع التطوير** إيجاد مخطّطات توضيحية لعمليّة وصل المُكوِّنات (mount)، وتحديثها، وفصلها (unmount)، وذلك باستخدام أدوات الأداء في المتصفحات التي تدعمها. على سبيل المثال: 

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

لفعل ذلك في متصفح Chrome: 

1. Temporarily **disable all Chrome extensions, especially React DevTools**. They can significantly skew the results!
2. عطِّل بشكل مؤقَّت **كافة إضافات Chrome خاصة أدوات تطوير React**، فهي تُفسِد النتائج بالتأكيد.

3. تأكّد من تشغيل التطبيق في وضع التطوير.

4. افتح نافذة الأداء ([Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)) في أدوات تطوير المتصفّح Chrome واضغط على تسجيل (Record).

5. نفّذ الإجراءات التي ترغب بتفحصها. لا تُسجِّل أكثر من 20 ثانية فقد يتوقّف Chrome عن الاستجابة.

6. أوقف التسجيل.

7. ستُجمَّع أحداث React تحت العنوان **User Timing**.

للحصول على دليل مفصّل، راجع [هذه المقالة من طرف Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).

لاحظ أنّ هذه **الأرقام نسبيّة لذلك ستُصيَّر المُكوِّنات بشكلٍ أسرع في مرحلة الإنتاج**. يُساعدك ذلك على إدراك متى تُحدَّث عناصر واجهة المستخدم عن طريق الخطأ، ومتى تحصل هذه التحديثات. 

المتصفحات التي تدعم هذه الميزة حاليًّا هي Chrome، و Edge، و Internet Explorer، ولكنّنا نستخدم[واجهة توقيت المستخدم (User Timing API)](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) المعياريّة، لذلك نتوقع الدعم من المزيد من المتصفحات.

## تفحص المكونات باستخدام أداة التحليل  من أدوات التطوير{#profiling-components-with-the-devtools-profiler}

يوفر `react-dom` <span dir="ltr">16.5+</span> و `react-native` <span dir="ltr">0.57+</span> أدوات تحليل مُحسّنة لوضع التطوير مع أداة التحليل في React DevTools.
يمكن إيجاد لمحة عن أداة التحليل في هذه المقالة ["مقدمة إلى أداة تحليل React"](/blog/2018/09/10/introducing-the-react-profiler.html).
فيديو عرض تفصيلي لأداة التحليل [متوفّر كذلك على YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

إذا لم تقم بتثبيت أدوات تطوير React بعد، يمكنك إيجادها هنا:

- [إضافة متصفّح Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox إضافة متصفّح](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [الإصدار المستقل (حزمة Node)](https://www.npmjs.com/package/react-devtools)

> ملاحظة
>
> حزمة تحليل `react-dom` في وضع الإنتاج متوفّر كذلك باسم `react-dom/profiling`.
> إقرأ المزيد حول طريقة استعمال هذه الحزمة في [fb.me/react-profiling](https://fb.me/react-profiling)

## عرض القوائم الطويلة {#virtualize-long-lists}

إن كان تطبيقك يُصيِّر قوائم طويلة من البيانات (مئات أو آلاف الصفوف)، فنوصي باستخدام تقنيّة تدعى النوافذ (windowing)، وهي تقنية تُصيِّر مجموعة صغيرة من الصفوف في أي وقت مُحدَّد، وتستطيع تقليل الزمن الذي تستغرقه إعادة تصيير المُكوِّنات وعدد عُقَد DOM المُنشأة. 

تعتبر [react-window](https://react-window.now.sh/) و [react-virtualized](https://bvaughn.github.io/react-virtualized/) مكتبات نوافذ شائعة تُزوِّدنا بالعديد من المُكوِّنات القابلة لإعادة الاستخدام لعرض القوائم، الشبكات، وبيانات الجداول. بإمكانك أيضًا إنشاء مُكوِّن النوافذ الخاص بك، مثلما [فعلت Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3)، إن أردتَ شيئًا مُخصّصًا لأجل تطبيقك. 

## تجنب المطابقة (Reconciliation) {#avoid-reconciliation}

تبني React وتدعم تمثيلًا داخليًّا لواجهة المستخدم المُصيَّرة. يتضمّن ذلك عناصر React التي تُعيدها من المُكوِّنات. يُتيح لك هذا التمثيل تجنّب إنشاء عقد DOM غير الضروريّة والوصول إليها، حيث يكون ذلك عملية بطيئة على كائنات JavaScript. يُشار إلى ذلك أحيانًا بـ DOM الافتراضي، ولكنّه يعمل بنفس الطريقة في React Native. 

عندما تتغيّر خاصيّة أو حالة المُكوِّن، تُقرِّر React أي عقدة DOM هي التي يجب تحديثها عن طريق مقارنة العنصر الجديد المُعاد مع العنصر السابق المُصيَّر. وعندما لا يكونان متطابقين ستُحدِّث React واجهة DOM. 

بإمكانك الآن إظهار مخططات لعملية إعادة تصيير DOM الافتراضي باستخدام أدوات تطوير React: 

- [إضافة متصفّح Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox إضافة متصفّح](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [الإصدار المستقل (حزمة Node)](https://www.npmjs.com/package/react-devtools)

حدِّد من نافذة Console الخيار **Highlight Updates** في النافذة **React**: 

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="How to enable highlight updates" /></center>

تفاعل مع الصفحة وسترى حدود ملوّنة تظهر بشكل آني حول أي مُكوِّن يُعاد تصييره. يُتيح لك ذلك التقاط أي إعادة تصيير غير ضروريّة. يُمكنِك تعلم المزيد حول هذه الميزة من [هذه المقالة](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) من طرف [Ben Edelstein](https://blog.logrocket.com/@edelstein).

أنظر إلى هذا المثال:

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="React DevTools Highlight Updates example" /></center>

لاحظ أنّنا حين أدخلنا واجبًا ثانيًا لفعله استمر الواجب الأول بالإضاءة على الشاشة مع كل نقرة زر، ويعني هذا أنّه يُعاد تصييره مع كل إدخال من قبل React. يُدعى هذا أحيانًا بالتصيير المُضيِّع للوقت، ونعلم أنّه غير ضروري لأنّ الواجب الأول لم يتغيّر، ولكنّ React لا تعلم ذلك.

على الرغم من تحديث React لعُقَد DOM التي تغيّرت، فلا تزال إعادة التصيير تستغرق بعض الوقت. في العديد من الحالات لن تكون هذه مشكلة، ولكن إن كان البطء ملاحظًا فبإمكانك تسريع العملية عن طريق تجاوز تابع دورة حياة المُكوِّن `shouldComponentUpdate` والذي يُطلَق قبل بدء عملية إعادة التصيير. يُعيد هذا التابع بشكل افتراضي القيمة `true` وبذلك يترك لمكتبة React إنجاز التحديث:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

إن كانت لديك بعض الحالات التي لا ينبغي فيها تحديث المُكوّن فبإمكانك إعادة القيمة `false` من التابع `shouldComponentUpdate` وذلك لتجاوز كامل عمليّة التصيير بما في ذلك التابع `render()`‎ في هذا المُكوِّن والمُكوِّنات الأدنى منه. 

في معظم الحالات بدلًا من كتابة `shouldComponentUpdate()`‎ بشكل يدوي بإمكانك وراثته من [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). يُكافِئ ذلك تنفيذ التابع `shouldComponentUpdate()‎` مع مقارنة صغيرة للخاصيّات والحالة السّابقة مع الحاليّة. 


## مخطط لعمل التابع shouldComponentUpdate {#shouldcomponentupdate-in-action}

تجد في الصورة التالية شجرة فرعية من المُكوّنات. تُشير `SCU` بالنسبة لكل واحد إلى القيمة التي يجب أن يُعيدها التابع `shouldComponentUpdate،` وتدلّنا `vDOMEq` إن كانت عناصر React المُصيَّرة متطابقة. وأخيرًا يُشير لون الدائرة إن كان يجب إجراء مُطابَقة على المُكوِّن أم لا: 

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

بما أنّ التابع `shouldComponentUpdate` أعاد القيمة `false` من أجل الشجرة الفرعية التي جذرها هو C2، فلم تُحاول React تصيير C2، وبهذا لم يتوجّب أيضًا استدعاء `shouldComponentUpdate` على C4 و C5. 

بالنسبة للجذر C1 و C3 أعاد التابع `shouldComponentUpdate` القيمة `true،` وبذلك توجّب على React النزول حتى الفروع والتحقّق منها. بالنسبة للجذر C6 أعاد التابع `shouldComponentUpdate` القيمة `true،` وبما أنّ العناصر المُصيَّرة لم تكن متطابقة فتوجَّب على React تحديث DOM. 

الحالة الأخيرة الهامّة هي الجذر C8. هنا يجب على React تصيير هذا المُكوّن، ولكن بما أنّ عناصر React التي أعادها كانت مطابقةً للعناصر المُصيَّرة سابقًا، فلم يجب عليها تحديث DOM. 

لاحظ أنّه وجبَ على React إجراء تعديلات على DOM من أجل الجذر C6 فقط، والتي لم يكن هناك مفرًّا منها. بالنسبة للجذر C8 أنقذت نفسها من التحديث عن طريق مُقارنة عناصر React المُصيَّرة، ومن أجل التفرّعات C2 و C7 لم يجب عليها حتى مقارنة العناصر حيث أوقفنا ذلك من خلال التابع `shouldComponentUpdate` ولم يُستدعى التابع `render`. 

## أمثلة {#examples}

 إن كانت الطريقة الوحيدة لتغيير المُكوِّن هي تغيير `props.color` أو `state.count`، فبإمكانك أن تدع التابع `shouldComponentUpdate` يتحقّق من ذلك:
 
```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

في هذه الشيفرة يتحقّق التابع `shouldComponentUpdate` إن كانت هناك أيّة تغييرات في `props.color` أو `state.count`. إن كانت قيمها لا تتغير فلن يُحدَّث المُكوِّن. إن أصبح مُكوِّنك أكثر تعقيدًا فيُمكنك إجراء مقارنة بين كافة حقول الخاصيّات `props` والحالة `state` لتحديد ما إذا كان ينبغي تحديث المُكوّن. طريقة المقارنة هذه شائعة بحيث تُزوّدنا React بمُساعِد لاستخدام هذا المنطق عن طريق الوراثة من الصّنف `React.PureComponent`. لذلك الشيفرة التالية هي طريقة أبسط لتحقيق نفس الشيء:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

في معظم الأوقات يُمكنك استخدام `React.PureComponent` بدلًا من كتابة التابع `shouldComponentUpdate` الخاص بك. يُجري هذا الصنف مقارنة بسيطة لذلك لا يُمكنك استخدامه إن كانت الخاصيّات والحالة مُعدَّلة بطريقة قد لا تلتقطها المقارنة البسيطة. 

قد يصبح ذلك مشكلة بالنسبة لنا عند استخدامه مع بنى البيانات الأكثر تعقيدًا، فمثلًا لنفترض أنّك تريد من المُكوِّن `ListOfWords` تصيير قائمة من الكلمات المنفصلة بينها مع وجود مُكوّن أب يُدعى `WordAdder` والذي يُتيح لنا الضغط على زر لإضافة كلمة للقائمة، لن تعمل هذه الشيفرة بشكلٍ صحيح:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // يسبب هذا المقطع خطأ
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

المشكلة هي قيام المُكوّن `PureComponent` بمقارنة بسيطة بين القيم القديمة والجديدة لـ `this.props.words`. وبما أنّ هذه الشيفرة تُعدِّل المصفوفة `words` في التابع `handleClick` الموجود في المُكوِّن `WordAdder،` فستُعتبَر القيم القديمة والجديدة للمصفوفة `this.props.words` متكافئة، على الرغم من أنّ الكلمات قد تغيّرت فعليًّا في المصفوفة، وبهذا لن يُحدَّث المُكوِّن `ListOfWords` على الرغم من أنّه يمتلك كلمات جديدة يجب تصييرها. 

## قوة عدم تعديل البيانات {#the-power-of-not-mutating-data}

 الطريقة الأبسط لتجاوز هذه المشكلة هي تجنّب تعديل القيم التي تستخدمها كخاصيّات أو حالة، فيُمكِن كتابة التابع `handleClick` السّابع باستخدام `concat` كما يلي:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

تدعم ES6 [صياغة النشر](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)  لأجل المصفوفات والذي يُسهِّل هذه العمليّة. إن كنت تستخدم Create React App فهذه الصياغة متوفرة بشكل افتراضي لديك:

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

تستطيع أيضًا إعادة كتابة الشيفرة التي تُعدِّل الكائنات لتجنّب ذلك بطريقة مماثلة. فلنفترض مثلًا أنّنا لدينا كائن يُدعى `colormap` ونريد كتابة دالة لتغيير قيمة `colormap.right` لتكون `'blue'`، فنكتب ما يلي:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

لكتابة ذلك بدون تعديل الكائن الأصلي نستخدم التابع [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

يُعيد التابع  `updateColorMap`  الآن كائنًا جديدًا بدلًا من تعديل القديم. `Object.assign` موجودة في ES6 وتحتاج إلى polyfill.


هنالك اقتراح من JavaScript بإضافة [خاصيّة نشر الكائن](https://github.com/sebmarkbage/ecmascript-rest-spread) لسهولة تحديث الكائنات بدون تعديلها أيضًا:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

إن كنتَ تستخدم Create React App فسيكون التابع `Object.assign` وصيغة نشر الكائن متوفرة بشكلٍ افتراضي. 

## استخدام بُنى البيانات غير القابلة للتعديل {#using-immutable-data-structures}

مكتبة [Immutable.js](https://github.com/facebook/immutable-js)  هي طريقة أخرى لحل هذه المشكلة، فهي تُزوّدنا بمجموعات دائمة غير قابلة للتعديل والتي تعمل عبر المشاركة البنيوية:

* غير قابلة للتعديل (*Immutable*): فحالما تُنشَأ المجموعة لا يُمكن تبديلها في أي نقطة زمنية.
* دائمة (*Persistent*): يُمكِن إنشاء مجموعات جديدة من مجموعة قديمة بعد تعديلها. وتبقى المجموعة الأصلية صالحة بعد إنشاء المجموعة الجديدة.
* المشاركة البنيوية (*Structural Sharing*): تُنشأ مجموعات جديدة باستخدام مماثلة لبنية المجموعة الأصلية قدر الإمكان مع تقليل النسخ إلى الحد الأدنى لتحسين الأداء.

 تجعل عدم القدرة على التعديل من تتبّع التغييرات أمرًا سهلًا، فالتغيير سيُنتِج دومًا كائنًا جديدًا لذا نحتاج فقط للتحقق إن كان مرجع الكائن قد تغيّر. فمثلًا في شيفرة JavaScript الاعتيادية التالية:

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

على الرغم من أنّنا عدّلنا المتغيّر `y` بما أنّه مرجع لنفس الكائن مثل المتغيّر `x`، فستُعيد المقارنة القيمة `true`. بإمكانك كتابة نفس الشيفرة باستخدام immutable.js:

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

في هذه الحالة بما أنّنا أعدنا مرجعًا عند تعديل المتغيّر `x` فيُمكننا استخدام المقارنة بين المراجع `(x === y)`  للتأكد من أنّ القيمة الجديدة المُخزّنة في `y` مختلفة عن القيمة الأصليّة المُخزّنة في `x`.

من المكتبات الأخرى التي تساعد على استخدام البيانات غير القابلة للتعديل نجد [Immer](https://github.com/mweststrate/immer) و [immutability-helper](https://github.com/kolodny/immutability-helper) أو [seamless-immutable](https://github.com/rtfeldman/seamless-immutable).

تُزوِّدك بنى البيانات غير القابلة للتعديل بطريقة سهلة لتتبّع التغييرات على الكائنات، وهو كل ما نحتاجه لتنفيذ التابع `shouldComponentUpdate`. يُزوِّدك ذلك بدفعة جيدة لتحسين الأداء في تطبيقك. 

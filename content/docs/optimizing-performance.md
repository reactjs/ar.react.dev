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

إن تَزُرْ موقعًا يستعمل React في وضع التطوير، سيكون للأيقونة خلفية بلون أحمر:

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

للحصول على النسخة الأكثر كفاءةً للإنتاج من أجل Brunch، ثبِّت الإضافة [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch):

```
# إن كنت تستخدم npm
npm install --save-dev uglify-js-brunch

#إن كنت تستخدم Yarn
yarn add --dev uglify-js-brunch
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
npm install --save-dev envify uglify-js uglifyify 

# إن كنت تستخدم Yarn
yarn add --dev envify uglify-js uglifyify 
```

لإنشاء نُسخة للإنتاج، تأكَّد من أن تُضيف هذه المٌحَوّلات **(الترتيب مهم)**:

* يضمن المُحَوّل [`envify`](https://github.com/hughsk/envify) عيين البيئة الصحيحة للبناء. اجعله عامًّا عن طريق العَلَم (‎`-g`).
* يُزيل المُحَوّل [`uglifyify`](https://github.com/hughsk/uglifyify) استيرادات التطوير، اجعله عامًّا أيضًا (`-g`).
* وأخيرًا نُمرِّر الحزمة الناتجة إلى الأمر [`uglify-js`](https://github.com/mishoo/UglifyJS2) ([تعرف على السبب من هنا](https://github.com/hughsk/uglifyify#motivationusage)).

على سبيل المثال:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
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
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# إن كنت تستخدم Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

لإنشاء نُسخة للإنتاج، تأكَّد من أن تُضيف هذه الإضافات **(الترتيب مُهم)**:

* تضمن الإضافة [`replace`](https://github.com/rollup/rollup-plugin-replace) تعيين البيئة الصحيحة للبناء.
* تُزوِّد الإضافة [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) دعمًا لأجل CommonJS في Rollup.
* تضغط الإضافة [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) الحزمة النهائيّة.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

للحصول على مثال كامل عن طريقة الإعداد [انظر هنا](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تطبيق الإضافة `uglify` أو الإضافة `replace` أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ.

### webpack {#webpack}

>**ملاحظة:**
>
>إن كُنتَ تستخدم الأمر Create React App, رجاءً اتبع [التعليمات السّابقة](#create-react-app).<br>
>هذا القسم يُفيدك فقط إن كنت تريد ضبط إعدادات webpack بشكلٍ مباشر.

 للحصول على النسخة الأكثر كفاءةً للإنتاج من أجل webpack، تأكّد من تضمين هذه الإضافات في إعدادات الإنتاج:

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

بإمكانك تعلّم المزيد حول هذا الموضوع في [webpack توثيق](https://webpack.js.org/guides/production/).

تذكَّر أنَك تحتاج فقط لفعل ذلك من أجل نُسَخ الإنتاج، فلا يجب تطبيق الإضافة  `UglifyJsPlugin` أو الإضافة `DefinePlugin` مع القيمة `'production'` أثناء التطوير، لأنّها ستُخفي تحذيرات React المُفيدة وتجعل من بناء التطبيق أبطأ.

## تفحص المكونات باستخدام نافذة الأداء في متصفح Chrome {#profiling-components-with-the-chrome-performance-tab}

يُمكنِك في **وضع التطوير** إيجاد مخطّطات توضيحية لعمليّة وصل المُكوِّنات (mount)، وتحديثها، وفصلها (unmount)، وذلك باستخدام أدوات الأداء في المتصفحات التي تدعمها. على سبيل المثال: 

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

لفعل ذلك في متصفح Chrome: 

1. Temporarily **disable all Chrome extensions, especially React DevTools**. They can significantly skew the results!
1. عطِّل بشكل مؤقَّت **كافة إضافات Chrome خاصة أدوات تطوير React**، فهي تُفسِد النتائج بالتأكيد.

2. تأكّد من تشغيل التطبيق في وضع التطوير.

3. افتح نافذة الأداء ([Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)) في أدوات تطوير المتصفّح Chrome واضغط على تسجيل (Record).

4. نفّذ الإجراءات التي ترغب بتفحصها. لا تُسجِّل أكثر من 20 ثانية فقد يتوقّف Chrome عن الاستجابة.

5. أوقف التسجيل.

6. ستُجمَّع أحداث React تحت العنوان **User Timing**.

للحصول على دليل مفصّل، راجع [هذه المقالة من طرف Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).

لاحظ أنّ هذه **الأرقام نسبيّة لذلك ستُصيَّر المُكوِّنات بشكلٍ أسرع في مرحلة الإنتاج**. يُساعدك ذلك على إدراك متى تُحدَّث عناصر واجهة المستخدم عن طريق الخطأ، ومتى تحصل هذه التحديثات. 

المتصفحات التي تدعم هذه الميزة حاليًّا هي Chrome، و Edge، و Internet Explorer، ولكنّنا نستخدم[واجهة توقيت المستخدم (User Timing API)](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) المعياريّة، لذلك نتوقع الدعم من المزيد من المتصفحات.

## Profiling Components with the DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ and `react-native` 0.57+ provide enhanced profiling capabilities in DEV mode with the React DevTools Profiler.
An overview of the Profiler can be found in the blog post ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
A video walkthrough of the profiler is also [available on YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

If you haven't yet installed the React DevTools, you can find them here:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> Note
>
> A production profiling bundle of `react-dom` is also available as `react-dom/profiling`.
> Read more about how to use this bundle at [fb.me/react-profiling](https://fb.me/react-profiling)

## Virtualize Long Lists {#virtualize-long-lists}

If your application renders long lists of data (hundreds or thousands of rows), we recommended using a technique known as "windowing". This technique only renders a small subset of your rows at any given time, and can dramatically reduce the time it takes to re-render the components as well as the number of DOM nodes created.

[react-window](https://react-window.now.sh/) and [react-virtualized](https://bvaughn.github.io/react-virtualized/) are popular windowing libraries. They provide several reusable components for displaying lists, grids, and tabular data. You can also create your own windowing component, like [Twitter did](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), if you want something more tailored to your application's specific use case.

## Avoid Reconciliation {#avoid-reconciliation}

React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components. This representation lets React avoid creating DOM nodes and accessing existing ones beyond necessity, as that can be slower than operations on JavaScript objects. Sometimes it is referred to as a "virtual DOM", but it works the same way on React Native.

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM.

You can now visualize these re-renders of the virtual DOM with React DevTools:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

In the developer console select the **Highlight Updates** option in the **React** tab:

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="How to enable highlight updates" /></center>

Interact with your page and you should see colored borders momentarily appear around any components that have re-rendered. This lets you spot re-renders that were not necessary. You can learn more about this React DevTools feature from this [blog post](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) from [Ben Edelstein](https://blog.logrocket.com/@edelstein).

Consider this example:

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="React DevTools Highlight Updates example" /></center>

Note that when we're entering a second todo, the first todo also flashes on the screen on every keystroke. This means it is being re-rendered by React together with the input. This is sometimes called a "wasted" render. We know it is unnecessary because the first todo content has not changed, but React doesn't know this.

Even though React only updates the changed DOM nodes, re-rendering still takes some time. In many cases it's not a problem, but if the slowdown is noticeable, you can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns `true`, leaving React to perform the update:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

If you know that in some situations your component doesn't need to update, you can return `false` from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

In most cases, instead of writing `shouldComponentUpdate()` by hand, you can inherit from [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). It is equivalent to implementing `shouldComponentUpdate()` with a shallow comparison of current and previous props and state.

## shouldComponentUpdate In Action {#shouldcomponentupdate-in-action}

Here's a subtree of components. For each one, `SCU` indicates what `shouldComponentUpdate` returned, and `vDOMEq` indicates whether the rendered React elements were equivalent. Finally, the circle's color indicates whether the component had to be reconciled or not.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Since `shouldComponentUpdate` returned `false` for the subtree rooted at C2, React did not attempt to render C2, and thus didn't even have to invoke `shouldComponentUpdate` on C4 and C5.

For C1 and C3, `shouldComponentUpdate` returned `true`, so React had to go down to the leaves and check them. For C6 `shouldComponentUpdate` returned `true`, and since the rendered elements weren't equivalent React had to update the DOM.

The last interesting case is C8. React had to render this component, but since the React elements it returned were equal to the previously rendered ones, it didn't have to update the DOM.

Note that React only had to do DOM mutations for C6, which was inevitable. For C8, it bailed out by comparing the rendered React elements, and for C2's subtree and C7, it didn't even have to compare the elements as we bailed out on `shouldComponentUpdate`, and `render` was not called.

## Examples {#examples}

If the only way your component ever changes is when the `props.color` or the `state.count` variable changes, you could have `shouldComponentUpdate` check that:

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

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color` or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

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

Most of the time, you can use `React.PureComponent` instead of writing your own `shouldComponentUpdate`. It only does a shallow comparison, so you can't use it if the props or state may have been mutated in a way that a shallow comparison would miss.

This can be a problem with more complex data structures. For example, let's say you want a `ListOfWords` component to render a comma-separated list of words, with a parent `WordAdder` component that lets you click a button to add a word to the list. This code does *not* work correctly:

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
    // This section is bad style and causes a bug
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

The problem is that `PureComponent` will do a simple comparison between the old and new values of `this.props.words`. Since this code mutates the `words` array in the `handleClick` method of `WordAdder`, the old and new values of `this.props.words` will compare as equal, even though the actual words in the array have changed. The `ListOfWords` will thus not update even though it has new words that should be rendered.

## The Power Of Not Mutating Data {#the-power-of-not-mutating-data}

The simplest way to avoid this problem is to avoid mutating values that you are using as props or state. For example, the `handleClick` method above could be rewritten using `concat` as:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 supports a [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays which can make this easier. If you're using Create React App, this syntax is available by default.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

You can also rewrite code that mutates objects to avoid mutation, in a similar way. For example, let's say we have an object named `colormap` and we want to write a function that changes `colormap.right` to be `'blue'`. We could write:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

To write this without mutating the original object, we can use [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` now returns a new object, rather than mutating the old one. `Object.assign` is in ES6 and requires a polyfill.

There is a JavaScript proposal to add [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) to make it easier to update objects without mutation as well:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

If you're using Create React App, both `Object.assign` and the object spread syntax are available by default.

## Using Immutable Data Structures {#using-immutable-data-structures}

[Immutable.js](https://github.com/facebook/immutable-js) is another way to solve this problem. It provides immutable, persistent collections that work via structural sharing:

* *Immutable*: once created, a collection cannot be altered at another point in time.
* *Persistent*: new collections can be created from a previous collection and a mutation such as set. The original collection is still valid after the new collection is created.
* *Structural Sharing*: new collections are created using as much of the same structure as the original collection as possible, reducing copying to a minimum to improve performance.

Immutability makes tracking changes cheap. A change will always result in a new object so we only need to check if the reference to the object has changed. For example, in this regular JavaScript code:

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Although `y` was edited, since it's a reference to the same object as `x`, this comparison returns `true`. You can write similar code with immutable.js:

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

In this case, since a new reference is returned when mutating `x`, we can use a reference equality check `(x === y)` to verify that the new value stored in `y` is different than the original value stored in `x`.

Other libraries that can help use immutable data include [Immer](https://github.com/mweststrate/immer), [immutability-helper](https://github.com/kolodny/immutability-helper), and [seamless-immutable](https://github.com/rtfeldman/seamless-immutable).

Immutable data structures provide you with a cheap way to track changes on objects, which is all we need to implement `shouldComponentUpdate`. This can often provide you with a nice performance boost.

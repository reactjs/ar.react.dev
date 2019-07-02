---
id: higher-order-components
title: المكونات ذات الترتيب الأعلى
permalink: docs/higher-order-components.html
---

إنّ المُكوّنات ذات الترتيب الأعلى (Higher-Order Components واختصارًا HOC) هي تِقنية مُتَقَدِمة في React لإعادة استخدام مَنطِق المُكونات. وهي ليست جزءًا من واجهة برمجة تطبيقات React API، بَل هي نَمَط يَنبَثِق عن طَبيعة React التَركيبية.

باختصار، **المكوّن ذو الترتيب الأعلى هو عبارة عن دالّة تَأخُذ مُكوّنًا وتُعيد مُكوّنًا جديدًا.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

بينما يُحوّل المكوّن الخاصيّات إلى واجهة مستخدم، يُحوِّل المُكوّن ذو الترتيب الأعلى مكوّنًا إلى مكوّن آخر.

تكون المكوّنات ذات الترتيب الأعلى شائعة في مكتبات React المُقدَّمة من طرف ثالث، مثل مكتبة [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) الخاصة بـ Redux و مكتبة [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) الخاصّة بـ Relay.

سنناقش في هذه الصفحة الفائدة من المكوّنات ذات الترتيب الأعلى وكيفية كتابتها.

## استخدام المكوّنات ذات الترتيب الأعلى لأجل الاهتمامات المشتركة {#use-hocs-for-cross-cutting-concerns}

> **Note**
>
>أشرنا سابقًا إلى أفضلية استخدام المخاليط (mixins) كطريقة للتعامل مع الاهتمامات المُشتركة (cross-cutting concerns)، ولكنّنا أدركنا بعد ذلك أنّ المخاليط تُسَبّب مشاكل أكثر من فائدتها. تعرّف من [هنا](/blog/2016/07/13/mixins-considered-harmful.html) عن سبب انتقالنا من المخاليط وكيفية تحويل مُكوّناتك الحالية التي تَستخدِمُها.

تُشكِّل المكوّنات الوحدة الأساسية لإعادة استخدام الشيفرة في React، ولكنّك ستجد بعض الأنماط التي لا تتلاءم بشكل مباشر مع المكوّنات التقليدية.

افترض مثلًا أنّه لديك مكوّن لقائمة التعليقات يُدعى `CommentList` والذي يشترك بمصدر بيانات خارجي لتصيير قائمة من التعليقات:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

ولاحقًا قررت كتابة مكوّن للاشتراك بمنشور وحيد في المدوّنة، والذي يتبع نفس النمط:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```
إنّ المكوّنين `CommentList` و `BlogPost` غير متطابقان، فهما يستدعيان توابع مختلفة على مصدر البيانات `DataSource`، ويُصيّران ناتجًا مختلفًا، ولكن يتشابه تنفيذهما الداخلي كثيرًا في ما يلي:

- إضافة مُستمِع (listener) للتغيير إلى `DataSource` عند الوصل (mount).
- استدعاء `setState` بداخل المُستمِع عند تغيّر مصدر البيانات.
- إزالة مُستمِع التغيير عند الفصل (unmount).

بإمكانك أن تتخيّل في التطبيقات الكبيرة تكرار هذا النمط من الاشتراك بمصدر البيانات `DataSource` واستدعاء `setState`. نريد وحدة مُجرَّدة تسمح لنا بتعريف هذا المنطق في مكان واحد ومشاركته عبر مكوّنات عديدة. وهنا تأتي فائدة المكوّنات ذات الترتيب الأعلى.

نستطيع كتابة دالّة تُنشِئ مكوّنات، مثل `CommentList` و `BlogPost` والتي تشترك بمصدر البيانات `DataSource`. تقبل هذه الدالّة كوسيط لها المكوّن الابن الذي يستقبل البيانات المُشارَكَة كخاصيّة له. فلنسمّي هذه الدالّة `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```
المُعامِل الأول هو المكوّن المُغلَّف. يسترجع المُعامِل الثاني البيانات التي تُهمّنا، مع إعطاء مصدر البيانات `DataSource` والخاصيّات الحاليّة.

عند تصيير `CommentListWithSubscription` و `BlogPostWithSubscription`، فَسيُمَرَّر للمُكوّنان `CommentList` و `BlogPost` خاصيّة للبيانات `data` والتي تحمل أحدث البيانات المستخرجة من `DataSource`:

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

لاحظ أنّ المكوّن ذي الترتيب الأعلى لا يُعدِّل مكوّن حقل الإدخال ولا يستخدم الوراثة لنسخ سلوكه، بل يُركِّب المكوّن الأساسي عن طريق تغليفه في مكوّن حاوية. المكوّن ذو الترتيب الأعلى هو عبارة عن دالّة نقيّة (pure) بدون أي تأُثيرات جانبية إطلاقًا.

يستقبل المكوّن المُغلَّف جميع الخاصيّات من الحاوية بالإضافة إلى الخاصيّة الجديدة وهي `data` والتي يستخدمها لتصيير ناتجه. لا يهتم المكوّن ذو الترتيب الأعلى بكيفية أو سبب استخدام البيانات، ولا يهتم المكوّن المُغلَّف بمصدر البيانات.

بما أنّ `withSubscription` دالّة عادية بإمكانك إضافة وسائط لها كما تريد. فقد ترغب مثلًا بِجَعل اسم الخاصيّة `data` قابلًا للإعداد، وذلك لزيادة عَزل المكوّن ذي الترتيب الأعلى عن المكوّن المُغلِّف له، أو تستطيع قبول وسيط يُعِد `shouldComponentUpdate` أو مصدر البيانات. كل هذه الإمكانيات متوفرة بسبب امتلاك المكوّن ذو الترتيب الأعلى السيطرة على كيفيّة تعريف المكوّنات.

وكما هو الحال مع المكوّنات يكون العقد بين `withSubscription` والمكوّن المغلّف معتمد بشكل كامل على الخاصيّات. يجعل هذا من السهل استبدال مكوّن ذو ترتيب أعلى بواحد آخر، طالما أنّهما يعطيان نفس الخاصيات للمكوّن المغلّف. قد يكون هذا مفيدًا إن غيرت مكتبة الحصول على البيانات مثلًا.

## لا تُعدِّل المكوّن الأصلي بل استخدم التراكيب. {#dont-mutate-the-original-component-use-composition}

قاوم رغبة تعديل نموذج المكوّن بداخل المكوّن ذو الترتيب الأعلى.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

هنالك بعض المشاكل عند فعل ذلك. أحدها هي عدم القدرة على استخدام مكوّن حقل الإدخال بشكل منفصل عن المكوّن `EnhancedComponent`. وإن طبقت مكوّن ذو ترتيب أعلى آخر إلى المكوّن `EnhancedComponent` والذي يُعدِّل *أيضًا* `componentWillReceiveProps`، فسيتجاوز وظيفة المكوّن ذو الترتيب الأعلى الأول! لا يعمل المكوّن ذو الترتيب الأعلى هذا أيضًا مع المكوّنات الدالّية لأنّها لا تمتلك توابع دورة الحياة.

إنّ تعديل المكوّنات ذات الترتيب الأعلى ليس أمرًا بسيطًا فيجب معرفة كيفية تنفيذها لتَجنُب التعارض مع المكوّنات ذات الترتيب الأعلى الأخرى.

بدلًا من التعديل ، المكوّنات ذو الترتيب الأعلى يجب ان تَستخدِم التراكيب عن طريق تغليف مكوّن حقل الإدخال في مكوّن حاوية:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

يَمتلك هذا المكوّن ذو الترتيب الأعلى نفس وظيفة نُسخة التعديل مع تجنُب الأخطاء المُحتَملة، ويعمل بشكل مُتكافئ مع مكوّنات الأصناف والّدوال. وبما أنّه دالّة نقيّة فهو قابِل للتركيب مَع مكوّنات ذات الترتيب الأعلى الأُخرى أو حتى مَع نَفسِه.

ربما لاحظت التشابه بين المكوّنات ذات الترتيب الأعلى وبين نمط يُدعى **المُكوّنات الحاوية** "container components" والتي هي جزء من استراتيجية فَصل المَسؤولية بين الاهتمامات ذات المُستوى الأعلى والاهتِمامات ذات المستوى الأدنى. تُدير الحاويات أشياء مثل الاشتراكات والحالة وتُمرِّر خاصيّات للمكوّنات التي تتعامل مع أشياء مِثل تصيير واجهة المستخدم. تَستخدم المكوّنات ذات الترتيب الأعلى الحاويات كجزء منها. بإمكانك النظر إلى المكوّنات ذات الترتيب الأعلى كتعاريف للمكوّنات الحاوية.

## تمرير خاصيات غير مرتبطة إلى المكون المغلف {#convention-pass-unrelated-props-through-to-the-wrapped-component}

تُضيف المكوّنات ذات الترتيب الأعلى ميزات إلى المكوّن ولكن يَنبَفي عليها عد التعديل عليه بِشكلٍ كبير. إنّه من المُتَوقع أن يمتلك المكوّن العائد من المكوّن ذو الترتيب الأعلى واجهة مُشابِهة لِتلك من المكوّن المُغَلِّف له.

يَجِب على المُكوّنات ذات الترتيب الأعلى تَمرير الخاصيّات غير المرتبطة بأي اهتمام محدّد. تحتوي مُعظَم المُكوّنات ذات الترتيب الأعلى على تابع للتَصيير والذي يبدو مشابهًا لما يلي:

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

يضمن هذا أن تكون المكوّنات ذات الترتيب الأعلى مرنة وقابلة لإعادة الاستخدام قدر الإمكان.

## رفع إمكانية التركيب إلى أقصى درجة {#convention-maximizing-composability}

لا تَبدو كافّة المُكوّنات ذات الترتيب الأعلى مثل بعضها. فأحيانًا قد تَقبل فقط وسيطًا واحدًا، وهو المُكوّن المُغَلَّف:

```js
const NavbarWithRouter = withRouter(Navbar);
```

تقبل المكوّنات ذات الترتيب الأعلى وسائط إضافية عادةً. في هذا المثال نستخدم كائن للإعدادات لتحديد اعتماديات بيانات المكوّن:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

يبدو أشيع شكل للمكوّنات ذات الترتيب الأعلى كما يلي:

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

إن قسّمتَه إلى أقسامٍ أصغَر فَسَيسهُل عَليك فِهم ما يحدث:

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```
وبكلمات أخرى `connect` عبارة عن دالّة ذات ترتيب أعلى تُعيد مكوّن ذو ترتيب أعلى!

 قَد يَبدو هذا الشكل مُربِكًا وغير ضَروري، ولكنّه يِمتلك خاصيّة مُفيدة. تَمتلك المكوّنات ذات الترتيب الأعلى ذات الوسيط الوحيد مثل الذي أعادته الدالّة `connect` الشكل `Component => Component`. وإّنه مِن السهل تركيب الدوال التي نوع مُخرجاتها مطابق لِنوع مُدخَلاتِها معًا:

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(تسمح نفس هذه الخاصية للدالة `connect` باستخدام المنسقات decorators وهي اقتراح لا يزال تجريبيًّا في JavaScript).

تتوفر الدالة `compose` عن طريق مكتبات طرف ثالث عديدة بما في ذلك lodash (مثل [`lodash.flowRight`](https://lodash.com/docs/#flowRight))، و [Redux](https://redux.js.org/api/compose)، و [Ramda](https://ramdajs.com/docs/#compose).

## تغليف الاسم المعروض لسهولة تنقيح الأخطاء {#convention-wrap-the-display-name-for-easy-debugging}

تظهر مكوّنات الحاوية التي تُنشئها المكوّنات ذات الترتيب الأعلى في أدوات تطوير [React Developer Tools](https://github.com/facebook/react-devtools) كأي مكوّنات أخرى. ولسهولة تنقيح الأخطاء اختر الاسم المعروض بحيث يتواصل وكأنه نتيجة للمكوّن ذو الترتيب الأعلى.

أشيع طريقة هي تغليف الاسم المعروض للمكوّن المُغلَّف. لذا إن كان اسم المكوّن ذو الترتيب الأعلى هو `withSubscription` والاسم المعروض للمكوّن المُغلَّف هو `CommentList` فاستخدم الاسم المعروض `WithSubscription(CommentList)`‎:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## محاذير {#caveats}

تأتي المكوّنات ذو الترتيب الأعلى مع بعض المحاذير التي قد لا تكون واضحة مباشرةً إن كنت جديدًا على React.

### لا تستخدم المكوّنات ذات الترتيب الأعلى بداخل تابع التصيير {#dont-use-hocs-inside-the-render-method}

تستخدم خوارزمية المقارنة في React (وتُدعى reconciliation أي المطابقة) هوية المكوّن لتحديد إذا ما كان يجب عليها تحديث الشجرة الفرعية الحالية أو رميها ووصل واحدة جديدة. إن كان المكوّن العائد من التابع `render` مُطابِقًا تمامًا (`===`) للمكوّن من التصيير السابق، فستُحدِّث React الشجرة الفرعية عن طريق مقارنتها مع الجديدة، إن لم تكونا متطابقتين فستفصل الشجرة الفرعية السابقة بشكل كامل.

لا تحتاج عادةً إلى التفكير في هذا، ولكنّه يهم في المكوّنات ذات الترتيب الأعلى لأنه يعني أنّك لا تستطيع تطبيقها على مكوّن بداخل تابع التصيير لمكوّن ما:

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

لا تتعلق المشكلة هنا فقط بالأداء، فإعادة وصل المكوّن تؤدّي لخسارة حالته وكافة مكوّناته الأبناء.

طبق المكوّنات ذات الترتيب الأعلى بدلًا من ذلك خارج تعريف المكوّن بحيث ينشأ المكوّن الناتج مرة واحدة فقط، بعدها ستكون هويته ثابتة عبر التصييرات. وهذا هو ما تريده عادةً على أيّة حال.

في تلك الحالات النادرة التي تحتاج فيها إلى تطبيق المكوّنات ذات الترتيب الأعلى بشكل ديناميكي فبإمكانك أيضًا فعل ذلك بداخل توابع دورة حياة المكوّن أو دالته البانية.

### يجب نسخ التوابع الثابتة {#static-methods-must-be-copied-over}

من المفيد أحيانًا تعريف تابع ثابت (static) في مكوّن React. فمثلًا تعرض الحاويات تابعًا ثابتًا يُدعى `getFragment` لتسهيل تركيب أجزاء GraphQL.

عند تطبيق المكوّنات ذات الترتيب الأعلى على المكوّن، فسيُغلَّف المكوّن بمكوّن حاوي له. يعني هذا عدم امتلاك المكوّن الجديد لأي من التوابع الثابتة للمكوّن الأصلي:

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

لحل هذه المشكلة بإمكانك نسخ التوابع إلى الحاوية قبل إعادتها:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

ولكن يتطلب هذا معرفة أي توابع تحتاج إلى نسخها. بإمكانك استخدام هذه الإضافة [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) لنسخ جميع التوابع الثابتة غير المتعلقة بمكتبة React:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

من الحلول الممكنة الأخرى هي استخراج التابع الثابت بشكل منفصل من المكوّن نفسه.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### لا تستطيع تمرير المراجع {#refs-arent-passed-through}

بينما يكون الغرض من استخدام المكوّنات ذات الترتيب الأعلى هو تمرير كافة الخاصيّات للكائن المُغلَّف فلا يعمل هذا بالنسبة للمراجع. وهذا بسبب عدم كونها خاصيّة مثل المفتاح `key`. حيث تتعامل معها React بشكلٍ خاص. إن أضفت مرجع `ref` إلى عنصر مكوّنه ناتج عن مكوّن ذو ترتيب أعلى، فسيشير المرجع إلى نسخة عن المكوّن الحاوي وليس المكوّن المُغلَّف.

حل هذه المشكلة هو استخدام `React.forwardRef` (المقدمة في إصدار React 16.3). [تعلم المزيد حولها في قسم تمرير المراجع](/docs/forwarding-refs.html).

---
id: context
title: استخدام السياق (Context)
permalink: docs/context.html
---

يُزوِّدنا السياق (Context) بطريقة لتمرير البيانات عبر شجرة المُكوّنات دون الحاجة لتمرير الخاصيّات `props` يدويًّا من الأعلى إلى الأسفل في كل مستوى.

<<<<<<< HEAD
تُمرَّر البيانات في تطبيقات React الإعتيادية من المستوى الأعلى إلى الأسفل (أي من المكوّنات الآباء إلى المكوّنات الأبناء) عبر الخاصيّات `props`، ولكن قد يكون هذا بطيئًا لبعض أنواع الخاصيّات (مثل تفضيلات اللغة وقوالب واجهة المستخدم) والتي تحتاجها العديد من المكوّنات ضمن التطبيق. يُزوِّدنا السياق بطريقة لمشاركة القيم مثل تلك الموجودة بين المكوّنات دون الاضطرار لتمرير الخاصيّات عبر كل مستوى من الشجرة.
=======
In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.
>>>>>>> 4fa06486cdb8c5a1cd7e3d88b24e76b1920f33fd

- [متى نستخدم السياق](#when-to-use-context)
- [	قبل أن تستخدم السياق](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [	أمثلة](#examples)
  - [السياق الديناميكي](#dynamic-context)
  - [تحديث السياق من المكونات المتداخلة](#updating-context-from-a-nested-component)
  - [استهلاك سياقات متعددة](#consuming-multiple-contexts)
- [	محاذير](#caveats)
- [	واجهة برمجة التطبيقات القديمة](#legacy-api)

## متى نستخدم السياق {#when-to-use-context}

يكون السياق مُصمَّمًا لمشاركة البيانات التي تُعتبر عامّة (global) لشجرة مكوّنات React، مثل المستخدم قيد المصادقة حاليًّا، أو القالب، أو تفضيلات اللغة. على سبيل المثال في الشيفرة التالية نُمرِّر خاصيّة القالب "`theme`" يدويًّا من أجل تنسيق مكوّن الزر  `Button`:

`embed:context/motivation-problem.js`

نتجنب باستخدام السياق تمرير الخاصيات عبر عناصر وسيطة:

`embed:context/motivation-solution.js`

## قبل أن تستخدم السياق {#before-you-use-context}

يُستخدَم السياق بشكل أساسي عند الحاجة للوصول إلى بعض البيانات من قبل العديد من المكونات في مستويات متداخلة مختلفة، ولكن لا يجب استخدامه بكثرة لأنّه يجعل من إعادة استخدام المكونات أمرًا أكثر صعوبة.

**إن أردت فقط تجنّب تمرير بعض الخاصيّات عبر العديد من المستويات, فسيكون استخدام [التراكيب](/docs/composition-vs-inheritance.html) حلًّا أسهل من استخدام السياق.**

على سبيل المثال افترض وجود مكون للصفحة `Page` والذي يُمرِّر خاصيّات المستخدم `user` وحجم الصورة الرمزية `avatarSize` عبر مستويات عديدة إلى الأسفل بحيث تتمكّن مكونات الرابط `Link` والصورة الرمزية `Avatar` الموجودة في مستويات عميقة ومتداخلة أن تقرأها:

```js
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... which renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... which renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

قد يبدو من الفائض تمرير الخاصيّات `user` و `avatarSize` عبر مستويات عديدة إلى الأسفل إن كان يحتاجه في النهاية فقط المكوّن `Avatar`. من المزعج أيضًا كلّما احتاج المُكوِّن `Avatar` المزيد من الخاصيّات من المستويات الأعلى فيجب عليك إضافتها في كل المستويات الوسيطة أيضًا.

من طرق حل هذه المشكلة **دون السياق** [تمرير المكون `Avatar` نفسه للأسفل](/docs/composition-vs-inheritance.html#containment) بحيث لا تحتاج المكوّنات الوسيطة أن تعلم حول الخاصيّة `user` أو `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
```

مع هذا التغيير يحتاج فقط المكون `Page` ذو المستوى الأعلى إلى أن يعرف عن استخدام المكوّنات `Link` و `Avatar` للمكوّنات `user` و `avatarSize`.

<<<<<<< HEAD
يؤدي *قلب السيطرة* هذا إلى جعل شيفرتك أسهل في العديد من الحالات عن طريق تقليل كمية الخاصيّات التي تحتاج تمريرها عبر تطبيقك ويُعطيك سيطرة أكبر على المكوّنات الجذريّة. على الرغم من ذلك، لا يكون ذلك هو الخيار الأنسب في كل حالة، حيث أنّ نَقل المزيد من التعقيد إلى مستوى أعلى في الشجرة يجعل من المكونات ذات المستوى الأعلى أكثر تعقيدًا ويجبر المكونات ذات المستويات الأدنى أن تكون مرنة أكثر مما قد ترغب.
=======
This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. Such inversion, however, isn't the right choice in every case; moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.
>>>>>>> 4fa06486cdb8c5a1cd7e3d88b24e76b1920f33fd

لن تكون محدودًا بمكوّن ابن واحد، فبإمكانك تمرير مكونات أبناء متعددة أو حتى امتلاك منافذ منفصلة متعددة للأبناء كما هو موثق هنا:

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

يكفينا هذا النمط للعديد من الحالات عند الحاجة لفصل مكوّن ابن عن المكونات الآباء له. وبإمكانك أخذ هذا إلى أبعد من ذلك عن طريق خاصيّات التصيير إن كان المكوّن الابن يحتاج إلى التواصل مع المكوّن الأب قبل التصيير.

على أية حال، تحتاج بعض البيانات أحيانًا أن تكون قابلة للوصول من قبل العديد من المكوّنات في الشجرة، وبمستويات متداخلة مختلفة. يُتيح لك السياق نشر مثل هذه البيانات وتغييراتها إلى جميع المكوّنات في المستويات الأدنى. تتضمّن الأمثلة الشائعة التي يكون فيها استخدام السياق أسهل من البدائل: إدارة اللغة الحالية، أو القالب، أو مخبأ البيانات (cache).

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

يُنشِئ الزوج `{ Provider, Consumer }`.
عند تصيير React للسياق `Consumer` فستقرأ قيمة السياق الحالية من أقرب مُزوِّد `Provider` فوقها في الشجرة.
يُستخدَم الوسيط defaultValue عن طريق المستهلك `Consumer` فقط عندما لا يجد مزوّد `Provider` مُطابِق فوقه في الشجرة. يُفيد هذا من أجل اختبار المُكوّنات على انفراد بدون تغليفها.

<<<<<<< HEAD
لا يُؤدّي تمرير القيمة `undefined` كقيمة للمُزوِّد إلى استخدام المستهلك `Consumer` للقيمة `defaultValue`.
=======
The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.
>>>>>>> 4fa06486cdb8c5a1cd7e3d88b24e76b1920f33fd

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

وهو مُكوِّن React الذي يسمح للمستهلك Consumer بأن يُشارك في تغييرات السياق.

تقبل الخاصية `value` بأن تعطى للمكونات المتستهلكة `consuming components` التي تنحدر من مزود. من الممكن لمزود واحد فقط أن يربط مع عدة مستهلكات. يمكن تداخل المزودات لتجاوز القيم بشكل أعمق داخل الشجرة.

كل المستهلكات `Consumers` المنحدرة عن المُزوِّد ستُعيد التصيير عندما تتغير قيمة الخاصيّة `value` للمُزوّد. لا يخضع الانتشار من المُزوّد إلى المستهلكات المنحدرة عنه (بما فيها [`.contextType`](#classcontexttype) و[`useContext`](/docs/hooks-reference.html#usecontext)) إلى التابع `shouldComponentUpdate`، لذا يُحدَّث المستهلك حتى ولو كان المكوّن الأب غير خاضع للتحديث.

تُحدَّد التغييرات عن طريق مقارنة القيم الجديدة والقديمة باستخدام نفس الخوارزمية مثل [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description). 

> ملاحظة
> 
> قد تُسبِّب طريقة التغييرات المُحدَّدة بعض المشاكل عند تمرير الكائنات في الوسيط `value`: سنتحدّث عن المزيد في [ قسم المحاذير](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```

<<<<<<< HEAD
يمكن إسناد الخاصية  `contextType` p في أي صنف إلى كائن سياق (Context object) أنشئ بوساطة [`React.createContext()`](#reactcreatecontext). يمكِّنك ذلك من استهلاك أقرب قيمة حالية لنوع ذلك السياق باستعمال `this.context`. تستطيع الإشارة عبر مرجع إلى هذا في أي تابع من توابع دورة الحياة بما فيها الدالة `render`.
=======
The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). Using this property lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.
>>>>>>> 4fa06486cdb8c5a1cd7e3d88b24e76b1920f33fd

> ملاحظة:
>
> تستطيع الاشتراك في سياق وحيد باستعمال الواجهة البرمجية هذه. إن احتجت إلى قراءة المزيد من أكثر من سياق واحد، اطلع على القسم [استهلاك سياقات متعددة](#consuming-multiple-contexts).
>
> إن كنت تستخدم صياغة حقول الصنف العامة [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/) التجريبية، تستطيع استعمال حقل صنف ساكن (static class field) لتهيئة نوع السياق `contextType` الخاص بك.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* value صيّر شيئًا بناءً على القيمة */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* صيّر شيئًا بناء على قيمة السياق */}
</MyContext.Consumer>
```

<<<<<<< HEAD
يتغير مكون React الذي يشترك بسياق، وهذا يمكِّنك من الاشتراك بسياق ضمن [مكون دالة](/docs/components-and-props.html#function-and-class-components).
=======
A React component that subscribes to context changes. Using this component lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).
>>>>>>> 4fa06486cdb8c5a1cd7e3d88b24e76b1920f33fd

تتطلب الخاصية `Consumer` [دالةً على أنَّها ابنٌ](/docs/render-props.html#using-props-other-than-render). إذ تستقبل هذه الدالة قيمة السياق الحالي وتعيد عقدة React. الوسيط `value` المُمرَّر إلى الدالة سيكون مساويًّا إلى قيمة الخاصية `value` لأقرب مزود (Provider) لهذا السياق في الشجرة أعلاه. إن لم يكن هنالك مزود (Provider) لهذا السياق أعلاه، فسيكون الوسيط `value` مساويًا إلى القيمة `defaultValue` التي مُرِّرت إلى `()createContext`.

> ملاحظة
> 
> للمزيد من المعلومات حول النمط "دالة على أنَّها ابنٌ"، اطلع على توثيق [خاصيات التصيير](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

كائن السياق يقبل خاصية `displayName` string. React DevTools يستخدم هذه السلسلة لتحديد ما يجب عرضه للسياق.

مثلا، المكون التالي سيظهر بصفته MyDisplayName على الـDevTools:
```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## أمثلة {#examples}

### السياق الديناميكي {#dynamic-context}

مثال أكثر تعقيدًا مع قيم ديناميكية للقالب :

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### تحديث السياق من المكونات المتداخلة {#updating-context-from-a-nested-component}

من الضروري أحيانًا تحديث السياق من المكون المتداخل بعمق في مكانٍ ما من شجرة المكونات. في هذه الحالة تستطيع تمرير دالة إلى الأسفل عبر السياق للسماح للمستهلكات بتحديث السياق:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### استهلاك سياقات متعددة {#consuming-multiple-contexts}

لإبقاء قدرة السياق على إعادة التصيير بشكل سريع، تحتاج React إلى جعل كل مستهلك سياق على شكل عقدة منفصل في الشجرة:

`embed:context/multiple-contexts.js`

إن كانت قيمة سياقين أو أكثر مستخدمة معًا، فقد ترغب بالنظر إلى إنشاء مكون خاصية التصيير الخاص بك والذي يزودك بكليهما معًا.

## محاذير {#caveats}

بما أنّ السياق يستخدم هوية المرجع لتحديد وقت إعادة التصيير، فهنالك بعض الأشياء التي قد تُطلِق تصييرات غير مقصودة في المستهلكات `consumers` عندما يُعيد المُزوِّد `provider` الأب التصيير. على سبيل المثال ستُعيد الشيفرة التالية تصيير جميع المستهلكات في كل مرة يُعيد فيها المُزوّد التصيير، وذلك بسبب إنشاء كائن جديد دومًا للخاصيّة `value`:

`embed:context/reference-caveats-problem.js`


ولكي تلتف على هذا احتفظ بقيمة `value` في حالة الأب:

`embed:context/reference-caveats-solution.js`

## واجهة برمجة التطبيقات القديمة {#legacy-api}

> ملاحظة
> 
> كانت تأتي React سابقًا مع واجهة برمجة تطبيقات (API) تجريبية للسياق. ستبقى هذه الواجهة مدعومة في جميع الإصدارات ‎16.x‎، ولكن يجب على التطبيقات التي تستخدمها أن تنتقل إلى الإصدار الجديد. ستُزال هذه الواجهة القديمة في إصدار React المستقبلي الرئيسي. اقرأ توثيق السياق القديم [من هنا](/docs/legacy-context.html).

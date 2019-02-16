---
id: components-and-props
title: المكونات والخاصيات
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

تتيح لنا المُكوِّنات (Components) تقسيم واجهة المستخدم إلى قطع مُستقِلَّة قابلة لإعادة الاستخدام، والتفكير بكل قطعة على انفراد. سنتحدّث في هذه الصفحة عن مُقدّمة إلى مفهوم المُكوِّنات،  بإمكانك أن تجد مرجعًا مُفصَّلًا حول [واجهة برمجة التطبيق (API) الخاصّة بالمُكوِّنات من هنا](/docs/react-component.html).

تُشبِه المُكوِّنات من الناحية النظريّة دوال JavaScript، فهي تقبل مُدخَلات المستخدم (والتي تُدعى props اختصارًا للكلمة properties وتعني الخاصيّات) وتُعيد عناصر React وصف ما الذي ينبغي عرضه على الشّاشة.

## مكونات الأصناف والدوال {#function-and-class-components}

إنّ أبسط طريقة لتعريف مُكوِّن هي كتابة دالة JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

تُعدّ هذه الدالة مُكوِّنًا صالحًا في React لأنّها تقبل وسيطًا واحدًا من خاصيّات الكائن "props" (اختصارًا للكلمة properties وتعني الخاصيّات) مع بياناته وتُعيد عنصر React. ندعو مثل هذه المُكوِّنات بالمُكوِّنات الداليّة "function components" لأنّها عبارة عن دوال JavaScript.

بإمكانك أيضًا أن تستخدم [الأصناف "ES6 class"](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) لتعريف المُكوِّنات كما يلي:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

إنّ المُكوِّنين السابقين مُتكافِئان من وجهة نظر React.

تمتلك الأصناف بعض الميّزات الإضافيّة التي سنتحدّث عنها في قسم [القسم التالي](/docs/state-and-lifecycle.html). وحتى ذلك الوقت سنستخدم المُكوِّنات الداليّة لبساطتها.

## تصيير المكوّنات (Rendering) {#rendering-a-component}

م نصادف حتى الآن إلّا عناصر React تُمثِّل عناصر DOM المُعتادة:

```js
const element = <div />;
```

ولكن يُمكِن للعناصر أن تُمثِّل مُكوِّنات مُعرَّفة من قبل المستخدم:

```js
const element = <Welcome name="Sara" />;
```

عندما تجد React عنصرًا يُمثِّل مُكوِّنًا مُعرَّفًا من قبل المستخدم، فستُمرِّر خاصيّات JSX إليه على شكل كائن وحيد، ندعو هذا الكائن "props".

لى سبيل المثال تعرض هذه الشيفرة عبارة "Hello, Sara" في الصّفحة:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

تلخيص ما حدث في هذا المثال:

1. نستدعي التّابع `ReactDOM.render()` مع العنصر `<Welcome name="Sara" />`.
2. تستدعي React المُكوِّن `Welcome` مع تمرير `{name: 'Sara'}` كخاصيّة props.
3. يُعيد العنصر `Welcome` العنصر `<h1>Hello, Sara</h1>` كنتيجة له.
4. تُحدِّث React DOM بكفاءة DOM ليُطابِق `<h1>Hello, Sara</h1>`.

>**ملاحظة:** يجب أن تبدأ أسماء المُكوِّنات دومًا بأحرف كبيرة.
>
>تُعامِل React المُكوِّنات التي تبدأ بأحرف صغيرة كعناصر DOM، على سبيل المثال يُمثِّل `<div />` عنصر HTML الذي يُدعى div، بينما تُمثِّل `<Welcome />` مُكوِّنًا في React وتتطلَّب أن يكون تعريف هذا المُكوِّن موجودًا ضمن المجال المُحدَّد.
>
>بإمكانك قراءة المزيد عن المنطق الكامن وراء هذه الاتفاقيّة [من هنا](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## تركيب المكونات {#composing-components}

يُمكِن للمُكوِّنات أن تشير إلى مُكوِّنات أخرى في ناتجها، يسمح لنا هذا باستخدام نفس المُكوِّن المُجرَّد لأي درجة من التفصيل، زر (button)، أو حقل إدخال (form)، أو مربّع حوار (dialog)، أو شاشة (screen)، ففي React يُعبَّر عنها جميعها بالمُكوِّنات.

على سبيل المثال يُمكننا إنشاء مُكوِّن اسمه `App` يعرض في ناتجه المُكوِّن `Welcome` عدّة مرّات:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

تحتوي تطبيقات React الجديدة عادةً على المُكوِّن `App` في المستوى الأعلى وتنحدر عنه باقي المُكوِّنات، ولكن إن كنت تدمج React مع تطبيق موجود مُسبقًا فقد تبدأ من المستوى السفلي بمُكوِّن صغير مثل الزر `Button` وتصعد تدريجيًّا حتى المستوى الأعلى في هيكليّة التطبيق.

## استخراج المكونات {#extracting-components}

لا تتردد بتقسيم المُكوِّنات إلى مُكوِّنات أصغر.

على سبيل المثال انظر إلى مُكوِّن التعليقات `Comment` التالي:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

يقبل هذا المُكوِّن الكائن `author`، والسلسلة النصيّة `text`، والتاريخ `date` كخاصيات props له، ويُمثِّل تعليقًا على مواقع التواصل الاجتماعي.

من الصعب تغيير هذا المُكوِّن بسبب هذه التداخلات، ومن الصعب أيضًا إعادة استخدام أجزاء منه، فلنحاول استخراج بعض المُكوِّنات منه.

سنستخرج في البداية مُكوِّن الصورة الرمزيّة `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

لا يحتاج المُكوِّن `Avatar` إلى معرفة أنّه مُستخدَم في المُكوِّن `Comment`. ولذلك أعطينا خاصيّاته prop اسمًا أكثر عموميّةً وهو: `user` بدلًا من `author`.

نوصي بتسمية الخاصيّات props من وجهة نظر المُكوِّن نفسه وليس في السياق الذي تُستخدَم فيه.

بإمكاننا الآن تبسيط المُكوِّن `Comment` قليلًا:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

سنستخرج الآن مُكوِّن معلومات المستخدم `UserInfo` والذي يعرض المُكوِّن `Avatar` بجانب اسم المستخدم:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

يُتيح لنا هذا تبسيط المُكوِّن `Comment` أكثر:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

يبدو استخراج المُكوِّنات في البداية عملًا مجهدًا، ولكن سنرى الفائدة الكبيرة لامتلاك عدّة مُكوِّنات قابلة لإعادة الاستخدام عند بناء تطبيقات كبيرة. القاعدة هنا هي: إن استخدمنا أجزاء واجهة المستخدم عدّة مرّات (مثل الزر `Button`، و اللوحة `Panel`، والصورة الرمزيّة `Avatar`)، أو كانت هذه الأجزاء مُعقّدة بحد ذاتها (مثل مُكوِّن التطبيق `App`، و `FeedStory`، والتعليق `Comment`)، فهي مُرشَّحة بشكل كبير لأن نجعلها مُكوِّنات قابلة لإعادة الاستخدام.

## الخاصيات props قابلة للقراءة فقط {#props-are-read-only}

لا يجب تعديل خاصيّات المُكوِّنات، سواءً صرّحنا عنها [كدالة أو كصنف](#function-and-class-components)، فلنأخذ هذا المثال عن دالة الجمع `sum`:

```js
function sum(a, b) {
  return a + b;
}
```

تُدعى هذه الدوال [بالدوال النقيّة (Pure Functions)](https://en.wikipedia.org/wiki/Pure_function) لأنّها لا تحاول تغيير مُدخلاتها وتُعيد دومًا نفس النتيجة لنفس المُدخلات.

على العكس من ذلك نجد أنّ هذه الدالة غير نقية لأنّها تُغيِّر مُدخلاتها:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

إنّ React مرنة جدًّا ولكن لديها قاعدة واحدة صارمة وهي:

**يجب أن تسلك مُكوِّنات React سلوك الدوال النقيّة مع احترامها لخاصيّاتها (props).**

تتغيّر واجهات المستخدم الخاصّة بالتطبيق مع الزمن بالطبع، سنتحدّث في [القسم التالي](/docs/state-and-lifecycle.html)، حول مفهوم جديد وهو الحالة (state). حيث تسمح الحالة لمُكوِّنات React بتغيير ناتجها مع مرور الزمن استجابةً لتفاعل المستخدم، والردود القادمة من الشبكة، وأي شيء آخر، بدون خرق هذه القاعدة.

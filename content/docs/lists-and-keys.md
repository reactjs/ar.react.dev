---
id: lists-and-keys
title: القوائم و المفاتيح
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

فلنتذكّر أولًا كيفيّة تحويل القوائم في JavaScript. 

في المثال التالي سنستخدم الدالة  [`()map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) لمضاعفة قيم مصفوفة من الأرقام اسمها `numbers`، وسنُعيِّن المصفوفة الجديدة التي تُعيدها الدالة `map ()`‎ إلى المتغير `doubled` ثم نعرض محتواه عبر التابع `console.log()‎`:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

نتيجة تنفيذ هذا المثال هي `[2 ، 4 ، 6 ، 8 ، 10]`.

يكون تحويل المصفوفات في React إلى قوائم من العناصر مماثلًا تقريبًا لذلك. 

###  تصيير عدة مكونات {#rendering-multiple-components} 

يمكنك بناء مجموعة من عناصر و [إحوائهم في JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx)   بإستخدام العارضتين `{}`.


في المثال التالي سنستخدم الدالة [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)‎ للمرور على جميع عناصر مصفوفة الأرقام `numbers` بحيث نُعيد عنصر `<li>` لكل عنصر من هذه المصفوفة. وأخيرا نُعيِّن مصفوفة العناصر الناتجة إلى المتغير `listItems`:


```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

نضع الآن كامل المصفوفة `listItems` بداخل عنصر `<ul>`، ونُصيِّره إلى [DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**جرب الأن على CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

تعرض هذه الشيفرة قائمة منقطة مؤلفة من الأرقام بين 1 و 5. 

### مكون يحتوي على قائمة بسيطة {#basic-list-component}

نُصيِّر عادةً القوائم بداخل  [المُكوِّنات](/docs/components-and-props.html). لذلك بإمكاننا إعادة كتابة المثال السابق باستخدام مُكوِّن يقبل مصفوفة من الأرقام تُدعى `numbers` ويعرض عناصرها على شكل قائمة غير مرتبة:

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

عندما تُنفَّذ هذه الشيفرة ستتلقى تحذيرًا أنّه يجب تزويد مفتاح (key) لعناصر القائمة. والمفتاح هو عبارة عن خاصيّة على شكل سلسلة نصيّة يجب إضافتها عند إنشاء قوائم من العناصر. سنتحدث لاحقا عن أهميته في موضوع القادم.

فلنُعيِّن مفتاح `key` لعناصر القائمة بداخل التابع `numbers.map()` وبذلك نُصلِح مشكلة المفتاح المفقود:

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**جرب الأن على CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## المفاتيح (Keys) {#keys}

تُساعِد المفاتيح React على معرفة العناصر التي تغيرت، أو أُضيفت، أو أُزيلت. يجب أن تُعطَى المفاتيح للعناصر بداخل المصفوفة وذلك لإعطاء هذه العناصر هوية مستقرة:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

أفضل طريقة لانتقاء مفتاح هي استخدام سلسلة نصيّة تُعرِّف بشكل فريد عنصر القائمة عن العناصر الأخرى، نستخدم غالبًا المُعرِّفات (IDs) من بياناتنا كمفاتيح:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

عندما لا تملك مُعرِّفات مستقرة للعناصر، فبإمكانك استخدام فهرس العنصر `index` كمفتاح كملاذ أخير:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // افعل ذلك فقط إن لم لكن للعناصر معرّفات مستقرة
  <li key={index}>
    {todo.text}
  </li>
);
```

لا نُفضِّل استخدام فهارس العناصر إن كان ترتيبها عُرضةً للتغيير، فقد يُؤثِّر هذا بشكل سلبي على الأداء وقد يسبب مشاكل مع حالة المُكوِّن. اطّلع على  [هذا المقال للحصول على شرح مُفصّل للتأثيرات السلبية لاستخدام الفهرس كمفتاح](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)  . إن اخترت عدم تعيين مفتاح لعناصر القائمة فستستخدم React الفهارس كمفاتيح بشكل افتراضي.

إن كنت ترغب بمعرفة المزيد ستجد هنا  [ شرحا مفصلا حول أهمية المفاتيح](/docs/reconciliation.html#recursing-on-children).

### استخراج المكونات ذات المفاتيح {#extracting-components-with-keys}

يكون للمفاتيح معنى فقط في سياق المصفوفة الموجودة ضمنها.

فمثلًا إن استخرجت المُكوِّن `ListItem` فيجب أن تحتفظ بالمفتاح ضمن العناصر `<ListItem />` الموجودة في المصفوفة بدلًا من وضعه في العنصر `<li>` لموجود في المُكوِّن `ListItem`.

**مثال: الاستخدام الخاطئ للمفتاح**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // .خطأ! فليس هنالك حاجة لتحديد المفتاح هنا
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // .خطأ! فليس هنالك حاجة لتحديد المفتاح هنا
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**مثال: الاستخدام الصحيح للمفتاح**

```javascript{2,3,9,10}
function ListItem(props) {
  // .صحيح! فليس هنالك حاجة لتحديد المفتاح هنا
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // .صحيح! يجب تحديد المفتاح بداخل المصفوفة
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**جرب الأن على CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

وكقاعدة عامة تحتاج العناصر المُستدعاة من قبل التابع `map()`‎ إلى مفاتيح. 

### ينبغي أن تكون المفاتيح فريدة فقط ضمن العناصر الأشقاء {#keys-must-only-be-unique-among-siblings}

يجب أن تكون العناصر المستخدمة ضمن المصفوفات فريدة من بين العناصر الأشقاء لها، ولكن ليس بالضرورة أن تكون فريدة بشكل عام، فيمكننا استخدام نفس المفاتيح عند إنتاج مصفوفتين مختلفتين:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**جرب الأن على CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

تعمل المفاتيح كتلميح في React، ولكنها لا تُمرَّر إلى المُكوِّنات. إن احتجت نفس القيمة في مُكوِّناتك فمرّرها بشكل صريح كخاصيّة prop مع استخدام اسم آخر:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

في المثال السّابق يستطيع المُكوِّن `Post` قراءة `props.id` ولكن لا يُمكنه قراءة `props.key`. 

### تضمين التابع map()‎ في JSX {#embedding-map-in-jsx}

صرّحنا في الأمثلة السّابقة عن المتغير `listItems` بشكلٍ مُنفصل وضمّناه في JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

تسمح JSX [بتضمين أي تعبير](/docs/introducing-jsx.html#embedding-expressions-in-jsx) موجود بين قوسين لذا يمكننا وضع نتيجة التابع `map()` بشكل سطري (inline):

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**جرب الأن على CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

يُؤدّي هذا أحيانًا إلى شيفرةٍ مفهومةٍ بشكلٍ أكبر، ولكن قد يُساء استخدام هذا التنسيق. كما هو الحال في JavaScript لك حريّة القرار إذا ما كان استخراج المتغيرات لسهولة القراءة يستحق العناء. إن كان جسم التابع `map()‎` متداخلًا كثيرًا فمن الأفضل [استخراج المُكوِّن](/docs/components-and-props.html#extracting-components).

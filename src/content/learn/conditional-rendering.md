---
title: التصيير الشرطي
---

<Intro>

قد تحتاج مكوناتك أحيانًا إلى عرض أشياء مختلفة اعتمادًا على حالات مختلفة. في React، يمكنك عرض JSX شَرطيّا باستعمال صيغة JavaScript مثل تعليمات `if`، `&&` و عمليات `? :`. 

</Intro>

<YouWillLearn>

* كيفية إرجاع JSX مختلف وفقًا لشرط معين؟
* كيفية تضمين أو استبعاد جزء من JSX شَرطيّا
* اختصارات بناء الجمل الشرطية الشائعة التي ستصادفها في أكواد React.

</YouWillLearn>

## إرجاع JSX شَرطيّا {/*conditionally-returning-jsx*/}

لنفترض أن لديك مكون `PackingList` يقوم بعرض عدة مكونات `Item`،  والتي يمكن تمييزها على أنها محزومة أو لا:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

لاحظ أن بعض مكونات `Item` لديها خاصية `isPacked` معينة إلى `true` بدلا من `false`. ترغب في إضافة علامة التحقق (✔) إلى العناصر المحزومة في حالة `isPacked={true}`.

يمكنك كتابة ذلك باستخدام [عبارة `if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) على النحو التالي:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

إذا كانت خاصية `isPacked` صحيحة (true)، فإن هذا الكود **يُرجع شجرة JSX مختلفة**. مع هذا التغيير، تحصل بعض العناصر على علامة التحقق في النهاية:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

جرب تعديل ما يتم إرجاعه في كلتا الحالتين، وشاهد كيف تتغير النتيجة!

لاحظ أنك تقوم بإنشاء منطق تفريعي باستخدام تعليمات جافاسكريبت `if` و `return`. في React، يتم التحكم في التدفق (مثل الشروط) باستخدام JavaScript.

### عدم إرجاع شيء شَرطيّا باستعمال `null` {/*conditionally-returning-nothing-with-null*/}

في بعض الحالات، قد ترغب في عدم عرض أي شيء على الإطلاق. على سبيل المثال، قد ترغب في عدم عرض العناصر المحزومة. يجب على المكون أن يرجع قيمة. في هذه الحالة، يمكنك إرجاع القيمة `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

إذا كانت قيمة `isPacked` صحيحة (true)، فلن يُرجع المكون شيئًا، أي `null`. وإلا، سيقوم بإرجاع JSX للعرض.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

من الناحية العملية، إعادة قيمة `null` من مكون ليست شائعة لأنها قد تفاجئ المطور الذي يحاول عرضها. غالبًا، ستقوم بتضمين المكون شَرطيّا أو استبعاده في JSX الخاص بالمكون الأب. إليك كيفية القيام بذلك!

## تضمين JSX شَرطيّا {/*conditionally-including-jsx*/}

في المثال السابق، تحكمت في شجرة JSX (إن وجدت!) التي سيُرجعها المكون. ربما لاحظت بالفعل بعض التكرار في ناتج العرض:

```js
<li className="item">{name} ✔</li>
```

مشابه جدًا لـ

```js
<li className="item">{name}</li>
```

كلا الفرعين المشروطين يعيدان `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

بينما هذا التكرار ليس ضارًا، إلا أنه قد يجعل الكود أكثر صعوبة في الصيانة. ماذا لو أردت تغيير قيمة className؟ ستضطر للقيام بذلك في مكانين في الكود! في مثل هذه الحالة، يمكنك تضمين القليل من JSX شَرطيّا لجعل الكود الخاص بك [خاليًا من التكرار DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### العامل (الثلاثي) الشرطي (`? :`) {/*conditional-ternary-operator--*/}

يحتوي JavaScript على صيغة مختصرة لكتابة تعبير شرطي -- [العامل الشرطي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) أو ”العامل الثلاثي“ (ternary operator).

بدلا من هذا:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

يمكنك كتابة هذا:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

يمكنك قرائتها على النحو التالي *”إذا كان `isPacked` صحيحا، إذا قم بعرض `name + ' ✔'`، وإلا (`:`) قم بعرض `name`“.*

<DeepDive>

#### هل هذان المثالان متساويان تمامًا؟ {/*are-these-two-examples-fully-equivalent*/}

إذا كنت قادمًا من خلفية البرمجة كائنية التوجه OOP، فقد تفترض أن المثالين أعلاه يختلفان اختلافًا طفيفًا لأن أحدهما قد ينشئ "حالتين" (instance) مختلفين من `<li>`. لكن عناصر JSX ليست "حالات" لأنها لا تحتوي على أي حالة داخلية وليست عناصر DOM حقيقية. إنما هي أوصاف خفيفة، مثل المخططات. إذن هذان المثالان، في الواقع، متساويان تمامًا. يتناول [الحفاظ على الحالة وإعادة تعيينها](/learn/preserving-and-resetting-state) كيفية عمل هذا بالتفصيل.

</DeepDive>

الآن لنفترض أنك ترغب في وضع النص الخاص بالعناصر المكتملة في عنصر HTML إضافي كـ`<del>` لشطبه. يمكنك إضافة المزيد من الأسطر الجديدة والأقواس حتى يكون من الأسهل تضمين JSX إضافي في كل حالة:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

هذا النمط يعمل جيدًا في الشروط البسيطة، ولكن استخدمه باعتدال. إذا أصبحت مكوناتك فوضوية بسبب العلامات الشرطية المتداخلة، ففكر في استخراج المكونات الفرعية لتنظيف الأمور. في React، يعد الترميز جزءًا من الكود الخاص بك، لذا يمكنك استخدام أدوات مثل المتغيرات والدوال لترتيب التعبيرات المعقدة.

### العامل المنطقي AND (`&&`) {/*logical-and-operator-*/}

الاختصار الشائع الآخر الذي ستصادفه هو [العامل المنطقي AND (&&) في JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.). داخل مكونات React، غالبًا ما تظهر عندما تريد عرض بعض JSX فقط عندما يكون الشرط صحيحًا، **وعدم عرض أي شيء في حالة الشرط غير الصحيح**. باستخدام العامل `&&`، يمكنك عرض علامة التحقق شَرطيّا فقط إذا كانت قيمة `isPacked` صحيحة `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

يمكنك قرائتها على النحو التالي *"إذا كانت `isPacked` صحيحة، إذن (`&&`) يعرض علامة التحقق، وإلا لا تعرض أي شيء"*

وإليك كيف يتم تطبيقها عمليًا:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[عبارة && في JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) تقوم بارجاع الجانب الأيمن من العبارة (في حالتنا، علامة التحقق) إذا كان الجانب الأيسر (شرطنا) صحيحًا `true`. ولكن إذا كان الشرط غير صحيح `false`، فإن التعبير بأكمله يصبح غير صحيح `false`. يعتبر React القيمة غير الصحيحة `false` "فجوة" في شجرة JSX، تمامًا مثل القيمتين `null` أو `undefined`، ولا يتم عرض أي شيء مكانها.

<Pitfall>

**لا تضع أرقامًا على الجانب الأيسر من `&&`.**

لاختبار الشرط، يقوم JavaScript تلقائيًا بتحويل الجانب الأيسر إلى قيمة منطقية (boolean). ومع ذلك، إذا كان الجانب الأيسر هو الرقم `0`، فإن التعبير بأكمله يحصل على تلك القيمة (`0`)، وستقوم React بعرض الرقم `0` بدلاً من عدم عرض أي شيء.

على سبيل المثال، من الأخطاء الشائعة كتابة كود مثل `messageCount && <p>New messages</p>`. من السهل أن نفترض أنها لا تقوم بعرض أي شيء عندما تكون قيمة `messageCount` هي `0`، ولكنها في الواقع تقوم بعرض الرقم `0` نفسه!

لإصلاح ذلك، قم بتحويل الجانب الأيسر إلى عبارة منطقية (boolean): `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### إسناد JSX إلى متغير شرطيًّا {/*conditionally-assigning-jsx-to-a-variable*/}

عندما تعيق الاختصارات كتابة الكود، حاول استخدام عبارة `if` ومتغير. يمكنك إعادة تعيين المتغيرات المعرفة بـ [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)، لذا ابدأ بتوفير المحتوى الافتراضي الذي تريد عرضه، الاسم:

```js
let itemContent = name;
```

استخدم عبارة `if` لإعادة تعيين تعبير JSX إلى `itemContent` إذا كانت قيمة `isPacked` صحيحة `true`.

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[الأقواس المنحنية تفتح ”نافذة إلى JavaScript“.](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) قم بتضمين المتغير بواسطة الأقواس المنحنية في شجرة JSX المُرجَعة، مدمجًا التعبير المجهز سابقا داخل JSX:

```js
<li className="item">
  {itemContent}
</li>
```

هذا النمط هو الأكثر تفصيلاً، ولكنه أيضًا الأكثر مرونة. وإليك كيف يتم تطبيقه عمليًا:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

كما هو الحال من قبل، لا يعمل هذا فقط مع النصوص ولكن أيضًا لأي JSX تريده:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

إذا لم تكن معتادًا على استخدام JavaScript، فإن هذا التنوع في الأنماط قد يبدو مُرهِقًا في البداية. ومع ذلك، ستساعدك معرفة هذه الأنماط على قراءة وكتابة أي كود JavaScript - وليس فقط مكونات React! اختر الأسلوب الذي تفضله كبداية، وعُد لهذا المرجع مرة أخرى إذا نسيت كيفية عمل الأساليب الأخرى.

<Recap>

* في React، يمكنك التحكم في منطق التفريع باستخدام JavaScript.
* يمكنك إرجاع تعبير JSX شرطيًا باستخدام عبارة `if`.
* يمكنك حفظ تعبير JSX شرطيًا في متغير ومن ثم تضمينه داخل تعبير JSX آخر باستخدام الأقواس المنحنية.
* في JSX، `{cond ? <A /> : <B />}` تعني *”إذا `cond`, اعرض `<A />`, وإلا قم بعرض `<B />`“*.
* في JSX، `{cond && <A />}` تعني *”إذا `cond`، اعرض `<A />`، وإلا لا تقم بعرض أي شيء“*.
* الاختصارات شائعة، ولكنك لست مضطر استخدامها إذا كنت تفضل استخدام `if`.

</Recap>

<Challenges>

#### عرض أيقونة للعناصر غير المكتملة باستخدام `? :` {/*show-an-icon-for-incomplete-items-with--*/}

استخدم العامل الشرطي `(cond ? a : b)` لعرض ❌ إذا لم تكن قيمة `isPacked` صحيحة `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### إظهار أهمية العنصر باستخدام `&&` {/*show-the-item-importance-with-*/}

في هذا المثال، يتلقى كل عنصر `Item` خاصية رقمية `importance`. استخدم العامل `&&` لعرض "_(Importance: X)_" بخط مائل (italics)، ولكن فقط للعناصر ذات أهمية غير صفرية. ستكون قائمة العناصر الخاصة بك على النحو التالي:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

لا تنسَ إضافة مسافة بين الوسمين!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

هذا ينبغي أن يقوم بالعملية:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

لاحظ أنه يجب كتابة `importance > 0 && ...` بدلاً من `importance && ...` حتى لا يتم عرض القيمة `0` كنتيجة إذا كانت قيمة `importance` هي `0`.

في هذا الحل، يتم استخدام شرطين منفصلين لإدراج مسافة بين الاسم ووسم الأهمية. بدلاً من ذلك، يمكنك استخدام مكوّن الأجزاء (fragment) مع إضافة مسافة في البداية: `importance > 0 && <> <i>...</i></>` أو إضافة مسافة مباشرة داخل عنصر `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### إعادة هيكلة سلسلة من عبارات `? :` إلى عبارة `if` ومتغيرات. {/*refactor-a-series-of---to-if-and-variables*/}

يستخدم مكون `Drink` سلسلة من العبارات `? :` لعرض معلومات مختلفة اعتمادًا على قيمة الخاصية `name` إذا كانت "tea" أو "coffee". المشكلة هي تشتت المعلومات المتعلقة بكل مشروب عبر عدة شروط. قم بإعادة هيكلة هذا الكود لاستخدام تعليمة `if` واحدة بدلاً من ثلاث عبارات `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

بمجرد إعادة هيكلة الكود لاستخدام تعليمة `if`، هل لديك أفكار إضافية حول كيفية تبسيطه؟

<Solution>

هناك طرق متعددة يمكنك اتباعها، ولكن إليك نقطة بداية مقترحة:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

هنا تم تجميع المعلومات المتعلقة بكل مشروب معًا بدلاً من نشرها عبر عدة شروط. هذا يسهل إضافة مشروبات إضافية في المستقبل.

حل آخر سيكون بإزالة الشرط تمامًا من خلال نقل المعلومات إلى كائنات:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>

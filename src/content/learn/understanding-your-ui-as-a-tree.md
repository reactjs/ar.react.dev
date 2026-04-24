---
title: فهم واجهتك كشجرة
---

<Intro>

يأخذ تطبيق React شكله مع تداخل العديد من المكوّنات داخل بعضها. كيف يتتبع React هيكل مكوّنات تطبيقك؟

يصوّر React، ومكتبات واجهات أخرى كثيرة، الواجهة كشجرة. التفكير في تطبيقك كشجرة مفيد لفهم العلاقة بين المكوّنات. هذا الفهم يساعدك لاحقًا في تصحيح مفاهيم مثل الأداء وإدارة الحالة.

</Intro>

<YouWillLearn>

* كيف «يرى» React هيكل المكوّنات
* ما شجرة العرض وما فائدتها
* ما شجرة اعتماد الوحدات وما فائدتها

</YouWillLearn>

## واجهتك كشجرة {/*your-ui-as-a-tree*/}

الشجرات نموذج علاقات بين عناصر. غالبًا تُمثَّل الواجهة ببنى شجرية. على سبيل المثال، المتصفحات تستخدم أشجارًا لنمذجة HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) وCSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). المنصات المحمولة أيضًا تستخدم أشجارًا لتمثيل تسلسل العرض.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="مخطط بثلاثة أقسام أفقية. في القسم الأول ثلاث مستطيلات عمودية مع تسميات «Component A» و«Component B» و«Component C». انتقال إلى اللوحة التالية بسهم عليه شعار React ومكتوب «React». القسم الأوسط يحتوي شجرة مكوّنات جذرها «A» وطفلان «B» و«C». الانتقال التالي بسهم عليه شعار React ومكتوب «React DOM». القسم الثالث إطار متصفح فيه شجرة من 8 عقد، مع تمييز جزء فقط (يشير إلى الشجرة الفرعية من القسم الأوسط).">

ينشئ React شجرة واجهة من مكوّناتك. في هذا المثال تُستخدم شجرة الواجهة بعد ذلك للرسم إلى DOM.
</Diagram>

مثل المتصفحات والمنصات المحمولة، يستخدم React أيضًا بنى شجرية لإدارة ونمذجة العلاقة بين المكوّنات في تطبيق React. هذه الأشجار أدوات مفيدة لفهم كيف تتدفق البيانات عبر التطبيق وكيف تحسّن الرسم وحجم التطبيق.

## شجرة العرض {/*the-render-tree*/}

من أهم ميزات المكوّنات القدرة على تكوين مكوّنات من مكوّنات أخرى. عندما [نُدخل مكوّنات داخل بعضها](/learn/your-first-component#nesting-and-organizing-components)، نحصل على مفهوم المكوّن الأب والابن، حيث كل أب قد يكون ابنًا لمكوّن آخر.

عندما نعرض تطبيق React، يمكن نمذجة هذه العلاقة في شجرة تُعرف بشجرة العرض.

إليك تطبيق React يعرض اقتباسات تحفيزية.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="تطبيق ملهم" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>اقتباسك التحفيزي هو:</p>
      <FancyText text={quote} />
      <button onClick={next}>ألهمني مجددًا</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "لا تدع الأمس يستهلك الكثير من اليوم." — ويل روجرز",
  "الطموح أن تضع سلمًا نحو السماء.",
  "الفرحة المشتركة فرحة مضاعفة.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="رسم شجري بخمس عقد. كل عقدة تمثل مكوّنًا. جذر الشجرة App، وسهمان منه إلى InspirationGenerator وFancyText. السهام مكتوب عليها «renders». عقدة InspirationGenerator لها سهمان إلى FancyText وCopyright.">

ينشئ React *شجرة عرض*، أي شجرة واجهة مكوّنة من المكوّنات المرسومة.


</Diagram>

من تطبيق المثال يمكننا بناء شجرة العرض أعلاه.

الشجرة مكوّنة من عقد، كل عقدة تمثل مكوّنًا. `App` و`FancyText` و`Copyright`، على سبيل المثال لا الحصر، كلها عقد في شجرتنا.

العقدة الجذرية في شجرة عرض React هي [المكوّن الجذري](/learn/importing-and-exporting-components#the-root-component-file) للتطبيق. هنا المكوّن الجذري هو `App` وهو أول مكوّن يرسمه React. كل سهم في الشجرة يشير من مكوّن أب إلى مكوّن ابن.

<DeepDive>

#### أين وسوم HTML في شجرة العرض؟ {/*where-are-the-html-elements-in-the-render-tree*/}

ستلاحظ أن شجرة العرض أعلاه لا تذكر وسوم HTML التي يرسمها كل مكوّن. ذلك لأن شجرة العرض تتكوّن فقط من [مكوّنات](learn/your-first-component#components-ui-building-blocks) React.

React كإطار واجهة مستقل عن المنصة. على react.dev نعرض أمثلة ترسم للويب الذي يستخدم HTML كوحدات واجهة أساسية. لكن تطبيق React قد يرسم بنفس السهولة إلى منصة محمولة أو سطح مكتب قد تستخدم وحدات واجهة مختلفة مثل [UIView](https://developer.apple.com/documentation/uikit/uiview) أو [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

هذه الوحدات الأساسية للمنصة ليست جزءًا من React. أشجار عرض React يمكن أن تمنح رؤية لتطبيق React بغض النظر عن المنصة التي يرسم إليها.

</DeepDive>

شجرة العرض تمثل *مرة رسم واحدة* لتطبيق React. مع [الرسم الشرطي](/learn/conditional-rendering)، قد يرسم المكوّن الأب أبناء مختلفين حسب البيانات الممررة.

يمكننا تحديث التطبيق ليرسم شرطًا إما اقتباسًا تحفيزيًا أو لونًا.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="تطبيق ملهم" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>{inspiration.type === 'quote' ? 'اقتباسك التحفيزي هو:' : 'لونك الملهم هو:'}</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>ألهمني مجددًا</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "لا تدع الأمس يستهلك الكثير من اليوم." — ويل روجرز"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "الطموح أن تضع سلمًا نحو السماء."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "الفرحة المشتركة فرحة مضاعفة."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="رسم شجري بست عقد. العقدة العليا App، وسهمان إلى InspirationGenerator وFancyText. السهام خطوط صلبة ومكتوب عليها «renders». عقدة InspirationGenerator لها ثلاثة أسهم: إلى FancyText وColor بخط متقطع ومكتوب «renders؟»، والسهم الأخير إلى Copyright بخط صلب ومكتوب «renders».">

مع الرسم الشرطي، عبر عمليات رسم مختلفة، قد ترسم شجرة العرض مكوّنات مختلفة.

</Diagram>

في هذا المثال، حسب قيمة `inspiration.type`، قد نرسم `<FancyText>` أو `<Color>`. شجرة العرض قد تختلف في كل مرة رسم.

رغم أن أشجار العرض قد تختلف بين مرات الرسم، فهي عمومًا مفيدة لتحديد *المكوّنات ذات المستوى الأعلى* و*مكوّنات الأوراق* في التطبيق. مكوّنات المستوى الأعلى هي الأقرب إلى المكوّن الجذر وتؤثر على أداء رسم كل ما تحتها وغالبًا تحوي أكثر التعقيد. مكوّنات الأوراق قرب أسفل الشجرة وليس لها أبناء وغالبًا تُعاد رسمها كثيرًا.

تحديد هذه الفئات مفيد لفهم تدفق البيانات وأداء التطبيق.

## شجرة اعتماد الوحدات {/*the-module-dependency-tree*/}

علاقة أخرى في تطبيق React يمكن نمذجتها بشجرة هي اعتمادات الوحدات. عندما [نقسّم مكوّناتنا](/learn/importing-and-exporting-components#exporting-and-importing-a-component) والمنطق إلى ملفات منفصلة، ننشئ [وحدات JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) قد نصدّر منها مكوّنات أو دوال أو ثوابت.

كل عقدة في شجرة اعتماد الوحدات هي وحدة، وكل فرع يمثل عبارة `import` في تلك الوحدة.

إذا أخذنا تطبيق الإلهام السابق، يمكننا بناء شجرة اعتماد الوحدات، أو شجرة الاعتماد اختصارًا.

<Diagram name="module_dependency_tree" height={250} width={658} alt="رسم شجري بسبع عقد. كل عقدة مسمّاة باسم وحدة. العقدة العليا App.js. ثلاثة أسهم إلى InspirationGenerator.js وFancyText.js وCopyright.js ومكتوب عليها «imports». من InspirationGenerator.js ثلاثة أسهم إلى FancyText.js وColor.js وinspirations.js ومكتوب عليها «imports».">

شجرة اعتماد الوحدات لتطبيق الإلهام.

</Diagram>

العقدة الجذرية للشجرة هي الوحدة الجذرية، وتُعرف أيضًا بملف نقطة الدخول. غالبًا هي الوحدة التي تحتوي المكوّن الجذري.

مقارنةً بشجرة العرض لنفس التطبيق، هناك تشابهات لكن اختلافات بارزة:

* العقد التي تُكوّن الشجرة تمثل وحداتًا لا مكوّنات.
* وحدات ليست مكوّنات، مثل `inspirations.js`، تظهر أيضًا في هذه الشجرة. شجرة العرض تقتصر على المكوّنات.
* يظهر `Copyright.js` تحت `App.js` لكن في شجرة العرض يظهر المكوّن `Copyright` ابنًا لـ`InspirationGenerator`. ذلك لأن `InspirationGenerator` يقبل JSX كـ[children props](/learn/passing-props-to-a-component#passing-jsx-as-children)، فيرسم `Copyright` كابن لكنه لا يستورد الوحدة.

أشجار الاعتماد مفيدة لمعرفة الوحدات اللازمة لتشغيل تطبيق React. عند بناء تطبيق للإنتاج، عادةً خطوة بناء تجمع كل JavaScript اللازم للعميل. الأداة المسؤولة عن ذلك تسمى [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)، وتستخدم bundlers شجرة الاعتماد لتحديد الوحدات التي تُضمَّن.

مع نمو التطبيق، غالبًا يكبر حجم الحزمة. الحزم الكبيرة مكلفة للعميل تنزيلًا وتشغيلًا وقد تؤخر ظهور الواجهة. الإحساس بشجرة اعتماد التطبيق قد يساعد في تصحيح هذه المشاكل.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* الأشجار طريقة شائعة لتمثيل العلاقات بين الكيانات، وغالبًا تُستخدم لنمذجة الواجهة.
* أشجار العرض تمثل التداخل بين مكوّنات React في مرة رسم واحدة.
* مع الرسم الشرطي، قد تتغير شجرة العرض بين عمليات الرسم. بقيم props مختلفة، قد يرسم المكوّن أبناء مختلفين.
* أشجار العرض تساعد في تحديد المكوّنات ذات المستوى الأعلى ومكوّنات الأوراق. المكوّنات ذات المستوى الأعلى تؤثر على أداء رسم كل ما تحتها، ومكوّنات الأوراق غالبًا تُعاد رسمها كثيرًا. تحديدها مفيد لفهم أداء الرسم وتصحيحه.
* أشجار الاعتماد تمثل اعتمادات الوحدات في تطبيق React.
* أدوات البناء تستخدم أشجار الاعتماد لحزم الشيفرة اللازمة لشحن التطبيق.
* أشجار الاعتماد مفيدة لتصحيح حزم كبيرة تبطئ وقت الرسم وتكشف فرص تحسين ما يُحزَم من الشيفرة.

</Recap>

[TODO]: <> (Add challenges)

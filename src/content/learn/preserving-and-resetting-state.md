---
title: الحفاظ على الحالة وإعادة تعيينها
---

<Intro>

الحالة معزولة بين المكوّنات. يتتبع React أي حالة تخص أي مكوّن حسب موضعه في شجرة واجهة المستخدم. يمكنك التحكم في متى تُحفَظ الحالة ومتى تُعاد تعيينها بين عمليات إعادة التصيير.

</Intro>

<YouWillLearn>

* متى يختار React الحفاظ على الحالة أو إعادة تعيينها
* كيف تجبر React على إعادة تعيين حالة المكوّن
* كيف تؤثر المفاتيح `key` والأنواع على بقاء الحالة أم لا

</YouWillLearn>

## الحالة مربوطة بموضع في شجرة التصيير {/*state-is-tied-to-a-position-in-the-tree*/}

يبني React [أشجار تصيير](learn/understanding-your-ui-as-a-tree#the-render-tree) لهيكل المكوّنات في واجهتك.

عندما تعطي مكوّناً حالة، قد تظن أن الحالة «تعيش» داخل المكوّن. لكن الحالة محفوظة فعلياً داخل React. يربط React كل جزء من الحالة التي يحتفظ بها بالمكوّن الصحيح حسب موضعه في شجرة التصيير.

هنا، يوجد وسم JSX واحد `<Counter />` فقط، لكنه يُصيَّر في موضعين مختلفين:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

إليك شكلها كشجرة:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

شجرة React

</Diagram>

</DiagramGroup>

**هذا عدّادان منفصلان لأن كلّاً منهما يُصيَّر في موضعه الخاص في الشجرة.** لا تحتاج عادةً إلى التفكير في هذه المواضع لاستخدام React، لكن فهمها مفيد.

في React، لكل مكوّن على الشاشة حالة معزولة بالكامل. مثلاً، إن صيّرت مكوّنين `Counter` جنباً إلى جنب، يحصل كل منهما على حالتَي `score` و`hover` مستقلتين.

جرّب النقر على العدّادين ولاحظ أنهما لا يؤثران أحدهما على الآخر:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

كما ترى، عند تحديث أحد العدّادين، تُحدَّث حالة ذلك المكوّن فقط:

<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

تحديث الحالة

</Diagram>

</DiagramGroup>


يحتفظ React بالحالة ما دمت تعرض نفس المكوّن في نفس الموضع في الشجرة. لرؤية ذلك، زِد العدّادين، ثم أزل المكوّن الثاني بإلغاء تفعيل مربع «Render the second counter»، ثم أعده بتفعيل المربع:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

لاحظ أنه بمجرد أن تتوقف عن عرض العدّاد الثاني، تختفي حالته بالكامل. لأن React عند إزالة مكوّن يدمّر حالته.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

حذف مكوّن

</Diagram>

</DiagramGroup>

عند تفعيل «Render the second counter»، يُهيأ عدّاد `Counter` ثانٍ وحالته من الصفر (`score = 0`) وتُضاف إلى DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

إضافة مكوّن

</Diagram>

</DiagramGroup>

**يحفظ React حالة المكوّن ما دام يُصيَّر في موضعه في شجرة واجهة المستخدم.** إن أُزيل أو عُرض مكوّن مختلف في نفس الموضع، يلقي React بحالته.

## نفس المكوّن في نفس الموضع يحفظ الحالة {/*same-component-at-the-same-position-preserves-state*/}

في هذا المثال، هناك وسمان JSX مختلفان `<Counter />`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

عند تفعيل أو إلغاء تفعيل المربع، لا تُعاد تعيين حالة العدّاد. سواء كان `isFancy` هو `true` أو `false`، يبقى لديك دائماً `<Counter />` كابن أول للـ`div` الذي يعيده مكوّن الجذر `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

تحديث حالة `App` لا يعيد تعيين `Counter` لأن `Counter` يبقى في نفس الموضع

</Diagram>

</DiagramGroup>


إنه نفس المكوّن في نفس الموضع، فمن منظور React هو نفس العدّاد.

<Pitfall>

تذكّر أن **الموضع في شجرة واجهة المستخدم—وليس في وسوم JSX—هو ما يهم React!** لهذا المكوّن جملتا `return` مختلفتان مع وسوم `<Counter />` مختلفة داخل `if` وخارجه:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

قد تتوقع إعادة تعيين الحالة عند تفعيل المربع، لكن ذلك لا يحدث! لأن **كلا وسمَي `<Counter />` يُصيَّران في نفس الموضع.** لا يعلم React أين تضع الشروط في دالتك. كل ما «يراه» هو الشجرة التي تعيدها.

في الحالتين، يعيد مكوّن `App` `<div>` و`<Counter />` كابن أول. لهذين العدّادين عند React نفس «العنوان»: الابن الأول للابن الأول للجذر. هكذا يطابقهما بين التصيير السابق واللاحق، بغض النظر عن هيكلة منطقك.

</Pitfall>

## مكوّنات مختلفة في نفس الموضع تعيد تعيين الحالة {/*different-components-at-the-same-position-reset-state*/}

في هذا المثال، تفعيل المربع يستبدل `<Counter>` بـ`<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

هنا تبدّل بين أنواع مكوّنات _مختلفة_ في نفس الموضع. في البداية، كان الابن الأول للـ`<div>` يحتوي `Counter`. لكن عند استبداله بـ`p`، أزال React `Counter` من شجرة الواجهة ودمّر حالته.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

عندما يتحوّل `Counter` إلى `p`، يُحذف `Counter` ويُضاف `p`

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

عند العودة، يُحذف `p` ويُضاف `Counter`

</Diagram>

</DiagramGroup>

أيضاً، **عندما تعرض مكوّناً مختلفاً في نفس الموضع، تُعاد تعيين حالة الشجرة الفرعية كاملة.** لرؤية ذلك، زِد العدّاد ثم فعّل المربع:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

تُعاد تعيين حالة العدّاد عند النقر على المربع. رغم أنك تعرض `Counter`، يتغيّر الابن الأول للـ`div` من `section` إلى `div`. عند إزالة `section` من DOM، دُمّرت الشجرة بأكملها تحتها (بما فيها `Counter` وحالته).

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

عندما يتحوّل `section` إلى `div`، يُحذف `section` ويُضاف `div` جديد

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

عند العودة، يُحذف `div` وتُضاف `section` جديدة

</Diagram>

</DiagramGroup>

كقاعدة عامة، **إن أردت الحفاظ على الحالة بين عمليات إعادة التصيير، يجب أن «يتطابق» هيكل شجرتك** من تصيير إلى آخر. إذا اختلف الهيكل، تُدمَر الحالة لأن React يدمّر الحالة عند إزالة مكوّن من الشجرة.

<Pitfall>

لهذا لا يجب تعريف دوال المكوّنات متداخلة.

هنا، دالة مكوّن `MyTextField` معرّفة *داخل* `MyComponent`:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


في كل نقرة على الزر، تختفي حالة الحقل! لأن دالة `MyTextField` *مختلفة* تُنشأ في كل تصيير لـ`MyComponent`. أنت تعرض مكوّناً *مختلفاً* في نفس الموضع، فيعيد React تعيين كل الحالة أسفله. هذا يسبب علل ومشاكل أداء. لتجنّب المشكلة، **عرّف دوال المكوّنات دائماً في المستوى الأعلى، ولا تدخل تعريفاتها.**

</Pitfall>

## إعادة تعيين الحالة في نفس الموضع {/*resetting-state-at-the-same-position*/}

افتراضياً، يحفظ React حالة المكوّن ما دام في نفس الموضع. غالباً هذا ما تريده، فيكون السلوك الافتراضي منطقياً. لكن أحياناً قد تريد إعادة تعيين حالة مكوّن. انظر هذا التطبيق الذي يتيح للاعبين متابعة نقاطهما في كل دور:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

حالياً، عند تغيير اللاعب، تُحفَظ النقطة. يظهر العدّادان `Counter` في نفس الموضع، فيراهما React كـ*نفس* `Counter` الذي تغيّرت خاصية `person` له.

لكن مفهومياً، في هذا التطبيق ينبغي أن يكونا عدّادين منفصلين. قد يظهران في نفس مكان الواجهة، لكن أحدهما لتايلور والآخر لسارة.

هناك طريقتان لإعادة تعيين الحالة عند التبديل بينهما:

1. عرض المكوّنات في مواضع مختلفة
2. إعطاء كل مكوّن هوية صريحة بـ`key`


### الخيار 1: عرض المكوّن في مواضع مختلفة {/*option-1-rendering-a-component-in-different-positions*/}

إن أردت استقلال هذين `Counter`، يمكنك عرضهما في موضعين مختلفين:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* في البداية `isPlayerA` هو `true`. فيحتوي الموضع الأول على حالة `Counter`، والثاني فارغ.
* عند النقر على زر «Next player!» يُفرغ الموضع الأول لكن الثاني يصبح يحتوي `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

الحالة الابتدائية

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

النقر على «التالي»

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

النقر على «التالي» مرة أخرى

</Diagram>

</DiagramGroup>

تُدمَر حالة كل `Counter` في كل مرة يُزال فيها من DOM. لذلك يُعاد التعيين في كل نقرة على الزر.

هذا الحل مناسب عندما يكون لديك قليل من المكوّنات المستقلة في نفس المكان. في هذا المثال، لديك اثنان فقط، فلا مشقة في عرضهما منفصلين في JSX.

### الخيار 2: إعادة تعيين الحالة بمفتاح `key` {/*option-2-resetting-state-with-a-key*/}

هناك أيضاً طريقة أعم لإعادة تعيين حالة مكوّن.

ربما رأيت `key` عند [عرض القوائم.](/learn/rendering-lists#keeping-list-items-in-order-with-key) المفاتيح ليست للقوائم فقط! يمكنك استخدامها ليميّز React بين أي مكوّنات. افتراضياً، React يستخدم الترتيب داخل الأب («العدّاد الأول»، «العدّاد الثاني») للتمييز. لكن المفاتيح تخبر React أن هذا ليس مجرد عدّاد *أول* أو *ثانٍ*، بل عدّاد محدد—مثلاً عدّاد *تايلور*. هكذا يعرف React عدّاد *تايلور* أينما ظهر في الشجرة!

في هذا المثال، لا يتشارك وسما `<Counter />` في الحالة رغم ظهورهما في نفس المكان في JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

التبديل بين تايلور وسارة لا يحفظ الحالة. لأنك **أعطيتهما `key` مختلفين:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

تحديد `key` يخبر React باستخدام المفتاح نفسه كجزء من الموضع، بدلاً من ترتيبهما داخل الأب. لذلك، رغم عرضهما في نفس المكان في JSX، يراهما React كعدّادين مختلفين ولن يتشاركا الحالة أبداً. في كل مرة يظهر فيها عدّاد، تُنشأ حالته. في كل مرة يُزال، تُدمَر حالته. التبديل بينهما يعيد تعيين الحالة مراراً.

<Note>

تذكّر أن المفاتيح ليست فريدة عالمياً. إنها تحدد الموضع *داخل الأب* فقط.

</Note>

### إعادة تعيين نموذج بمفتاح {/*resetting-a-form-with-a-key*/}

إعادة تعيين الحالة بمفتاح مفيدة جداً مع النماذج.

في تطبيق المحادثة هذا، يحتوي مكوّن `<Chat>` على حالة حقل النص:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

جرّب إدخال نص ثم اضغط «Alice» أو «Bob» لاختيار مستلم آخر. ستلاحظ أن حالة الحقل تُحفَظ لأن `<Chat>` يُصيَّر في نفس الموضع في الشجرة.

**في كثير من التطبيقات قد يكون هذا السلوك المرغوب، لكن ليس في تطبيق محادثة!** لا تريد أن يرسل المستخدم رسالة كتبها بالفعل إلى شخص خطأ بسبب نقرة خاطئة. لإصلاح ذلك، أضف `key`:

```js
<Chat key={to.id} contact={to} />
```

هذا يضمن أنه عند اختيار مستلم مختلف، يُعاد إنشاء مكوّن `Chat` من الصفر، بما في ذلك أي حالة في الشجرة تحته. كما يعيد React إنشاء عناصر DOM بدلاً من إعادة استخدامها.

الآن تبديل المستلم يفرغ حقل النص دائماً:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### الحفاظ على الحالة لمكوّنات مُزالة {/*preserving-state-for-removed-components*/}

في تطبيق محادثة حقيقي، قد تريد استرجاع حالة الحقل عندما يعيد المستخدم اختيار المستلم السابق. هناك طرق للإبقاء على الحالة «حية» لمكوّن لم يعد مرئياً:

- يمكنك عرض _كل_ المحادثات بدلاً من الحالية فقط، وإخفاء البقية بـCSS. لا تُزال المحادثات من الشجرة، فتُحفَظ حالتها المحلية. ينجح هذا مع واجهات بسيطة. لكنه قد يبطئ كثيراً إذا كانت الأشجار المخفية كبيرة وفيها الكثير من عقد DOM.
- يمكنك [رفع الحالة](/learn/sharing-state-between-components) والاحتفاظ بالرسالة المعلّقة لكل مستلم في المكوّن الأب. عندها لا يهم إزالة المكوّنات الأبناء لأن الأب يحتفظ بالمعلومات المهمة. هذا هو الحل الأشيع.
- قد تستخدم مصدراً آخر إلى جانب حالة React. مثلاً، غالباً تريد بقاء مسودة الرسالة حتى لو أغلق المستخدم الصفحة بالخطأ. لتنفيذ ذلك، يمكن لمكوّن `Chat` أن يهيئ حالته بقراءة [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)، ويحفظ المسودات هناك أيضاً.

أي استراتيجية اخترتها، محادثة _مع أليس_ مفهومياً مختلفة عن محادثة _مع بوب_، فينطقي إعطاء `key` لشجرة `<Chat>` حسب المستلم الحالي.

</DeepDive>

<Recap>

- يحتفظ React بالحالة ما دام نفس المكوّن يُصيَّر في نفس الموضع.
- الحالة لا تُخزَّن في وسوم JSX. إنها مرتبطة بموضع الشجرة حيث وضعت ذلك JSX.
- يمكنك إجبار شجرة فرعية على إعادة تعيين حالتها بإعطائها مفتاحاً مختلفاً.
- لا تدخل تعريفات المكوّنات، وإلا أعدت تعيين الحالة عن غير قصد.

</Recap>



<Challenges>

#### إصلاح اختفاء نص الحقل {/*fix-disappearing-input-text*/}

يعرض هذا المثال رسالة عند الضغط على الزر. لكن الضغط يعيد تعيين الحقل عن غير قصد أيضاً. لماذا؟ أصلحه بحيث لا يعيد الضغط تعيين نص الحقل.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

المشكلة أن `Form` يُصيَّر في مواضع مختلفة. في فرع `if` هو الابن الثاني للـ`<div>`، وفي فرع `else` هو الابن الأول. لذلك يتغيّر نوع المكوّن في كل موضع. الموضع الأول يتبدّل بين `p` و`Form`، والثاني بين `Form` و`button`. يعيد React تعيين الحالة في كل مرة يتغيّر فيها نوع المكوّن.

أسهل حل هو توحيد الفرعين بحيث يبقى `Form` دائماً في نفس الموضع:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


تقنياً، يمكنك أيضاً إضافة `null` قبل `<Form />` في فرع `else` لمطابقة هيكل فرع `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

بهذا الشكل، `Form` دائماً الابن الثاني، فيبقى في نفس الموضع وتحتفظ حالته. لكن هذا النهج أقل وضوحاً ويعرّضك لخطر أن يحذف أحدهم ذلك `null`.

</Solution>

#### تبديل حقلي نموذج {/*swap-two-form-fields*/}

هذا النموذج يتيح إدخال الاسم الأول والأخير. وفيه مربع يحدد أي الحقلين يظهر أولاً. عند تفعيله، يظهر حقل «الاسم الأخير» قبل «الاسم الأول».

يكاد يعمل، لكن فيه علة. إن ملأت حقل «الاسم الأول» ثم فعّلت المربع، يبقى النص في الحقل الأول (الذي أصبح الآن «الاسم الأخير»). أصلح ذلك بحيث ينتقل نص الحقل *أيضاً* عند عكس الترتيب.

<Hint>

يبدو أن موضع الحقلين داخل الأب لا يكفي. هل هناك طريقة لتخبر React كيف تطابق الحالة بين التصييرات؟

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

أعطِ `key` لكل من `<Field>` في فرعي `if` و`else`. هذا يخبر React كيف «يطابق» الحالة الصحيحة لكل `<Field>` حتى لو تغيّر ترتيبهما داخل الأب:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### إعادة تعيين نموذج التفاصيل {/*reset-a-detail-form*/}

هذه قائمة جهات اتصال قابلة للتحرير. يمكنك تعديل تفاصيل جهة الاتصال المختارة ثم الضغط على «Save» للتحديث أو «Reset» للتراجع.

عند اختيار جهة اتصال أخرى (مثلاً أليس)، تتحدّث الحالة لكن النموذج يظل يعرض تفاصيل الجهة السابقة. أصلح ذلك بحيث يُعاد تعيين النموذج عند تغيّر جهة الاتصال المختارة.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

أعطِ `key={selectedId}` لمكوّن `EditContact`. عندها يُعاد تعيين النموذج عند التبديل بين جهات الاتصال:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### مسح الصورة أثناء التحميل {/*clear-an-image-while-its-loading*/}

عند الضغط على «Next»، يبدأ المتصفح بتحميل الصورة التالية. لكن بما أنها تُعرض في نفس وسم `<img>`، سترى افتراضياً الصورة السابقة حتى تنتهي التالية. قد لا ترغب بذلك إن كان من المهم أن يطابق النص الصورة دائماً. غيّر السلوك بحيث بمجرد الضغط على «Next» تُزال الصورة السابقة فوراً.

<Hint>

هل هناك طريقة لتخبر React بإعادة إنشاء DOM بدلاً من إعادة استخدامه؟

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

يمكنك إعطاء `key` لوسم `<img>`. عند تغيّر ذلك `key`، يعيد React إنشاء عقدة `<img>` في DOM من الصفر. يسبب ذلك وميضاً قصيراً عند تحميل كل صورة، فليس من المنطقي فعله لكل صورة في تطبيقك. لكنه مناسب إن أردت ضمان تطابق الصورة مع النص دائماً.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### إصلاح الحالة الموضوعة خطأ في القائمة {/*fix-misplaced-state-in-the-list*/}

في هذه القائمة، لكل `Contact` حالة تحدد ما إذا ضُغط «Show email» له. اضغط «Show email» لأليس، ثم فعّل «Show in reverse order». ستلاحظ أن بريد *تايلور* هو الموسّع الآن، بينما بريد أليس—المنقولة للأسفل—مطوي.

أصلح ذلك بحيث ترتبط حالة التوسيع بكل جهة اتصال بغض النظر عن الترتيب المختار.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

المشكلة أن المثال كان يستخدم الفهرس كـ`key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

لكنك تريد ربط الحالة بـ*كل جهة اتصال على حدة*.

استخدام معرف جهة الاتصال كـ`key` يصلح المشكلة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

الحالة مرتبطة بموضع الشجرة. يتيح لك `key` تحديد موضع مسمّى بدلاً من الاعتماد على الترتيب فقط.

</Solution>

</Challenges>

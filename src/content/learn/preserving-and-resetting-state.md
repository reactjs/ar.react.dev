---
title: الحفاظ على الحالة وإعادة تعيينها
---

<Intro>

الحالة معزولة بين المكونات. يتتبع React أي حالة تنتمي إلى أي مكون بناءً على مكانهم في شجرة واجهة المستخدم. يمكنك التحكم في متى يتم الحفاظ على الحالة ومتى يتم إعادة تعيينها بين عمليات إعادة العرض.

</Intro>

<YouWillLearn>

* متى يختار React الحفاظ على الحالة أو إعادة تعيينها
* كيفية إجبار React على إعادة تعيين حالة المكون
* كيف تؤثر المفاتيح والأنواع على ما إذا كان سيتم الحفاظ على الحالة

</YouWillLearn>

## الحالة مرتبطة بموضع في شجرة العرض {/*state-is-tied-to-a-position-in-the-tree*/}

يبني React [أشجار العرض](learn/understanding-your-ui-as-a-tree#the-render-tree) لبنية المكونات في واجهة المستخدم الخاصة بك.

عندما تعطي مكونًا حالة، قد تعتقد أن الحالة "تعيش" داخل المكون. لكن الحالة في الواقع محفوظة داخل React. يربط React كل جزء من الحالة التي يحتفظ بها مع المكون الصحيح حسب مكان جلوس ذلك المكون في شجرة العرض.

هنا، يوجد وسم `<Counter />` JSX واحد فقط، لكنه يتم عرضه في موضعين مختلفين:

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

إليك كيف تبدو هذه كشجرة:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

شجرة React

</Diagram>

</DiagramGroup>

**هذه عدّادان منفصلان لأن كل واحد يتم عرضه في موضعه الخاص في الشجرة.** عادةً لا تحتاج إلى التفكير في هذه المواضع لاستخدام React، لكن قد يكون من المفيد فهم كيفية عملها.

في React، كل مكون على الشاشة له حالة معزولة تمامًا. على سبيل المثال، إذا عرضت مكونَي `Counter` جنبًا إلى جنب، فإن كلًا منهما سيحصل على حالاته الخاصة والمستقلة `score` و `hover`.

جرب النقر على كلا العدّادين ولاحظ أنهما لا يؤثران على بعضهما البعض:

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

As you can see, when one counter is updated, only the state for that component is updated:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

تحديث الحالة

</Diagram>

</DiagramGroup>


سيحتفظ React بالحالة طالما أنك تعرض نفس المكون في نفس الموضع في الشجرة. لرؤية ذلك، قم بزيادة كلا العدّادين، ثم أزل المكون الثاني بإلغاء تحديد مربع الاختيار "Render the second counter"، ثم أضفه مرة أخرى بتحديده مرة أخرى:

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

لاحظ كيف أنه في اللحظة التي تتوقف فيها عن عرض العدّاد الثاني، تختفي حالته تمامًا. ذلك لأنه عندما يزيل React مكونًا، فإنه يدمر حالته.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

حذف مكون

</Diagram>

</DiagramGroup>

عندما تحدد "Render the second counter"، يتم تهيئة `Counter` ثانٍ وحالته من الصفر (`score = 0`) وإضافته إلى DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

إضافة مكون

</Diagram>

</DiagramGroup>

**يحفظ React حالة المكون طالما يتم عرضه في موضعه في شجرة واجهة المستخدم.** إذا تمت إزالته، أو إذا تم عرض مكون مختلف في نفس الموضع، فإن React يتجاهل حالته.

## نفس المكون في نفس الموضع يحفظ الحالة {/*same-component-at-the-same-position-preserves-state*/}

في هذا المثال، يوجد وسمان `<Counter />` مختلفان:

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

عندما تحدد أو تلغي تحديد مربع الاختيار، لا يتم إعادة تعيين حالة العدّاد. سواء كان `isFancy` يساوي `true` أو `false`، فلديك دائمًا `<Counter />` كأول ابن للـ `div` المُرجع من مكون `App` الجذر:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

تحديث حالة `App` لا يعيد تعيين `Counter` لأن `Counter` يبقى في نفس الموضع

</Diagram>

</DiagramGroup>


إنه نفس المكون في نفس الموضع، لذلك من منظور React، إنه نفس العدّاد.

<Pitfall>

تذكر أن **الموضع في شجرة واجهة المستخدم--وليس في ترميز JSX--هو ما يهم React!** هذا المكون لديه جملتا `return` مع وسوم `<Counter />` JSX مختلفة داخل وخارج `if`:

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

قد تتوقع أن يتم إعادة تعيين الحالة عند تحديد مربع الاختيار، لكن ذلك لا يحدث! هذا لأن **كلا وسمَي `<Counter />` هذين يتم عرضهما في نفس الموضع.** React لا يعرف أين تضع الشروط في دالتك. كل ما "يراه" هو الشجرة التي تُرجعها.

في كلتا الحالتين، يُرجع مكون `App` عنصر `<div>` مع `<Counter />` كابن أول. بالنسبة لـ React، لهذين العدّادين نفس "العنوان": الابن الأول للابن الأول للجذر. هذه هي الطريقة التي يطابق بها React بينهما بين العرض السابق والتالي، بغض النظر عن كيفية هيكلة منطقك.

</Pitfall>

## مكونات مختلفة في نفس الموضع تعيد تعيين الحالة {/*different-components-at-the-same-position-reset-state*/}

في هذا المثال، سيؤدي تحديد مربع الاختيار إلى استبدال `<Counter>` بـ `<p>`:

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

هنا، تبدل بين أنواع مكونات _مختلفة_ في نفس الموضع. في البداية، احتوى الابن الأول للـ `<div>` على `Counter`. لكن عندما بدّلته بـ `p`، أزال React الـ `Counter` من شجرة واجهة المستخدم ودمر حالته.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

عندما يتغير `Counter` إلى `p`، يُحذف `Counter` ويُضاف `p`

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

عند التبديل مرة أخرى، يُحذف `p` ويُضاف `Counter`

</Diagram>

</DiagramGroup>

أيضًا، **عندما تعرض مكونًا مختلفًا في نفس الموضع، فإنه يعيد تعيين حالة الشجرة الفرعية بأكملها.** لرؤية كيفية عمل ذلك، قم بزيادة العدّاد ثم حدد مربع الاختيار:

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

The counter state gets reset when you click the checkbox. Although you render a `Counter`, the first child of the `div` changes from a `section` to a `div`. When the child `section` was removed from the DOM, the whole tree below it (including the `Counter` and its state) was destroyed as well.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When `section` changes to `div`, the `section` is deleted and the new `div` is added

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When switching back, the `div` is deleted and the new `section` is added

</Diagram>

</DiagramGroup>

كقاعدة عامة، **إذا كنت تريد الحفاظ على الحالة بين عمليات إعادة العرض، فإن بنية شجرتك يجب أن "تتطابق"** من عرض إلى آخر. إذا كانت البنية مختلفة، يتم تدمير الحالة لأن React يدمر الحالة عندما يزيل مكونًا من الشجرة.

<Pitfall>

هذا هو السبب في أنه يجب عدم تداخل تعريفات دوال المكونات.

هنا، يتم تعريف دالة مكون `MyTextField` *داخل* `MyComponent`:

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


في كل مرة تنقر فيها على الزر، تختفي حالة الإدخال! هذا لأنه يتم إنشاء دالة `MyTextField` *مختلفة* لكل عرض من `MyComponent`. أنت تعرض مكونًا *مختلفًا* في نفس الموضع، لذلك يعيد React تعيين كل الحالة أدناه. يؤدي هذا إلى أخطاء ومشاكل في الأداء. لتجنب هذه المشكلة، **قم دائمًا بالإعلان عن دوال المكونات في المستوى الأعلى، ولا تداخل تعريفاتها.**

</Pitfall>

## إعادة تعيين الحالة في نفس الموضع {/*resetting-state-at-the-same-position*/}

بشكل افتراضي، يحفظ React حالة مكون ما بينما يبقى في نفس الموضع. عادةً، هذا بالضبط ما تريده، لذا فهو منطقي كسلوك افتراضي. لكن في بعض الأحيان، قد ترغب في إعادة تعيين حالة المكون. فكر في هذا التطبيق الذي يتيح لاعبين اثنين تتبع نقاطهما خلال كل دور:

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

حاليًا، عندما تغيّر اللاعب، يتم الحفاظ على النتيجة. يظهر `Counter`ان في نفس الموضع، لذلك يراهما React على أنهما *نفس* `Counter` الذي تغير prop `person` الخاص به.

لكن من الناحية المفاهيمية، في هذا التطبيق يجب أن يكونا عدّادين منفصلين. قد يظهران في نفس المكان في واجهة المستخدم، لكن أحدهما عدّاد لـ Taylor، والآخر عدّاد لـ Sarah.

هناك طريقتان لإعادة تعيين الحالة عند التبديل بينهما:

1. عرض المكونات في مواضع مختلفة
2. إعطاء كل مكون هوية صريحة باستخدام `key`


### الخيار 1: عرض مكون في مواضع مختلفة {/*option-1-rendering-a-component-in-different-positions*/}

إذا كنت تريد أن يكون هذان `Counter`ان مستقلين، يمكنك عرضهما في موضعين مختلفين:

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

* Initially, `isPlayerA` is `true`. So the first position contains `Counter` state, and the second one is empty.
* When you click the "Next player" button the first position clears but the second one now contains a `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

الحالة الأولية

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

النقر على "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

النقر على "next" مرة أخرى

</Diagram>

</DiagramGroup>

يتم تدمير حالة كل `Counter` في كل مرة تتم إزالته من DOM. هذا هو السبب في أنهم يعيدون التعيين في كل مرة تنقر فيها على الزر.

هذا الحل مناسب عندما يكون لديك عدد قليل فقط من المكونات المستقلة المعروضة في نفس المكان. في هذا المثال، لديك اثنان فقط، لذلك ليس من المزعج عرض كليهما بشكل منفصل في JSX.

### الخيار 2: إعادة تعيين الحالة باستخدام key {/*option-2-resetting-state-with-a-key*/}

هناك أيضًا طريقة أخرى أكثر عمومية لإعادة تعيين حالة المكون.

ربما رأيت `key`s عند [عرض القوائم.](/learn/rendering-lists#keeping-list-items-in-order-with-key) المفاتيح ليست للقوائم فقط! يمكنك استخدام المفاتيح لجعل React يميز بين أي مكونات. بشكل افتراضي، يستخدم React الترتيب داخل الأب ("العدّاد الأول"، "العدّاد الثاني") للتمييز بين المكونات. لكن المفاتيح تتيح لك إخبار React أن هذا ليس مجرد عدّاد *أول*، أو عدّاد *ثانٍ*، بل عدّاد محدد--على سبيل المثال، عدّاد *Taylor*. بهذه الطريقة، سيعرف React عدّاد *Taylor* أينما ظهر في الشجرة!

في هذا المثال، `<Counter />`ان لا يشتركان في الحالة رغم أنهما يظهران في نفس المكان في JSX:

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

Switching between Taylor and Sarah does not preserve the state. This is because **you gave them different `key`s:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

تحديد `key` يخبر React باستخدام `key` نفسه كجزء من الموضع، بدلاً من ترتيبه داخل الأب. هذا هو السبب في أنه على الرغم من أنك تعرضهما في نفس المكان في JSX، يراهما React كعدّادين مختلفين، وبالتالي لن يشتركا أبدًا في الحالة. في كل مرة يظهر فيها عدّاد على الشاشة، يتم إنشاء حالته. في كل مرة تتم إزالته، يتم تدمير حالته. التبديل بينهما يعيد تعيين حالتهما مرارًا وتكرارًا.

<Note>

تذكر أن المفاتيح ليست فريدة عالميًا. إنها تحدد الموضع *داخل الأب* فقط.

</Note>

### إعادة تعيين نموذج باستخدام key {/*resetting-a-form-with-a-key*/}

إعادة تعيين الحالة باستخدام key مفيدة بشكل خاص عند التعامل مع النماذج.

في تطبيق الدردشة هذا، يحتوي مكون `<Chat>` على حالة إدخال النص:

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

جرب إدخال شيء ما في الإدخال، ثم اضغط على "Alice" أو "Bob" لاختيار مستلم مختلف. ستلاحظ أن حالة الإدخال محفوظة لأن `<Chat>` يتم عرضه في نفس الموضع في الشجرة.

**في العديد من التطبيقات، قد يكون هذا هو السلوك المطلوب، ولكن ليس في تطبيق دردشة!** أنت لا تريد السماح للمستخدم بإرسال رسالة كتبها بالفعل إلى شخص خاطئ بسبب نقرة عرضية. لإصلاح ذلك، أضف `key`:

```js
<Chat key={to.id} contact={to} />
```

هذا يضمن أنه عندما تحدد مستلمًا مختلفًا، سيتم إعادة إنشاء مكون `Chat` من الصفر، بما في ذلك أي حالة في الشجرة أدناه. سيعيد React أيضًا إنشاء عناصر DOM بدلاً من إعادة استخدامها.

الآن يؤدي تبديل المستلم دائمًا إلى مسح حقل النص:

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

#### الحفاظ على الحالة للمكونات المُزالة {/*preserving-state-for-removed-components*/}

في تطبيق دردشة حقيقي، من المحتمل أن ترغب في استرداد حالة الإدخال عندما يحدد المستخدم المستلم السابق مرة أخرى. هناك عدة طرق للحفاظ على الحالة "حية" لمكون لم يعد مرئيًا:

- يمكنك عرض _جميع_ المحادثات بدلاً من المحادثة الحالية فقط، لكن إخفاء جميع المحادثات الأخرى باستخدام CSS. لن تتم إزالة المحادثات من الشجرة، لذلك سيتم الحفاظ على حالتها المحلية. يعمل هذا الحل بشكل رائع لواجهات المستخدم البسيطة. لكن يمكن أن يصبح بطيئًا جدًا إذا كانت الأشجار المخفية كبيرة وتحتوي على الكثير من عقد DOM.
- يمكنك [رفع الحالة](/learn/sharing-state-between-components) والاحتفاظ بالرسالة المعلقة لكل مستلم في المكون الأب. بهذه الطريقة، عندما تتم إزالة المكونات الأبناء، لا يهم، لأن الأب هو الذي يحتفظ بالمعلومات المهمة. هذا هو الحل الأكثر شيوعًا.
- يمكنك أيضًا استخدام مصدر مختلف بالإضافة إلى حالة React. على سبيل المثال، من المحتمل أن ترغب في استمرار مسودة الرسالة حتى لو أغلق المستخدم الصفحة عن طريق الخطأ. لتنفيذ ذلك، يمكنك جعل مكون `Chat` يهيئ حالته بالقراءة من [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)، وحفظ المسودات هناك أيضًا.

بغض النظر عن الاستراتيجية التي تختارها، فإن محادثة _مع Alice_ تختلف مفاهيميًا عن محادثة _مع Bob_، لذا من المنطقي إعطاء `key` لشجرة `<Chat>` بناءً على المستلم الحالي.

</DeepDive>

<Recap>

- يحتفظ React بالحالة طالما يتم عرض نفس المكون في نفس الموضع.
- لا يتم الاحتفاظ بالحالة في وسوم JSX. إنها مرتبطة بموضع الشجرة الذي تضع فيه ذلك JSX.
- يمكنك إجبار شجرة فرعية على إعادة تعيين حالتها بإعطائها مفتاحًا مختلفًا.
- لا تداخل تعريفات المكونات، وإلا ستعيد تعيين الحالة عن طريق الخطأ.

</Recap>



<Challenges>

#### أصلح نص الإدخال المختفي {/*fix-disappearing-input-text*/}

يعرض هذا المثال رسالة عند الضغط على الزر. ومع ذلك، فإن الضغط على الزر يعيد تعيين الإدخال عن طريق الخطأ أيضًا. لماذا يحدث هذا؟ أصلحه بحيث لا يؤدي الضغط على الزر إلى إعادة تعيين نص الإدخال.

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

The problem is that `Form` is rendered in different positions. In the `if` branch, it is the second child of the `<div>`, but in the `else` branch, it is the first child. Therefore, the component type in each position changes. The first position changes between holding a `p` and a `Form`, while the second position changes between holding a `Form` and a `button`. React resets the state every time the component type changes.

The easiest solution is to unify the branches so that `Form` always renders in the same position:

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


Technically, you could also add `null` before `<Form />` in the `else` branch to match the `if` branch structure:

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

This way, `Form` is always the second child, so it stays in the same position and keeps its state. But this approach is much less obvious and introduces a risk that someone else will remove that `null`.

</Solution>

#### بدّل حقلي نموذج {/*swap-two-form-fields*/}

يتيح لك هذا النموذج إدخال الاسم الأول والأخير. لديه أيضًا مربع اختيار يتحكم في أي حقل يأتي أولاً. عندما تحدد مربع الاختيار، سيظهر حقل "Last name" قبل حقل "First name".

يعمل تقريبًا، لكن هناك خطأ. إذا ملأت إدخال "First name" وحددت مربع الاختيار، فسيبقى النص في الإدخال الأول (الذي هو الآن "Last name"). أصلحه بحيث ينتقل نص الإدخال *أيضًا* عندما تعكس الترتيب.

<Hint>

يبدو أنه بالنسبة لهذه الحقول، موضعهم داخل الأب ليس كافيًا. هل هناك طريقة لإخبار React بكيفية مطابقة الحالة بين عمليات إعادة العرض؟

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

Give a `key` to both `<Field>` components in both `if` and `else` branches. This tells React how to "match up" the correct state for either `<Field>` even if their order within the parent changes:

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

#### أعد تعيين نموذج التفاصيل {/*reset-a-detail-form*/}

هذه قائمة جهات اتصال قابلة للتحرير. يمكنك تحرير تفاصيل جهة الاتصال المحددة ثم إما الضغط على "Save" لتحديثها، أو "Reset" للتراجع عن تغييراتك.

عندما تحدد جهة اتصال مختلفة (على سبيل المثال، Alice)، تتحدث الحالة لكن النموذج يستمر في إظهار تفاصيل جهة الاتصال السابقة. أصلحه بحيث يتم إعادة تعيين النموذج عند تغيير جهة الاتصال المحددة.

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

Give `key={selectedId}` to the `EditContact` component. This way, switching between different contacts will reset the form:

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

#### امسح صورة أثناء تحميلها {/*clear-an-image-while-its-loading*/}

عند الضغط على "Next"، يبدأ المتصفح في تحميل الصورة التالية. ومع ذلك، نظرًا لأنها معروضة في نفس وسم `<img>`، بشكل افتراضي ستظل ترى الصورة السابقة حتى يتم تحميل التالية. قد يكون هذا غير مرغوب فيه إذا كان من المهم أن يتطابق النص دائمًا مع الصورة. غيّره بحيث تُمسح الصورة السابقة فورًا في اللحظة التي تضغط فيها على "Next".

<Hint>

هل هناك طريقة لإخبار React بإعادة إنشاء DOM بدلاً من إعادة استخدامه؟

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

You can provide a `key` to the `<img>` tag. When that `key` changes, React will re-create the `<img>` DOM node from scratch. This causes a brief flash when each image loads, so it's not something you'd want to do for every image in your app. But it makes sense if you want to ensure the image always matches the text.

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

#### أصلح الحالة في غير مكانها في القائمة {/*fix-misplaced-state-in-the-list*/}

في هذه القائمة، كل `Contact` لديه حالة تحدد ما إذا كان قد تم الضغط على "Show email" له. اضغط على "Show email" لـ Alice، ثم حدد مربع الاختيار "Show in reverse order". ستلاحظ أن البريد الإلكتروني لـ _Taylor_ هو الموسّع الآن، لكن Alice--التي انتقلت إلى الأسفل--تبدو مطوية.

أصلحه بحيث ترتبط الحالة الموسّعة بكل جهة اتصال، بغض النظر عن الترتيب المختار.

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

The problem is that this example was using index as a `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

However, you want the state to be associated with _each particular contact_.

Using the contact ID as a `key` instead fixes the issue:

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

State is associated with the tree position. A `key` lets you specify a named position instead of relying on order.

</Solution>

</Challenges>

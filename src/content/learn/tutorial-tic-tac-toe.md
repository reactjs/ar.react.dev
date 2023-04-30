---
title: 'شرح تطبيقي: لعبة تيك تاك تو (X-O)'
---

<Intro>

سنبني في هذا الشرح التطبيقي لعبة تيك تاك تو (X-O) صغيرة. لا يَفتَرِض هذا الشرح التطبيقي أي معرفة سابقة بـ React. التقنيات التي ستتعلمها في هذا البرنامج أساسية لبناء أي تطبيق React ، وفهمها بشكل كامل سيمنحك فهمًا عميقًا لـ React.

</Intro>

<Note>

هذا الشرح التطبيقي مصمم للأشخاص الذين يفضلون **التعلم العملي**، ويريدون تجربة صنع شيء ملموس بسرعة. إذا كنت تفضل تعلم كل مفهوم خطوة بخطوة ، فابدأ بـ [وصف واجهة المستخدم.](/learn/describing-the-ui)

</Note>

هذا الشرح التطبيقي مقسم إلى عدة أقسام:

- [التجهيز للشرح التطبيقي](#setup-for-the-tutorial): سيعطيك **نقطة انطلاق** لمتابعة الشرح التطبيقي.
- [نظرة عامة](#overview): سيعلمك **أساسيات React**؛ المكونات، الخصائص، والحالة.
- [إكمال اللعبة](#completing-the-game): سيعلمك **أكثر التقنيات شيوعًا** في تطوير React.
- [إضافة السفر عبر الزمن](#adding-time-travel): سيعطيك **فهمًا أعمق** لقوة React الفريدة.

### ماذا ستبني؟ {/*what-are-you-building*/}

في هذا الشرح التطبيقي، ستبني لعبة تيك تاك تو (X-O) تفاعلية باستخدام React.

يمكنك أن ترى كيف ستبدو عند الانتهاء من هنا:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى الخطوة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

إذا لم يكن الكود منطقيًا بالنسبة لك بعد ، أو إذا كنت غير معتاد على بناء الكود ، فلا تقلق! الهدف من هذا الشرح التطبيقي هو مساعدتك على فهم React وبناء الكود فيها.

نوصيك بتجربة لعبة "تيك تاك تو" أعلاه قبل الاستمرار في الشرح التطبيقي. أحد الميزات التي ستلاحظها هي أن هناك قائمة مرقمة على يمين لوحة اللعبة. تعطيك هذه القائمة تاريخ جميع الحركات التي حدثت في اللعبة ، ويتم تحديثها مع تقدم اللعبة.

بمجرد أن تنهى لعبة "تيك تاك تو"، استمر في التمرير. ستبدأ بقالب أبسط في هذا الشرح التطبيقي. خطوتنا التالية هي إعدادك حتى تتمكن من بدء بناء اللعبة.

## التجهيز للشرح التطبيقي {/*setup-for-the-tutorial*/}

في محرر الكود المباشر أدناه ، انقر فوق **Fork** في الزاوية اليمنى العليا لفتح المحرر في علامة تبويب جديدة باستخدام موقع CodeSandbox. يتيح لك CodeSandbox كتابة الكود في المتصفح ومعاينة كيف سيرى مستخدموك التطبيق الذي قمت بإنشائه. يجب أن تعرض علامة التبويب الجديدة مربعًا فارغًا ورمز البداية لهذا الشرح التطبيقي.

<Sandpack>

```js App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

<Note>

يمكنك أيضًا متابعة هذا الشرح التطبيقي باستخدام بيئة التطوير المحلية. للقيام بذلك ، تحتاج إلى:

1. تثبيت [Node.js](https://nodejs.org/ar/).
1. في نافذة CodeSandbox التي فتحتها مؤخرًا، اضغط على زر الزاوية اليسرى العليا لفتح القائمة، ثم اختر **File** > **Export to ZIP** في تلك القائمة لتنزيل أرشيف الملفات محليًا.
1. فك ضغط الأرشيف، ثم افتح موجه الأوامر (Terminal) واكتب `cd` للانتقال إلى الدليل الذي فككت ضغطه.
1. قم بتثبيت الاعتمادات باستخدام `npm install`.
1. قم بتشغيل `npm start` لبدء خادم محلي واتبع التعليمات لعرض الكود عاملًا في المتصفح.

إذا واجهتك مشكلة، لا تدع هذا يوقفك! تابع الشرح التطبيقي عبر الإنترنت بدلاً من ذلك وحاول إعداد بيئة التطوير المحلية مرة أخرى لاحقًا.

</Note>

## نظرة عامة {/*overview*/}

الآن أنت مستعد للبدء، دعنا نلقي نظرة عامة على React!

### فحص الكود المبدئي {/*examining-the-starter-code*/}

في CodeSandbox سترى ثلاثة أقسام رئيسية:

![CodeSandbox مع الكود المبدئي](../images/tutorial/react-starter-code-codesandbox.png)

1. القسم _Files_ فيه قائمة بالملفات مثل `App.js` و `index.js` و `styles.css` ومجلد يسمى `public`.
1. _code editor_ حيث سترى الكود للملف المحدد.
1. القسم _browser_ حيث سترى كيف سيتم عرض الكود الذي كتبته.

ملف _App.js_ يجب أن يكون محددًا في القسم _Files_. محتويات ذلك الملف في _code editor_ يجب أن تكون:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

قسم _browser_ يجب أن يعرض مربعًا مع X فيه مثل هذا:

![مربع يحتوي على X](../images/tutorial/x-filled-square.png)

والآن دعنا نلقي نظرة على الملفات في الكود المبدئي.

#### `App.js` {/*appjs*/}

الكود في `App.js` ينشئ _مكونًا_ (Component). في React, المكون هو جزء من الكود قابل لإعادة الاستخدام يقدم جزءًا من واجهة المستخم. المكونات تستخدم لعرض وإدارة وتحديث عناصر واجهة المستخدم في تطبيقك. دعنا نلقي نظرة على المكون سطرًا بسطر لنرى ما يحدث:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

السطر الأول يعرّف وظيفة مسماه `Square`. الكلمة الأساسية `export` في JavaScript تجعل هذه الوظيفة متاحة خارج هذا الملف. الكلمة الأساسية `default` تخبر الملفات الأخرى التي تستخدم كودك أنها الوظيفة الرئيسية في ملفك.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

السطر الثاني يرجع زرًّا. الكلمة الأساسية `return` في JavaScript تعني أن أي شيء يأتي بعدها يعاد كقيمة لمن يستدعي الوظيفة. `<button>` هو *عنصر JSX*. عنصر JSX هو مزيج من كود JavaScript وعلامات HTML تصف ما تريد عرضه. `className="square"` هو خاصية أو *prop* للزرّ تخبر CSS كيفية تنسيق الزرّ. `X` هو النص المعروض داخل الزرّ. و `</button>` يغلق عنصر JSX ليشير إلى أن أي محتوى يليه لا ينبغي وضعه داخل الزرّ.

#### `styles.css` {/*stylescss*/}

اضغط على الملف المسمى `styles.css` في قسم _Files_ في CodeSandbox. يحدد هذا الملف الأنماط لتطبيق React الخاص بك. _محددان CSS_ الأولان (`*` و `body`) يحددان نمط أجزاء كبيرة من تطبيقك بينما المحدد `.square` يحدد نمط أي مكون يتم تعيين خاصية `className` إلى `square`. في كودك، سيتطابق ذلك مع الزرّ من مكون Square في ملف `App.js`.

#### `index.js` {/*indexjs*/}

اضغط على الملف المسمى `index.js` في قسم _Files_ في CodeSandbox. لن تقوم بتحرير هذا الملف خلال الشرح التطبيقي ولكنه هو الجسر بين المكون الذي أنشأته في ملف `App.js` ومتصفح الويب.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

الأسطر من 1 إلى 5 تجمع كل القطع اللازمة معًا:

* React
* مكتبة React للتحدث مع متصفحات الويب (React DOM)
* الأنماط لمكوناتك
* المكون الذي أنشأته في `App.js`.

باقي الملف يجمع كل القطع معًا ويضيف المنتج النهائي إلى `index.html` في مجلد `public`.


### بناء اللوحة {/*building-the-board*/}

لنعد إلى `App.js`. هذا هو المكان الذي ستقضي فيه بقية الشرح التطبيقي.

حاليًا اللوحة تحتوي على مربع واحد فقط، ولكنك تحتاج إلى تسعة! إذا حاولت نسخ ولصق المربع لتصنع مربعين مثل هذا:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

ستحصل على هذا الخطأ:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment `<>...</>`?

</ConsoleBlock>

تحتاج مكونات React إلى إرجاع عنصر JSX واحد وليس عناصر JSX المجاورة مثل زرين. لإصلاح هذا يمكنك استخدام *الأجزاء* (Fragments) (`<>` و `</>`) لتجميع عناصر JSX المجاورة مثل هذا:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

الآن يجب أن ترى:

![زرين مملوئين بـX](../images/tutorial/two-x-filled-squares.png)

رائع! الآن تحتاج فقط إلى نسخ ولصق عدة مرات لإضافة تسعة مربعات و...

![تسع مربعات مملوءة بـX في سطر](../images/tutorial/nine-x-filled-squares.png)

أوه لا! المربعات كلها في سطر واحد، وليس في شبكة كما تحتاج للوحة. لإصلاح هذا، ستحتاج إلى تجميع المربعات في صفوف مع `div` وإضافة بعض فئات CSS. بينما أنت في ذلك، ستعطي كل مربع رقمًا للتأكد من أنك تعرف أين يتم عرض كل مربع.

في ملف `App.js`، عدّل مكون `Square` ليبدو مثل هذا:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

تنسيقات _CSS_ المحددة في `styles.css` تنسق الـ `div` التي تحمل `className` بقيمة `board-row`. الآن بعد تجميع المكونات في صفوف مع الـ `div` المنسقة، لديك لوحة التيك تاك تو:

![لوحة "تيك تاك تو" مملوءة بالأرقام من 1 إلى 9](../images/tutorial/number-filled-board.png)

لكن الآن لديك مشكلة. المكون الذي يحمل اسم `Square`، ليس مربعًا بعد الآن. دعنا نصلح ذلك من خلال تغيير الاسم إلى `Board`:

```js {1}
export default function Board() {
  //...
}
```

في هذه النقطة يجب أن يبدو الكود الخاص بك مثل هذا:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

<Note>

جيد، يمكنك نسخ ولصق الكود من هذه الصفحة. ولكن حاول كتابته بنفسك أولاً!

هذا كثير للكتابة! لا بأس بنسخ ولصق الكود من هذه الصفحة. ومع ذلك، إذا كنت تريد تحديًا صغيرًا، فنحن نوصي بكتابة الكود يدويًا مرة على الأقل.

</Note>

### تمرير بيانات من خلال الخصائص (props) {/*passing-data-through-props*/}

لاحقًا، ستريد تغيير قيمة المربع من فارغة إلى "X" عندما ينقر المستخدم على المربع. مع كيفية بناء اللوحة حتى الآن، ستحتاج إلى نسخ ولصق الكود الذي يعدل المربع تسع مرات (مرة واحدة لكل مربع لديك)! بدلاً من النسخ واللصق، تسمح لك هندسة المكونات في React بإنشاء مكون قابل لإعادة الاستخدام لتجنب الكود المكرر الفوضوي.

أولاً، ستقوم بنسخ السطر الذي يحدد المربع الأول (`<button className="square">1</button>`) من مكون `Board` إلى مكون `Square` جديد:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

الآن، ستعدل مكون `Board` لتقديم مكون `Square` باستخدام بناء جملة JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

لاحظ كيف _على عكس عناصر `div` في المتصفح_، يجب أن تبدأ المكونات الخاصة بك `Board` و `Square` بحرف كبير.

دعنا نلقي نظرة:

![لوحة مملوءة بـ1](../images/tutorial/board-filled-with-ones.png)

أوه لا! لقد فقدت المربعات المرقمة التي كانت لديك من قبل. الآن يقول كل مربع "1". لإصلاح هذا، ستستخدم *الخصائص (props)* لتمرير القيمة التي يجب أن يكون لكل مربع من المكون الأصلي (`Board`) إلى مكونه الابن (`Square`).

عدّل مكون `Square` لقراءة خاصية `value` التي ستمررها من `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

تشير `function Square({ value })` إلى أن مكون Square يمكن أن يُمرر إليه خاصية تسمى `value`.

الآن تريد عرض هذه القيمة بدلاً من `1` داخل كل مربع. حاول القيام بذلك بهذه الطريقة:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

أوبس! هذا ليس ما تريده:

![لوحة مملوءة بـvalue](../images/tutorial/board-filled-with-value.png)

لقد أردت عرض متغير JavaScript يسمى `value` من مكونك، وليس كلمة "value". لـ"التخطي إلى JavaScript" من JSX، تحتاج إلى الأقواس المنحنية (curly braces). أضف الأقواس المنحنية حول `value` في JSX على النحو التالي:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

الآن، يجب أن ترى لوحة فارغة:

![لوحة فارغة](../images/tutorial/empty-board.png)

هذا لأن مكون `Board` لم يمرر خاصية `value` إلى كل مكون `Square` يقوم بتقديمه بعد. لإصلاحه، ستضيف خاصية `value` إلى كل مكون `Square` يقوم بتقديمه مكون `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

الآن يجب أن ترى شبكة من الأرقام مرة أخرى:

![لوحة "تيك تاك تو" معبأة بالأرقام من 1 إلى 9](../images/tutorial/number-filled-board.png)

كودك المعدل يجب أن يبدو كالتالي:

<Sandpack>

```js App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

### إعداد مكون تفاعلي {/*making-an-interactive-component*/}

لنملأ مكون `Square` بـ `X` عند النقر عليه. أعلن عن دالة (Function) تسمى `handleClick` داخل `Square`. ثم، أضف `onClick` إلى خصائص عنصر JSX الزر المُرجع من `Square`:


```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('ضُغطت!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

إذا ضغطت على مربع الآن، يجب أن ترى log في علامة التبويب _Console_ في أسفل قسم _Browser_ في CodeSandbox يقول `"ضُغطت!"`. الضغط على المربع أكثر من مرة سيؤدي إلى طباعة `"ضُغطت!"` مرة أخرى. تكرار `console.log("ضُغطت!")` بنفس الرسالة لن ينشئ سطرًا جديدًا في الـ console. بدلاً من ذلك، سترى عدادًا متزايدًا بجانب أول طباعة `"ضُغطت!"` لديك.

<Note>

إن كنت تتابع هذا الشرح التطبيقي باستخدام بيئة التطوير المحلية الخاصة بك، فستحتاج إلى فتح Console المتصفح الخاص بك. على سبيل المثال، إذا كنت تستخدم متصفح Chrome، يمكنك عرض Console باستخدام اختصار لوحة المفاتيح **Shift + Ctrl + J** (على نظامي التشغيل Windows/Linux) أو **Option + ⌘ + J** (على نظام التشغيل macOS).

</Note>

كخطوة تالية، تريد أن يتذكر مكون `Square` أنه تم النقر عليه، وملءه بعلامة "X". لـ "تذكر" الأشياء، يستخدم المكونات *الحالة*.

تقدم React دالة خاصة تسمى `useState` يمكنك استدعاؤها من مكونك لتمكينه من "تذكر" الأشياء. دعنا نخزن القيمة الحالية لـ `Square` في الحالة، ونغيرها عند النقر على `Square`.

استيراد `useState` في أعلى الملف. قم بإزالة خاصية `value` من مكون `Square`. بدلاً من ذلك، أضف سطرًا جديدًا في بداية `Square` يستدعي `useState`. اجعله يعيد متغير حالة يسمى `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` تحتفظ بالقيمة و `setValue` هي الدالة التي تستخدم لتعديل القيمة. الـ`null` المُمر إلى `useState` يستخدم كالقيمة الأولية لمتغير الحالة هذا، لذا `value` هنا يبدأ بالتساوي مع `null`.

لأن مكون `Square` لم يعد يقبل الخصائص (props) بعد الآن، ستقوم بإزالة خاصية `value` من جميع المربعات التسعة التي أنشأها مكون `Board`:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

الآن ستغير `Square` لعرض "X" عند النقر عليه. استبدل معالج الحدث `console.log("ضُغطت!");` بـ `setValue('X');`. الآن يبدو مكون `Square` الخاص بك على النحو التالي:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

بمناداة هذه الدالة (Function) `set` من معالج الحدث `onClick`، أنت تخبر React بإعادة تقديم `Square` كلما تم النقر على `<button>` الخاص به. بعد التحديث، سيكون `value` لـ `Square` هو `'X'`، لذا سترى "X" على لوحة اللعب. انقر على أي مربع، وسيظهر "X":

![إضافة الـXـات إلى اللوحة](../images/tutorial/tictac-adding-x-s.gif)

كل مربع له حالته الخاصة (state): الـ `value` المخزنة في كل مربع مستقلة تمامًا عن الآخرين. عندما تستدعي دالة `set` في مكون، يقوم React تلقائيًا بتحديث المكونات الفرعية داخله أيضًا.

بعد أن قمت بإجراء التغييرات أعلاه، سيبدو الكود الخاص بك على النحو التالي:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

### أدوات مطوري React (React DevTools) {/*react-developer-tools*/}

أدوات مطوري React تتيح لك التحقق من الخصائص والحالة لمكونات React الخاصة بك. يمكنك العثور على علامة تبويب أدوات مطوري React في أسفل قسم المتصفح في CodeSandbox:

![أدوات مطوري React في CodeSandbox](../images/tutorial/codesandbox-devtools.png)

لفحص مكون معين على الشاشة، استخدم الزر في الزاوية اليسرى العليا من أدوات مطوري React:

![تحديد مكونات في الصفحة من أدوات مطوري React](../images/tutorial/devtools-select.gif)

<Note>

إن كنت تستخدم بيئة التطوير المحلية، أدوات مطوري React متوفرة كإضافة لمتصفحات [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ar)، [Firefox](https://addons.mozilla.org/ar/firefox/addon/react-devtools/)، و [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). قم بتثبيتها، وستظهر علامة التبويب *Components* في أدوات المطور لمتصفحك للمواقع التي تستخدم React.

</Note>

## إكمال اللعبة {/*completing-the-game*/}

هنا، لديك كل الأساسيات لبناء لعبة التيك تاك تو. لإكمال اللعبة، تحتاج الآن إلى تبادل وضع "X" و "O" على اللوحة، وتحتاج إلى طريقة لتحديد الفائز.

### رفع الحالة لأعلى (Lifting State Up) {/*lifting-state-up*/}

حاليًا، كل مكون `Square` يحتفظ بجزء من حالة اللعبة. للتحقق من وجود فائز في لعبة "تيك تاك تو"، سيحتاج `Board` إلى معرفة حالة كل من مكونات `Square` التسعة.

كيف ستحقق ذلك؟ في البداية، قد تخمن أن `Board` يحتاج إلى "سؤال" كل `Square` عن حالته. على الرغم من أن هذا النهج ممكن تقنيًا في React، إلا أننا ننصح بعدم استخدامه لأن الكود يصبح من الصعب فهمه، وعرضة للأخطاء (bugs)، وصعب التعديل. بدلاً من ذلك، أفضل نهج هو تخزين حالة اللعبة في مكون `Board` الأصل بدلاً من كل `Square`. يمكن لمكون `Board` أن يخبر كل `Square` ما يجب عليه عرضه عن طريق تمرير خاصية (prop)، مثلما فعلت عندما قمت بتمرير رقم إلى كل `Square`.

**لجمع بيانات من أطفال (children)، أو لجعل مكونين طفلين يتواصلان مع بعضهما البعض، قم بتعريف الحالة المشتركة في مكونهما الأصل بدلاً من ذلك. يمكن لمكون الأصل أن يمرر هذه الحالة إلى الأطفال عن طريق خصائص (props). هذا يحافظ على تزامن مكونات الأطفال مع بعضها البعض ومع مكونها الأصل.**

رفع الحالة إلى مكون أصل (lifting state up) هو أمر شائع عند إعادة تنظيم مكونات React.

لنستغل هذه الفرصة لتجربتها. عدّل مكون `Board` حتى يعلن عن متغير حالة يسمى `squares` يبدأ بمصفوفة (array) من 9 قيم `null` تتوافق مع 9 مربعات:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` تنشئ مصفوفة (array) من تسعة عناصر وتضبط كل منها على `null`. استدعاء `useState()` حولها يعلن عن متغير حالة `squares` يتم تعيينه في البداية على هذه المصفوفة. كل إدخال في المصفوفة يتوافق مع قيمة مربع. عندما تملأ اللوحة لاحقًا، ستبدو المصفوفة `squares` هكذا:

```jsx
[
  'O', null, 'X', 
  'X', 'X', 'O', 
  'O', null, null
]
```

الآن يحتاج مكون `Board` إلى تمرير خاصية `value` إلى كل `Square` يقوم بعرضه:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

الآن، ستعدل مكون `Square` ليستقبل خاصية `value` من مكون `Board`. هذا يتطلب إزالة تتبع مكون `Square` لحالة `value` وخاصية  `onClick` من الزر:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

في هذه النقطة يجب أن ترى لوحة لعبة التيك تاك تو فارغة:

![لوحة فارغة](../images/tutorial/empty-board.png)

وكودك يجب أن يبدو هكذا:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

كل مربع سيتلقة خاصية `value` التي ستكون إما `'X'` أو `'O'` أو `null` للمربعات الفارغة.

لاحقًا ستغير ما يحدث عند النقر على `Square`. مكون `Board` الآن يحتفظ بالمربعات المملوءة. ستحتاج إلى إيجاد طريقة لتحديث حالة `Board`. لأن الحالة هي خاصة بالمكون الذي يحددها، لا يمكنك تحديث حالة `Board` مباشرة من `Square`.

بدلًا من ذلك، سنمرر دالة لأسفل من مكون `Board` إلى مكون `Square`، وسيقوم `Square` باستدعاء تلك الدالة عند النقر على المربع. ستبدأ بالدالة التي سيقوم `Square` بإستدعائها عند النقر عليه:


```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

الآن، ستضيف دالة `onSquareClick` إلى خاصية  `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

الآن ستوصل `onSquareClick` إلى دالة في مكون `Board` سنسميها `handleClick`. لتوصل `onSquareClick` إلى `handleClick` سنمرر دالة إلى خاصية `onSquareClick` لأول مكون `Square`:


```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

في النهاية، ستعرّف دلالة `handleClick` داخل مكون `Board` لتحديث المصفوفة `squares` التي تحتفظ بحالة اللوحة:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

دالة `handleClick` تنشئ نسخة من المصفوفة `squares` (`nextSquares`) باستخدام طريقة `slice()` في JavaScript. ثم، تقوم `handleClick` بتحديث المصفوفة `nextSquares` لإضافة `X` إلى المربع الأول (`[0]`).

مناداة دالة `setSquares` تخبر React بأن حالة المكون قد تغيرت. هذا سيؤدي إلى إعادة رسم المكونات التي تستخدم حالة `squares` (`Board`) وكذلك مكوناتها الفرعية (مكونات `Square` التي تشكل اللوحة).

<Note>

تدعم JavaScript [الإغلاقات (closures)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) والتي تعني أن الدالة الداخلية (مثل `handleClick`) لديها وصول إلى المتغيرات والدوال المعرفة في الدالة الخارجية (مثل `Board`). يمكن لدالة `handleClick` قراءة حالة `squares` واستدعاء طريقة `setSquares` لأن كلاهما معرف داخل دالة `Board`.

</Note>

الآن، يمكنك إضافة الـXـات إلى اللوحة... لكن فقط للمربع العلوي الأيسر. دالة `handleClick` مبرمجة بشكل يدوي لتحديث المربع العلوي الأيسر (`0`). دعنا نحدث `handleClick` لتتمكن من تحديث أي مربع. أضف وسيطًا `i` إلى دالة `handleClick` التي تأخذ رقم المربع لتحديثه:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

الآن، ستحتاج إلى تمرير ذلك الـ `i` إلى `handleClick`. يمكنك أن تحاول تعيين خاصية `onSquareClick` لمربع لتكون `handleClick(0)` مباشرة في JSX مثل هذا، لكنه لن يعمل:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

هنا سبب عدم عمل ذلك. مناداة `handleClick(0)` ستكون جزءًا من عملية إعادة رسم مكون اللوحة. لأن `handleClick(0)` تقوم بتغيير حالة مكون اللوحة عن طريق استدعاء `setSquares`، سيتم إعادة رسم مكون اللوحة مرة أخرى. لكن هذا سيقوم بتشغيل `handleClick(0)` مرة أخرى، مما يؤدي إلى حدوث حلقة لا نهائية (infinite loop):

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

<Note>

الترجمة: عمليات إعادة التصيير كثيرة جدًا. يحدّ React عدد عمليات إعادة التصيير لمنع حدوث حلقة لا نهائية.

</Note>

لماذا لم تحدث هذه المشكلة من قبل؟

عندما كنا نمرر `onSquareClick={handleClick}`، كنا نمرر دالة `handleClick` كخاصية. لم نكن نستدعيها! لكن الآن نحن **نستدعي** تلك الدالة على الفور --لاحظ الأقواس في `handleClick(0)`-- وهذا هو السبب في أنها تعمل مبكرًا جدًا. لا نريد أن نستدعي `handleClick` حتى ينقر المستخدم!

يمكنك حلها عن طريق إنشاء دالة مثل `handleFirstSquareClick` التي تستدعي `handleClick(0)`، ودالة مثل `handleSecondSquareClick` التي تستدعي `handleClick(1)`، وهكذا. ستمرر (بدلاً من استدعاء) هذه الدوال كخصائص مثل `onSquareClick={handleFirstSquareClick}`. هذا سيحل مشكلة الحلقة اللانهائية.

ومع ذلك، تعريف تسع دوال مختلفة وإعطاء كل منها اسمًا هو أمر طويل جدًا.
بدلاً من ذلك، دعنا نفعل هذا:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

لاحظ الصيغة الجديدة `() =>`. هنا، `() => handleClick(0)` هي *دالة سهم* (Arrow Function)، وهي طريقة أقصر لتعريف الدوال. عندما ينقر المربع، سيتم تشغيل الكود بعد السهم `=>`، والذي سيستدعي `handleClick(0)`.

الآن تحتاج إلى تعديل المربعات الثمانية الأخرى لاستدعاء `handleClick` من الدوال السهم التي تمررها. تأكد من أن الوسيط لكل استدعاء لـ `handleClick` يتوافق مع فهرس المربع الصحيح:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

الآن يمكنك مرة أخرى إضافة X إلى أي مربع في اللوحة عن طريق النقر عليها:

![ملء اللوحة بـX](../images/tutorial/tictac-adding-x-s.gif)

لكن هذه المرة يتم التعامل مع إدارة الحالة بواسطة مكون `Board`!

هذا ما يجب أن يبدو عليه الكود الخاص بك:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

الآن إدارة حالتك في مكون `Board` ، يمرر مكون `Board` الأصلي الخاص بك الخاصيات إلى مكونات `Square` الفرعية حتى يتم عرضها بشكل صحيح. عند النقر فوق `Square` ، يطلب مكون `Square` الفرعي الآن من مكون `Board` الأصلي تحديث حالة اللوحة. عندما تتغير حالة `Board` ، يتم إعادة تقديم كل من مكون `Board` و `Square` الفرعي تلقائيًا. إبقاء حالة جميع المربعات في مكون `Board` سيسمح له بتحديد الفائز في المستقبل.

لنلخص ما يحدث عندما ينقر المستخدم على المربع الأيسر العلوي في اللوحة الخاصة بك لإضافة `X` إليه:

1. الضفط على المربع الأيسر العلوي يشغل الدالة التي تلقاها العنصر `<button>` كخاصية `onClick` من العنصر `<Square>`، والذي تلقاها العنصر `<Square>` كخاصية `onSquareClick` من العنصر `<Board>`، والذي قام بتعريف تلك الدالة مباشرة في JSX. تقوم الدالة بإجراء استدعاء لـ `handleClick` مع وسيطة `0`.
1. تستخدم `handleClick` الوسيطة (`0`) لتحديث العنصر الأول في مصفوفة `squares` من `null` إلى `X`.
1. تم تحديث حالة `squares` في عنصر `<Board>`، لذا يتم إعادة تقديم العنصر `<Board>` وجميع عناصره الفرعية. وهذا يؤدي إلى تغيير خاصية `value` لعنصر `<Square>` ذي الترتيب `0` من `null` إلى `X`.

في النهاية يرى المستخدم أن المربع الأيسر العلوي قد تغير من فارغ إلى `X` بعد النقر عليه.

<Note>

خاصية `onClick` لعنصر DOM `<button>` لها معنى خاص لـ React لأنها مكون مدمج. بالنسبة للمكونات المخصصة مثل `Square` ، فإن التسمية متروكة لك. يمكنك إعطاء أي اسم لخاصية `onSquareClick` لـ `Square` أو لـ `handleClick` لـ `Board` ، وسيعمل الكود بنفس الطريقة. في React ، من المعتاد استخدام أسماء `onSomething` للخصائص التي تمثل الأحداث و `handleSomething` لتعريفات الوظائف التي تتعامل مع تلك الأحداث.

</Note>

### لماذا اللا تغييرية (Immutability) مهمة {/*why-immutability-is-important*/}

تذكر كيف تقوم في `handleClick` بالاتصال بـ `.slice()` لإنشاء نسخة من مصفوفة `squares` بدلاً من تعديل المصفوفة الحالية. لشرح السبب ، نحتاج إلى مناقشة اللا تغييرية (Immutability) ولماذا هي مهمة للتعلم.

عمومًا، هناك نهجان لتغيير البيانات. النهج الأول هو تغيير البيانات مباشرةً عن طريق تغيير قيم البيانات. النهج الثاني هو استبدال البيانات بنسخة جديدة تحتوي على التغييرات المطلوبة. هنا ما سيبدو عليه الأمر إذا قمت بتغيير مصفوفة `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// الآن `squares` هي ["X", null, null, null, null, null, null, null, null];
```

وهنا ما سيبدو عليه الأمر إذا قمت بتغيير البيانات دون تغيير مصفوفة `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// الآن `squares` لم تتغير، لكن العنصر الأول في `nextSquares` هو 'X' بدلاً من `null`
```

النتيجة واحدة ولكن عن طريق عدم تغيير البيانات مباشرةً (تغيير البيانات الأساسية) ، تحصل على عدة فوائد.

عدم التغيير يجعل المميزات المعقدة أكثر سهولة في التنفيذ. لاحقًا في هذا الشرح التطبيقي، ستنفذ ميزة "السفر عبر الزمن" التي تتيح لك مراجعة تاريخ اللعبة و "الانتقال إلى الوراء" إلى الحركات السابقة. هذه الميزة ليست محدودة بالألعاب - القدرة على التراجع وإعادة الإجراءات ميزة شائعة للتطبيقات. عدم تغيير البيانات المباشر يتيح لك الاحتفاظ بالإصدارات السابقة من البيانات سليمة، وإعادة استخدامها لاحقًا.

هناك أيضًا فائدة أخرى لعدم التغيير. افترضيًا، كل العناصر الفرعية (الأبناء) تقوم بإعادة الإنشاء (re-render) تلقائيًا عندما يتغير حالة عنصر أب (الأب). هذا يشمل حتى العناصر الفرعية التي لم تتأثر بالتغيير. على الرغم من أن إعادة الإنشاء ليست بحد ذاتها ملحوظة للمستخدم (لا يجب عليك التحمس لمحاولة تجنبها!) ، قد ترغب في تخطي إعادة إنشاء جزء من الشجرة التي لم تتأثر بوضوح به لأسباب أدائية (Performance). عدم التغيير يجعل من السهل جدًا على العناصر مقارنة ما إذا كانت بياناتها قد تغيرت أم لا. يمكنك معرفة المزيد حول كيفية اختيار React عند إعادة إنشاء عنصر في [مرجع API `memo`](/reference/react/memo).

### أخذ الأدوار {/*taking-turns*/}

الآن وقت إصلاح عيب رئيسي في لعبة "تيك تاك تو": لا يمكن وضع علامات "O" على اللوحة.

ستقوم بتعيين الخطوة الأولى لتكون "X" افتراضيًا. دعونا نتتبع هذا عن طريق إضافة قطعة أخرى من الحالة إلى مكون `Board`:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. You'll update the `Board`'s `handleClick` function to flip the value of `xIsNext`:

في كل مرة يتحرك لاعب، سيتم تبديل `xIsNext` (قيمة منطقية) لتحديد أي لاعب يأتي بعد ذلك وسيتم حفظ حالة اللعبة. ستقوم بتحديث دالة `handleClick` في `Board` لتبديل قيمة `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

الآن، بمجرد أن تضغط على مربعات مختلفة، سيتبدلون بين `X` و `O`، كما يجب أن يكونوا!

لكن لحظة، هناك مشكلة. جرب النقر على نفس المربع عدة مرات:

![O تطغى على X](../images/tutorial/o-replaces-x.gif)

الـ `X` تمت الكتابة فوقها بـ `O`! بينما سيضيف هذا لمسة مثيرة للاهتمام للعبة، سنلتزم بالقواعد الأصلية الآن.

عندما تحدد مربع بـ `X` أو `O` فأنت لا تتحقق أولاً مما إذا كان المربع يحتوي بالفعل على قيمة `X` أو `O`. يمكنك إصلاح هذا عن طريق *الخروج مبكرًا*. ستتحقق مما إذا كان المربع يحتوي بالفعل على `X` أو `O`. إذا كان المربع ممتلئًا بالفعل، فستقوم بـ `return` في دالة `handleClick` مبكرًا - قبل محاولة تحديث حالة اللوحة.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

يمكنك الآن إضافة `X` أو `O` إلى المربعات الفارغة فقط! هنا ما يجب أن يبدو عليه الكود الخاص بك في هذه المرحلة:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

### الإعلان عن الفائز {/*declaring-a-winner*/}

الآن بما أن اللاعبين يمكنهم التناوب، ستريد أن تظهر عندما يفوز اللاعب ولا يوجد المزيد من الدورات للعب. للقيام بذلك، ستضيف دالة مساعدة تسمى `calculateWinner` تأخذ مصفوفة من 9 مربعات، وتتحقق من الفائز وتعيد `'X'`، `'O'`، أو `null` حسب الاقتضاء. لا تقلق كثيرًا بشأن دالة `calculateWinner` ليست شيئًا خاصًا بـ React. إنها مجرد JavaScript.

```js App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

لا يهم ما إذا أعلنت عن `calculateWinner` قبل أو بعد `Board`. دعنا نضعها في النهاية حتى لا تضطر إلى التمرير فوقها في كل مرة تقوم فيها بتحرير مكوناتك.

</Note>

ستنادي دالة `calculateWinner(squares)` في دالة `handleClick` الخاصة بمكون `Board` للتحقق مما إذا كان اللاعب قد فاز. يمكنك تنفيذ هذا التحقق في نفس الوقت الذي تتحقق فيه مما إذا كان المستخدم قد نقر على مربع يحتوي بالفعل على `X` أو `O`. نود أن نوقف تنفيذ الدالة في كلا الحالتين:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

لإعلام اللاعبين عندما تنتهي اللعبة، يمكنك عرض نص مثل "الفائز: X" أو "الفائز: O". للقيام بذلك، ستضيف قسم `status` إلى مكون `Board`. سيعرض `status` الفائز إذا انتهت اللعبة وإذا كانت اللعبة قائمة ستعرض أي لاعب هو الأول:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "الفائز هو: " + winner;
  } else {
    status = "اللاعب التالي: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

مبارك! لديك الآن لعبة "تيك تاك تو" تعمل. ولقد تعلمت للتو أساسيات React أيضًا. لذا أنت الفائز الحقيقي هنا. هنا ما يجب أن يبدو الكود:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

## إضافة السفر عبر الزمن {/*adding-time-travel*/}

كتدريب أخير، دعنا نجعل من الممكن "العودة إلى الوراء" إلى الخطوات السابقة في اللعبة.

### ترتيب تاريخ الانتقالات {/*storing-a-history-of-moves*/}

إذا قمت بتغيير `squares` array، فإن تنفيذ السفر عبر الزمن سيكون صعبًا جدًا.

ومع ذلك لقد استخدمنا `slice()` لإنشاء نسخة جديدة من `squares` array بعد كل خطوة، وعاملناها على أنها لا تتغير. هذا سيسمح لك بتخزين كل نسخة سابقة من `squares` array، والتنقل بين الدورات التي حدثت بالفعل.

ستخزن الدورات السابقة لـ `squares` في مصفوفة أخرى تسمى `history`، والتي ستخزنها كمتغير حالة جديد. تمثل مصفوفة `history` جميع حالات اللوحة، من الخطوة الأولى إلى الخطوة الأخيرة، ولها شكل مثل هذا:

```jsx
[
  // قبل الانتقال الأول
  [null, null, null, null, null, null, null, null, null],
  // بعد الانتقال الأول
  [null, null, null, null, 'X', null, null, null, null],
  // بعد الانتقال الثاني
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### رفع الحالة لأعلى (Listing state up)، مرة أخرى {/*lifting-state-up-again*/}

ستنشئ الآن مكونًا جديدًا على المستوى الأعلى يسمى `Game` لعرض قائمة بالخطوات السابقة. هنا ستضع حالة `history` التي تحتوي على تاريخ اللعبة بأكمله.

نقل `history` إلى مكون `Game` سيسمح لك بإزالة حالة `squares` من مكون `Board` الفرعي. تمامًا مثلما "رفعت الحالة لأعلى" من مكون `Square` إلى مكون `Board`، سترفعها الآن من `Board` إلى مكون `Game` على المستوى الأعلى. هذا يمنح مكون `Game` السيطرة الكاملة على بيانات `Board` ويتيح له تعليم `Board` بتقديم الدورات السابقة من `history`.

أولًا، أضف `export default` إلى مكون `Game`. ثم اجعله يقوم بتقديم مكون `Board` وبعض البناء (markup) الإضافي:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*مَهمَّة*/}</ol>
      </div>
    </div>
  );
}
```

تذكر أن تزيل `export default` قبل الإعلان عن `function Board() {...}` وتضيفها قبل الإعلان عن `function Game() {...}`. هذا يخبر ملف `index.js` بأن يستخدم مكون `Game` كمكون رئيسي بدلاً من مكون `Board` الخاص بك. الـ `div` الإضافية التي تعود بها مكون `Game` تقوم بإنشاء مساحة لمعلومات اللعبة التي ستضيفها إلى اللوحة لاحقًا.

أضف بعض الحالة إلى مكون `Game` لتتبع اللاعب التالي وتاريخ الخطوات:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
}
```

لاحظ كيف أن `[Array(9).fill(null)]` هي مصفوفة بها عنصر واحد، وهو بدوره مصفوفة من 9 من القيم `null`. 

```js
  [
    [null, null, null, null, null, null, null, null, null]
  ]
```

لعرض مربعات الانتقالة الحالية، ستريد قراءة مصفوفة `squares` الأخيرة من `history`. لا تحتاج إلى `useState` لهذا - لديك بالفعل ما يكفي من المعلومات لحسابها أثناء التقديم:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

ثم، أنشئ دالة `handlePlay` داخل مكون `Game` سيتم استدعاؤها من قِبَل مكون `Board` لتحديث اللعبة. قم بتمرير `xIsNext` و `currentSquares` و `handlePlay` كخصائص إلى مكون `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // مَهمَّة
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

لنجعل مكون `Board` متحكمًّا به بالكامل من خلال الخصائص التي يستقبلها، غيِّر مكون `Board` ليأخذ ثلاث خصائص: `xIsNext` و `squares` ودالة `onPlay` جديدة يمكن لـ `Board` استدعاؤها مع مصفوفة المربعات المُحدَّثة عندما يقوم اللاعب باللعب. ثم، احذف السطرين الأولين من دالة `Board` التي تستدعيان `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

الآن استبدل استدعاءات `setSquares` و `setXIsNext` في `handleClick` في مكون `Board` باستدعاء واحد لدالتك الجديدة `onPlay` حتى يتمكن مكون `Game` من تحديث `Board` عندما ينقر المستخدم على مربع:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

مكون `Board` مُتَحكَّمٌ به بالكامل من خلال الخصائص التي يتم تمريرها إليه من مكون `Game`. ستحتاج إلى تنفيذ دالة `handlePlay` في مكون `Game` لجعل اللعبة تعمل مرة أخرى.

ماذا يجب أن تفعل `handlePlay` عند استدعائها؟ تذكر أن مكون `Board` كان يستدعي `setSquares` مع مصفوفة مُحدَّثة؛ الآن يمرر مصفوفة `squares` المُحدَّثة إلى `onPlay`.

دالة `handlePlay` تحتاج لتعديل حالة `Game` لتشغيل إعادة التقديم (Re-rendering)، لكن ليس لديك دالة `setSquares` يمكنك استدعاؤها بعد الآن - أنت تستخدم الآن متغير الحالة `history` لتخزين هذه المعلومات. ستريد تحديث `history` عن طريق إضافة مصفوفة `squares` المُحدَّثة كإدخال جديد في `history`. كما تريد تبديل `xIsNext`، تمامًا كما كان يفعل `Board`:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

هنا، `[...history, nextSquares]` تنشئ مصفوفة جديدة تحتوي على جميع العناصر في `history`، تليها `nextSquares`. (يمكنك قراءة `...history` [*بناء الجملة*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) كـ "جميع العناصر في `history`".)

علي سبيل المثال، إذا كانت `history` هي `[[null,null,null], ["X",null,null]]` وكان `nextSquares` هو `["X",null,"O"]`، فإن المصفوفة الجديدة `[...history, nextSquares]` ستكون `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

في هذه النقطة، لقد نقلت الحالة لتكون في مكون `Game`، ويجب أن يكون واجهة المستخدم تعمل بالكامل، تمامًا كما كانت قبل إعادة التنظيم. هنا ما يجب أن يبدو عليه الكود في هذه النقطة:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*مَهمَّة*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

### عرض الخطوات السابقة {/*showing-the-past-moves*/}

منذ أن تتبعت تاريخ اللعبة ، يمكنك الآن عرض قائمة بالخطوات السابقة للاعب.

عناصر React مثل `<button>` هي كائنات JavaScript العادية ؛ يمكنك تمريرها في تطبيقك. لتقديم عناصر متعددة في React ، يمكنك استخدام مصفوفة من عناصر React.

لديك بالفعل مصفوفة من خطوات `history` في الحالة ، لذلك عليك الآن تحويلها إلى مصفوفة من عناصر React. في JavaScript ، لتحويل مصفوفة واحدة إلى أخرى ، يمكنك استخدام [طريقة `map` للمصفوفة:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

ستستخدم `map` لتحويل `history` من الخطوات إلى عناصر React تمثل الأزرار على الشاشة ، وعرض قائمة من الأزرار لـ "القفز" إلى الخطوات السابقة. دعنا نمرر `map` على `history` في مكون Game:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // مَهمَّة
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى الخطة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

يمكنك رؤية ما يجب أن يبدو عليه الكود أدناه. لاحظ أنه يجب أن ترى خطأ في أدوات المطورين يقول: 

``Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.``

``تحذير: يجب أن يكون لكل طفل في مصفوفة أو محدد خاصية "مفتاح" فريدة. تحقق من طريقة التصيير لـ `Game`.``

 ستقوم بإصلاح هذا الخطأ في القسم التالي.

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // مَهمَّة
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى الخطوة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

بمجرد أن تمر على مصفوفة `history` بالدالة التي قمت بتمريرها إلى `map`، فإن معامل `squares` argument يمر على كل عنصر من عناصر `history`، ومعامل `move` يمر على كل مسلسل في المصفوفة: `0`، `1`، `2`، …. (في معظم الحالات، ستحتاج إلى عناصر المصفوفة الفعلية، ولكن لتقديم قائمة من الخطوات، ستحتاج فقط إلى الفهارس.)

لكل حركة في تاريخ لعبة "تيك تاك تو"، تنشئ عنصر قائمة `<li>` يحتوي على زر `<button>`. يحتوي الزر على معالج `onClick` الذي يستدعي دالة تسمى `jumpTo` (التي لم تقم بتنفيذها بعد).

إلى الآن، يجب أن ترى قائمة بالخطوات التي حدثت في اللعبة وخطأ في وحدة تحكم المطورين. دعنا نناقش ما يعنيه خطأ "المفتاح".

### اختيار مفتاح {/*اختيار-مفتاح*/}

عندما تعرض قائمة، تخزن React بعض المعلومات عن كل عنصر في القائمة التي تم عرضها. عندما تقوم بتحديث قائمة، يحتاج React إلى تحديد ما تغير. يمكنك أن تكون قد أضفت، أزلت، رتبت أو عدلت عناصر القائمة.

تخيل الانتقال من

```html
<li>عصام: 7 مهمات متبقية</li>
<li>هند: 5 مهمات متبقية</li>
```

إلى

```html
<li>هند: 9 مهمات متبقية</li>
<li>سعيد: 8 مهمات متبقية</li>
<li>عصام: 5 مهمات متبقية</li>
```

بالإضافة إلى العدادات المحدثة، فإن الإنسان الذي يقرأ هذا سيقول على الأرجح أنك قمت بتبديل ترتيب عصام وهند، وأضفت سعيد بينهما، ومع ذلك React هو برنامج حاسوبي ولا يمكنه معرفة ما كنت تقصده، لذا تحتاج إلى تحديد خاصية مفتاحية _key_ لكل عنصر في القائمة للتمييز بين كل عنصر في القائمة وإخوته. إذا كانت بياناتك من قاعدة بيانات، فيمكن استخدام معرفات قاعدة بيانات (ID). الـid الخاص بهند وعصام وسعيد.

عندما لا يكون لديك معرفات مستقرة لتصيير العناصر، ربما تستخدم المسلسل كمفتاح كآخر محاولة:

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} مهمات متبقية
</li>
```

عندما يتم إعادة تصيير القائمة، تأخد React كل مفتاح عنصر وتبحث في القائمة السابقة عن عنصر متطابق. إذا كانت القائمة الحالية تحتوي على مفتاح لم يكن موجودًا من قبل، فإن React ينشئ عنصرًا. إذا كانت القائمة الحالية تفتقد مفتاحًا كان موجودًا في القائمةالسابقة فإن React تزيل المكون السابق. إذا تطابق مفتاحان، فإن المكون المقابل يتم نقله.

تخبر المفاتيح React عن هوية كل مكون، مما يسمح لـ React بالحفاظ على الحالة بين إعادة العرض. إذا تغير مفتاح المكون، فإن المكون سيتم تدميره وإعادة إنشائه مع حالة جديدة.

`key` هو خاصية محجوزة في React. عند إنشاء عنصر، تقوم React بإستخراج خاصية `key` وتخزينها مباشرة على العنصر المعاد. على الرغم من أن `key` قد يبدو كما لو أنه يمر كخاصية، إلا أن React تستخدم `key` تلقائيًا لتحديد أي مكونات يجب تحديثها. لا يوجد طريقة للمكون لمعرفة ما هو `key` الذي حدده المكون الأب.

**نوصي بشدة تعيين مفاتيح مناسبة كلما قمت ببناء قوائم ديناميكية.** إذا لم يكن لديك مفتاح مناسب، قد ترغب في إعادة هيكلة بياناتك بحيث تفعل ذلك.

إذا لم يتم تحديد مفتاح، فإن React ستقوم بإرجاع خطأ واستخدام مؤشر المصفوفة كمفتاح افتراضي. استخدام مؤشر المصفوفة كمفتاح يسبب مشاكل عند محاولة إعادة ترتيب عناصر القائمة أو إضافة/إزالة عناصر للقائمة. تمرير `key={i}` لا تظهر خطأً ولكن لها نفس المشاكل مثل مسلسلات المصفوفة ولا يوصى بها في معظم الحالات.

لا تحتاج المفاتيح إلى تكون فريدة مطلقًا على مستوى البرنامج (Global)، فهي تحتاج فقط إلى أن تكون فريدة بين المكونات وإخوتها.

### تنفيذ السفر عبر الزمن {/*implementing-time-travel*/}

في تاريخ لعبة "تيك تاك تو" كل نقلة سابقة لها معرف فريد مرتبط بها: إنها الرقم التسلسلي للنقلة. لن يتم إعادة ترتيب النقلات، أو حذفها، أو إدراجها في الوسط، لذلك فمن الآمن استخدام مؤشر النقلة كمفتاح.

في دالة `Game`، يمكنك إضافة المفتاح كـ `<li key={move}>`، وإذا قمت بإعادة تحميل اللعبة المعروضة، فإن خطأ "key" في React يجب أن يختفي:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // مَهمّةٌ!
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى الحركة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

قبل أن تستطيع تنفيذ `jumpTo`، تحتاج إلى أن يحتفظ المكوّن `Game` بتتبّع الخطوة التي يشاهدها المستخدم حاليًا. للقيام بذلك، قم بتعريف متغير حالة جديد يُسمّى `currentMove`، ويُعين افتراضيًا إلى `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

الآن، عدّل الدالة `jumpTo` داخل المكوّن `Game` لتحديث هذا `currentMove`. ستعين أيضًا `xIsNext` إلى `true` إذا كان الرقم الذي تقوم بتغيير `currentMove` إليه فرديًا.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

الآن، ستقوم بإجراء تغييرين على الدالة `handlePlay` في المكوّن `Game` التي تُستدعى عند النقر على مربّع.

- إذا "عدت إلى الوراء في الوقت" ثم قمت بإجراء حركة جديدة من هذه النقطة، فإنك تريد فقط الاحتفاظ بالتاريخ حتى هذه النقطة. بدلاً من إضافة `nextSquares` بعد جميع العناصر (`...` spread syntax) في `history`، ستضيفها بعد جميع العناصر في `history.slice(0, currentMove + 1)` بحيث تحتفظ فقط بهذا الجزء من التاريخ.
- في كل مرة يتم فيها إجراء حركة، تحتاج إلى تحديث `currentMove` للإشارة إلى أحدث إدخال في التاريخ.


```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

في النهاية، ستعدّل المكوّن `Game` لتقوم بعرض الخطوة المحدّدة حاليًا، بدلاً من عرض الخطوة الأخيرة دائمًا:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

إذا قمت بالنقر على أي خطوة في تاريخ اللعبة، يجب أن يتم تحديث لوحة الـ "تيك تاك تو" على الفور لعرض ما كانت عليه اللوحة بعد حدوث تلك الخطوة.

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى خطوة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

### اللمسات النهائية {/*final-cleanup*/}

إذا نظرت عن قرب إلى الكود، فقد تلاحظ أن `xIsNext === true` عندما يكون `currentMove` زوجيًا و `xIsNext === false` عندما يكون `currentMove` فرديًا. بعبارة أخرى، إذا كنت تعرف قيمة `currentMove`، فيمكنك دائمًا معرفة ما يجب أن يكون عليه `xIsNext`.

ليس هناك سبب لتخزين كليهما في الحالة. في الواقع، حاول دائمًا تجنب تكرار الحالة. يقلل تبسيط ما تخزنه في الحالة من الأخطاء ويجعل من السهل فهم الكود الخاص بك. عدّل `Game` بحيث لا يخزن `xIsNext` كمتغير حالة منفصل وبدلاً من ذلك يحدد ذلك استنادًا إلى `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

لم تعد بحاجة إلى تعريف حالة `xIsNext` أو استدعاء `setXIsNext`. الآن، لا يوجد مجال لتخلف `xIsNext` عن `currentMove`، حتى لو ارتكبت خطأ أثناء كتابة المكونات.

### الاستنتاج {/*wrapping-up*/}

مبارك! لقد أنشأت لعبة "تيك تاك تو" تقوم بما يلي:

- تتيح لك لعب لعبة "تيك تاك تو"،
- تشير إلى أن لاعبًا فاز باللعبة،
- تخزن تاريخ اللعبة مع تقدم اللعبة،
- تسمح للاعبين بمراجعة تاريخ اللعبة ورؤية الإصدارات السابقة من لوحة اللعبة.

عمل رائع! نأمل أن يكون لديك الآن فهمًا جيدًا لكيفية عمل React.

شاهد النتيجة النهائية هنا:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'الفائز هو: ' + winner;
  } else {
    status = 'اللاعب التالي: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'انتقل إلى الخطوة #' + move;
    } else {
      description = 'انتقل إلى بداية اللعبة';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
  direction: rtl;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-right: 20px;
}
```

</Sandpack>

إذا كان عندك وقت إضافي، أو تريد ممارسة مهاراتك الجديدة في React، فإليك بعض الأفكار لتحسين لعبة "تيك تاك تو"، مرتبة حسب صعوبتها:

1. في الخطوة الحالية فقط، اعرض "أنت في الخطوة #..." بدلاً من زر.
1. أعد كتابة `Board` لاستخدام حلقتين (loop) لإنشاء المربعات بدلاً من كتابتها يدويًا.
1. أضف زر تبديل يتيح لك فرز الخطوات بترتيب تصاعدي أو تنازلي.
1. عندما يفوز أحد، قم بتمييز المربعات الثلاثة التي تسببت في الفوز (وعندما لا يفوز أحد، عرض رسالة حول نتيجة اللعبة).
1. عرض الموقع لكل خطوة في التنسيق (الصف، العمود) في قائمة تاريخ الخطوات.

طوال هذا الشرح التطبيقي لمست مفاهيم React بما في ذلك العناصر (elements)، والمكونات (components)، والخصائص (props)، والحالة (state). الآن بعد أن رأيت كيف تعمل هذه المفاهيم عند بناء لعبة، تفقد [التفكير في React](/learn/thinking-in-react) لمعرفة كيف تعمل نفس المفاهيم في React عند بناء واجهة مستخدم تطبيق.
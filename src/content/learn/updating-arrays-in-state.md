---
title: تحديث المصفوفات في الحالة
---

<Intro>

المصفوفات قابلة للتعديل في JavaScript، لكن يجب التعامل معها كأنها غير قابلة للتعديل عند تخزينها في الحالة. وكما في الكائنات، عندما تريد تحديث مصفوفة مخزّنة في الحالة، أنشئ مصفوفة جديدًا (أو انسخًا من مصفوفة موجودة)، ثم اضبط الحالة لتستخدم المصفوفة الجديدة.

</Intro>

<YouWillLearn>

- كيفية إضافة عناصر أو إزالتها أو تغييرها في مصفوفة داخل حالة React
- كيفية تحديث كائن داخل مصفوفة
- كيف تقلل تكرار نسخ المصفوفات باستخدام Immer

</YouWillLearn>

## تحديث المصفوفات دون تعديل موضعي {/*updating-arrays-without-mutation*/}

في JavaScript، المصفوفات نوع آخر من الكائنات. [كما في الكائنات](/learn/updating-objects-in-state)، **عامل المصفوفات في حالة React وكأنها للقراءة فقط.** أي لا تعيد تعيين عناصر داخل المصفوفة مثل `arr[0] = 'bird'`، ولا تستخدم دوالًا تعدّل المصفوفة موضعيًا مثل `push()` و`pop()`.

بدلًا من ذلك، في كل مرة تريد فيها تحديث مصفوفة، مرّر *مصفوفة جديدة* إلى دالة ضبط الحالة. لذلك يمكنك إنشاء مصفوفة جديدة من المصفوفة الأصلية في حالتك باستدعاء دوالها غير المعدّلة موضعيًا مثل `filter()` و`map()`، ثم تضبط الحالة على المصفوفة الناتجة.

فيما يلي جدول مرجعي لعمليات شائعة على المصفوفات. عند التعامل مع مصفوفات داخل حالة React، تجنّب الدوال في العمود الأيسر، ويفضّل استخدام الدوال في العمود الأيمن:

|           | تجنّب (يعدّل المصفوفة)           | يُفضّل (يعيد مصفوفة جديدة)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| إضافة    | `push`, `unshift`                   | `concat`, صيغة الانتشار `[...arr]` ([مثال](#adding-to-an-array)) |
| إزالة  | `pop`, `shift`, `splice`            | `filter`, `slice` ([مثال](#removing-from-an-array))              |
| استبدال | `splice`, `arr[i] = ...` assignment | `map` ([مثال](#replacing-items-in-an-array))                     |
| ترتيب   | `reverse`, `sort`                   | انسخ المصفوفة أولًا ([مثال](#making-other-changes-to-an-array)) |

بديلًا، يمكنك [استخدام Immer](#write-concise-update-logic-with-immer) الذي يسمح لك باستخدام دوال من العمودين.

<Pitfall>

لسوء الحظ، [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) و[`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) اسمهما متشابه لكنهما مختلفان جدًا:

* `slice` تنسخ مصفوفة أو جزءًا منها.
* `splice` **تعدّل** المصفوفة موضعيًا (لإدراج أو حذف عناصر).

في React، ستستخدم `slice` (بدون حرف p!) كثيرًا لأنك لا تريد تعديل الكائنات أو المصفوفات في الحالة. صفحة [تحديث الكائنات](/learn/updating-objects-in-state) تشرح ما التعديل الموضعي ولماذا لا يُنصح به للحالة.

</Pitfall>

### الإضافة إلى مصفوفة {/*adding-to-an-array*/}

`push()` تعدّل المصفوفة موضعيًا، وهذا ما لا تريده:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

بدلًا من ذلك، أنشئ *مصفوفة جديدة* تحتوي العناصر الموجودة *و* عنصرًا جديدًا في النهاية. طرق عدة لفعل ذلك، لكن الأسهل استخدام صيغة [انتشار المصفوفة `...`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // استبدل الحالة
  [ // بمصفوفة جديدة
    ...artists, // تحتوي كل العناصر القديمة
    { id: nextId++, name: name } // وعنصرًا جديدًا في النهاية
  ]
);
```

الآن يعمل بشكل صحيح:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

تسمح صيغة انتشار المصفوفة أيضًا بإدراج عنصر في المقدمة بوضعه *قبل* `...artists` الأصلية:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // ضع العناصر القديمة في النهاية
]);
```

بهذا، يؤدي الانتشار عمل `push()` بإضافة في نهاية المصفوفة وعمل `unshift()` بإضافة في بدايتها. جرّب ذلك في صندوق الرمل أعلاه!

### الإزالة من مصفوفة {/*removing-from-an-array*/}

أسهل طريقة لإزالة عنصر من مصفوفة هي *تصفيته*. أي تنتج مصفوفة جديدة لا تحتوي ذلك العنصر. لفعل ذلك، استخدم الدالة `filter`، مثلاً:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

انقر زر «Delete» عدة مرات، وانظر إلى معالج النقر.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

هنا، `artists.filter(a => a.id !== artist.id)` تعني «أنشئ مصفوفة من `artists` الذين معرفاتهم تختلف عن `artist.id`». أي أن زر «Delete» لكل فنان يصفّي _ذلك_ الفنان من المصفوفة، ثم يطلب إعادة تصيير بالمصفوفة الناتجة. لاحظ أن `filter` لا تعدّل المصفوفة الأصلية.

### تحويل مصفوفة {/*transforming-an-array*/}

إن أردت تغيير بعض عناصر المصفوفة أو كلها، يمكنك استخدام `map()` لإنشاء مصفوفة **جديدة**. الدالة التي تمرّرها إلى `map` تقرر ما تفعله بكل عنصر بناءً على بياناته أو فهرسه (أو كليهما).

في هذا المثال، تحتفظ مصفوفة بإحداثيات دائرتين ومربع. عند الضغط على الزر، تحرّك الدائرتين فقط لأسفل 50 بكسلًا، بإنتاج مصفوفة بيانات جديدة باستخدام `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### استبدال عناصر في مصفوفة {/*replacing-items-in-an-array*/}

شائع جدًا رغبة استبدال عنصر أو أكثر في مصفوفة. تعيينات مثل `arr[0] = 'bird'` تعدّل المصفوفة الأصلية، لذا تريد استخدام `map` لهذا أيضًا.

لاستبدال عنصر، أنشئ مصفوفة جديدة بـ `map`. داخل استدعاء `map`، تستقبل فهرس العنصر كوسيط ثانٍ. استخدمه لتحديد إن كنت تعيد العنصر الأصلي (الوسيط الأول) أو شيئًا آخر:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### الإدراج في مصفوفة {/*inserting-into-an-array*/}

أحيانًا تريد إدراج عنصر في موضع معيّن ليس في البداية ولا في النهاية. لذلك يمكنك استخدام صيغة انتشار المصفوفة `...` مع الدالة `slice()`. تسمح `slice()` بقطع «شريحة» من المصفوفة. لإدراج عنصر، تنشئ مصفوفة تبثّ الشريحة _قبل_ نقطة الإدراج، ثم العنصر الجديد، ثم بقية المصفوفة الأصلية.

في هذا المثال، زر الإدراج يدرج دائمًا عند الفهرس `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### إجراء تغييرات أخرى على مصفوفة {/*making-other-changes-to-an-array*/}

هناك أمور لا يمكنك فعلها بصيغة الانتشار وحدها أو بدوال غير معدّلة مثل `map()` و`filter()`. مثلاً قد تريد عكس مصفوفة أو ترتيبها. دوال JavaScript `reverse()` و`sort()` تعدّل المصفوفة الأصلية، فلا يمكنك استخدامها مباشرة.

**لكن يمكنك نسخ المصفوفة أولًا، ثم إجراء التغييرات عليها.**

مثال:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

هنا تستخدم صيغة الانتشار `[...list]` لإنشاء نسخة من المصفوفة الأصلية أولًا. بمجرد حصولك على نسخة، يمكنك استخدام دوال تعديل موضعي مثل `nextList.reverse()` أو `nextList.sort()`، أو حتى تعيين عناصر بـ `nextList[0] = "something"`.

لكن **حتى إن نسخت المصفوفة، لا يمكنك تعديل العناصر الموجودة _داخلها_ مباشرة.** لأن النسخ سطحي—المصفوفة الجديدة تحتوي نفس العناصر التي في الأصلية. فإن عدّلت كائنًا داخل المصفوفة المنسوخة، تعدّل الحالة الموجودة. مثلاً، كود كهذا مشكلة.

```js
const nextList = [...list];
nextList[0].seen = true; // مشكلة: يعدّل list[0]
setList(nextList);
```

رغم أن `nextList` و`list` مصفوفتان مختلفتان، **`nextList[0]` و`list[0]` يشيران إلى نفس الكائن.** فبتغيير `nextList[0].seen` تغيّر أيضًا `list[0].seen`. هذا تعديل موضعي للحالة يجب تجنّبه! يمكنك حل المشكلة كما في [تحديث كائنات JavaScript متداخلة](/learn/updating-objects-in-state#updating-a-nested-object)—بنسخ العناصر الفردية التي تريد تغييرها بدل تعديلها موضعيًا. إليك الطريقة.

## تحديث كائنات داخل مصفوفات {/*updating-objects-inside-arrays*/}

الكائنات ليست _موجودة حقًا_ «داخل» المصفوفات. قد تبدو «داخلًا» في الكود، لكن كل كائن في المصفوفة قيمة منفصلة «يشير» إليها المصفوفة. لذلك كن حذرًا عند تغيير حقول متداخلة مثل `list[0]`. قد تشير قائمة أعمال فنية لشخص آخر إلى نفس عنصر المصفوفة!

**عند تحديث حالة متداخلة، أنشئ نسخًا من موضع التحديث حتى المستوى الأعلى.** لنرَ كيف يعمل.

في هذا المثال، قائمتان منفصلتان للأعمال الفنية لهما نفس الحالة الابتدائية. من المفترض أن تكونا معزولتين، لكن بسبب تعديل موضعي تتشاركان الحالة بالخطأ، فيؤثر تفعيل خانة في إحداهما على الأخرى:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

المشكلة في كود كهذا:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // مشكلة: يعدّل عنصرًا موجودًا
setMyList(myNextList);
```

رغم أن مصفوفة `myNextList` جديدة، *العناصر نفسها* مطابقة لعناصر `myList` الأصلية. فتغيير `artwork.seen` يغيّر عنصر العمل الفني *الأصلي*. وهذا العنصر موجود أيضًا في `yourList`، فيسبب الخلل. مثل هذه الأخطاء صعبة التصور، لكنها تختفي إن تجنبت التعديل الموضعي للحالة.

**يمكنك استخدام `map` لاستبدال عنصر قديم بنسخته المحدّثة دون تعديل موضعي.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

هنا، `...` هي صيغة انتشار الكائن المستخدمة لـ [إنشاء نسخة من كائن.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

بهذا النهج، لا يُعدّل أي عنصر من عناصر الحالة الموجودة، ويُصلح الخلل:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

بشكل عام، **عدّل موضعيًا فقط الكائنات التي أنشأتها للتو.** إن أدرجت عملًا فنيًا *جديدًا*، يمكنك تعديله، لكن إن تعاملت مع شيء في الحالة بالفعل، تحتاج نسخًا.

### اكتب منطق التحديث بإيجاز باستخدام Immer {/*write-concise-update-logic-with-immer*/}

تحديث مصفوفات متداخلة دون تعديل موضعي قد يصبح مكررًا قليلًا. [كما في الكائنات](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- غالبًا لا تحتاج لتحديث الحالة أعمق من مستويين. إن كانت كائنات الحالة عميقة جدًا، قد ترغب في [إعادة هيكلتها](/learn/choosing-the-state-structure#avoid-deeply-nested-state) لتصبح مسطحة.
- إن لم ترد تغيير بنية الحالة، قد تفضّل [Immer](https://github.com/immerjs/use-immer)، الذي يسمح بكتابة مريحة تبدو كتعديل موضعي بينما ينتج النسخ عنك.

إليك مثال Art Bucket List معاد كتابته بـ Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

لاحظ أنه مع Immer، **تعديل موضعي مثل `artwork.seen = nextSeen` أصبح مقبولًا:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

لأنك لا تعدّل الحالة *الأصلية*، بل كائن `draft` الخاص الذي يوفّره Immer. وبالمثل، يمكنك تطبيق دوال تعديل موضعي مثل `push()` و`pop()` على محتوى `draft`.

في الخلفية، يبني Immer الحالة التالية من الصفر وفق التغييرات التي أجريتها على `draft`. هذا يبقي معالجات الأحداث موجزة دون تعديل الحالة موضعيًا أبدًا.

<Recap>

- يمكنك وضع مصفوفات في الحالة، لكن لا تغيّرها مباشرة.
- بدل تعديل مصفوفة موضعيًا، أنشئ *نسخة جديدة* منها، وحدّث الحالة إليها.
- يمكنك استخدام صيغة انتشار المصفوفة `[...arr, newItem]` لإنشاء مصفوفات بعناصر جديدة.
- يمكنك استخدام `filter()` و`map()` لإنشاء مصفوفات جديدة بعناصر مفلترة أو محوّلة.
- يمكنك استخدام Immer لإبقاء الكود موجزًا.

</Recap>



<Challenges>

#### حدّث عنصرًا في سلة التسوق {/*update-an-item-in-the-shopping-cart*/}

أكمل منطق `handleIncreaseClick` بحيث يزيد الضغط على «+» العدد المقابل:


<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

يمكنك استخدام `map` لإنشاء مصفوفة جديدة، ثم صيغة انتشار الكائن `...` لإنشاء نسخة من الكائن المتغيّر داخل المصفوفة الجديدة:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### أزل عنصرًا من سلة التسوق {/*remove-an-item-from-the-shopping-cart*/}

سلة التسوق هذه فيها زر «+» يعمل، لكن زر «–» لا يفعل شيئًا. أضف معالج حدث يقلّل `count` للمنتج المقابل عند الضغط. إن ضغطت «–» عندما يكون العدد 1، يُزال المنتج تلقائيًا من السلة. تأكد ألا يظهر 0 أبدًا.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

يمكنك أولًا استخدام `map` لإنتاج مصفوفة جديدة، ثم `filter` لإزالة المنتجات التي `count` لها يساوي `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### أصلح التعديلات الموضعية بدوال غير معدّلة {/*fix-the-mutations-using-non-mutative-methods*/}

في هذا المثال، كل معالجات الأحداث في `App.js` تستخدم تعديلًا موضعيًا. لذلك لا يعمل تعديل وحذف المهام. أعد كتابة `handleAddTodo` و`handleChangeTodo` و`handleDeleteTodo` لاستخدام دوال غير معدّلة موضعيًا:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

في `handleAddTodo`، استخدم صيغة انتشار المصفوفة. في `handleChangeTodo`، أنشئ مصفوفة جديدة بـ `map`. في `handleDeleteTodo`، أنشئ مصفوفة جديدة بـ `filter`. الآن تعمل القائمة بشكل صحيح:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### أصلح التعديلات الموضعية باستخدام Immer {/*fix-the-mutations-using-immer*/}

هذا نفس المثال من التحدي السابق. هذه المرة أصلح التعديل الموضعي باستخدام Immer. لراحتك، `useImmer` مستورد مسبقًا، فغيّر متغير حالة `todos` ليستخدمه.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

مع Immer، يمكنك كتابة الكود بأسلوب يبدو تعديلًا موضعيًا، ما دمت تعدّل فقط أجزاء `draft` التي يعطيك إياها Immer. هنا، تُجرى كل التعديلات على `draft`، فيعمل الكود بشكل سليم:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

يمكنك أيضًا الجمع بين الأسلوب التعديلي الظاهري وغير المعدّل مع Immer.

مثلاً، في هذا الإصدار `handleAddTodo` يطبّق بتعديل `draft` من Immer، بينما `handleChangeTodo` و`handleDeleteTodo` يستخدمان `map` و`filter` غير المعدّلة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

مع Immer، يمكنك اختيار الأسلوب الأنسب لكل حالة على حدة.

</Solution>

</Challenges>

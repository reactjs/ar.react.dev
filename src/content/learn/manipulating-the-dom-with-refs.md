---
title: التلاعب بـ DOM باستخدام المراجع
---

<Intro>

يحدّث React تلقائيًا [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) ليطابق مخرجات التصيير، لذا لا تحتاج مكوّناتك غالبًا إلى التلاعب به. لكن أحيانًا قد تحتاج إلى الوصول إلى عناصر DOM التي يديرها React—مثلًا لوضع التركيز على عقدة، أو التمرير إليها، أو قياس حجمها وموضعها. لا توجد في React طريقة مدمجة لفعل ذلك، لذا ستحتاج إلى *مرجع* (ref) إلى عقدة DOM.

</Intro>

<YouWillLearn>

- كيفية الوصول إلى عقدة DOM يديرها React باستخدام خاصية `ref`
- كيف ترتبط خاصية `ref` في JSX بخطاف `useRef`
- كيفية الوصول إلى عقدة DOM لمكوّن آخر
- في أي الحالات يكون تعديل DOM الذي يديره React آمنًا

</YouWillLearn>

## الحصول على مرجع إلى العقدة {/*getting-a-ref-to-the-node*/}

للوصول إلى عقدة DOM يديرها React، استورد أولًا خطاف `useRef`:

```js
import { useRef } from 'react';
```

ثم استخدمه للإعلان عن مرجع داخل مكوّنك:

```js
const myRef = useRef(null);
```

أخيرًا، مرّر مرجعك كخاصية `ref` على وسم JSX الذي تريد الحصول على عقدة DOM له:

```js
<div ref={myRef}>
```

يعيد خطاف `useRef` كائنًا فيه خاصية واحدة اسمها `current`. في البداية، ستكون `myRef.current` قيمتها `null`. عندما ينشئ React عقدة DOM لهذا `<div>`، يضع مرجعًا إلى هذه العقدة داخل `myRef.current`. يمكنك بعدها الوصول إلى عقدة DOM من [معالجات الأحداث](/learn/responding-to-events) واستخدام [واجهات المتصفح](https://developer.mozilla.org/docs/Web/API/Element) المدمَحة المعرفة عليها.

```js
// You can use any browser APIs, for example:
myRef.current.scrollIntoView();
```

### مثال: تركيز حقل نصي {/*example-focusing-a-text-input*/}

في هذا المثال، النقر على الزر يضع التركيز في الحقل:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

لتنفيذ ذلك:

1. صرّح عن `inputRef` بخطاف `useRef`.
2. مرّره كـ`<input ref={inputRef}>`. هذا يخبر React بأن **يضع عقدة DOM لهذا `<input>` داخل `inputRef.current`.**
3. في الدالة `handleClick`، اقرأ عقدة الإدخال من `inputRef.current` واستدعِ [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) عليها بـ`inputRef.current.focus()`.
4. مرّر معالج الحدث `handleClick` إلى `<button>` بـ`onClick`.

رغم أن التلاعب بـ DOM هو الاستخدام الأشهر للمراجع، يمكن استخدام خطاف `useRef` لتخزين أشياء أخرى خارج React، مثل معرّفات المؤقتات. مثل الحالة، تبقى المراجع بين عمليات التصيير. المراجع تشبه متغيرات الحالة التي لا تُطلِق إعادة تصيير عند تعيينها. اطّلع على المراجع في [الإشارة إلى قيم بالمراجع](/learn/referencing-values-with-refs).

### مثال: التمرير إلى عنصر {/*example-scrolling-to-an-element*/}

يمكن أن يكون لديك أكثر من مرجع واحد في المكوّن. في هذا المثال، هناك شريط صور من ثلاث صور. كل زر يمركز صورة باستدعاء [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) في المتصفح على عقدة DOM المقابلة:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### كيفية إدارة قائمة من المراجع باستخدام دالة مرجع {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

في الأمثلة أعلاه، عدد المراجع معلوم مسبقًا. لكن أحيانًا قد تحتاج مرجعًا لكل عنصر في القائمة، ولا تعرف كم سيكون عددها. شيء كهذا **لن يعمل**:

```js
<ul>
  {items.map((item) => {
    // Doesn't work!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

السبب أن **الخطافات يجب أن تُستدعى فقط في المستوى الأعلى من المكوّن.** لا يمكنك استدعاء `useRef` داخل حلقة أو شرط أو داخل استدعاء `map()`.

إحدى الطرق الممكنة هي الحصول على مرجع واحد لعنصر الأب، ثم استخدام طرق DOM مثل [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) لـ«إيجاد» العقد الفرعية منه. لكن هذا هش وقد ينكسر عند تغيّر بنية DOM.

حل آخر هو **تمرير دالة إلى خاصية `ref`.** يُسمّى هذا [`ref` callback.](/reference/react-dom/components/common#ref-callback) سيستدعي React دالة المرجع مع عقدة DOM عند تعيين المرجع، ويستدعي دالة التنظيف المعادة من الدالة عند إزالة المرجع. هذا يتيح لك الإبقاء على مصفوفة خاصة بك أو [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)، والوصول لأي مرجع بفهرسه أو نوع من المعرّفات.

يوضح هذا المثال كيف تستخدم هذا الأسلوب للتمرير إلى عقدة عشوائية في قائمة طويلة:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

في هذا المثال، لا يحتفظ `itemsRef` بعقدة DOM واحدة. بل يحتفظ بـ[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) من عنصر إلى عقدة DOM. ([يمكن للمراجع أن تحتفظ بأي قيم!](/learn/referencing-values-with-refs)) تتولى [`ref` callback](/reference/react-dom/components/common#ref-callback) على كل عنصر في القائمة تحديث الـMap:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

هذا يتيح لك قراءة عقد DOM فردية من الـMap لاحقًا.

<Note>

عند تفعيل Strict Mode، تُنفَّذ دوال مرجع الـref مرتين في وضع التطوير.

اقرأ المزيد عن [كيف يساعد هذا في إيجاد الأخطاء](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) في مراجع الـcallback.

</Note>

</DeepDive>

## الوصول إلى عقد DOM لمكوّن آخر {/*accessing-another-components-dom-nodes*/}

<Pitfall>
المراجع مخرج طوارئ. التلاعب يدويًا بعقد DOM *لمكوّن آخر* قد يجعل شيفرتك هشة.
</Pitfall>

يمكنك تمرير المراجع من المكوّن الأب إلى الأبناء [مثل أي خاصية أخرى](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

في المثال أعلاه، يُنشأ مرجع في المكوّن الأب `MyForm`، ويُمرَّر إلى المكوّن الابن `MyInput`. يمرّر `MyInput` بعدها المرجع إلى `<input>`. لأن `<input>` [مكوّنًا مدمجًا](/reference/react-dom/components/common)، يضبط React خاصية `.current` للمرجع على عنصر DOM لـ`<input>`.

أصبح `inputRef` المُنشأ في `MyForm` يشير إلى عنصر DOM لـ`<input>` الذي يعيده `MyInput`. يمكن لمعالج نقر مُنشأ في `MyForm` الوصول إلى `inputRef` واستدعاء `focus()` لوضع التركيز على `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### كشف جزء من الواجهة بمقبض أمرَي {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

في المثال أعلاه، يُمرَّر المرجع إلى `MyInput` ثم إلى عنصر إدخال DOM الأصلي. هذا يتيح للمكوّن الأب استدعاء `focus()` عليه. لكنه يتيح أيضًا فعل أشياء أخرى—مثلًا تغيير أنماط CSS. في حالات نادرة قد ترغب في تقييد الوظائف المكشوفة. يمكنك ذلك بـ[`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

هنا، يحتفظ `realInputRef` داخل `MyInput` بعقدة إدخال DOM الفعلية. لكن [`useImperativeHandle`](/reference/react/useImperativeHandle) يوجّه React لتوفير كائن خاص بك كقيمة مرجع للمكوّن الأب. لذا سيكون لدى `inputRef.current` داخل `Form` فقط الدالة `focus`. في هذه الحالة، «مقبض» المرجع ليس عقدة DOM، بل الكائن المخصّص الذي تنشئه داخل استدعاء [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## متى يربط React المراجع {/*when-react-attaches-the-refs*/}

في React، يُقسَم كل تحديث إلى [مرحلتين](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* أثناء **التصيير،** يستدعي React مكوّناتك ليعرف ما يجب أن يظهر على الشاشة.
* أثناء **الإيداع (commit)،** يطبّق React التغييرات على DOM.

عمومًا، [لا ترغب](/learn/referencing-values-with-refs#best-practices-for-refs) بالوصول إلى المراجع أثناء التصيير. وهذا ينطبق على المراجع التي تحتفظ بعقد DOM. في التصيير الأول لم تُنشأ عقد DOM بعد، لذا ستكون `ref.current` قيمتها `null`. وفي تصيير التحديثات لم تُحدَّث عقد DOM بعد، فالوصول مبكر جدًا.

يضبط React `ref.current` أثناء الإيداع. قبل تحديث DOM، يضبط React قيم `ref.current` المتأثرة إلى `null`. وبعد تحديث DOM، يضبطها فورًا إلى عقد DOM المقابلة.

**غالبًا ستصل إلى المراجع من معالجات الأحداث.** إن أردت فعل شيء بمرجع دون حدث معيّن، قد تحتاج إلى Effect. سنناقش التأثيرات في الصفحات التالية.

<DeepDive>

#### دفع تحديثات الحالة متزامنًا بـ`flushSync` {/*flushing-state-updates-synchronously-with-flush-sync*/}

انظر شيفرة كهذه، تضيف مهمة جديدة وتمرّر الشاشة إلى آخر ابن في القائمة. لاحظ كيف أنها دائمًا تتمرّر إلى المهمة التي *سبقت مباشرة* آخر مهمة أُضيفت:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

المشكلة في هذين السطرين:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

في React، [تُصفَّ تحديثات الحالة في طابور.](/learn/queueing-a-series-of-state-updates) عادةً هذا ما تريده. لكن هنا يسبب مشكلة لأن `setTodos` لا يحدّث DOM فورًا. لذا عند التمرير إلى آخر عنصر، لم تُضف المهمة بعد. لهذا يتأخر التمرير دائمًا بعنصر واحد.

لإصلاح ذلك، يمكنك إجبار React على تحديث DOM («دفعه») متزامنًا. لذلك استورد `flushSync` من `react-dom` و**لفّ تحديث الحالة** داخل استدعاء `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

هذا يوجّه React لتحديث DOM متزامنًا مباشرة بعد تنفيذ الشيفرة الملفوفة بـ`flushSync`. فيصبح آخر عنصر موجودًا في DOM عند محاولة التمرير إليه:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## أفضل ممارسات التلاعب بـ DOM باستخدام المراجع {/*best-practices-for-dom-manipulation-with-refs*/}

المراجع مخرج طوارئ. استخدمها فقط عندما تضطر إلى «الخطوة خارج React». من الأمثلة الشائعة إدارة التركيز، وموضع التمرير، أو استدعاء واجهات المتصفح التي لا يعرضها React.

إن التزمت بإجراءات غير مدمرة مثل التركيز والتمرير، فلن تواجه مشاكل غالبًا. لكن إن حاولت **تعديل** DOM يدويًا، فقد تتعارض مع التغييرات التي يجريها React.

لتوضيح المشكلة، يتضمن هذا المثال رسالة ترحيب وزرين. الزر الأول يبدّل ظهورها بـ[تصيير شرطي](/learn/conditional-rendering) و[حالة](/learn/state-a-components-memory)، كما تفعل عادةً في React. الزر الثاني يستخدم [واجهة `remove()` في DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) لإزالتها قسرًا من DOM خارج سيطرة React.

جرّب الضغط على «Toggle with setState» عدة مرات. يجب أن تختفي الرسالة وتظهر. ثم اضغط «Remove from the DOM». هذا يزيلها قسرًا. أخيرًا اضغط «Toggle with setState»:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

بعد إزالة عنصر DOM يدويًا، محاولة استخدام `setState` لإظهاره مجددًا تؤدي إلى تعطل. لأنك غيّرت DOM ولم يعد React يعرف كيف يديره بشكل صحيح.

**تجنّب تغيير عقد DOM التي يديرها React.** تعديلها أو إضافة أبناء إليها أو إزالة أبناء منها قد يؤدي إلى نتائج بصرية غير متسقة أو تعطل كما أعلاه.

لكن هذا لا يعني أنك لا تستطيع أبدًا. الأمر يتطلّب حذرًا. **يمكنك بأمان تعديل أجزاء من DOM ليس لدى React سبب لتحديثها.** مثلًا، إذا كان `<div>` ما فارغًا دائمًا في JSX، فلن يكون لدى React سبب للمس قائمة أبنائه، فيكون آمناً إضافة أو إزالة عناصر يدويًا هناك.

<Recap>

- المراجع مفهوم عام، لكنك غالبًا تستخدمها لاحتجاز عناصر DOM.
- توجّه React لوضع عقدة DOM في `myRef.current` بتمرير `<div ref={myRef}>`.
- غالبًا تستخدم المراجع لإجراءات غير مدمرة مثل التركيز والتمرير أو قياس عناصر DOM.
- لا يكشف المكوّن عن عقد DOM افتراضيًا. يمكنك اختياريًا كشف عقدة DOM باستخدام خاصية `ref`.
- تجنّب تغيير عقد DOM التي يديرها React.
- إن عدّلت عقد DOM يديرها React، فعدّل أجزاء ليس لدى React سبب لتحديثها.

</Recap>



<Challenges>

#### تشغيل الفيديو وإيقافه {/*play-and-pause-the-video*/}

في هذا المثال، يبدّل الزر متغير حالة بين التشغيل والإيقاف. لكن لتشغيل الفيديو أو إيقافه فعليًا، تبديل الحالة لا يكفي. تحتاج أيضًا إلى استدعاء [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) و[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) على عنصر DOM لـ`<video>`. أضف مرجعًا إليه، واجعل الزر يعمل.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

لتحدٍ إضافي، أبقِ زر «Play» متزامنًا مع تشغيل الفيديو حتى لو نقر المستخدم بالزر الأيمن وشغّل الفيديو من عناصر التحكم المدمجة في المتصفح. قد ترغب في الاستماع إلى `onPlay` و`onPause` على الفيديو لذلك.

<Solution>

صرّح عن مرجع وضعه على عنصر `<video>`. ثم استدعِ `ref.current.play()` و`ref.current.pause()` في معالج الحدث حسب الحالة التالية.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

للتعامل مع عناصر التحكم المدمجة في المتصفح، أضف معالجي `onPlay` و`onPause` إلى `<video>` واستدعِ `setIsPlaying` منهما. هكذا إذا شغّل المستخدم الفيديو من عناصر المتصفح، تتكيّف الحالة.

</Solution>

#### تركيز حقل البحث {/*focus-the-search-field*/}

اجعل النقر على زر «Search» يضع التركيز في الحقل.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

أضف مرجعًا إلى الإدخال، واستدعِ `focus()` على عقدة DOM لوضع التركيز:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### تمرير شريط صور {/*scrolling-an-image-carousel*/}

لهذا الشريط زر «Next» يبدّل الصورة النشطة. اجعل المعرض يتمرّر أفقيًا إلى الصورة النشطة عند النقر. ستستدعي [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) على عقدة DOM للصورة النشطة:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

لا تحتاج مرجعًا لكل صورة في هذا التمرين. يكفي مرجع للصورة النشطة حاليًا، أو للقائمة نفسها. استخدم `flushSync` لضمان تحديث DOM *قبل* التمرير.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

يمكنك الإعلان عن `selectedRef`، ثم تمريره شرطيًا فقط للصورة الحالية:

```js
<li ref={index === i ? selectedRef : null}>
```

عندما `index === i`، أي أن الصورة هي المختارة، يستقبل `<li>` الـ`selectedRef`. يضمن React أن `selectedRef.current` يشير دائمًا إلى عقدة DOM الصحيحة.

لاحظ أن استدعاء `flushSync` ضروري لإجبار React على تحديث DOM قبل التمرير. وإلا فسيشير `selectedRef.current` دائمًا إلى العنصر الذي كان مختارًا سابقًا.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### تركيز حقل البحث مع مكوّنات منفصلة {/*focus-the-search-field-with-separate-components*/}

اجعل النقر على «Search» يضع التركيز في الحقل. لاحظ أن كل مكوّن في ملف منفصل ولا يجب نقله منه. كيف تربطهما؟

<Hint>

ستحتاج لتمرير `ref` كخاصية للموافقة على كشف عقدة DOM من مكوّنك الخاص مثل `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

أضف خاصية `onClick` إلى `SearchButton`، واجعل `SearchButton` يمرّرها إلى `<button>` في المتصفح. مرّر أيضًا مرجعًا إلى `<SearchInput>` الذي يعيد توجيهه إلى `<input>` الحقيقي. أخيرًا، في معالج النقر، استدعِ `focus` على عقدة DOM المخزنة في ذلك المرجع.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>

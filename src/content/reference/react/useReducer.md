---
title: دالة useReducer
---

<Intro>

`useReducer` هو Hook في React يتيح لك إضافة [reducer](/learn/extracting-state-logic-into-a-reducer) إلى مكوّنك.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

استدعِ `useReducer` في أعلى مستوى مكوّنك لإدارة حالته بـ [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reducer`: دالة الـ reducer التي تحدد كيفية تحديث الحالة. يجب أن تكون نقية، وتأخذ الحالة والـ action كوسائط، وتعيد الحالة التالية. يمكن أن تكون الحالة والـ action من أي نوع.
* `initialArg`: القيمة التي تُحسب منها الحالة الأولية. يمكن أن تكون من أي نوع. طريقة حساب الحالة الأولية منها تعتمد على وسيط `init` التالي.
* **اختياري** `init`: دالة تهيئة يجب أن تعيد الحالة الأولية. إذا لم تُحدَّد، تُضبط الحالة الأولية إلى `initialArg`. وإلا تُضبط إلى نتيجة استدعاء `init(initialArg)`.

#### القيمة المعادة {/*returns*/}

`useReducer` يعيد مصفوفة بقيمتين بالضبط:

1. الحالة الحالية. في أول render، تُضبط إلى `init(initialArg)` أو `initialArg` (إن لم يكن هناك `init`).
2. [دالة `dispatch`](#dispatch) التي تتيح تحديث الحالة إلى قيمة مختلفة وإطلاق إعادة رسم.

#### ملاحظات مهمة {/*caveats*/}

* `useReducer` هو Hook، فتستدعيه **في أعلى مستوى المكوّن** أو في Hooks خاصة بك فقط. لا تستدعه داخل حلقات أو شروط. إذا احتجت ذلك، استخرج مكوّنًا جديدًا وانقل الـ state إليه.
* دالة `dispatch` لهوية مستقرة، فغالبًا تُحذف من تبعيات Effects، لكن تضمينها لا يجعل الـ Effect يشتغل. إذا سمح linter بحذف تبعية بلا أخطاء، فالأمر آمن. [تعرّف أكثر على إزالة تبعيات Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* في Strict Mode، تستدعي React **reducerك ومهيئك مرتين** من أجل [مساعدتك على اكتشاف الشوائب غير المقصودة.](#my-reducer-or-initializer-function-runs-twice) هذا للتطوير فقط ولا يؤثر على الإنتاج. إذا كانا نقيين (كما ينبغي)، فلا يؤثر ذلك على المنطق. تُتجاهل نتيجة أحد الاستدعاءين.

---

### دالة `dispatch` {/*dispatch*/}

دالة `dispatch` التي يعيدها `useReducer` تتيح تحديث الحالة إلى قيمة مختلفة وإطلاق إعادة رسم. مرّر الـ action كالوسيط الوحيد لـ`dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

تضبط React الحالة التالية إلى نتيجة استدعاء دالة `reducer` التي وفرتها بالحالة الحالية والـ action التي مررتها إلى `dispatch`.

#### المعاملات {/*dispatch-parameters*/}

* `action`: الفعل الذي نفّذه المستخدم. يمكن أن يكون من أي نوع. بالاصطلاح، يكون الـ action غالبًا كائنًا فيه خاصية `type` تميّزه، واختياريًا خصائص أخرى لمعلومات إضافية.

#### القيمة المعادة {/*dispatch-returns*/}

دوال `dispatch` لا تعيد قيمة.

#### ملاحظات مهمة {/*setstate-caveats*/}

* دالة `dispatch` **تحدّث متغير الحالة لـ*الـ* render التالي فقط**. إذا قرأت متغير الحالة بعد استدعاء `dispatch`، [ستحصل على القيمة القديمة](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) التي كانت على الشاشة قبل الاستدعاء.

* إذا كانت القيمة الجديدة مطابقة للحالة الحالية `state` حسب مقارنة [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)، **تتخطى React إعادة رسم المكوّن وأبناءه.** هذا تحسين. قد تحتاج React لاستدعاء مكوّنك قبل تجاهل النتيجة، لكن ذلك لا ينبغي أن يؤثر على كودك.

* React [تجمع تحديثات الحالة.](/learn/queueing-a-series-of-state-updates) تحدّث الشاشة **بعد أن تنتهي كل معالجات الأحداث** وتستدعي دوال `set` الخاصة بها. ذلك يمنع إعادات رسم متعددة في حدث واحد. في الحالات النادرة التي تحتاج فيها لإجبار React على التحديث مبكرًا، مثل الوصول إلى DOM، يمكنك استخدام [`flushSync`.](/reference/react-dom/flushSync)

---

## الاستخدام {/*usage*/}

### إضافة reducer إلى مكوّن {/*adding-a-reducer-to-a-component*/}

استدعِ `useReducer` في أعلى مستوى مكوّنك لإدارة الحالة بـ [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

يعيد `useReducer` مصفوفة بعنصرين بالضبط:

1. <CodeStep step={1}>الحالة الحالية</CodeStep> لهذا المتغير، مضبوطة مبدئيًا إلى <CodeStep step={3}>الحالة الأولية</CodeStep> التي قدمتها.
2. <CodeStep step={2}>دالة `dispatch`</CodeStep> التي تغيّرها استجابة للتفاعل.

لتحديث ما على الشاشة، استدعِ <CodeStep step={2}>`dispatch`</CodeStep> بكائن يمثل ما فعله المستخدم، يُسمى *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

تمرّر React الحالة الحالية والـ action إلى <CodeStep step={4}>دالة reducer</CodeStep>. يحسب reducerك ويعيد الحالة التالية. تخزّن React تلك الحالة، ترسم مكوّنك بها، وتحدّث الواجهة.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` قريب جدًا من [`useState`](/reference/react/useState)، لكنه ينقل منطق تحديث الحالة من معالجات الأحداث إلى دالة واحدة خارج المكوّن. اقرأ المزيد عن [الاختيار بين `useState` و`useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### كتابة دالة الـ reducer {/*writing-the-reducer-function*/}

تُصرَّح عن دالة reducer هكذا:

```js
function reducer(state, action) {
  // ...
}
```

ثم تملأ الكود الذي يحسب ويعيد الحالة التالية. بالاصطلاح، يُكتب غالبًا كـ [`switch`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) لكل `case` في `switch`، احسب وأعد حالةً تالية.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

يمكن أن يكون للـ actions أي شكل. بالاصطلاح، شائع تمرير كائنات فيها خاصية `type` تميّز الـ action. ينبغي أن تتضمن أقل المعلومات اللازمة لحساب الحالة التالية.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

أسماء أنواع الـ action محلية لمكوّنك. [كل action يصف تفاعلًا واحدًا، حتى إذا أدى إلى تغييرات متعددة في البيانات.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) شكل الحالة اختياري، لكنه غالبًا كائن أو مصفوفة.

اقرأ [استخراج منطق الحالة إلى reducer](/learn/extracting-state-logic-into-a-reducer) للمزيد.

<Pitfall>

الحالة للقراءة فقط. لا تعدّل كائنات أو مصفوفات في الحالة:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

بدلًا من ذلك، أعد دائمًا كائنات جديدة من reducer:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

اقرأ [تحديث الكائنات في الحالة](/learn/updating-objects-in-state) و[تحديث المصفوفات في الحالة](/learn/updating-arrays-in-state) للمزيد.

</Pitfall>

<Recipes titleText="أمثلة أساسية لـ useReducer" titleId="examples-basic">

#### نموذج (كائن) {/*form-object*/}

في هذا المثال، يدير الـ reducer كائن حالة بحقلين: `name` و`age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### قائمة مهام (مصفوفة) {/*todo-list-array*/}

في هذا المثال، يدير الـ reducer مصفوفة مهام. يجب تحديث المصفوفة [دون تعديل مباشر.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

<Solution />

#### كتابة منطق تحديث موجز مع Immer {/*writing-concise-update-logic-with-immer*/}

إذا كان تحديث المصفوفات والكائنات دون تعديل مباشر مملًا، يمكنك استخدام مكتبة مثل [Immer](https://github.com/immerjs/use-immer#useimmerreducer) لتقليل التكرار. يتيح Immer كودًا موجزًا كأنك تعدّل الكائنات، لكنه ينفّذ تحديثات غير قابلة للتعديل تحت الغطاء:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

<Solution />

</Recipes>

---

### تجنب إعادة إنشاء الحالة الأولية {/*avoiding-recreating-the-initial-state*/}

تحفظ React الحالة الأولية مرة واحدة وتتجاهلها في الـ renders التالية.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

رغم أن نتيجة `createInitialState(username)` تُستخدم فقط للـ render الأول، فما زلت تستدعي الدالة في كل render. قد يكون ذلك مهدورًا إذا أنشأت مصفوفات كبيرة أو حسابات مكلفة.

لحل ذلك، **مرّرها كدالة _مهيئة_** كالوسيط الثالث لـ`useReducer`:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

لاحظ أنك تمرّر `createInitialState` أي *الدالة نفسها*، وليس `createInitialState()` أي نتيجة استدعائها. بهذا لا تُعاد إنشاء الحالة الأولية بعد التهيئة.

في المثال أعلاه، تأخذ `createInitialState` وسيطًا `username`. إذا لم يحتج مهيئك لمعلومات لحساب الحالة الأولية، يمكنك تمرير `null` كالوسيط الثاني لـ`useReducer`.

<Recipes titleText="الفرق بين تمرير مهيئ وتمرير الحالة الأولية مباشرة" titleId="examples-initializer">

#### تمرير دالة المهيئ {/*passing-the-initializer-function*/}

يمرّر هذا المثال دالة المهيئ، فيُنفَّذ `createInitialState` فقط أثناء التهيئة. لا يُنفَّذ عند إعادة رسم المكوّن، مثلًا عند الكتابة في الحقل.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### تمرير الحالة الأولية مباشرة {/*passing-the-initial-state-directly*/}

هذا المثال **لا** يمرّر دالة المهيئ، فيُنفَّذ `createInitialState` في كل render، مثلًا عند الكتابة في الحقل. لا فرق ملحوظ في السلوك، لكن الكود أقل كفاءة.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### أرسلت action لكن التسجيل يعطيني قيمة الحالة القديمة {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

استدعاء `dispatch` **لا يغيّر الحالة في الكود الجاري**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

ذلك لأن [الحالة تتصرّف كلمحة.](/learn/state-as-a-snapshot) تحديث الحالة يطلب renderًا آخر بالقيمة الجديدة، لكنه لا يؤثر على متغير `state` في JavaScript داخل معالج الحدث الذي يعمل بالفعل.

إذا احتجت تقدير الحالة التالية، احسبها يدويًا باستدعاء reducer بنفسك:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### أرسلت action لكن الشاشة لا تتحدّث {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

**تتجاهل React تحديثك** إذا كانت الحالة التالية مساوية للسابقة حسب [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). يحدث ذلك غالبًا عند تعديل كائن أو مصفوفة في الحالة مباشرة:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

عدّلت كائن `state` قائمًا وأعدته، فتجاهلت React التحديث. لإصلاح ذلك، تأكد دائمًا من [تحديث الكائنات في الحالة](/learn/updating-objects-in-state) و[تحديث المصفوفات في الحالة](/learn/updating-arrays-in-state) بدل تعديلها مباشرة:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### جزء من حالة reducer يصبح undefined بعد الإرسال {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

تأكد أن كل فرع `case` **ينسخ كل الحقول الموجودة** عند إرجاع الحالة الجديدة:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

بلا `...state` أعلاه، ستكون الحالة التالية المعادة تحتوي حقل `age` فقط دون غيره.

---

### حالة reducer كاملة تصبح undefined بعد الإرسال {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

إذا أصبحت حالتك `undefined` بغتة، فغالبًا نسيت `return state` في أحد الفروع، أو نوع الـ action لا يطابق أي `case`. لمعرفة السبب، ألقِ خطأ خارج `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

يمكنك أيضًا استخدام فاحص أنواع ثابت مثل TypeScript لالتقاط مثل هذه الأخطاء.

---

### أتلقى خطأ: «Too many re-renders» {/*im-getting-an-error-too-many-re-renders*/}

قد يظهر خطأ: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` غالبًا يعني أنك ترسل action *أثناء الرسم* بلا شرط، فيدخل المكوّن حلقة: رسم، إرسال (فيُسبب رسمًا)، رسم، إرسال، وهكذا. غالبًا السبب خطأ في تعريف معالج الحدث:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

إذا لم تجد سبب الخطأ، انقر السهم بجانب الخطأ في وحدة التحكم وافحص مكدس JavaScript للعثور على استدعاء `dispatch` المسبب.

---

### يعمل reducer أو المهيئ مرتين {/*my-reducer-or-initializer-function-runs-twice*/}

في [Strict Mode](/reference/react/StrictMode)، تستدعي React reducerك ومهيئك مرتين. لا ينبغي أن يكسر ذلك كودك.

هذا السلوك **للتطوير فقط** يساعدك على [إبقاء المكوّنات نقية.](/learn/keeping-components-pure) تستخدم React نتيجة أحد الاستدعاءين وتتجاهل نتيجة الآخر. طالما المكوّن والمهيئ والـ reducer نقيون، لا يؤثر ذلك على المنطق. لكن إذا كانوا شوائب بالخطأ، يساعدك ذلك على ملاحظة الأخطاء.

مثلًا، يعدّل reducer غير نقي مصفوفة في الحالة:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

بما أن React تستدعي reducerك مرتين، سترى المهمة أُضيفت مرتين، فتعرف أن هناك خطأ. في هذا المثال، أصلح الخطأ [باستبدال المصفوفة بدل تعديلها](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

الآن بعد أن أصبح reducer نقيًا، لا يغيّر استدعاؤه مرة إضافية السلوك. لذلك يساعدك استدعاء React له مرتين على إيجاد الأخطاء. **دوال المكوّن والمهيئ والـ reducer فقط ينبغي أن تكون نقية.** معالجات الأحداث لا تحتاج النقاء، ولن تستدعي React معالج حدثك مرتين.

اقرأ [إبقاء المكوّنات نقية](/learn/keeping-components-pure) للمزيد.

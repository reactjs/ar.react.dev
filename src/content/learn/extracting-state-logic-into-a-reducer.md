---
title: استخراج منطق الحالة إلى مخفّض (Reducer)
---

<Intro>

قد تصبح المكوّنات التي تحتوي على تحديثات حالة كثيرة موزّعة على معالجات أحداث عديدة صعبة الإدارة. في مثل هذه الحالات، يمكنك تجميع كل منطق تحديث الحالة خارج المكوّن في دالة واحدة تُسمى _مخفّضًا (reducer)._

</Intro>

<YouWillLearn>

- ما هي دالة المخفّض
- كيف تعيد هيكلة `useState` إلى `useReducer`
- متى تستخدم المخفّض
- كيف تكتب مخفّضًا جيدًا

</YouWillLearn>

## تجميع منطق الحالة بمخفّض {/*consolidate-state-logic-with-a-reducer*/}

مع ازدياد تعقيد المكوّنات، يصعب أحيانًا رؤية جميع الطرق التي تُحدَّث بها حالة المكوّن دفعة واحدة. على سبيل المثال، المكوّن `TaskApp` أدناه يحتفظ بمصفوفة `tasks` في الحالة ويستخدم ثلاثة معالجات أحداث مختلفة لإضافة المهام وحذفها وتعديلها:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

كل معالج أحداث يستدعي `setTasks` لتحديث الحالة. ومع نمو هذا المكوّن، يزداد منطق الحالة المنتشر فيه. لتقليل هذا التعقيد وجعل كل المنطق في مكان واحد سهل الوصول إليه، يمكنك نقل منطق الحالة إلى دالة واحدة خارج المكوّن، **تُسمى «مخفّضًا» (reducer).**

المخفّضات طريقة مختلفة للتعامل مع الحالة. يمكنك الانتقال من `useState` إلى `useReducer` في ثلاث خطوات:

1. **الانتقال** من تعيين الحالة إلى إرسال الإجراءات (dispatch).
2. **كتابة** دالة مخفّض.
3. **استخدام** المخفّض من المكوّن.

### الخطوة 1: من تعيين الحالة إلى إرسال الإجراءات {/*step-1-move-from-setting-state-to-dispatching-actions*/}

معالجات الأحداث لديك تحدد حاليًا _ماذا تفعل_ بتعيين الحالة:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

أزل كل منطق تعيين الحالة. يتبقى لديك ثلاثة معالجات أحداث:

- `handleAddTask(text)` تُستدعى عندما يضغط المستخدم «Add».
- `handleChangeTask(task)` تُستدعى عندما يبدّل المستخدم حالة مهمة أو يضغط «Save».
- `handleDeleteTask(taskId)` تُستدعى عندما يضغط المستخدم «Delete».

إدارة الحالة بالمخفّضات تختلف قليلًا عن تعيين الحالة مباشرة. بدل أن تخبر React «ماذا تفعل» بتعيين الحالة، تحدد «ماذا فعل المستخدم للتو» بإرسال «إجراءات» (actions) من معالجات الأحداث. (منطق تحديث الحالة سيكون في مكان آخر!) فبدل «تعيين `tasks`» عبر معالج حدث، ترسل إجراءًا يعني إضافة/تعديل/حذف مهمة. وهذا أوضح في وصف نية المستخدم.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

الكائن الذي تمرره إلى `dispatch` يُسمى «إجراءً» (action):

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

إنه كائن JavaScript عادي. أنت تقرر ماذا تضع فيه، لكنه عادة يجب أن يحتوي على أقل قدر من المعلومات عن _ما الذي حدث_. (ستضيف دالة `dispatch` نفسها في خطوة لاحقة.)

<Note>

يمكن أن يكون لكائن الإجراء أي شكل.

وفقًا للعرف، شائع إعطاؤه سلسلة `type` تصف ما حدث، وتمرير أي معلومات إضافية في حقول أخرى. الحقل `type` خاص بالمكوّن، لذا في هذا المثال يكفي `'added'` أو `'added_task'`. اختر اسمًا يصف ما حدث!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### الخطوة 2: كتابة دالة مخفّض {/*step-2-write-a-reducer-function*/}

دالة المخفّض هي حيث تضع منطق الحالة. تأخذ وسيطين: الحالة الحالية وكائن الإجراء، وتعيد الحالة التالية:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

ستضبط React الحالة على ما تعيده من المخفّض.

لنقل منطق تعيين الحالة من معالجات الأحداث إلى دالة مخفّض في هذا المثال:

1. صرّح بالحالة الحالية (`tasks`) كأول وسيط.
2. صرّح بكائن `action` كثاني وسيط.
3. أعد _الحالة التالية_ من المخفّض (التي ستضبط React الحالة عليها).

إليك كل منطق تعيين الحالة بعد نقله إلى دالة مخفّض:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

لأن دالة المخفّض تأخذ الحالة (`tasks`) كوسيط، يمكنك **إعلانها خارج المكوّن.** وهذا يقلل مستوى الإزاحة وقد يجعل القراءة أسهل.

<Note>

الكود أعلاه يستخدم if/else، لكن العرف استخدام [عبارات switch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) داخل المخفّضات. النتيجة نفسها، لكن قراءة switch قد تكون أسهل في لمحة.

سنستخدمها في بقية هذه الوثائق كالتالي:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

نوصي بلف كل كتلة `case` بين `{` و `}` حتى لا تتعارض المتغيرات المعلنة داخل `case` مختلفة. كذلك يجب أن ينتهي `case` عادة بـ `return`. إذا نسيت `return`، ينزل الكود «بالسقوط» إلى `case` التالي، وهذا قد يسبب أخطاء!

إذا لم تكن مرتاحًا بعد لعبارات switch، فاستخدام if/else مقبول تمامًا.

</Note>

<DeepDive>

#### لماذا سُميت المخفّضات بهذا الاسم؟ {/*why-are-reducers-called-this-way*/}

رغم أن المخفّضات قد «تخفّض» حجم الكود داخل المكوّن، فاسمها في الأصل مأخوذ من عملية [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) التي يمكن تنفيذها على المصفوفات.

تتيح لك عملية `reduce()` أخذ مصفوفة و«تراكم» قيمة واحدة من عناصر كثيرة:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

الدالة التي تمررها إلى `reduce` تُعرف باسم «مخفّض». تأخذ _النتيجة حتى الآن_ والعنصر _الحالي_، ثم تعيد _النتيجة التالية._ مخفّضات React مثال على الفكرة نفسها: تأخذ _الحالة حتى الآن_ والإجراء، وتعيد _الحالة التالية._ بهذه الطريقة تتراكم الإجراءات مع الزمن في الحالة.

يمكنك حتى استخدام `reduce()` مع `initialState` ومصفوفة من `actions` لحساب الحالة النهائية بتمرير دالة المخفّض إليها:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

لن تحتاج غالبًا لفعل هذا بنفسك، لكنه قريب مما تفعله React!

</DeepDive>

### الخطوة 3: استخدام المخفّض من المكوّن {/*step-3-use-the-reducer-from-your-component*/}

أخيرًا، اربط `tasksReducer` بالمكوّن. استورد خطاف `useReducer` من React:

```js
import { useReducer } from 'react';
```

ثم يمكنك استبدال `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

بـ `useReducer` كالتالي:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

خطاف `useReducer` يشبه `useState`—يجب تمرير حالة ابتدائية إليه ويعيد قيمة ذات حالة وطريقة لتعيين الحالة (هنا دالة الإرسال dispatch). لكنه يختلف قليلًا.

خطاف `useReducer` يأخذ وسيطين:

1. دالة مخفّض
2. حالة ابتدائية

ويعيد:

1. قيمة ذات حالة
2. دالة إرسال (لـ «إرسال» إجراءات المستخدم إلى المخفّض)

الآن كل شيء موصول! هنا، المخفّض معلن في أسفل ملف المكوّن:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

إذا شئت، يمكنك نقل المخفّض إلى ملف آخر:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

منطق المكوّن يصبح أسهل قراءة عند فصل الاهتمامات هكذا. معالجات الأحداث تحدد الآن _ما الذي حدث_ فقط بإرسال الإجراءات، ودالة المخفّض تحدد _كيف تتحدث الحالة_ استجابة لها.

## مقارنة `useState` و`useReducer` {/*comparing-usestate-and-usereducer*/}

للمخفّضات عيوب أيضًا! إليك بعض وجوه المقارنة:

- **حجم الكود:** غالبًا مع `useState` تكتب كودًا أقل في البداية. مع `useReducer` تكتب دالة مخفّض _و_ إرسال إجراءات. لكن `useReducer` قد يقلل الكود إذا عدّلت معالجات أحداث كثيرة الحالة بطريقة متشابهة.
- **القابلية للقراءة:** `useState` سهل القراءة عندما تكون تحديثات الحالة بسيطة. عند التعقيد قد ينتفخ كود المكوّن ويصعب مسحه. هنا يسمح `useReducer` بفصل نظيف بين _كيفية_ منطق التحديث و_ما حدث_ في معالجات الأحداث.
- **التصحيح:** عند وجود خطأ مع `useState` قد يصعب معرفة _أين_ ضُبطت الحالة خطأ و_لماذا_. مع `useReducer` يمكنك إضافة `console.log` في المخفّض لرؤية كل تحديث للحالة و_سببه_ (أي `action`). إذا كان كل `action` صحيحًا، فالخطأ في منطق المخفّض نفسه. لكنك تتنقل في كود أكثر من `useState`.
- **الاختبار:** المخفّض دالة نقية لا تعتمد على المكوّن، فيمكن تصديرها واختبارها منفصلة. رغم أن اختبار المكوّنات في بيئة واقعية أفضل غالبًا، فلمنطق تحديث حالة معقّد يفيد التأكد أن المخفّض يعيد حالة معيّنة لحالة ابتدائية وإجراء معيّنين.
- **الذوق الشخصي:** من يحب المخفّضات ومن لا. وهذا مقبول. يمكنك التحويل بين `useState` و`useReducer` في الاتجاهين: هما متكافئان!

نوصي باستخدام مخفّض إذا واجهت كثيرًا أخطاء من تحديثات حالة خاطئة في مكوّن وتريد هيكلة أكبر لكوده. لا يلزم استخدام المخفّضات لكل شيء: امزج كما تشاء. يمكنك حتى استخدام `useState` و`useReducer` في نفس المكوّن.

## كتابة مخفّضات جيدة {/*writing-reducers-well*/}

احفظ نصيحتين عند كتابة المخفّضات:

- **يجب أن تكون المخفّضات نقية.** كما في [دوال تحديث الحالة](/learn/queueing-a-series-of-state-updates)، تُنفَّذ المخفّضات أثناء العرض! (تُصفّ الإجراءات حتى العرض التالي.) أي أن المخفّضات [يجب أن تكون نقية](/learn/keeping-components-pure)—نفس المدخلات تعطي دائمًا نفس المخرجات. لا ترسل طلبات ولا تجدول مؤقتات ولا تنفّذ آثارًا جانبية (عمليات تؤثر خارج المكوّن). حدّث [الكائنات](/learn/updating-objects-in-state) و[المصفوفات](/learn/updating-arrays-in-state) دون تعديل مباشر (mutation).
- **كل إجراء يصف تفاعل مستخدم واحدًا، حتى لو أدى إلى تغييرات متعددة في البيانات.** مثلاً إذا ضغط المستخدم «Reset» في نموذج بخمس حقول تديرها مخفّض، من المنطقي إرسال إجراء `reset_form` واحد بدل خمسة `set_field`. إذا سجّلت كل إجراء في المخفّض، يجب أن يكون السجل واضحًا لإعادة بناء التفاعلات أو الاستجابات بالترتيب. هذا يساعد في التصحيح!

## مخفّضات موجزة باستخدام Immer {/*writing-concise-reducers-with-immer*/}

كما في [تحديث الكائنات](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) و[المصفوفات](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) في الحالة العادية، يمكنك استخدام مكتبة Immer لجعل المخفّضات أقصر. هنا [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) يسمح بتعديل الحالة بـ `push` أو تعيين `arr[i] =`:

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
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

يجب أن تكون المخفّضات نقية، فلا تعدّل الحالة مباشرة. لكن Immer يعطيك كائن `draft` خاصًا آمِنًا للتعديل. في الخلفية، ينشئ Immer نسخة من حالتك مع التغييرات على `draft`. لذلك يمكن لمخفّضات `useImmerReducer` تعديل وسيطها الأول دون الحاجة لإرجاع الحالة.

<Recap>

- للتحويل من `useState` إلى `useReducer`:
  1. أرسل الإجراءات من معالجات الأحداث.
  2. اكتب دالة مخفّض تعيد الحالة التالية لحالة وإجراء معيّنين.
  3. استبدل `useState` بـ `useReducer`.
- المخفّضات تتطلب كودًا أكثر قليلًا، لكنها تساعد في التصحيح والاختبار.
- يجب أن تكون المخفّضات نقية.
- كل إجراء يصف تفاعل مستخدم واحدًا.
- استخدم Immer إذا أردت كتابة مخفّضات بأسلوب تعديل مباشر.

</Recap>

<Challenges>

#### إرسال الإجراءات من معالجات الأحداث {/*dispatch-actions-from-event-handlers*/}

حاليًا، معالجات الأحداث في `ContactList.js` و`Chat.js` تحتوي على تعليقات `// TODO`. لذلك لا تعمل الكتابة في حقل الإدخال، ولا يغيّر النقر على الأزرار المستلم المختار.

استبدل هذين `// TODO` بالكود الذي يستدعي `dispatch` للإجراءات المناسبة. لمعرفة شكل الإجراء ونوعه، راجع المخفّض في `messengerReducer.js`. المخفّض مكتوب مسبقًا فلا تحتاج لتغييره. عليك فقط إرسال الإجراءات من `ContactList.js` و`Chat.js`.

<Hint>

دالة `dispatch` متوفرة في المكوّنين لأنها مُمرَّرة كخاصية. استدعِ `dispatch` بكائن الإجراء المناسب.

لمعرفة شكل كائن الإجراء، انظر المخفّض وما يتوقعه من حقول `action`. مثلاً حالة `changed_selection` في المخفّض تبدو هكذا:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

يعني أن كائن الإجراء يجب أن يحتوي `type: 'changed_selection'`. ويُستخدم `action.contactId`، فأضف خاصية `contactId` إلى إجرائك.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

<Solution>

من كود المخفّض يمكنك استنتاج أن الإجراءات يجب أن تبدو هكذا:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

إليك المثال بعد تحديثه لإرسال الإجراءات المناسبة:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

</Solution>

#### مسح الحقل عند إرسال الرسالة {/*clear-the-input-on-sending-a-message*/}

حاليًا، الضغط على «Send» لا يفعل شيئًا. أضف معالج حدث لزر «Send» يقوم بـ:

1. عرض `alert` يتضمن بريد المستلم والرسالة.
2. مسح حقل الرسالة.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

<Solution>

هناك أكثر من طريقة في معالج زر «Send». إحدى الطرق: عرض تنبيه ثم إرسال إجراء `edited_message` برسالة فارغة `message`:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

هذا يعمل ويمسح الحقل عند الضغط على «Send».

لكن _من منظور المستخدم_، إرسال الرسالة فعل مختلف عن تعديل الحقل. ليعكس ذلك، يمكنك إنشاء إجراء _جديد_ اسمه `sent_message` ومعالجته منفصلًا في المخفّض:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

السلوك الناتج نفسه. لكن تذكر أن أنواع الإجراءات يفضل أن تصف «ما فعله المستخدم» لا «كيف تريد أن تتغير الحالة». هذا يسهل إضافة ميزات لاحقًا.

في أي من الحلين، من المهم **ألا** تضع `alert` داخل المخفّض. يجب أن يكون المخفّض دالة نقية—يحسب الحالة التالية فقط. لا يجب أن «يفعل» شيئًا، بما في ذلك عرض رسائل للمستخدم. ذلك في معالج الأحداث. (لمساعدتك على اكتشاف الأخطاء، React تستدعي مخفّضاتك عدة مرات في الوضع الصارم Strict Mode. لذلك إذا وضعت alert في المخفّض، يظهر مرتين.)

</Solution>

#### استعادة قيم الحقول عند التبديل بين التبويبات {/*restore-input-values-when-switching-between-tabs*/}

في هذا المثال، التبديل بين مستلمين مختلفين يمسح حقل النص دائمًا:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

لأنك لا تريد مشاركة مسودة رسالة واحدة بين عدة مستلمين. لكن الأفضل أن «يتذكر» التطبيق مسودة لكل جهة اتصال على حدة ويستعيدها عند التبديل.

مهمتك هي تغيير هيكلة الحالة لتتذكر مسودة رسالة منفصلة _لكل جهة اتصال_. ستحتاج لتعديلات على المخفّض والحالة الابتدائية والمكوّنات.

<Hint>

يمكنك هيكلة الحالة هكذا:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

صيغة الخاصية المحسوبة `[key]: value` ([computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)) تساعدك على تحديث كائن `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

<Solution>

ستحدّث المخفّض لتخزين وتحديث مسودة رسالة منفصلة لكل جهة اتصال:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

ستحدّث أيضًا مكوّن `Messenger` لقراءة الرسالة لجهة الاتصال المختارة حاليًا:

```js
const message = state.messages[state.selectedId];
```

إليك الحل الكامل:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

لاحظ أنك لم تحتج لتغيير أي معالج أحداث لتحقيق هذا السلوك المختلف. بدون مخفّض، لكنت ستضطر إلى تعديل كل معالج يحدّث الحالة.

</Solution>

#### تنفيذ `useReducer` من الصفر {/*implement-usereducer-from-scratch*/}

في الأمثلة السابقة، استوردت خطاف `useReducer` من React. هذه المرة، ستنفّذ _خطاف `useReducer` نفسه!_ إليك هيكل أولي للبدء. لا ينبغي أن يتجاوز الأمر عشرة أسطر.

لاختبار التغييرات، جرّب الكتابة في الحقل أو اختيار جهة اتصال.

<Hint>

إليك مخطط أوضح للتنفيذ:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

تذكر أن دالة المخفّض تأخذ وسيطين—الحالة الحالية وكائن الإجراء—وتعيد الحالة التالية. ماذا يفترض أن تفعل تنفيذات `dispatch` بذلك؟

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

<Solution>

إرسال إجراء يستدعي المخفّض بالحالة الحالية والإجراء، ويخزن النتيجة كالحالة التالية. في الكود يبدو هكذا:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

رغم أنه لا يهم في أغلب الحالات، فتنفيذ أدق قليلًا يبدو هكذا:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

لأن الإجراءات المُرسَلة تُصفّ حتى العرض التالي، [مثل دوال التحديث.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>

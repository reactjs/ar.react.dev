---
title: دالة useContext
---

<Intro>

`useContext` هو Hook في React يتيح لك قراءة [السياق](/learn/passing-data-deeply-with-context) والاشتراك فيه من مكوّنك.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

استدعِ `useContext` في أعلى مستوى مكوّنك لقراءة [السياق](/learn/passing-data-deeply-with-context) والاشتراك فيه.

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `SomeContext`: السياق الذي أنشأته سابقًا باستخدام [`createContext`](/reference/react/createContext). السياق نفسه لا يحتفظ بالمعلومات، بل يمثل فقط نوع المعلومات التي يمكنك تمريرها أو قراءتها من المكوّنات.

#### القيمة المعادة {/*returns*/}

تُرجِع `useContext` قيمة السياق للمكوّن الذي يستدعيها. تُحدَّد كالقيمة `value` الممرَّرة إلى أقرب `SomeContext` فوق المكوّن المستدعي في الشجرة. إذا لم يوجد مزوّد كهذا، فستكون القيمة المُرجَعة هي `defaultValue` التي مررتها إلى [`createContext`](/reference/react/createContext) لذلك السياق. القيمة المُرجَعة دائمًا محدَّثة. يعيد React رسم المكوّنات التي تقرأ سياقًا معينًا تلقائيًا إذا تغيّرت قيمته.

#### ملاحظات مهمة {/*caveats*/}

* استدعاء `useContext()` داخل مكوّن لا يتأثر بالمزوّدين المُرجَعين من *نفس* المكوّن. يجب أن يكون `<Context>` المقابل **فوق** المكوّن الذي يستدعي `useContext()`.
* يعيد React **رسم جميع الأبناء** الذين يستخدمون سياقًا معينًا تلقائيًا بدءًا من المزوّد الذي تلقّى `value` مختلفة. تُقارَن القيمة السابقة والتالية باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). إن تخطّي إعادة الرسم باستخدام [`memo`](/reference/react/memo) لا يمنع الأبناء من تلقّي قيم سياق جديدة.
* إذا كان نظام البناء لديك ينتج وحدات مكرّرة في المخرجات (وهذا قد يحدث مع الروابط الرمزية)، فقد ينكسر السياق. لا يعمل تمرير شيء عبر السياق إلا إذا كان `SomeContext` الذي تستخدمه للتوفير و`SomeContext` الذي تستخدمه للقراءة **نفس الكائن تمامًا**، وفق مقارنة `===`.

---

## الاستخدام {/*usage*/}


### تمرير البيانات عميقًا في الشجرة {/*passing-data-deeply-into-the-tree*/}

استدعِ `useContext` في أعلى مستوى مكوّنك لقراءة [السياق](/learn/passing-data-deeply-with-context) والاشتراك فيه.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

تُرجِع `useContext` <CodeStep step={2}>قيمة السياق</CodeStep> للـ <CodeStep step={1}>سياق</CodeStep> الذي مررته. لتحديد قيمة السياق، يبحث React في شجرة المكوّنات ويجد **أقرب مزوّد سياق فوق** ذلك السياق بالتحديد.

لتمرير السياق إلى `Button`، لفّه أو أحد مكوّناته الأب في مزوّد السياق المناسب:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

لا يهم عدد طبقات المكوّنات بين المزوّد و`Button`. عندما يستدعي `Button` في *أي* مكان داخل `Form` الدالة `useContext(ThemeContext)`، سيستلم `"dark"` كقيمة.

<Pitfall>

`useContext()` تبحث دائمًا عن أقرب مزوّد *فوق* المكوّن الذي يستدعيها. تبحث للأعلى و**لا** تأخذ في الاعتبار المزوّدين داخل المكوّن الذي تستدعي منه `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### تحديث البيانات الممرَّرة عبر السياق {/*updating-data-passed-via-context*/}

غالبًا تريد أن يتغيّر السياق مع الزمن. لتحديث السياق، اجمعه مع [الحالة](/reference/react/useState). عرّف متغيّر حالة في المكوّن الأب، ومرّر الحالة الحالية كـ <CodeStep step={2}>قيمة سياق</CodeStep> إلى المزوّد.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

الآن أي `Button` داخل المزوّد سيستلم قيمة `theme` الحالية. إذا استدعيت `setTheme` لتحديث قيمة `theme` التي تمرّرها إلى المزوّد، ستُعاد رسم جميع مكوّنات `Button` بالقيمة الجديدة `'light'`.

<Recipes titleText="أمثلة على تحديث السياق" titleId="examples-basic">

#### تحديث قيمة عبر السياق {/*updating-a-value-via-context*/}

في هذا المثال، يحتفظ مكوّن `MyApp` بمتغيّر حالة يُمرَّر بعد ذلك إلى مزوّد `ThemeContext`. تفعيل خانة "الوضع الداكن" يحدّث الحالة. تغيير القيمة الموفَّرة يعيد رسم جميع المكوّنات التي تستخدم ذلك السياق.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

لاحظ أن `value="dark"` يمرّر السلسلة `"dark"`، بينما `value={theme}` يمرّر قيمة متغيّر JavaScript `theme` باستخدام [أقواس JSX المعقوفة.](/learn/javascript-in-jsx-with-curly-braces) تسمح الأقواس المعقوفة أيضًا بتمرير قيم سياق ليست سلاسل نصية.

<Solution />

#### تحديث كائن عبر السياق {/*updating-an-object-via-context*/}

في هذا المثال، يوجد متغيّر حالة `currentUser` يحمل كائنًا. تجمع `{ currentUser, setCurrentUser }` في كائن واحد وتمرّره عبر السياق داخل `value={}`. يتيح ذلك لأي مكوّن أسفل الشجرة، مثل `LoginButton`، قراءة `currentUser` و`setCurrentUser` معًا، ثم استدعاء `setCurrentUser` عند الحاجة.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### سياقات متعددة {/*multiple-contexts*/}

في هذا المثال، يوجد سياقان مستقلان. يوفّر `ThemeContext` السمة الحالية وهي سلسلة نصية، بينما يحتفظ `CurrentUserContext` بالكائن الذي يمثّل المستخدم الحالي.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### استخراج المزوّدين إلى مكوّن {/*extracting-providers-to-a-component*/}

مع نمو تطبيقك، من المتوقع أن يتكوّن «هرم» من السياقات قرب جذر التطبيق. لا بأس بذلك. إن لم يعجبك التداخل من الناحية الجمالية، يمكنك استخراج المزوّدين إلى مكوّن واحد. في هذا المثال، يخفي `MyProviders` «الأنابيب» ويعرض الأبناء الممرَّرين إليه داخل المزوّدين اللازمين. لاحظ أن حالة `theme` و`setTheme` ما زالت مطلوبة في `MyApp` نفسه، لذا يظل `MyApp` يملك ذلك الجزء من الحالة.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### التوسّع باستخدام السياق وموجّه الحالة (reducer) {/*scaling-up-with-context-and-a-reducer*/}

في التطبيقات الأكبر، شائع الجمع بين السياق و[المُوجّه](/reference/react/useReducer) لاستخراج منطق حالة معيّنة خارج المكوّنات. في هذا المثال، يُخفى كل «التوصيل» في `TasksContext.js`، الذي يحتوي على مُوجّه وسياقين منفصلين.

اقرأ [شرحًا كاملًا](/learn/scaling-up-with-reducer-and-context) لهذا المثال.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### تحديد قيمة افتراضية احتياطية {/*specifying-a-fallback-default-value*/}

إذا لم يجد React أي مزوّد لذلك الـ <CodeStep step={1}>سياق</CodeStep> بالتحديد في الشجرة الأب، فستكون قيمة السياق التي تُرجِعها `useContext()` مساوية لـ <CodeStep step={3}>القيمة الافتراضية</CodeStep> التي حددتها عند [إنشاء ذلك السياق](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

القيمة الافتراضية **لا تتغيّر أبدًا**. إذا أردت تحديث السياق، استخدمه مع الحالة كما [وُضّح أعلاه.](#updating-data-passed-via-context)

غالبًا بدلًا من `null`، توجد قيمة أكثر معنى يمكن استخدامها كافتراضي، مثل:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

بهذه الطريقة، إذا رسمت مكوّنًا دون مزوّد مطابق بالخطأ، لن ينكسر التطبيق. يساعد ذلك أيضًا مكوّناتك على العمل جيدًا في بيئة اختبار دون إعداد الكثير من المزوّدين في الاختبارات.

في المثال أدناه، زر «تبديل السمة» يبقى فاتحًا دائمًا لأنه **خارج أي مزوّد سياق سمة**، وقيمة السياق الافتراضية للسمة هي `'light'`. جرّب تعديل السمة الافتراضية لتكون `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### تجاوز السياق لجزء من الشجرة {/*overriding-context-for-a-part-of-the-tree*/}

يمكنك تجاوز السياق لجزء من الشجرة بلفّ ذلك الجزء في مزوّد بقيمة مختلفة.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

يمكنك تداخل المزوّدين وتجاوزهم بقدر ما تحتاج.

<Recipes titleText="أمثلة على تجاوز السياق">

#### تجاوز السمة {/*overriding-a-theme*/}

هنا، الزر *داخل* `Footer` يستلم قيمة سياق مختلفة (`"light"`) عن الأزرار خارجها (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### عناوين متداخلة تلقائيًا {/*automatically-nested-headings*/}

يمكنك «تراكم» المعلومات عند تداخل مزوّدي السياق. في هذا المثال، يتتبّع مكوّن `Section` الـ `LevelContext` الذي يحدّد عمق تداخل الأقسام. يقرأ `LevelContext` من القسم الأب، ويوفّر لأبنائه رقم `LevelContext` مزيدًا بواحد. نتيجة لذلك، يمكن لمكوّن `Heading` أن يقرر تلقائيًا أي وسم من `<h1>`، `<h2>`، `<h3>`، … يستخدم بناءً على عدد مكوّنات `Section` التي يتداخل داخلها.

اقرأ [شرحًا تفصيليًا](/learn/passing-data-deeply-with-context) لهذا المثال.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### تحسين إعادة الرسم عند تمرير كائنات ودوال {/*optimizing-re-renders-when-passing-objects-and-functions*/}

يمكنك تمرير أي قيم عبر السياق، بما في ذلك الكائنات والدوال.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

هنا، <CodeStep step={2}>قيمة السياق</CodeStep> هي كائن JavaScript فيه خاصيتان، إحداهما دالة. في كل مرة يعيد فيها `MyApp` الرسم (مثلًا عند تحديث المسار)، يكون ذلك *كائنًا مختلفًا* يشير إلى *دالة مختلفة*، فيتعين على React أيضًا إعادة رسم كل المكوّنات العميقة في الشجرة التي تستدعي `useContext(AuthContext)`.

في التطبيقات الأصغر لا يمثل ذلك مشكلة. لكن لا داعي لإعادة رسمها إذا لم تتغيّر البيانات الأساسية مثل `currentUser`. لمساعدة React على الاستفادة من ذلك، لفّ دالة `login` بـ [`useCallback`](/reference/react/useCallback) ولفّ إنشاء الكائن بـ [`useMemo`](/reference/react/useMemo). هذا تحسين للأداء:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

نتيجة لهذا التغيير، حتى إذا احتاج `MyApp` إلى إعادة الرسم، فلن تحتاج المكوّنات التي تستدعي `useContext(AuthContext)` إلى إعادة الرسم ما لم يتغيّر `currentUser`.

اطلع على المزيد حول [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) و[`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## استكشاف الأخطاء {/*troubleshooting*/}

### لا يرى مكوّني القيمة من المزوّد {/*my-component-doesnt-see-the-value-from-my-provider*/}

هناك عدة أسباب شائعة:

1. تعرض `<SomeContext>` في نفس المكوّن (أو أسفله) حيث تستدعي `useContext()`. انقل `<SomeContext>` *فوق وخارج* المكوّن الذي يستدعي `useContext()`.
2. ربما نسيت لفّ مكوّنك بـ `<SomeContext>`، أو وضعته في موضع مختلف في الشجرة عما ظننت. تحقق من صحة التسلسل الهرمي باستخدام [أدوات مطوّري React.](/learn/react-developer-tools)
3. قد تواجه مشكلة بناء في أدواتك تجعل `SomeContext` كما يُرى من مكوّن التوفير و`SomeContext` كما يُرى من مكوّن القراءة كائنين مختلفين. قد يحدث ذلك مثلًا عند استخدام الروابط الرمزية. يمكنك التحقق بتعيينهما إلى عموميات مثل `window.SomeContext1` و`window.SomeContext2` ثم التحقق في وحدة التحكم من `window.SomeContext1 === window.SomeContext2`. إن لم يكونا متطابقين، أصلح المشكلة على مستوى أداة البناء.

### أستلم دائمًا `undefined` من السياق رغم أن القيمة الافتراضية مختلفة {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

قد يكون لديك مزوّد بلا خاصية `value` في الشجرة:

```js {1,2}
// 🚩 لا يعمل: لا توجد خاصية value
<ThemeContext>
   <Button />
</ThemeContext>
```

إذا نسيت تحديد `value`، فالأمر كتمرير `value={undefined}`.

قد تكون استخدمت خطأً اسم خاصية مختلفًا:

```js {1,2}
// 🚩 لا يعمل: يجب أن تُسمّى الخاصية "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

في الحالتين يجب أن ترى تحذيرًا من React في وحدة التحكم. لإصلاحهما، سمّ الخاصية `value`:

```js {1,2}
// ✅ تمرير خاصية value
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

لاحظ أن [القيمة الافتراضية من استدعاء `createContext(defaultValue)`](#specifying-a-fallback-default-value) تُستخدم فقط **إذا لم يوجد أي مزوّد مطابق في الأعلى على الإطلاق.** إذا وُجد مكوّن `<SomeContext value={undefined}>` في مكان ما في شجرة الآباء، فسيستلم المكوّن الذي يستدعي `useContext(SomeContext)` قيمة `undefined` كقيمة السياق.

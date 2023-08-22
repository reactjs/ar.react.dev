---
title: التحكم في الحالة
---

<Intro>

  مع نمو تطبيقك، من المفيد كونك أكثر حرصا بشأن أن تكون حالتك منظمة وأن تكون البيانات متدفقة خلال مكوناتك. تكرار أو نسخ الحالة هو مصدر شائع للأخطاء. في هذا الفصل، سوف تتعلم كيفية هيكلة حالتك جيدا، كيفية الحفاظ على منطق تحديث حالتك مصانا، وكيفية مشاركة الحالة بين المكونات المتباعدة.

</Intro>

<YouWillLearn isChapter={true}>

* [كيفية التفكير في تغييرات واجهة المستخدم (UI) كتغيرات في الحالة](/learn/reacting-to-input-with-state)
* [كيفية هيكلة الحالة جيدا](/learn/choosing-the-state-structure)
* [كيفية "رفع الحالة لمستوى أعلى (lifting state up)" لمشاكارتها بين المكونات](/learn/sharing-state-between-components)
* [كيفية التحكم في ما إذا تم حفظ الحالة أم إعادة تعيينها](/learn/preserving-and-resetting-state)
* [كيفية تجميع منطق حالة معقد داخل دالة](/learn/extracting-state-logic-into-a-reducer)
* [كيفية تمرير معلومات بدون "تسرب الخصائص (Props drilling)"](/learn/passing-data-deeply-with-context)
* [كيفية توسيع إدارة الحالة مع نمو تطبيقك](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## الاستجابة للمدخلات باستخدام الحالة {/*reacting-to-input-with-state*/}

باستخدام React، لن تستطيع تعديل واجهة المستخدم (UI) عن طريق الكود مباشرة. على سبيل المثال، لن تكتب أوامر مثل "عطل الزر"، "فعل الزر"، "أظهر رسالة النجاح"، إلخ. بدلا عن ذلك، سوف تصف واجهة المستخدم التي تريد أن تراها للحالات المرئية من مكوناتك ("حالة ابتدائية (initial state)"، "حالة كتابية (typing state)"، "حالة ناجحة (success state)")، ومن بعدها تنشيط تغيرات الحالة بناء على مدخل المستخدم. هذا مشابه لتصور المصممين عن واجهة المستخدم.

هنا نموذج اختبار صمم باستخدام React. لاحظ كيف يستخدم متغير الحالة `status` لكي يحدد ما إذا سيفعل أم سيعطل زر الإرسال، وما إذا ستظهر رسالة نجاح بدلا عن ذلك.


<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>هذا صحيح!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>اختبار المدينة</h2>
      <p>
        في أي مدينة يوجد لوحة إعلانية تقوم بتحويل الهواء إلى مياه صالحة للشرب؟
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          أرسل
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // محاكاة للتواصل باستخدام الشبكة
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima' 
      if (shouldError) {
        reject(new Error('توقع جيد ولكن إجابة خاطئة. حاول مرة أخرى!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
body { direction: rtl; }
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

اقرأ **[الاستجابة للمدخلات باستخدام الحالة](/learn/reacting-to-input-with-state)** لكي تتعلم كيفية التعامل مع التفاعلات بعقلية موجّهة بناء على الحالة.  

</LearnMore>

## اختيار هيكل الحالة {/*choosing-the-state-structure*/}

هيكلة الحالة جيدا يمكن أن يصنع فارقا بين مكوّن قابل للإصلاح والتصحيح، وآخر يمثل مصدرا ثابتا للأخطاء. القاعدة الأكثر أهمية هي أنه لا يجب للحالة أن تحتوي على بيانات مكررة أو منسوخة. لو وجدت حالة غير ضرورية، فمن السهل نسيان تحديثها، وحدوث الأخطاء.

على سبيل المثال، هذا نموذج يتضمن متغير الحالة `fullName` **مكرر**:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>دعنا نقم بتسجيلك</h2>
      <label>
        الاسم الأول:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        اسم العائلة:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        تذكرتك سوف تسلم لـ: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
body { direction: rtl; }
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

يمكنك حذفه وتبسيط الكود عن طريق جمع `fullName` بينما يُصيّر المكوّن:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>دعنا نقم بتسجيلك</h2>
      <label>
        الاسم الأول:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        اسم العائلة:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        تذكرتك سوف تسلم لـ: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
body { direction: rtl; }
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

هذا قد يبدو كتغير بسيط، ولكن كثير من الأخطاء في تطبيقات React يتم إصلاحها بهذه الطريقة. 

<LearnMore path="/learn/choosing-the-state-structure">

اقرأ **[اختيار هيكل الحالة](/learn/choosing-the-state-structure)** لتتعلم كيفية تصميم بنية الحالة لتجنب الأخطاء.

</LearnMore>

## مشاركة الحالة بين المكونات {/*sharing-state-between-components*/}

أحيانا، تريد حالة مكونين أن تتغير دائما مع بعضها البعض. لعمل ذلك، احذف الحالة من كليهما، وانقلها لأقرب مكون أب مشترك، وبعد ذلك مررها لأسفل باستخدام الخصائص (props). هذا ما يعرف بـ "رفع الحالة لمستوى أعلى (lifting state up)"، وهو واحد من أكثر الأشياء شيوعا التي ستستعملها أثناء كتابتك لكود React.

في هذا المثال، في كل مرة يجب أن تكون قائمة واحدة فقط نشطة. لتحقيق ذلك، بدلا من حفظ الحالة النشطة داخل كل قائمة بمفردها، المكونّ الأب يحمل الحالة ويحدد الخصائص لمكوناته الأبناء. 

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="نبذة"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        مع تعداد سكاني يقارب 2 مليون، Almaty هي أكبر مدينة بـ Kazakhstan. منذ 1929 إلى 1997 كانت هي العاصمة.
      </Panel>
      <Panel
        title="أصل الكلمة"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        الاسم مأخوذ من <span lang="kk-KZ">алма</span>، الكلمة الكازاخستانية التي تعني "تفاحة" وغالبا تترجم على أنها "مليئة بالتفاح". في الحقيقة، المنطقة المحيطة بـ Almaty تعتبر الموطن الأصلي للتفاح، والنوع البريّ <i lang="la">Malus sieversii</i> يعتبر أقرب مرشح لكونه أصل للتفاح المحلي الحديث.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          أظهر
        </button>
      )}
    </section>
  );
}
```

```css
body { direction: rtl; }
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

اقرأ **[مشاركة الحالة بين المكونات](/learn/sharing-state-between-components)** لتتعلم كيفية رفع الحالة لمستوى أعلى والحفاظ على المكونّات منسجمة.

</LearnMore>

## حفظ وإعادة تعيين الحالة {/*preserving-and-resetting-state*/}

عندما تعيد تصيير مكون، React تحتاج لتقرر أىّ أجزاء شجرة المكونات تحفظها (وتحدثها)، وأيّ أجزاءها تلغيها أو تعيد إنشاءها من الصفر. في أغلب الحالات، التصرف التلقائي لـ React يعمل بشكل جيد كفاية. تحفظ React تلقائيًا أجزاء الشجرة التي "تتوافق" مع مكون الشجرة المصيّر مسبقا. 

على كل حال، أحيانا هذا ما لا تريده أنت. في تطبيق المحادثة هذا، كتابة رسالة وتغيير الطرف المستقبل لا يعيد تعيين المدخل. هذا قد يجعل المستخدم يرسل رسالة بغير قصد للشخص الخطأ.

<Sandpack>

```js App.js
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
  { name: 'علي', email: 'ali12@mail.com' },
  { name: 'هند', email: 'hend@mail.com' },
  { name: 'سعد', email: 'sa2d@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
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

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'تحدث مع ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>أرسل لـ {contact.email}</button>
    </section>
  );
}
```

```css
body { direction: rtl; }
.chat, .contact-list {
  float: right;
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

تعطيك React القدرة على تجاوز السلوك الافتراضي، و*إجبار* المكون إعادة تعيين حالته عن طريق تمرير `key` مختلف لها، مثل `<Chat key={email} />`. هذا يخبر React أن الطرف المستقبل مختلف، ومن الواجب تعيين مكون `Chat` *مختلف* يكون بحاجة إلى إعادة الإنشاء من الصفر ببايانات جديدة (وواجهة مستخدم مطابقة للمدخلات). الآن الانتقال بين المستقبلين يعيد تعيين حقل الإدخال -- حتى بالرغم من أنك تعيد تصيير نفس المكون.

<Sandpack>

```js App.js
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
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'علي', email: 'ali12@mail.com' },
  { name: 'هند', email: 'hend@mail.com' },
  { name: 'سعد', email: 'sa2d@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
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

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'تحدث مع ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>أرسل لـ {contact.email}</button>
    </section>
  );
}
```

```css
body { direction: rtl; }
.chat, .contact-list {
  float: right;
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

<LearnMore path="/learn/preserving-and-resetting-state">

اقرأ **[حفظ وإعادة تعيين الحالة](/learn/preserving-and-resetting-state)** لتتعلم عن الحياة الزمنية للحالة وكيفية التحكم بها.

</LearnMore>

## استخلاص منطق الحالة إلى مخفض (reducer) {/*extracting-state-logic-into-a-reducer*/}

المكونات ذات تحديثات حالة كثيرة المنتشرة خلال كثير من معالجات الأحداث (event handlers) قد تصبح معقدة. لمثل هذه الأحوال، يمكنك تجميع جميع منطق تحديث الحالة خارج مكوّنك داخل دالة واحدة، تدعى "مخفض (reducer)". معالجات الأحداث خاصتك ستصبح موجزة لأنها تحدد "إجراءات (actions)" المستخدم فقط. في أسفل الملف، دالة المخفض تحدد كيف يجب أن تحدث الحالة استجابةً لكل إجراء!

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>مخطط رحلة Prague</h1>
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

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];ِ
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'زيارة متحف Kafka', done: true },
  { id: 1, text: 'مشاهدة عرض الدمى', done: false },
  { id: 2, text: 'صورة Lennon Wall', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="إضافة مهمة"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>أضف</button>
    </>
  )
}
```

```js TaskList.js hidden
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
          حفظ
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          تعديل
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
        حذف
      </button>
    </label>
  );
}
```

```css
body { direction: rtl; }
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

اقرأ **[استخلاص منطق الحالة إلى مخفض (reducer)](/learn/extracting-state-logic-into-a-reducer)** لتتعلم كيفية تجميع منطق داخل دالة المخفض.

</LearnMore>

## تمرير البيانات إلى عمق باستخدام السياق (context) {/*passing-data-deeply-with-context*/}

عادة، سوف تقوم بتمرير معلومات من مكوّن أب إلى مكوّن ابن بواسطة الخصائص (props). لكن تمرير الخصائص قد يكون غير مجدٍ لو احتجت لتمرير بعض الخصائص خلال مكونات عديدة، أو لو أن العديد من المكونات تحتاج نفس المعلومات. السياق (context) يتيح للمكون الأب جعل بعض المعلومات متوفرة لأي مكون أدناه في الشجرة -لا يهم مقدار عمق المكون- بدون تمريرها مباشرة عن طريق الخصائص.

هنا، المكوّن `Heading` يحدد مستوى عنوانه عن طريق "سؤال" أقرب `Section` لمستواه. كل `Section` يتتبع مستواه الخاص عن طريق سؤال `Section` الأب وإضافة واحد له. كل `Section` يقوم بتوفير معلومات لجميع المكونات أدناه دون نقل الخصائص -- وهذا يتم عبر السياق (context).

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>عنوان</Heading>
      <Section>
        <Heading>عنوان رئيسي</Heading>
        <Heading>عنوان رئيسي</Heading>
        <Heading>عنوان رئيسي</Heading>
        <Section>
          <Heading>عنوان فرعي</Heading>
          <Heading>عنوان فرعي</Heading>
          <Heading>عنوان فرعي</Heading>
          <Section>
            <Heading>عنوان فرعي ثانٍ</Heading>
            <Heading>عنوان فرعي ثانٍ</Heading>
            <Heading>عنوان فرعي ثانٍ</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
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

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
body { direction: rtl; }
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/passing-data-deeply-with-context">

اقرأ **[تمرير البيانات إلى عمق باستخدام السياق (context)](/learn/passing-data-deeply-with-context)** لتتعلم عن استخدام السياق (context) كبديل لتمرير الخصائص.

</LearnMore>

## التوسع بواسطة المخفض (reducer) و السياق (context) {/*scaling-up-with-reducer-and-context*/}

المخفضات (Reducers) تتيح لك تجميع منطق تحديث الحالة لمكون. السياق (Context) يتيح لك تمرير معلومات بعمق إلى أسفل لمكونات أخرى. يمكنك جمع المخفضات والسايق معا لتدير الحالة الخاصة بشاشة معقدة.

مع هذا النهج، يدير المكون الأب حالة معقدة بواسطة مخفض. المكونات الأخرى في أي عمق كانت داخل الشجرة يمكن قراءة حالتها بواسطة السياق. يمكنهم أيضا إرسال الأوامر لتحديث الحالة.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>يوم إجازة في Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
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
  { id: 1, text: 'زيارة المعبد', done: false },
  { id: 2, text: 'شراب الشاي الأخضر (matcha)', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="إضافة مهمة"
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
      }}>أضف</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
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
          حفظ
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          تعديل
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
        حذف
      </button>
    </label>
  );
}
```

```css
body { direction: rtl; }
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

اقرأ **[التوسع بواسطة المخفض (reducer) و السياق (context)](/learn/scaling-up-with-reducer-and-context)** لتتعلم كيف توسيع إدارة الحالة في تطبيق نامٍ.

</LearnMore>

## ماذا بعد ذلك؟ {/*whats-next*/}

توجه إلى [الاستجابة للمدخلات باستخدام الحالة](/learn/reacting-to-input-with-state) لبدء قراءة هذا الفصل صفحة بصفحة!

أو، إذا كنت بالفعل على دراية بهذه المواضيع، لماذا لا تقرأ عن  [بوابات الهروب (Escape Hatches)](/learn/escape-hatches)؟

---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` هو Hook في React يتيح لك الاشتراك في مخزن خارجي (external store).

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

استدعِ `useSyncExternalStore` في أعلى مكوّنك لقراءة قيمة من مخزن بيانات خارجي.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

يُرجع لقطة (snapshot) البيانات في المخزن. تحتاج لتمرير دالتين كمعاملات:

1. دالة `subscribe` يجب أن تشترك في المخزن وتُرجع دالة لإلغاء الاشتراك.
2. دالة `getSnapshot` يجب أن تقرأ لقطة للبيانات من المخزن.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `subscribe`: دالة تأخذ معامل `callback` واحد وتشترك به في المخزن. عند تغيّر المخزن، يجب استدعاء `callback` المُزوَّد، مما يجعل React يعيد استدعاء `getSnapshot` ويعيد رسم المكوّن عند الحاجة. يجب أن تُرجع دالة `subscribe` دالة تنظّف الاشتراك.

* `getSnapshot`: دالة تُرجع لقطة للبيانات في المخزن التي يحتاجها المكوّن. طالما لم يتغيّر المخزن، يجب أن تُرجع استدعاءات `getSnapshot` المتكررة نفس القيمة. إذا تغيّر المخزن وأصبحت القيمة المُرجعة مختلفة (بالمقارنة بـ [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))، يُعيد React رسم المكوّن.

* **اختياري** `getServerSnapshot`: دالة تُرجع اللقطة الأولية للبيانات في المخزن. تُستخدم فقط أثناء العرض على الخادم وخلال ترطيب المحتوى المرسوم على الخادم على العميل. يجب أن تكون لقطة الخادم مطابقة بين العميل والخادم، وعادةً تُسلسل وتُمرَّر من الخادم إلى العميل. إذا حذفت هذا المعامل، فسيُرمى خطأ عند رسم المكوّن على الخادم.

#### Returns {/*returns*/}

اللقطة الحالية للمخزن التي يمكنك استخدامها في منطق الرسم.

#### Caveats {/*caveats*/}

* يجب أن تكون لقطة المخزن التي تُرجعها `getSnapshot` غير قابلة للتغيير. إذا كان المخزن الأساسي يحتوي بيانات قابلة للتغيير، أرجع لقطة غير قابلة للتغيير جديدة إذا تغيّرت البيانات. وإلا أرجع آخر لقطة مخبأة.

* إذا مُرِّرت دالة `subscribe` مختلفة أثناء إعادة الرسم، سيعيد React الاشتراك في المخزن باستخدام `subscribe` الجديدة. يمكنك منع ذلك بتعريف `subscribe` خارج المكوّن.

* إذا حُور المخزن أثناء [تحديث انتقال غير حاجز](/reference/react/useTransition)، سيعود React لتنفيذ ذلك التحديث كحاجز. تحديدًا، لكل تحديث انتقال، يستدعي React `getSnapshot` مرة ثانية قبل تطبيق التغييرات على DOM. إذا أرجعت قيمة مختلفة عن المرة الأولى، سيعيد React التحديث من الصفر هذه المرة كتحديث حاجز لضمان أن كل المكوّنات على الشاشة تعكس نفس إصدار المخزن.

* لا يُنصح بـ *تعليق* الرسم بناءً على قيمة مخزن تُرجعها `useSyncExternalStore`. السبب أن تغييرات المخزن الخارجي لا يمكن وضع علامة عليها كـ [تحديثات انتقال غير حاجزة](/reference/react/useTransition)، لذا ستُفعّل أقرب [`Suspense fallback`](/reference/react/Suspense) وتستبدل المحتوى المرسوم بمؤشر تحميل، وهذا عادةً يُسيء لتجربة المستخدم.

  على سبيل المثال، يُنصح بعدم ما يلي:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ استدعاء `use` مع Promise يعتمد على `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ عرض شرطي لمكوّن كسول يعتمد على `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Usage {/*usage*/}

### Subscribing to an external store {/*subscribing-to-an-external-store*/}

معظم مكوّنات React تقرأ البيانات من [الـ props](/learn/passing-props-to-a-component) و[الحالة](/reference/react/useState) و[السياق](/reference/react/useContext). لكن أحيانًا يحتاج المكوّن لقراءة بيانات من مخزن خارج React يتغيّر مع الزمن. يشمل ذلك:

* مكتبات إدارة حالة طرف ثالث تحتفظ بالحالة خارج React.
* واجهات متصفح تعرض قيمة قابلة للتغيير وأحداثًا للاشتراك في تغيّرها.

استدعِ `useSyncExternalStore` في أعلى مكوّنك لقراءة قيمة من مخزن بيانات خارجي.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

يُرجع <CodeStep step={3}>لقطة</CodeStep> البيانات في المخزن. مرّر دالتين:

1. دالة <CodeStep step={1}>`subscribe`</CodeStep> تشترك في المخزن وتُرجع دالة لإلغاء الاشتراك.
2. دالة <CodeStep step={2}>`getSnapshot`</CodeStep> تقرأ لقطة للبيانات من المخزن.

سيستخدم React هذه الدوال لإبقاء المكوّن مشتركًا في المخزن وإعادة رسمه عند التغيّر.

في الـ sandbox أدناه، `todosStore` مخزن خارجي يحتفظ بالبيانات خارج React. يتصل مكوّن `TodosApp` بهذا المخزن عبر Hook `useSyncExternalStore`. 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

عند الإمكان، نوصي باستخدام حالة React المدمجة مع [`useState`](/reference/react/useState) و[`useReducer`](/reference/react/useReducer). واجهة `useSyncExternalStore` مفيدة غالبًا عند التكامل مع كود غير React قائم.

</Note>

---

### Subscribing to a browser API {/*subscribing-to-a-browser-api*/}

سبب آخر لإضافة `useSyncExternalStore` هو الاشتراك في قيمة يوفّرها المتصفح وتتغيّر مع الزمن. لنفترض أنك تريد عرض ما إذا كان الاتصال بالشبكة نشطًا. يوفّر المتصفح هذه المعلومات عبر الخاصية [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

يمكن أن تتغيّر هذه القيمة دون علم React، لذا يجب قراءتها بـ `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

لتنفيذ دالة `getSnapshot`، اقرأ القيمة الحالية من واجهة المتصفح:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

ثم نفّذ دالة `subscribe`. عند تغيّر `navigator.onLine`، يطلق المتصفح الحدثين [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) و[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) على كائن `window`. اشترك بمعامل `callback` في الأحداث المناسبة، ثم أرجع دالة تنظّف الاشتراكات:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

الآن يعرف React كيف يقرأ القيمة من واجهة `navigator.onLine` الخارجية وكيف يشترك في تغيّراتها. افصل جهازك عن الشبكة ولاحظ إعادة رسم المكوّن:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extracting the logic to a custom Hook {/*extracting-the-logic-to-a-custom-hook*/}

عادةً لن تكتب `useSyncExternalStore` مباشرة في مكوّناتك. غالبًا تستدعيه من Hook مخصص. هذا يتيح استخدام نفس المخزن الخارجي من مكوّنات مختلفة.

على سبيل المثال، يتتبع Hook المخصص `useOnlineStatus` ما إذا كانت الشبكة متصلة:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

الآن يمكن لمكوّنات مختلفة استدعاء `useOnlineStatus` دون تكرار التنفيذ الأساسي:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Adding support for server rendering {/*adding-support-for-server-rendering*/}

إذا كان تطبيق React يستخدم [العرض على الخادم،](/reference/react-dom/server) ستعمل مكوّناتك أيضًا خارج بيئة المتصفح لتوليد HTML الأولي. هذا يطرح تحديات عند الاتصال بمخزن خارجي:

* إذا اتصلت بواجهة خاصة بالمتصفح فقط، لن تعمل لأنها غير موجودة على الخادم.
* إذا اتصلت بمخزن بيانات طرف ثالث، تحتاج تطابق بياناته بين الخادم والعميل.

لحل ذلك، مرّر دالة `getServerSnapshot` كالمعامل الثالث إلى `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

تشغّل دالة `getServerSnapshot` مثل `getSnapshot` لكنها تعمل فقط في حالتين:

- على الخادم عند توليد HTML.
- على العميل أثناء [الترطيب](/reference/react-dom/client/hydrateRoot)، أي عندما يأخذ React HTML الخادم ويجعله تفاعليًا.

هذا يتيح لك توفير قيمة اللقطة الأولية قبل أن يصبح التطبيق تفاعليًا. إذا لم تكن هناك قيمة أولية ذات معنى للعرض على الخادم، احذف هذا المعامل لـ [إجبار الرسم على العميل.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

تأكد أن `getServerSnapshot` تُرجع نفس البيانات تمامًا في أول رسم على العميل كما أرجعتها على الخادم. على سبيل المثال، إذا أرجعت `getServerSnapshot` محتوى مخزن مُسبق التعبئة على الخادم، تحتاج لنقل هذا المحتوى إلى العميل. إحدى الطرق هي إصدار وسم `<script>` أثناء عرض الخادم يضبط عامًا مثل `window.MY_STORE_DATA`، وقراءته على العميل في `getServerSnapshot`. يجب أن يوفّر المخزن الخارجي تعليمات لكيفية فعل ذلك.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

يعني هذا الخطأ أن دالة `getSnapshot` تُرجع كائنًا جديدًا في كل استدعاء، مثلًا:

```js {2-5}
function getSnapshot() {
  // 🔴 لا تُرجع دائمًا كائنات مختلفة من getSnapshot
  return {
    todos: myStore.todos
  };
}
```

سيعيد React رسم المكوّن إذا كانت قيمة إرجاع `getSnapshot` مختلفة عن المرة السابقة. لذلك إذا أرجعت دائمًا قيمة مختلفة، تدخل في حلقة لا نهائية ويظهر هذا الخطأ.

يجب أن تُرجع `getSnapshot` كائنًا مختلفًا فقط إذا تغيّر شيء فعليًا. إذا كانت بيانات المخزن غير قابلة للتغيير، يمكنك إرجاعها مباشرة:

```js {2-3}
function getSnapshot() {
  // ✅ يمكنك إرجاع بيانات غير قابلة للتغيير
  return myStore.todos;
}
```

إذا كانت بيانات المخزن قابلة للتغيير، يجب أن تُرجع `getSnapshot` لقطة غير قابلة للتغيير. أي أنها *تنشئ* كائنات جديدة، لكن ليس في كل استدعاء. بدلًا من ذلك، خزّن آخر لقطة محسوبة، وأرجع نفس اللقطة إذا لم تتغيّر بيانات المخزن. كيفية تحديد تغيّر البيانات القابلة للتغيير يعتمد على مخزنك.

---

### My `subscribe` function gets called after every re-render {/*my-subscribe-function-gets-called-after-every-re-render*/}

دالة `subscribe` هذه مُعرَّفة *داخل* المكوّن فهي مختلفة في كل إعادة رسم:

```js {2-5}
function ChatIndicator() {
  // 🚩 دائمًا دالة مختلفة، لذا سيعيد React الاشتراك في كل إعادة رسم
  function subscribe() {
    // ...
  }
  
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
  
سيعيد React الاشتراك في المخزن إذا مررت دالة `subscribe` مختلفة بين إعادات الرسم. إذا سبب ذلك مشاكل أداء وتريد تجنب إعادة الاشتراك، انقل `subscribe` خارج المكوّن:

```js {1-4}
// ✅ دائمًا نفس الدالة، لذا لن يحتاج React لإعادة الاشتراك
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

بدلًا من ذلك، لفّ `subscribe` بـ [`useCallback`](/reference/react/useCallback) لإعادة الاشتراك فقط عند تغيّر معامل:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ نفس الدالة طالما userId لم يتغيّر
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);
  
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

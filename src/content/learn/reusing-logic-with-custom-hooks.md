---
title: 'إعادة استخدام المنطق بخطافات مخصّصة'
---

<Intro>

يأتي React مع عدة خطافات مدمجة مثل `useState` و`useContext` و`useEffect`. أحياناً تتمنى لو كان هناك خطاف لغرض أدق: مثلاً لجلب البيانات، أو لتتبّع ما إذا كان المستخدم متصلاً بالإنترنت، أو للاتصال بغرفة محادثة. قد لا تجد هذه الخطافات في React، لكن يمكنك إنشاء خطافاتك الخاصة لاحتياجات تطبيقك.

</Intro>

<YouWillLearn>

- ما الخطافات المخصّصة، وكيف تكتب خطافك
- كيف تعيد استخدام المنطق بين المكوّنات
- كيف تسمّي خطافاتك المخصّصة وتنظّمها
- متى ولماذا تستخرج خطافات مخصّصة

</YouWillLearn>

## الخطافات المخصّصة: مشاركة المنطق بين المكوّنات {/*custom-hooks-sharing-logic-between-components*/}

تخيّل أنك تطوّر تطبيقاً يعتمد بشكل كبير على الشبكة (كمعظم التطبيقات). تريد تنبيه المستخدم إذا انقطع اتصال الشبكة عن طريق الخطأ أثناء استخدامه للتطبيق. كيف تفعل؟ يبدو أنك تحتاج شيئين في مكوّنك:

1. جزءاً من الحالة يتتبّع ما إذا كانت الشبكة متصلة.
2. تأثيراً يشترك في حدثي [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) و[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) العامّين، ويحدّث تلك الحالة.

يُبقي ذلك مكوّنك [متزامناً](/learn/synchronizing-with-effects) مع حالة الشبكة. قد تبدأ بشيء كهذا:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

جرّب تشغيل الشبكة وإيقافها، ولاحظ كيف يتحدّث `StatusBar` استجابةً لذلك.

الآن تخيّل أنك *أيضاً* تريد استخدام المنطق نفسه في مكوّن آخر. تريد زر حفظ يُعطّل ويعرض «Reconnecting...» بدلاً من «Save» بينما الشبكة مقطوعة.

للبدء، يمكنك نسخ ولصق حالة `isOnline` والتأثير في `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

تحقّق أنه عند إيقاف الشبكة يتغيّر مظهر الزر.

يعمل المكوّنان جيداً، لكن تكرار المنطق بينهما مزعج. يبدو أنه رغم اختلاف *المظهر*، تريد إعادة استخدام المنطق.

### استخراج خطاف مخصّص من مكوّن {/*extracting-your-own-custom-hook-from-a-component*/}

تخيّل للحظة أنه، مثل [`useState`](/reference/react/useState) و[`useEffect`](/reference/react/useEffect)، كان هناك خطاف مدمج `useOnlineStatus`. عندها يُبسَّط المكوّنان ويزول التكرار بينهما:

```js {2,7}
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
```

رغم عدم وجود خطاف مدمج كهذا، يمكنك كتابته بنفسك. صرّح بدالة اسمها `useOnlineStatus` وانقل كل الشيفرة المكررة إليها من المكوّنات التي كتبتها سابقاً:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

في نهاية الدالة، أعد `isOnline`. يتيح ذلك لمكوّناتك قراءة تلك القيمة:

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
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

تحقّق أن تشغيل الشبكة وإيقافها يحدّث كلا المكوّنين.

لم يعد لدى مكوّناتك هذا القدر من التكرار. **والأهم أن الشيفرة داخلها تصف *ما تريد فعله* (استخدام حالة الاتصال!) لا *كيف تفعله* (بالاشتراك في أحداث المتصفح).**

عند استخراج المنطق إلى خطافات مخصّصة، يمكنك إخفاء تفاصيل التعامل مع نظام خارجي أو واجهة متصفح. شيفرة مكوّناتك تعبّر عن قصدك لا عن التنفيذ.

### أسماء الخطافات تبدأ دائماً بـ `use` {/*hook-names-always-start-with-use*/}

تُبنى تطبيقات React من مكوّنات. والمكوّنات تُبنى من خطافات، مدمجة أو مخصّصة. غالباً ستستخدم خطافات مخصّصة كتبها آخرون، وأحياناً تكتب واحداً بنفسك!

يجب اتباع هذه قواعد التسمية:

1. **أسماء مكوّنات React تبدأ بحرف كبير،** مثل `StatusBar` و`SaveButton`. كما يجب أن تعيد المكوّنات شيئاً يعرف React عرضه، مثل جزء من JSX.
2. **أسماء الخطافات تبدأ بـ `use` ثم حرف كبير،** مثل [`useState`](/reference/react/useState) (مدمج) أو `useOnlineStatus` (مخصّص، كما في الصفحة). قد تعيد الخطافات قيماً عشوائية.

هذا الاتفاق يضمن أنك عند النظر إلى مكوّن تعرف أين قد «تختبئ» حالته وتأثيراته وميزات React الأخرى. مثلاً، إذا رأيت استدعاء `getColor()`، تتأكد أنه لا يمكن أن يحوي حالة React لأن اسمه لا يبدأ بـ `use`. أما استدعاء مثل `useOnlineStatus()` فغالباً يحوي استدعاءات لخطافات أخرى داخله!

<Note>

إذا كان المُدقّق [مهيّأً لـReact،](/learn/editor-setup#linting) سيفرض هذه التسمية. انتقل للـsandbox أعلاه وأعد تسمية `useOnlineStatus` إلى `getOnlineStatus`. لاحظ أن المُدقّق لن يسمح بعدها باستدعاء `useState` أو `useEffect` داخله. فقط الخطافات والمكوّنات تستطيع استدعاء خطافات أخرى!

</Note>

<DeepDive>

#### هل يجب أن تبدأ كل الدوال المستدعاة أثناء التصيير ببادئة use؟ {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

لا. الدوال التي لا *تستدعي* خطافات لا تحتاج أن *تكون* خطافات.

إذا لم تستدعِ دالتك أي خطاف، تجنّب بادئة `use`. اكتبها دالة عادية *بدون* `use`. مثلاً، `useSorted` أدناه لا يستدعي خطافات، فسمّها `getSorted`:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

يضمن ذلك أن تستطيع استدعاء هذه الدالة العادية في أي مكان، بما في ذلك الشروط:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

أعطِ دالة بادئة `use` (فتصبح خطافاً) إذا استخدمت خطافاً واحداً على الأقل داخلها:

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

تقنياً، React لا يفرض ذلك. من حيث المبدأ يمكنك جعل خطاف لا يستدعي خطافات أخرى. غالباً يكون ذلك مربكاً ومقيّداً فالأفضل تجنّب النمط. لكن قد تكون هناك حالات نادرة مفيدة. مثلاً دالتك لا تستخدم خطافات الآن لكنك تخطط لإضافة استدعاءات لاحقاً. عندها من المنطقي تسميتها ببادئة `use`:

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

عندها لن تستطيع المكوّنات استدعاؤها شرطياً. يصبح ذلك مهماً عندما تضيف فعلاً استدعاءات خطاف داخلها. إذا لم تخطط لاستخدام خطافات داخلها (الآن أو لاحقاً)، لا تجعلها خطافاً.

</DeepDive>

### الخطافات المخصّصة تشارك منطقاً ذا حالة، لا الحالة نفسها {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

في المثال السابق، عند تشغيل الشبكة وإيقافها، تحدّث المكوّنان معاً. لكن خطأ الاعتقاد أن متغير حالة `isOnline` واحداً يُشارك بينهما. انظر إلى هذه الشيفرة:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

يعمل كما قبل استخراج التكرار:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

هذان متغيرا حالة وتأثيران مستقلان تماماً! اتفقتا في القيمة في آن واحد لأنك زامنتهما مع نفس القيمة الخارجية (ما إذا كانت الشبكة تعمل).

لتوضيح ذلك، نحتاج مثلاً آخر. انظر إلى مكوّن `Form` هذا:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

هناك تكرار في المنطق لكل حقل نموذج:

1. جزء من الحالة (`firstName` و`lastName`).
1. معالج تغيير (`handleFirstNameChange` و`handleLastNameChange`).
1. جزء JSX يحدد خاصيتي `value` و`onChange` لذلك الحقل.

يمكنك استخراج التكرار إلى خطاف مخصّص `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

لاحظ أنه يصرّح فقط عن متغير حالة *واحد* اسمه `value`.

لكن مكوّن `Form` يستدعي `useFormInput` *مرتين:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

لهذا يعمل كإعلان متغيري حالة منفصلين!

**الخطافات المخصّصة تشارك *منطقاً ذا حالة* لا *الحالة نفسها.* كل استدعاء لخطاف مستقل تماماً عن أي استدعاء آخر لنفس الخطاف.** لذلك الـsandboxان أعلاه متكافئان تماماً. إن شئت، ارجع وقارنهما. السلوك قبل وبعد استخراج خطاف مخصّص متطابق.

عند الحاجة لمشاركة *الحالة نفسها* بين عدة مكوّنات، [ارفعها ومرّرها للأسفل](/learn/sharing-state-between-components) بدلاً من ذلك.

## تمرير قيم تفاعلية بين الخطافات {/*passing-reactive-values-between-hooks*/}

تُعاد تشغيل الشيفرة داخل خطافاتك المخصّصة في كل إعادة تصيير لمكوّنك. لذلك، مثل المكوّنات، الخطافات المخصّصة [يجب أن تكون نقية.](/learn/keeping-components-pure) فكّر في شيفرة الخطافات المخصّصة كجزء من جسم مكوّنك!

وبما أن الخطافات المخصّصة تعيد التصيير مع مكوّنك، تتلقى دائماً أحدث الخصائص والحالة. لمعنى ذلك، انظر مثال غرفة المحادثة هذا. غيّر عنوان الخادم أو غرفة المحادثة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

عند تغيير `serverUrl` أو `roomId`، يتفاعل التأثير [مع تغيّراتك](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) ويعيد المزامنة. تلاحظ من رسائل الـconsole أن المحادثة تعيد الاتصال في كل مرة تغيّر فيها تبعيات التأثير.

الآن انقل شيفرة التأثير إلى خطاف مخصّص:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

يتيح ذلك لمكوّن `ChatRoom` استدعاء خطافك المخصّص دون القلق بكيفية عمله داخلياً:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

يبدو أبسط كثيراً! (لكنه يفعل الشيء نفسه.)

لاحظ أن المنطق *ما زال يستجيب* لتغيّرات الخصائص والحالة. جرّب تعديل عنوان الخادم أو الغرفة المختارة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لاحظ كيف تأخذ قيمة الإرجاع من خطاف:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

وتمرّرها كمدخل لخطاف آخر:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

في كل إعادة تصيير لمكوّن `ChatRoom`، يمرّر أحدث `roomId` و`serverUrl` إلى خطافك. لذلك يعيد التأثير الاتصال بالمحادثة عندما تختلف قيمهما بعد إعادة التصيير. (إن عملت سابقاً على برامج معالجة صوت/فيديو، قد يذكرك ربط الخطافات هكذا بربط تأثيرات بصرية أو صوتية. كأن مخرجات `useState` «تتغذى» على مدخل `useChatRoom`.)

### تمرير معالجات الأحداث إلى خطافات مخصّصة {/*passing-event-handlers-to-custom-hooks*/}

مع استخدامك `useChatRoom` في مكوّنات أكثر، قد تريد تمكين المكوّنات من تخصيص سلوكه. مثلاً، منطق ما يحدث عند وصول رسالة مثبّت حالياً داخل الخطاف:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

لنقل هذا المنطق إلى مكوّنك:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

ليعمل ذلك، عدّل خطافك المخصّص ليقبل `onReceiveMessage` كأحد خياراته المسماة:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

سيعمل، لكن هناك تحسين إضافي عندما يقبل خطافك المخصّص معالجات أحداث.

إضافة تبعية على `onReceiveMessage` ليست مثالية لأنها تجعل المحادثة تعيد الاتصال في كل إعادة تصيير للمكوّن. [لفّ معالج الحدث هذا في حدث تأثير لإزالته من التبعيات:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

الآن لن تعيد المحادثة الاتصال في كل إعادة تصيير لـ`ChatRoom`. هذا عرض كامل يعمل لتمرير معالج حدث إلى خطاف مخصّص يمكنك تجربته:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لاحظ أنك لم تعد تحتاج معرفة *كيف* يعمل `useChatRoom` لاستخدامه. يمكنك إضافته لأي مكوّن وتمرير خيارات أخرى، وسيعمل بنفس الطريقة. هذه قوة الخطافات المخصّصة.

## متى تستخدم خطافات مخصّصة {/*when-to-use-custom-hooks*/}

لا تحتاج استخراج خطاف مخصّص لكل تكرار بسيط في الشيفرة. بعض التكرار مقبول. مثلاً، استخراج `useFormInput` ليلف استدعاء `useState` واحداً كما سابقاً غالباً غير ضروري.

لكن كلما كتبت تأثيراً، فكّر هل يصبح أوضح أيضاً لفّه في خطاف مخصّص. [لا ينبغي أن تحتاج التأثيرات كثيراً،](/learn/you-might-not-need-an-effect) فإن كتبت واحداً فذلك يعني أنك تحتاج «الخطوة خارج React» للمزامنة مع نظام خارجي أو لفعل لا توفر له React واجهة مدمجة. لفّه في خطاف مخصّص يعبّر بدقة عن قصدك وعن تدفّق البيانات.

مثلاً، مكوّن `ShippingForm` يعرض قائمتين منسدلتين: إحداهما مدن، والأخرى مناطق المدينة المختارة. قد تبدأ بشيفرة كهذه:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

رغم تكرار هذه الشيفرة، [من الصحيح الإبقاء على هذين التأثيرين منفصلين.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) يزامنان شيئين مختلفين، فلا تدمجهما في تأثير واحد. بدلاً من ذلك، بسّط مكوّن `ShippingForm` أعلاه باستخراج المنطق المشترك بينهما إلى خطاف `useData` خاص بك:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

الآن استبدل كلا التأثيرين في `ShippingForm` باستدعاءات `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

استخراج خطاف مخصّص يجعل تدفّق البيانات صريحاً. تُدخل `url` وتخرج `data`. بـ«إخفاء» تأثيرك داخل `useData`، تمنع أيضاً من يعمل على `ShippingForm` من إضافة [تبعيات غير ضرورية](/learn/removing-effect-dependencies). مع الوقت، ستكون معظم تأثيرات تطبيقك في خطافات مخصّصة.

<DeepDive>

#### حافظ على تركيز خطافاتك المخصّصة على حالات استخدام عالية المستوى ومحددة {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

ابدأ باختيار اسم خطافك المخصّص. إذا صعب عليك اسم واضح، قد يعني أن تأثيرك مرتبط بشدة ببقية منطق المكوّن وليس جاهزاً للاستخراج.

مثالياً، يكون الاسم واضحاً لدرجة أن شخصاً لا يكتب شيفرة كثيراً يمكنه تخمين ما يفعله الخطاف وما يأخذ وما يعيد:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

عند المزامنة مع نظام خارجي، قد يكون الاسم أكثر تقنية ويستخدم مصطلحات ذلك النظام. هذا جيد طالما واضح لمن يعرف النظام:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**حافظ على تركيز الخطافات المخصّصة على حالات استخدام عالية المستوى ومحددة.** تجنّب إنشاء خطافات «دورة حياة» مخصّصة تكون بدائل أو لفّات مريحة لواجهة `useEffect` نفسها:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

مثلاً، يحاول خطاف `useMount` هذا ضمان تشغيل شيفرة فقط «عند التركيب»:

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**خطافات «دورة حياة» مخصّصة مثل `useMount` لا تنسجم جيداً مع نموذج React.** مثلاً، هذا المثال فيه خطأ (لا «يتفاعل» مع تغيّر `roomId` أو `serverUrl`)، لكن المُدقّق لن ينبهك لأنه يفحص استدعاءات `useEffect` المباشرة فقط. لن يعرف عن خطافك.

إذا كتبت تأثيراً، ابدأ بواجهة React مباشرة:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

ثم يمكنك (دون إلزام) استخراج خطافات مخصّصة لحالات استخدام عالية المستوى مختلفة:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**الخطاف المخصّص الجيد يجعل شيفرة المستدعي أكثر تصريحاً بتحديد ما يفعله.** مثلاً، `useChatRoom(options)` يتصل بالغرفة فقط، بينما `useImpressionLog(eventName, extraData)` يرسل سجل ظهور للتحليلات فقط. إذا لم تقيّد واجهة خطافك حالات الاستخدام وكانت مجردة جداً، فعلى المدى الطويل قد تسبب مشاكل أكثر مما تحل.

</DeepDive>

### الخطافات المخصّصة تساعدك على الانتقال لأنماط أفضل {/*custom-hooks-help-you-migrate-to-better-patterns*/}

التأثيرات [«مخرج طوارئ»](/learn/escape-hatches): تستخدمها عند الحاجة للخطوة خارج React وعندما لا يوجد حل مدمج أفضل لحالتك. مع الوقت، يهدف فريق React إلى تقليل عدد التأثيرات في تطبيقك قدر الإمكان بتوفير حلول أدق لمشاكل أدق. لفّ تأثيراتك في خطافات مخصّصة يسهّل ترقية شيفرتك عند توفر هذه الحلول.

لنعد إلى هذا المثال:

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

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

في المثال أعلاه، يُنفَّذ `useOnlineStatus` بزوج من [`useState`](/reference/react/useState) و[`useEffect`.](/reference/react/useEffect) لكن هذا ليس أفضل حل ممكن. هناك حالات حافة لا يغطيها. مثلاً يفترض أن `isOnline` عند التركيب `true`، وهذا قد يكون خطأ إذا كانت الشبكة منقطعة مسبقاً. يمكنك استخدام واجهة المتصفح [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) للتحقق، لكن استخدامها مباشرة لا يعمل على الخادم لتوليد HTML الأولي. باختصار، يمكن تحسين هذه الشيفرة.

يتضمّن React واجهة مخصّصة اسمها [`useSyncExternalStore`](/reference/react/useSyncExternalStore) تعالج هذه المشاكل. إليك `useOnlineStatus` معاد كتابته لاستغلالها:

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

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

لاحظ أنك **لم تحتج تغيير أي من المكوّنات** لإتمام هذه الهجرة:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

هذا سبب آخر لكون لفّ التأثيرات في خطافات مخصّصة مفيداً غالباً:

1. تجعل تدفّق البيانات من تأثيراتك وإليها صريحاً جداً.
2. تترك مكوّناتك تركز على القصد لا على تنفيذ التأثير بالتفصيل.
3. عندما يضيف React ميزات جديدة، يمكنك إزالة تلك التأثيرات دون تغيير مكوّناتك.

مثل [نظام تصميم،](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) قد يفيدك استخراج تعابير شائعة من مكوّنات تطبيقك إلى خطافات مخصّصة. يُبقي ذلك شيفرة المكوّنات على القصد ويقلّل كتابة تأثيرات خاماً. يحافظ مجتمع React على العديد من الخطافات المخصّصة الممتازة.

<DeepDive>

#### هل سيوفّر React حلاً مدمجاً لجلب البيانات؟ {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

اليوم، مع واجهة [`use`](/reference/react/use#streaming-data-from-server-to-client)، يمكن قراءة البيانات أثناء التصيير بتمرير [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) إلى `use`:

```js {1,4,11}
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

ما زلنا نضبط التفاصيل، لكننا نتوقع أن تكتب جلب البيانات مستقبلاً هكذا:

```js {1,4,6}
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

إذا استخدمت خطافات مخصّصة مثل `useData` أعلاه، ستقل التغييرات عند الهجرة للنهج الموصى به لاحقاً مقارنةً بكتابة تأثيرات خاماً في كل مكوّن يدوياً. لكن النهج القديم ما زال يعمل جيداً، فإن رضيت عن التأثيرات الخام تستطيع الاستمرار.

</DeepDive>

### هناك أكثر من طريقة لفعل ذلك {/*there-is-more-than-one-way-to-do-it*/}

لنفترض أنك تريد تنفيذ تلاشٍ للدخول *من الصفر* باستخدام واجهة المتصفح [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). قد تبدأ بتأثير يضبط حلقة رسوم. في كل إطار، تغيّر شفافية عقدة DOM [تحتفظ بها في ref](/learn/manipulating-the-dom-with-refs) حتى تصل إلى `1`. قد تبدأ شيفرتك هكذا:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

لزيادة وضوح المكوّن، قد تستخرج المنطق إلى خطاف مخصّص `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

يمكنك الإبقاء على `useFadeIn` كما هو، أو إعادة هيكلته أكثر. مثلاً، استخرج منطق إعداد حلقة الرسوم من `useFadeIn` إلى خطاف `useAnimationLoop` مخصّص:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

لكنك لم *تكن مضطراً* لذلك. كالدوال العادية، أنت من يحدد حدود أجزاء شيفرتك. يمكنك أيضاً نهج مختلف تماماً. بدلاً من الإبقاء على المنطق في التأثير، انقل معظم المنطق الإلزامي داخل [صنف](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) JavaScript

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

التأثيرات تربط React بالأنظمة الخارجية. كلما زادت الحاجة لتنسيق بين التأثيرات (مثلاً لربط عدة رسوم)، زادت منطقية استخراج ذلك المنطق من التأثيرات والخطافات *كلياً* كما في الـsandbox أعلاه. عندها تصبح الشيفرة المستخرجة هي «النظام الخارجي». يبقى تأثيرك بسيطاً لأنه يحتاج فقط إرسال رسائل للنظام الذي نقلته خارج React.

تفترض الأمثلة أعلاه أن منطق التلاشٍ يُكتب بـJavaScript. لكن هذه الرسوم بالذات أبسط وأكفأ بكثير عند تنفيذها بـ[رسوم CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) عادية:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

أحياناً لا تحتاج حتى إلى خطاف!

<Recap>

- الخطافات المخصّصة تشارك المنطق بين المكوّنات.
- يجب أن تبدأ أسماء الخطافات المخصّصة بـ `use` ثم حرف كبير.
- الخطافات المخصّصة تشارك منطقاً ذا حالة فقط، لا الحالة نفسها.
- يمكنك تمرير قيم تفاعلية من خطاف لآخر، وتبقى محدّثة.
- كل الخطافات تعيد التشغيل في كل إعادة تصيير لمكوّنك.
- شيفرة خطافاتك المخصّصة يجب أن تكون نقية، مثل شيفرة المكوّن.
- لفّ معالجات الأحداث التي تتلقاها الخطافات المخصّصة في أحداث تأثير.
- لا تنشئ خطافات مثل `useMount`. اجعل الغرض محدداً.
- أنت من يقرر كيف وأين ترسم حدود شيفرتك.

</Recap>

<Challenges>

#### استخراج خطاف `useCounter` {/*extract-a-usecounter-hook*/}

يستخدم هذا المكوّن متغير حالة وتأثيراً لعرض عدد يزيد كل ثانية. استخرج هذا المنطق إلى خطاف مخصّص اسمه `useCounter`. هدفك أن تبدو تنفيذات مكوّن `Counter` تماماً هكذا:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

ستكتب خطافك المخصّص في `useCounter.js` وتستورده في `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

يجب أن تبدو شيفرتك هكذا:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

لاحظ أن `App.js` لم يعد يحتاج استيراد `useState` أو `useEffect`.

</Solution>

#### جعل تأخير العداد قابلاً للضبط {/*make-the-counter-delay-configurable*/}

في هذا المثال، هناك متغير حالة `delay` يتحكم به منزلق، لكن قيمته غير مستخدمة. مرّر قيمة `delay` إلى خطاف `useCounter` المخصّص، وعدّل الخطاف ليستخدم `delay` الممرّر بدلاً من تثبيت `1000` مللي ثانية.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

مرّر `delay` إلى خطافك بـ`useCounter(delay)`. ثم داخل الخطاف، استخدم `delay` بدلاً من القيمة الثابتة `1000`. أضف `delay` إلى تبعيات التأثير. يضمن ذلك أن تغيّر `delay` يعيد ضبط الفترة.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### استخراج `useInterval` من `useCounter` {/*extract-useinterval-out-of-usecounter*/}

حالياً، خطاف `useCounter` يفعل أمرين: يضبط فترة، ويزيد متغير حالة في كل دقة. افصل منطق إعداد الفترة إلى خطاف منفصل اسمه `useInterval`. يجب أن يأخذ وسيطين: رد النداء `onTick`، و`delay`. بعد التغيير، يجب أن يبدو تنفيذ `useCounter` هكذا:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

اكتب `useInterval` في الملف `useInterval.js` واستورده في `useCounter.js`.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

يجب أن يضبط منطق `useInterval` الفترة ويمحوها. لا يحتاج فعل غير ذلك.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

لاحظ أن لهذا الحل مشكلة صغيرة ستحلّها في التحدي التالي.

</Solution>

#### إصلاح فترة تُعاد ضبطها {/*fix-a-resetting-interval*/}

في هذا المثال، هناك *فترتان* منفصلتان.

يستدعي مكوّن `App` الدالة `useCounter`، التي تستدعي `useInterval` لتحديث العداد كل ثانية. لكن `App` *أيضاً* يستدعي `useInterval` لتحديث لون خلفية الصفحة عشوائياً كل ثانيتين.

لسبب ما، رد النداء الذي يحدّث الخلفية لا يعمل أبداً. أضف بعض السجلات داخل `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

هل تطابق السجلات ما تتوقع؟ إذا بدا أن بعض تأثيراتك تعيد المزامنة دون داعٍ، هل تخمّن أي تبعية تسبب ذلك؟ هل هناك طريقة [لإزالة تلك التبعية](/learn/removing-effect-dependencies) من التأثير؟

بعد الإصلاح، يفترض أن تتحدّث خلفية الصفحة كل ثانيتين.

<Hint>

يبدو أن `useInterval` يقبل مستمع حدث كوسيط. هل يمكنك تفكير في طريقة للفّ ذلك المستمع بحيث لا يحتاج أن يكون تبعيةً للتأثير؟

</Hint>

<Sandpack>

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

داخل `useInterval`، لفّ رد نداء الدقة في حدث تأثير، كما فعلت [سابقاً في هذه الصفحة.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

يتيح لك ذلك حذف `onTick` من تبعيات التأثير. لن يعيد التأثير المزامنة في كل إعادة تصيير للمكوّن، فلا تُعاد ضبط فترة تغيير لون الخلفية كل ثانية قبل أن تُنفَّذ.

بهذا التعديل، تعمل الفترتان كما يُتوقع ولا تتداخلان:

<Sandpack>


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### تنفيذ حركة متتابعة {/*implement-a-staggering-movement*/}

في هذا المثال، يتتبّع خطاف `usePointerPosition()` موضع المؤشر الحالي. حرّك المؤشر أو إصبعك فوق منطقة المعاينة ولاحظ النقطة الحمراء تتبع الحركة. موضعها محفوظ في `pos1`.

في الواقع، هناك خمس (!) نقاط حمراء مختلفة تُصيَّر. لا تراها لأنها كلها تظهر في الموضع نفسه حالياً. هذا ما يجب إصلاحه. بدلاً من ذلك تريد حركة «متتابعة»: كل نقطة «تتبع» مسار النقطة السابقة. مثلاً، إذا حرّكت المؤشر بسرعة، تتبعه الأولى فوراً، والثانية تتبع الأولى بتأخير بسيط، والثالثة تتبع الثانية، وهكذا.

تحتاج تنفيذ خطاف مخصّص `useDelayedValue`. التنفيذ الحالي يعيد `value` الممرّرة. بدلاً من ذلك تريد إرجاع القيمة كما كانت قبل `delay` مللي ثانية. قد تحتاج حالة وتأثيراً.

بعد تنفيذ `useDelayedValue`، يجب أن ترى النقاط تتحرك متتابعة.

<Hint>

ستحتاج تخزين `delayedValue` كمتغير حالة داخل خطافك المخصّص. عند تغيّر `value`، شغّل تأثيراً. يحدّث هذا التأثير `delayedValue` بعد `delay`. قد يفيدك استدعاء `setTimeout`.

هل يحتاج هذا التأثير تنظيفاً؟ لماذا أو لماذا لا؟

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

هذا نسخة عاملة. تحتفظ بـ`delayedValue` كمتغير حالة. عند تحديث `value`، يجدول تأثيرك مهلة لتحديث `delayedValue`. لذلك يتأخر `delayedValue` دائماً عن `value` الفعلية.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

لاحظ أن هذا التأثير *لا* يحتاج تنظيفاً. لو استدعيت `clearTimeout` في دالة التنظيف، ففي كل تغيّر لـ`value` ستُلغى المهلة المجدولة مسبقاً. للإبقاء على الحركة متصلة، تريد أن تُنفَّذ كل المهل.

</Solution>

</Challenges>

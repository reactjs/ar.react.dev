---
title: المخارج الطارئة
---

<Intro>

قد تحتاج بعض مكوّناتك إلى التحكم والمزامنة مع أنظمة خارج React. مثلًا، التركيز على حقل باستخدام واجهة المتصفح، تشغيل وإيقاف مشغّل فيديو غير مبني بـ React، أو الاتصال والاستماع لرسائل من خادم بعيد. في هذا الفصل، ستتعلم المخارج الطارئة التي تتيح لك «الخطوة خارج» React والاتصال بالأنظمة الخارجية. لا ينبغي أن يعتمد معظم منطق تطبيقك وتدفق بياناته على هذه الميزات.

</Intro>

<YouWillLearn isChapter={true}>

* [كيف «تتذكر» معلومات دون إعادة رسم](/learn/referencing-values-with-refs)
* [كيف تصل لعناصر DOM التي يديرها React](/learn/manipulating-the-dom-with-refs)
* [كيف تزامن المكوّنات مع أنظمة خارجية](/learn/synchronizing-with-effects)
* [كيف تزيل التأثيرات غير الضرورية من مكوّناتك](/learn/you-might-not-need-an-effect)
* [كيف تختلف دورة حياة التأثير عن دورة حياة المكوّن](/learn/lifecycle-of-reactive-effects)
* [كيف تمنع بعض القيم من إعادة تشغيل التأثيرات](/learn/separating-events-from-effects)
* [كيف تجعل التأثير يعيد التشغيل أقل](/learn/removing-effect-dependencies)
* [كيف تشارك المنطق بين المكوّنات](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## الإشارة إلى قيم باستخدام المراجع {/*referencing-values-with-refs*/}

عندما تريد أن «يتذكر» المكوّن بعض المعلومات، لكنك لا تريد أن تسبب [رسمًا جديدًا](/learn/render-and-commit)، يمكنك استخدام *مرجعًا*:

```js
const ref = useRef(0);
```

كالحالة، React يحتفظ بالمراجع بين إعادات الرسم. لكن تعيين الحالة يُعيد رسم المكوّن. تغيير المرجع لا يفعل ذلك! تصل إلى القيمة الحالية عبر الخاصية `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

المرجع مثل جيب سري في مكوّنك لا يتتبعه React. مثلًا، يمكنك تخزين [معرفات المؤقتات](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value)، [عناصر DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element)، وكائنات أخرى لا تؤثر على مخرجات الرسم.

<LearnMore path="/learn/referencing-values-with-refs">

اقرأ **[الإشارة إلى قيم باستخدام المراجع](/learn/referencing-values-with-refs)** لتتعلم استخدام المراجع لتذكّر المعلومات.

</LearnMore>

## التعامل مع DOM باستخدام المراجع {/*manipulating-the-dom-with-refs*/}

يحدّث React DOM تلقائيًا ليطابق مخرجات الرسم، فلا تحتاج مكوّناتك غالبًا إلى التلاعب به. لكن أحيانًا تحتاج الوصول لعناصر DOM التي يديرها React — مثلًا للتركيز على عقدة، التمرير إليها، أو قياس حجمها وموضعها. لا توجد طريقة مدمجة لذلك في React، فتحتاج مرجعًا إلى عقدة DOM. مثلًا، النقر على الزر يوجّه التركيز للحقل باستخدام مرجع:

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

<LearnMore path="/learn/manipulating-the-dom-with-refs">

اقرأ **[التعامل مع DOM باستخدام المراجع](/learn/manipulating-the-dom-with-refs)** لتتعلم الوصول لعناصر DOM التي يديرها React.

</LearnMore>

## المزامنة بالتأثيرات {/*synchronizing-with-effects*/}

بعض المكوّنات تحتاج المزامنة مع أنظمة خارجية. مثلًا، التحكم بمكوّن غير React حسب حالة React، إعداد اتصال بخادم، أو إرسال سجل تحليلات عند ظهور المكوّن. بخلاف معالجات الأحداث التي تعالج أحداثًا محددة، *التأثيرات* (`Effects`) تشغّل كودًا بعد الرسم. استخدمها لمزامنة المكوّن مع نظام خارج React.

اضغط تشغيل/إيقاف عدة مرات ولاحظ بقاء مشغّل الفيديو متزامنًا مع قيمة الخاصية `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

كثير من التأثيرات «تنظف» بعد نفسها. مثلًا، تأثير يضبط اتصالًا بخادم دردشة يجب أن يعيد *دالة تنظيف* تخبر React كيف تفصل المكوّن عن ذلك الخادم:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

في التطوير، يشغّل React تأثيرك وينظّفه فورًا مرة إضافية. لذلك ترى `"✅ Connecting..."` مطبوعًا مرتين. يضمن أنك لا تنسى تنفيذ دالة التنظيف.

<LearnMore path="/learn/synchronizing-with-effects">

اقرأ **[المزامنة بالتأثيرات](/learn/synchronizing-with-effects)** لتتعلم مزامنة المكوّنات مع أنظمة خارجية.

</LearnMore>

## قد لا تحتاج تأثيرًا {/*you-might-not-need-an-effect*/}

التأثيرات مخرج طارئ من نموذج React. تتيح «الخطوة خارج» React ومزامنة المكوّنات مع نظام خارجي. إن لم يكن هناك نظام خارجي (مثلًا، تحديث حالة المكوّن عند تغيّر خصائص أو حالة)، لا ينبغي أن تحتاج تأثيرًا. إزالة التأثيرات غير الضرورية يجعل الكود أوضح، أسرع، وأقل عرضة للخطأ.

حالتان شائعتان لا تحتاجان فيهما تأثيرًا:
- **لا تحتاج تأثيرات لتحويل البيانات للرسم.**
- **لا تحتاج تأثيرات لمعالجة أحداث المستخدم.**

مثلًا، لا تحتاج تأثيرًا لضبط حالة بناءً على حالة أخرى:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

بدل ذلك، احسب أثناء الرسم ما أمكن:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

لكنك *تحتاج* تأثيرات للمزامنة مع أنظمة خارجية. 

<LearnMore path="/learn/you-might-not-need-an-effect">

اقرأ **[قد لا تحتاج تأثيرًا](/learn/you-might-not-need-an-effect)** لتتعلم إزالة التأثيرات غير الضرورية.

</LearnMore>

## دورة حياة التأثيرات التفاعلية {/*lifecycle-of-reactive-effects*/}

للتأثيرات دورة حياة تختلف عن المكوّنات. قد يُثبَّت المكوّن، يُحدَّث، أو يُزال. التأثير يفعل شيئين فقط: بدء مزامنة شيء ما، ولاحقًا إيقاف مزامنته. قد يتكرر هذا الدور إن اعتمد التأثير على خصائص وحالة تتغير مع الزمن.

هذا التأثير يعتمد على قيمة الخاصية `roomId`. الخصائص *قيم تفاعلية،* أي يمكنها التغير عند إعادة الرسم. لاحظ أن التأثير *يعيد المزامنة* (ويعيد الاتصال بالخادم) إن تغيّر `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

يوفّر React قاعدة linter للتحقق من أنك حدّدت تبعيات التأثير صحيحة. إن نسيت `roomId` في قائمة التبعيات في المثال أعلاه، يكتشف الـ linter الخلل تلقائيًا.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

اقرأ **[دورة حياة التأثيرات التفاعلية](/learn/lifecycle-of-reactive-effects)** لتتعلم كيف تختلف دورة حياة التأثير عن دورة حياة المكوّن.

</LearnMore>

## فصل الأحداث عن التأثيرات {/*separating-events-from-effects*/}

معالجات الأحداث تُعاد فقط عند تكرار نفس التفاعل. بخلافها، التأثيرات تعيد المزامنة إن اختلفت أي قيمة قرأها، مثل الخصائص أو الحالة، عن الرسم السابق. أحيانًا تريد مزيجًا: تأثير يُعاد استجابةً لبعض القيم لا غيرها.

كل الكود داخل التأثيرات *تفاعلي.* يُعاد تشغيله إن تغيّرت قيمة تفاعلية قرأها بسبب إعادة رسم. مثلًا، هذا التأثير يعيد الاتصال بالدردشة إن تغيّر `roomId` أو `theme`:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

هذا ليس مثاليًا. تريد إعادة الاتصال بالدردشة فقط عند تغيّر `roomId`. تبديل `theme` لا ينبغي أن يعيد الاتصال! انقل الكود الذي يقرأ `theme` خارج التأثير إلى *حدث تأثير* (`Effect Event`):

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

الكود داخل أحداث التأثير ليس تفاعليًا، فلم يعد تغيير `theme` يعيد تشغيل التأثير لإعادة الاتصال.

<LearnMore path="/learn/separating-events-from-effects">

اقرأ **[فصل الأحداث عن التأثيرات](/learn/separating-events-from-effects)** لتتعلم كيف تمنع بعض القيم من إعادة تشغيل التأثيرات.

</LearnMore>

## إزالة تبعيات التأثير {/*removing-effect-dependencies*/}

عند كتابة تأثير، يتحقق الـ linter من تضمين كل قيمة تفاعلية (مثل الخصائص والحالة) التي يقرأها التأثير في قائمة التبعيات. يضمن بقاء التأثير متزامنًا مع أحدث الخصائص والحالة. التبعيات غير الضرورية قد تجعل التأثير يعمل كثيرًا أو تسبب حلقة لا نهائية. طريقة الإزالة تعتمد على الحالة.

مثلًا، هذا التأثير يعتمد على كائن `options` يُعاد إنشاؤه في كل تعديل للحقل:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لا تريد إعادة الاتصال بالدردشة في كل بدء كتابة رسالة. لإصلاح المشكلة، انقل إنشاء كائن `options` داخل التأثير ليعتمد التأثير فقط على السلسلة `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لاحظ أنك لم تبدأ بتعديل قائمة التبعيات لإزالة `options`. ذلك خطأ. بدلًا من ذلك، غيّرت الكود المحيط حتى أصبحت التبعية *غير ضرورية.* اعتبر قائمة التبعيات قائمة بكل القيم التفاعلية التي يستخدمها كود التأثير. لا تختار عمدًا ما تضعه. القائمة تصف كودك. لتغيير قائمة التبعيات، غيّر الكود.

<LearnMore path="/learn/removing-effect-dependencies">

اقرأ **[إزالة تبعيات التأثير](/learn/removing-effect-dependencies)** لتتعلم كيف تجعل التأثير يعيد التشغيل أقل.

</LearnMore>

## إعادة استخدام المنطق بخطافات مخصصة {/*reusing-logic-with-custom-hooks*/}

يأتي React بخطافات مدمجة مثل `useState`، و`useContext`، و`useEffect`. أحيانًا تتمنى وجود Hook لغرض أدق: جلب بيانات، تتبع اتصال المستخدم، أو الاتصال بغرفة دردشة. لذلك يمكنك إنشاء خطافاتك الخاصة لاحتياجات تطبيقك.

في هذا المثال، الخطاف المخصص `usePointerPosition` يتتبع موضع المؤشر، بينما `useDelayedValue` يعيد قيمة «متأخرة» عن القيمة الممرّرة بعد عدد معين من الميلي ثانية. حرّك المؤشر فوق معاينة الـ sandbox لترى أثرًا من نقاط يتبع المؤشر:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
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

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

يمكنك إنشاء خطافات مخصصة، دمجها، تمرير البيانات بينها، وإعادة استخدامها بين المكوّنات. مع نمو التطبيق، تكتب تأثيرات يدوية أقل لأنك تعيد استخدام الخطافات التي كتبتها. وهناك أيضًا خطافات ممتازة يحافظ عليها مجتمع React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

اقرأ **[إعادة استخدام المنطق بخطافات مخصصة](/learn/reusing-logic-with-custom-hooks)** لتتعلم مشاركة المنطق بين المكوّنات.

</LearnMore>

## ماذا بعد؟ {/*whats-next*/}

انتقل إلى [الإشارة إلى قيم باستخدام المراجع](/learn/referencing-values-with-refs) لتبدأ قراءة هذا الفصل صفحة بصفحة!

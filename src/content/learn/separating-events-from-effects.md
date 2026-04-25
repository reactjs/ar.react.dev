---
title: 'فصل الأحداث عن التأثيرات'
---

<Intro>

تُعاد معالجات الأحداث فقط عند تكرار نفس التفاعل. على عكسها، تُعاد مزامنة التأثيرات (Effects) إن اختلفت قيمة قرأها التأثير—خاصية أو حالة—عما كانت عليه في التصيير السابق. أحيانًا تريد مزيجًا من السلوكين: Effect يُعاد تشغيله لبعض القيم دون غيرها. تشرح هذه الصفحة كيف تفعل ذلك.

</Intro>

<YouWillLearn>

- كيف تختار بين معالج حدث وEffect
- لماذا التأثيرات تفاعلية ومعالجات الأحداث لا
- ماذا تفعل عندما تريد جزءًا من كود Effect غير تفاعلي
- ما «أحداث التأثير» Effect Events، وكيف تستخرجها من Effects
- كيف تقرأ أحدث الخصائص والحالة من Effects باستخدام Effect Events

</YouWillLearn>

## الاختيار بين معالجات الأحداث والتأثيرات {/*choosing-between-event-handlers-and-effects*/}

لنلخص أولًا الفرق بين معالجات الأحداث والتأثيرات.

تخيّل تنفيذ مكوّن غرفة دردشة. المتطلبات:

1. يتصل المكوّن تلقائيًا بغرفة الدردشة المختارة.
1. عند النقر على «Send» يُرسل رسالة إلى الدردشة.

لنفترض أنك نفّذت الكود لكنك غير متأكد أين يوضع. معالجات أحداث أم Effects؟ في كل مرة، فكّر في [*لماذا* يجب أن يعمل الكود.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### معالجات الأحداث تعمل استجابة لتفاعلات محددة {/*event-handlers-run-in-response-to-specific-interactions*/}

من منظور المستخدم، إرسال الرسالة يجب أن يحدث *لأن* زر «Send» نُقر تحديدًا. سيغضب المستخدم إن أُرسلت رسالته في وقت آخر أو لسبب آخر. لذلك الإرسال يكون في معالج حدث. معالجات الأحداث تتعامل مع تفاعلات محددة:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

بمعالج حدث، تتأكد أن `sendMessage(message)` يعمل *فقط* إن ضغط المستخدم الزر.

### التأثيرات تعمل عند الحاجة للمزامنة {/*effects-run-whenever-synchronization-is-needed*/}

تذكّر أنك تحتاج إبقاء المكوّن متصلًا بغرفة الدردشة. أين يوضع هذا الكود؟

*سبب* تشغيل هذا الكود ليس تفاعلًا معيّنًا. لا يهم كيف وصل المستخدم لشاشة الدردشة. الآن وهو ينظر إليها وقد يتفاعل، يجب أن يبقى الاتصال بخادم الغرفة المختارة. حتى لو كانت شاشة البداية ولم يفعل المستخدم شيئًا، ما زلت *تحتاج* الاتصال. لذلك هو Effect:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

بهذا الكود، يوجد دائمًا اتصال نشط بالخادم الحالي *بغض النظر* عن التفاعلات. سواء فتح التطبيق فقط أو غيّر الغرفة أو تنقّل ثم عاد، يضمن Effect أن المكوّن *يبقى متزامنًا* مع الغرفة المختارة و[يعيد الاتصال عند الحاجة.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## قيم تفاعلية ومنطق تفاعلي {/*reactive-values-and-reactive-logic*/}

حدسيًا، معالجات الأحداث تُطلق «يدويًا» مثلاً بالنقر. التأثيرات «تلقائية»: تعمل وتُعاد عند الحاجة للمزامنة.

تصور أدق:

الخصائص والحالة والمتغيرات داخل جسم المكوّن تُسمى <CodeStep step={2}>قيمًا تفاعلية</CodeStep>. في المثال، `serverUrl` ليست تفاعلية، بينما `roomId` و`message` كذلك. تشارك في تدفق بيانات التصيير:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

قد تتغيّر القيم التفاعلية بإعادة التصيير. المستخدم قد يحرّر `message` أو يختار `roomId` آخر. تستجيب معالجات الأحداث والتأثيرات بشكل مختلف:

- **المنطق داخل معالجات الأحداث *غير تفاعلي.*** لا يُعاد إلا إن كرّر المستخدم نفس التفاعل (نقرًا مثلاً). يمكنها قراءة قيم تفاعلية دون «التفاعل» بتغيّرها.
- **المنطق داخل Effects *تفاعلي.*** إن قرأ Effect قيمة تفاعلية، [يجب إدراجها كتبعية.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) فإن تغيّرت بإعادة تصيير، يُعاد تشغيل منطق Effect بالقيمة الجديدة.

لنعُد للمثال السابق.

### المنطق داخل معالجات الأحداث غير تفاعلي {/*logic-inside-event-handlers-is-not-reactive*/}

انظر لهذا السطر. هل يجب أن يكون المنطق تفاعليًا؟

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

من منظور المستخدم، **تغيّر `message` لا يعني أنه يريد إرسال رسالة.** يعني أنه يكتب. أي منطق الإرسال لا يجب أن يكون تفاعليًا. لا يُعاد فقط لأن <CodeStep step={2}>قيمة تفاعلية</CodeStep> تغيّرت. لذلك يوضع في معالج الحدث:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

معالجات الأحداث غير تفاعلية، فيعمل `sendMessage(message)` فقط عند النقر على Send.

### المنطق داخل Effects تفاعلي {/*logic-inside-effects-is-reactive*/}

لنعُد لهذه الأسطر:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

من منظور المستخدم، **تغيّر `roomId` يعني أنه يريد الاتصال بغرفة أخرى.** أي منطق الاتصال يجب أن يكون تفاعليًا. *تريد* أن «تلحق» هذه الأسطر بـ <CodeStep step={2}>القيمة التفاعلية</CodeStep> وتُعاد إن اختلفت. لذلك في Effect:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

التأثيرات تفاعلية، فيُشغَّل `createConnection(serverUrl, roomId)` و`connection.connect()` لكل قيمة مميزة لـ `roomId`. يبقي Effect اتصال الدردشة متزامنًا مع الغرفة المختارة.

## استخراج منطق غير تفاعلي من Effects {/*extracting-non-reactive-logic-out-of-effects*/}

يصعب الأمر عند خلط منطق تفاعلي وغير تفاعلي.

مثلاً، تريد إشعارًا عند الاتصال بالدردشة. تقرأ السمة الحالية (داكن/فاتح) لعرض الإشعار باللون المناسب:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

لكن `theme` قيمة تفاعلية (قد تتغيّر بإعادة التصيير)، و[كل قيمة تفاعلية يقرأها Effect يجب أن تكون تبعية.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) فيجب إدراج `theme` في تبعيات Effect:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

جرّب المثال ولاحظ مشكلة تجربة المستخدم:

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

عند تغيّر `roomId`، يُعاد الاتصال كما تتوقع. لكن بما أن `theme` تبعية أيضًا، يُعاد الاتصال *أيضًا* عند التبديل بين الوضعين الداكن والفاتح. وهذا غير مرغوب!

بمعنى آخر، لا *تريد* أن يكون هذا السطر تفاعليًا رغم أنه داخل Effect تفاعلي:

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

تحتاج طريقة لفصل هذا المنطق غير التفاعلي عن Effect التفاعلي حوله.

### إعلان حدث تأثير Effect Event {/*declaring-an-effect-event*/}

استخدم Hook خاصًا [`useEffectEvent`](/reference/react/useEffectEvent) لاستخراج المنطق غير التفاعلي:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

هنا، يُسمى `onConnected` *حدث تأثير (Effect Event).* جزء من منطق Effect لكنه يشبه معالج حدث. المنطق داخله غير تفاعلي، ويرى دائمًا أحدث الخصائص والحالة.

يمكنك الآن استدعاء `onConnected` من داخل Effect:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

هذا يحل المشكلة. لاحظ أنك *أزلت* `theme` من التبعيات لأنها لم تعد تُستخدم داخل Effect. ولا تحتاج *إضافة* `onConnected`، لأن **أحداث التأثير غير تفاعلية ويجب حذفها من التبعيات.**

تحقق أن السلوك الجديد كما تتوقع:

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

أحداث التأثير تشبه معالجات الأحداث. الفرق أن معالجات الأحداث تستجيب لتفاعل المستخدم، بينما تُستدعى أحداث التأثير منك من داخل Effects. تسمح لك بـ «قطع السلسلة» بين تفاعلية Effects وكود لا يجب أن يكون تفاعليًا.

### قراءة أحدث الخصائص والحالة بأحداث التأثير {/*reading-latest-props-and-state-with-effect-events*/}

تصلح أحداث التأثير أنماطًا كثيرة قد يغريك فيها كتم مُدقق التبعيات.

مثلاً، Effect لتسجيل زيارات الصفحة:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

لاحقًا تضيف مسارات متعددة. يستقبل `Page` خاصية `url` للمسار الحالي. تريد تمريرها إلى `logVisit`، فيشتكي مُدقق التبعيات:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

فكّر ماذا تريد. *تريد* تسجيل زيارة منفصلة لكل URL لأن كل عنوان يمثل صفحة مختلفة. أي استدعاء `logVisit` *يجب* أن يكون تفاعليًا مع `url`. لذلك يُنصح باتباع المُدقق وإضافة `url`:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

لنفترض أنك تريد إدراج عدد عناصر سلة التسوق مع كل زيارة:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

استخدمت `numberOfItems` داخل Effect، فيطلب المُدقق إضافتها. لكنك *لا تريد* أن يكون `logVisit` تفاعليًا مع `numberOfItems`. إن أضاف المستخدم شيئًا للسلة وتغيّر العدد، هذا *لا يعني* زيارة جديدة للصفحة. *زيارة الصفحة* بمعنى ما «حدث» في لحظة محددة.

اقسم الكود إلى جزأين:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

هنا `onVisit` حدث تأثير. الكود داخله غير تفاعلي، فيمكنك استخدام `numberOfItems` (أو أي قيمة تفاعلية!) دون خوف من إعادة تنفيذ المحيط عند تغيّرها.

من ناحية أخرى، Effect نفسه يبقى تفاعليًا. يستخدم `url`، فيُعاد بعد كل تصيير بـ `url` مختلفة، فيستدعي `onVisit`.

النتيجة: تستدعي `logVisit` عند كل تغيّر لـ `url`، وتقرأ دائمًا أحدث `numberOfItems`. لكن تغيّر `numberOfItems` وحده لا يُعيد تشغيل الكود.

<Note>

قد تتساءل إن كان بإمكانك استدعاء `onVisit()` بلا وسائط وقراءة `url` داخله:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

سيعمل، لكن الأفضل تمرير `url` صراحة لحدث التأثير. **بتمرير `url` كوسيط، تقول إن زيارة عنوان مختلف «حدث» منفصل من منظور المستخدم.** `visitedUrl` جزء من ذلك «الحدث»:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

بما أن حدث التأثير يطلب `visitedUrl` صراحة، لا يمكنك حذف `url` من التبعيات دون قصد. إن حذفتها (فُسِرَت زيارات متعددة كواحدة)، يُنذرك المُدقق. تريد `onVisit` تفاعليًا مع `url`، فتمرّرها *من* Effect بدل قراءتها داخل الحدث حيث لا تكون تفاعلية.

يصبح ذلك أهم عند وجود منطق غير متزامن داخل Effect:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

هنا `url` داخل `onVisit` هي *أحدث* `url` (قد تكون تغيّرت)، بينما `visitedUrl` هي `url` التي أطلقت Effect (وهذا الاستدعاء) أصلًا.

</Note>

<DeepDive>

#### هل يجوز كتم مُدقق التبعيات بدلًا من ذلك؟ {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

في قواعد كود قديمة، قد ترى كتم القاعدة هكذا:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

ننصح **بعدم كتم المُدقق أبدًا**.

أول عيوب الكتم أن React لن يُنذرك عندما يحتاج Effect للتفاعل مع تبعية جديدة أضفتها. في المثال السابق أضفت `url` *لأن* React ذكّرك. لن تحصل على تذكيرات لمستقبل التعديلات على ذلك Effect. هذا يؤدي لأخطاء.

إليك خللًا محيرًا بسبب الكتم. `handleMove` يفترض أن يقرأ `canMove` الحالية ليقرر إن تحركت النقطة مع المؤشر. لكن `canMove` داخل `handleMove` دائمًا `true`.

هل ترى السبب؟

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


المشكلة في كتم مُدقق التبعيات. إن أزلت الكتم، سترى أن Effect يجب أن يعتمد على `handleMove`. منطقي: `handleMove` داخل جسم المكوّن، أي قيمة تفاعلية. كل قيمة تفاعلية يجب أن تكون تبعية وإلا قد تصبح قديمة!

صاحب الكود «كذب» على React بأن Effect لا يعتمد (`[]`) على شيء. لذلك لم يُعاد مزامنة Effect بعد تغيّر `canMove` (ومعه `handleMove`). فالمستمع المرفوع هو `handleMove` من التصيير الأول حيث `canMove` كانت `true`، فيبقى يرى ذلك للأبد.

**إن لم تكتم المُدقق، لن تواجه قيمًا قديمة بنفس الطريقة.**

مع `useEffectEvent` لا حاجة لـ «الكذب» على المُدقق، والكود يعمل كما تتوقع:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

هذا لا يعني أن `useEffectEvent` *دائمًا* الحل الصحيح. طبّقه فقط على الأسطر التي لا تريدها تفاعلية. في الصندوق أعلاه، لم ترد تفاعلية Effect مع `canMove`، فاستخراج حدث تأثير منطقي.

اقرأ [إزالة تبعيات التأثير](/learn/removing-effect-dependencies) لبدائل صحيحة أخرى عن الكتم.

</DeepDive>

### قيود أحداث التأثير {/*limitations-of-effect-events*/}

استخدام أحداث التأثير محدود جدًا:

* **استدعها فقط من داخل Effects.**
* **لا تمرّرها إلى مكوّنات أو Hooks أخرى.**

مثلاً لا تفعل:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

بدلًا من ذلك، عرّف أحداث التأثير بجانب Effects التي تستخدمها مباشرة:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

أحداث التأثير قطع غير تفاعلية من كود Effect. يجب أن تكون بجانب Effect الذي يستخدمها.

<Recap>

- معالجات الأحداث تعمل استجابة لتفاعلات محددة.
- التأثيرات تعمل عند الحاجة للمزامنة.
- المنطق داخل معالجات الأحداث غير تفاعلي.
- المنطق داخل Effects تفاعلي.
- يمكنك نقل منطق غير تفاعلي من Effects إلى أحداث تأثير.
- استدعِ أحداث التأثير فقط من داخل Effects.
- لا تمرّر أحداث التأثير إلى مكوّنات أو Hooks أخرى.

</Recap>

<Challenges>

#### أصلح متغيرًا لا يتحدّث {/*fix-a-variable-that-doesnt-update*/}

يحتفظ `Timer` بحالة `count` تزيد كل ثانية. مقدار الزيادة في `increment`، تتحكم به أزرار + و−.

لكن مهما ضغطت +، يزيد العداد بواحد كل ثانية. ما الخطأ؟ لماذا `increment` تساوي `1` داخل Effect؟ أصلح ذلك.

<Hint>

اتبع القواعد.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

كالعادة عند أخطاء Effects، ابحث عن كتم المُدقق.

إن أزلت التعليق، يخبرك React أن Effect يعتمد على `increment` بينما زعمت عدم التبعية (`[]`). أضف `increment` إلى مصفوفة التبعيات:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

الآن عند تغيّر `increment`، يُعاد مزامنة Effect ويُعاد ضبط الفاصل.

</Solution>

#### أصلح عدّادًا يتجمّد {/*fix-a-freezing-counter*/}

يحتفظ `Timer` بـ `count` يزيد كل ثانية، والزيادة في `increment` تتحكم بها الأزرار. جرّب الضغط على + تسع مرات ولاحظ أن `count` يزيد بعشرة كل ثانية لا بواحدة.

هناك مشكلة في الواجهة: إن ضغطت + أو − أسرع من مرة في الثانية، يبدو أن المؤقت يتوقف ولا يستأنف إلا بعد ثانية من آخر ضغطة. اكتشف السبب وأصلحه ليحدّث كل ثانية دون انقطاع.

<Hint>

يبدو أن Effect إعداد المؤقت «يتفاعل» مع `increment`. هل السطر الذي يستخدم `increment` لاستدعاء `setCount` يحتاج فعلًا أن يكون تفاعليًا؟

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

المشكلة أن Effect يستخدم `increment`. وبما أنها تبعية، كل تغيّر لها يُعيد مزامنة Effect ويمسح الفاصل. إن مسحت الفاصل قبل أن يُطلق، يبدو المؤقت متجمّدًا.

الحل: استخرج `onTick` كحدث تأثير من Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

بما أن `onTick` حدث تأثير، فالكود داخله غير تفاعلي. تغيّر `increment` لا يُطلق Effects.

</Solution>

#### أصلح تأخيرًا غير قابل للضبط {/*fix-a-non-adjustable-delay*/}

يمكنك تخصيص تأخير الفاصل في `delay` بزرّين. لكن حتى إن ضغطت «+100 ms» حتى تصبح `delay` 1000 ms، يبقى العداد سريعًا (كل 100 ms) كأن `delay` تُتجاهل. أصلح الخلل.

<Hint>

الكود داخل أحداث التأثير غير تفاعلي. هل تريد أحيانًا إعادة تشغيل `setInterval`؟

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

المشكلة أنه استُخرج Effect Event باسم `onMount` دون أن يعكس الغرض. استخرج أحداث التأثير فقط عندما تريد جزءًا غير تفاعلي. أما `setInterval` ف*يجب* أن تتفاعل مع `delay`؛ عند تغيّرها تُعاد إعداد الفاصل من الصفر! أعد الكود التفاعلي داخل Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

بشكل عام، احذر الدوال مثل `onMount` التي تركز على *التوقيت* لا *الغرض*. قد تبدو أوضح لكنها تخفي النية. قاعدة: سمّ أحداث التأثير بما يحدث من منظور *المستخدم*، مثل `onMessage` أو `onTick` أو `onVisit` أو `onConnected`. أما `onMount` و`onUpdate` و`onUnmount` و`onAfterRender` فعامة جدًا فيسهل وضع كود *يجب* أن يكون تفاعليًا فيها. سمِّ الحدث بما *يعتقد المستخدم أنه حدث* لا بمتى شغّل الكود.

</Solution>

#### أصلح إشعارًا مؤجّلًا {/*fix-a-delayed-notification*/}

عند الانضمام لغرفة، يظهر إشعار لكن ليس فورًا—مؤجّل ثانيتين ليتفرّغ المستخدم في الواجهة.

يعمل تقريبًا لكن فيه خلل. بدّل القائمة من general إلى travel ثم music بسرعة؛ قد ترى إشعارين لكن كلاهما «Welcome to music».

أصلحه ليظهر الأول عن travel والثاني عن music. (تحدي إضافي: بعد إصلاح النصوص، اجعل الإشعار الأخير فقط يظهر.)

<Hint>

Effect يعرف أي غرفة اتصل بها. ما المعلومة التي قد تمرّرها لحدث التأثير؟

</Hint>

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
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

داخل حدث التأثير، `roomId` هي القيمة *عند استدعاء الحدث.*

يُستدعى الحدث بعد ثانيتين. إن انتقلت بسرعة من travel إلى music، بحلول وقت ظهور إشعار travel يكون `roomId` قد أصبح `"music"`. لذلك يظهران «Welcome to music».

للإصلاح، لا تقرأ *أحدث* `roomId` داخل الحدث؛ اجعلها وسيطًا مثل `connectedRoomId` أدناه، ومرّر `roomId` من Effect بـ `onConnected(roomId)`:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

Effect الذي كان `roomId` فيه `"travel"` يعرض إشعار travel، والذي كان `"music"` يعرض music. أي `connectedRoomId` من Effect (تفاعلي)، بينما `theme` تبقى أحدث قيمة.

للتحدي الإضافي، خزّن معرف `setTimeout` للإشعار وامسحه في تنظيف Effect:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
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

هذا يلغي الإشعارات المجدولة ولم تُعرض بعد عند تغيّر الغرفة.

</Solution>

</Challenges>

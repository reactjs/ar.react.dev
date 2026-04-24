---
title: دورة حياة التأثيرات التفاعلية
---

<Intro>

للتأثيرات دورة حياة تختلف عن دورة حياة المكوّنات. قد يُثبَّت المكوّن أو يُحدَّث أو يُزال من الشاشة. أما التأثير فيستطيع فعل شيئين فقط: بدء مزامنة شيء ما، ثم إيقاف مزامنته لاحقاً. وقد تتكرر هذه الدورة عدة مرات إذا كان تأثيرك يعتمد على خصائص وحالة تتغير مع الزمن. يوفّر React قاعدة للمُدقِّق للتحقق من أنك حدّدت تبعيات التأثير بشكل صحيح. وهذا يبقي تأثيرك متزامناً مع أحدث الخصائص والحالة.

</Intro>

<YouWillLearn>

- كيف تختلف دورة حياة التأثير عن دورة حياة المكوّن
- كيف تفكر في كل تأثير على حدة
- متى يحتاج تأثيرك إلى إعادة المزامنة، ولماذا
- كيف تُحدَّد تبعيات تأثيرك
- ماذا يعني أن تكون القيمة تفاعلية
- ماذا تعني مصفوفة تبعيات فارغة
- كيف يتحقق React من صحة تبعياتك عبر المُدقِّق
- ماذا تفعل عندما لا توافق المُدقِّق

</YouWillLearn>

## دورة حياة التأثير {/*the-lifecycle-of-an-effect*/}

كل مكوّن React يمر بنفس دورة الحياة:

- يُثبَّت المكوّن (_mounts_) عند إضافته إلى الشاشة.
- يُحدَّث المكوّن (_updates_) عند استلام خصائص أو حالة جديدة، غالباً استجابةً لتفاعل.
- يُزال المكوّن (_unmounts_) عند حذفه من الشاشة.

**هذا تفكير جيّد للمكوّنات، لكن _ليس_ للتأثيرات.** بدلاً من ذلك، حاول أن تفكر في كل تأثير بمعزلٍ عن دورة حياة المكوّن. يصف التأثير كيفية [مزامنة نظام خارجي](/learn/synchronizing-with-effects) مع الخصائص والحالة الحالية. ومع تغيّر الشيفرة، قد تحتاج المزامنة إلى أن تحدث أكثر أو أقل تكراراً.

لتوضيح الفكرة، انظر إلى هذا التأثير الذي يصل مكوّنك بخادم محادثة:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

يحدّد جسم تأثيرك كيفية **بدء المزامنة:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

تحدّد دالة التنظيف التي يعيدها تأثيرك كيفية **إيقاف المزامنة:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

قد يخطر ببالك أن React **يبدأ المزامنة** عند تثبيت المكوّن و**يوقف المزامنة** عند إزالته. لكن القصة لا تنتهي هنا! أحياناً قد يلزم **بدء المزامنة وإيقافها أكثر من مرة** بينما يبقى المكوّن مثبتاً.

لننظر _لماذا_ يلزم ذلك، _متى_ يحدث، و _كيف_ تتحكم في هذا السلوك.

<Note>

بعض التأثيرات لا تعيد دالة تنظيف أصلاً. [في الغالب](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) سترغب بإرجاع واحدة—لكن إن لم تفعل، سيتصرّف React كما لو أنك أعدت دالة تنظيف فارغة.

</Note>

### لماذا قد تحتاج المزامنة إلى أن تحدث أكثر من مرة {/*why-synchronization-may-need-to-happen-more-than-once*/}

تخيّل أن مكوّن `ChatRoom` يستلم خاصية `roomId` يختارها المستخدم من قائمة منسدلة. لنقل أن المستخدم يختار في البداية غرفة `"general"` كـ`roomId`. يعرض تطبيقك غرفة المحادثة `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

بعد عرض الواجهة، يشغّل React تأثيرك لـ**بدء المزامنة.** يتصل بغرفة `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

حتى هنا الأمور طيبة.

لاحقاً، يختار المستخدم غرفة أخرى من القائمة المنسدلة (مثلاً `"travel"`). أولاً، يحدّث React الواجهة:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

فكّر فيما ينبغي أن يحدث بعد ذلك. يرى المستخدم أن `"travel"` هي غرفة المحادثة المختارة في الواجهة. لكن التأثير الذي نفّذ آخر مرة ما زال متصلاً بغرفة `"general"`. **تغيّرت خاصية `roomId`، فما فعله تأثيرك حينها (الاتصال بغرفة `"general"`) لم يعد يطابق الواجهة.**

عند هذه النقطة، تريد من React أن يفعل أمرين:

1. إيقاف المزامنة مع `roomId` القديم (قطع الاتصال عن غرفة `"general"`)
2. بدء المزامنة مع `roomId` الجديد (الاتصال بغرفة `"travel"`)

**لحسن الحظ، لقد علّمت React مسبقاً كيف يفعل هذين الأمرين!** جسم تأثيرك يحدّد كيف تبدأ المزامنة، ودالة التنظيف تحدّد كيف تتوقف. كل ما يحتاجه React الآن هو استدعاؤهما بالترتيب الصحيح وبالخصائص والحالة الصحيحة. لنرَ كيف يحدث ذلك بالضبط.

### كيف يعيد React مزامنة تأثيرك {/*how-react-re-synchronizes-your-effect*/}

تذكّر أن مكوّن `ChatRoom` استلم قيمة جديدة لخاصية `roomId`. كانت `"general"`، وأصبحت `"travel"`. يحتاج React إلى إعادة مزامنة تأثيرك ليعيد توصيلك بغرفة مختلفة.

لـ**إيقاف المزامنة،** يستدعي React دالة التنظيف التي أعادها تأثيرك بعد الاتصال بغرفة `"general"`. وبما أن `roomId` كان `"general"`، تقطع دالة التنظيف الاتصال عن غرفة `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

ثم يشغّل React التأثير الذي زوّدته به أثناء هذا التصيير. هذه المرة `roomId` هو `"travel"` فيبدأ **مزامنة** غرفة المحادثة `"travel"` (حتى تُستدعى دالة التنظيف لاحقاً أيضاً):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

بفضل ذلك، أصبحت متصلاً بنفس الغرفة التي اختارها المستخدم في الواجهة. كُفّت الخسارة!

في كل مرة يُعاد فيها تصيير مكوّنك بـ`roomId` مختلف، يعيد تأثيرك المزامنة. مثلاً، لنقل غيّر المستخدم `roomId` من `"travel"` إلى `"music"`. سيعيد React **إيقاف مزامنة** تأثيرك باستدعاء دالة التنظيف (قطع الاتصال عن غرفة `"travel"`). ثم **يبدأ المزامنة** من جديد بتشغيل جسم التأثير مع خاصية `roomId` الجديدة (توصيلك بغرفة `"music"`).

أخيراً، عندما ينتقل المستخدم إلى شاشة أخرى، تُزال `ChatRoom` من الشجرة. لم يعد هناك داعٍ للبقاء متصلاً. سيعيد React **إيقاف مزامنة** تأثيرك مرة أخيرة ويقطع اتصالك عن غرفة المحادثة `"music"`.

### التفكير من منظور التأثير {/*thinking-from-the-effects-perspective*/}

لنلخص ما حدث من منظور مكوّن `ChatRoom`:

1. ثُبّتت `ChatRoom` و`roomId` يساوي `"general"`
1. حُدّثت `ChatRoom` و`roomId` يساوي `"travel"`
1. حُدّثت `ChatRoom` و`roomId` يساوي `"music"`
1. أُزيلت `ChatRoom` من الشجرة

خلال كل نقطة من دورة حياة المكوّن، فعل تأثيرك أشياء مختلفة:

1. اتصل تأثيرك بغرفة `"general"`
1. قطع تأثيرك الاتصال عن `"general"` واتصل بـ`"travel"`
1. قطع تأثيرك الاتصال عن `"travel"` واتصل بـ`"music"`
1. قطع تأثيرك الاتصال عن `"music"`

الآن فكّر فيما حدث من منظور التأثير نفسه:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

قد يدفعك هيكل هذه الشيفرة إلى رؤية ما حدث كتسلسل فترات زمنية غير متداخلة:

1. اتصل تأثيرك بغرفة `"general"` (حتى انقطع)
1. اتصل تأثيرك بغرفة `"travel"` (حتى انقطع)
1. اتصل تأثيرك بغرفة `"music"` (حتى انقطع)

سابقاً كنت تفكر من منظور المكوّن. من منظور المكوّن، كان من المغري اعتبار التأثيرات «استدعاءات راجعة» أو «أحداث دورة حياة» تُطلق في وقت محدد مثل «بعد تصيير» أو «قبل الإزالة». هذا النمط من التفكير يتعقّد بسرعة، فمن الأفضل تجنّبه.

**بدلاً من ذلك، ركّز دائماً على دورة بدء/إيقاف واحدة في كل مرة. لا يهم ما إذا كان المكوّن يُثبَّت أو يُحدَّث أو يُزال. كل ما تحتاجه هو أن تصف كيف تبدأ المزامنة وكيف تتوقف. إن فعلت ذلك جيداً، سيكون تأثيرك قادراً على أن يُشغَّل ويُوقَف كما يلزم من مرات.**

قد يذكّرك هذا بعدم تفكيرك في تثبيت المكوّن أو تحديثه عندما تكتب منطق التصيير الذي ينتج JSX. تصف ما ينبغي أن يظهر على الشاشة، وReact [يتولى الباقي.](/learn/reacting-to-input-with-state)

### كيف يتحقق React من أن تأثيرك يستطيع إعادة المزامنة {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

إليك مثالاً حيّاً يمكنك تجربته. اضغط «Open chat» لتثبيت مكوّن `ChatRoom`:

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

لاحظ أنه عند تثبيت المكوّن لأول مرة، ترى ثلاث رسائل سجل:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(للبيئة التطويرية فقط)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(للبيئة التطويرية فقط)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

السجلّان الأولان للبيئة التطويرية فقط. في التطوير، يعيد React تثبيت كل مكوّن مرة واحدة دائماً.

**يتحقق React من أن تأثيرك يستطيع إعادة المزامنة بإجباره على فعل ذلك فوراً في التطوير.** قد يذكّرك هذا بفتح باب وإغلاقه مرة إضافية للتأكد من أن القفل يعمل. يبدأ React ويوقف تأثيرك مرة إضافية في التطوير للتحقق من أنك [نفّذت التنظيف جيداً.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

السبب الرئيسي لإعادة مزامنة تأثيرك عملياً هو تغيّر بعض البيانات التي يستخدمها. في الـsandbox أعلاه، غيّر غرفة المحادثة المختارة. لاحظ كيف أنه عند تغيّر `roomId` يعيد تأثيرك المزامنة.

هناك أيضاً حالات أندر تلزم فيها إعادة المزامنة. مثلاً، جرّب تعديل `serverUrl` في الـsandbox أعلاه مع فتح المحادثة. لاحظ كيف يعيد التأثير المزامنة استجابةً لتعديلاتك على الشيفرة. في المستقبل، قد يضيف React مزايا أخرى تعتمد على إعادة المزامنة.

### كيف يعلم React أنه يجب إعادة مزامنة التأثير {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

قد تتساءل كيف علم React أن تأثيرك يحتاج إلى إعادة المزامنة بعد تغيّر `roomId`. ذلك لأنك *أخبرت React* أن شيفرته تعتمد على `roomId` بإدراجه في [قائمة التبعيات:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

إليك كيف يعمل هذا:

1. علمت أن `roomId` خاصية، أي أنها قد تتغير مع الزمن.
2. علمت أن تأثيرك يقرأ `roomId` (فمنطقه يعتمد على قيمة قد تتغير لاحقاً).
3. لذلك حدّدتها كتبعية لتأثيرك (حتى يعيد المزامنة عند تغيّر `roomId`).

في كل مرة يُعاد فيها تصيير مكوّنك، ينظر React إلى مصفوفة التبعيات التي مررتها. إذا اختلفت أي قيمة في المصفوفة عن القيمة في الموضع نفسه من التصيير السابق، يعيد React مزامنة تأثيرك.

مثلاً، إن مررت `["general"]` في التصيير الأول، ثم مررت `["travel"]` في التصيير التالي، يقارن React بين `"general"` و`"travel"`. هاتان قيمتان مختلفتان (بالمقارنة بـ[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))، فيعيد مزامنة تأثيرك. أما إن أُعيد تصيير المكوّن دون أن يتغيّر `roomId`، يبقى تأثيرك متصلاً بنفس الغرفة.

### كل تأثير يمثل عملية مزامنة منفصلة {/*each-effect-represents-a-separate-synchronization-process*/}

تجنّب إضافة منطق غير مرتبط بتأثيرك فقط لأنه يجب أن يعمل في نفس وقت تأثير كتبته مسبقاً. مثلاً، لنقل تريد إرسال حدث تحليلات عند زيارة المستخدم للغرفة. لديك تأثير يعتمد على `roomId`، فيغريك ذلك بإضافة استدعاء التحليلات هناك:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

لكن تخيّل أنك تضيف لاحقاً تبعية أخرى لهذا التأثير تحتاج إلى إعادة إنشاء الاتصال. إذا أعاد التأثير المزامنة، سيستدعي أيضاً `logVisit(roomId)` لنفس الغرفة، وهذا لم ترده. تسجيل الزيارة **عملية منفصلة** عن الاتصال. اكتبهما كتأثيرين منفصلين:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**يجب أن يمثل كل تأثير في شيفرتك عملية مزامنة منفصلة ومستقلة.**

في المثال أعلاه، حذف أحد التأثيرين لا يكسر منطق الآخر. هذا مؤشر جيد على أنهما يزامنان أشياء مختلفة، فكان من المنطقي فصلهما. أما إن قسّمت قطعة منطق متماسكة إلى تأثيرات منفصلة، قد تبدو الشيفرة «أنظف» لكنها تصبح [أصعب صيانة.](/learn/you-might-not-need-an-effect#chains-of-computations) لذلك فكّر هل العمليات واحدة أم منفصلة، لا هل الشيفرة تبدو أنظف.

## التأثيرات «تتفاعل» مع القيم التفاعلية {/*effects-react-to-reactive-values*/}

يقرأ تأثيرك متغيرين (`serverUrl` و`roomId`)، لكنك حدّدت `roomId` فقط كتبعية:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

لماذا لا تحتاج `serverUrl` إلى أن تكون تبعية؟

لأن `serverUrl` لا يتغير بسبب إعادة التصيير. يبقى نفسه مهما أُعيد تصيير المكوّن. وبما أنه لا يتغير، لا معنى لجعله تبعية. فالتبعيات تنفع فقط عندما تتغير مع الزمن!

أما `roomId` فقد يختلف عند إعادة التصيير. **الخصائص والحالة والقيم الأخرى المعرّفة داخل المكوّن _تفاعلية_ لأنها تُحسب أثناء التصيير وتشارك في تدفق بيانات React.**

لو كان `serverUrl` متغير حالة، لكان تفاعلياً. يجب تضمين القيم التفاعلية في التبعيات:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}
```

بتضمين `serverUrl` كتبعية، تضمن أن التأثير يعيد المزامنة بعد تغيّره.

جرّب تغيير غرفة المحادثة المختارة أو تعديل عنوان الخادم في هذا الـsandbox:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

كلما غيّرت قيمة تفاعلية مثل `roomId` أو `serverUrl`، يعيد التأثير الاتصال بخادم المحادثة.

### ماذا يعني تأثير بتبعيات فارغة {/*what-an-effect-with-empty-dependencies-means*/}

ماذا يحدث إن نقلت `serverUrl` و`roomId` كليهما خارج المكوّن؟

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

شيفرة تأثيرك لا تستخدم الآن *أي* قيم تفاعلية، فيمكن أن تكون تبعياته فارغة (`[]`).

من منظور المكوّن، مصفوفة التبعيات الفارغة `[]` تعني أن هذا التأثير يتصل بغرفة المحادثة عند تثبيت المكوّن فقط، وينقطع عند إزالته فقط. (تذكّر أن React ما زال قد [يعيد مزامنته مرة إضافية](#how-react-verifies-that-your-effect-can-re-synchronize) في التطوير لاختبار منطقك تحت الضغط.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

لكن إن [فكّرت من منظور التأثير،](#thinking-from-the-effects-perspective) لا تحتاج إلى التفكير في التثبيت والإزالة أصلاً. المهم أنك حدّدت ماذا يفعل تأثيرك لبدء المزامنة وإيقافها. اليوم ليس له تبعيات تفاعلية. لكن إن أردت لاحقاً أن يغيّر المستخدم `roomId` أو `serverUrl` مع الزمن (فتصبحان تفاعليتين)، لن تتغيّر شيفرة التأثير. ستحتاج فقط إلى إضافتهما إلى التبعيات.

### كل المتغيرات المعرّفة في جسم المكوّن تفاعلية {/*all-variables-declared-in-the-component-body-are-reactive*/}

ليست الخصائص والحالة وحدهاما تفاعليتين. القيم التي تحسب منهما تفاعلية أيضاً. إذا تغيّرت الخصائص أو الحالة، يُعاد تصيير مكوّنك وتتغيّر القيم المحسوبة منهما. لذلك ينبغي أن تكون كل المتغيرات من جسم المكوّن التي يستخدمها التأثير في قائمة تبعيات التأثير.

لنقل يمكن للمستخدم اختيار خادم محادثة من القائمة المنسدلة، ويمكنه أيضاً ضبط خادم افتراضي في الإعدادات. لنقل وضعت حالة الإعدادات في [سياق](/learn/scaling-up-with-reducer-and-context) فتقرأ `settings` من ذلك السياق. الآن تحسب `serverUrl` من الخادم المختار في الخصائص والخادم الافتراضي:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

في هذا المثال، `serverUrl` ليست خاصية ولا متغير حالة. إنها متغير عادي تحسبه أثناء التصيير. وبما أنه يُحسب أثناء التصيير، قد يتغيّر بسبب إعادة التصيير. لذلك هو تفاعلي.

**كل القيم داخل المكوّن (بما فيها الخصائص والحالة والمتغيرات في جسم المكوّن) تفاعلية. أي قيمة تفاعلية قد تتغيّر عند إعادة التصيير، فيجب تضمين القيم التفاعلية كتبعيات للتأثير.**

بعبارة أخرى، التأثيرات «تتفاعل» مع كل القيم من جسم المكوّن.

<DeepDive>

#### هل يمكن أن تكون القيم العامة أو القابلة للتغيير تبعيات؟ {/*can-global-or-mutable-values-be-dependencies*/}

القيم القابلة للتغيير (بما فيها المتغيرات العامة) ليست تفاعلية.

**قيمة قابلة للتغيير مثل [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) لا يمكن أن تكون تبعية.** إنها قابلة للتغيير، فيمكن أن تتغيّر في أي وقت خارج تدفق تصيير React بالكامل. تغييرها لا يطلق إعادة تصييراً لمكوّنك. لذلك حتى لو حدّدتها في التبعيات، React *لن يعلم* أنه يجب إعادة مزامنة التأثير عند تغيّرها. هذا أيضاً يخالف قواعد React لأن قراءة بيانات قابلة للتغيير أثناء التصيير (حين تحسب التبعيات) تكسر [نقاء التصيير.](/learn/keeping-components-pure) بدلاً من ذلك، اقرأ واشترك في قيمة خارجية قابلة للتغيير بـ[`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**قيمة قابلة للتغيير مثل [`ref.current`](/reference/react/useRef#reference) أو ما تقرأه منه لا يمكن أن تكون تبعية أيضاً.** يمكن أن يكون كائن المرجع الذي يعيده `useRef` تبعية، لكن خاصية `current` قابلة للتغيير عن قصد. تسمح لك [بتتبع شيء دون إطلاق إعادة تصيير.](/learn/referencing-values-with-refs) لكن بما أن تغييرها لا يطلق إعادة تصيير، فهي ليست قيمة تفاعلية، ولن يعلم React أن يعيد تشغيل تأثيرك عند تغيّرها.

كما ستتعلم أدناه في هذه الصفحة، يتحقق المُدقِّق من هذه المسائل تلقائياً.

</DeepDive>

### React يتحقق من أنك حدّدت كل قيمة تفاعلية كتبعية {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

إذا كان المُدقِّق [مهيأ لـReact،](/learn/editor-setup#linting) يتحقق من أن كل قيمة تفاعلية تستخدمها شيفرة تأثيرك معلنة كتبعية له. مثلاً، هذا خطأ lint لأن `roomId` و`serverUrl` كليهما تفاعليتان:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

قد يبدو هذا كخطأ من React، لكنه في الحقيقة يشير إلى علة في شيفرتك. قد يتغيّر `roomId` و`serverUrl` مع الزمن، لكنك تنسى إعادة مزامنة تأثيرك عند تغيّرهما. ستبقى متصلاً بـ`roomId` و`serverUrl` الأوليين حتى بعد أن يختار المستخدم قيماً مختلفة في الواجهة.

لإصلاح العلة، اتبع اقتراح المُدقِّق بتحديد `roomId` و`serverUrl` كتبعيات لتأثيرك:

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

جرّب هذا الإصلاح في الـsandbox أعلاه. تحقق أن خطأ المُدقِّق اختفى، وأن المحادثة تعيد الاتصال عند الحاجة.

<Note>

في بعض الحالات، React *يعلم* أن قيمة لا تتغير أبداً رغم أنها معرّفة داخل المكوّن. مثلاً، [دالة `set`](/reference/react/useState#setstate) التي يعيدها `useState` وكائن المرجع الذي يعيده [`useRef`](/reference/react/useRef) *ثابتان*—مضمون أنهما لا يتغيّران عند إعادة التصيير. القيم الثابتة ليست تفاعلية، فيمكنك حذفها من القائمة. السماح بتضمينها مسموح: فهما لا يتغيّران، فلا فرق.

</Note>

### ماذا تفعل عندما لا تريد إعادة المزامنة {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

في المثال السابق، أصلحت خطأ lint بإدراج `roomId` و`serverUrl` كتبعيات.

**لكن يمكنك بدلاً من ذلك أن «تثبت» للمُدقِّق أن هذه القيم ليست تفاعلية،** أي أنها *لا يمكن* أن تتغيّر نتيجة إعادة تصيير. مثلاً، إن لم تعتمد `serverUrl` و`roomId` على التصيير وكان لهما دائماً نفس القيمتين، انقلهما خارج المكوّن. فلا يحتاجان إلى أن يكونا تبعيتين:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

يمكنك أيضاً نقلهما *داخل التأثير.* لا يُحسبان أثناء التصيير، فليسا تفاعليتين:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**التأثيرات كتل شيفرة تفاعلية.** تعيد المزامنة عند تغيّر القيم التي تقرأها داخلها. على عكس معالجات الأحداث التي تعمل مرة واحدة لكل تفاعل، تعمل التأثيرات كلما لزمت المزامنة.

**لا يمكنك «اختيار» تبعياتك.** يجب أن تتضمن تبعياتك كل [قيمة تفاعلية](#all-variables-declared-in-the-component-body-are-reactive) تقرأها في التأثير. المُدقِّق يفرض ذلك. أحياناً قد يؤدي ذلك إلى مشاكل مثل حلقات لا نهائية أو إلى إعادة مزامنة التأثير كثيراً. لا تعالج هذه المشاكل بكتم المُدقِّق! جرّب بدلاً من ذلك:

* **تحقق أن تأثيرك يمثل عملية مزامنة مستقلة.** إن لم يزامن التأثير شيئاً، [قد لا يكون ضرورياً.](/learn/you-might-not-need-an-effect) إن كان يزامن عدة أشياء مستقلة، [قسّمه.](#each-effect-represents-a-separate-synchronization-process)

* **إن أردت قراءة أحدث قيمة للخصائص أو الحالة دون «التفاعل» معها وإعادة مزامنة التأثير،** يمكنك تقسيم التأثير إلى جزء تفاعلي (يبقى في التأثير) وجزء غير تفاعلي (تستخرجه إلى ما يُسمى _حدث تأثير Effect Event_). [اقرأ عن فصل الأحداث عن التأثيرات.](/learn/separating-events-from-effects)

* **تجنّب الاعتماد على الكائنات والدوال كتبعيات.** إن أنشأت كائنات ودوالاً أثناء التصيير ثم قرأتها من تأثير، ستكون مختلفة في كل تصيير. فيعيد تأثيرك المزامنة في كل مرة. [اقرأ المزيد عن إزالة التبعيات غير الضرورية من التأثيرات.](/learn/removing-effect-dependencies)

<Pitfall>

المُدقِّق صديقك، لكن قدراته محدودة. يعلم المُدقِّق فقط متى تكون التبعيات *خاطئة*. لا يعلم *أفضل* طريقة لحل كل حالة. إذا اقترح المُدقِّق تبعية لكن إضافتها تسبب حلقة، فهذا لا يعني تجاهل المُدقِّق. عليك تغيير الشيفرة داخل التأثير (أو خارجه) حتى تلك القيمة ليست تفاعلية ولا *تحتاج* إلى أن تكون تبعية.

إن كان لديك قاعدة شيفرة قائمة، قد تجد تأثيرات تكتم المُدقِّق هكذا:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

في [الصفحة](/learn/separating-events-from-effects) [التالية](/learn/removing-effect-dependencies) ستتعلم كيف تصلح هذه الشيفرة دون كسر القواعد. الإصلاح يستحق الجهد دائماً!

</Pitfall>

<Recap>

- يمكن للمكوّنات أن تُثبَّت وتُحدَّث وتُزال.
- لكل تأثير دورة حياة منفصلة عن المكوّن المحيط.
- يصف كل تأثير عملية مزامنة منفصلة يمكن *بدؤها* و*إيقافها*.
- عند كتابة التأثيرات وقراءتها، فكّر من منظور كل تأثير على حدة (كيف تبدأ المزامنة وتوقفها) لا من منظور المكوّن (كيف يُثبَّت أو يُحدَّث أو يُزال).
- القيم المعرّفة داخل جسم المكوّن «تفاعلية».
- ينبغي أن تعيد القيم التفاعلية مزامنة التأثير لأنها قد تتغيّر مع الزمن.
- يتحقق المُدقِّق من أن كل القيم التفاعلية المستخدمة داخل التأثير معلنة كتبعيات.
- كل الأخطاء التي يُبلغ عنها المُدقِّق حقيقية. يوجد دائماً سبيل لإصلاح الشيفرة دون كسر القواعد.

</Recap>

<Challenges>

#### إيقاف إعادة الاتصال عند كل ضغطة مفتاح {/*fix-reconnecting-on-every-keystroke*/}

في هذا المثال، يتصل مكوّن `ChatRoom` بغرفة المحادثة عند تثبيت المكوّن، وينقطع عند إزالته، ويعيد الاتصال عند اختيار غرفة مختلفة. هذا السلوك صحيح، فيجب الإبقاء عليه.

لكن هناك مشكلة. كلما كتبت في حقل الرسالة في الأسفل، يعيد `ChatRoom` *أيضاً* الاتصال بالمحادثة. (يمكنك ملاحظة ذلك بمسح الـconsole ثم الكتابة في الحقل.) أصلح المشكلة حتى لا يحدث ذلك.

<Hint>

قد تحتاج إلى إضافة مصفوفة تبعيات لهذا التأثير. ما التبعيات التي ينبغي أن تكون؟

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

لم يكن لهذا التأثير مصفوفة تبعيات أصلاً، فكان يعيد المزامنة بعد كل إعادة تصيير. أولاً، أضف مصفوفة تبعيات. ثم تأكد أن كل قيمة تفاعلية يستخدمها التأثير مذكورة في المصفوفة. مثلاً، `roomId` تفاعلي (لأنه خاصية)، فيجب تضمينه. هذا يضمن إعادة اتصال المحادثة عند اختيار المستخدم غرفة أخرى. أما `serverUrl` فمعرّف خارج المكوّن، لذلك لا يحتاج إلى أن يكون في المصفوفة.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### تشغيل المزامنة وإيقافها {/*switch-synchronization-on-and-off*/}

في هذا المثال، يشترك تأثير في حدث [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) للنافذة لتحريك نقطة وردية على الشاشة. مرّر المؤشر فوق منطقة المعاينة (أو المس الشاشة على جهاز محمول) ولاحظ كيف تتبع النقطة حركتك.

هناك أيضاً مربع اختيار. تفعيله يبدّل متغير الحالة `canMove`، لكن هذا المتغير غير مستخدم في الشيفرة. مهمتك تعديل الشيفرة بحيث عندما يكون `canMove` هو `false` (المربع غير مفعّل)، تتوقف النقطة عن الحركة. وبعد إعادة تفعيل المربع (و`canMove` يصبح `true`)، تعود النقطة لتتبع الحركة. بعبارة أخرى، يجب أن تبقى إمكانية تحرك النقطة متزامنة مع حالة المربع.

<Hint>

لا يمكنك تعريف تأثير بشكل شرطي. لكن الشيفرة داخل التأثير يمكنها استخدام الشروط!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

حلّ واحد هو لف استدعاء `setPosition` داخل شرط `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

بديلاً، يمكنك لف منطق *الاشتراك في الحدث* داخل شرط `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

في الحالتين، `canMove` متغير تفاعلي تقرأه داخل التأثير. لذلك يجب ذكره في قائمة تبعيات التأثير. وهذا يضمن إعادة مزامنة التأثير بعد كل تغيّر لقيمته.

</Solution>

#### تحقيق علة قيمة قديمة {/*investigate-a-stale-value-bug*/}

في هذا المثال، ينبغي أن تتحرك النقطة الوردية عند تفعيل المربع، وتتوقف عند إلغائه. المنطق منفّذ مسبقاً: معالج الحدث `handleMove` يفحص متغير الحالة `canMove`.

لكن لسبب ما، يبدو أن `canMove` داخل `handleMove` «قديم»: يبقى `true` دائماً حتى بعد إلغاء تفعيل المربع. كيف يمكن ذلك؟ اعثر على الخطأ في الشيفرة وأصلحه.

<Hint>

إن رأيت كتم قاعدة للمُدقِّق، أزل الكتم! هناك عادةً الأخطاء.

</Hint>

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

<Solution>

مشكلة الشيفرة الأصلية كانت في كتم مُدقِّق التبعيات. إن أزلت الكتم، سترى أن هذا التأثير يعتمد على الدالة `handleMove`. وهذا منطقي: `handleMove` معرّفة داخل جسم المكوّن، فهي قيمة تفاعلية. يجب ذكر كل قيمة تفاعلية كتبعية، وإلا قد تصبح قديماً مع الزمن!

كذّب مؤلف الشيفرة الأصلية على React بقوله إن التأثير لا يعتمد (`[]`) على أي قيم تفاعلية. لذلك لم يعِد React مزامنة التأثير بعد تغيّر `canMove` (ومعه `handleMove`). وبما أن React لم يعِد المزامنة، فإن `handleMove` المربوطة كمستمع هي الدالة المُنشأة أثناء التصيير الأول. وفي التصيير الأول كان `canMove` هو `true`، لذلك ستظل `handleMove` من التصيير الأول ترى تلك القيمة للأبد.

**إن لم تكتم المُدقِّق أبداً، لن تواجه مشاكل القيم القديمة.** هناك عدة طرق لحل هذه العلة، لكن ابدأ دائماً بإزالة كتم المُدقِّق. ثم عدّل الشيفرة لإصلاح خطأ lint.

يمكنك جعل تبعيات التأثير `[handleMove]`، لكن بما أنها ستُعرّف من جديد في كل تصيير، يمكنك أيضاً حذف مصفوفة التبعيات بالكامل. عندها *سيعيد* التأثير المزامنة بعد كل إعادة تصيير:

<Sandpack>

```js
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
  });

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

هذا الحل يعمل، لكنه ليس مثالياً. إن وضعت `console.log('Resubscribing')` داخل التأثير، ستلاحظ أنه يعيد الاشتراك بعد كل إعادة تصيير. إعادة الاشتراك سريعة، لكن من الأفضل تجنّب تكرارها كثيراً.

إصلاح أفضل هو نقل الدالة `handleMove` *داخل* التأثير. عندها لن تكون `handleMove` قيمة تفاعلية، ولن يعتمد تأثيرك على دالة. بل سيحتاج إلى الاعتماد على `canMove` الذي تقرأه الآن من داخل التأثير. وهذا يطابق السلوك المرغوب، إذ يبقى تأثيرك متزامناً مع قيمة `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

جرّب إضافة `console.log('Resubscribing')` داخل جسم التأثير ولاحظ أنه يعيد الاشتراك فقط عند تبديل المربع (تغيّر `canMove`) أو تعديل الشيفرة. وهذا أفضل من النهج السابق الذي أعاد الاشتراك دائماً.

ستتعلم نهجاً أعم لهذا النوع من المشاكل في [فصل الأحداث عن التأثيرات.](/learn/separating-events-from-effects)

</Solution>

#### إصلاح تبديل الاتصال {/*fix-a-connection-switch*/}

في هذا المثال، يعرّف خدمة المحادثة في `chat.js` واجهتين: `createEncryptedConnection` و`createUnencryptedConnection`. يتيح مكوّن الجذر `App` للمستخدم اختيار التشفير أو عدمه، ثم يمرّر دالة واجهة البرمجة المناسبة إلى المكوّن الابن `ChatRoom` كخاصية `createConnection`.

لاحظ أن رسائل الـconsole الأولى تقول إن الاتصال غير مشفّر. جرّب تفعيل مربع الاختيار: لن يحدث شيء. لكن إن غيّرت الغرفة المختارة بعد ذلك، يعيد المحادثة الاتصال *ويفعّل* التشفير (كما ترى من رسائل الـconsole). هذه علة. أصلحها بحيث يؤدي تبديل مربع الاختيار *أيضاً* إلى إعادة اتصال المحادثة.

<Hint>

كتم المُدقِّق مريب دائماً. أيمكن أن تكون هذه علة؟

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

إن أزلت كتم المُدقِّق، سترى خطأ lint. المشكلة أن `createConnection` خاصية، إذن هي قيمة تفاعلية. يمكن أن تتغيّر مع الزمن! (وفعلاً ينبغي أن تتغيّر—عند تفعيل المربع يمرّر المكوّن الأب قيمة مختلفة لخاصية `createConnection`.) لذلك ينبغي أن تكون تبعية. أدرجها في القائمة لإصلاح العلة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

من الصحيح أن `createConnection` تبعية. لكن هذه الشيفرة هشّة قليلاً لأن أحداً قد يعدّل `App` ليمرّر دالة مضمّنة كقيمة لهذه الخاصية. حينها تختلف قيمتها في كل إعادة تصيير لـ`App`، فيعيد التأثير المزامنة أكثر من اللازم. لتجنّب ذلك، يمكنك تمرير `isEncrypted` بدلاً من ذلك:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

في هذه النسخة، يمرّر `App` خاصية منطقية بدلاً من دالة. داخل التأثير، تختار أي دالة تستخدم. وبما أن `createEncryptedConnection` و`createUnencryptedConnection` معرّفتان خارج المكوّن، فليستا تفاعليتين ولا تحتاجان إلى أن تكونا تبعيتين. ستتعلم المزيد في [إزالة تبعيات التأثير.](/learn/removing-effect-dependencies)

</Solution>

#### تعبئة سلسلة من صناديق الاختيار {/*populate-a-chain-of-select-boxes*/}

في هذا المثال، هناك صنداعد اختيار. الأول يتيح للمستخدم اختيار كوكب. والثاني يتيح اختيار مكان *على ذلك الكوكب.* الصندوق الثاني لا يعمل بعد. مهمتك جعله يعرض الأماكن على الكوكب المختار.

انظر كيف يعمل صندوق الاختيار الأول. يملأ حالة `planetList` بنتيجة استدعاء واجهة `"/planets"`. يُحفظ معرف الكوكب المختار حالياً في متغير الحالة `planetId`. عليك أن تجد أين تضيف شيفرة إضافية لملء حالة `placeList` بنتيجة استدعاء `"/planets/" + planetId + "/places"`.

إن نفّذت ذلك صحيحاً، يجب أن يملأ اختيار الكوكب قائمة الأماكن. وتغيير الكوكب يغيّر قائمة الأماكن.

<Hint>

إن كان لديك عمليتا مزامنة مستقلتان، اكتب تأثيرين منفصلين.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

هناك عمليتا مزامنة مستقلتان:

- صندوق الاختيار الأول متزامن مع قائمة الكواكب البعيدة.
- صندوق الاختيار الثاني متزامن مع قائمة الأماكن البعيدة للـ`planetId` الحالي.

لذلك من المنطقي وصفهما كتأثيرين منفصلين. إليك مثالاً لكيفية فعل ذلك:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

هذه الشيفرة مكررة قليلاً. لكن هذا ليس سبباً جيّداً لدمجها في تأثير واحد! إن فعلت، ستحتاج إلى دمج تبعيات التأثيرين في قائمة واحدة، فيُعاد جلب قائمة كل الكواكب عند تغيّر الكوكب. التأثيرات ليست أداة لإعادة استخدام الشيفرة.

بدلاً من ذلك، لتقليل التكرار يمكنك استخراج بعض المنطق إلى خطاف مخصّص مثل `useSelectOptions` أدناه:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

راجع تبويب `useSelectOptions.js` في الـsandbox لترى كيف يعمل. في المثال المثالي، يجب أن تُستبدل معظم التأثيرات في تطبيقك لاحقاً بخطافات مخصّصة، سواء كتبتها أنت أو جاءت من المجتمع. الخطافات المخصّصة تخفي منطق المزامنة، فلا يعلم المكوّن الداعي بالتأثير. ومع استمرار عملك على التطبيق، تبني لك لوحة من الخطافات تختار منها، وفي النهاية لن تحتاج إلى كتابة التأثيرات في مكوّناتك كثيراً.

</Solution>

</Challenges>

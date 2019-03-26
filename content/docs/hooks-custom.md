---
id: hooks-custom
title: بناء خطافات خاصة بك في React
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف.

بناء خطافات خاصة بك تمكِّنك من استخراج شيفرة من مكون ما إلى دوال قابلة لإعادة الاستعمال.

عندما تعلمنا كيفية [استعمال خطاف التأثير](/docs/hooks-effect.html#example-using-hooks-1), رأينا المكون الآتي من تطبيق محادثة يعرض رسالة تشير إلى حالة اتصال صديق أي إن كان متصلًا أم غير متصل:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

الآن، لنقل أنَّ تطبيق الدردشة هذا يملك قائمة اتصال (contact list)، وأردنا تصيير أسماء المستخدمين المتصلين بلون أخضر. يمكننا نسخ ولصق شيفرة مشابهة إلى المكون `FriendListItem` ولكن لن يكون ذلك جيدًا من الناحية المثالية:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

عوضًا عن ذلك، نريد أن نشارك هذه الشيفرة بين `FriendStatus` و `FriendListItem`.

تقليديًّا في React، يمكننا مشاركة شيفرة ذات حالة بين المكونات عبر طريقتين مشهورتين هما: [خاصيَّات التصيير](/docs/render-props.html) و [المكونات ذات الترتيب الأعلى](/docs/higher-order-components.html). سنتعلَّم الآن كيف يمكن للخطافات أن تحل العديد من هذه المشكلات الشبيهة دون إجبارك على إضافة المزيد من المكونات إلى الشجرة.

## استخراج خطاف مخصص {#extracting-a-custom-hook}

عندما نريد مشاركة شيفرة بين دالتين من دوال JavaScript، نستخرج هذه الشيفرة إلى دالة ثالثة. ولمَّا كانت المكونات والخطافات هي دوال، فهذا ينطبق عليها أيضًا.

**الخطاف المخصص هو دالة JavaScript يبدأ اسمها بالكلمة "`use`" وقد تستدعي خطافات أخرى ضمنه.** على سبيل المثال، الدالة `useFriendStatus` في الشيفرة التالية هي أول خطاف مخصص ننشئه:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

لا يوجد أي شيء جديد في هذه الشيفرة، إذ نُسِخَ معظمها من مكونات الشيفرة السابقة. بشكل مشابه لمكون، احرص على استدعاء الخطافات الأخرى في أعلى مستوى في الخطاف المخصص، دون وضعها ضمن عبارات شرطية مثلًا.

وبشكل مخالف لمكونات React، لا يحتاج الخطاف المخصص إلى توقيع محدَّد. يمكننا تحديد الوسائط التي سيأخذها والقيم التي سيعيدها (إن وجدت). بعبارة أخرى، الخطافات المخصصة تشبه أية دالة عادية باستثناء أنَّ اسمها يجب أن يبدأ بالكلمة `use` دومًا، لذا يمكنك من خلال النظر إلى الشيفرة معرفة إن كانت [قواعد الخطافات](/docs/hooks-rules.html) تنطبق عليها بشكل صحيح أم لا.

الغرض من الخطاف `useFriendStatus` هو الاشتراك في حالة صديق، وهذا هو سبب تمرير `friendID` سيطًا له وإعادة حالة اتصال ذلك الصديق منه (فيما إذا كان متصلًا أم غير متصل):

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

الآن، دعنا نرى كيف يمكننا استعمال هذا الخطاف المخصص.

## استعمال خطاف مخصص {#using-a-custom-hook}

في البداية، كان هدفنا الواضح هو إزالة الشيفرة المكررة من المكونين `FriendStatus` و `FriendListItem` لأنَّ كلاهما يريد معرفة حالة اتصال صديق.

الآن وبعد أن استخرجنا هذه الشيفرة إلى الخطاف `useFriendStatus` ، يمكننا استعماله ببساطة بالشكل التالي:

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**هل تكافئ هذه الشيفرة الأمثلة الأصلية؟** نعم، تكافئها وتعمل بالطريقة نفسها. إن أمعنت النظر، فستلاحظ أنَّنا لم نجرِ أية تغييرات متعلقة بالسلوك. فكل ما فعلنا هو استخراج الشيفرة المتشابهة بين دالتين إلى دالة منفصلة. **الخطافات المخصَّصة هي عُرفٌ يتَّبِع تصميم الخطافات نفسها وليس ذلك من ميزات React.**

**هل يتوجَّب عليَّ استعمال السابقة “`use`” عند تسمية الخطافات المخصصة؟** ليس ذلك إجباريًا، وإنما اختياري، لكن من الضروري فعل ذلك لجعلها أسهل لبقية المطورين. هذا العرف مهم جدًا، إذ لن نتمكن بدونه من التحقق من تطبيق [قواعد الخطافات](/docs/hooks-rules.html) تلقائيًّا لأنَّه لا يمكننا التفريق بين الدوال التي تحوي استدعاءات لخطافات داخلها وتلك التي لا تحوي عليها.

**هل يتشارك مكونان اثنان يستعملان نفس الخطاف الحالة؟** لا. الخطافات المخصَّصة هي آلية لإعادة استعمال شيفرة ذات حالة (مثل ضبط اشتراك وحفظ القيمة الحالية)، ولكن تبقى جميع الحالات والتأثيرات داخل خطاف مخصَّص معزولةً تمامًا في كل مرة تستعمل هذا الخطاف فيها.

**كيف يحصل خطاف مخصَّص على حالة معزولة؟** يحصل كل خطاف عند استدعائه على حالة معزولة. ولمَّا كنا استدعينا الخطاف `useFriendStatus` مباشرةً، فإن المكون من وجهة نظر React يستدعي `useState` و `useEffect` فقط.  وكما [تعلمنا](/docs/hooks-state.html#tip-using-multiple-state-variables) [سابقًا](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), يمكننا استدعاء `useState` و `useEffect` عدَّة مرات في مكون واحد، وسيكون كل منها مستقلًا كليًّا.

### تمرير معلومات بين الخطافاتلمَّا كانت الخطافات دوالًا، يمكننا تمرير معلومات بينها. {#tip-pass-information-between-hooks}

لمَّا كانت الخطافات دوالًا، يمكننا تمرير معلومات بينها.

لتوضيح ذلك عمليًّا، سنستعمل مكونًا آخر من مثال تطبيق الدردشة الافتراضي. الشيفرة التالية هي منتقي مستلم رسالة الدردشة والتي تظهر فيما إذا كان الصديق المحدَّد حاليًا متصلًا:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

نُبقِي معرِّف الصديق المختار حاليًا في متغير الحالة `recipientID` ونحدِّثه إن اختار المستخدم صديقًا آخر من المنتقي `<select>`.

لمَّا كان استدعاء الخطاف `useState` يعطينا القيمة الأحدث لمتغير الحالة `recipientID` فيمكننا تمريرها إلى خطافنا المخصَّص `useFriendStatus` كوسيط بالشكل التالي:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

هذا يمكِّننا من معرفة إذا كان الصديق المحدَّد حاليًا متصلًا أم لا. إن اخترنا صديقًا آخر وحدَّثنا متغير الحالة `recipientID`, فسيلغي الخطاف `useFriendStatus` الاشتراك من الصديق المحدَّد سابقًا، ويشترك في حالة الصديق الذي جرى تحديده للتو.

## `استعمل-مخيلتك()` {#useyourimagination}

توفر الخطافات المخصَّصة مرونةً لتشارك الشيفرة لم تكن متوافرة مع مكونات React من قبل. تستطيع أن تكتب خطافات مخصَّصة تغطي مجالًا واسعًا من حالات الاستعمال مثل المعالجة (handling)، والتحريك، والاشتراكات التصريحية (declarative subscriptions)، والمؤقتات، وغيرها الكثير من الأمور التي لم نتطرق لها. أضف إلى ذلك أنَّه يمكنك بناء خطافات يمكن استعمالها بسهولة كما يمكن استعمال ميزات React الضمنية.

حاول مثلًا منع إضافة تجريد (abstraction) في وقت سابق جدًا لأوانه. بذلك، يمكن لمكونات الدالة تلك فعل ذلك بإضافةً إلى المزيد من الأمور، إذ من المحتمل أن متوسط مكون الدالة في شيفرتك المصدرية سيزداد طولًا. هذا الأمر طبيعي، فلا تشعر بسرعة أنَّك بحاجة إلى تقسيم الشيفرة إلى خطافات. على أي حال، نشجعك على البدء بتسليط الضوء على الحالات التي يمكن لاستعمال خطاف مخصص فيها أن يخفي تعقيد الشيفرة خلف واجهة بسيطة، أو يساعد على ترتيب مكوِّن فوضوي.

على سبيل المثال، ربما تملك مكونًا معقدًا يحوي الكثير من الحالات المحلية التي تدار بطريقة مخصصة. ولكن الخطاف  `useState` لا يجعل مركزية تحديث الشيفرة أسهل، لذا قد تفضِّل كتابتها عل شكل مخفِّض (reducer) باستعمال المكتبة [Redux](https://redux.js.org/) reducer:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

المخفضات مناسبة جدًا للاختبار في بيئة منعزلة، ويمكنها أن تعبِّر عن شيفرة معقدة للتحديث. يمكنك أيضًا تقسيمها إلى أجزاء تمثِّل مخفضات أصغر إن كان ذلك ضروريًا. على أي حال، قد تجد في فوائد استعمال حالة React المحلية (أي React local state) أمرًا ممتعًا، أو قد لا ترغب في تثبيت مكتبة أخرى.

ذًا، ماذا لو استطعنا كتابة الخطاف `useReducer` بشكل يمكِّننا من إدارة الحالة المحلية للمكون الخاص بنا مع مخفِّض؟ نسخةٌ مبسَّطةٌ من ذلك قد تبدو بالشكل:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

يمكننا الآن استعماله في مكوِّننا لنترك المخفض (reducer) يتولى مهمة إدارة حالته:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

الحاجة لإدارة حالة محلية مع مخفِّض في مكون معقد هو أمرٌ شائعٌ، لذا بنينا الخطاف `useReducer` ضمنيًا في React. ستجد هذا الخطاف مع بقية الخطافات المضمَّنة الأخرى في قسم [مرجع إلى الواجهة البرمجية للخطافات](/docs/hooks-reference.html).

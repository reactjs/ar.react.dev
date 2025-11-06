````markdown
---
title: useEffectEvent
---

<Intro>

`useEffectEvent` هو React Hook يتيح لك استخراج منطق غير تفاعلي من Effects الخاصة بك إلى دالة قابلة لإعادة الاستخدام تسمى [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## المرجع {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

استدعِ `useEffectEvent` في المستوى الأعلى من مكونك للإعلان عن Effect Event. Effect Events هي دوال يمكنك استدعاؤها داخل Effects، مثل `useEffect`:

```js {4-6,11}
import { useEffectEvent, useEffect } from 'react';

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

  // ...
}
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### المعاملات {/*parameters*/}

- `callback`: دالة تحتوي على المنطق الخاص بـ Effect Event الخاص بك. عند تعريف Effect Event باستخدام `useEffectEvent`، يصل `callback` دائمًا إلى أحدث القيم من props و state عند استدعائه. يساعد هذا في تجنب المشاكل مع الإغلاقات القديمة.

#### القيم المرجعة {/*returns*/}

تُرجع دالة Effect Event. يمكنك استدعاء هذه الدالة داخل `useEffect` أو `useLayoutEffect` أو `useInsertionEffect`.

#### تنبيهات {/*caveats*/}

- **استدعِ فقط داخل Effects:** يجب استدعاء Effect Events فقط داخل Effects. عرّفها قبل Effect الذي يستخدمها مباشرة. لا تمررها إلى مكونات أو hooks أخرى. سيفرض linter [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) (الإصدار 6.1.1 أو أعلى) هذا القيد لمنع استدعاء Effect Events في السياق الخاطئ.
- **ليست اختصارًا للتبعيات:** لا تستخدم `useEffectEvent` لتجنب تحديد التبعيات في مصفوفة تبعيات Effect الخاص بك. يمكن أن يخفي هذا الأخطاء ويجعل كودك أصعب في الفهم. فضّل التبعيات الصريحة أو استخدم refs لمقارنة القيم السابقة إذا لزم الأمر.
- **استخدم للمنطق غير التفاعلي:** استخدم `useEffectEvent` فقط لاستخراج منطق لا يعتمد على القيم المتغيرة.

___

## الاستخدام {/*usage*/}

### قراءة أحدث props و state {/*reading-the-latest-props-and-state*/}

عادةً، عندما تصل إلى قيمة تفاعلية داخل Effect، يجب تضمينها في مصفوفة التبعيات. يضمن هذا تشغيل Effect الخاص بك مرة أخرى كلما تغيرت تلك القيمة، وهو السلوك المطلوب عادةً.

ولكن في بعض الحالات، قد ترغب في قراءة أحدث props أو state داخل Effect دون التسبب في إعادة تشغيل Effect عند تغيير تلك القيم.

[لقراءة أحدث props أو state](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) في Effect الخاص بك، دون جعل تلك القيم تفاعلية، قم بتضمينها في Effect Event.

```js {7-9,12}
import { useEffect, useContext, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  // ...
}
```

في هذا المثال، يجب إعادة تشغيل Effect بعد render عندما يتغير `url` (لتسجيل زيارة الصفحة الجديدة)، ولكن يجب **ألا** يُعاد تشغيله عندما يتغير `numberOfItems`. من خلال تغليف منطق التسجيل في Effect Event، يصبح `numberOfItems` غير تفاعلي. يتم قراءته دائمًا من أحدث قيمة دون تشغيل Effect.

يمكنك تمرير القيم التفاعلية مثل `url` كوسائط إلى Effect Event للحفاظ على تفاعليتها مع الوصول إلى أحدث القيم غير التفاعلية داخل الحدث.


````
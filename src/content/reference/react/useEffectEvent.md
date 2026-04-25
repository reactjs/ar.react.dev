---
title: useEffectEvent
---

<Intro>

`useEffectEvent` هو Hook في React يتيح لك استخراج منطق غير تفاعلي من تأثيراتك إلى دالة قابلة لإعادة الاستخدام تُسمى [حدث تأثير (Effect Event)](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## Reference {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

استدعِ `useEffectEvent` في أعلى مكوّنك لتصرّح عن حدث تأثير. أحداث التأثير هي دوال يمكنك استدعاؤها داخل التأثيرات، مثل `useEffect`:

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

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

- `callback`: دالة تحتوي منطق حدث التأثير. عند تعريف حدث تأثير بـ `useEffectEvent`، تصل الدالة `callback` دائمًا إلى أحدث قيم للـ props والحالة عند استدعائها. هذا يساعد على تجنب مشاكل الإغلاقات القديمة (stale closures).

#### Returns {/*returns*/}

تُرجع دالة حدث تأثير. يمكنك استدعاء هذه الدالة داخل `useEffect` أو `useLayoutEffect` أو `useInsertionEffect`.

#### Caveats {/*caveats*/}

- **استدعِ فقط داخل التأثيرات:** يجب استدعاء أحداث التأثير فقط داخل التأثيرات. عرّفها مباشرة قبل التأثير الذي يستخدمها. لا تمرّرها إلى مكوّنات أو Hooks أخرى. سيلزم [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) (الإصدار 6.1.1 أو أحدث) هذا القيد لمنع استدعاء أحداث التأثير في سياق خاطئ.
- **ليس اختصارًا للتبعيات:** لا تستخدم `useEffectEvent` لتجنب تحديد التبعيات في مصفوفة تبعيات التأثير. قد يخفي ذلك الأخطاء ويجعل الكود أصعب فهمًا. فضّل التبعيات الصريحة أو استخدم refs لمقارنة القيم السابقة عند الحاجة.
- **للمنطق غير التفاعلي:** استخدم `useEffectEvent` فقط لاستخراج منطق لا يعتمد على قيم متغيرة.

___

## Usage {/*usage*/}

### Reading the latest props and state {/*reading-the-latest-props-and-state*/}

عادةً، عند الوصول إلى قيمة تفاعلية داخل تأثير، يجب تضمينها في مصفوفة التبعيات. هذا يضمن إعادة تشغيل التأثير عند تغيّر تلك القيمة، وهو السلوك المرغوب في الغالب.

لكن في بعض الحالات، قد ترغب في قراءة أحدث الـ props أو الحالة داخل تأثير دون إعادة تشغيل التأثير عند تغيّر تلك القيم. لـ [قراءة أحدث الـ props أو الحالة](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) في تأثيرك دون جعل تلك القيم تفاعلية، ضمّنها في حدث تأثير.

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

في هذا المثال، يجب أن يُعاد تشغيل التأثير بعد رسم عندما يتغيّر `url` (لتسجيل زيارة الصفحة الجديدة)، لكنه **لا** يجب أن يُعاد تشغيله عند تغيّر `numberOfItems`. بلفّ منطق التسجيل في حدث تأثير، يصبح `numberOfItems` غير تفاعلي. يُقرأ دائمًا من أحدث القيمة دون إعادة تشغيل التأثير.

يمكنك تمرير قيم تفاعلية مثل `url` كمعاملات لحدث التأثير لإبقائها تفاعلية مع الوصول إلى أحدث القيم غير التفاعلية داخل الحدث.


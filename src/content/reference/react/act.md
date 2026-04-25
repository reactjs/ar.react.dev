---
title: "دالة act"
---

<Intro>

`act` مساعد للاختبارات لتطبيق تحديثات React المعلّقة قبل إجراء التأكيدات (assertions).

```js
await act(async actFn)
```

</Intro>

لتهيئة مكوّن للتأكيدات، لفّ الشيفرة التي تعرضه وتُحدّثه داخل استدعاء `await act()`. يجعل ذلك اختبارك أقرب لسلوك React في المتصفح.

<Note>
قد تجد استخدام `act()` مباشرةً مزعجًا بعض الشيء. لتقليل التكرار، يمكنك استخدام مكتبة مثل [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)، التي تلفّ مساعداتها بـ `act()`.
</Note>


<InlineToc />

---

## المرجع {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

عند كتابة اختبارات واجهة، يمكن اعتبار مهامًا مثل العرض، أو أحداث المستخدم، أو جلب البيانات «وحدات» تفاعل مع واجهة المستخدم. يوفّر React مساعدًا اسمه `act()` يضمن معالجة كل التحديثات المرتبطة بهذه «الوحدات» وتطبيقها على DOM قبل أي تأكيدات.

اسم `act` مستوحى من نمط [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

نوصي باستخدام `act` مع `await` ودالة `async`. رغم أن النسخة المتزامنة تعمل في كثير من الحالات، فهي لا تعمل في كل الحالات، وبسبب جدولة React للتحديثات داخليًا يصعب التنبؤ بمتى يمكن استخدام النسخة المتزامنة.

سنُهمل النسخة المتزامنة ونزيلها لاحقًا.

</Note>

#### المعاملات {/*parameters*/}

* `async actFn`: دالة async تلفّ عمليات العرض أو التفاعل للمكوّنات المختبرة. أي تحديثات تُطلق داخل `actFn` تُضاف إلى طابور act داخلي، ثم تُفرغ معًا لمعالجة التغييرات وتطبيقها على DOM. وبما أنها async، سينفّذ React أيضًا أي شيفرة تعبر حد async، ويُفرغ التحديثات المجدولة.

#### القيمة المُرجَعة {/*returns*/}

`act` لا تُرجع أي قيمة.

## الاستخدام {/*usage*/}

عند اختبار مكوّن، يمكنك استخدام `act` للتأكد من مخرجاته.

مثلًا، لنفترض أن لدينا مكوّن `Counter`، الأمثلة أدناه توضح كيفية اختباره:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### عرض المكوّنات في الاختبارات {/*rendering-components-in-tests*/}

لاختبار مخرجات العرض، لفّ العرض داخل `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Render the component inside act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

هنا ننشئ حاوية، نُلحقها بالمستند، ونعرض مكوّن `Counter` داخل `act()`. يضمن ذلك أن يُعرض المكوّن وتُطبَّق تأثيراته قبل التأكيدات.

استخدام `act` يضمن تطبيق كل التحديثات قبل إجراء التأكيدات.

### إرسال الأحداث في الاختبارات {/*dispatching-events-in-tests*/}

لاختبار الأحداث، لفّ إرسال الحدث داخل `act()`:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Dispatch the event inside act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

نعرض المكوّن بـ `act`، ثم نُرسل الحدث داخل `act()` آخر. يضمن ذلك تطبيق كل التحديثات الناتجة عن الحدث قبل التأكيدات.

<Pitfall>

لا تنسَ أن إرسال أحداث DOM يعمل فقط عند إضافة حاوية DOM إلى المستند. يمكنك استخدام مكتبة مثل [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) لتقليل الشيفرة المتكررة.

</Pitfall>

## استكشاف الأخطاء {/*troubleshooting*/}

### أتلقى خطأ: "The current testing environment is not configured to support act(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

استخدام `act` يتطلب ضبط `global.IS_REACT_ACT_ENVIRONMENT=true` في بيئة الاختبار. الهدف التأكد من استخدام `act` في البيئة الصحيحة فقط.

إن لم تضبط المتغير العام، ستظهر رسالة مثل:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

للإصلاح، أضف هذا إلى ملف الإعداد العام لاختبارات React:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

في أُطر اختبار مثل [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)، يكون `IS_REACT_ACT_ENVIRONMENT` مضبوطًا مسبقًا.

</Note>

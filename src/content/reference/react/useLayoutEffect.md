---
title: دالة useLayoutEffect
---

<Pitfall>

`useLayoutEffect` قد يضر بالأداء. فضّل [`useEffect`](/reference/react/useEffect) عندما يكون ذلك ممكنًا.

</Pitfall>

<Intro>

`useLayoutEffect` هو نسخة من [`useEffect`](/reference/react/useEffect) تُطلَق قبل أن يعيد المتصفح رسم الشاشة.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

استدعِ `useLayoutEffect` لقياس التخطيط قبل أن يعيد المتصفح رسم الشاشة:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `setup`: الدالة التي تحتوي منطق التأثير. قد تُرجع دالة تنظيف اختيارية. قبل إضافة المكوّن إلى DOM، يشغّل React دالة الإعداد. بعد كل إعادة رسم بتغيّر التبعيات، يشغّل React أولًا دالة التنظيف (إن وُجدت) بالقيم القديمة، ثم دالة الإعداد بالقيم الجديدة. قبل إزالة المكوّن من DOM، يشغّل React دالة التنظيف.

* **اختياري** `dependencies`: قائمة بجميع القيم التفاعلية المُشار إليها داخل كود `setup`. تشمل القيم التفاعلية الـ props والحالة وجميع المتغيرات والدوال المعرّفة مباشرة في جسم المكوّن. إذا كان linter الخاص بك [مهيأ لـ React](/learn/editor-setup#linting)، فسيتحقق من أن كل قيمة تفاعلية مُحدَّدة كتبعية. يجب أن يكون عدد عناصر قائمة التبعيات ثابتًا وتُكتب مضمّنة مثل `[dep1, dep2, dep3]`. يقارن React كل تبعية بقيمتها السابقة باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). إذا حذفت هذا المعامل، يُعاد تشغيل التأثير بعد كل إعادة رسم للمكوّن.

#### القيمة المعادة {/*returns*/}

`useLayoutEffect` يعيد `undefined`.

#### ملاحظات مهمة {/*caveats*/}

* `useLayoutEffect` هو Hook، لذا يمكنك استدعاؤه **فقط في أعلى مكوّنك** أو في Hooks الخاصة بك. لا تستدعِه داخل حلقات أو شروط. إذا احتجت ذلك، استخرج مكوّنًا وانقل التأثير إليه.

* عند تفعيل Strict Mode، يشغّل React **دورة إعداد+تنظيف إضافية للتطوير فقط** قبل الإعداد الحقيقي. هذا اختبار ضغط يضمن أن منطق التنظيف «يعكس» منطق الإعداد وأنه يوقف أو يلغي ما يفعله الإعداد. إذا سبب ذلك مشكلة، [نفّذ دالة التنظيف.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* إذا كانت بعض تبعياتك كائنات أو دوالًا مُعرَّفة داخل المكوّن، فهناك خطر أن **تجعل التأثير يُعاد تشغيله أكثر من اللازم.** لإصلاح ذلك، أزل [التبعيات الكائنية](/reference/react/useEffect#removing-unnecessary-object-dependencies) و[تبعيات الدوال](/reference/react/useEffect#removing-unnecessary-function-dependencies) غير الضرورية. يمكنك أيضًا [استخراج تحديثات الحالة](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) و[المنطق غير التفاعلي](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) خارج التأثير.

* التأثيرات **تعمل فقط على العميل.** لا تعمل أثناء العرض على الخادم.

* الكود داخل `useLayoutEffect` وجميع تحديثات الحالة المجدولة منه **تعطل المتصفح عن إعادة رسم الشاشة.** عند الإفراط في الاستخدام، يبطئ ذلك تطبيقك. عند الإمكان، فضّل [`useEffect`.](/reference/react/useEffect)

* إذا أطلقت تحديث حالة داخل `useLayoutEffect`، ينفّذ React جميع التأثيرات المتبقية فورًا بما فيها `useEffect`.

---

## الاستخدام {/*usage*/}

### قياس التخطيط قبل أن يعيد المتصفح رسم الشاشة {/*measuring-layout-before-the-browser-repaints-the-screen*/}

معظم المكوّنات لا تحتاج لمعرفة موضعها وحجمها على الشاشة لتقرير ما تُرسمه. تُرجع JSX فقط. ثم يحسب المتصفح *تخطيطها* (الموضع والحجم) ويعيد رسم الشاشة.

أحيانًا، هذا غير كافٍ. تخيّل تلميحًا يظهر بجانب عنصر عند التمرير. إذا توفّر مساحة كافية، يجب أن يظهر التلميح فوق العنصر، وإذا لم يتسع، يجب أن يظهر تحته. لرسم التلميح في الموضع النهائي الصحيح، تحتاج لمعرفة ارتفاعه (أي هل يتسع في الأعلى).

لذلك، تحتاج للرسم في مرحلتين:

1. ارسم التلميح في أي مكان (حتى بموضع خاطئ).
2. قِس ارتفاعه وقرّر أين توضعه.
3. ارسم التلميح *مرة أخرى* في المكان الصحيح.

**يجب أن يحدث كل هذا قبل أن يعيد المتصفح رسم الشاشة.** لا تريد أن يرى المستخدم التلميح يتحرك. استدعِ `useLayoutEffect` لقياس التخطيط قبل إعادة رسم المتصفح:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

إليك كيف يعمل ذلك خطوة بخطوة:

1. يُرسم `Tooltip` بقيمة أولية `tooltipHeight = 0` (لذا قد يُوضع التلميح بشكل خاطئ).
2. يضع React العقدة في DOM ويشغّل كود `useLayoutEffect`.
3. [يقيس](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) `useLayoutEffect` ارتفاع محتوى التلميح ويطلق إعادة رسم فورية.
4. يُعاد رسم `Tooltip` بالقيمة الحقيقية لـ `tooltipHeight` (فيصبح الموضع صحيحًا).
5. يحدّث React DOM، وأخيرًا يعرض المتصفح التلميح.

مرّر فوق الأزرار أدناه ولاحظ كيف يضبط التلميح موضعه حسب ما إذا كان يتسع:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

لاحظ أنه رغم أن مكوّن `Tooltip` يحتاج لمرحلتي رسم (أولًا بـ `tooltipHeight` مبدئيًا `0` ثم بالارتفاع المقاس)، فإنك ترى النتيجة النهائية فقط. لهذا تحتاج `useLayoutEffect` بدل [`useEffect`](/reference/react/useEffect) في هذا المثال. نستعرض الفرق بالتفصيل أدناه.

<Recipes titleText="useLayoutEffect مقابل useEffect" titleId="examples">

#### `useLayoutEffect` يحجب إعادة رسم المتصفح {/*uselayouteffect-blocks-the-browser-from-repainting*/}

يضمن React أن الكود داخل `useLayoutEffect` وأي تحديثات حالة مجدولة منه تُعالَج **قبل أن يعيد المتصفح رسم الشاشة.** هذا يتيح رسم التلميح وقياسه وإعادة رسمه دون أن يلاحظ المستخدم الرسم الإضافي الأول. بعبارة أخرى، `useLayoutEffect` يعطل المتصفح عن الرسم.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` لا يحجب المتصفح {/*useeffect-does-not-block-the-browser*/}

نفس المثال، لكن بـ [`useEffect`](/reference/react/useEffect) بدل `useLayoutEffect`. على جهاز أبطأ، قد تلاحظ أحيانًا «وميضًا» للتلميح وظهور موضعه الأولي لحظة قبل الموضع المصحح.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

لتسهيل إظهار المشكلة، تضيف هذه النسخة تأخيرًا اصطناعيًا أثناء الرسم. يسمح React للمتصفح بالرسم قبل معالجة تحديث الحالة داخل `useEffect`. النتيجة وميض التلميح:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [10, 11]}} src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

عدّل هذا المثال إلى `useLayoutEffect` ولاحظ أنه يعطل الرسم حتى عند إبطاء الرسم.

<Solution />

</Recipes>

<Note>

الرسم في مرحلتين وتعطيل المتصفح يضر بالأداء. تجنب ذلك عندما يكون ممكنًا.

</Note>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### أتلقى خطأ: «`useLayoutEffect` لا يفعل شيئًا على الخادم» {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

الغرض من `useLayoutEffect` هو تمكين مكوّنك من [استخدام معلومات التخطيط للرسم:](#measuring-layout-before-the-browser-repaints-the-screen)

1. رسم المحتوى الأولي.
2. قياس التخطيط *قبل أن يعيد المتصفح رسم الشاشة.*
3. رسم المحتوى النهائي باستخدام معلومات التخطيط التي قرأتها.

عندما تستخدم أنت أو إطارك [الرسم على الخادم](/reference/react-dom/server)، يُرسم تطبيق React إلى HTML على الخادم للـ render الأول. ذلك يتيح عرض HTML الأولي قبل تحميل كود JavaScript.

المشكلة أنه على الخادم لا توجد معلومات تخطيط.

في [المثال السابق](#measuring-layout-before-the-browser-repaints-the-screen)، يتيح استدعاء `useLayoutEffect` في مكوّن `Tooltip` وضعه الصحيح (فوق المحتوى أو تحته) حسب ارتفاع المحتوى. إذا حاولت رسم `Tooltip` كجزء من HTML الخادم الأولي، يستحيل تحديد ذلك. على الخادم لا يوجد تخطيط بعد! لذا حتى إن رسمتَه على الخادم، قد «يقفز» موضعه على العميل بعد تحميل JavaScript وتشغيله.

عادةً، المكوّنات التي تعتمد على معلومات التخطيط لا تحتاج أصلًا للرسم على الخادم. مثلًا، قد لا معنى لعرض `Tooltip` أثناء الـ render الأول؛ يُطلَق بتفاعل على العميل.

لكن إذا واجهت هذه المشكلة، لديك عدة خيارات:

- استبدل `useLayoutEffect` بـ [`useEffect`.](/reference/react/useEffect) ذلك يخبر React أنه مقبول عرض نتيجة الـ render الأول دون حجب الرسم (لأن HTML الأصلي يظهر قبل تشغيل الـ Effect).

- أو [علّم مكوّنك أنه للعميل فقط.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) ذلك يخبر React باستبدال محتواه حتى أقرب حد [`<Suspense>`](/reference/react/Suspense) بـ fallback تحميل (مثلًا دوار أو وميض) أثناء الرسم على الخادم.

- أو يمكنك رسم مكوّن يستخدم `useLayoutEffect` فقط بعد الـ hydration. احتفظ بحالة منطقية `isMounted` مبدئيًا `false`، واضبطها إلى `true` داخل `useEffect`. يصبح منطق الرسم مثلًا `return isMounted ? <RealContent /> : <FallbackContent />`. على الخادم وأثناء الـ hydration، يرى المستخدم `FallbackContent` التي لا تستدعي `useLayoutEffect`. ثم يستبدلها React بـ `RealContent` التي تعمل على العميل فقط ويمكنها تضمين استدعاءات `useLayoutEffect`.

- إذا زامنت مكوّنك مع مخزن بيانات خارجي وتعتمد على `useLayoutEffect` لأسباب غير قياس التخطيط، فكّر في [`useSyncExternalStore`](/reference/react/useSyncExternalStore) بدلًا منه؛ [يدعم الرسم على الخادم.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)

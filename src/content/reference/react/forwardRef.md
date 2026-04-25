---
title: "دالة forwardRef"
---

<Deprecated>

في React 19، لم يعد `forwardRef` ضروريًا. مرّر `ref` كخاصية بدلًا من ذلك.

سيُهمل `forwardRef` في إصدار مستقبل. تعرّف أكثر [هنا](/blog/2024/12/05/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` تتيح لمكوّنك كشف عقدة DOM للمكوّن الأب عبر [مرجع (ref).](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

استدعِ `forwardRef()` لتلقي مرجع في مكوّنك وإعادة توجيهه إلى مكوّن فرعي:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `render`: دالة العرض لمكوّنك. تستدعي React هذه الدالة بالخصائص و`ref` التي تلقّاها المكوّن من الأب. JSX الذي تُرجعه هو مخرجات مكوّنك.

#### القيمة المُرجَعة {/*returns*/}

`forwardRef` تُرجع مكوّن React يمكنك عرضه في JSX. بخلاف المكوّنات المعرفة كدوال عادية، المكوّن المُرجَع من `forwardRef` يمكنه أيضًا استقبال خاصية `ref`.

#### ملاحظات {/*caveats*/}

* في Strict Mode، React **تستدعي دالة العرض مرتين** لـ [مساعدتك على اكتشاف الشوائب غير المقصودة.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) هذا سلوك التطوير فقط ولا يؤثر على الإنتاج. إذا كانت دالة العرض نقية (كما يجب)، لا يجب أن يؤثر ذلك على منطق المكوّن. يُهمل ناتج أحد الاستدعاءين.


---

### دالة `render` {/*render-function*/}

`forwardRef` تقبل دالة عرض كمعامل. تستدعي React هذه الدالة بـ `props` و`ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### المعاملات {/*render-parameters*/}

* `props`: الخصائص التي يمرّرها المكوّن الأب.

* `ref`:  سمة `ref` التي يمرّرها الأب. يمكن أن يكون `ref` كائنًا أو دالة. إذا لم يمرّر الأب مرجعًا، تكون `null`. يجب إما تمرير `ref` الذي تتلقاه إلى مكوّن آخر، أو تمريره إلى [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### القيمة المُرجَعة {/*render-returns*/}

`forwardRef` تُرجع مكوّن React يمكنك عرضه في JSX. بخلاف المكوّنات المعرفة كدوال عادية، المكوّن المُرجَع من `forwardRef` يمكنه قبول خاصية `ref`.

---

## الاستخدام {/*usage*/}

### كشف عقدة DOM للمكوّن الأب {/*exposing-a-dom-node-to-the-parent-component*/}

افتراضيًا، عقد DOM لكل مكوّن خاصة. لكن أحيانًا يفيد كشف عقدة DOM للأب—مثلًا للسماح بالتركيز عليها. للموافقة، لفّ تعريف مكوّنك بـ `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

ستتلقى <CodeStep step={1}>ref</CodeStep> كالمعامل الثاني بعد الخصائص. مرّره إلى عقدة DOM التي تريد كشفها:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

يتيح لمكوّن الأب `Form` الوصول إلى <CodeStep step={2}>عقدة DOM لـ `<input>`</CodeStep> التي يكشفها `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

مكوّن `Form` هذا [يمرّر مرجعًا](/reference/react/useRef#manipulating-the-dom-with-a-ref) إلى `MyInput`. مكوّن `MyInput` *يعيد توجيه* ذلك المرجع إلى وسم `<input>` في المتصفح. النتيجة أن `Form` يمكنه الوصول إلى عقدة `<input>` DOM واستدعاء [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) عليها.

تذكّر أن كشف مرجع لعقدة DOM داخل مكوّنك يصعّب تغيير التفاصيل الداخلية لاحقًا. غالبًا تكشف عقد DOM من مكوّنات منخفضة المستوى قابلة لإعادة الاستخدام مثل الأزرار أو حقول النص، وليس لمكوّنات مستوى التطبيق مثل الصورة الرمزية أو تعليق.

<Recipes titleText="أمثلة على إعادة توجيه مرجع">

#### تركيز حقل نص {/*focusing-a-text-input*/}

النقر على الزر يركّز الإدخال. مكوّن `Form` يعرّف مرجعًا ويمرّره إلى `MyInput`. مكوّن `MyInput` يعيد توجيه المرجع إلى `<input>` في المتصفح. يتيح لمكوّن `Form` تركيز `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### تشغيل وإيقاف فيديو {/*playing-and-pausing-a-video*/}

النقر على الزر يستدعي [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) و[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) على عقدة `<video>` DOM. مكوّن `App` يعرّف مرجعًا ويمرّره إلى `MyVideoPlayer`. مكوّن `MyVideoPlayer` يعيد توجيه المرجع إلى عقدة `<video>` في المتصفح. يتيح لمكوّن `App` تشغيل `<video>` وإيقافه.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### إعادة توجيه مرجع عبر عدة مكوّنات {/*forwarding-a-ref-through-multiple-components*/}

بدل إعادة توجيه `ref` إلى عقدة DOM، يمكنك إعادة توجيهه إلى مكوّنك الخاص مثل `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

إذا كان مكوّن `MyInput` يعيد توجيه مرجع إلى `<input>`، فمرجع إلى `FormField` يعطيك ذلك `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

مكوّن `Form` يعرّف مرجعًا ويمرّره إلى `FormField`. مكوّن `FormField` يعيد توجيه المرجع إلى `MyInput`، الذي يعيده إلى عقدة `<input>` DOM في المتصفح. هكذا يصل `Form` إلى تلك العقدة.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### كشف مقبض أمري بدل عقدة DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

بدل كشف عقدة DOM كاملة، يمكنك كشف كائن مخصّص يُسمى *مقبضًا أمرًا (imperative handle)* بمجموعة أضيق من الطرق. لذلك تحتاج عادةً إلى مرجع منفصل يحتفظ بعقدة DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

مرّر `ref` الذي تتلقاه إلى [`useImperativeHandle`](/reference/react/useImperativeHandle) وحدد القيمة التي تريد كشفها عبر `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

إذا حصل مكوّن على مرجع إلى `MyInput`، سيتلقى فقط كائن `{ focus, scrollIntoView }` بدل عقدة DOM. يتيح لك الحدّ من المعلومات التي تكشفها عن عقدة DOM.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[اقرأ المزيد عن المقابض الأمرية.](/reference/react/useImperativeHandle)

<Pitfall>

**لا تفرط في استخدام المراجع.** استخدمها فقط لسلوكيات *أمرية* لا يمكن التعبير عنها كخصائص: مثل التمرير إلى عقدة، أو التركيز، أو تشغيل حركة، أو تحديد نص، وهكذا.

**إذا أمكن التعبير عن شيء كخاصية، لا تستخدم مرجعًا.** مثلًا، بدل كشف مقبض `{ open, close }` من مكوّن `Modal`، من الأفضل قبول `isOpen` كخاصية مثل `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) تساعد على كشف السلوك الأمري عبر الخصائص.

</Pitfall>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### مكوّني ملفوف بـ `forwardRef` لكن `ref` إليه دائمًا `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

غالبًا نسيت استخدام `ref` الذي تتلقاه فعليًا.

مثلًا، هذا المكوّن لا يفعل شيئًا بـ `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

للإصلاح، مرّر `ref` إلى عقدة DOM أو مكوّن آخر يقبل مرجعًا:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

قد يكون `ref` إلى `MyInput` أيضًا `null` إذا كان بعض المنطق مشروطًا:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

إذا كان `showInput` هو `false`، لن يُعاد توجيه المرجع إلى أي عقدة، ويبقى مرجع `MyInput` فارغًا. من السهل تفويت ذلك إذا كان الشرط مخفيًا داخل مكوّن آخر مثل `Panel` في هذا المثال:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```

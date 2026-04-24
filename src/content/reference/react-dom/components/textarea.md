---
title: "<textarea>"
---

<Intro>

يتيح لك [مكوّن `<textarea>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) عرض حقل إدخال نصي متعدد الأسطر.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<textarea>` {/*textarea*/}

لعرض مساحة نص متعددة الأسطر، صيّر [مكوّن `<textarea>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<textarea>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

يمكنك [جعل المساحة النصية متحكَّمة فيها](#controlling-a-text-area-with-a-state-variable) بتمرير خاصية `value`:

* `value`: نص. يتحكم في النص داخل المساحة النصية.

عند تمرير `value`، يجب أيضًا تمرير معالج `onChange` يحدّث القيمة الممرَّرة.

إذا كانت `<textarea>` غير متحكَّم فيها، يمكنك تمرير خاصية `defaultValue` بدلًا من ذلك:

* `defaultValue`: نص. يحدد [القيمة الابتدائية](#providing-an-initial-value-for-a-text-area) للمساحة النصية.

تنطبق خصائص `<textarea>` التالية على المساحات غير المتحكَّم فيها والمتحكَّم فيها معًا:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): إما `'on'` أو `'off'`. يحدد سلوك الإكمال التلقائي.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): قيمة منطقية. إذا كانت `true`، يركّز React العنصر عند التركيب.
* `children`: لا يقبل `<textarea>` أبناء. لضبط القيمة الابتدائية، استخدم `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): رقم. يحدد العرض الافتراضي بمتوسط عرض الحرف. الافتراضي `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): قيمة منطقية. إذا كانت `true`، لن يكون الإدخال تفاعليًا ويظهر باهتًا.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): نص. يحدد `id` النموذج `<form>` الذي ينتمي إليه الإدخال. إذا حُذف، يُستخدم أقرب نموذج أب.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): رقم. يحدد الحد الأقصى لطول النص.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): رقم. يحدد الحد الأدنى لطول النص.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): نص. يحدد اسم الإدخال [المُرسَل مع النموذج.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). مطلوب للمساحات النصية [المتحكَّم فيها.](#controlling-a-text-area-with-a-state-variable) تُطلق فورًا عند تغيير القيمة من المستخدم (مثلًا عند كل ضغطة). تتصرف مثل حدث [`input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) في المتصفح.
* `onChangeCapture`: نسخة من `onChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق فورًا عند تغيير القيمة من المستخدم. لأسباب تاريخية، من المتعارف عليه في React استخدام `onChange` بدلًا منها وهي مشابهة.
* `onInputCapture`: نسخة من `onInput` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق إذا فشل التحقق من صحة الإدخال عند إرسال النموذج. على عكس حدث `invalid` المدمج، ينتشر حدث React `onInvalid` إلى الأعلى.
* `onInvalidCapture`: نسخة من `onInvalid` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق بعد تغيير التحديد داخل `<textarea>`. يوسّع React `onSelect` ليطلق أيضًا عند تحديد فارغ وعند التعديلات (التي قد تؤثر على التحديد).
* `onSelectCapture`: نسخة من `onSelect` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): نص. يُعرض بلون باهت عندما تكون قيمة المساحة فارغة.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): قيمة منطقية. إذا كانت `true`، لا يمكن للمستخدم تعديل المساحة.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): قيمة منطقية. إذا كانت `true`، يجب توفير القيمة لإرسال النموذج.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): رقم. يحدد الارتفاع الافتراضي بمتوسط ارتفاع الحرف. الافتراضي `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): إما `'hard'` أو `'soft'` أو `'off'`. يحدد كيفية لف النص عند إرسال النموذج.

#### تنبيهات {/*caveats*/}

- تمرير أبناء مثل `<textarea>something</textarea>` غير مسموح. [استخدم `defaultValue` للمحتوى الابتدائي.](#providing-an-initial-value-for-a-text-area)
- إذا تلقت المساحة خاصية `value` نصية، تُعامل كـ [متحكَّمة فيها.](#controlling-a-text-area-with-a-state-variable)
- لا يمكن أن تكون المساحة متحكَّمة وغير متحكَّمة في آن واحد.
- لا يمكن أن تنتقل بين الحالتين خلال عمرها.
- كل مساحة متحكَّمة فيها تحتاج معالج `onChange` يحدّث قيمتها الداعمة بشكل متزامن.

---

## الاستخدام {/*usage*/}

### عرض مساحة نص {/*displaying-a-text-area*/}

صيّر `<textarea>` لعرض مساحة نص. يمكنك تحديد الحجم الافتراضي بسمتي [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) و [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols)، لكن افتراضيًا يمكن للمستخدم تغيير حجمها. لتعطيل تغيير الحجم، حدّد `resize: none` في CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### إرفاق تسمية بمساحة نص {/*providing-a-label-for-a-text-area*/}

عادةً، تضع كل `<textarea>` داخل وسم [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). يخبر ذلك المتصفح أن التسمية مرتبطة بتلك المساحة. عند النقر على التسمية، يركّز المتصفح المساحة. وهو مهم للوصولية: يعلن قارئ الشاشة نص التسمية عند تركيز المساحة.

إذا لم تستطع تداخل `<textarea>` داخل `<label>`، اربطهما بتمرير نفس المعرّف إلى `<textarea id>` و [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) لتجنب التعارض بين نسخ مكوّن واحد، أنشئ المعرّف بـ [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### تحديد قيمة ابتدائية لمساحة نص {/*providing-an-initial-value-for-a-text-area*/}

يمكنك اختياريًا تحديد القيمة الابتدائية للمساحة. مرّرها كنص `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

على عكس HTML، لا يُدعم تمرير نص ابتدائي مثل `<textarea>Some content</textarea>`.

</Pitfall>

---

### قراءة قيمة المساحة عند إرسال النموذج {/*reading-the-text-area-value-when-submitting-a-form*/}

أضف [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) حول المساحة مع [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) داخله. سيستدعي معالج `<form onSubmit>`. افتراضيًا، يرسل المتصفح بيانات النموذج إلى عنوان URL الحالي ويعيد تحميل الصفحة. يمكنك إلغاء ذلك باستدعاء `e.preventDefault()`. اقرأ بيانات النموذج بـ [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

أعطِ `<textarea>` اسمًا `name`، مثل `<textarea name="postContent" />`. سيُستخدم الاسم كمفتاح في بيانات النموذج، مثل `{ postContent: "Your post" }`.

</Note>

<Pitfall>

افتراضيًا، *أي* `<button>` داخل `<form>` يرسل النموذج. قد يكون ذلك مفاجئًا! إذا كان لديك مكوّن `Button` مخصص، فكّر بإرجاع [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) بدلًا من `<button>`. ثم استخدم صراحةً `<button type="submit">` للأزرار التي *يجب* أن ترسل النموذج.

</Pitfall>

---

### التحكم بمساحة نص بمتغير حالة {/*controlling-a-text-area-with-a-state-variable*/}

مساحة مثل `<textarea />` *غير متحكَّمة فيها.* حتى إذا [مررت قيمة ابتدائية](#providing-an-initial-value-for-a-text-area) مثل `<textarea defaultValue="Initial text" />`، يحدد JSX القيمة الابتدائية فقط لا القيمة الحالية.

**لتصيير مساحة *متحكَّمة فيها*، مرِّر خاصية `value`.** يفرض React على المساحة أن تمتلك دائمًا `value` التي مررتها. عادةً تتحكم بالمساحة عبر [متغير حالة:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

مفيد إذا أردت إعادة تصيير جزء من الواجهة عند كل ضغطة مفتاح.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**إذا مررت `value` دون `onChange`، يصبح الكتابة في المساحة مستحيلة.** عند التحكم بمساحة بقيمة `value`، *تفرض* عليها دائمًا تلك القيمة. فإذا مررت متغير حالة كـ `value` ونسيت تحديثه بشكل متزامن في `onChange`، يعيد React المساحة بعد كل ضغطة إلى `value` التي حددتها.

</Pitfall>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### المساحة النصية لا تتحدث عند الكتابة {/*my-text-area-doesnt-update-when-i-type-into-it*/}

إذا صيّرت مساحة بـ `value` دون `onChange`، ستظهر رسالة خطأ في الطرفية:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

كما تقترح الرسالة، إذا أردت فقط [تحديد القيمة *الابتدائية*،](#providing-an-initial-value-for-a-text-area) مرِّر `defaultValue` بدلًا من ذلك:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

إذا أردت [التحكم بهذه المساحة بمتغير حالة،](#controlling-a-text-area-with-a-state-variable) حدّد معالج `onChange`:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

إذا كانت القيمة مقصودة للقراءة فقط، أضف `readOnly` لكتم الخطأ:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### مؤشر المساحة يقفز إلى البداية عند كل ضغطة {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

إذا [تحكمت بمساحة نص،](#controlling-a-text-area-with-a-state-variable) يجب تحديث متغير الحالة إلى قيمة المساحة من DOM أثناء `onChange`.

لا يمكنك تحديثه إلى شيء غير `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

ولا يمكنك تحديثه بشكل غير متزامن:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

لإصلاح الشيفرة، حدّثه بشكل متزامن إلى `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

إذا لم يُحلّ المشكل، قد تُزال المساحة وتُعاد إدراجها في DOM عند كل ضغطة. يحدث ذلك إذا [أعدت تهيئة الحالة](/learn/preserving-and-resetting-state) بالخطأ عند كل إعادة تصيير؛ مثلاً إذا تلقت المساحة أو أحد الآباء دائمًا `key` مختلفًا، أو إذا دمجت تعريفات المكوّنات (غير مسموح في React ويجعل المكوّن «الداخلي» يُعاد تركيبه عند كل تصيير).

---

### أتلقى خطأ: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


إذا مررت `value` للمكوّن، يجب أن تبقى سلسلة طوال عمره.

لا يمكنك تمرير `value={undefined}` أولًا ثم لاحقًا `value="some string"` لأن React لن يعرف إن كنت تريد المكوّن غير متحكَّم فيه أو متحكَّمًا فيه. يجب أن يتلقى المكوّن المتحكَّم فيه دائمًا `value` نصية، لا `null` ولا `undefined`.

إذا جاءت `value` من واجهة برمجة أو متغير حالة، قد تُهيأ إلى `null` أو `undefined`. عندها اضبطها ابتدائيًا إلى سلسلة فارغة (`''`)، أو مرِّر `value={someValue ?? ''}` لضمان أن `value` نصًا.

---
title: "<input>"
---

<Intro>

يتيح لك [مكوّن `<input>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) عرض أنواع مختلفة من حقول الإدخال في النماذج.

```js
<input />
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<input>` {/*input*/}

لعرض حقل إدخال، صيّر [مكوّن `<input>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<input>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): نص أو دالة. يتجاوز `<form action>` الأب لـ `type="submit"` و `type="image"`. عند تمرير URL إلى `action` يتصرف النموذج مثل نموذج HTML قياسي. عند تمرير دالة إلى `formAction` تتولى الدالة إرسال النموذج. راجع [`<form action>`](/reference/react-dom/components/form#props).

يمكنك [جعل الإدخال متحكَّمًا فيه](#controlling-an-input-with-a-state-variable) بتمرير إحدى هذه الخصائص:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): قيمة منطقية. لمربع اختيار أو زر اختيار، تتحكم في كونه محددًا.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): نص. لحقل نص، يتحكم في النص. (لزر اختيار، يحدد بيانات النموذج له.)

عند تمرير إحداهما، يجب أيضًا تمرير معالج `onChange` يحدّث القيمة الممرَّرة.

تنطبق خصائص `<input>` التالية على الإدخالات غير المتحكَّم فيها فقط:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): قيمة منطقية. تحدد [القيمة الابتدائية](#providing-an-initial-value-for-an-input) لإدخالات `type="checkbox"` و `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): نص. يحدد [القيمة الابتدائية](#providing-an-initial-value-for-an-input) لحقل نص.

تنطبق خصائص `<input>` التالية على الإدخالات غير المتحكَّم فيها والمتحكَّم فيها معًا:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): نص. يحدد أنواع الملفات المقبولة لإدخال `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): نص. يحدد النص البديل للصورة لإدخال `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): نص. يحدد الوسائط (ميكروفون، فيديو، أو كاميرا) الملتقطة لإدخال `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): نص. يحدد أحد [سلوكيات الإكمال التلقائي](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) المحتملة.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): قيمة منطقية. إذا كانت `true`، يركّز React العنصر عند التركيب.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): نص. يحدد اسم حقل النموذج لاتجاهية العنصر.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): قيمة منطقية. إذا كانت `true`، لن يكون الإدخال تفاعليًا ويظهر باهتًا.
* `children`: لا يقبل `<input>` أبناء.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): نص. يحدد `id` النموذج `<form>` الذي ينتمي إليه الإدخال. إذا حُذف، يُستخدم أقرب نموذج أب.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): نص. يتجاوز `<form action>` الأب لـ `type="submit"` و `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): نص. يتجاوز `<form enctype>` الأب لـ `type="submit"` و `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): نص. يتجاوز `<form method>` الأب لـ `type="submit"` و `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): نص. يتجاوز `<form noValidate>` الأب لـ `type="submit"` و `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): نص. يتجاوز `<form target>` الأب لـ `type="submit"` و `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): نص. يحدد ارتفاع الصورة لإدخال `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): نص. يحدد `id` عنصر `<datalist>` الذي يحتوي خيارات الإكمال التلقائي.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): رقم. يحدد القيمة القصوى للإدخالات الرقمية وتاريخ/وقت.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): رقم. يحدد الحد الأقصى لطول النص وغيره من الإدخالات.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): رقم. يحدد القيمة الدنيا للإدخالات الرقمية وتاريخ/وقت.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): رقم. يحدد الحد الأدنى لطول النص وغيره.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): قيمة منطقية. يحدد ما إذا كان مسموحًا بعدة قيم لـ `type="file"` و `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): نص. يحدد اسم الإدخال [المُرسَل مع النموذج.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). مطلوب للإدخالات [المتحكَّم فيها.](#controlling-an-input-with-a-state-variable) تُطلق فورًا عند تغيير قيمة الإدخال من المستخدم (مثلًا عند كل ضغطة مفتاح). تتصرف مثل حدث [`input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) في المتصفح.
* `onChangeCapture`: نسخة من `onChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق فورًا عند تغيير القيمة من المستخدم. لأسباب تاريخية، من المتعارف عليه في React استخدام `onChange` بدلًا منها وهي مشابهة.
* `onInputCapture`: نسخة من `onInput` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق إذا فشل التحقق من صحة الإدخال عند إرسال النموذج. على عكس حدث `invalid` المدمج، ينتشر حدث React `onInvalid` إلى الأعلى.
* `onInvalidCapture`: نسخة من `onInvalid` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق بعد تغيير التحديد داخل `<input>`. يوسّع React حدث `onSelect` ليطلق أيضًا عند تحديد فارغ وعند التعديلات (التي قد تؤثر على التحديد).
* `onSelectCapture`: نسخة من `onSelect` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): نص. يحدد النمط الذي يجب أن تطابقه `value`.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): نص. يُعرض بلون باهت عندما تكون قيمة الإدخال فارغة.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): قيمة منطقية. إذا كانت `true`، لا يمكن للمستخدم تعديل الإدخال.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): قيمة منطقية. إذا كانت `true`، يجب توفير القيمة لإرسال النموذج.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): رقم. مشابه لضبط العرض، لكن الوحدة تعتمد على عنصر التحكم.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): نص. يحدد مصدر الصورة لإدخال `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): رقم موجب أو سلسلة `'any'`. يحدد المسافة بين القيم الصالحة.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): نص. أحد [أنواع الإدخال.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  نص. يحدد عرض الصورة لإدخال `type="image"`.

#### تنبيهات {/*caveats*/}

- تحتاج مربعات الاختيار إلى `checked` (أو `defaultChecked`)، لا `value` (ولا `defaultValue`).
- إذا تلقى حقل نص خاصية `value` نصية، يُعامل كـ [متحكَّم فيه.](#controlling-an-input-with-a-state-variable)
- إذا تلقى مربع اختيار أو زر اختيار خاصية `checked` منطقية، يُعامل كـ [متحكَّم فيه.](#controlling-an-input-with-a-state-variable)
- لا يمكن أن يكون الإدخال متحكَّمًا وغير متحكَّم في آن واحد.
- لا يمكن أن ينتقل الإدخال بين الحالتين خلال عمره.
- كل إدخال متحكَّم فيه يحتاج معالج حدث `onChange` يحدّث قيمته الداعمة بشكل متزامن.

---

## الاستخدام {/*usage*/}

### عرض إدخالات بأنواع مختلفة {/*displaying-inputs-of-different-types*/}

لعرض حقل إدخال، صيّر مكوّن `<input>`. افتراضيًا يكون إدخال نص. يمكنك تمرير `type="checkbox"` لمربع اختيار، و`type="radio"` لزر اختيار، [أو أحد أنواع الإدخال الأخرى.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### إرفاق تسمية بحقل إدخال {/*providing-a-label-for-an-input*/}

عادةً، تضع كل `<input>` داخل وسم [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). يخبر ذلك المتصفح أن التسمية مرتبطة بذلك الإدخال. عند النقر على التسمية، يركّز المتصفح الإدخال تلقائيًا. وهو مهم للوصولية: يعلن قارئ الشاشة نص التسمية عند تركيز الإدخال المرتبط.

إذا لم تستطع تداخل `<input>` داخل `<label>`، اربطهما بتمرير نفس المعرّف إلى `<input id>` و [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) لتجنب التعارض بين عدة نسخ من مكوّن واحد، أنشئ المعرّف بـ [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### تحديد قيمة ابتدائية لحقل إدخال {/*providing-an-initial-value-for-an-input*/}

يمكنك اختياريًا تحديد القيمة الابتدائية لأي إدخال. مرّرها كنص `defaultValue` لحقول النص. يجب أن تحدد مربعات الاختيار وأزرار الاختيار القيمة الابتدائية بقيمة منطقية `defaultChecked` بدلًا من ذلك.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### قراءة قيم الإدخال عند إرسال النموذج {/*reading-the-input-values-when-submitting-a-form*/}

أضف [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) حول حقولك مع [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) داخله. سيستدعي معالج `<form onSubmit>`. افتراضيًا، يرسل المتصفح بيانات النموذج إلى عنوان URL الحالي ويعيد تحميل الصفحة. يمكنك إلغاء ذلك باستدعاء `e.preventDefault()`. اقرأ بيانات النموذج بـ [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
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
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
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

أعطِ كل `<input>` اسمًا `name`، مثل `<input name="firstName" defaultValue="Taylor" />`. سيُستخدم الاسم كمفتاح في بيانات النموذج، مثل `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

افتراضيًا، `<button>` داخل `<form>` بلا سمة `type` يرسل النموذج. قد يكون ذلك مفاجئًا! إذا كان لديك مكوّن `Button` مخصص، فكّر باستخدام [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) بدلًا من `<button>` بلا نوع. ثم استخدم صراحةً `<button type="submit">` للأزرار التي *يجب* أن ترسل النموذج.

</Pitfall>

---

### التحكم بحقل إدخال بمتغير حالة {/*controlling-an-input-with-a-state-variable*/}

حقل مثل `<input />` *غير متحكَّم فيه.* حتى إذا [مررت قيمة ابتدائية](#providing-an-initial-value-for-an-input) مثل `<input defaultValue="Initial text" />`، يحدد JSX القيمة الابتدائية فقط لا القيمة الحالية.

**لتصيير إدخال *متحكَّم فيه*، مرِّر خاصية `value` (أو `checked` لمربعات الاختيار وأزرار الاختيار).** يفرض React على الإدخال أن يمتلك دائمًا `value` التي مررتها. عادةً تفعل ذلك بإعلان [متغير حالة:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

يكون الإدخال المتحكَّم فيه منطقيًا إذا احتجت الحالة أصلًا — مثلاً لإعادة تصيير الواجهة عند كل تعديل:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

مفيد أيضًا إذا أردت طرقًا متعددة لتعديل حالة الإدخال (مثلاً بالنقر على زر):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

لا يجب أن تكون `value` التي تمررها للمكوّنات المتحكَّم فيها `undefined` أو `null`. إذا احتجت قيمة ابتدائية فارغة (كحقل `firstName` أدناه)، ابدأ متغير الحالة بسلسلة فارغة (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**إذا مررت `value` دون `onChange`، يصبح الكتابة في الإدخال مستحيلة.** عند التحكم بإدخال بقيمة `value`، *تفرض* عليه دائمًا تلك القيمة. فإذا مررت متغير حالة كـ `value` ونسيت تحديثه بشكل متزامن في `onChange`، يعيد React الإدخال بعد كل ضغطة إلى `value` التي حددتها.

</Pitfall>

---

### تحسين إعادة التصيير عند كل ضغطة مفتاح {/*optimizing-re-rendering-on-every-keystroke*/}

عند استخدام إدخال متحكَّم فيه، تضبط الحالة عند كل ضغطة. إذا أعاد المكوّن الذي يحوي الحالة تصيير شجرة كبيرة، قد يبطئ ذلك. هناك عدة طرق لتحسين الأداء.

مثلاً، لنفترض نموذجًا يعيد تصيير كل محتوى الصفحة عند كل ضغطة:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

بما أن `<PageContent />` لا يعتمد على حالة الإدخال، يمكنك نقل حالة الإدخال إلى مكوّن خاص بها:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

يحسّن ذلك الأداء كثيرًا لأن `SignupForm` فقط يُعاد تصييره عند كل ضغطة.

إذا تعذر تجنب إعادة التصيير (مثلاً إذا اعتمد `PageContent` على قيمة إدخال البحث)، يتيح [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) إبقاء الإدخال المتحكَّم فيه سريع الاستجابة حتى أثناء إعادة تصيير كبيرة.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### حقل النص لا يتحدث عند الكتابة {/*my-text-input-doesnt-update-when-i-type-into-it*/}

إذا صيّرت إدخالًا بـ `value` دون `onChange`، ستظهر رسالة خطأ في الطرفية:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

كما تقترح رسالة الخطأ، إذا أردت فقط [تحديد القيمة *الابتدائية*،](#providing-an-initial-value-for-an-input) مرِّر `defaultValue` بدلًا من ذلك:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

إذا أردت [التحكم بهذا الإدخال بمتغير حالة،](#controlling-an-input-with-a-state-variable) حدّد معالج `onChange`:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

إذا كانت القيمة مقصودة للقراءة فقط، أضف خاصية `readOnly` لكتم الخطأ:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### مربع الاختيار لا يتحدث عند النقر {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

إذا صيّرت مربع اختيار بـ `checked` دون `onChange`، ستظهر رسالة خطأ في الطرفية:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

كما تقترح الرسالة، إذا أردت فقط [تحديد القيمة *الابتدائية*،](#providing-an-initial-value-for-an-input) مرِّر `defaultChecked` بدلًا من ذلك:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

إذا أردت [التحكم بمربع الاختيار بمتغير حالة،](#controlling-an-input-with-a-state-variable) حدّد معالج `onChange`:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

لمربعات الاختيار اقرأ `e.target.checked` وليس `e.target.value`.

</Pitfall>

إذا كان مربع الاختيار مقصودًا للقراءة فقط، أضف `readOnly` لكتم الخطأ:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### مؤشر الإدخال يقفز إلى البداية عند كل ضغطة {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

إذا [تحكمت بإدخال،](#controlling-an-input-with-a-state-variable) يجب تحديث متغير الحالة إلى قيمة الإدخال من DOM أثناء `onChange`.

لا يمكنك تحديثه إلى شيء غير `e.target.value` (أو `e.target.checked` لمربعات الاختيار):

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

إذا لم يُحلّ المشكل، قد يُزال الإدخال ويُعاد إدراجه في DOM عند كل ضغطة. يحدث ذلك إذا [أعدت تهيئة الحالة](/learn/preserving-and-resetting-state) بالخطأ عند كل إعادة تصيير، مثلاً إذا تلقى الإدخال أو أحد الآباء دائمًا سمة `key` مختلفة، أو إذا دمجت تعريفات دوال المكوّنات (غير مدعوم ويجعل المكوّن «الداخلي» يُعتبر شجرة مختلفة دائمًا).

---

### أتلقى خطأ: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


إذا مررت `value` للمكوّن، يجب أن تبقى سلسلة طوال عمره.

لا يمكنك تمرير `value={undefined}` أولًا ثم لاحقًا `value="some string"` لأن React لن يعرف إن كنت تريد المكوّن غير متحكَّم فيه أو متحكَّمًا فيه. يجب أن يتلقى المكوّن المتحكَّم فيه دائمًا `value` نصية، لا `null` ولا `undefined`.

إذا جاءت `value` من واجهة برمجة أو متغير حالة، قد تُهيأ إلى `null` أو `undefined`. عندها اضبطها ابتدائيًا إلى سلسلة فارغة (`''`)، أو مرِّر `value={someValue ?? ''}` لضمان أن `value` نص.

وبالمثل، إذا مررت `checked` لمربع اختيار، تأكد أنها دائمًا قيمة منطقية.

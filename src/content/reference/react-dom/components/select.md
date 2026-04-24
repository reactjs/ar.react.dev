---
title: "<select>"
---

<Intro>

يتيح لك [مكوّن `<select>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) عرض قائمة منسدلة مع خيارات.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<select>` {/*select*/}

لعرض قائمة منسدلة، صيّر [مكوّن `<select>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<select>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

يمكنك [جعل القائمة المنسدلة متحكَّمًا فيها](#controlling-a-select-box-with-a-state-variable) بتمرير خاصية `value`:

* `value`: نص (أو مصفوفة نصوص عند [`multiple={true}`](#enabling-multiple-selection)). يتحكم في الخيار المحدد. يجب أن يطابق كل نص `value` قيمة `value` لأحد عناصر `<option>` المتداخلة داخل `<select>`.

عند تمرير `value`، يجب أيضًا تمرير معالج `onChange` يحدّث القيمة الممرَّرة.

إذا كانت `<select>` غير متحكَّم فيها، يمكنك تمرير خاصية `defaultValue` بدلًا من ذلك:

* `defaultValue`: نص (أو مصفوفة نصوص عند [`multiple={true}`](#enabling-multiple-selection)). يحدد [الخيار المحدد ابتدائيًا.](#providing-an-initially-selected-option)

تنطبق خصائص `<select>` التالية على القوائم غير المتحكَّم فيها والمتحكَّم فيها معًا:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): نص. يحدد أحد [سلوكيات الإكمال التلقائي](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) المحتملة.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): قيمة منطقية. إذا كانت `true`، يركّز React العنصر عند التركيب.
* `children`: يقبل `<select>` مكوّنات [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) و [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) و [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) كأبناء. يمكنك أيضًا تمرير مكوّناتك طالما أنها تصيّر في النهاية أحد المكوّنات المسموح بها. إذا مرّرت مكوّناتك التي تصيّر وسوم `<option>`، فيجب أن يكون لكل `<option>` تُصيّره خاصية `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): قيمة منطقية. إذا كانت `true`، لن تكون القائمة تفاعلية وستظهر باهتة.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): نص. يحدد `id` النموذج `<form>` الذي تنتمي إليه القائمة. إذا حُذف، يُستخدم أقرب نموذج أب.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): قيمة منطقية. إذا كانت `true`، يسمح المتصفح بـ [تحديد متعدد.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): نص. يحدد اسم القائمة المُرسَل [مع النموذج.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). مطلوب للقوائم [المتحكَّم فيها.](#controlling-a-select-box-with-a-state-variable) تُطلق فورًا عند اختيار المستخدم خيارًا مختلفًا. تتصرف مثل حدث [`input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) في المتصفح.
* `onChangeCapture`: نسخة من `onChange` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق فورًا عند تغيير القيمة من المستخدم. لأسباب تاريخية، من المتعارف عليه في React استخدام `onChange` بدلًا منها وهي مشابهة.
* `onInputCapture`: نسخة من `onInput` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): دالة [معالج حدث `Event`](/reference/react-dom/components/common#event-handler). تُطلق إذا فشل التحقق من صحة الإدخال عند إرسال النموذج. على عكس حدث `invalid` المدمج، ينتشر حدث React `onInvalid` إلى الأعلى في شجرة المكوّنات.
* `onInvalidCapture`: نسخة من `onInvalid` تُطلق في [طور الالتقاط.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): قيمة منطقية. إذا كانت `true`، يجب توفير القيمة لإرسال النموذج.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): رقم. لقوائم `multiple={true}`، يحدد العدد المفضل للعناصر المرئية ابتدائيًا.

#### تنبيهات {/*caveats*/}

- على عكس HTML، لا يُدعم تمرير سمة `selected` إلى `<option>`. استخدم [`<select defaultValue>`](#providing-an-initially-selected-option) للقوائم غير المتحكَّم فيها و [`<select value>`](#controlling-a-select-box-with-a-state-variable) للمتحكَّم فيها.
- إذا تلقت القائمة خاصية `value`، تُعامل كـ [متحكَّم فيها.](#controlling-a-select-box-with-a-state-variable)
- لا يمكن أن تكون القائمة متحكَّمًا وغير متحكَّم في آن واحد.
- لا يمكن أن تنتقل القائمة بين الحالتين خلال عمرها.
- كل قائمة متحكَّم فيها تحتاج معالج حدث `onChange` يحدّث قيمتها الداعمة بشكل متزامن.

---

## الاستخدام {/*usage*/}

### عرض قائمة منسدلة مع خيارات {/*displaying-a-select-box-with-options*/}

صيّر `<select>` مع قائمة من مكوّنات `<option>` داخله لعرض قائمة منسدلة. أعط كل `<option>` قيمة `value` تمثل البيانات المُرسَلة مع النموذج.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### إرفاق تسمية بقائمة منسدلة {/*providing-a-label-for-a-select-box*/}

عادةً، تضع كل `<select>` داخل وسم [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). يخبر ذلك المتصفح أن التسمية مرتبطة بتلك القائمة. عند النقر على التسمية، يركّز المتصفح القائمة تلقائيًا. وهو مهم للوصولية: قارئ الشاشة يعلن نص التسمية عند تركيز القائمة.

إذا لم تستطع تداخل `<select>` داخل `<label>`، اربطهما بتمرير نفس المعرّف إلى `<select id>` و [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) لتجنب التعارض بين عدة نسخ من مكوّن واحد، أنشئ المعرّف بـ [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### تحديد خيار محدد ابتدائيًا {/*providing-an-initially-selected-option*/}

افتراضيًا، يختار المتصفح أول `<option>` في القائمة. لاختيار خيار مختلف افتراضيًا، مرِّر `value` ذلك الخيار كـ `defaultValue` لعنصر `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

على عكس HTML، لا يُدعم تمرير سمة `selected` إلى `<option>` فردي.

</Pitfall>

---

### تمكين التحديد المتعدد {/*enabling-multiple-selection*/}

مرِّر `multiple={true}` إلى `<select>` للسماح بتحديد عدة خيارات. في هذه الحالة، إذا حددت أيضًا `defaultValue` للخيارات المحددة ابتدائيًا، يجب أن تكون مصفوفة.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### قراءة قيمة القائمة عند إرسال النموذج {/*reading-the-select-box-value-when-submitting-a-form*/}

أضف [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) حول القائمة مع [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) داخله. سيستدعي معالج `<form onSubmit>`. افتراضيًا، يرسل المتصفح بيانات النموذج إلى عنوان URL الحالي ويعيد تحميل الصفحة. يمكنك إلغاء ذلك باستدعاء `e.preventDefault()`. اقرأ بيانات النموذج بـ [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
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
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

أعطِ `<select>` اسمًا `name`، مثل `<select name="selectedFruit" />`. سيُستخدم الاسم كمفتاح في بيانات النموذج، مثل `{ selectedFruit: "orange" }`.

إذا استخدمت `<select multiple={true}>`، فستتضمن [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) التي تقرأها من النموذج كل قيمة محددة كزوج اسم-قيمة منفصل. راقب سجلات الطرفية في المثال أعلاه.

</Note>

<Pitfall>

افتراضيًا، *أي* `<button>` داخل `<form>` يرسل النموذج. قد يكون ذلك مفاجئًا! إذا كان لديك مكوّن `Button` مخصص، فكّر بإرجاع [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) بدلًا من `<button>` بدون نوع. ثم استخدم صراحةً `<button type="submit">` للأزرار التي *يجب* أن ترسل النموذج.

</Pitfall>

---

### التحكم بالقائمة المنسدلة بمتغير حالة {/*controlling-a-select-box-with-a-state-variable*/}

قائمة مثل `<select />` *غير متحكَّم فيها.* حتى إذا [مررت قيمة محددة ابتدائيًا](#providing-an-initially-selected-option) مثل `<select defaultValue="orange" />`، يحدد JSX القيمة الابتدائية فقط لا القيمة الحالية.

**لتصيير قائمة *متحكَّم فيها*، مرِّر خاصية `value`.** يفرض React على القائمة أن تمتلك دائمًا القيمة التي مررتها. عادةً تتحكم بالقائمة عبر [متغير حالة:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

مفيد إذا أردت إعادة تصيير جزء من الواجهة عند كل تغيير اختيار.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**إذا مررت `value` دون `onChange`، يصبح اختيار خيار مستحيلًا.** عند التحكم بالقائمة بقيمة `value`، *تفرض* عليها دائمًا تلك القيمة. فإذا مررت متغير حالة كـ `value` ونسيت تحديثه بشكل متزامن في `onChange`، يعيد React القائمة بعد كل تغيير إلى `value` التي حددتها.

على عكس HTML، لا يُدعم تمرير `selected` إلى `<option>` فردي.

</Pitfall>

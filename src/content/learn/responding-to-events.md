---
title: الاستجابة للأحداث
---

<Intro>

يتيح لك React إضافة *معالجات أحداث* إلى JSX. معالجات الأحداث دوالك الخاصة التي تُستدعى استجابةً للتفاعلات مثل النقر، التمرير، تركيز حقول النماذج، وغير ذلك.

</Intro>

<YouWillLearn>

* طرق مختلفة لكتابة معالج حدث
* كيف تمرّر منطق معالجة الأحداث من مكوّن أب
* كيف تنتشر الأحداث وكيف توقفها

</YouWillLearn>

## إضافة معالجات أحداث {/*adding-event-handlers*/}

لإضافة معالج حدث، عرّف دالة ثم [مرّرها كخاصية](/learn/passing-props-to-a-component) إلى وسم JSX المناسب. مثلًا، زر لا يفعل شيئًا بعد:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

لجعله يعرض رسالة عند النقر، اتبع ثلاث خطوات:

1. صرّح بدالة اسمها `handleClick` *داخل* مكوّن `Button`.
2. نفّذ المنطق داخلها (استخدم `alert` لعرض الرسالة).
3. أضف `onClick={handleClick}` إلى `<button>` في JSX.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

عرّفت `handleClick` ثم [مرّرتها كخاصية](/learn/passing-props-to-a-component) إلى `<button>`. `handleClick` هي **معالج حدث.** دوال معالجة الأحداث:

* تُعرَّف عادة *داخل* مكوّناتك.
* أسماؤها تبدأ بـ `handle` ثم اسم الحدث.

بالاتفاق، شائع تسمية المعالجات `handle` متبوعًا باسم الحدث. سترى غالبًا `onClick={handleClick}`، `onMouseEnter={handleMouseEnter}`، وهكذا.

بدل ذلك، يمكنك تعريف المعالج مضمّنًا في JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

أو بإيجاز بدالة سهمية:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

كل هذه الأساليب متكافئة. المعالجات المضمّنة مناسبة للدوال القصيرة.

<Pitfall>

يجب *تمرير* الدوال لمعالجات الأحداث، لا *استدعاؤها*. مثلًا:

| تمرير دالة (صحيح)     | استدعاء دالة (خطأ)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

الفرق دقيق. في المثال الأول، تُمرَّر `handleClick` كمعالج `onClick`. يخبر React بتذكّرها واستدعائها عند نقر المستخدم فقط.

في الثاني، الأقواس `()` في نهاية `handleClick()` تنفّذ الدالة *فورًا* أثناء [الرسم](/learn/render-and-commit)، دون نقرات. لأن JavaScript داخل [أقواس JSX `{` و `}`](/learn/javascript-in-jsx-with-curly-braces) يُنفَّذ مباشرة.

عند الكتابة المضمّنة، نفس الفخ يظهر بشكل آخر:

| تمرير دالة (صحيح)            | استدعاء دالة (خطأ)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


تمرير كود كهذا لا يُطلق عند النقر — يُطلق في كل رسم للمكوّن:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

إن أردت معالجًا مضمّنًا، لفّه بدالة مجهولة:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

بدل تنفيذ الكود في كل رسم، يُنشئ دالة تُستدعى لاحقًا.

في الحالتين، ما تريد تمريره هو دالة:

* `<button onClick={handleClick}>` يمرّر دالة `handleClick`.
* `<button onClick={() => alert('...')}>` يمرّر الدالة `() => alert('...')`.

[اقرأ المزيد عن الدوال السهمية.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### قراءة الخصائص في معالجات الأحداث {/*reading-props-in-event-handlers*/}

بما أن معالجات الأحداث تُعرَّف داخل المكوّن، تصل إلى خصائصه. إليك زر يعرض تنبيهًا بخاصية `message` عند النقر:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

هذا يجعل الزرين يعرضان رسائل مختلفة. غيّر الرسائل الممرّرة إليهما.

### تمرير معالجات الأحداث كخصائص {/*passing-event-handlers-as-props*/}

غالبًا تريد أن يحدد المكوّن الأب معالج حدث الطفل. فكر في الأزرار: حسب موضع `Button`، قد تريد دالة مختلفة — واحدة تشغّل فيلمًا وأخرى ترفع صورة. 

لفعل ذلك، مرّر خاصية يستقبلها المكوّن من أبيه كمعالج الحدث:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

هنا، `Toolbar` يرسم `PlayButton` و`UploadButton`:

- `PlayButton` يمرّر `handlePlayClick` كخاصية `onClick` إلى `Button` الداخلي.
- `UploadButton` يمرّر `() => alert('Uploading!')` كـ `onClick` إلى `Button` الداخلي.

أخيرًا، `Button` يستقبل خاصية اسمها `onClick`. يمرّرها مباشرة إلى `<button>` المدمج بـ `onClick={onClick}`. يخبر React باستدعاء الدالة الممرّرة عند النقر.

إن استخدمت [نظام تصميم](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)، شائع أن تحتوي الأزرار على تنسيق دون سلوك محدد. بدل ذلك، `PlayButton` و`UploadButton` يمرّران معالجات الأحداث.

### تسمية خصائص معالجات الأحداث {/*naming-event-handler-props*/}

المكوّنات المدمجة مثل `<button>` و`<div>` تدعم فقط [أسماء أحداث المتصفح](/reference/react-dom/components/common#common-props) مثل `onClick`. لكن عند بناء مكوّناتك، يمكنك تسمية خصائص المعالجات كما تشاء.

بالاتفاق، خصائص معالجات الأحداث تبدأ بـ `on` ثم حرف كبير.

مثلًا، يمكن أن تُسمى خاصية `Button` `onSmash` بدل `onClick`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

في المثال، `<button onClick={onSmash}>` يبيّن أن `<button>` المدمج (بأحرف صغيرة) ما زال يحتاج خاصية `onClick`، لكن اسم الخاصية التي يستقبلها `Button` المخصص لك متروك لك!

عند دعم تفاعلات متعددة، قد تسمّي خصائص المعالجات بمفاهيم خاصة بالتطبيق. مثلًا، `Toolbar` يستقبل `onPlayMovie` و`onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

لاحظ أن `App` لا يحتاج معرفة *ماذا* يفعل `Toolbar` بـ `onPlayMovie` أو `onUploadImage`. هذا تفصيل تنفيذ `Toolbar`. هنا، `Toolbar` يمرّرهما كمعالجات `onClick` لأزراره، وقد يطلقهما لاحقًا من اختصار لوحة مفاتيح. تسمية الخصائص بمفاهيم التطبيق مثل `onPlayMovie` يمنح مرونة تغيير الاستخدام لاحقًا.
  
<Note>

استخدم وسوم HTML المناسبة لمعالجات الأحداث. مثلًا، للنقر استخدم [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) بدل `<div onClick={handleClick}>`. زر المتصفح الحقيقي يفعّل سلوكًا مدمجًا مثل التنقل بلوحة المفاتيح. إن لم يعجبك شكل الزر الافتراضي وأردته أشبه برابط أو عنصر آخر، يمكنك ذلك بـ CSS. [تعرّف على كتابة ترميز يمكن الوصول إليه.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
  
</Note>

## انتشار الأحداث {/*event-propagation*/}

معالجات الأحداث تلتقط أيضًا أحداث أي أبناء. نقول إن الحدث «يفقاع» أو «ينتشر» صعود الشجرة: يبدأ من موقع الحدث ثم يصعد.

هذا `<div>` يحتوي زرين. لكل من `<div>` *و* كل زر معالج `onClick` خاص. أي المعالجات تُنفَّذ عند النقر على زر؟

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

عند النقر على أي زر، يُنفَّذ `onClick` الخاص به أولًا، ثم `onClick` لـ `<div>` الأب. فيظهر تنبيهان. عند النقر على شريط الأدوات نفسه، يُنفَّذ فقط `onClick` للأب.

<Pitfall>

كل الأحداث تنتشر في React ما عدا `onScroll`، الذي يعمل فقط على وسم JSX الذي تربطه به.

</Pitfall>

### إيقاف الانتشار {/*stopping-propagation*/}

معالجات الأحداث تستقبل **كائن حدث** كوسيط وحيد. بالاتفاق، غالبًا `e` اختصارًا لـ «event». يمكنك قراءة معلومات عن الحدث منه.

يسمح كائن الحدث أيضًا بإيقاف الانتشار. لمنع وصول الحدث للآباء، استدعِ `e.stopPropagation()` كما يفعل مكوّن `Button` هذا:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

عند النقر على زر:

1. React يستدعي معالج `onClick` الممرّر إلى `<button>`. 
2. ذلك المعالج، المعرف في `Button`، يفعل التالي:
   * يستدعي `e.stopPropagation()` فيمنع الحدث من الصعود أكثر.
   * يستدعي دالة `onClick` الممرّرة كخاصية من `Toolbar`.
3. تلك الدالة، المعرفة في `Toolbar`، تعرض تنبيه الزر.
4. بما أن الانتشار أُوقف، معالج `onClick` لـ `<div>` الأب *لا* يُنفَّذ.

نتيجة `e.stopPropagation()`، النقر على الأزرار يعرض تنبيهًا واحدًا (من `<button>`) لا اثنين (من الزر وشريط الأدوات). النقر على الزر ليس كالنقر على الشريط المحيط، فإيقاف الانتشار منطقي لهذه الواجهة.

<DeepDive>

#### أحداث مرحلة الالتقاط {/*capture-phase-events*/}

في حالات نادرة، قد تحتاج التقاط كل الأحداث على العناصر الفرعية *حتى لو أوقفوا الانتشار*. مثلًا، تسجيل كل نقرة للتحليلات بغض النظر عن منطق الانتشار. أضف `Capture` في نهاية اسم الحدث:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

كل حدث ينتشر في ثلاث مراحل: 

1. ينزل لأسفل، مستدعيًا كل معالجات `onClickCapture`.
2. يُنفَّذ معالج `onClick` للعنصر المنقور. 
3. يصعد، مستدعيًا كل معالجات `onClick`.

أحداث الالتقاط مفيدة لراوتر أو تحليلات، لكنك غالبًا لن تستخدمها في كود التطبيق.

</DeepDive>

### تمرير المعالجات بديلًا للانتشار {/*passing-handlers-as-alternative-to-propagation*/}

لاحظ أن معالج النقر هنا يشغّل سطرًا *ثم* يستدعي خاصية `onClick` من الأب:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

يمكنك إضافة كود قبل استدعاء `onClick` للأب أيضًا. هذا النمط *بديل* للانتشار. يتيح للطفل معالجة الحدث وللأب تحديد سلوك إضافي. بخلاف الانتشار، ليس تلقائيًا. لكن الفائدة أنك تتبع سلسلة الكود الناتجة عن الحدث بوضوح.

إن اعتمدت الانتشار وصعب تتبع المعالجات، جرّب هذا الأسلوب.

### منع السلوك الافتراضي {/*preventing-default-behavior*/}

لبعض أحداث المتصفح سلوك افتراضي. مثلًا، حدث إرسال `<form>` عند النقر على زر بداخله يعيد تحميل الصفحة افتراضيًا:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

يمكنك استدعاء `e.preventDefault()` على كائن الحدث لمنع ذلك:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

لا تخلط بين `e.stopPropagation()` و`e.preventDefault()`. كلاهما مفيد لكنهما مستقلان:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) يمنع معالجات الأحداث على الوسوم الأعلى من التشغيل.
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) يمنع السلوك الافتراضي للمتصفح للأحداث القليلة التي له سلوك.

## هل يمكن أن يكون لمعالجات الأحداث تأثيرات جانبية؟ {/*can-event-handlers-have-side-effects*/}

بالتأكيد! معالجات الأحداث أفضل مكان للتأثيرات الجانبية.

بخلاف دوال الرسم، معالجات الأحداث لا تحتاج أن تكون [نقية](/learn/keeping-components-pure)، فهي مكان ممتاز *لتغيير* شيء — مثل قيمة حقل استجابة للكتابة، أو قائمة استجابة لضغطة زر. لكن لتغيير معلومات، تحتاج طريقة تخزينها. في React ذلك بـ [الحالة، ذاكرة المكوّن.](/learn/state-a-components-memory) ستتعلمها في الصفحة التالية.

<Recap>

* تتعامل مع الأحداث بتمرير دالة كخاصية لعنصر مثل `<button>`.
* يجب *تمرير* معالجات الأحداث، **لا استدعاؤها!** `onClick={handleClick}`، لا `onClick={handleClick()}`.
* يمكنك تعريف معالج الحدث منفصلًا أو مضمّنًا.
* معالجات الأحداث داخل المكوّن، فيمكنها الوصول للخصائص.
* يمكنك إعلان معالج في الأب وتمريره كخاصية للطفل.
* يمكنك تعريف خصائص معالج بأسماء خاصة بالتطبيق.
* الأحداث تنتشر صعودًا. استدعِ `e.stopPropagation()` على الوسيط الأول لمنع ذلك.
* قد يكون للأحداث سلوك افتراضي غير مرغوب. استدعِ `e.preventDefault()` لمنعه.
* استدعاء خاصية معالج الحدث صراحةً من معالج الطفل بديل جيد للانتشار.

</Recap>



<Challenges>

#### إصلاح معالج حدث {/*fix-an-event-handler*/}

يُفترض أن يبدّل هذا الزر خلفية الصفحة بين الأبيض والأسود. لكن لا شيء يحدث عند النقر. أصلح المشكلة. (لا تقلق بشأن منطق `handleClick` — هذا الجزء سليم.)

<Sandpack>

```js {expectedErrors: {'react-compiler': [5, 7]}}
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

المشكلة أن `<button onClick={handleClick()}>` *تستدعي* `handleClick` أثناء الرسم بدل *تمريرها*. إزالة `()` لتصبح `<button onClick={handleClick}>` تحل المشكلة:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

بدلًا من ذلك، يمكنك لف الاستدعاء في دالة مثل `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### ربط الأحداث {/*wire-up-the-events*/}

مكوّن `ColorSwitch` يرسم زرًا. يُفترض أن يغيّر لون الصفحة. اربطه بخاصية معالج الحدث `onChangeColor` التي يستقبلها من الأب بحيث يغيّر النقر اللون.

بعد ذلك، لاحظ أن النقر يزيد أيضًا عدّاد النقرات على الصفحة. زميلك الذي كتب الأب يصر أن `onChangeColor` لا يزيد أي عدّاد. ما الذي قد يحدث؟ أصلحه بحيث يغيّر النقر اللون *فقط* ولا يزيد العدّاد.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

أولًا، أضف معالج الحدث مثل `<button onClick={onChangeColor}>`.

لكن يظهر مشكلة العدّاد. إن `onChangeColor` لا تفعل ذلك، كما يصر زميلك، فالسبب أن الحدث ينتشر صعودًا ومعالجًا أعلى يفعل ذلك. لحل المشكلة، أوقف الانتشار. لا تنسَ استدعاء `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>

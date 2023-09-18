---
title: الاستجابة للمدخلات باستخدام الحالة
---

<Intro>

React توفر طريقة تصريحيّة (declarative) لتعديل واجهة المستخدم (UI). بدلا من تعديل أجزاء منفردة من واجهة المستخدم مباشرة، يمكنك وصف الحالات المختلفة التي يأخذها مكوّنك، والانتقال بينهم كاستجابة لمدخلات المستخدم. هذا مشابه لتصور المصممين عن واجهة المستخدم. 


</Intro>

<YouWillLearn>

* كيف تختلف البرمجة التصريحية لواجهة المستخدم (declarative UI programming) عن البرمجة الأمرية لواجهة المستخدم (imperative UI programming)
* كيفية استعراض الحالات المرئية المختلفة التي يأخذها مكوّنك
* كيفية تنشيط التغييرات بين الحالات المرئية المختلفة من خلال الكود
  
</YouWillLearn>

## كيف تُقارَن واجهة المستخدم التصريحية (declarative UI) بالأمرية (imperative) {/*how-declarative-ui-compares-to-imperative*/}

عندما تصمم تعاملات واجهة المستخدم، عليك غالبًا التفكير في كيفية *تغيّر* واجهة المستخدم كاستجابة لاجراءات المستخدم. فكر في نموذج يسمح للمستخدم بإرسال إجابة:

* عندما تكتب شيئًا داخل النموذج، الزر "أرسل" **يصبح مفعلًا.**
* عندما تضغط على "أرسل"، كلٌ من النموذج والزر **يصبح معطلا** ومؤشر التحميل **يظهر.**
* لو نجح طلب الشبكة، النموج **يبدأ بالاختفاء،** ورسالة "شكرًا لك" **تظهر.**
* لو فشل طلب الشبكة، رسالة خطأٍ **تظهر،** والنموذج **يصبح مفعلًا** مجددا.

في **البرمجة الأمرية (imperative programming)**، يتوافق ما ذُكر أعلاه مباشرة مع طريقة تطبيق التعاملات. عليك أن تكتب التعليمات التامة لتعديل واجهة المستخدم معتمدا على ما حصل للتو. إليك طريقة أخرى لتفكر في هذا الأمر: تخيل نفسك راكبا إلى جانب أحدهم في سيارة مع إخباره في كل منعطف تلو الآخر عن وجهة الذهاب. 

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

هم لا يعلمون إلى أين تريد أن تذهب، هم يتبعون أوامرك فقط. (ولو أنك أعطيتهم الاتجاهات الخاطئة، سوف ينتهي بك المطاف لوجهة خاطئة!) هذا يطلق عليه *أمري (imperative)* لأن عليك أن "تأمر" كل عنصر، بداية من مؤشر التحميل إلى الزر، مخبرًا
الكمبيوتر عن *كيفية* تحديث واجهة المستخدم (UI).

في هذا المثال للبرمجة الأمرية لواجهة المستخدم، النموذج مبنيّ *بدون* React. إنه يستخدم [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) المتصفح فقط:

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'إسطنبول') {
        resolve();
      } else {
        reject(new Error('توقع جيد ولكن إجابة خاطئة. حاول مرة أخرى!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>اختبار المدينة</h2>
  <p>
    ما هي المدينة الواقعة على قارتين؟
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>أرسل</button>
  <p id="loading" style="display: none">جارٍ التحميل...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">هذا صحيح!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

تعديل واجهة المستخدم (UI) أمريًّا يعمل بشكل جيد كفاية للأمثلة المعزولة، ولكنه يصبح أكثر صعوبة بشكل استثنائي عندما تدير أنظمة أكثر تعقيدًا. تخيل تحديث صفحة مليئة بالنماذج المختلفة مثل هذه هنا. إضافة عنصر واجهة مستخدم جديد سيتطلب فحص كامل الكود الموجود بحرص للتأكد من أنك لم تقم بعمل خطأ(على سبيل المثال، نسيان إظهار أو إخفاء شيء ما).

React صُنعت لحل هذه المشكلة. 

في React، لن تقوم بتعديل واجهة المستخدم مباشرة -- يعني أنك لن تقوم بتفعيل، تعطيل، إظهار، أو إخفاء مكوّنات مباشرة. بدلا عن ذلك، سوف **تصف ما تريده أن يظهر،** و React سوف تدبر كيفية تحديث واجهة المستخدم. فكر في أخذ سيارة أجرة وإخبار السائق إلي أين تريد أنت تذهب بدلا من إخباره إلي أين ينعطف. وظيفة السائق هي أن يوصلك إلى هناك، وربما قد يعرف اختصارات لم تأخذها أنت بالحسبان.

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## التفكير في واجهة المستخدم (UI) تصريحيًا {/*thinking-about-ui-declaratively*/}

لقد رأيت كيفية تنفيذ نموذج أمريَّا أعلاه. لفهم أفضل لكيفية التفكير في React، سوف تمر بإعادة تنفيذ واجهة المستخدم (UI) هذه باستخدام React أدناه:

1. **عيّن** الحالات المرئية المختلفة لمكوّنك
2. **حدد** ما ينشط تغيرات  تلك الحالات
3. **مثّل** الحالة في الذاكرة باستخدام `useState`
4. **احذف** أيّ متغيرات حالة غير ضرورية
5. **اربط** معالجات الأحداث لتعيين الحالة

### الخطوة 1: عين الحالات المرئية المختلفة لمكوّنك {/*step-1-identify-your-components-different-visual-states*/}

في علوم الحاسب، ربما تسمع عن ["آلة حالة (state machine)"](https://en.wikipedia.org/wiki/Finite-state_machine) كونها واحدة من ضمن "حالات" متعددة.إذا كنت تعمل مع مصمم، لربما رأيت نماذج تجريبية لـ"الحالات المرئية" المختلفة 

أولًا، أنت تحتاج لتصور جميع "الحالات" المختلفة لواجهة المستخدم (UI) التي قد يراها المستخدم: 
*  **فارغة**: النموذج يحتوي زر "إرسال" معطل.
* **كتابة**: النموذج يحتوي زر "إرسال" مفعّل.
* **إرسال**: النموذج معطل تمامًا. يتم عرض مؤشر التحميل.
* **نجاح**: يتم عرض رسالة "شكرًا لك" بدلًا من النموذج.
* **خطأ**: مثل حالة الكتابة، ولكن مع رسالة خطأ إضافية

تمامًا مثل المصمم، سترغب في "تجربة" أو إنشاء "نماذج تجريبية" للحالات المختلفة قبل أن تضيف المنطق. على سبيل المثال، ها هو نموذج تجريبي للجزء المرئي فقط من النموذج. هذا النموذج التجريبي متحكم به بواسطة خاصيّة تدعى `statue` مع قيمة افتراضية `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>هذا صحيح!</h1>
  }
  return (
    <>
      <h2>اختبار المدينة</h2>
      <p>
        في أي مدينة يوجد لوحة إعلانية تقوم بتحويل الهواء لمياه صالحة للشرب؟
      </p>
      <form>
        <textarea />
        <br />
        <button>
          أرسل
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

يمكنك تسمية الخاصيّة أيّ شيء تريد، التسمية ليست مهمة. جرب تعديل `status = 'empty'` إلى `status = 'success'` لترى رسالة النجاح تظهر. التجربة تتيح لك التكرار السريع على واجهة المستخدم قبل ربط أي منطق. ها هو نموذج تجريبي أكثر تفصيلًا لنفس المكوّن، يظل "متحكم" بواسطة الخاصية `status`:

<Sandpack>

```js
export default function Form({
  // جرب 'submitting'، 'error'، 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>هذا صحيح!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        في أي مدينة يوجد لوحة إعلانية تقوم بتحويل الهواء لمياه صالحة للشرب؟
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          أرسل
        </button>
        {status === 'error' &&
          <p className="Error">
            توقع جيد ولكن إجابة خاطئة. حاول مرة أخرى!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### عرض عديد من الحالات المرئية مرة واحدة {/*displaying-many-visual-states-at-once*/}

لو أن لمكون العديد من الحالات المرئية، قد يكون ملائما عرضها جميعها في صفحة واحدة: 

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>نموذج ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>هذا صحيح!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        أرسل
      </button>
      {status === 'error' &&
        <p className="Error">
          توقع جيد ولكن إجابة خاطئة. حاول مرة أخرى!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

صفحات مثل هذه غالبًا يطلق عليها "living styleguides" أو "storybooks" 

</DeepDive>

###  الخطوة 2: حدد ما ينشط تغيرات تلك الحالة {/*step-2-determine-what-triggers-those-state-changes*/}

يمكنك تنشيط تحديثات الحالة كاستجابة إلى نوعين من المدخلات:

* **مدخلات الإنسان،** مثل الضغط على زر، الكتابة في حقل، زيارة رابط.
* **مدخلات الكمبيوتر** مثل وصول رد الشبكة، استكمال المؤقت، تحميل الصورة

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

في كلتا الحالتين، **يجب عليك تعيين [متغيرات الحالة (state variables)](/learn/state-a-components-memory#anatomy-of-usestate) لتُحدّث واجهة المستخدم (UI).** من أجل النموذج الذي تطوره، سوف تحتاج لتغيير الحالة كنتيجة لقليل من المدخلات المختلفة:

**تغيرت مدخل النص** (الإنسان) سوف يغيرها من الحالة *الفارغة* إلى حالة *الكتابة* أو العكس، يعتمد على ما إذا كان حقل النص فارغًا أم لا.
**الضغط على زر الإرسال** (الإنسان) سوف يغيرها إلى حالة *الإرسال*
* **Successful network response** (computer) should switch it to the *Success* state.
* **Failed network response** (computer) should switch it to the *Error* state with the matching error message.

<Note>

لاحظ أن مدخلات الإنسان غالبًا تتطلب [معالجات أحداث (event handlers)](/learn/responding-to-events)!

</Note>

للمساعدة على تصوّر هذا التدفق، جرّب رسم كل حالة على ورقة كدائرة مُعنّوَنة. وكل تغيّر بين حالتين كسهم. تستطيع رسم العديد من التدفقات بهذه الطريقة وحل الأخطاء مبكرًا قبل التنفيذ.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

حالات النموذج

</Diagram>

</DiagramGroup>

### الخطوة 3: مثّل الحالة في الذاكرة باستخدام `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

يلي ذلك ستحتاج لتمثّل الحالات المرئية لمكوّنك في الذاكرة باستخدام [`useState`.](/reference/react/useState) البساطة هي المفتاح: كل قطعة من الحالة هي "قطعة متحركة"، و**التقليل من "القطع المتحركة" قدر الإمكان هذا ما تريده.** ;كثرة التعقيدات تؤدي إلى كثرة الأخطاء!

ابدأ بالحالة التي *لا بدّ* من وجودها. على سبيل المثال، سوف تحتاج لتخزين الإجابة `answer` للمدخل، والخطأ `error` (لو وُجد) لتخزين آخر خطأ: 

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

بعد ذلك، سوف تحتاج لمتغير حالة يمثّل أي من الحالات المرئية التي تريد عرضها. يوجد غالبًا أكثر من طريقة واحدة لتمثيل ذلك في الذاكرة، لذلك سوف يتعين عليك تجريبها.

إذا واجهت صعوبة في التفكير في أفضل طريقة على الفور، ابدا بإضافة حالة كافية حتى تكون متأكدًا *تمامًا* من تغطية جميع الحالات المرئية المحتملة: 

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

خطوتك المبدأئية على الأرجح لن تكون هي الأفضل، ولكن هذا لا بأس به -- إعادة تصميم الحالة هو جزء من العملية!

### خطوة 4: احذف أيّ متغيرات حالة غير ضرورية {/*step-4-remove-any-non-essential-state-variables*/}

ما تريده هو تجنب تكرار محتوى الحالة لذلك أنت فقط تقوم بتعقب ما هو ضروري. قضاء قليل من الوقت في إعادة تصميم هيكل حالتك سوف يجعل مكوّنك أسهل للفهم، يقلل التكرار، ويتجنب المعاني غير المقصودة. هدفك هو **منع الأوضاع التي تكون بها الحالة في الذاكرة لا تمثل أي واجهة مستخدم صالحة تود للمستخدم أن يراها.** )u(على سبيل المثال، لن تريد أبدًا إظهار رسالة خطأ مع تعطيل الإدخال في نفس الوقت، أو أن المستخدم لن يكون قادرًا على تصحيح الخطأ!)

هنا بعض الاسئلة التي يمكن أن تسألها عن متغيرات الحالة:

* **هل هذه الحالة تسبب معضلة؟** على سبيل المثال، `isTyping` و `isSubmitting` لا يمكن لكليهما أن يكونا بقيمة `true`. المعضلة غالبا تعني أن الحالة ليست مقيدة بالشكل الكافي. هناك أربع احتمالات ممكنة لاثنين من نوع boolean، لكن ثلاث منها فقط يوافقن حالات صالحة. لحذف الحالة "المستحيلة"، يمكنك جمع تلك الحالات داخل `status` التي يجب يجب أن تكون واحدة من ثلاث قيم: `'typing'`, `'submitting'`, أو `'success'`.
* **هل نفس المعلومات متاحة بالفعل لمتغير حالة آخر؟** معضلة أخرى: `isEmpty` و `isTyping` لا يمكنها أن يكونا `true` في نفس الوقت. بجعلهما متغيرين حالة منفصلين، تخاطر بفقدان الترابط بينهما وإحداث الأخطاء. لحسن الحظ، يمكن حذف `isEmpty` والتحقق من `answer.length === 0` بدلًا عن ذلك.
* **هل يمكنك الحصول على نفس المعلومات من من عكس متغير حالة آخر؟** `isError` غير ضروري لأنه يمكنك التحقق من `error !== null` بدلًا عن ذلك.

بعد هذا التبسيط، تبقى لديك 3 (من أصل 7!) متغيرات حالة *ضرورية*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

أنت تعلم أنها ضرورية، لأنك لا تستطيع إزالة أيّ منها بدون تخريب آلية العمل

<DeepDive>

#### إزالة الحالات "المستحيلة" باستخدام مخفض (reducer) {/*eliminating-impossible-states-with-a-reducer*/}

هذه الثلاث متغيرات تمثيل جيد كفاية لحالة النموذج. مع ذلك، لا تزال هناك بعض الحالات المتوسطة التي لا تشكّل معنى بصورة تامة. على سبيل المثال، `error` التي لا تحمل القيمة null ليس لها معنى عندما تكون `status` تحمل قيمة `success`. لتمثيل الحالة بطريقة أكثر دقة، يمكنك [استخلاصها إلى مخفض.](/learn/extracting-state-logic-into-a-reducer) المخفضات تتيح ليك توحيد العديد من متغيرات الحالة داخل كائن (object) واحد وتجميع كل المنطق المتعلق بها.

</DeepDive>

### الخطوة 5: اربط معالجات الأحداث لتعيين الحالة {/*step-5-connect-the-event-handlers-to-set-state*/}

أخيرًا، إنشاء معالجات الأحداث التي تحدّث الحالة. أدناه هو النموذج النهائي، مع كل معالجات الأحداث متصلة ببعضها: 
Lastly, create event handlers that update the state. Below is the final form, with all event handlers wired up:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>اختبار المدينة</h2>
      <p>
        في أي مدينة يوجد لوحة إعلانية تقوم بتحويل الهواء إلى مياه صالحة للشرب؟
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // محاكاة للتواصل باستخدام الشبكة.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

بالرغم من أن هذا الكود أطول من المثال الأمريّ الأصلي، إلا أنه أقل هشاشة بكثير. التعبير عن جميع الأوامر على أنها تغيّرات في الحالة يتيح لك لاحقًا إضافة حالات مرئية جديدة دون تعطيل الحالات القائمة بالفعل. كما يتيح لك أيضًا تغيير ما يجب عرضه في كل حالة دون تغيير منطق الأمر نفسه.

<Recap>

* البرمجة التصريحية تعني وصف واجهة المستخدم لكل حالة مرئية عوضًا عن الإدارة التفصيلية لواجهة المستخدم (الأمريّة).
* عند تطوير مكوّن:
  1. حدد كل حالاته المرئية.
  2. عيّن منشطات الإنسان والكمبيوتر لتغيّرات الحالة.
  3. مثل الحالة عن طريق `useState`.
  4. احذف الحالة غير الضرورية لتجنب الأخطاء والمعضلات.
  5. اربط معالجات الأحداث لتعيين الحالة.

</Recap>



<Challenges>

#### Add and remove a CSS class {/*add-and-remove-a-css-class*/}

Make it so that clicking on the picture *removes* the `background--active` CSS class from the outer `<div>`, but *adds* the `picture--active` class to the `<img>`. Clicking the background again should restore the original CSS classes.

Visually, you should expect that clicking on the picture removes the purple background and highlights the picture border. Clicking outside the picture highlights the background, but removes the picture border highlight.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

This component has two visual states: when the image is active, and when the image is inactive:

* When the image is active, the CSS classes are `background` and `picture picture--active`.
* When the image is inactive, the CSS classes are `background background--active` and `picture`.

A single boolean state variable is enough to remember whether the image is active. The original task was to remove or add CSS classes. However, in React you need to *describe* what you want to see rather than *manipulate* the UI elements. So you need to calculate both CSS classes based on the current state. You also need to [stop the propagation](/learn/responding-to-events#stopping-propagation) so that clicking the image doesn't register as a click on the background.

Verify that this version works by clicking the image and then outside of it:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternatively, you could return two separate chunks of JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Keep in mind that if two different JSX chunks describe the same tree, their nesting (first `<div>` → first `<img>`) has to line up. Otherwise, toggling `isActive` would recreate the whole tree below and [reset its state.](/learn/preserving-and-resetting-state) This is why, if a similar JSX tree gets returned in both cases, it is better to write them as a single piece of JSX.

</Solution>

#### Profile editor {/*profile-editor*/}

Here is a small form implemented with plain JavaScript and DOM. Play with it to understand its behavior:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

This form switches between two modes: in the editing mode, you see the inputs, and in the viewing mode, you only see the result. The button label changes between "Edit" and "Save" depending on the mode you're in. When you change the inputs, the welcome message at the bottom updates in real time.

Your task is to reimplement it in React in the sandbox below. For your convenience, the markup was already converted to JSX, but you'll need to make it show and hide the inputs like the original does.

Make sure that it updates the text at the bottom, too!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

You will need two state variables to hold the input values: `firstName` and `lastName`. You're also going to need an `isEditing` state variable that holds whether to display the inputs or not. You should _not_ need a `fullName` variable because the full name can always be calculated from the `firstName` and the `lastName`.

Finally, you should use [conditional rendering](/learn/conditional-rendering) to show or hide the inputs depending on `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare this solution to the original imperative code. How are they different?

</Solution>

#### Refactor the imperative solution without React {/*refactor-the-imperative-solution-without-react*/}

Here is the original sandbox from the previous challenge, written imperatively without React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine React didn't exist. Can you refactor this code in a way that makes the logic less fragile and more similar to the React version? What would it look like if the state was explicit, like in React?

If you're struggling to think where to start, the stub below already has most of the structure in place. If you start here, fill in the missing logic in the `updateDOM` function. (Refer to the original code where needed.)

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

The `updateDOM` function you wrote shows what React does under the hood when you set the state. (However, React also avoids touching the DOM for properties that have not changed since the last time they were set.)

</Solution>

</Challenges>

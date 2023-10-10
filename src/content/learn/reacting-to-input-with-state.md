---
title: الاستجابة للمدخلات باستخدام الحالة
---

<Intro>

توفر React طريقة تصريحيّة (declarative) لتعديل واجهة المستخدم (UI). فبدلًا من تعديل أجزاء منفردة من واجهة المستخدم مباشرةً، يمكنك وصف الحالات المختلفة التي يأخذها مكوّنك، والانتقال بينهم كاستجابة لمدخلات المستخدم. هذا مشابه لتصوّر المصمّمين عن واجهة المستخدم. 


</Intro>

<YouWillLearn>

* كيف تختلف البرمجة التصريحيّة لواجهة المستخدم (declarative UI programming) عن البرمجة الأمريّة لواجهة المستخدم (imperative UI programming)
* كيفية استعراض الحالات المرئية المختلفة التي يأخذها مكوّنك
* كيفية تنشيط التغييرات بين الحالات المرئية المختلفة من خلال الكود
  
</YouWillLearn>

## كيف تُقارَن واجهة المستخدم التصريحيّة (declarative UI) بالأمريّة (imperative) {/*how-declarative-ui-compares-to-imperative*/}

عندما تصمم تعاملات واجهة المستخدم، عليك غالبًا التفكير في كيفية *تغيّر* واجهة المستخدم كاستجابة لإجراءات المستخدم. فكر في نموذج يسمح للمستخدم بإرسال إجابة:

* عندما تكتب شيئًا داخل النموذج، يصبح الزر "أرسل" **مفعلًا.**
* عندما تضغط على "أرسل"، يصبح كلٌ من النموذج والزر **معطلا** و**يظهر** مؤشر التحميل.
* لو نجح طلب الشبكة، يبدأ النموج **بالاختفاء،** و**تظهر** رسالة "شكرًا لك".
* لو فشل طلب الشبكة، **تظهر** رسالة خطأٍ، ويصبح النموذج **مفعلًا** مجددا.

في **البرمجة الأمرية (imperative programming)**، يتوافق ما ذُكر أعلاه مباشرة مع طريقة تطبيق التعاملات. عليك أن تكتب التعليمات التامّة لتعديل واجهة المستخدم معتمدًا على ما حصل للتوّ. إليك طريقة أخرى لتفكر في هذا الأمر: تخيل نفسك راكبًا إلى جانب أحدهم في سيارة مع إخباره في كل منعطف تلو الآخر عن وجهة الذهاب. 

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="في سيارة يقودها شخص يبدو عليه القلق يمثل جافا سكريبت، يأمر أحد الركاب السائق بتنفيذ سلسلة من المنعطفات المعقدة للتنقل." />

هو لا يعلم إلى أين تريد أن تذهب، هو يتبع أوامرك فقط. (ولو أنك أعطيته الاتجاهات الخاطئة، سوف ينتهي بك المطاف لوجهة خاطئة!) هذا يطلق عليه *أمري (imperative)* لأن عليك أن "تأمر" كل عنصر، بداية من مؤشر التحميل إلى الزر، مخبرًا الكمبيوتر عن *كيفية* تحديث واجهة المستخدم (UI).

في هذا المثال للبرمجة الأمريّة لواجهة المستخدم، النموذج مبنيّ *بدون* React. باستخدام [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) الخاص بالمتصفح فقط:

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
      if (answer.toLowerCase() == 'istanbul') {
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
body { font-family: sans-serif; margin: 20px; padding: 0; direction: rtl; }
</style>
```

</Sandpack>

تعديل واجهة المستخدم (UI) أمريًّا يعمل بشكل جيد كفاية للأمثلة المعزولة، ولكنه يصبح أكثر صعوبة بشكل استثنائي عندما تدير أنظمة أكثر تعقيدًا. تخيل تحديث صفحة مليئة بالنماذج المختلفة مثل هذه هنا. إضافة عنصر واجهة مستخدم جديد سيتطلب فحص كامل الكود الموجود بحرص للتأكد من أنك لم تقم بعمل خطأ (على سبيل المثال، نسيان إظهار أو إخفاء شيء ما).

صُنعت React لحل هذه المشكلة. 

في React، لن تقوم بتعديل واجهة المستخدم مباشرة -- يعني أنك لن تقوم بتفعيل، تعطيل، إظهار، أو إخفاء مكوّنات مباشرة. بدلًا عن ذلك، سوف **تصف ما تريده أن يظهر،** و React سوف تدبر كيفية تحديث واجهة المستخدم. فكر في أخذ سيارة أجرة وإخبار السائق إلي أين تريد أنت تذهب بدلًا من إخباره إلي أين ينعطف. وظيفة السائق هي أن يوصلك إلى هناك، وربما قد يعرف اختصارات لم تأخذها أنت بالحُسبان.

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="في سيارة يقودها React، يطلب أحد الركاب نقله إلى مكان محدد على الخريطة. تكتشف React كيفية القيام بذلك." />

## التفكير في واجهة المستخدم (UI) تصريحيًا {/*thinking-about-ui-declaratively*/}

لقد رأيت كيفية تنفيذ نموذج أمريَّا أعلاه. لفهم أفضل لكيفية التفكير في React، سوف تمر بإعادة تنفيذ واجهة المستخدم (UI) هذه باستخدام React أدناه:

1. **عيّن** الحالات المرئية المختلفة لمكوّنك
2. **حدد** ما ينشط تغييرات  تلك الحالات
3. **مثّل** الحالة في الذاكرة باستخدام `useState`
4. **احذف** أيّ متغيرات حالة غير ضرورية
5. **اربط** معالجات الأحداث لتعيين الحالة

### الخطوة 1: عيّن الحالات المرئية المختلفة لمكوّنك {/*step-1-identify-your-components-different-visual-states*/}

في علوم الحاسب، ربما تسمع عن ["آلة الحالة (state machine)"](https://ar.wikipedia.org/wiki/%D8%A2%D9%84%D8%A9_%D9%85%D8%AD%D8%AF%D9%88%D8%AF%D8%A9_%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D8%A7%D8%AA) كونها واحدة من ضمن "حالات" متعددة. إذا كنت تعمل مع مصمم، لربما رأيت نماذج تجريبية لـ"الحالات المرئية" المختلفة 

أولًا، أنت تحتاج لتصوّر جميع "الحالات" المختلفة لواجهة المستخدم (UI) التي قد يراها المستخدم: 
*  **فارغة**: النموذج يحتوي على زر "إرسال" معطل.
* **كتابة**: النموذج يحتوي على زر "إرسال" مفعّل.
* **إرسال**: النموذج معطل تمامًا. يتم عرض مؤشر التحميل.
* **نجاح**: يتم عرض رسالة "شكرًا لك" بدلًا من النموذج.
* **خطأ**: مثل حالة الكتابة، ولكن مع رسالة خطأ إضافية

تمامًا مثل المصمم، سترغب في "تجربة" أو إنشاء "نماذج تجريبية" للحالات المختلفة قبل أن تضيف المنطق. على سبيل المثال، ها هو نموذج تجريبي للجزء المرئي فقط من النموذج. هذا النموذج التجريبي متحكم به بواسطة خاصيّة تدعى `status` مع قيمة افتراضية `'empty'`:

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

يمكنك تسمية الخاصيّة أيّ شيء تريد، التسمية ليست مهمة. جرب تعديل `status = 'empty'` إلى `status = 'success'` لترى رسالة النجاح تظهر. التجربة تتيح لك التكرار السريع على واجهة المستخدم قبل ربط أي منطق. ها هو نموذج تجريبي أكثر تفصيلًا لنفس المكوّن، يظل "متحكمًا به" بواسطة الخاصية `status`:

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
body { direction: rtl; }
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### عرض عديد من الحالات المرئية مرة واحدة {/*displaying-many-visual-states-at-once*/}

لو أن لمكون العديد من الحالات المرئية، قد يكون ملائمًا عرضها جميعها في صفحة واحدة: 

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
body { margin: 0; direction: rtl; }
.Error { color: red; }
```

</Sandpack>

صفحات مثل هذه غالبًا يطلق عليها "living styleguides" أو "storybooks" 

</DeepDive>

###  الخطوة 2: حدد ما ينشط تغييرات تلك الحالة {/*step-2-determine-what-triggers-those-state-changes*/}

يمكنك تنشيط تحديثات الحالة كاستجابة إلى نوعين من المدخلات:

* **مدخلات الإنسان،** مثل الضغط على زر، أو الكتابة في حقل، أو زيارة رابط.
* **مدخلات الكمبيوتر،** مثل وصول رد الشبكة، أو استكمال المؤقت، أو تحميل الصورة.

<IllustrationBlock>
  <Illustration caption="مدخلات الإنسان" alt="إصبع" src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="مدخلات الكمبيوتر" alt="آحاد وأصفار" src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

في كلتا الحالتين، **يجب عليك تعيين [متغيرات الحالة (state variables)](/learn/state-a-components-memory#anatomy-of-usestate) لتُحدّث واجهة المستخدم (UI).** من أجل تطوير النموذج سوف تحتاج لتغيير الحالة كنتيجة لبعض من المدخلات المختلفة:

* **تغيّر حقل إدخال النص** (الإنسان) سوف يغيرها من الحالة *الفارغة* إلى حالة *الكتابة* أو العكس، يعتمد على ما إذا كان حقل النص فارغًا أم لا.
* **الضغط على زر الإرسال** (الإنسان) سوف يغيرها إلى حالة *الإرسال*.
* **استجابة ناجحة للشبكة** (الكمبيوتر) سوف يغيرها إلى حالة *النجاح*.
* **استجابة فاشلة للشبكة** (الكمبيوتر) سوف يغيرها إلى حالة *الخطأ* مع رسالة الخطأ المناسبة.

<Note>

لاحظ أن مدخلات الإنسان غالبًا تتطلب [معالجات أحداث (event handlers)](/learn/responding-to-events)!

</Note>

للمساعدة على تصوّر هذا التدفق، جرّب رسم كل حالة على ورقة كدائرة مُعنّوَنة. وكل تغيّر بين حالتين كسهم. تستطيع رسم العديد من التدفقات بهذه الطريقة وحل الأخطاء مبكرًا قبل التنفيذ.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="مخطط التدفق يتحرك من اليسار إلى اليمين مع 5 عناصر. العقدة الأولى المسماة 'فارغة' لها حافة واحدة تسمى 'بدء الكتابة' متصلة بالعقدة المسماة 'الكتابة'. تحتوي هذه العقدة على حافة واحدة تسمى 'اضغط إرسال' متصلة بعقدة تسمى 'إرسال'، والتي لها حافتان. الحافة'اليسرى تحمل علامة 'خطأ في الشبكة' وهي متصلة بعقدة تحمل اسم 'خطأ'. الحافة اليمنى تحمل علامة 'نجاح الشبكة' وتتصل بعقدة تحمل اسم 'النجاح'.">

حالات النموذج

</Diagram>

</DiagramGroup>

### الخطوة 3: مثّل الحالة في الذاكرة باستخدام `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

بعد ذلك ستحتاج لتمثّل الحالات المرئية لمكوّنك في الذاكرة باستخدام [`useState`.](/reference/react/useState) البساطة هي المفتاح: كل قطعة من الحالة هي "قطعة متحركة"، **وبالـتأكيد تريد تقليل "القطع المتحركة" قدر الإمكان.** ;كثرة التعقيدات تؤدي إلى كثرة الأخطاء!

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

خطوتك المبدئية على الأرجح لن تكون هي الأفضل، ولكن هذا لا بأس به -- إعادة تصميم الحالة هو جزء من العملية!

### الخطوة 4: احذف أيّ متغيرات حالة غير ضرورية {/*step-4-remove-any-non-essential-state-variables*/}

ما تريده هو تجنب تكرار محتوى الحالة لذلك أنت تقوم بتعقب ما هو ضروري فقط. قضاء قليل من الوقت في إعادة تصميم هيكل حالتك سوف يجعل مكوّنك أسهل للفهم، يقلل التكرار، ويتجنب المعاني غير المقصودة. هدفك هو **منع الأوضاع التي تكون بها الحالة في الذاكرة لا تمثل أي واجهة مستخدم صالحة من التي تود للمستخدم أن يراها.** (على سبيل المثال، لن تريد أبدًا إظهار رسالة خطأ مع تعطيل الإدخال في نفس الوقت، أو أن المستخدم لن يكون قادرًا على تصحيح الخطأ!)

هنا بعض الاسئلة التي يمكن أن تسألها عن متغيرات الحالة:

* **هل هذه الحالة تسبب معضلة؟** على سبيل المثال، `isTyping` و `isSubmitting` لا يمكن لكليهما أن يكونا بقيمة `true`. المعضلة غالبًا تعني أن الحالة ليست مقيدة بالشكل الكافي. هناك أربع احتمالات ممكنة لقيميتين منطقيتين (boolean). لكن ثلاث منهن فقط يوافقن حالات صالحة. لحذف الحالة "المستحيلة"، يمكنك جمع تلك الحالات داخل `status` التي يجب أن تكون واحدة من ثلاث قيم: `'typing'`, `'submitting'`, أو `'success'`.
* **هل نفس المعلومات متاحة بالفعل لمتغير حالة آخر؟** معضلة أخرى: `isEmpty` و `isTyping` لا يمكنها أن يكونا `true` في نفس الوقت. بجعلهما متغيرين حالة منفصلين، تخاطر بفقدان الترابط بينهما وإحداث الأخطاء. لحسن الحظ، يمكن حذف `isEmpty` والتحقق من `answer.length === 0` بدلًا عن ذلك.
* **هل يمكنك الحصول على نفس المعلومات من عكس متغير حالة آخر؟** `isError` غير ضروري لأنه يمكنك التحقق من `error !== null` بدلًا عن ذلك.

بعد هذا التبسيط، تبقى لديك 3 (من أصل 7!) متغيرات حالة *ضرورية*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

أنت تعلم أنها ضرورية، لأنك لا تستطيع إزالة أيّ منها بدون تخريب آلية العمل.

<DeepDive>

#### إزالة الحالات "المستحيلة" باستخدام مخفض (reducer) {/*eliminating-impossible-states-with-a-reducer*/}

هذه الثلاث متغيرات تمثيل جيد كفاية لحالة النموذج. مع ذلك، لا تزال هناك بعض الحالات المتوسطة الغير منطقية بشكل كافٍ. على سبيل المثال، `error` التي لا تحمل القيمة null غير منطقية عندما تكون `status` تحمل قيمة `success`. لتمثيل الحالة بطريقة أكثر دقة، يمكنك [استخلاصها إلى مخفض.](/learn/extracting-state-logic-into-a-reducer) المخفضات تتيح ليك توحيد العديد من متغيرات الحالة داخل كائن (object) واحد وتجميع كل المنطق المتعلق بها.

</DeepDive>

### الخطوة 5: اربط معالجات الأحداث لتعيين الحالة {/*step-5-connect-the-event-handlers-to-set-state*/}

أخيرًا، إنشاء معالجات الأحداث التي تحدّث الحالة. أدناه هو النموذج النهائي، مع كل معالجات الأحداث متصلة ببعضها: 

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
        reject(new Error('توقع جيد ولكن إجابة خاطئة. حاول مرة أخرى!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
body { direction: rtl; }
.Error { color: red; }
```

</Sandpack>

بالرغم من أن هذا الكود أطول من المثال الأمريّ الأصلي، إلا أنه أقل هشاشة بكثير. التعبير عن جميع الأوامر على أنها تغيّرات في الحالة يتيح لك لاحقًا إضافة حالات مرئية جديدة دون تعطيل الحالات القائمة بالفعل. كما يتيح لك أيضًا تغيير ما يجب عرضه في كل حالة دون تغيير منطق الأمر نفسه.

<Recap>

* البرمجة التصريحية تعني وصف واجهة المستخدم لكل حالة مرئية عوضًا عن الإدارة التفصيلية لواجهة المستخدم (الأمريّة).
* عند تطوير مكوّن:
  1. حدد كل حالاته المرئية.
  2. عيّن المنشطات الوادة الإنسان والكمبيوتر لتغيّرات الحالة.
  3. مثل الحالة عن طريق `useState`.
  4. احذف الحالة غير الضرورية لتجنب الأخطاء والمعضلات.
  5. اربط معالجات الأحداث لتعيين الحالة.

</Recap>



<Challenges>

#### إضافة وحذف صنف (class) CSS {/*add-and-remove-a-css-class*/}

نفذ ذلك بحيث يكون النقر على الصورة *يحذف* صنف CSS `background--active`من الـ`<div>` الخارجي، لكن *يضيف* الصنف `picture--active` لـ`<img>`. النقر على الخلفية مجددًا يجب أن يعيد أصناف CSS الأصلية.

عمليًا، يمكنك توقع أن النقر على الصورة يحذف الخلفية البنفسجية ويقوم بتحديد (highlight) إطار الصورة. النقر خارج الصورة يقوم بتحديد الخلفيةـ ولكن يحذف تحديد إطار الصورة.

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

هذا المكوّن لديه حالتين مرئيتين: عندما تكون الصورة نشطة، وعندما تكون الصورة غير نشطة:

* عندما تكون الصورة نشطة، أصناف CSS هي `background` و `picture picture--active`.
* عندما تكون الصورة غير نشطة، أصناف CSS هي `background background--active` و `picture`.
متغير حالة قيمة منطقية (boolean) واحد يكفي لتذكر ما إذا كانت نشطة. المهمة الأصلية كانت إزالة أو إضافة أصناف CSS. على أية حال، في React تحتاج لـ*تصف* ما تريد رؤيته فضلًا عن *تعديل* عناصر واجهة المستخدم. لذلك تحتاج لحساب كلا صنفيّ CSS اعتمادًا على الحالة الحالية. تحتاج أيضًا إلى [إيقاف الانتشار (propagation)](/learn/responding-to-events#stopping-propagation) بحيث لا يتم تسجيل النقر على الصورة كنقر على الخلفية. 

تأكد من أن هذا الإصدار يعمل عن طريق النقر على الصور وخارجها:

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

بديلًا عن ذلك، يمكنك إرجاع (return) جزئين مختلفين من JSX:

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

ضع في الحسبان أنه إذا وصف جزئين مختلفين من JSX الشجرة نفسها، فتضمينهما (أول `<div>` ← أول `<img>`) يجب أن يصطف. وإلا تغيّر `isActive` سوف يعيد إنشاء الشجرة بأكملها أدناه و [يعيد تعيين حالتها.](/learn/preserving-and-resetting-state) هذا هو السبب، إذا كان يتم إرجاع شجرة JSX مشابهة في كلا الحالتين، فمن الأفضل كتابتهما كجزء واحد من JSX.

</Solution>

#### محرر الملف الشخصي {/*profile-editor*/}

ها هو نموذج مصغر تم تنفيذه بواسطة JavaScript و DOM خالصيّن. جربه لتفهم طريقة عمله:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'عدّل الملف الشخصي') {
    editButton.textContent = 'احفظ الملف الشخصي';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'عدّل الملف الشخصي';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'أهلًا ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'أهلًا ' +
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
    الأسم الأول:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    اسم العائلة
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">عدّل الملف الشخصي</button>
  <p><i id="helloText">أهلًا، Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; direction: rtl; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

هذا النموذج يتغيّر بين وضعين: في وضع التعديل، ترى حقول الإدخال، وفي وضع المعاينة، ترى النتيجة فقط. عنوان الزر يتغيّر ما بين "عدّل" و"احفظ" اعتمادًا على الوضع الذي أنت عليه. عندما تقوم بتغيير حقول الإدخال، يتم تحديث رسالة الترحيب في الأسفل للوقت الحالي.

مهمتك هي إعادة تنفيذها بواسطة React في الـsandbox أدناه. لضمان راحتك، تم تحويل التوصيف (markup) إلى JSX, لكن يتعين عليك جعلها تُظهر وتُخفي المدخلات كما تفعل الأصلية.

تأكد من أنها تقوم بتحديث النص في الأسفل أيضًا!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        الاسم الأول:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        اسم العائلة:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        عدّل الملف الشخصي
      </button>
      <p><i>أهلًا، Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
body { direction: rtl; }
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

ستحتاج لمتغيريّ حالة لحمل قيم الإدخال: `firstName` و `lastName`. سوف تحتاج أيَا متغير حالة `isEditing` الذي يحمل ما إذا كان سيعرض حقول الإدخال أم لا. _ليس_ عليك استعمال متغير `fullName` لأن الاسم الكامل يمكن دائمًا إيجاده من الاسم الأول `firstName` واسم العائلة `lastName`.

أخيرًا، يمكنك استخدام [التصيّير الشرطي](/learn/conditional-rendering) لإظهار أو إخفاء حقول الإدخال اعتمادًا على `isEditing`.

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
        الاسم الأول:{' '}
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
        اسم العائلة:{' '}
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
        {isEditing ? 'اخفظ' : 'عدّل'} الملف الشخصي
      </button>
      <p><i>أهلًا، {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
body { direction: rtl; }
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

قارن بين هذا الحل والكود الأمريّ الأصلي. ما مدى الاختلاف؟

</Solution>

#### إعادة تصميم الحل الأمري بدون React {/*refactor-the-imperative-solution-without-react*/}

ها هي الـ sandbox الأصلية من التحدي الماضي، مكتوبة بشكل أمري بدون React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'عدّل الملف الشخصي') {
    editButton.textContent = 'احفظ الملف الشخصي';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'عدّل الملف الشخصي';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'أهلًا ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'أهلًا ' +
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
    الاسم الأول:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    اسم العائلة:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">عدّل الملف الشخصي</button>
  <p><i id="helloText">أهلًا، Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; direction: rtl: }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

تصوّر لو أن React غير موجودة. هل يمكنك إعادة تصميم الكود بطريقة تجعل المنطق أقل هشاشة وأكثر مقاربة لنسخة React؟ كيف سيبدو لو كانت حالته بيّنة، كما هو الحال في React؟

إذا كنت تواجه صعوبة في تحديد من أين تبدأ، فالمُلحق أدناه يحتوي أغلب الهيكل معدًّا. لو بدأت من هنا، املئ المنطق المفقود داخل الدالة `updateDOM`. (راجع الكود الكود الأصلي عند الحاجة.)

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
    editButton.textContent = 'احفظ الملف الشخصي';
    // قائمة المهام: إظهار حقول الإدخال، إخفاء المحتوى
  } else {
    editButton.textContent = 'عدّل الملف الشخصي';
    // قائمة المهام: إخفاء حقول الإدخال، إظهار المحتوى
  }
  // (text labels) قائمة المهام: تحديث عنواين النص
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
    الاسم الأول:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    اسم العائلة:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">عدّل الملف الشخصي</button>
  <p><i id="helloText">أهلًا، Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; direction: rtl; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

المنطق المفقود تضمّن تغيير عرض حقول الإدخال والمحتوى، وتحديث العناوين: 

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
    editButton.textContent = 'احفظ الملف الشخصي';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'عدّل الملف الشخصي';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'أهلًا ' +
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
    الاسم الأول:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    اسم العائلة:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">عدّل الملف الشخصي</button>
  <p><i id="helloText">أهلًا، Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; direction: rtl; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

الدالة `updateDOM` التي كتبتها تُظهر ما تقوم به React تحت الستار عندما تقوم بتعيين الحالة. (مع ذلك، React تتجنب المسّ بالـ DOM لأجل الخصائص التي لم تتغير من أخر مرة تم تعيينها فيها.)

</Solution>

</Challenges>

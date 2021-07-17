---
id: concurrent-mode-reference
title: مرجع واجهة برمجة التطبيقات للوضع المتزامن (تجريبي)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>تحذير:
>
>تصف هذه الصفحة **الميزات التجريبية التي [ليست متوفرة بعد](/docs/concurrent-mode-approach.html) في الإصدار المستقر**. لا تعتمد على البناءات React التجريبية في تطبيقات الإنتاج. قد تتغير هذه الميزات بشكل كبير ودون سابق إنذار قبل أن تصبح جزءًا من React.
>
>تستهدف هذه المستندات إلى المُتَبنّين المبكرين والأشخاص الفضوليين. **إذا كنت جديدًا في React، فلا تقلق بشأن هذه الميزات** --  لست بحاجة إلى تعلمها الآن.
>
>Much of the information on this page is now outdated and exists only for archival purposes. **Please refer to the [React 18 Alpha announcement post](/blog/2021/06/08/the-plan-for-react-18.html
) for the up-to-date information.**
>
>Before React 18 is released, we will replace this page with stable documentation.

</div>

هذه الصفحة هي مرجع واجهة برمجة التطبيقات لـ React [الوضع المتزامن](/docs/concurrent-mode-intro.html). إذا كنت تبحث عن مقدمة موجهة بدلاً من ذلك، فتحقق من [أنماط واجهة المستخدم المتزامنة](/docs/concurrent-mode-patterns.html).

**ملاحظة: هذه عينة توفر نظرة عامة للمجتمع وليست الإصدار النهائي المستقر. من المحتمل أن تكون هناك تغييرات مستقبلية على واجهات برمجة التطبيقات تلك. استخدم على مسؤوليتك الخاصة!**

- [تفعيل الوضع المتزامن](#concurrent-mode)
    - [`createRoot`](#createroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## تفعيل الوضع المتزامن {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

إستبدل `ReactDOM.render(<App />, rootNode)` وتُفعِّل الوضع المتزامن.

لمزيد من المعلومات حول الوضع المتزامن، راجع [مستندات الوضع المتزامن.](/docs/concurrent-mode-intro.html)

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

استبدل `ReactDOM.render(<App />, rootNode)` وتُفعل [الوضع الإعتراضي](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

يؤدي إختيار الوضع المتزامن إلى إدخال تغييرات دلالية في كيفية عمل React. هذا يعني أنه لا يمكنك استخدام الوضع المتزامن في عدد قليل من المكونات. وبسبب هذا ، قد لا تتمكن بعض التطبيقات من الإنتقال مباشرة إلى الوضع المتزامن.

يحتوي الوضع الإعتراضي  (blocking mode) فقط على مجموعة فرعية صغيرة من ميزات الوضع المتزامن ويقصد به كخطوة ترحيل وسيطة للتطبيقات التي لا تستطيع الترحيل مباشرة.


## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` يتيح لمكوناتك "الانتظار" لشيء ما قبل أن تتمكن من التصيير، مع إظهار احتياطي (fallback) أثناء الانتظار.

في هذا المثال، ينتظر `ProfileDetails`  اتصال API غير متزامن لجلب بعض البيانات. أثناء انتظار ` ProfileDetails` و `ProfilePhoto`، سنعرض الخيار `Loading...`  بدلاً من ذلك. من المهم ملاحظة أنه حتى يتم تحميل جميع الأطفال داخل `<Suspense>`، سنستمر في إظهار الاحتياط.

`Suspense` يأخذ اثنين props:
* **fallback** يأخذ مؤشر تحميل. يظهر العرض الاحتياطي حتى الانتهاء من تصيير كافة مكون `Suspense`.
* **unstable_avoidThisFallback** يأخذ قيم منطقية (boolean). بحيث يخبر React ما إذا كان "تخطي (skip)" الكشف عن هذه الحدود أثناء التحميل الأولي. من المحتمل أن تتم إزالة واجهة برمجة التطبيقات هذه في إصدار مستقبلي.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` يساعد في تنسيق العديد من المكونات التي يمكن تعليقها من خلال تنسيق الترتيب الذي يتم من خلاله الكشف عن هذه المكونات للمستخدم.

عندما تحتاج مكونات متعددة إلى جلب البيانات، قد تصل هذه البيانات بترتيب غير متوقع. ومع ذلك، إذا قمت بلف هذه العناصر في `SuspenseList`، فلن تظهر React عنصرًا في القائمة حتى يتم عرض العناصر السابقة (هذا السلوك قابل للتعديل).

`SuspenseList` يأخذ اثنين props:
* **revealOrder (forwards, backwards, together)** يحدد الترتيب الذي فيه أطفال `SuspenseList` التي يجب الكشف عنهم.
  * `together` تكشف *الكل* عندما يكونون على استعداد بدلاً من واحدة تِلوَ الأخرى.
* **tail (collapsed, hidden)** يملي كيف يتم عرض العناصر التي تم تحميلها فى `SuspenseList`.
    * بشكل افتراضي, `SuspenseList` سيظهر جميع الاحتياطيات في القائمة.
    * `collapsed` يظهر فقط الاحتياطية التالية في القائمة.
    * `hidden` لا تظهر أي عناصر غير محمل.

لاحظ أن `SuspenseList`  تعمل فقط على أقرب مكونات `Suspense` و مكونات `SuspenseList`  تحتها. لا يبحث عن حدود أعمق من مستوى واحد. ومع ذلك، فمن الممكن تداخل مكونات `SuspenseList` متعددة في بعضها البعض لبناء شبكات (grids).

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` يسمح للمكونات بتجنب حالات التحميل غير المرغوب فيها من خلال انتظار تحميل المحتوى قبل **الانتقال إلى الشاشة التالية**. كما يسمح للمكونات بتأجيل التحديثات بشكل أبطأ، وجلب البيانات حتى يتم تقديمها لاحقًا بحيث يمكن تقديم تحديثات أكثر أهمية على الفور.

يُعيد الخطاف `useTransition` قيمتين في مصفوفة.
* `startTransition` هي دالّة التي تأخذ callback. يمكننا استخدامه لإخبار React بالحالة التي نريد تأجيلها.
* `isPending` هي boolean. إنها طريقة React لإعلامنا ما إذا كنا ننتظر انتهاء الانتقال.

**إذا تسبب تحديث الحالة في تعليق أحد المكونات، فيجب أن يتم تغليف تحديث الحالة هذا في مرحلة انتقالية.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

في هذه الشفرة، قمنا بلف جلب بياناتنا بـ `startTransition`. يتيح لنا ذلك البدء في جلب بيانات الملف الشخصي فورًا، مع تأجيل عرض صفحة الملف الشخصي التالية و `Spinner` المرتبط بها لمدة ثانيتين (الوقت الموضح في `timeoutMs`).

تتيح القيمة المنطقية `isPending` لـ React معرفة أن المكون الخاص بنا يتحول، لذلك يمكننا إخبار المستخدم بذلك من خلال عرض نص التحميل على صفحة الملف الشخصي السابقة.

**لإلقاء نظرة متعمقة على التحولات، يمكنك قراءة [أنماط و أساليب واجهة المستخدم](/docs/concurrent-mode-patterns.html#transitions).**

#### useTransition Config {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

يقبل `useTransition` **Suspense Config اختياري** مع `timeoutMs`. هذه المهلة (بالمللي ثانية) تخبر React إلى متى الانتظار قبل عرض الحالة التالية (صفحة الملف الشخصي الجديدة في المثال أعلاه).

**ملاحظة: نوصيك بمشاركة Suspense Config بين الوحدات المختلفة.**

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

لعرض نسخة مؤجلة من القيمة التي قد "تتخلف" عنها على الأكثر لـ `timeoutMs`.

يُستخدم هذا بشكل شائع للحفاظ على استجابة الواجهة عندما يكون لديك شيء يتم تصييره فورًا بناءً على مُدخلات المستخدم وشيء يحتاج إلى انتظار جلب البيانات.

مثال جيد على ذلك هو إدخال النص.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 });

  return (
    <div className="App">
      {/* Keep passing the current text to the input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* But the list is allowed to "lag behind" when necessary */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

يتيح لنا ذلك البدء في عرض النص الجديد لـ `الإدخال` على الفور، مما يسمح لصفحة الويب بالشعور بالاستجابة. في هذه الأثناء، `MySlowList` "متخلفة" لمدة تصل إلى ثانيتين وفقًا لـ `timeoutMs` قبل التحديث، مما يتيح تصييرها مع النص الحالي في الخلفية.

**لإلقاء نظرة متعمقة على تأجيل القيم، يمكنك قراءة [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### useDeferredValue Config {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

يقبل `useDeferredValue` **Suspense Config اختياري** مع `timeoutMs`. هذه المهلة (بالمللي ثانية) تخبرنا React عن المدة التي يُسمح فيها بالقيمة المؤجلة بالتخلف.

سيحاول React دائمًا استخدام تأخرٍ أقصر عندما تسمح به الشبكة والجهاز.

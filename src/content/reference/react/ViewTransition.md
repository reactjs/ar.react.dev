---
title: <ViewTransition>
version: canary
---

<Canary>

**واجهة `<ViewTransition />` متاحة حاليًا فقط في قناتي React: Canary وExperimental.** 

[تعرّف أكثر على قنوات إصدار React هنا.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

`<ViewTransition>` يتيح لك تحريك العناصر التي تُحدَّث داخل انتقال (Transition).


```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

لفّ العناصر داخل `<ViewTransition>` لتحريكها عند تحديثها داخل [انتقال (Transition)](/reference/react/useTransition). يستخدم React الاستدلالات التالية لتحديد ما إذا كان انتقال العرض (View Transition) يُفعَّل لرسوم متحركة:

- `enter`: إذا أُدرج `ViewTransition` نفسه في هذا الانتقال، يُفعَّل هذا.
- `exit`: إذا حُذف `ViewTransition` نفسه في هذا الانتقال، يُفعَّل هذا.
- `update`: إذا كان لدى `ViewTransition` أي تعديلات DOM داخله يقوم بها React (مثل تغيّر خاصية) أو إذا تغيّر حجم أو موضع حدود `ViewTransition` نفسه بسبب أخٍ مباشر. إذا وُجدت `ViewTransition` متداخلة فتنطبق التعديلات عليها وليس على الأب.
- `share`: إذا كان `ViewTransition` مُسمّى داخل شجرة محذوفة و`ViewTransition` مُسمّى آخر بنفس الاسم جزءًا من شجرة مُدرَجة في نفس الانتقال، يشكّلان انتقال عنصر مشترك (Shared Element Transition) ويتحرّك من المحذوف إلى المُدرَج.

افتراضيًا، `<ViewTransition>` يتحرّك بتلاشٍ متقاطع سلس (الانتقال الافتراضي للمتصفح). يمكنك تخصيص الرسوم بتمرير [فئة انتقال العرض](#view-transition-class) إلى مكوّن `<ViewTransition>`. ويمكنك تخصيص الرسوم لكل نوع من المحفّزات (انظر [تنسيق انتقالات العرض](#styling-view-transitions)).

<DeepDive>

#### كيف يعمل `<ViewTransition>`؟ {/*how-does-viewtransition-work*/}

في الخلفية، يطبّق React الخاصية `view-transition-name` على الأنماط المضمّنة لأقرب عقدة DOM متداخلة داخل مكوّن `<ViewTransition>`. إذا وُجدت عدة عقد DOM أشقاء مثل `<ViewTransition><div /><div /></ViewTransition>` يضيف React لاحقة للاسم لجعل كل واحد فريدًا، لكنها مفهوميًا جزء من نفس الانتقال. لا يطبّق React ذلك بشكل فوري بل فقط عندما ينبغي أن تشارك تلك الحدود في رسوم.

يستدعي React `startViewTransition` تلقائيًا في الخلفية، لذا لا يجب أن تفعل ذلك بنفسك. في الواقع، إذا كان شيء آخر في الصفحة يشغّل ViewTransition فسيقاطعه React. لذا يُنصح باستخدام React نفسه لتنسيق ذلك. إذا كنت تستخدم سابقًا طرقًا أخرى لتحفيز ViewTransitions، ننصح بالانتقال إلى الطريقة المدمجة.

إذا كانت هناك ViewTransitions أخرى لـ React تعمل بالفعل، فسينتظر React انتهاءها قبل بدء التالية. لكن الأهم: إذا حدثت عدة تحديثات أثناء تشغيل الأول، تُجمَّع كلها في واحد. إذا بدأت A→B ثم في الأثناء وصل تحديث إلى C ثم D، فعند انتهاء رسوم A→B الأولى ستتحرّك التالية من B→D.

يُستدعى دورة حياة `getSnapshotBeforeUpdate` قبل `startViewTransition` وتُحدَّث بعض قيم `view-transition-name` في الوقت نفسه.

ثم يستدعي React `startViewTransition`. داخل `updateCallback`، سيفعل React:

- تطبيق تعديلاته على DOM واستدعاء useInsertionEffects.
- انتظار تحميل الخطوط.
- استدعاء componentDidMount وcomponentDidUpdate وuseLayoutEffect والمراجع.
- انتظار انتهاء أي تنقّل (Navigation) معلّق.
- ثم يقيس React أي تغيّرات في التخطيط ليرى أي حدود تحتاج إلى تحريك.

بعد حلّ وعد الجاهزية (ready) لـ `startViewTransition`، يعيد React `view-transition-name` كما كان. ثم يستدعي React الدوال `onEnter` و`onExit` و`onUpdate` و`onShare` للتحكّم الإلزامي البرمجي في الرسوم. يحدث ذلك بعد أن تُحسب القيم الافتراضية المدمجة.

إذا حدث `flushSync` في منتصف هذه التسلسلة، يتخطّى React الانتقال لأنه يعتمد على الإكمال المتزامن.

بعد حلّ وعد الانتهاء (finished) لـ `startViewTransition`، يستدعي React `useEffect`. يمنع ذلك تداخلها مع أداء الرسوم. لكن هذا ليس ضمانًا: إذا حدث `setState` آخر أثناء تشغيل الرسوم، قد يضطر React إلى استدعاء `useEffect` مبكرًا للحفاظ على ضمانات الترتيب.

</DeepDive>

#### الخصائص {/*props*/}

افتراضيًا، `<ViewTransition>` يتحرّك بتلاشٍ متقاطع سلس. يمكنك تخصيص الرسوم أو تحديد انتقال عنصر مشترك بهذه الخصائص:

* **اختياري** `enter`: سلسلة أو كائن. [فئة انتقال العرض](#view-transition-class) التي تُطبَّق عند تفعيل enter.
* **اختياري** `exit`: سلسلة أو كائن. [فئة انتقال العرض](#view-transition-class) التي تُطبَّق عند تفعيل exit.
* **اختياري** `update`: سلسلة أو كائن. [فئة انتقال العرض](#view-transition-class) التي تُطبَّق عند تفعيل update.
* **اختياري** `share`: سلسلة أو كائن. [فئة انتقال العرض](#view-transition-class) التي تُطبَّق عند تفعيل عنصر مشترك.
* **اختياري** `default`: سلسلة أو كائن. [فئة انتقال العرض](#view-transition-class) المستخدمة عند عدم وجود خاصية تفعيل أخرى مطابقة. 
* **اختياري** `name`: سلسلة أو كائن. اسم انتقال العرض المستخدم لانتقالات العناصر المشتركة. إذا لم تُمرَّر، يستخدم React اسمًا فريدًا لكل `ViewTransition` لتجنّب رسوم غير متوقعة.

#### الدوال الاستدعائية {/*events*/}

تسمح هذه الدوال بتعديل الرسوم بشكل إلزامي باستخدام واجهات [animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate):

* **اختياري** `onEnter`: دالة. يستدعي React `onEnter` بعد رسوم "enter".
* **اختياري** `onExit`: دالة. يستدعي React `onExit` بعد رسوم "exit".
* **اختياري** `onShare`: دالة. يستدعي React `onShare` بعد رسوم "share".
* **اختياري** `onUpdate`: دالة. يستدعي React `onUpdate` بعد رسوم "update".

تستلم كل دالة استدعاء المعاملات التالية:
- `element`: عنصر DOM الذي أُحييَ.
- `types`: [أنواع الانتقال](/reference/react/addTransitionType) المضمّنة في الرسوم.

### فئة انتقال العرض {/*view-transition-class*/}

فئة انتقال العرض هي اسم (أسماء) فئة CSS التي يطبّقها React أثناء الانتقال عند تفعيل ViewTransition. يمكن أن تكون سلسلة أو كائنًا.
- `string`: الفئة `class` المضافة للعناصر الأبناء عند التفعيل. إذا وُفِّر `'none'`، لا تُضاف فئة.
- `object`: الفئة المضافة للعناصر الأبناء تكون المفتاح المطابق لنوع انتقال العرض المضاف بـ `addTransitionType`. يمكن للكائن أيضًا تحديد `default` للاستخدام إذا لم يُعثر على نوع مطابق.

يمكن استخدام القيمة `'none'` لمنع تفعيل انتقال عرض لمحفّز معيّن.

### تنسيق انتقالات العرض {/*styling-view-transitions*/}

<Note>

في كثير من الأمثلة المبكرة لانتقالات العرض على الويب، رأيت استخدام [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) ثم تنسيقها بمحددات `::view-transition-...(my-name)`. لا ننصح بذلك للتنسيق. بدلًا من ذلك، ننصح عادةً باستخدام فئة انتقال العرض.

</Note>

لتخصيص الرسوم لـ `<ViewTransition>` يمكنك تمرير فئة انتقال عرض إلى إحدى خصائص التفعيل. فئة انتقال العرض هي اسم فئة CSS يطبّقه React على العناصر الأبناء عند تفعيل ViewTransition.

مثلًا، لتخصيص رسوم "enter"، مرّر اسم فئة إلى خاصية `enter`:


```js
<ViewTransition enter="slide-in">
```

عندما يفعّل `<ViewTransition>` رسوم "enter"، يضيف React اسم الفئة `slide-in`. ثم يمكنك الإشارة إلى هذه الفئة باستخدام [محددات انتقال العرض الزائفة](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) لبناء رسوم قابلة لإعادة الاستخدام:

```css
::view-transition-group(.slide-in) {
  
}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
```
في المستقبل، قد تضيف مكتبات CSS رسومًا مدمجة باستخدام فئات انتقال العرض لتسهيل الاستخدام.

#### ملاحظات مهمة {/*caveats*/}

- افتراضيًا، تحديثات `setState` فورية ولا تفعّل `<ViewTransition>`؛ فقط التحديثات الملفوفة في [Transition](/reference/react/useTransition). يمكنك أيضًا استخدام [`<Suspense>`](/reference/react/Suspense) للاشتراك في انتقال لـ [إظهار المحتوى](/reference/react/Suspense#revealing-content-together-at-once).
- ينشئ `<ViewTransition>` صورة يمكن تحريكها وتكبيرها/تصغيرها والتلاشي بينها. بخلاف رسوم التخطيط التي قد رأيتها في React Native أو Motion، هذا يعني أن ليس كل عنصر داخله يحرّك موضعه على حدة. قد يؤدي ذلك إلى أداء أفضل وإحساس أكثر استمرارية مقارنة بتحريك كل قطعة. لكنه قد يفقد الاستمرارية لأشياء يفترض أن تتحرّك وحدها، فقد تحتاج إلى إضافة حدود `<ViewTransition>` يدويًا.
- قد يفضّل كثير من المستخدمين عدم وجود رسوم في الصفحة. لا يعطّل React الرسوم تلقائيًا في هذه الحالة. ننصح باستخدام استعلام الوسائط `@media (prefers-reduced-motion)` لتعطيل الرسوم أو تخفيفها حسب تفضيل المستخدم. في المستقبل، قد تدمج مكتبات CSS ذلك في إعداداتها الجاهزة.
- حاليًا، `<ViewTransition>` يعمل فقط في DOM. نعمل على دعم React Native ومنصات أخرى.

---


## الاستخدام {/*usage*/}

### تحريك عنصر عند الدخول/الخروج {/*animating-an-element-on-enter*/}

تُفعَّل انتقالات الدخول/الخروج عندما يُضاف `<ViewTransition>` أو يُزال بواسطة مكوّن داخل انتقال:

```js
function Child() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

عند استدعاء `setShow`، تتحول `show` إلى `true` ويُعرض مكوّن `Child`. عند استدعاء `setShow` داخل `startTransition`، ويُصيّر `Child` عنصر `ViewTransition` قبل أي عقد DOM أخرى، يُفعَّل رسوم `enter`. 

عندما تعود `show` إلى `false`، يُفعَّل رسوم `exit`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

يُفعَّل `<ViewTransition>` فقط إذا وُضع قبل أي عقدة DOM. إذا كان `Child` بالشكل التالي، لن تُفعَّل أي رسوم:

```js [3, 5]
function Component() {
  return <ViewTransition>Hi</ViewTransition>;
}
```

</Pitfall>

---
### تحريك عنصر مشترك {/*animating-a-shared-element*/}

عادة لا ننصح بتعيين اسم لـ `<ViewTransition>` ونترك React يعيّن اسمًا تلقائيًا. السبب لتعيين اسم هو التحريك بين مكوّنات مختلفة تمامًا عند إلغاء تركيب شجرة وتركيب أخرى في الوقت نفسه، للحفاظ على الاستمرارية.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

عند إلغاء تركيب شجرة وتركيب أخرى، إذا وُجد زوج بنفس الاسم في الشجرة المُلغى تركيبها والشجرة المُركَّبة، يُفعَّل رسوم "share" على الجانبين. يتحرّك من جانب الإلغاء إلى جانب التركيب.

بخلاف رسوم الخروج/الدخول، يمكن أن يكون ذلك عميقًا داخل الشجرة المحذوفة/المركّبة. إذا كان `<ViewTransition>` مؤهّلًا أيضًا للخروج/الدخول، فرسوم "share" له الأولوية.

إذا ألغى الانتقال تركيب جانبًا أولًا ثم أدى إلى ظهور `<Suspense>` fallback قبل أن يُركَّب الاسم الجديد في النهاية، فلا يحدث انتقال عنصر مشترك.

<Sandpack>

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video, Thumbnail, FullscreenVideo} from "./Video";
import videos from "./data";

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return <FullscreenVideo
      video={videos[0]}
      onExit={() => startTransition(() => setFullscreen(false))}
    />
  }
  return <Video
    video={videos[0]}
    onClick={() => startTransition(() => setFullscreen(true))}
  />
}

```

```js src/Video.js
import {ViewTransition} from "react";

const THUMBNAIL_NAME = "video-thumbnail"

export function Thumbnail({ video, children }) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({ video, onClick }) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button
          className="close-button"
          onClick={onExit}
        >
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```


```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>


<Note>

إذا كان أي من جانبي الزوج (المركّب أو المُلغى تركيبه) خارج نافذة العرض، لا يتكوّن زوج. يضمن ذلك ألا «يطير» داخل أو خارج نافذة العرض عند التمرير. بدلًا من ذلك يُعامل كدخول/خروج عادي بمفرده.

لا يحدث ذلك إذا غيّرت نفس مثيل المكوّن موضعه، ما يُفعّل "update". تُحيى تلك بغضّ النظر عن كون أحد الموضعين خارج نافذة العرض.

هناك حاليًا سلوك غريب: إذا كان `<ViewTransition>` مُلغى تركيبه متداخلًا عميقًا داخل نافذة العرض بينما الجانب المركّب ليس داخلها، يتحرّك الجانب المُلغى تركيبه كرسوم "exit" خاص به حتى لو كان متداخلًا عميقًا، بدلًا من كونه جزءًا من رسوم الأب.

</Note>

<Pitfall>

من المهم ألا يُركَّب سوى شيء واحد بنفس الاسم في الوقت نفسه في التطبيق بأكمله. لذا من المهم استخدام مساحات أسماء فريدة للاسم لتجنّب التعارض. لضمان ذلك قد ترغب في إضافة ثابت في وحدة منفصلة تستوردها.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>


---

### تحريك إعادة ترتيب عناصر في قائمة {/*animating-reorder-of-items-in-a-list*/}


```js
items.map(item => <Component key={item.id} item={item} />)
```

عند إعادة ترتيب قائمة دون تحديث المحتوى، يُفعَّل رسوم "update" على كل `<ViewTransition>` في القائمة إذا كانت خارج عقدة DOM، بشكل مشابه لرسوم الدخول/الخروج.

يعني ذلك أن هذا سيُفعّل الرسوم على هذا `<ViewTransition>`:

```js
function Component() {
  return <ViewTransition><div>...</div></ViewTransition>;
}
```
<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

لكن هذا لن يحرّك كل عنصر على حدة:

```js
function Component() {
  return <div><ViewTransition>...</ViewTransition></div>;
}
```
بدلًا من ذلك، أي `<ViewTransition>` أب سيقوم بالتلاشي المتقاطع. إذا لم يوجد `<ViewTransition>` أب، فلا توجد رسوم في تلك الحالة.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

يعني ذلك أنك قد ترغب في تجنّب عناصر غلاف في القوائم حيث تريد أن يتحكّم المكوّن برسوم إعادة الترتيب الخاصة به:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

تنطبق القاعدة أعلاه أيضًا إذا حدّث أحد العناصر حجمه فتغيّر حجم الإخوة؛ سيُحرّك أيضًا `<ViewTransition>` الأخ لكن فقط إذا كانوا إخوة مباشرين.

يعني ذلك أنه أثناء تحديث يسبب إعادة تخطيط كبيرة، لا يُحرّك React كل `<ViewTransition>` في الصفحة على حدة. ذلك سيُنتج رسومًا مزعجة تشتّت عن التغيير الفعلي. لذا React أكثر تحفّظًا متى تُفعَّل رسوم فردية.

<Pitfall>

من المهم استخدام المفاتيح `keys` بشكل صحيح للحفاظ على الهوية عند إعادة ترتيب القوائم. قد يبدو أنك تستطيع استخدام "name" وانتقالات العناصر المشتركة لتحريك إعادة الترتيب، لكن ذلك لن يُفعَّل إذا كان أحد الجانبين خارج نافذة العرض. لتحريك إعادة ترتيب غالبًا تريد إظهار أن العنصر انتقل إلى موضع خارج نافذة العرض.

</Pitfall>

---

### التحريك من محتوى Suspense {/*animating-from-suspense-content*/}

كأي انتقال، ينتظر React البيانات وCSS الجديد (`<link rel="stylesheet" precedence="...">`) قبل تشغيل الرسوم. بالإضافة لذلك، تنتظر ViewTransitions حتى 500ms لتحميل خطوط جديدة قبل بدء الرسوم لتجنّب وميضها لاحقًا. لنفس السبب، الصورة الملفوفة في ViewTransition تنتظر تحميل الصورة.

إذا كانت داخل مثيل حدود Suspense جديد، يُعرض الـ fallback أولًا. بعد اكتمال تحميل حدود Suspense، يُفعَّل `<ViewTransition>` لتحريك الإظهار إلى المحتوى.

حاليًا، يحدث ذلك فقط لانتقال جانب العميل. في المستقبل، سيُحيى أيضًا حدود Suspense في SSR المتدفق عند تعليق المحتوى من الخادم أثناء التحميل الأول.

هناك طريقتان لتحريك حدود Suspense حسب مكان وضع `<ViewTransition>`:

تحديث (Update):

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```
في هذا السيناريو عندما ينتقل المحتوى من A إلى B، يُعامل كـ "update" وتُطبَّق تلك الفئة إن لزم. يحصل كل من A وB على نفس `view-transition-name` لذا يتصرفان كتلاشٍ متقاطع افتراضيًا.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: "loading"}
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition,
  Suspense
} from 'react';
import {Video, VideoPlaceholder} from "./Video";
import {useLazyVideoData} from "./data"

function LazyVideo() {
  const video = useLazyVideoData();
  return (
    <Video video={video}/>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from "react";

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(90deg, rgba(173, 216, 230, 0.3) 25%, rgba(135, 206, 250, 0.5) 50%, rgba(173, 216, 230, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

دخول/خروج:

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

في هذا السيناريو، هذان مثيلان منفصلان لـ ViewTransition لكل منهما `view-transition-name` خاص. يُعامل كـ "exit" لـ `<A>` و"enter" لـ `<B>`.

يمكنك تحقيق تأثيرات مختلفة حسب مكان وضع حدود `<ViewTransition>`.

---
### إلغاء الاشتراك في رسوم {/*opting-out-of-an-animation*/}

أحيانًا تلفّ مكوّنًا كبيرًا قائمًا مثل صفحة كاملة، وتريد تحريك بعض التحديثات مثل تغيير السمة. لكن لا تريد أن تُفعَّل كل التحديثات داخل الصفحة للتلاشي المتقاطع عند التحديث، خصوصًا إذا كنت تضيف رسومًا تدريجيًا.

يمكنك استخدام الفئة `"none"` لإلغاء رسوم معيّنة. بلفّ الأبناء في `"none"` تعطّل الرسوم لتحديثاتهم بينما لا يزال الأب يُفعّل الرسوم.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">
      {children}
    </ViewTransition>
  </div>
</ViewTransition>
```

سيُحيى فقط عند تغيّر السمة وليس عند تحديث الأبناء فقط. لا يزال بإمكان الأبناء الاشتراك مجددًا بـ `<ViewTransition>` خاص بهم، لكن على الأقل يعود الأمر يدويًا.

---

### تخصيص الرسوم {/*customizing-animations*/}

افتراضيًا، `<ViewTransition>` يتضمّن التلاشي المتقاطع الافتراضي من المتصفح.

لتخصيص الرسوم، مرّر خصائص إلى مكوّن `<ViewTransition>` لتحديد الرسوم المستخدمة حسب كيفية تفعيل `<ViewTransition>`.

مثلًا، يمكن إبطاء رسوم التلاشي المتقاطع الافتراضية:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

وعرّف slow-fade في CSS باستخدام فئات انتقال العرض:

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

بالإضافة إلى تعيين `default`، يمكنك أيضًا تمرير إعدادات لرسوم `enter` و`exit` و`update` و`share`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### تخصيص الرسوم بالأنواع {/*customizing-animations-with-types*/}
يمكنك استخدام واجهة [`addTransitionType`](/reference/react/addTransitionType) لإضافة اسم فئة للعناصر الأبناء عند تفعيل نوع انتقال معيّن لمحفّز تفعيل معيّن. يتيح ذلك تخصيص الرسوم لكل نوع انتقال.

مثلًا، لتخصيص الرسوم لكل التنقّلات للأمام وللخلف:

```js
<ViewTransition default={{
  'navigation-back': 'slide-right',
  'navigation-forward': 'slide-left',
 }}>
  <div>...</div>
</ViewTransition>
 
// in your router:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

عندما يفعّل ViewTransition رسوم "navigation-back"، يضيف React اسم الفئة "slide-right". عند تفعيل "navigation-forward"، يضيف اسم الفئة "slide-left".

في المستقبل، قد تضيف أجهزة التوجيه ومكتبات أخرى دعمًا لأنواع وأنماط انتقال العرض القياسية.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from "react";
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter={
        {
          "add-video-back": "slide-in-back",
          "add-video-forward": "slide-in-forward"
        }
      }
      exit={
        {
          "remove-video-back": "slide-in-forward",
          "remove-video-forward": "slide-in-back"
        }
      }>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-back")
              } else {
                addTransitionType("add-video-back")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >⬅️</button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-forward")
              } else {
                addTransitionType("add-video-forward")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >➡️</button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### بناء أجهزة توجيه تدعم انتقال العرض {/*building-view-transition-enabled-routers*/}

ينتظر React انتهاء أي تنقّل معلّق لضمان أن تتم استعادة التمرير داخل الرسوم. إذا كان التنقّل معلّقًا على React، يجب أن يُلغي الموجّه الحظر في `useLayoutEffect` لأن `useEffect` قد يؤدي إلى جمود.

إذا بدأ `startTransition` من حدث popstate القديم، مثلًا أثناء تنقّل «للخلف»، فيجب أن ينتهي متزامنًا لضمان عمل استعادة التمرير والنماذج بشكل صحيح. هذا يتعارض مع تشغيل رسوم View Transition. لذا يتخطّى React الرسوم القادمة من popstate، ولن تعمل الرسوم لزر الرجوع. يمكنك إصلاح ذلك بترقية الموجّه لاستخدام Navigation API.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### لا يُفعَّل `<ViewTransition>` لدي {/*my-viewtransition-is-not-activating*/}

يُفعَّل `<ViewTransition>` فقط إذا وُضع قبل أي عقدة DOM:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

للإصلاح، تأكد أن `<ViewTransition>` يأتي قبل أي عقد DOM أخرى:

```js [3, 5] 
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### أتلقى خطأ «There are two `<ViewTransition name=%s>` components with the same name mounted at the same time.» {/*two-viewtransition-with-same-name*/}

يحدث هذا الخطأ عندما يُركَّب مكوّنان `<ViewTransition>` بنفس `name` في الوقت نفسه:


```js [3]
function Item() {
  // 🚩 كل العناصر ستحصل على نفس "name".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} />)}
    </>
  );
}
```

سيسبب ذلك خطأ في View Transition. في التطوير، يكتشف React المشكلة ويسجّل خطأين:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

يوجد مكوّنان `<ViewTransition name=%s>` بنفس الاسم مُركَّبان في الوقت نفسه. هذا غير مدعوم وسيسبب أخطاء في View Transitions. استخدم اسمًا أكثر تميّزًا، مثلًا ببادئة مساحة اسم وإضافة معرّف العنصر إلى الاسم.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

النسخة المكررة الموجودة من `<ViewTransition name=%s>` لها مسار المكدس التالي.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

للإصلاح، تأكد أنه لا يُركَّب سوى `<ViewTransition>` واحد بنفس الاسم في الوقت نفسه في التطبيق بأكمله، بجعل `name` فريدًا أو بإضافة `id` إلى الاسم:

```js [3]
function Item({id}) {
  // ✅ لكل عنصر name فريد.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} item={item} />)}
    </>
  );
}
```

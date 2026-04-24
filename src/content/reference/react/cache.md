---
title: "دالة cache"
---

<RSC>

`cache` مخصّصة للاستخدام مع [مكوّنات خادم React](/reference/rsc/server-components).

</RSC>

<Intro>

`cache` تتيح تخزين نتيجة جلب بيانات أو حساب في الذاكرة المؤقتة.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `cache(fn)` {/*cache*/}

استدعِ `cache` خارج أي مكوّن لإنشاء نسخة من الدالة مع تخزين مؤقت.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

عند أول استدعاء لـ `getMetrics` مع `data`، تستدعي `getMetrics` الدالة `calculateMetrics(data)` وتخزن النتيجة في الذاكرة المؤقتة. إذا اُستدعيت `getMetrics` مجددًا بنفس `data`، تُرجع النتيجة المخزّنة بدل استدعاء `calculateMetrics(data)` مرة أخرى.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

- `fn`: الدالة التي تريد تخزين نتائجها. يمكن أن تأخذ `fn` أي معاملات وتُرجع أي قيمة.

#### القيمة المُرجَعة {/*returns*/}

`cache` تُرجع نسخة مخزّنة مؤقتًا من `fn` بنفس توقيع الأنواع. لا تستدعي `fn` أثناء ذلك.

عند استدعاء `cachedFn` بمعاملات معيّنة، تتحقق أولًا مما إذا كانت نتيجة مخزّنة موجودة. إن وُجدت تُرجعها. وإلا تستدعي `fn` بالمعاملات، تخزن النتيجة، وتُرجعها. يُستدعى `fn` فقط عند فشل التخزين المؤقت (cache miss).

<Note>

تحسين تخزين القيم المُرجعة بناءً على المدخلات يُعرف بـ [_memoization_](https://en.wikipedia.org/wiki/Memoization). نسمّي الدالة المُرجعة من `cache` دالة مذكّرة (memoized).

</Note>

#### ملاحظات {/*caveats*/}

- تُبطل React الذاكرة المؤقتة لكل الدوال المذكّرة عند كل طلب خادم.
- كل استدعاء لـ `cache` ينشئ دالة جديدة. أي أن استدعاء `cache` بنفس الدالة عدة مرات يُرجع دوالًا مذكّرة مختلفة لا تشارك نفس الذاكرة المؤقتة.
- `cachedFn` تخزّن الأخطاء أيضًا. إذا رمت `fn` خطأً لمعاملات معيّنة، يُخزَّن الخطأ ويُعاد رميه عند استدعاء `cachedFn` بنفس المعاملات.
- `cache` للاستخدام في [مكوّنات الخادم](/reference/rsc/server-components) فقط.

---

## الاستخدام {/*usage*/}

### تخزين حساب مكلف {/*cache-expensive-computation*/}

استخدم `cache` لتخطي العمل المكرر.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

إذا اُعرض نفس كائن `user` في `Profile` و`TeamReport` معًا، يمكن للمكوّنين مشاركة العمل واستدعاء `calculateUserMetrics` مرة واحدة فقط لذلك `user`.

لنفترض أن `Profile` يُعرض أولًا. يستدعي <CodeStep step={1}>`getUserMetrics`</CodeStep> ويتحقق من وجود نتيجة مخزّنة. بما أنه أول استدعاء لـ `getUserMetrics` مع ذلك `user`، يحدث cache miss. ثم تستدعي `getUserMetrics` الدالة `calculateUserMetrics` مع ذلك `user` وتكتب النتيجة إلى الذاكرة المؤقتة.

عندما يعرض `TeamReport` قائمة `users` ويصل إلى نفس كائن `user`، يستدعي <CodeStep step={2}>`getUserMetrics`</CodeStep> ويقرأ النتيجة من الذاكرة المؤقتة.

إذا كان يمكن إلغاء `calculateUserMetrics` بتمرير [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)، يمكنك استخدام [`cacheSignal()`](/reference/react/cacheSignal) لإلغاء الحساب المكلف إذا انتهى عرض React. قد تتعامل `calculateUserMetrics` مع الإلغاء داخليًا باستخدام `cacheSignal` مباشرة.

<Pitfall>

##### استدعاء دوال مذكّرة مختلفة يقرأ من ذاكرات مؤقتة مختلفة. {/*pitfall-different-memoized-functions*/}

للوصول إلى نفس الذاكرة المؤقتة، يجب أن تستدعي المكوّنات نفس الدالة المذكّرة.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

في المثال أعلاه، <CodeStep step={2}>`Precipitation`</CodeStep> و<CodeStep step={1}>`Temperature`</CodeStep> كلاهما يستدعي `cache` لإنشاء دالة مذكّرة جديدة ببحث ذاكرة مؤقتة خاص. إذا عُرض المكوّنان لنفس `cityData`، يُكرران العمل لاستدعاء `calculateWeekReport`.

إضافة إلى ذلك، `Temperature` تنشئ <CodeStep step={1}>دالة مذكّرة جديدة</CodeStep> في كل عرض للمكوّن، ما يمنع أي مشاركة للذاكرة المؤقتة.

لزيادة نجاحات التخزين المؤقت وتقليل العمل، يجب أن تستدعي المكوّنات نفس الدالة المذكّرة للوصول إلى نفس الذاكرة المؤقتة. عرّف الدالة المذكّرة بدلًا من ذلك في وحدة مخصّصة يمكن [`استيرادها`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) عبر المكوّنات.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
هنا، يستدعي كلا المكوّنين <CodeStep step={3}>نفس الدالة المذكّرة</CodeStep> المُصدَّرة من `./getWeekReport.js` للقراءة والكتابة إلى نفس الذاكرة المؤقتة.
</Pitfall>

### مشاركة لقطة بيانات {/*take-and-share-snapshot-of-data*/}

لمشاركة لقطة بيانات بين المكوّنات، استدعِ `cache` مع دالة جلب بيانات مثل `fetch`. عندما تجري عدة مكوّنات نفس جلب البيانات، يُنفَّذ طلب واحد فقط وتُخزَّن البيانات المُرجعة وتُشارَك بين المكوّنات. كل المكوّنات تشير إلى نفس لقطة البيانات عبر عرض الخادم.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

إذا عُرض `AnimatedWeatherCard` و`MinimalWeatherCard` لنفس <CodeStep step={1}>city</CodeStep>، يتلقيان نفس لقطة البيانات من <CodeStep step={2}>الدالة المذكّرة</CodeStep>.

إذا مرّر `AnimatedWeatherCard` و`MinimalWeatherCard` معاملات <CodeStep step={1}>city</CodeStep> مختلفة إلى <CodeStep step={2}>`getTemperature`</CodeStep>، يُستدعى `fetchTemperature` مرتين ويحصل كل موضع استدعاء على بيانات مختلفة.

<CodeStep step={1}>city</CodeStep> تعمل كمفتاح للذاكرة المؤقتة.

<Note>

<CodeStep step={3}>العرض غير المتزامن (Asynchronous rendering)</CodeStep> مدعوم فقط لمكوّنات الخادم.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

لعرض مكوّنات تستخدم بيانات غير متزامنة في مكوّنات العميل، راجع [توثيق `use()`](/reference/react/use).

</Note>

### تحميل مسبق للبيانات {/*preload-data*/}

بتخزين جلب بيانات طويل الأمد مؤقتًا، يمكنك بدء العمل غير المتزامن قبل عرض المكوّن.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

عند عرض `Page`، يستدعي المكوّن <CodeStep step={1}>`getUser`</CodeStep> لكن لاحظ أنه لا يستخدم البيانات المُرجَعة. استدعاء <CodeStep step={1}>`getUser`</CodeStep> المبكر يبدأ استعلام قاعدة البيانات غير المتزامن بينما `Page` تنفّذ حسابات أخرى وتعرض الأبناء.

عند عرض `Profile`، نستدعي <CodeStep step={2}>`getUser`</CodeStep> مجددًا. إذا كان استدعاء <CodeStep step={1}>`getUser`</CodeStep> الأول قد اكتمل وخزّن بيانات المستخدم، عندما <CodeStep step={2}>تطلب Profile هذه البيانات وتنتظرها</CodeStep> يمكنها ببساطة القراءة من الذاكرة المؤقتة دون استدعاء بعيد آخر. إذا لم يكتمل <CodeStep step={1}>طلب البيانات الأول</CodeStep>، يقلّل تحميل البيانات مسبقًا بهذا النمط التأخير في الجلب.

<DeepDive>

#### تخزين العمل غير المتزامن مؤقتًا {/*caching-asynchronous-work*/}

عند تقييم [دالة async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)، تحصل على [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) لهذا العمل. الـ Promise تحمل حالة العمل (_pending_، _fulfilled_، _failed_) والنتيجة النهائية.

في هذا المثال، الدالة غير المتزامنة <CodeStep step={1}>`fetchData`</CodeStep> تُرجع promise تنتظر `fetch`.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work
  await getData();
  // ...
}
```

عند استدعاء <CodeStep step={2}>`getData`</CodeStep> أول مرة، يُخزَّن الـ promise المُرجَع من <CodeStep step={1}>`fetchData`</CodeStep>. عمليات البحث اللاحقة تُرجع نفس الـ promise.

لاحظ أن أول استدعاء لـ <CodeStep step={2}>`getData`</CodeStep> لا يستخدم `await` بينما <CodeStep step={3}>الثاني</CodeStep> يستخدمه. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) عامل JavaScript ينتظر ويُرجع النتيجة المستقرة للـ promise. أول استدعاء لـ <CodeStep step={2}>`getData`</CodeStep> يبدأ فقط `fetch` لتخزين الـ promise ليبحث عنه استدعاء <CodeStep step={3}>`getData`</CodeStep> الثاني.

إذا كان الـ promise ما زال _pending_ عند <CodeStep step={3}>الاستدعاء الثاني</CodeStep>، يتوقف `await` عن النتيجة. التحسين أنه أثناء انتظار `fetch` يمكن لـ React مواصلة الحسابات، ما يقلل زمن انتظار <CodeStep step={3}>الاستدعاء الثاني</CodeStep>.

إذا كان الـ promise قد استقر بالفعل إلى خطأ أو نتيجة _fulfilled_، يُرجع `await` تلك القيمة فورًا. في الحالتين هناك فائدة أداء.
</DeepDive>

<Pitfall>

##### استدعاء دالة مذكّرة خارج مكوّن لا يستخدم الذاكرة المؤقتة. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

توفر React وصولًا للذاكرة المؤقتة للدالة المذكّرة داخل مكوّن فقط. عند استدعاء <CodeStep step={1}>`getUser`</CodeStep> خارج مكوّن، ما زالت الدالة تُنفَّذ لكن دون قراءة أو تحديث للذاكرة المؤقتة.

ذلك لأن وصول الذاكرة المؤقتة يُوفَّر عبر [سياق (context)](/learn/passing-data-deeply-with-context) متاح فقط من داخل مكوّن.

</Pitfall>

<DeepDive>

#### متى أستخدم `cache` أو [`memo`](/reference/react/memo) أو [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

كل الواجهات المذكورة تقدّم تذكيرًا (memoization) لكنها تختلف فيما تُذكَّر، ومن يصل للذاكرة المؤقتة، ومتى تُبطَل.

#### `useMemo` {/*deep-dive-use-memo*/}

بشكل عام، استخدم [`useMemo`](/reference/react/useMemo) لتخزين حساب مكلف في مكوّن عميل عبر عمليات العرض. مثلًا، لتذكير تحويل بيانات داخل مكوّن.

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
في هذا المثال، `App` تعرض مكوّني `WeatherReport` بنفس السجل. رغم أن المكوّنين ينفّذان نفس العمل، لا يمكنهما مشاركة العمل. ذاكرة `useMemo` محلية بالمكوّن فقط.

مع ذلك، `useMemo` تضمن أنه إذا أُعيد عرض `App` ولم يتغيّر كائن `record`، تتخطى كل نسخة العمل وتستخدم القيمة المذكّرة لـ `avgTemp`. `useMemo` تخزّن فقط آخر حساب لـ `avgTemp` بالتبعيات المعطاة.

#### `cache` {/*deep-dive-cache*/}

بشكل عام، استخدم `cache` في مكوّنات الخادم لتذكير عمل يمكن مشاركته بين المكوّنات.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
بإعادة كتابة المثال السابق باستخدام `cache`، في هذه الحالة ستتمكن <CodeStep step={3}>النسخة الثانية من `WeatherReport`</CodeStep> من تخطي العمل المكرر والقراءة من نفس ذاكرة <CodeStep step={1}>أول `WeatherReport`</CodeStep>. فرق آخر عن المثال السابق أن `cache` موصى بها أيضًا لـ <CodeStep step={2}>تذكير جلب البيانات</CodeStep>، بخلاف `useMemo` التي يجب أن تُستخدم للحسابات فقط.

حاليًا، يجب استخدام `cache` في مكوّنات الخادم فقط، وتُبطل الذاكرة المؤقتة بين طلبات الخادم.

#### `memo` {/*deep-dive-memo*/}

استخدم [`memo`](reference/react/memo) لمنع إعادة عرض مكوّن إذا لم تتغيّر خصائصه.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

في هذا المثال، يستدعي كلا مكوّني `MemoWeatherReport` الدالة `calculateAvg` عند أول عرض. لكن إذا أُعيد عرض `App` دون تغيّر `record`، لم تتغيّر الخصائص ولن يُعاد عرض `MemoWeatherReport`.

مقارنة بـ `useMemo`، `memo` تذكّر عرض المكوّن بناءً على الخصائص مقابل حسابات محددة. مثل `useMemo`، المكوّن المذكّر يخزّن فقط آخر عرض بآخر قيم خصائص. عند تغيّر الخصائص، تُبطل الذاكرة ويُعاد عرض المكوّن.

</DeepDive>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### ما زالت دالتي المذكّرة تُنفَّذ رغم استدعائيها بنفس المعاملات {/*memoized-function-still-runs*/}

راجع الفخاخ المذكورة سابقًا
* [استدعاء دوال مذكّرة مختلفة يقرأ من ذاكرات مؤقتة مختلفة.](#pitfall-different-memoized-functions)
* [استدعاء دالة مذكّرة خارج مكوّن لا يستخدم الذاكرة المؤقتة.](#pitfall-memoized-call-outside-component)

إذا لم ينطبق شيء مما سبق، قد تكون المشكلة في كيفية تحقق React من وجود نتيجة في الذاكرة المؤقتة.

إذا لم تكن معاملاتك [أوليات (primitives)](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (مثل كائنات أو دوال أو مصفوفات)، تأكد أنك تمرّر نفس مرجع الكائن.

عند استدعاء دالة مذكّرة، تبحث React عن المعاملات المدخلة لمعرفة ما إذا كانت النتيجة مخزّنة. تستخدم React المساواة السطحية للمعاملات لتحديد وجود تطابق في الذاكرة المؤقتة.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

في هذه الحالة يبدو أن `MapMarker` الاثنين ينفّذان نفس العمل ويستدعيان `calculateNorm` بنفس القيمة `{x: 10, y: 10, z:10}`. رغم تطابق القيم، المراجع ليست نفس مرجع الكائن لأن كل مكوّن ينشئ كائن `props` خاصًا به.

ستستدعي React [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) على المدخلات للتحقق من وجود تطابق في الذاكرة المؤقتة.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

إحدى الطرق تمرير أبعاد المتجه إلى `calculateNorm`. ينجح ذلك لأن الأبعاد نفسها أوليات.

حل آخر تمرير كائن المتجه نفسه كخاصية للمكوّن. نحتاج تمرير نفس الكائن إلى نسختي المكوّن.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```

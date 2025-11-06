---
title: "إيقاف Create React App"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: اليوم، نقوم بإيقاف Create React App للتطبيقات الجديدة، ونشجع التطبيقات الحالية على الترحيل إلى إطار عمل، أو الترحيل إلى أداة بناء مثل Vite أو Parcel أو RSBuild. نقدم أيضًا وثائق للحالات التي لا يكون فيها إطار العمل مناسبًا لمشروعك، أو عندما ترغب في بناء إطار عمل خاص بك، أو عندما ترغب فقط في تعلم كيفية عمل React عن طريق بناء تطبيق React من الصفر.
---

14 فبراير 2025 بواسطة [Matt Carroll](https://twitter.com/mattcarrollcode) و [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

اليوم، نقوم بإيقاف [Create React App](https://create-react-app.dev/) للتطبيقات الجديدة، ونشجع التطبيقات الحالية على الترحيل إلى [إطار عمل](#how-to-migrate-to-a-framework)، أو [الترحيل إلى أداة بناء](#how-to-migrate-to-a-build-tool) مثل Vite أو Parcel أو RSBuild.

نقدم أيضًا وثائق للحالات التي لا يكون فيها إطار العمل مناسبًا لمشروعك، أو عندما ترغب في بناء إطار عمل خاص بك، أو عندما ترغب فقط في تعلم كيفية عمل React عن طريق [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch).

</Intro>

-----

عندما أطلقنا Create React App في عام 2016، لم تكن هناك طريقة واضحة لبناء تطبيق React جديد.

لإنشاء تطبيق React، كان عليك تثبيت مجموعة من الأدوات وربطها معًا بنفسك لدعم الميزات الأساسية مثل JSX، والتحقق من الأخطاء (linting)، وإعادة التحميل السريع (hot reloading). كان هذا صعبًا جدًا للقيام به بشكل صحيح، لذلك قام [المجتمع](https://github.com/react-boilerplate/react-boilerplate) [بإنشاء](https://github.com/kriasoft/react-starter-kit) [نماذج جاهزة](https://github.com/petehunt/react-boilerplate) [للإعدادات](https://github.com/erikras/react-redux-universal-hot-example) [الشائعة](https://github.com/gaearon/react-hot-boilerplate). ومع ذلك، كانت النماذج الجاهزة صعبة التحديث والتجزئة جعلت من الصعب على React إصدار ميزات جديدة.

حل Create React App هذه المشاكل من خلال دمج عدة أدوات في تكوين واحد موصى به. سمح هذا للتطبيقات بطريقة بسيطة للترقية إلى ميزات الأدوات الجديدة، وسمح لفريق React بنشر تغييرات كبيرة في الأدوات (دعم Fast Refresh، قواعد التحقق من أخطاء React Hooks) لأوسع جمهور ممكن.

أصبح هذا النموذج شائعًا جدًا لدرجة أن هناك فئة كاملة من الأدوات تعمل بهذه الطريقة اليوم.

## إيقاف Create React App {/*deprecating-create-react-app*/}

على الرغم من أن Create React App يسهل البدء، إلا أن [هناك العديد من القيود](#limitations-of-build-tools) التي تجعل من الصعب بناء تطبيقات إنتاجية عالية الأداء. من حيث المبدأ، يمكننا حل هذه المشاكل عن طريق تطويره بشكل أساسي إلى [إطار عمل](#why-we-recommend-frameworks).

ومع ذلك، نظرًا لأن Create React App ليس لديه حاليًا مشرفون نشطون، وهناك العديد من الأطر الحالية التي تحل هذه المشاكل بالفعل، فقد قررنا إيقاف Create React App.

بدءًا من اليوم، إذا قمت بتثبيت تطبيق جديد، فسترى تحذيرًا بالإيقاف:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app تم إيقافه.
{'\n\n'}
يمكنك العثور على قائمة بأطر عمل React المحدثة على react.dev
لمزيد من المعلومات، راجع: react.dev/link/cra
{'\n\n'}
سيتم عرض رسالة الخطأ هذه مرة واحدة فقط لكل تثبيت.

</ConsoleLogLine>
</ConsoleBlockMulti>

لقد أضفنا أيضًا إشعارًا بالإيقاف إلى [موقع](https://create-react-app.dev/) Create React App ومستودع [GitHub](https://github.com/facebook/create-react-app). سيستمر Create React App في العمل في وضع الصيانة، وقد نشرنا إصدارًا جديدًا من Create React App للعمل مع React 19.

## كيفية الترحيل إلى إطار عمل {/*how-to-migrate-to-a-framework*/}
نوصي [بإنشاء تطبيقات React جديدة](/learn/creating-a-react-app) باستخدام إطار عمل. تدعم جميع الأطر التي نوصي بها العرض من جانب العميل ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)) وتطبيقات الصفحة الواحدة ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))، ويمكن نشرها على CDN أو خدمة استضافة ثابتة بدون خادم.

بالنسبة للتطبيقات الحالية، ستساعدك هذه الأدلة على الترحيل إلى SPA من جانب العميل فقط:

* [دليل ترحيل Next.js من Create React App](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [دليل اعتماد إطار عمل React Router](https://reactrouter.com/upgrading/component-routes).
* [دليل ترحيل Expo webpack إلى Expo Router](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## كيفية الترحيل إلى أداة بناء {/*how-to-migrate-to-a-build-tool*/}

إذا كان تطبيقك به قيود غير عادية، أو كنت تفضل حل هذه المشاكل عن طريق بناء إطار عمل خاص بك، أو كنت ترغب فقط في تعلم كيفية عمل React من الصفر، يمكنك إنشاء إعداد مخصص خاص بك مع React باستخدام Vite أو Parcel أو Rsbuild.

بالنسبة للتطبيقات الحالية، ستساعدك هذه الأدلة على الترحيل إلى أداة بناء:

* [دليل ترحيل Vite من Create React App](https://www.robinwieruch.de/vite-create-react-app/)
* [دليل ترحيل Parcel من Create React App](https://parceljs.org/migration/cra/)
* [دليل ترحيل Rsbuild من Create React App](https://rsbuild.dev/guide/migration/cra)

للمساعدة في البدء مع Vite أو Parcel أو Rsbuild، أضفنا وثائق جديدة لـ [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch).

<DeepDive>

#### هل أحتاج إلى إطار عمل؟ {/*do-i-need-a-framework*/}

ستستفيد معظم التطبيقات من إطار عمل، ولكن هناك حالات صالحة لبناء تطبيق React من الصفر. قاعدة جيدة هي أنه إذا كان تطبيقك يحتاج إلى توجيه (routing)، فمن المحتمل أن تستفيد من إطار عمل.

تمامًا كما أن Svelte لديه Sveltekit، و Vue لديه Nuxt، و Solid لديه SolidStart، [توصي React باستخدام إطار عمل](#why-we-recommend-frameworks) يدمج التوجيه بالكامل في ميزات مثل جلب البيانات وتقسيم الكود خارج الصندوق. هذا يتجنب عناء الحاجة إلى كتابة تكوينات معقدة خاصة بك وبناء إطار عمل بنفسك بشكل أساسي.

ومع ذلك، يمكنك دائمًا [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch) باستخدام أداة بناء مثل Vite أو Parcel أو Rsbuild.

</DeepDive>

تابع القراءة لمعرفة المزيد حول [قيود أدوات البناء](#limitations-of-build-tools) و [لماذا نوصي بأطر العمل](#why-we-recommend-frameworks).

## قيود أدوات البناء {/*limitations-of-build-tools*/}

Create React App وأدوات البناء المشابهة تجعل من السهل البدء في بناء تطبيق React. بعد تشغيل `npx create-react-app my-app`، تحصل على تطبيق React مهيأ بالكامل مع خادم تطوير، وتدقيق، وبناء للإنتاج.

على سبيل المثال، إذا كنت تبني أداة إدارة داخلية، يمكنك البدء بصفحة هبوط:

```js
export default function App() {
  return (
    <div>
      <h1>مرحبًا بك في أداة الإدارة!</h1>
    </div>
  )
}
```

يتيح لك هذا البدء فورًا في البرمجة باستخدام React مع ميزات مثل JSX، وقواعد التدقيق الافتراضية، وحزمة لتشغيلها في كل من التطوير والإنتاج. ومع ذلك، يفتقر هذا الإعداد إلى الأدوات التي تحتاجها لبناء تطبيق إنتاجي حقيقي.

تحتاج معظم تطبيقات الإنتاج إلى حلول لمشاكل مثل التوجيه، وجلب البيانات، وتقسيم الكود.

### التوجيه {/*routing*/}

لا يتضمن Create React App حلاً محددًا للتوجيه. إذا كنت قد بدأت للتو، فإن أحد الخيارات هو استخدام `useState` للتبديل بين المسارات. ولكن القيام بذلك يعني أنه لا يمكنك مشاركة روابط لتطبيقك - كل رابط سيؤدي إلى نفس الصفحة - ويصبح تنظيم تطبيقك صعبًا بمرور الوقت:

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ التوجيه في الحالة لا ينشئ عناوين URL
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

لهذا السبب، تضيف معظم التطبيقات التي تستخدم Create React App التوجيه باستخدام مكتبة توجيه مثل [React Router](https://reactrouter.com/) أو [Tanstack Router](https://tanstack.com/router/latest). باستخدام مكتبة التوجيه، يمكنك إضافة مسارات إضافية إلى التطبيق، مما يوفر آراء حول بنية تطبيقك، ويسمح لك ببدء مشاركة الروابط إلى المسارات. على سبيل المثال، مع React Router يمكنك تحديد المسارات:

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ كل مسار له عنوان URL خاص به
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

مع هذا التغيير، يمكنك مشاركة رابط إلى `/dashboard` وسينتقل التطبيق إلى صفحة لوحة التحكم. بمجرد أن يكون لديك مكتبة توجيه، يمكنك إضافة ميزات إضافية مثل المسارات المتداخلة، وحراس المسار، وانتقالات المسار، والتي يصعب تنفيذها بدون مكتبة توجيه.

هناك مقايضة هنا: تضيف مكتبة التوجيه تعقيدًا إلى التطبيق، لكنها تضيف أيضًا ميزات يصعب تنفيذها بدونها.

### جلب البيانات {/*data-fetching*/}

مشكلة شائعة أخرى في Create React App هي جلب البيانات. لا يتضمن Create React App حلاً محددًا لجلب البيانات. إذا كنت قد بدأت للتو، فإن الخيار الشائع هو استخدام `fetch` في تأثير لتحميل البيانات.

ولكن القيام بذلك يعني أن البيانات يتم جلبها بعد عرض المكون، مما قد يسبب شلالات الشبكة. تحدث شلالات الشبكة بسبب جلب البيانات عند عرض تطبيقك بدلاً من جلبها بالتوازي أثناء تنزيل الكود:

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ جلب البيانات في مكون يسبب شلالات الشبكة
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

يعني الجلب في تأثير أن المستخدم يجب أن ينتظر وقتًا أطول لرؤية المحتوى، على الرغم من أنه كان من الممكن جلب البيانات في وقت سابق. لحل هذه المشكلة، يمكنك استخدام مكتبة جلب بيانات مثل [React Query](https://react-query.tanstack.com/)، [SWR](https://swr.vercel.app/)، [Apollo](https://www.apollographql.com/docs/react)، أو [Relay](https://relay.dev/) التي توفر خيارات لجلب البيانات مسبقًا بحيث يبدأ الطلب قبل عرض المكون.

تعمل هذه المكتبات بشكل أفضل عند دمجها مع نمط "المحمل" الخاص بالتوجيه لتحديد تبعيات البيانات على مستوى المسار، مما يسمح للموجه بتحسين عمليات جلب البيانات الخاصة بك:

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ جلب البيانات بالتوازي أثناء تنزيل الكود
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

عند التحميل الأولي، يمكن للموجه جلب البيانات على الفور قبل عرض المسار. أثناء تنقل المستخدم في التطبيق، يكون الموجه قادرًا على جلب كل من البيانات والمسار في نفس الوقت، مما يوازي عمليات الجلب. هذا يقلل من الوقت الذي يستغرقه رؤية المحتوى على الشاشة، ويمكن أن يحسن تجربة المستخدم.

ومع ذلك، يتطلب هذا تكوين المحملات بشكل صحيح في تطبيقك ويقايض التعقيد بالأداء.

### تقسيم الكود {/*code-splitting*/}

مشكلة شائعة أخرى في Create React App هي [تقسيم الكود](https://www.patterns.dev/vanilla/bundle-splitting). لا يتضمن Create React App حلاً محددًا لتقسيم الكود. إذا كنت قد بدأت للتو، فقد لا تفكر في تقسيم الكود على الإطلاق.

هذا يعني أن تطبيقك يتم شحنه كحزمة واحدة:

```txt
- bundle.js    75kb
```

ولكن للحصول على أداء مثالي، يجب عليك "تقسيم" الكود الخاص بك إلى حزم منفصلة بحيث يحتاج المستخدم فقط إلى تنزيل ما يحتاجه. هذا يقلل من الوقت الذي يحتاجه المستخدم للانتظار لتحميل تطبيقك، عن طريق تنزيل الكود الذي يحتاجه فقط لرؤية الصفحة التي يتصفحها.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

إحدى طرق تقسيم الكود هي باستخدام `React.lazy`. ومع ذلك، هذا يعني أن الكود لا يتم جلبه حتى يتم عرض المكون، مما قد يسبب شلالات الشبكة. الحل الأمثل هو استخدام ميزة الموجه التي تجلب الكود بالتوازي أثناء تنزيل الكود. على سبيل المثال، يوفر React Router خيار `lazy` لتحديد أنه يجب تقسيم الكود للمسار وتحسين وقت تحميله:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ يتم تنزيل المسارات قبل العرض
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

من الصعب الحصول على تقسيم الكود المحسن بشكل صحيح، ومن السهل ارتكاب أخطاء يمكن أن تتسبب في تنزيل المستخدم لمزيد من الكود مما يحتاجه. يعمل بشكل أفضل عند دمجه مع حلول التوجيه وتحميل البيانات الخاصة بك لزيادة التخزين المؤقت، وموازاة عمليات الجلب، ودعم أنماط ["الاستيراد عند التفاعل"](https://www.patterns.dev/vanilla/import-on-interaction).

### والمزيد... {/*and-more*/}

هذه مجرد أمثلة قليلة على قيود Create React App.

بمجرد دمج التوجيه وجلب البيانات وتقسيم الكود، تحتاج الآن أيضًا إلى التفكير في الحالات المعلقة، وانقطاعات التنقل، ورسائل الخطأ للمستخدم، وإعادة التحقق من صحة البيانات. هناك فئات كاملة من المشاكل التي يحتاج المستخدمون إلى حلها مثل:

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>إمكانية الوصول</li>
    <li>تحميل الأصول</li>
    <li>المصادقة</li>
    <li>التخزين المؤقت</li>
  </ul>
  <ul>
    <li>معالجة الأخطاء</li>
    <li>تعديل البيانات</li>
    <li>التنقلات</li>
    <li>التحديثات المتفائلة</li>
  </ul>
  <ul>
    <li>التحسين التدريجي</li>
    <li>العرض من جانب الخادم</li>
    <li>إنشاء موقع ثابت</li>
    <li>البث</li>
  </ul>
</div>

كل هذه تعمل معًا لإنشاء [تسلسل التحميل](https://www.patterns.dev/vanilla/loading-sequence) الأمثل.

قد يكون حل كل من هذه المشاكل بشكل فردي في Create React App صعبًا لأن كل مشكلة مترابطة مع الأخرى ويمكن أن تتطلب خبرة عميقة في مجالات المشاكل التي قد لا يكون المستخدمون على دراية بها. من أجل حل هذه المشاكل، ينتهي الأمر بالمستخدمين إلى بناء حلولهم المخصصة فوق Create React App، وهي المشكلة التي حاول Create React App حلها في الأصل.

## لماذا نوصي بأطر العمل {/*why-we-recommend-frameworks*/}

على الرغم من أنه يمكنك حل كل هذه القطع بنفسك في أداة بناء مثل Create React App أو Vite أو Parcel، إلا أنه من الصعب القيام بذلك بشكل جيد. تمامًا كما هو الحال عندما قام Create React App نفسه بدمج العديد من أدوات البناء معًا، فأنت بحاجة إلى أداة لدمج كل هذه الميزات معًا لتوفير أفضل تجربة للمستخدمين.

تُعرف هذه الفئة من الأدوات التي تدمج أدوات البناء والعرض والتوجيه وجلب البيانات وتقسيم الكود باسم "أطر العمل" - أو إذا كنت تفضل تسمية React نفسها إطار عمل، فيمكنك تسميتها "أطر عمل فوقية".

تفرض أطر العمل بعض الآراء حول تنظيم تطبيقك من أجل توفير تجربة مستخدم أفضل بكثير، بنفس الطريقة التي تفرض بها أدوات البناء بعض الآراء لجعل الأدوات أسهل. هذا هو السبب في أننا بدأنا في التوصية بأطر عمل مثل [Next.js](https://nextjs.org/) و [React Router](https://reactrouter.com/) و [Expo](https://expo.dev/) للمشاريع الجديدة.

توفر أطر العمل نفس تجربة البدء مثل Create React App، ولكنها توفر أيضًا حلولًا للمشاكل التي يحتاج المستخدمون إلى حلها على أي حال في تطبيقات الإنتاج الحقيقية.

<DeepDive>

#### العرض من جانب الخادم اختياري {/*server-rendering-is-optional*/}

توفر جميع الأطر التي نوصي بها خيار إنشاء تطبيق [عرض من جانب العميل (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR).

في بعض الحالات، يكون CSR هو الخيار الصحيح للصفحة، ولكن في كثير من الأحيان لا يكون كذلك. حتى لو كان معظم تطبيقك من جانب العميل، فغالبًا ما تكون هناك صفحات فردية يمكن أن تستفيد من ميزات العرض من جانب الخادم مثل [إنشاء موقع ثابت (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) أو [العرض من جانب الخادم (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR)، على سبيل المثال صفحة شروط الخدمة، أو الوثائق.

يُرسل العرض من جانب الخادم عمومًا كمية أقل من JavaScript إلى العميل، ومستند HTML كامل ينتج [أول رسم محتوى (FCP)](https://web.dev/articles/fcp) أسرع عن طريق تقليل [إجمالي وقت الحظر (TBD)](https://web.dev/articles/tbt)، والذي يمكن أن يقلل أيضًا من [التفاعل مع الرسم التالي (INP)](https://web.dev/articles/inp). هذا هو السبب في أن [فريق Chrome شجع](https://web.dev/articles/rendering-on-the-web) المطورين على التفكير في العرض الثابت أو من جانب الخادم على نهج العميل الكامل لتحقيق أفضل أداء ممكن.

هناك مقايضات لاستخدام الخادم، وليس دائمًا الخيار الأفضل لكل صفحة. يترتب على إنشاء الصفحات على الخادم تكلفة إضافية ويستغرق وقتًا لإنشائها مما قد يزيد من [الوقت حتى أول بايت (TTFB)](https://web.dev/articles/ttfb). أفضل التطبيقات أداءً هي تلك التي يمكنها اختيار استراتيجية العرض الصحيحة على أساس كل صفحة على حدة، بناءً على مقايضات كل استراتيجية.

توفر أطر العمل خيار استخدام الخادم على أي صفحة إذا كنت ترغب في ذلك، ولكنها لا تجبرك على استخدام الخادم. يتيح لك هذا اختيار استراتيجية العرض الصحيحة لكل صفحة في تطبيقك.

#### ماذا عن مكونات الخادم {/*what-about-server-components*/}

تتضمن الأطر التي نوصي بها أيضًا دعمًا لمكونات خادم React.

تساعد مكونات الخادم في حل هذه المشاكل عن طريق نقل التوجيه وجلب البيانات إلى الخادم، والسماح بتقسيم الكود لمكونات العميل بناءً على البيانات التي تعرضها، بدلاً من مجرد المسار المعروض، وتقليل كمية JavaScript المشحونة للحصول على أفضل [تسلسل تحميل](https://www.patterns.dev/vanilla/loading-sequence) ممكن.

لا تتطلب مكونات الخادم خادمًا. يمكن تشغيلها في وقت البناء على خادم CI الخاص بك لإنشاء تطبيق تم إنشاؤه بشكل ثابت (SSG)، في وقت التشغيل على خادم ويب لتطبيق معروض من جانب الخادم (SSR).

راجع [تقديم مكونات خادم React بدون حزمة](/blog/2020/12/21/data-fetching-with-react-server-components) و [الوثائق](/reference/rsc/server-components) لمزيد من المعلومات.

</DeepDive>

<Note>

#### العرض من جانب الخادم ليس فقط لتحسين محركات البحث {/*server-rendering-is-not-just-for-seo*/}

من المفاهيم الخاطئة الشائعة أن العرض من جانب الخادم مخصص فقط لـ [تحسين محركات البحث (SEO)](https://developer.mozilla.org/en-US/docs/Glossary/SEO).

بينما يمكن أن يحسن العرض من جانب الخادم تحسين محركات البحث، فإنه يحسن أيضًا الأداء عن طريق تقليل كمية JavaScript التي يحتاج المستخدم إلى تنزيلها وتحليلها قبل أن يتمكن من رؤية المحتوى على الشاشة.

هذا هو السبب في أن فريق Chrome [شجع](https://web.dev/articles/rendering-on-the-web) المطورين على التفكير في العرض الثابت أو من جانب الخادم على نهج العميل الكامل لتحقيق أفضل أداء ممكن.

</Note>

---

_شكرًا لـ [Dan Abramov](https://bsky.app/profile/danabra.mov) على إنشاء Create React App، و [Joe Haddad](https://github.com/Timer)، [Ian Schmitz](https://github.com/ianschmitz)، [Brody McKee](https://github.com/mrmckeb)، و [آخرين كثر](https://github.com/facebook/create-react-app/graphs/contributors) على صيانة Create React App على مر السنين. شكرًا لـ [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social)، [Dan Abramov](https://bsky.app/profile/danabra.mov)، [Devon Govett](https://bsky.app/profile/devongovett.bsky.social)، [Eli White](https://x.com/Eli_White)، [Jack Herrington](https://bsky.app/profile/jherr.dev)، [Joe Savona](https://x.com/en_JS)، [Lauren Tan](https://bsky.app/profile/no.lol)، [Lee Robinson](https://x.com/leeerob)، [Mark Erikson](https://bsky.app/profile/acemarke.dev)، [Ryan Florence](https://x.com/ryanflorence)، [Sophie Alpert](https://bsky.app/profile/sophiebits.com)، [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com)، و [Theo Browne](https://x.com/theo) على مراجعة وتقديم ملاحظات على هذا المنشور._


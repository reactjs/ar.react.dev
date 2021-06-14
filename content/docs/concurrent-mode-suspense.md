---
id: concurrent-mode-suspense
title: Suspense لجلب البيانات (تجريبي)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
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
<<<<<<< HEAD
>تصف هذه الصفحة **الميزات التجريبية [الـغير متوفرة بعد](/docs/concurrent-mode-adoption.html) في إصدار ثابت**. لا تعتمد على بناءات React التجريبية في تطبيقات الإنتاج. قد تتغير هذه الميزات بشكل كبير ودون سابق إنذار قبل أن تصبح جزءًا من React.
>
>هذه الوثائق تهدف إلى المستخدمون الأوائل والأشخاص الفضوليين. **إذا كنت جديدًا في React، فلا تقلق بشأن هذه الميزات** - لست بحاجة إلى تعلمها الآن. على سبيل المثال، إذا كنت تبحث عن دليل تطبيقي لجلب البيانات يعمل اليوم، فاقرأ [هذه المقالة](https://www.robinwieruch.de/react-hooks-fetch-data/) بدلاً من ذلك.
=======
>This page was about experimental features that aren't yet available in a stable release. It was aimed at early adopters and people who are curious.
>
>Much of the information on this page is now outdated and exists only for archival purposes. **Please refer to the [React 18 Alpha announcement post](/blog/2021/06/08/the-plan-for-react-18.html
) for the up-to-date information.**
>
>Before React 18 is released, we will replace this page with stable documentation.
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606

</div>

أضاف React 16.6 مكونًا `<Suspense>` يتيح لك "الانتظار" بعض الشيفرة البرمجية لتحميله وتحديد قيم مصرح بها وتحميل الحالة (مثل الدوار) أثناء انتظارنا:

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

ميزة Suspense لجلب البيانات هي ميزة جديدة تتيح لك أيضًا استخدام `<Suspense>`  **بشكل تعريفي "الانتظار" عن أي شيء آخر، بما في ذلك البيانات.** تركز هذه الصفحة على حالة جلب البيانات، لكن يمكنها أيضًا انتظار الصور أو النصوص أو أي أعمال أخرى غير متزامنة.

- [ما هو Suspense ،بالضبط؟](#what-is-suspense-exactly)
  - [ما Suspense ليس كذلك](#what-suspense-is-not)
  - [ماذا يتيح لك Suspense القيام به](#what-suspense-lets-you-do)
- [استخدام Suspense بالممارسة](#using-suspense-in-practice)
  - [ماذا لو لم أستخدم الترحيل؟](#what-if-i-dont-use-relay)
  - [لمؤلفي المكتبة](#for-library-authors)
- [المناهج التقليدية مقابل Suspense](#traditional-approaches-vs-suspense)
  - [المنهج 1: الجلب على التصيير (لا يستخدم Suspense)](#approach-1-fetch-on-render-not-using-suspense)
  - [المنهج 2: الجلب ثم التصيير (عدم استخدام Suspense)](#approach-2-fetch-then-render-not-using-suspense)
  - [المنهج 3: التصيير كما انت تجلب (باستخدام Suspense)](#approach-3-render-as-you-fetch-using-suspense)
- [البدء في الجلب المبكر](#start-fetching-early)
  - [ما زلنا نتفحص هذا الأمر](#were-still-figuring-this-out)
- [Suspense و حالات التسابق](#suspense-and-race-conditions)
  - [حالات التسابق مع useEffect](#race-conditions-with-useeffect)
  - [حالات التسابق مع componentDidUpdate](#race-conditions-with-componentdidupdate)
  - [المشكلة](#the-problem)
  - [حل حالات التسابق مع Suspense](#solving-race-conditions-with-suspense)
- [معالجة الأخطاء](#handling-errors)
- [الخطوات التالية](#next-steps)

## ما هو Suspense ،بالضبط؟ {#what-is-suspense-exactly}

يتيح Suspense لمكوناتك "الانتظار" لشيء ما قبل أن يتمكنوا من العرض. في [هذا المثال](https://codesandbox.io/s/frosty-hermann-bztrp) ،هناك مكونان ينتظران استدعاء واجهة برمجة تطبيقات ( API ) غير متزامنة لجلب بعض البيانات:

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

هذا العرض مجرد اعلان تشويقى. لا تقلق إذا لم يكن الأمر منطقيًا بعد. سنتحدث أكثر عن كيفية عمله أدناه. ضع في اعتبارك أن Suspense أكثر من *آلية*، وأن واجهات برمجة التطبيقات المعينة مثل `fetchProfileData()` أو `resource.posts.read()` في المثال أعلاه ليست مهمة للغاية. إذا كنت مهتمًا بالفضول، فيمكنك العثور على تعريفاتها في [هذا العرض التوضيحي](https://codesandbox.io/s/frosty-hermann-bztrp).

Suspense ليس مكتبة جلب البيانات. إنها **آلية لجلب البيانات من المكتبات** للتواصل مع React بأن *البيانات التي يقرأها المكون ليست جاهزة بعد*. يمكن أن تنتظر React حتى تكون جاهزة وتحديث واجهة المستخدم. في Facebook ،نستخدم Relay و [تكامل بواسطة Suspense الجديدة](https://relay.dev/docs/en/experimental/step-by-step). نتوقع أن توفر مكتبات أخرى مثل Apollo تكاملات مماثلة.

على المدى الطويل ، نعتزم أن تصبح Suspense هي الطريقة الأساسية لقراءة البيانات غير المتزامنة من المكونات - بغض النظر عن مصدر هذه البيانات.

### ما Suspense ليس كذلك {#what-suspense-is-not}

يختلف Suspense بشكل كبير عن المنهج الحالي لهذه المشكلات، لذلك غالباً ما تؤدي القراءة عنها لأول مرة إلى مفاهيم خاطئة. دعنا نوضح الأكثر شيوعًا:

* **ليس تطبيقًا لجلب البيانات.** لا يفترض أنك تستخدم GraphQL أو REST أو أي تنسيق بيانات أو مكتبة أو نقل أو بروتوكول معين آخر.

* **ليس عميلًا جاهزًا للاستخدام.** لا يمكنك "استبدال" `fetch` أو Relay مع Suspense. ولكن يمكنك استخدام مكتبة مدمجة مع Suspense (على سبيل المثال ، [واجهات برمجة تطبيقات Relay جديدة](https://relay.dev/docs/en/experimental/api-reference)).

 * **لا يقترن البيانات التي تجلب إلى طبقة العرض.** إنها تساعد في تنظيم عرض حالات التحميل في واجهة المستخدم الخاصة بك ، لكنها لا تربط منطق الشبكة الخاص بك بمكونات React.

### ماذا يتيح لك Suspense القيام به {#what-suspense-lets-you-do}

إذن ما هي الفائدة من Suspense؟ هناك بعض الطرق التي يمكننا من خلالها الإجابة عن هذا:

* **يتيح دمج مكتبات جلب البيانات بعمق مع React.** إذا نفذت مكتبة جلب البيانات دعم Suspense ، فسيكون استخدامه من مكونات React طبيعيًا للغاية.

* **يتيح لك تنظيم حالات التحميل المصممة عن عمد.** إنه لا يقول _how_ يتم جلب البيانات ، لكنه يتيح لك التحكم عن قرب في تسلسل التحميل المرئي لتطبيقك.

* **يساعدك على تجنب حالات التسابق** حتى مع وجود `await`، غالبًا ما تكون الشفرة الغير متزامنة عرضة للخطأ. يبدو Suspense أكثر مثل قراءة البيانات *بشكل متزامن* - كما لو تم تحميلها بالفعل.

## استخدام Suspense في الممارسة {#using-suspense-in-practice}

في فيسبوك، استخدمنا حتى الآن تكامل Relay مع Suspense في الإنتاج. **إذا كنت تبحث عن دليل عملي للبدء اليوم ، [راجع دليل Relay ](https://relay.dev/docs/en/experimental/step-by-step)!** إنه يوضح الأنماط التي عملت بالفعل بشكل جيد بالنسبة لنا في الإنتاج.

**تستخدم الشفرة التجريبية في هذه الصفحة API "وهمية" بدلاً من Relay.** هذا يجعلها أسهل للفهم إذا لم تكن معتادًا على GraphQL ، لكنها لن تخبرك "بالطريقة الصحيحة" لبناء التطبيق مع Suspense . هذه الصفحة أكثر تصوريًا وتهدف إلى مساعدتك في معرفة *لماذا* يعمل Suspense بطريقة معينة، والمشكلات التي يحلها

### ماذا لو لم أستخدم Relay؟ {#what-if-i-dont-use-relay}

إذا كنت لا تستخدم Relay اليوم ، فقد تضطر إلى الانتظار حتى تتمكن من تجربة Suspense في تطبيقك. حتى الآن، إنه التطبيق الوحيد الذي اختبرناه في الإنتاج ونثق فيه.

خلال الأشهر القليلة المقبلة ، ستظهر العديد من المكتبات بأشكال مختلفة على Suspense APIs. **إذا كنت تفضل أن تتعلم عندما تكون الأمور أكثر استقرارًا ، فقد تفضل تجاهل هذا العمل في الوقت الحالي ، والعودة عندما يكون نظام Suspense البيئي أكثر نضجًا.**

يمكنك أيضًا كتابة تكاملك الخاص لمكتبة جلب البيانات ، إذا كنت تريد ذلك.

### لمؤلفي المكتبة {#for-library-authors}

نتوقع أن نرى الكثير من التجارب في المجتمع مع المكتبات الأخرى. هناك شيء واحد مهم يجب مراعاته لمؤلفي جلب البيانات.

على الرغم من أنه قابل للتنفيذ من الناحية الفنية ، إلا أن Suspense **غير** المقصود حاليًا كوسيلة لبدء جلب البيانات عند عرض مكون. بدلاً من ذلك ، يتيح للمكونات التعبير عن "انتظارها" للبيانات التي *يتم جلبها بالفعل*.**[بناء تجربة مستخدم رائعة مع الوضع التزامن و Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) يشرح سبب أهمية هذا الأمر وكيفية تنفيذ هذا النمط في الممارسة العملية.**

ما لم يكن لديك حل يساعد على منع الشلالات ، فإننا نقترح تفضيل واجهات برمجة التطبيقات (APIs) التي تفضل أو تجلب الجلب قبل التصيير. للحصول على مثال ملموس ، يمكنك إلقاء نظرة على كيفية قيام [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) بفرض عملية التحميل المسبق. لم تكن رسائلنا حول هذا الأمر متسقة للغاية في الماضي. لا يزال التشويق في جلب البيانات تجريبيًا ، لذا يمكنك توقع تغيير توصياتنا بمرور الوقت لأننا نتعلم المزيد من استخدام الإنتاج ونفهم مساحة المشكلة بشكل أفضل.

## المناهج التقليدية مقابل Suspense  {#traditional-approaches-vs-suspense}

يمكننا تقديم التشويق دون ذكر طرق جلب البيانات الشائعة. ومع ذلك ، فإن هذا يجعل الأمر أكثر صعوبة لمعرفة المشكلات التي يحلها Suspense، ولماذا تستحق هذه المشكلات حلها ، وكيف يختلف نظام Suspense عن الحلول الحالية.

بدلاً من ذلك ، سننظر إلى Suspense كخطوة تالية منطقية في سلسلة من الأساليب:

* **الجلب على التصيير (على سبيل المثال ،`fetch` في `useEffect`):** ابدأ في عرض المكونات. كل من هذه المكونات قد يؤدي إلى جلب البيانات في آثارها وطرق دورة حياتها. هذا المنهج غالبا ما يؤدي إلى "الشلالات".
* **الجلب ثم التصيير (على سبيل المثال ،Relay بدون Suspense):** ابدأ في جلب جميع البيانات للشاشة التالية في أقرب وقت ممكن. عندما تكون البيانات جاهزة ، قم بتصيير الشاشة الجديدة. لا يمكننا فعل أي شيء حتى تصل البيانات.
* **التصيير كما انت تجلب (على سبيل المثال ، Relay مع Suspense):** ابدأ في جلب جميع البيانات المطلوبة للشاشة التالية في أقرب وقت ممكن ، وابدأ في عرض الشاشة الجديدة *فورًا - قبل أن نحصل على شبكة استجابة*. أثناء تدفق البيانات ، يقوم React بإعادة محاولة تقديم المكونات التي لا تزال بحاجة إلى البيانات حتى تكون جاهزة بالكامل.

>ملاحظة
>
>هذا بسيط بعض الشيء ، وفي الممارسة العملية تميل الحلول إلى استخدام مزيج من الأساليب المختلفة. ومع ذلك ، سوف ننظر إليهم بمعزل عن أفضل لمقارنة مفاضلاتهم.

لمقارنة هذه الطرق ، سنقوم بتنفيذ صفحة ملف شخصي مع كل منها.

### المنهج 1: الجلب على التصيير (لا يستخدم Suspense) {#approach-1-fetch-on-render-not-using-suspense}

طريقة شائعة لجلب البيانات في تطبيقات React اليوم هي استخدام التأثير:

```js
// In a function component:
useEffect(() => {
  fetchSomething();
}, []);

// Or, in a class component:
componentDidMount() {
  fetchSomething();
}
```

نسمي هذا المنهج "الجلب على التصيير" لأنه لا يبدأ في الجلب حتى *بعد* تم عرض المكون على الشاشة. هذا يؤدي إلى مشكلة تعرف باسم "الشلال".

خذ بعين الاعتبار مكونات `<ProfilePage>` و `<ProfileTimeline>`:

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/fragrant-glade-8huj6)**

إذا قمت بتشغيل هذا الكود ومشاهدة سجلات وحدة التحكم ، ستلاحظ أن التسلسل هو:

1. نبدأ في جلب تفاصيل المستخدم
2. ننتظر ...
3. ننتهي من جلب تفاصيل المستخدم
4. نبدأ في جلب المشاركات
5. ننتظر ...
6. ننتهي من جلب المشاركات

إذا كان جلب تفاصيل المستخدم يستغرق ثلاث ثوانٍ ، *فسنبدأ* فقط في جلب المشاركات بعد ثلاث ثوانٍ! هذا "شلال": *تسلسل* غير مقصود كان ينبغي موازنته.

الشلالات شائعة في الكود الذى يجلب البيانات عند عرضها. يمكن حلها ، لكن مع نمو المنتج ، يفضل العديد من الأشخاص استخدام حل يحمي هذه المشكلة.

### المنهج 2: الجلب ثم التصيير (لا يستخدم Suspense) {#approach-2-fetch-then-render-not-using-suspense}

يمكن للمكتبات منع الشلالات من خلال تقديم طريقة أكثر مركزية للقيام بجلب البيانات. على سبيل المثال ، يحل Relay هذه المشكلة عن طريق نقل المعلومات حول البيانات التي يحتاجها المكون إلى الأجزاء *القابلة للتحليل بشكل ثابت* ، والتي يتم تجميعها لاحقًا في استعلام واحد.

في هذه الصفحة ، لا نفترض معرفة Relay ، لذلك لن نستخدمها في هذا المثال. بدلاً من ذلك ، سنكتب شيئًا مشابهًا يدويًا من خلال دمج طرق جلب البيانات الخاصة بنا:

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

في هذا المثال ، `<ProfilePage>` ينتظر كلا الطلبين ولكن يبدأ تشغيلهما بشكل متوازٍ:

```js{1,2,8-13}
// Kick off fetching as early as possible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// The child doesn't trigger fetching anymore
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/wandering-morning-ev6r0)**

أصبح تسلسل الأحداث الآن كالتالي:

1. نبدأ في جلب تفاصيل المستخدم
2. نبدأ في جلب المشاركات
3. ننتظر ...
4. ننتهي من جلب تفاصيل المستخدم
5. ننتهي من جلب المشاركات

لقد حللنا ` الشلال`  السابق في الشبكة ، لكننا قدمنا بطريق الخطأ شبكة مختلفة. ننتظر عودة *جميع* البيانات مع `Promise.all()`  داخل `fetchProfileData`، حتى الآن لا يمكننا تقديم تفاصيل الملف الشخصي حتى يتم جلب المنشورات أيضًا. علينا أن ننتظر الاثنين.

بالطبع، هذا ممكن الإصلاح في هذا المثال بالذات. يمكننا إزالة نداء `Promise.all()`، وانتظر كلا promises بشكل منفصل. ومع ذلك، يصبح هذا المنهج أكثر صعوبة تدريجياً مع تنامي تعقيد بياناتنا وشجرة المكونات. من الصعب كتابة مكونات موثوقة عندما تكون الأجزاء التعسفية من شجرة البيانات مفقودة أو لا معنى لها. لذلك فإن جلب جميع البيانات للشاشة الجديدة و *ثم* التصيير غالبًا ما يكون خيارًا أكثر عملية.

### المنهج 3: التصيير أثناء الجلب (باستخدام Suspense) {#approach-3-render-as-you-fetch-using-suspense}

في المنهج السابق، جلبنا البيانات قبل أن نطلق عليها `setState`:

1. البدء في جلب
2. الانتهاء من جلب
3. البدء في التصيير

مع Suspense ، لا نزال نبدأ في الجلب أولاً ، لكننا نقلب الخطوتين الأخيرتين:

1. البدء في جلب
2. **ابدأ التصيير**
3. **إنهاء جلب**

**مع Suspense، لا ننتظر رد الاستجابة قبل أن نبدأ في التصيير.** في الواقع، نبدأ في التصيير *على الفور إلى حد كبير* بعد بدء طلب الشبكة:

```js{2,17,23}
// This is not a Promise. It's a special object from our Suspense integration.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

إليك ما يحدث عندما نصيير "<ProfilePage>" على الشاشة:

1. لقد بدأنا بالفعل الطلبات في `fetchProfileData ()`. لقد أعطانا "موردًا" خاصًا بدلاً من promise. في مثال واقعي ، سيتم توفيره من خلال تكامل Suspense لمكتبة البيانات لدينا ، مثل Relay.
2. React تحاول تصيير `<ProfilePage>`. تقوم بإرجاع ` <ProfileDetails>` و ` <ProfileTimeline>`  كأطفال.
3. React يحاول تقديم `<ProfileDetails>`. وهو يستدعي `resource.user.read()`. لا يتم جلب أي من البيانات بعد ، لذلك "يعلق" هذا المكون. تتتفاعل React فوقه ويحاول تصيير مكونات أخرى في الشجرة.
4. React يحاول تصيير `<ProfileTimeline>` .وهو يستدعي `resource.posts.read()`. مرة أخرى ، لا توجد بيانات حتى الآن ، لذلك هذا المكون أيضًا "معلق". React يتخطى ذلك أيضًا ، ويحاول تصيير مكونات أخرى في الشجرة.
5. لم يتبق شيء لمحاولة التصيير. نظرًا لأن `<ProfileDetails>` مع وقف التنفيذ ، يعرض React أقرب تراجع ` <Suspense>`  فوقها في الشجرة: `<h1> جارٍ تحميل الملف الشخصي ... </h1>`. لقد انتهينا الآن.

يمثل كائن "المورد" البيانات غير الموجودة بعد ، ولكن قد يتم تحميله في النهاية. عندما نستدعى `read ()`، إما أن نحصل على البيانات ، أو أن المكون "معلق".

**مع تدفق المزيد من البيانات، ستعيد React إعادة التصيير، وفي كل مرة قد تكون قادرة على التقدم "أعمق".** عندما يتم جلب `resource.user` ، سيتم تصيير المكون ` <<ProfileDetails>>`  بنجاح ونحن لم نعد بحاجة إلى `<h1> تحميل الملف الشخصي ... </ h1>` العودة. في النهاية ، سوف نحصل على جميع البيانات ، ولن يكون هناك أي نسخ احتياطية على الشاشة.

هذا له تأثير مثير للاهتمام. حتى إذا استخدمنا عميل GraphQL الذي يجمع جميع متطلبات البيانات في طلب واحد، *تيح لنا تدفق الاستجابة إظهار المزيد من المحتوى عاجلاً*. نظرًا لأننا نجعل * as-we-fetch * (على عكس *بعد* الجلب)، إذا ظهر `user` في الرد قبل `posts` ،فسنكون قادرين على "إلغاء قفل" الخارجي `<Suspense>` الحدود قبل الرد حتى ينتهي. ربما افتقدنا هذا في وقت سابق، ولكن حتى حل الجلب آنذاك يحتوي على شلال: بين الجلب والتصيير. لا يعاني التشويق بطبيعته من هذا الشلال، وتستفيد المكتبات مثل Relay من هذا.

لاحظ كيف استبعدنا `if (...)` "يتم تحميلها" من مكوناتنا. هذا لا يؤدي فقط إلى إزالة كود boilerplate ،ولكنه أيضًا يبسط إجراء تغييرات سريعة في التصميم. على سبيل المثال، إذا كنا نرغب دائمًا في "نشر" تفاصيل الملف الشخصي والمشاركات معًا، فيمكننا حذف الحدود `<Suspense>` بينهما. أو يمكننا أن نجعلهم مستقلين عن بعضهم البعض من خلال إعطاء كل *حده الخاص به*. يتيح لنا نظام `<Suspense>` تغيير تفاصيل حالات التحميل الخاصة بنا وتنسيق تسلسلها دون تغييرات على الكود الخاصة بنا.

## البدء في الجلب المبكر {#start-fetching-early}

إذا كنت تعمل على مكتبة تجلب البيانات، فهناك جانب حاسم في التصيير كما انت تجلب الذي لا تريد تفويته. **نبدأ في جلب _قبل_ التصيير.** انظر إلى مثال الكود هذا أقرب:

```js
// Start fetching early!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Try to read user info
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

لاحظ أن استدعاء `read()` في هذا المثال لا *تبدأ* الجلب. يحاول فقط قراءة البيانات **التي يتم جلبها بالفعل**. هذا الاختلاف ضروري لإنشاء تطبيقات سريعة باستخدام Suspense. لا نريد تأخير تحميل البيانات حتى يبدأ التصيير في أحد المكونات. بصفتك مؤلف مكتبة تجلب البيانات، يمكنك فرض ذلك بجعل الحصول على كائن "مورد" مستحيلًا دون البدء في عملية جلب. كل عرض تجريبي في هذه الصفحة باستخدام "API المزيف" لدينا يفرض هذا.

قد تعترض على أن جلب "أعلى مستوى" كما هو موضح في هذا المثال غير عملي. ماذا سنفعل إذا انتقلنا إلى صفحة ملف تعريف آخر؟ قد نرغب في جلب على أساس الدعائم. الإجابة على هذا **هي أننا نريد أن نبدأ في جلب معالجات الأحداث بدلاً من ذلك**. فيما يلي مثال مبسط للتنقل بين صفحات المستخدم:

```js{1,2,10,11}
// First fetch: as soon as possible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Next fetch: when the user clicks
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

مع هذا المنهج، يمكننا **جلب الكود والبيانات بالتوازي**. عندما ننتقل بين الصفحات، لا نحتاج إلى انتظار تحميل كود الصفحة لبدء تنزيل بياناتها. يمكننا البدء في جلب كل من الشفرة والبيانات في نفس الوقت (أثناء النقر على الرابط)، مما يوفر تجربة مستخدم أفضل بكثير.

يثير هذا سؤالًا حول كيفية معرفة *ما* الذي يجب إحضاره قبل تقديم الشاشة التالية. هناك عدة طرق لحل هذا (على سبيل المثال ، من خلال دمج البيانات التي تقرب من حل التوجيه الخاص بك). إذا كنت تعمل على مكتبة تجلب البيانات ، فإن [إنشاء تجربة مستخدم رائعة مع الوضع المتزامن و Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) يوفر تجربة عميقة حول كيفية تحقيق هذا ولماذا هو مهم.

### ما زلنا نتفحص هذا {#were-still-figuring-this-out}

Suspense نفسه كآلية مرنة وليس لديها العديد من القيود. يجب أن يكون كود المنتج أكثر تقييدًا لضمان عدم وجود شلالات ، ولكن هناك طرقًا مختلفة لتوفير هذه الضمانات. بعض الأسئلة التي نستكشفها حاليًا تشمل:

* الجلب المبكر يمكن أن يكون مرهقًا للتعبير عنه. كيف نجعل من السهل تجنب الشلالات؟
* عند جلب البيانات لصفحة ما ، هل يمكن لواجهة برمجة التطبيقات تشجيع تضمين البيانات الخاصة بالانتقالات الفورية *من* ذلك؟
* ما هو عمر الاستجابة؟ هل يجب أن يكون التخزين المؤقت عالميًا أم محليًا؟ من يدير ذاكرة التخزين المؤقت؟
* هل يمكن أن يساعد الوكلاء في التعبير عن واجهات برمجة التطبيقات المكسورة دون إدخال استدعاء `read()` في كل مكان؟
* كيف سيكون شكل مكافئ استعلامات GraphQL للبيانات التعسفية Suspense؟

Relay له إجاباته الخاصة على بعض هذه الأسئلة. من المؤكد أن هناك أكثر من طريقة واحدة للقيام بذلك ، ونحن متحمسون لرؤية الأفكار الجديدة التي يطرحها مجتمع React.

## Suspense و حالات التسابق {#suspense-and-race-conditions}

ظروف السباق هي أخطاء تحدث بسبب افتراضات غير صحيحة حول الترتيب الذي قد يتم به تشغيل الكود. جلب البيانات في `useEffect` Hook أو في أساليب دورة حياة الكلاس مثل `componentDidUpdate` غالبًا ما يؤدي إليهم. يمكن أن يساعد التشويق هنا أيضًا - دعنا نرى كيف.

لإثبات المشكلة ، سنضيف مكونًا من نوع `<App>` من المستوى الأعلى يصيير `<ProfofilePage>` الخاص بنا - باستخدام زر يتيح لنا **التبديل بين ملفات تعريف مختلفة**:

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

دعونا نقارن كيف تتعامل استراتيجيات جلب البيانات المختلفة مع هذا المطلب.

### حالات التسابق مع `useEffect` {#race-conditions-with-useeffect}

أولاً ، سنحاول إصدار مثال "fetch in effect" الأصلي. سنقوم بتعديلها لتمرير معلمة `id` من الدعائم `<ProfilePage>` إلى `fetchUser(id)` و `fetchPosts(id)`:

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

لاحظ كيف غيّرنا أيضًا تبعيات التأثير من `[]` إلى `[id]` - لأننا نريد إعادة تشغيل التأثير عندما يتغير `id`. خلاف ذلك ، لن نقوم بإعادة تعيين بيانات جديدة.

إذا جربنا هذا الكود، فقد يبدو أنه يعمل في البداية. ومع ذلك ، إذا قمنا بشكل عشوائي بوقت التأخير في تطبيق "API المزيف" الخاص بنا واضغطنا على الزر "التالي" بسرعة كافية ، فسوف نرى من سجلات وحدة التحكم أن هناك خطأ ما. **طلبات الملفات الشخصية السابقة قد "تعود" أحيانًا بعد أن قمنا بالفعل بتحويل الملف الشخصي إلى معرف آخر - وفي هذه الحالة يمكنهم الكتابة فوق الحالة الجديدة باستجابة قديمة لid مختلف.**

من الممكن إصلاح هذه المشكلة (يمكنك استخدام وظيفة تنظيف التأثير إما لتجاهل أو إلغاء الطلبات التي لا معنى لها) ، ولكنها غير سهلة ويصعب تصحيحها.

### حالات التسابق مع `componentDidUpdate` {#race-conditions-with-componentdidupdate}

قد يعتقد المرء أن هذه مشكلة خاصة بـ `useEffect` أو Hooks. ربما إذا قمنا بتوصيل هذا الكود إلى classes أو استخدم بناء جملة مناسب مثل `async` / `await` ، فهل سيحل المشكلة؟

لنجرب ذلك:

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

هذا الكود سهل القراءة بشكل خادع.

لسوء الحظ ، لم يساعدنا استخدام هذا الكلاس أو بناء جملة `async` / `await`. هذا الإصدار يعاني من نفس حالات التسابق بالضبط ، لنفس الأسباب.

### المشكلة {#the-problem}

مكونات React لها "دورة حياة" خاصة بها. قد يتلقون props أو حالة التحديث في أي وقت من الأوقات. ومع ذلك ، يحتوي كل طلب غير متزامن *أيضًا* على "دورة حياة" خاصة به. يبدأ عندما نبدأ تشغيله ، وينتهي عندما نتلقى ردًا. الصعوبة التي نواجهها هي "مزامنة" العديد من العمليات في الوقت المناسب التي تؤثر على بعضها البعض. هذا صعب التفكير فيه.

### حل حالات التسابق مع Suspense {#solving-race-conditions-with-suspense}

دعنا نعيد كتابة هذا المثال مرة أخرى ، ولكن باستخدام Suspense فقط:

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

في مثال Suspense السابق ، لم يكن لدينا سوى مورد واحد ، لذلك احتفظنا به في متغير المستوى الأعلى. الآن بعد أن أصبح لدينا موارد متعددة ، قمنا بنقلها إلى حالة مكون `<App>`:

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

عندما نقر على "التالي" ، يبدأ المكون `<App>` في طلب الحصول على ملف التعريف التالي ، ويمرر * هذا* الكائن وصولاً إلى المكون `<ProfilePage>`:

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

مرة أخرى ، لاحظ أن ** حن لا ننتظر الرد لضبط الحالة. إنها الطريقة الأخرى: قمنا بتعيين الحالة (وبدء التصيير) فور إتمام الطلب**. بمجرد أن يتوفر لدينا المزيد من البيانات ، React "يملأ" المحتوى الموجود داخل مكونات `<Suspense>`.

هذا الكود قابل للقراءة للغاية ، ولكن على عكس الأمثلة السابقة ، لا تعاني نسخة Suspense من حالات التسابق. قد تتساءل لماذا. الجواب هو أنه في نسخة Suspense، ليس من الضروري أن نفكر في *الوقت* كما هو الحال في الكود. لدينا الكود الأصلي مع حالات التسابق اللازمة لضبط الحالة *في اللحظة المناسبة في وقت لاحق* ، أو خلاف ذلك سيكون من الخطأ. ولكن مع Suspense ، وضعنا الحالة *على الفور* -- لذلك من الصعب الفوضى.

## معالجة الأخطاء {#handling-errors}

عندما نكتب كود مع Promises ، فقد نستخدم `catch()` لمعالجة الأخطاء. كيف يعمل هذا مع Suspense ، بالنظر إلى أننا لا *ننتظر* حتى تبدأ promises في التصيير؟

باستخدام Suspense ، تعمل معالجة أخطاء الجلب بنفس طريقة التعامل مع أخطاء التصيير - يمكنك تصيير [حدود الخطأ](/docs/error-boundaries.html) في أي مكان لـ "التقاط" الأخطاء في المكونات أدناه.

أولاً ، سنقوم بتعريف مكون حد الخطأ لاستخدامه في مشروعنا:

```js
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

وبعد ذلك يمكننا وضعه في أي مكان في الشجرة للوقوع في الأخطاء:

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[جربه على CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

سيؤدي ذلك إلى التقاط أخطاء التصيير *و* الأخطاء من جلب بيانات Suspense. يمكن أن يكون لدينا أكبر عدد ممكن من حدود الخطأ، لكن من الأفضل أن [تكون مقصودًا](https://aweary.dev/fault-tolerance-react/) حول موضعها.

## الخطوات التالية {#next-steps}

لقد قمنا الآن بتغطية أساسيات "Suspense لجلب البيانات"! الأهم من ذلك، أننا نفهم الآن بشكل أفضل *لماذا* يعمل Suspense بهذه الطريقة، وكيف يلائم مساحة جلب البيانات.

يجيب التشويق على بعض الأسئلة، لكنه يطرح أيضًا أسئلة جديدة خاصة به:

* إذا تم *تعليق* بعض المكونات، هل يتجمد التطبيق؟ كيفية تجنب هذا؟
* ماذا لو أردنا إظهار مغزل في مكان مختلف عن "أعلى" المكون في شجرة؟
* إذا *أردنا* عن قصد إظهار واجهة مستخدم غير متسقة لفترة زمنية قصيرة، هل يمكننا القيام بذلك؟
* بدلاً من إظهار spinner، هل يمكننا إضافة مؤثر بصري مثل "شطب" الشاشة الحالية؟
* لماذا يقوم [مثال Suspense الأخير](https://codesandbox.io/s/infallible-feather-xjtbu) بتسجيل تحذير عند النقر فوق الزر "التالي"؟

للإجابة على هذه الأسئلة، سوف نشير إلى القسم التالي في [أنماط واجهة المستخدم المتزامنة](/docs/concurrent-mode-patterns.html).

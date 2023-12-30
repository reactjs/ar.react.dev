---
title: إضافة التفاعلية
---

<Intro>

بعض الاشياء على الشاشة يتم تحديثها للاستجابة لمدخلات المستخدم. على سبيل المثال، النقر على معرض صور يغير الصورة المعروضة. فى React، البيانات التي تتغير على مر الزمن تسمى *حالة (state)*. يمكنك إضافة حالة إلى أي مكون، وتحديثها على حسب احتياجك. فى هذا الفصل، سوف تتعلم كيفية كتابة مكونات يمكنها أن تتعامل مع تفاعلات المستخدم، وتحديث حالتها، وعرض مخرجات مختلفة باختلاف المدخلات.

</Intro>

<YouWillLearn isChapter={true}>

* [كيفية التعامل مع الأحداث التي يبدأها المستخدم](/learn/responding-to-events)
* [كيفية جعل المكونات تتذكر المعلومات باستخدام الحالة](/learn/state-a-components-memory)
* [كيفية تحديث واجهة المستخدم في React في مرحلتين](/learn/render-and-commit)
* [لماذا لا تتحدث الحالة مباشرة بعد تغييرها](/learn/state-as-a-snapshot)
* [كيفية جدولة تحديثات عديدة للحالة](/learn/queueing-a-series-of-state-updates)
* [كيفية تحديث كائن فى حالة](/learn/updating-objects-in-state)
* [كيفية تحديث مصفوفة فى حالة](/learn/updating-arrays-in-state)

</YouWillLearn>

## الاستجابة الى الأحداث {/*responding-to-events*/}

تتيح لك React إضافة *معالجي الأحداث (event handlers)* إلى JSX الخاص بك. معالجة الأحداث هم الدوال الخاصة التي سيتم تنشيطها استجابةً لتفاعلات المستخدم مثل النقر، والتمرير، والتركيز على مدخلات النموذج، وما إلى ذلك.

المكونات المدمجة مثل `<button>` تدعم الأحداث المتاحة فى المتصفح مثل `onClick`. ومع ذلك، يمكنك أيضًا إنشاء مكوناتك الخاصة وتعطي خصائص معالجة الأحداث الخاصة بها أى اسماء مخصصة للتطبيق على حسب رغبتك.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('شغال!')}
      onUploadImage={() => alert('يتم الرفع!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        شغل الفيلم
      </Button>
      <Button onClick={onUploadImage}>
        ارفع صورة
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

<LearnMore path="/learn/responding-to-events">

اقرأ **[الاستجابة إلى الأحداث](/learn/responding-to-events)** لتعلم كيفية إضافة معالجى الأحداث.

</LearnMore>

## الحالة: ذاكرة المكون {/*state-a-components-memory*/}

غالبًا تحتاج المكونات إلى تغيير محتوى الشاشة نتيجةً لتفاعل المستخدم. مثلا، الكتابة فى نموذج يجب أن يحدث حقل الإدخال، والنقر على "التالي" على دائرة الصور يجب ان يغير الصورة المعروضة، والضغط على "شراء" يضع المنتج فى سلة المشتريات، وهكذا. المكونات تحتاج أن تتذكر اشياء مثل: القيمة الحالية لحقل الإدخال، الصورة الحالية، سلة المشتريات. فى React، هذا النوع من الذاكرة الخاصة بالمكون يسمى "حالة"

يمكنك إضافة حالة إلى مكون عن طريق استخدام خطاف [`useState`](/reference/react/useState). *الخطاطيف (hooks)* هي دوال خاصة تتيح لك أن تستخدم مميزات React (الحالة واحدة من هذه المميزات). خطاف `useState` يتيح لك أن تعرف متغير حالة. هذا الخطاف يأخذ الحالة المبدأية ويرجع قيمتين: الحالة الحالية، ودالة معين الحالة التي تتيح لك أن تغير الحالة.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

هنا كيف يقوم معرض صور تحديض الحالة (state) عند النقر:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        التالى
      </button>
      <h2>
        <i>{sculpture.name} </i>
        بواسطة {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} من {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'إخفاء' : 'إظهار'} التفاصيل
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'تكريم جراحة الأعصاب',
  artist: 'مارتا كولفين أندراد',
  description: 'على الرغم من أن كولفين معروفة بشكل أساسي بالموضوعات المجردة التي تلمح إلى رموز ما قبل الهيسبانيات (pre-hispanic)، إلا أن هذا التمثال العملاق، وهو تكريم لجراحة الأعصاب، هو واحد من أشهر قطع الفن العام الخاصة بها.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'تمثال من البرونز ليدين متقاطعتين تحملان برفق دماغًا بشريًا بأطرافهما.'
}, {
  name: 'فلوراليس جينيريكا',
  artist: 'إدواردو كاتالانو',
  description: 'هذه الزهرة الفضية الضخمة (بارتفاع 75 قدم أو 23 مترًا) تقع في بوينس آيرس. تم تصميمها لتتحرك، حيث تغلق أوراقها في المساء أو عندما تهب رياح قوية، وتتفتح في الصباح.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'تمثال زهرة معدنية ضخمة ببتلات عاكسة تشبه المرايا وأسدية قوية.'
}, {
  name: 'الوجود الأبدي',
  artist: 'جون ودرو ويلسون',
  description: 'عُرف ويلسون بانشغاله بالمساواة والعدالة الاجتماعية بالإضافة إلى الصفات الأساسية والروحية للبشرية. يمثل هذا البرونز الضخم (7 أقدام أو 2،13 م) ما وصفه بأنه "حضور أسود رمزي مشبع بإحساس إنساني عالمي".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'التمثال يصور رأسًا بشريًا دائمًا وجيدًا. يشع بالهدوء والصفاء.'
}, {
  name: 'مواي',
  artist: 'فنان مجهول',
  description: 'تقع في جزيرة إيستر ، هناك 1000 تمثال مواي ، أو تماثيل ضخمة موجودة ، أنشأها شعب رابا نوي الأوائل ، والتي يعتقد البعض أنها تمثل أسلافًا مؤلينًا.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'ثلاثة تماثيل نصفية حجرية ضخمة برؤوس كبيرة بشكل غير متناسب ووجوه حزينة.'
}, {
  name: 'بلو نانا',
  artist: 'نيكي دي سانت فال',
  description: 'الـ Nanas هى مخلوقات منتصرة ورموز للأنوثة والأمومة. في البداية ، استخدمت سانت فال قماشًا وعثرت على أشياء لـ Nanas ، ثم أدخلت البوليستر لاحقًا لتحقيق تأثير أكثر حيوية.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'تمثال فسيفسائي كبير لشخصية أنثى راقصة غريبة الأطوار في زي ملون يبعث المرح.'
}, {
  name: 'الشكل النهائي',
  artist: 'باربرا هيبورث',
  description: 'هذا النحت البرونزي التجريدي هو جزء من سلسلة عائلة الرجل (The Family of Man) الموجودة في حديقة تمثال يوركشاير (Yorkshire Sculpture Park). اختارت هيبورث عدم إنشاء تمثيلات حرفية للعالم ولكنها طورت أشكالًا مجردة مستوحاة من الناس والمناظر الطبيعية.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'تمثال طويل مصنوع من ثلاثة عناصر مكدسة فوق بعضها البعض لتذكير بشخصية بشرية.'
}, {
  name: 'فارس',
  artist: 'Lamidi Olonade Fakeye',
  description: "ينحدر من أربعة أجيال من النحاتين على الخشب ، وقد مزج عمل Fakeye بين موضوعات اليوروبا التقليدية والمعاصرة.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'بطون كبيرة',
  artist: 'ألينا زابوتشنيكوف',
  description: "تشتهر زابوتشنيكوف بمنحوتاتها للجسم المجزأ كاستعارة لهشاشة وعدم ثبات الشباب والجمال. يصور هذا التمثال بطونان كبيران واقعيان للغاية مكدسان فوق بعضهما البعض ، يبلغ ارتفاع كل منهما حوالي خمسة أقدام (1.5 متر).",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'يذكر التمثال سلسلة من الطيات ، تختلف تمامًا عن البطون في المنحوتات الكلاسيكية.'
}, {
  name: 'جيش الطين',
  artist: 'فنان مجهول',
  description: 'جيش الطين هو عبارة عن مجموعة من التماثيل المصنوعة من الطين التي تصور جيوش تشين شي هوانغ ، الإمبراطور الأول للصين. تألف الجيش من أكثر من 8000 جندي ، و 130 عربة بها 520 حصانًا ، و 150 حصانًا من خيول الفرسان.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 منحوتة من الطين من المحاربين المهيبين ، ولكل منها تعبير وجه فريد ودروع.'
}, {
  name: 'منظر القمر',
  artist: 'لويز نيفيلسون',
  description: 'اشتهرت نيفيلسون بكسح الأشياء من حطام مدينة نيويورك ، والتي كانت ستجمعها لاحقًا في منشآت ضخمة. في هذا الجزء ، استخدمت أجزاء متباينة مثل عمود السرير ودبوس الشعوذة وشظية المقعد ، وتسميرها ولصقها في صناديق تعكس تأثير التجريد الهندسي للفضاء والشكل التكعيبي.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'نحت أسود غير لامع حيث لا يمكن تمييز العناصر الفردية في البداية.'
}, {
  name: 'هالة',
  artist: 'رانجاني شيتار',
  description: 'تجمع شتار بين التقليدي والحديث والطبيعي والصناعي. يركز فنها على العلاقة بين الإنسان والطبيعة. وُصف عملها بأنه مقنع من الناحيتين التجريدية والمجازية ، ويتحدى الجاذبية ، و "توليف دقيق لمواد غير محتملة."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'منحوتة تشبه الأسلاك الشاحبة مثبتة على جدار خرساني وتهبط على الأرض. يبدو خفيفا.'
}, {
  name: 'أفراس النهر',
  artist: 'حديقة حيوان تايبيه',
  description: 'قامت حديقة حيوان تايبيه بتكليف ساحة فرس النهر تظهر فيها أفراس النهر المغمورة أثناء اللعب.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'مجموعة من المنحوتات البرونزية لفرس النهر تخرج من الرصيف كما لو كانت تسبح.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

اقرأ **[الحالة: ذاكرة المكون](/learn/state-a-components-memory)** لتتعلم كيفية حفظ القيم وتحديثها عند التفاعل.

</LearnMore>

## التصيير والإيداع {/*render-and-commit*/}

قبل أن يتم عرض مكوناتك على الشاشة، يجب أن تُصير بواسطة React. سيساعدك فهم الخطوات في هذه العملية على التفكير في كيفية تنفيذ التعليمات البرمجية الخاصة بك وشرح سلوكها.

تخيل أن مكوناتك هي طهاة فى مطبخ، يقومون بتجميع وجبات شهية من مكونات. فى هذا السيناريو، React هى النادل الذي ياخذ الطلبات من العملاء ويقوم باحضارها لهم. هذا العميلة من طلب وعرض واجهة المستخدم تطلب ثلاث خطوات:

1. **تحفيز** المُصير (توصيل طلب العشاء الى المطبخ)
2. **تصيير** المكون (تحضير الطلب فى المطبخ)
3. **إيداع** إلى الـ DOM (وضع الطلب على الطاولة)

<IllustrationBlock sequential>
  <Illustration caption="تحفيز" alt="React كما لو كانت نادل فى مطعم يقوم باخذ الطلبات من المستخدمين ويقوم باحضارها الى مطبخ المكونات" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="تصيير" alt="طاهى البطاقة يعطى React مكون بطاقة جديد" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="أيداع" alt="React توصل البطاقة الى المستخدم على الطاولة" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

اقرأ **[تصيير وإيداع](/learn/render-and-commit)** لتتعلم دورة حياة تحديثات واجهة المستخدم

</LearnMore>

## الحالة كأنها نسخة {/*state-as-a-snapshot*/}

على عكس متغيرات JavaScript العادية، تتصرف حالة React مثل نسخة. لا يؤدي تعيينها إلى تغيير متغير الحالة الذي لديك بالفعل، ولكنه يؤدي بدلاً من ذلك إلى إعادة تصيير. قد يكون هذا مفاجئًا في البداية!

```js
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

يساعدك هذا السلوك على تجنب الثغرات. هنا تطبيق دردشة صغير. حاول تخمين ما يحدث إذا ضغطت على "إرسال" أولاً *ثم* غير المستلم إلى بوب. من سيظهر اسمه في "التنبيه" بعد خمس ثوانٍ؟

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('أليس');
  const [message, setMessage] = useState('مرحبا');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`انت قولت ${message} إلى ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        إلى:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="أليس">أليس</option>
          <option value="بوب">بوب</option>
        </select>
      </label>
      <textarea
        placeholder="رسالة"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">إرسال</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<LearnMore path="/learn/state-as-a-snapshot">

اقرأ  **[الحالة كأنها نسخة](/learn/state-as-a-snapshot)** لتتعلم لماذا تظهر الحالة وكأنها *ثابتة* و لا تتغير داخل معالجي الأحداث.

</LearnMore>

## جدولة سلسلة من تحديثات الحالة {/*queueing-a-series-of-state-updates*/}

هذا المكون فيه ثغرة: النقر على "+3" يزيد النتيجة مرة واحدة فقط.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>النتيجة: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[الحالة كأنها لقطة](/learn/state-as-a-snapshot) يشرح لماذا يحدث ذلك. تعيين الحالة يطلب إعادة تصيير جديدة، لكن لا يغير القيمة فى الكود الذى يعمل بالفعل. لذلك تظل النتيجة "1" بعد استدعاء "setScore(score + 1)".

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

يمكنك ان تصلح ذلك عن طريق تمرير *دالة تحديث* عند تعين الحالة. لاحظ انه عند تغير `setScore(score + 1)` بـ `setScore(s => s + 1)` يصلح زرار الـ "+3". هذا يمنحك أن تجدول أكثر من تحديث حالة.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>النتيجة: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

اقرأ **[جدولة سلسلة من تحديثات الحالة](/learn/queueing-a-series-of-state-updates)** لتتعلم كيفية جدولة سلسلة من تحديثات الحالة.

</LearnMore>

## تحديث الكائنات فى الحالة {/*updating-objects-in-state*/}

يمكن ان تحتوى الحالة على أى نوع من قيم JavaScript، يشمل ذلك الكائنات. لكن يجب أن لا تغير الكائنات والمصفوفات التى تحتوى عليها حالة React مباشراً. بدلاً من ذلك عندما تحدث كائن أو مصفوفة، تحتاج أن تنشئ نسخة جديدة (أو تقوم بعمل نسخة من نسخة موجودة)، بعد ذلك حدث الحالة باستخدام النسخة.

فى الغالب، سوف تستخدم معامل البسط (spread operator) `...` لعمل نسخة من الكائنات والمصفوفات التى تريد أن تغيرها. على سبيل المثال، تحديث كائن متداخل يمكن أن تكون مثل ذلك:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'نيكي دي سانت فال',
    artwork: {
      title: 'بلو نانا',
      city: 'هامبورغ',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        الاسم:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        اسم اللوحة:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        المدينة:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        الصورة:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' من '}
        {person.name}
        <br />
        (موجودة فى {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

لو وجدت نسخ الكائنات فى الكود مملًا، يمكنك استخدام مكتبة مثل [Immer](https://github.com/immerjs/use-immer) لتقليل الكود المتكرر:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'نيكي دي سانت فال',
    artwork: {
      title: 'بلو نانا',
      city: 'هامبورغ',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        الأسم:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        اسم اللوحة:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        المدينة:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        الصورة:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' من '}
        {person.name}
        <br />
        (موجودة فى {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

اقرأ **[تحديث الكائنات فى الحالة](/learn/updating-objects-in-state)** لتتعلم كيفية تحديث الكائنات بطريقة صحيحة

</LearnMore>

## تحديث المصفوفات فى الحالة {/*updating-arrays-in-state*/}

المصفوفات هي نوع آخر من كائنات JavaScript القابلة للتغيير والتي يمكنك تخزينها في الحالة ويجب التعامل معها على أنها للقراءة فقط. تمامًا كما هو الحال مع الكائنات، عندما تريد تحديث مصفوفة مخزنة في الحالة، فأنت بحاجة إلى إنشاء مصفوفة جديدة (أو إنشاء نسخة من واحدة موجودة)، ثم تعيين الحالة لاستخدام المصفوفة الجديدة:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'بطون كبيرة', seen: false },
  { id: 1, title: 'منظر القمر', seen: false },
  { id: 2, title: 'جيش الطين', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>قائمة امنيات الفن</h1>
      <h2>قائمة الفن الذى اريد ان أراه:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

لو وجدت نسخ المصفوفات فى الكود مملًا، يمكنك استخدام مكتبة مثل [Immer](https://github.com/immerjs/use-immer) لتقليل الكود المتكرر:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'بطون كبيرة', seen: false },
  { id: 1, title: 'منظر القمر', seen: false },
  { id: 2, title: 'جيش الطين', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>قائمة امنيات الفن</h1>
      <h2>قائمة الفن الذى اريد ان أراه:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

اقرأ **[تحديث المصفوفات فى الحالة](/learn/updating-arrays-in-state)** لتتعلم كيفية تحديث المصفوفات بطريقة صحيحة.

</LearnMore>

## ماذا بعد؟ {/*whats-next*/}

إذهب الى [الإستجابة الى الاحداث](/learn/responding-to-events) لتقرأ هذا الفصل صفحة بصفحة!

أو، إذا كنت تفهم هذه المواضيع بالفعل، لماذا لا تقرأ عن [إدارة الحالة](/learn/managing-state)؟

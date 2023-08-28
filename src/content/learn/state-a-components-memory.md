---
title: "الحالة: ذاكرة المكون"
---

<Intro>

غالبًا ما تحتاج المكونات إلى تغيير ما يظهر على الشاشة نتيجةً لتفاعل ما. يجب تحديث حقل الإدخال عند الكتابة في النموذج ، ويجب تغيير الصورة التي يتم عرضها عند النقر فوق "التالي" في الشرائح الدوارة(image carousel) ، ويجب وضع منتج في سلة التسوق عند النقر فوق "شراء". تحتاج المكونات إلى "تذكر" أشياء: قيمة الإدخال الحالية ، الصورة الحالية ، سلة التسوق. في React ، يُطلق على هذا النوع من الذاكرة المخصصة للمكون باسم *الحالة*.

</Intro>

<YouWillLearn>

* كيفية إضافة متغير حالة باستخدام خطاف (Hook) [`useState`](/reference/react/useState) 
* أي زوج من القيم يعيد خطاف `useState`
* كيفية إضافة أكثر من متغير حالة واحد
* لماذا يُطلق على الحالة اسم محلية

</YouWillLearn>

## عندما لا يكفي المتغير العادي {/*when-a-regular-variable-isnt-enough*/}

هنا مكون يقوم بتقديم صورة منحوت. يجب أن يُظهر النقر على الزر "التالي" الصورة التاليه عن طريق تغيير المؤشر `index` إلى `1` ، ثم `2` ، وهكذا. ومع ذلك ، **لن يعمل** هذا (يمكنك تجربته!):

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        التالي
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'تحية لجراحة الأعصاب',
  artist: 'مارتا كولفين أندرادي',
  description: 'على الرغم من أن كولفين معروفة بشكل أساسي بالمواضيع المجردة التي تلمح إلى الرموز ما قبل الهيسبانية، إلا أن هذا التمثال العملاق، تحية لجراحة الأعصاب، هو واحد من أكثر قطع الفن العامة التي يمكن التعرف عليها.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'تمثال من البرونز ليدين متقاطعتين تحملان براغين الدماغ البشري بأطراف أصابعهما بعناية.'  
}, {
  name: 'فلوراليس جينيريكا',
  artist: 'إدواردو كاتالانو',
  description: 'هذه الزهرة الفضية الضخمة (75 قدمًا أو 23 مترًا) تقع في بوينس آيرس. تم تصميمها للتحرك، حيث تُغلق بتلاتها في المساء أو عندما تكون الرياح قوية وتُفتح في الصباح.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'تمثال ضخم من المعدن الفضي يتميز بتلات مرآة تعكس الضوء وسيقان قوية.'
}, {
  name: 'الوجود الأبدي',
  artist: 'جون وودرو ويلسون',
  description: 'شتُهر ويلسون بشدقه بالمساواة والعدالة الاجتماعية، وكذلك الصفات الأساسية والروحية للبشرية. يمثل هذا التمثال البرونزي الضخم (7 أقدام أو 2.13 متر) ما وصفه بأنه "وجود أسود رمزي مشبوب بشعور بالإنسانية العالمية"',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'التمثال الذي يصوّر رأس إنسان يبدو حاضرًا وجديًا دائمًا. إنه ينبعث منه الهدوء والسكينة.'
}, {
  name: 'مواي',
  artist: 'فنان مجهول',
  description: 'تقع على جزيرة الفصح، وهناك 1000 تمثال مواي، أو تماثيل ضخمة موجودة، تم إنشاؤها من قبل شعب رابا نوي الأول في وقت مبكر، ويعتقد البعض أنها تمثل أسلافًا مجسدين.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'ثلاثة تماثيل حجرية ضخمة لرؤوس بأوجه كبيرة نسبيًا وتعابير وجوه متجهمة.'
}, {
  name: 'نانا الزرقاء',
  artist: 'نيكي دي سانت فال',
  description: 'النانا هي مخلوقات ظافرة، رموز للأنوثة والأمومة. في البداية، استخدمت سانت فال القماش والأشياء المعثور عليها للنانا، وفي وقت لاحق قدمت البوليستر لتحقيق تأثير أكثر حيوية.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'تمثال موزاييكي كبير لشخصية أنثوية راقصة غريبة في زي ملون تنبع منها الفرح.'
}, {
  name: 'النموذج النهائي',
  artist: 'باربارا هيبورث',
  description: 'هذا التمثال البرونزي المجرد هو جزء من سلسلة "عائلة الإنسان" الموجودة في حديقة يوركشاير للنحت. اختارت هيبورث عدم إنشاء تمثيلات حرفية للعالم ولكنها طوّرت أشكالًا مجردة مستوحاة من البشر والمناظر الطبيعية..',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'تمثال طويل مصنوع من ثلاثة عناصر مرصوصة فوق بعضها البعض تشبه شكل إنسان.'
}, {
  name: 'كافاليير',
  artist: 'لاميدي أولونادي فاكيهي',
  description: "نزلت أعمال فاكيهي من أربعة أجيال من نحاتي الخشب، ودمجت أعماله بين المواضيع التقليدية واليوروبية المعاصرة.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'تمثال خشبي معقد لمحارب ذو وجه مركزي على حصان مزين بزخارف.'
}, {
  name: 'بطون كبيرة',
  artist: 'ألينا شابوتشنيكوف',
  description: "شابوتشنيكوف معروفة بتماثيلها المكسورة للجسم كاستعارة لهشاشة وعدم الدوام للشباب والجمال. يصور هذا التمثال بطونًا كبيرة واقعية جدًا مكدسة فوق بعضها البعض، تبلغ ارتفاع كل واحدة حوالي خمسة أقدام (1.5 متر).",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'التمثال يذكر بشلال من الطيات، مختلف تمامًا عن البطون في التماثيل الكلاسيكية.'
}, {
  name: 'Terracotta Army',
  artist: 'فنان غير معروف',
  description: 'جيش التراكوتا هو مجموعة من تماثيل التراكوتا تصور جيوش قين شي هوانغ، أول إمبراطور للصين. يتألف الجيش من أكثر من 8000 جندي، و130 عربة مع 520 حصانًا، و150 حصانًا فرسانيًا.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 تمثالًا من التراكوتا لمحاربين جادين، يتميز كل منهم بتعبير وجه فريد'
}, {
  name: 'منظر طبيعي قمري',
  artist: 'لويز نيفلسون',
  description: 'كانت نيفلسون معروفة بالتجميع من الأشياء المتناثرة في شوارع مدينة نيويورك، والتي كانت تقوم بتجميعها لاحقًا في إبداعات ضخمة. في هذا العمل، استخدمت أجزاء متنوعة مثل ساق سرير، وعصا تلاعب، وجزء من مقعد، وقامت بتثبيتها ولصقها في صناديق تعكس تأثير التجريد الهندسي للمكعبات في الفن التكعيبي على الفضاء والشكل.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: ' منحوتة سوداء مطفأة حيث يكون من الصعب في البداية تمييز العناصر الفردية.'
}, {
  name: 'هالة ضوئية',
  artist: ' رانجاني شيتار',
  description: 'تدمج شيتار بين التقاليد والحداثة، وبين الطبيعة والصناعة. يركز فنها على العلاقة بين الإنسان والطبيعة. وقد وصفت أعمالها بأنها جذابة بشكل مجرد ومجازي، وتتحدى الجاذبية، وتمثل "توليفًا رائعًا لمواد غير متوقعة."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'منحوتة شبيهة بالأسلاك الفاتحة مركبة على جدار من الخرسانة وممتدة على الأرض. تبدو خفيفة.'
}, {
  name: 'فرسان نهر',
  artist: 'حديقة حيوان تايبيه',
  description: 'قد قامت حديقة حيوان تايبيه بطلب ساحة للفرسان النهريين تتضمن فرسان النهر المغمورين في اللعب.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'مجموعة من منحوتات فرسان النهر المصنوعة من البرونز تظهر وكأنها تسبح خارجة من الرصيف كأنها تسبح.'
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

معالج الحدث `handleClick` يقوم بتحديث المتغير المحلي `index`. ولكن هناك عاملين يمنعان ظهور هذا التغيير:

1. **المتغيرات المحلية لا تستمر بين عمليات التصيير.** عندما يقوم React بتصيير هذا المكون للمرة الثانية، فإنه يعرضه من البداية—لا يأخذ في الاعتبار أي تغييرات في المتغيرات المحلية.
2. **التغييرات على المتغيرات المحلية لن تؤدي إلى تنشيط عمليات التصيير.** React لا يدرك أنه يحتاج إلى إعادة تصيير المكون مرة أخرى بالبيانات الجديدة.

لتحديث المكون ببيانات جديدة، تحتاج إلى حدوث شيئين:

1. **الاحتفاظ** بالبيانات بين عمليات التصيير.
2. **تنشيط** React لإعادة تصيير المكون بالبيانات الجديدة (إعادة التصيير).

يوفر  [`useState`](/reference/react/useState) هذين العنصرين:

1. **متغير حالة** للاحتفاظ بالبيانات بين عمليات التصيير
2. **دالة معينة للحالة** لتحديث المتغير وتنشيط React لإعادة تصيير المكون مرة أخرى.

## Adding a state variable {/*adding-a-state-variable*/}

لإضافة متغير حالة، استورد(import) `useState` من  في أعلى الملف:

```js
import { useState } from 'react';
```

ثم، استبدل هذا السطر:

```js
let index = 0;
```

بهذا

```js
const [index, setIndex] = useState(0);
```

`index` هو متغير حالة و `setIndex` هو دالة التعيين.

> بناء الجملة `[` و `]` هنا يسمى [تفكيك المصفوفات](https://javascript.info/destructuring-assignment) ويتيح لك قراءة القيم من مصفوفة. تحتوي المصفوفة التي يعيدها `useState` دائمًا على عنصرين بالضبط.

هكذا يعملان معًا في `handleClick`:

```js
function handleClick() {
  setIndex(index + 1);
}
```

الآن عند النقر على زر "التالي"، يتم تبديل النموذج النحتي الحالي:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        التالي
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        بواسطة {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'تحية لجراحة الأعصاب',
  artist: 'مارتا كولفين أندرادي',
  description: 'على الرغم من أن كولفين معروفة بشكل أساسي بالمواضيع المجردة التي تلمح إلى الرموز ما قبل الهيسبانية، إلا أن هذا التمثال العملاق، تحية لجراحة الأعصاب، هو واحد من أكثر قطع الفن العامة التي يمكن التعرف عليها.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'تمثال من البرونز ليدين متقاطعتين تحملان براغين الدماغ البشري بأطراف أصابعهما بعناية.'  
}, {
  name: 'فلوراليس جينيريكا',
  artist: 'إدواردو كاتالانو',
  description: 'هذه الزهرة الفضية الضخمة (75 قدمًا أو 23 مترًا) تقع في بوينس آيرس. تم تصميمها للتحرك، حيث تُغلق بتلاتها في المساء أو عندما تكون الرياح قوية وتُفتح في الصباح.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'تمثال ضخم من المعدن الفضي يتميز بتلات مرآة تعكس الضوء وسيقان قوية.'
}, {
  name: 'الوجود الأبدي',
  artist: 'جون وودرو ويلسون',
  description: 'شتُهر ويلسون بشدقه بالمساواة والعدالة الاجتماعية، وكذلك الصفات الأساسية والروحية للبشرية. يمثل هذا التمثال البرونزي الضخم (7 أقدام أو 2.13 متر) ما وصفه بأنه "وجود أسود رمزي مشبوب بشعور بالإنسانية العالمية"',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'التمثال الذي يصوّر رأس إنسان يبدو حاضرًا وجديًا دائمًا. إنه ينبعث منه الهدوء والسكينة.'
}, {
  name: 'مواي',
  artist: 'فنان مجهول',
  description: 'تقع على جزيرة الفصح، وهناك 1000 تمثال مواي، أو تماثيل ضخمة موجودة، تم إنشاؤها من قبل شعب رابا نوي الأول في وقت مبكر، ويعتقد البعض أنها تمثل أسلافًا مجسدين.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'ثلاثة تماثيل حجرية ضخمة لرؤوس بأوجه كبيرة نسبيًا وتعابير وجوه متجهمة.'
}, {
  name: 'نانا الزرقاء',
  artist: 'نيكي دي سانت فال',
  description: 'النانا هي مخلوقات ظافرة، رموز للأنوثة والأمومة. في البداية، استخدمت سانت فال القماش والأشياء المعثور عليها للنانا، وفي وقت لاحق قدمت البوليستر لتحقيق تأثير أكثر حيوية.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'تمثال موزاييكي كبير لشخصية أنثوية راقصة غريبة في زي ملون تنبع منها الفرح.'
}, {
  name: 'النموذج النهائي',
  artist: 'باربارا هيبورث',
  description: 'هذا التمثال البرونزي المجرد هو جزء من سلسلة "عائلة الإنسان" الموجودة في حديقة يوركشاير للنحت. اختارت هيبورث عدم إنشاء تمثيلات حرفية للعالم ولكنها طوّرت أشكالًا مجردة مستوحاة من البشر والمناظر الطبيعية..',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'تمثال طويل مصنوع من ثلاثة عناصر مرصوصة فوق بعضها البعض تشبه شكل إنسان.'
}, {
  name: 'كافاليير',
  artist: 'لاميدي أولونادي فاكيهي',
  description: "نزلت أعمال فاكيهي من أربعة أجيال من نحاتي الخشب، ودمجت أعماله بين المواضيع التقليدية واليوروبية المعاصرة.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'تمثال خشبي معقد لمحارب ذو وجه مركزي على حصان مزين بزخارف.'
}, {
  name: 'بطون كبيرة',
  artist: 'ألينا شابوتشنيكوف',
  description: "شابوتشنيكوف معروفة بتماثيلها المكسورة للجسم كاستعارة لهشاشة وعدم الدوام للشباب والجمال. يصور هذا التمثال بطونًا كبيرة واقعية جدًا مكدسة فوق بعضها البعض، تبلغ ارتفاع كل واحدة حوالي خمسة أقدام (1.5 متر).",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'التمثال يذكر بشلال من الطيات، مختلف تمامًا عن البطون في التماثيل الكلاسيكية.'
}, {
  name: 'Terracotta Army',
  artist: 'فنان غير معروف',
  description: 'جيش التراكوتا هو مجموعة من تماثيل التراكوتا تصور جيوش قين شي هوانغ، أول إمبراطور للصين. يتألف الجيش من أكثر من 8000 جندي، و130 عربة مع 520 حصانًا، و150 حصانًا فرسانيًا.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 تمثالًا من التراكوتا لمحاربين جادين، يتميز كل منهم بتعبير وجه فريد'
}, {
  name: 'منظر طبيعي قمري',
  artist: 'لويز نيفلسون',
  description: 'كانت نيفلسون معروفة بالتجميع من الأشياء المتناثرة في شوارع مدينة نيويورك، والتي كانت تقوم بتجميعها لاحقًا في إبداعات ضخمة. في هذا العمل، استخدمت أجزاء متنوعة مثل ساق سرير، وعصا تلاعب، وجزء من مقعد، وقامت بتثبيتها ولصقها في صناديق تعكس تأثير التجريد الهندسي للمكعبات في الفن التكعيبي على الفضاء والشكل.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: ' منحوتة سوداء مطفأة حيث يكون من الصعب في البداية تمييز العناصر الفردية.'
}, {
  name: 'هالة ضوئية',
  artist: ' رانجاني شيتار',
  description: 'تدمج شيتار بين التقاليد والحداثة، وبين الطبيعة والصناعة. يركز فنها على العلاقة بين الإنسان والطبيعة. وقد وصفت أعمالها بأنها جذابة بشكل مجرد ومجازي، وتتحدى الجاذبية، وتمثل "توليفًا رائعًا لمواد غير متوقعة."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'منحوتة شبيهة بالأسلاك الفاتحة مركبة على جدار من الخرسانة وممتدة على الأرض. تبدو خفيفة.'
}, {
  name: 'فرسان نهر',
  artist: 'حديقة حيوان تايبيه',
  description: 'قد قامت حديقة حيوان تايبيه بطلب ساحة للفرسان النهريين تتضمن فرسان النهر المغمورين في اللعب.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'مجموعة من منحوتات فرسان النهر المصنوعة من البرونز تظهر وكأنها تسبح خارجة من الرصيف كأنها تسبح.'
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

### تعرف على الخطاف الأول الخاص بك {/*meet-your-first-hook*/}

في React, `useState`, بالإضافة إلى أي وظيفة أخرى تبدأ بـ "`use`" ، يُطلق عليها اسم خطاف

*الخطافات* are special functions that are only available while React is [rendering](/learn/render-and-commit#step-1-trigger-a-render) (which we'll get into in more detail on the next page). They let you "hook into" different React features.

State is just one of those features, but you will meet the other Hooks later.

<Pitfall>

**Hooks—functions starting with `use`—can only be called at the top level of your components or [your own Hooks.](/learn/reusing-logic-with-custom-hooks)** You can't call Hooks inside conditions, loops, or other nested functions. Hooks are functions, but it's helpful to think of them as unconditional declarations about your component's needs. You "use" React features at the top of your component similar to how you "import" modules at the top of your file.

</Pitfall>

### Anatomy of `useState` {/*anatomy-of-usestate*/}

When you call [`useState`](/reference/react/useState), you are telling React that you want this component to remember something:

```js
const [index, setIndex] = useState(0);
```

In this case, you want React to remember `index`.

<Note>

The convention is to name this pair like `const [something, setSomething]`. You could name it anything you like, but conventions make things easier to understand across projects.

</Note>

The only argument to `useState` is the **initial value** of your state variable. In this example, the `index`'s initial value is set to `0` with `useState(0)`. 

Every time your component renders, `useState` gives you an array containing two values:

1. The **state variable** (`index`) with the value you stored.
2. The **state setter function** (`setIndex`) which can update the state variable and trigger React to render the component again.

Here's how that happens in action:

```js
const [index, setIndex] = useState(0);
```

1. **Your component renders the first time.** Because you passed `0` to `useState` as the initial value for `index`, it will return `[0, setIndex]`. React remembers `0` is the latest state value.
2. **You update the state.** When a user clicks the button, it calls `setIndex(index + 1)`. `index` is `0`, so it's `setIndex(1)`. This tells React to remember `index` is `1` now and triggers another render.
3. **Your component's second render.** React still sees `useState(0)`, but because React *remembers* that you set `index` to `1`, it returns `[1, setIndex]` instead.
4. And so on!

## Giving a component multiple state variables {/*giving-a-component-multiple-state-variables*/}

You can have as many state variables of as many types as you like in one component. This component has two state variables, a number `index` and a boolean `showMore` that's toggled when you click "Show details":

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
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

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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

It is a good idea to have multiple state variables if their state is unrelated, like `index` and `showMore` in this example. But if you find that you often change two state variables together, it might be easier to combine them into one. For example, if you have a form with many fields, it's more convenient to have a single state variable that holds an object than state variable per field. Read [Choosing the State Structure](/learn/choosing-the-state-structure) for more tips.

<DeepDive>

#### How does React know which state to return? {/*how-does-react-know-which-state-to-return*/}

You might have noticed that the `useState` call does not receive any information about *which* state variable it refers to. There is no "identifier" that is passed to `useState`, so how does it know which of the state variables to return? Does it rely on some magic like parsing your functions? The answer is no.

Instead, to enable their concise syntax, Hooks **rely on a stable call order on every render of the same component.** This works well in practice because if you follow the rule above ("only call Hooks at the top level"), Hooks will always be called in the same order. Additionally, a [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) catches most mistakes.

Internally, React holds an array of state pairs for every component. It also maintains the current pair index, which is set to `0` before rendering. Each time you call `useState`, React gives you the next state pair and increments the index. You can read more about this mechanism in [React Hooks: Not Magic, Just Arrays.](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

This example **doesn't use React** but it gives you an idea of how `useState` works internally:

<Sandpack>

```js index.js active
let componentHooks = [];
let currentHookIndex = 0;

// How useState works inside React (simplified).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // This is not the first render,
    // so the state pair already exists.
    // Return it and prepare for next Hook call.
    currentHookIndex++;
    return pair;
  }

  // This is the first time we're rendering,
  // so create a state pair and store it.
  pair = [initialState, setState];

  function setState(nextState) {
    // When the user requests a state change,
    // put the new value into the pair.
    pair[0] = nextState;
    updateDOM();
  }

  // Store the pair for future renders
  // and prepare for the next Hook call.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Each useState() call will get the next pair.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // This example doesn't use React, so
  // return an output object instead of JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Reset the current Hook index
  // before rendering the component.
  currentHookIndex = 0;
  let output = Gallery();

  // Update the DOM to match the output.
  // This is the part React does for you.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// Make UI match the initial state.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Next
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

You don't have to understand it to use React, but you might find this a helpful mental model.

</DeepDive>

## State is isolated and private {/*state-is-isolated-and-private*/}

State is local to a component instance on the screen. In other words, **if you render the same component twice, each copy will have completely isolated state!** Changing one of them will not affect the other.

In this example, the `Gallery` component from earlier is rendered twice with no changes to its logic. Try clicking the buttons inside each of the galleries. Notice that their state is independent:

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </section>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

This is what makes state different from regular variables that you might declare at the top of your module. State is not tied to a particular function call or a place in the code, but it's "local" to the specific place on the screen. You rendered two `<Gallery />` components, so their state is stored separately.

Also notice how the `Page` component doesn't "know" anything about the `Gallery` state or even whether it has any. Unlike props, **state is fully private to the component declaring it.** The parent component can't change it. This lets you add state to any component or remove it without impacting the rest of the components.

What if you wanted both galleries to keep their states in sync? The right way to do it in React is to *remove* state from child components and add it to their closest shared parent. The next few pages will focus on organizing state of a single component, but we will return to this topic in [Sharing State Between Components.](/learn/sharing-state-between-components)

<Recap>

* Use a state variable when a component needs to "remember" some information between renders.
* State variables are declared by calling the `useState` Hook.
* Hooks are special functions that start with `use`. They let you "hook into" React features like state.
* Hooks might remind you of imports: they need to be called unconditionally. Calling Hooks, including `useState`, is only valid at the top level of a component or another Hook.
* The `useState` Hook returns a pair of values: the current state and the function to update it.
* You can have more than one state variable. Internally, React matches them up by their order.
* State is private to the component. If you render it in two places, each copy gets its own state.

</Recap>



<Challenges>

#### Complete the gallery {/*complete-the-gallery*/}

When you press "Next" on the last sculpture, the code crashes. Fix the logic to prevent the crash. You may do this by adding extra logic to event handler or by disabling the button when the action is not possible.

After fixing the crash, add a "Previous" button that shows the previous sculpture. It shouldn't crash on the first sculpture.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
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

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

This adds a guarding condition inside both event handlers and disables the buttons when needed:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
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

```js data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

Notice how `hasPrev` and `hasNext` are used *both* for the returned JSX and inside the event handlers! This handy pattern works because event handler functions ["close over"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) any variables declared while rendering.

</Solution>

#### Fix stuck form inputs {/*fix-stuck-form-inputs*/}

When you type into the input fields, nothing appears. It's like the input values are "stuck" with empty strings. The `value` of the first `<input>` is set to always match the `firstName` variable, and the `value` for the second `<input>` is set to always match the `lastName` variable. This is correct. Both inputs have `onChange` event handlers, which try to update the variables based on the latest user input (`e.target.value`). However, the variables don't seem to "remember" their values between re-renders. Fix this by using state variables instead.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

First, import `useState` from React. Then replace `firstName` and `lastName` with state variables declared by calling `useState`. Finally, replace every `firstName = ...` assignment with `setFirstName(...)`, and do the same for `lastName`. Don't forget to update `handleReset` too so that the reset button works.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Fix a crash {/*fix-a-crash*/}

Here is a small form that is supposed to let the user leave some feedback. When the feedback is submitted, it's supposed to display a thank-you message. However, it crashes with an error message saying "Rendered fewer hooks than expected". Can you spot the mistake and fix it?

<Hint>

Are there any limitations on _where_ Hooks may be called? Does this component break any rules? Check if there are any comments disabling the linter checks--this is where the bugs often hide!

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Hooks can only be called at the top level of the component function. Here, the first `isSent` definition follows this rule, but the `message` definition is nested in a condition.

Move it out of the condition to fix the issue:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```

</Sandpack>

Remember, Hooks must be called unconditionally and always in the same order!

You could also remove the unnecessary `else` branch to reduce the nesting. However, it's still important that all calls to Hooks happen *before* the first `return`.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

</Sandpack>

Try moving the second `useState` call after the `if` condition and notice how this breaks it again.

If your linter is [configured for React](/learn/editor-setup#linting), you should see a lint error when you make a mistake like this. If you don't see an error when you try the faulty code locally, you need to set up linting for your project. 

</Solution>

#### Remove unnecessary state {/*remove-unnecessary-state*/}

When the button is clicked, this example should ask for the user's name and then display an alert greeting them. You tried to use state to keep the name, but for some reason it always shows "Hello, !".

To fix this code, remove the unnecessary state variable. (We will discuss about [why this didn't work](/learn/state-as-a-snapshot) later.)

Can you explain why this state variable was unnecessary?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('What is your name?'));
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```

</Sandpack>

<Solution>

Here is a fixed version that uses a regular `name` variable declared in the function that needs it:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('What is your name?');
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```

</Sandpack>

A state variable is only necessary to keep information between re-renders of a component. Within a single event handler, a regular variable will do fine. Don't introduce state variables when a regular variable works well.

</Solution>

</Challenges>

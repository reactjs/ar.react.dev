---
title: مقدمة
---

<Intro>
React Compiler هي أداة جديدة تعمل في وقت البناء وتحسّن تطبيق React الخاص بك تلقائياً. وهي تعمل مع JavaScript العادي، وتفهم [قواعد React](/reference/rules)، لذا لا تحتاج إلى إعادة كتابة أي كود لاستخدامها.
</Intro>

<YouWillLearn>

* ما الذي يفعله React Compiler
* البدء مع الcompiler
* استراتيجيات التبني التدريجي
* تصحيح الأخطاء واستكشاف المشاكل عند حدوث خطأ ما
* استخدام الcompiler على مكتبة React الخاصة بك

</YouWillLearn>

## ما الذي يفعله React Compiler؟ {/*what-does-react-compiler-do*/}

يحسّن React Compiler تطبيق React تلقائياً أثناء عملية البناء. غالباً ما يكون React سريعاً بما يكفي دون الحاجة إلى تحسينات، لكن في بعض الحالات قد تحتاج إلى استخدام memoization يدوياً للمكونات والقيم للحفاظ على استجابة تطبيقك. هذا الـ memoization اليدوي مُرهق، ومن السهل ارتكاب أخطاء عند استخدامه، كما يؤدي إلى كتابة شيفرة إضافية تحتاج إلى صيانتها. يتولى React Compiler تنفيذ هذه التحسينات تلقائياً، مما يخفف عنك هذا العبء الذهني ويتيح لك التركيز على تطوير الميزات.

### قبل React Compiler {/*before-react-compiler*/}

بدون React Compiler، تحتاج إلى تطبيق memoization يدوياً على المكونات والقيم لتحسين عمليات إعادة الrender.

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

<Note>

يحتوي هذا التذكر اليدوي على خطأ دقيق يكسر التذكر:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

حتى وإن تم التفاف handleClick في useCallback، فإن دالة السهم `() => handleClick(item)` تنشئ دالة جديدة في كل مرة يتم فيها render للمكون. وهذا يعني أن `Item` سوف تتلقى دائماً خاصية onClick جديدة، مما يكسر التذكر.

يمكن لـ React Compiler تحسين هذا بشكل صحيح مع أو بدون دالة السهم، مما يضمن أن Item سيتم إعادة render له فقط عندما تتغير props.onClick.

</Note>

### بعد React Compiler {/*after-react-compiler*/}

مع React Compiler، تكتب نفس الكود بدون تذكر يدوي:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[شاهد هذا المثال في React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

يطبّق React Compiler تلقائيًا ما يعادل الـ `memoization` اليدوي، مما يضمن أن تطبيقك سيتم إعادة render له فقط عند الضرورة.

<DeepDive>
#### ما نوع التذكر الذي يضيفه React Compiler؟ {/*what-kind-of-memoization-does-react-compiler-add*/}

يركز التذكر التلقائي في React Compiler في المقام الأول على **تحسين أداء التحديثات** (إعادة render المكونات الموجودة)، لذلك فإنه يركز على حالات الاستخدام التاليتين:

1. **تخطي إعادة render المكونات المتسلسلة**
    * إعادة render `<Parent />` تسبب إعادة render العديد من المكونات في شجرة المكون الخاصة بها، حتى وإن كان فقط `<Parent />` الوحيد الذي قد تغير
1. **تجنّب إعادة تنفيذ العمليات الحسابية المكلفة التي لا ينفذها React نفسه.**
    * على سبيل المثال، عندما يستدعي أحد المكوّنات أو الـ Hook الدالة `expensivelyProcessAReallyLargeArrayOfObjects()` للحصول على تلك البيانات.

### تحسين إعادة التصيير {/*optimizing-re-renders*/}

يسمح React لك بالتعبير عن واجهتك كدالة من حالتها الحالية (بشكل أكثر دقة: props والحالة والـ context الخاصة بها). في التطبيق الحالي، عندما تتغير حالة المكون، سيُعيد React تنفيذ عملية الـ render لهذا المكوّن الفرعية له — ما لم تكن قد طبقت بعض أشكال التذكر اليدوي باستخدام `useMemo()` أو `useCallback()` أو `React.memo()`. على سبيل المثال، في المثال التالي، سيتم إعادة تصيير `<MessageButton>` عندما تتغير حالة `<FriendList>`:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```

_[شاهد هذا المثال في React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

يطبق React Compiler تلقائياً ما يعادل التذكر اليدوي، مما يضمن أن إعادة تصيير فقط الأجزاء ذات الصلة من التطبيق عند تغيير الحالة، وهو ما يُشار إليه أحياناً باسم "التفاعل الدقيق". في المثال أعلاه، يحدد React Compiler أن قيمة الإرجاع `<FriendListCard />` يمكن إعادة استخدامها حتى عندما يتغير friends، ويمكن تجنب إعادة إنشاء JSX هذا وتجنب إعادة تصيير `<MessageButton>` عند تغيير العدد.


#### تُطبَّق تقنية `memoization` أيضًا على العمليات الحسابية المكلفة تلقائيًا {/*expensive-calculations-also-get-memoized*/}

يمكن لـ React Compiler أيضًا تطبيق `memoization` تلقائيًا على العمليات الحسابية المكلفة التي تُستخدم أثناء عملية الـ render:

```js
// **لم يتم** memoize بواسطة React Compiler، لأن هذا ليس مكوناً أو hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized بواسطة React Compiler لأن هذا مكون
function TableContainer({ items }) {
  // سيتم memoize استدعاء الدالة هذا:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

_[شاهد هذا المثال في React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)_

ومع ذلك، إذا كانت `expensivelyProcessAReallyLargeArrayOfObjects` دالة مكلفة حقاً، فقد تريد التفكير في تطبيق التذكر الخاص بها خارج React، لأن:

- يقوم React Compiler فقط بـ memoize مكونات React و hooks، وليس كل دالة
- التذكر في React Compiler لا تتم مشاركته عبر عدة مكونات أو hooks

لذلك، إذا استُخدمت الدالة `expensivelyProcessAReallyLargeArrayOfObjects` في العديد من المكوّنات المختلفة، فسيُعاد تنفيذ هذه العملية الحسابية المكلفة مرارًا وتكرارًا، حتى وإن مُرِّرت إليها البيانات نفسها في كل مرة. لذلك، ننصح أولًا بإجراء [تحليل الأداء](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) للتأكد من أن هذه العملية مكلفة فعلًا، قبل زيادة تعقيد الشيفرة
</DeepDive>

## هل يجب أن أجرب المترجم؟ {/*should-i-try-out-the-compiler*/}

نحن نشجع الجميع على البدء في استخدام React Compiler. في حين أن المترجم لا يزال إضافة اختيارية لـ React اليوم، قد تتطلب بعض الميزات في المستقبل المترجم لكي تعمل بشكل كامل.

### هل من الآمن استخدامه؟ {/*is-it-safe-to-use*/}

React Compiler مستقر الآن وقد تم اختباره بشكل مكثف في الإنتاج. في حين تم استخدامه في الإنتاج في شركات مثل Meta، فإن نشر المترجم للإنتاج في تطبيقك سيعتمد على صحة codebase الخاص بك وكيف اتبعت جيداً [قواعد React](/reference/rules).

## ما أدوات البناء المدعومة؟ {/*what-build-tools-are-supported*/}

يمكن تثبيت React Compiler مع [العديد من أدوات البناء](/learn/react-compiler/installation)، مثل Babel وVite وMetro وRsbuild.

يعتمد React Compiler في الأساس على إضافة (Plugin) خفيفة لـ Babel تعمل كغلاف (Wrapper) حول المترجم الأساسي، والذي صُمم ليكون مستقلاً عن Babel نفسه. ورغم أن الإصدار المستقر الأول من React Compiler سيظل يعتمد في المقام الأول على إضافة لـ Babel، فإننا نعمل بالتعاون مع فريقي swc و[oxc](https://github.com/oxc-project/oxc/issues/10048) لتوفير دعمٍ أصيل (First-class support) لـ React Compiler، بحيث لن تضطر مستقبلًا إلى إعادة إضافة Babel إلى مسارات البناء (Build Pipelines) الخاصة بك.

يمكن لمستخدمي Next.js تفعيل React Compiler الذي يستدعيه swc باستخدام الإصدار [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) أو أحدث.

## ماذا ينبغي أن أفعل بشأن useMemo وuseCallback وReact.memo؟ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

بشكل افتراضي، يطبق React Compiler تقنية `memoization` على شيفرتك اعتمادًا على تحليله والاستدلالات (heuristics) التي يستخدمها. وفي معظم الحالات، يكون هذا الـ `memoization` بنفس دقة ما قد تكتبه يدويًا، أو حتى أكثر دقة.

ومع ذلك، قد يحتاج المطورون في بعض الحالات إلى قدر أكبر من التحكم في الـ `memoization`. ويمكن الاستمرار في استخدام الـ Hooks ‏`useMemo` و`useCallback` مع React Compiler باعتبارهما وسيلة تمنحك تحكمًا في القيم التي تُطبَّق عليها تقنية `memoization`. ومن أكثر الحالات شيوعًا لاستخدام ذلك أن تكون قيمة خضعت لـ `memoization` مستخدمةً كاعتماد (Dependency) داخل أحد الـ Effects، لضمان عدم إعادة تشغيل الـ Effect بشكل متكرر عندما لا تتغير اعتماداته بصورة مؤثرة.

بالنسبة إلى الشيفرات الجديدة، نوصي بالاعتماد على React Compiler لتطبيق `memoization`، واستخدام `useMemo` و`useCallback` فقط عند الحاجة إلى تحكم أكثر دقة.

أما بالنسبة إلى الشيفرات الحالية، فنوصي إما بالإبقاء على الـ `memoization` الموجود كما هو (لأن إزالته قد تؤثر في ناتج عملية الترجمة)، أو اختباره بعناية قبل إزالته.

## جرّب React Compiler {/*try-react-compiler*/}

سيساعدك هذا القسم على البدء باستخدام React Compiler وفهم كيفية الاستفادة منه بفعالية في مشاريعك.

* **[التثبيت](/learn/react-compiler/installation)** - تعرّف على كيفية تثبيت React Compiler وإعداده ليتوافق مع أدوات البناء التي تستخدمها.
* **[التوافق مع إصدارات React](/reference/react-compiler/target)** - دعم React 17 و18 و19.
* **[الإعدادات](/reference/react-compiler/configuration)** - تعرّف على كيفية تخصيص React Compiler بما يناسب احتياجات مشروعك.
* **[التبنّي التدريجي](/learn/react-compiler/incremental-adoption)** - استراتيجيات لتطبيق React Compiler تدريجيًا في قواعد الشيفرة الحالية.
* **[تصحيح الأخطاء واستكشاف المشكلات وإصلاحها](/learn/react-compiler/debugging)** - تعرّف على كيفية تحديد المشكلات وإصلاحها عند استخدام React Compiler.
* **[تجميع المكتبات](/reference/react-compiler/compiling-libraries)** - أفضل الممارسات لنشر الشيفرة بعد تجميعها.
* **[مرجع واجهة البرمجة (API Reference)](/reference/react-compiler/configuration)** - توثيق تفصيلي لجميع خيارات الإعداد.

## موارد إضافية {/*additional-resources*/}

إلى جانب هذا الدليل، ننصح بالاطلاع على [React Compiler Working Group](https://github.com/reactwg/react-compiler) للحصول على مزيد من المعلومات والمناقشات المتعلقة بـ React Compiler.

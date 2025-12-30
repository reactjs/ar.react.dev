---
title: مقدّمة
---

<Intro>
React Compiler أداة جديدة تعمل أثناء البناء وتقوم تلقائيًا بتحسين تطبيق React الخاص بك. تعمل مع JavaScript العادي، وتفهم [قواعد React](/reference/rules)، لذلك لست بحاجة إلى إعادة كتابة الشيفرة لاستخدامها.
</Intro>

<YouWillLearn>

* ما الذي يفعله React Compiler
* كيفية البدء بالمُجمِّع
* استراتيجيات التبنّي التدريجي
* التصحيح واستكشاف المشكلات عند حدوث أخطاء
* استخدام المُجمِّع على مكتبتك الخاصة بـ React

</YouWillLearn>

## ماذا يفعل React Compiler؟ {/*what-does-react-compiler-do*/}

يقوم React Compiler بتحسين تطبيق React تلقائيًا أثناء عملية البناء. غالبًا ما يكون أداء React جيدًا بدون تحسينات إضافية، لكن أحيانًا تحتاج إلى تذكُّر (memoize) المكوّنات والقيم يدويًا للحفاظ على استجابة التطبيق. هذه العملية اليدوية مرهقة، وسهلة الخطأ، وتضيف شيفرة إضافية يصعب صيانتها. يقوم React Compiler بهذه التحسينات تلقائيًا نيابة عنك، مما يخفف عنك عبء التفكير ويتيح لك التركيز على بناء الميزات.

### قبل React Compiler {/*before-react-compiler*/}

بدون المُجمِّع، تحتاج لتذكُّر المكوّنات والقيم يدويًا لتحسين إعادة العرض:

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

للتذكُّر اليدوي هذه مشكلة دقيقة تكسر التذكُّر:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

على الرغم من أن `handleClick` ملفوف بـ `useCallback`، فإن التعبير السهمي `() => handleClick(item)` ينشئ دالة جديدة في كل عملية عرض، ما يعني أن `Item` سيستقبل دائمًا قيمة جديدة في خاصية `onClick`، فتُكسر فعالية التذكُّر.

React Compiler قادر على تحسين هذا بشكل صحيح سواء وُجد التعبير السهمي أم لا، مما يضمن أن `Item` يُعاد عرضه فقط عندما يتغير `props.onClick`.

</Note>

### بعد React Compiler {/*after-react-compiler*/}

مع React Compiler، تكتب نفس الشيفرة دون الحاجة للتذكُّر اليدوي:

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

React Compiler يطبّق التذكُّر الأمثل تلقائيًا، مما يضمن أن التطبيق يعيد العرض فقط عند الحاجة.

<DeepDive>
#### ما نوع التذكُّر الذي يضيفه React Compiler؟ {/*what-kind-of-memoization-does-react-compiler-add*/}

يركز التذكُّر التلقائي في React Compiler بشكل أساسي على **تحسين أداء التحديثات** (إعادة عرض المكوّنات الموجودة)، لذا يركز على حالتي استخدام رئيسيتين:

1. **تجنّب إعادة عرض مكوّنات متتالية**
    * إعادة عرض `<Parent />` قد تسبب إعادة عرض العديد من المكوّنات في الشجرة، حتى إذا تغيّر `<Parent />` فقط
1. **تجنّب الحسابات المكلفة خارج React**
    * على سبيل المثال، استدعاء `expensivelyProcessAReallyLargeArrayOfObjects()` داخل مكوّن أو هُوك يحتاج هذه البيانات

#### تحسين إعادة العرض {/*optimizing-re-renders*/}

تسمح React بالتعبير عن واجهة المستخدم بوصفها دالة على الحالة الحالية (بالتحديد: الخصائص props، والحالة state، والسياق context). في التنفيذ الحالي، عندما تتغير حالة مكوّن ما، تقوم React بإعادة عرض ذلك المكوّن _وكافة أبنائه_ — إلا إذا طبّقت شكلًا من أشكال التذكُّر اليدوي مثل `useMemo()` أو `useCallback()` أو `React.memo()`. على سبيل المثال، في المثال أدناه، سيُعاد عرض `<MessageButton>` كلما تغيرت حالة `<FriendList>`:

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

يقوم React Compiler تلقائيًا بتطبيق ما يعادل التذكُّر اليدوي، مما يضمن أن الأجزاء ذات الصلة فقط من التطبيق هي التي تُعاد عرضها عند تغيّر الحالة — وهو ما يُعرف أحيانًا بـ "ردّ الفعل الدقيق" (fine-grained reactivity). في المثال أعلاه، يحدد React Compiler أن ناتج `<FriendListCard />` يمكن إعادة استخدامه حتى لو تغيّر `friends`، ويستطيع تجنّب إعادة إنشاء JSX هذا وتجنّب إعادة عرض `<MessageButton>` عندما يتغير العد.

#### تُذكّر الحسابات المكلفة أيضًا {/*expensive-calculations-also-get-memoized*/}

يمكن لـ React Compiler أيضًا تذكُّر الحسابات المكلفة المستخدمة أثناء العرض تلقائيًا:

```js
// **غير** مُذكّر بواسطة React Compiler، لأن هذه ليست مكوّنًا أو هُوكًا
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// مُذكّر بواسطة React Compiler لأن هذا مكوّن
function TableContainer({ items }) {
  // سيتم تذكُّر استدعاء هذه الدالة:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

ومع ذلك، إذا كانت `expensivelyProcessAReallyLargeArrayOfObjects` بالفعل دالة مكلفة جدًا، فقد تود التفكير في تنفيذ تذكرة خاصة بها خارج React، لأن:

- React Compiler يُذكّر المكوّنات والخُطَف فقط، وليس كل دالة
- تذكّر React Compiler ليس مشتركًا بين مكوّنات أو خُطَف متعددة

لذا إذا كانت الدالة تُستخدم في العديد من المكونات، حتى وإن نُقل نفس العناصر بالضبط، فسيتم تشغيل الحساب المكلف مرّاتٍ متكررة. نوصي بـ [القياس](/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) أولًا لمعرفة ما إذا كانت الدالة فعلاً مكلفة قبل تعقيد الشيفرة.
</DeepDive>

## هل يجب أن أجرب المُجمِّع؟ {/*should-i-try-out-the-compiler*/}

نشجّع الجميع على البدء باستخدام React Compiler. بينما لا يزال المُجمِّع إضافة اختيارية إلى React اليوم، فقد تتطلب بعض الميزات في المستقبل عمل المُجمِّع لتعمل بالكامل.

### هل من الآمن استخدامه؟ {/*is-it-safe-to-use*/}

يُعتبر React Compiler الآن مستقرًا وقد اختُبر على نطاق واسع في الإنتاج. على الرغم من استخدامه في شركات كبرى، فإن نشر المُجمِّع في بيئة الإنتاج لديك يعتمد على صحّة قاعدة الشيفرة لديك ومدى التزامك بـ [قواعد React](/reference/rules).

## ما أدوات البناء المدعومة؟ {/*what-build-tools-are-supported*/}

يمكن تثبيت React Compiler عبر [عدة أدوات بناء](/learn/react-compiler/installation) مثل Babel و Vite و Metro و Rsbuild.

React Compiler هو في الأساس إضافة Babel خفيفة تغلّف نواة المُجمِّع، والتي صُمّمت بحيث تكون منفصلة عن Babel نفسه. بينما سيبقى الإصدار المستقر الأولي للمُجمِّع في الغالب كمكوّن Babel، نعمل مع فرق swc و [oxc](https://github.com/oxc-project/oxc/issues/10048) لبناء دعم أصلي لـ React Compiler حتى لا تضطر لإعادة إضافة Babel إلى خطوط البناء في المستقبل.

يمكن لمستخدمي Next.js تفعيل المُجمِّع المدعو بواسطة swc باستخدام [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) وما بعدها.

## ماذا أفعل بشأن useMemo و useCallback و React.memo؟ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

بشكل افتراضي، سيقوم React Compiler بتذكُّر الشيفرة استنادًا إلى تحليله وقواعده. في معظم الحالات، سيكون هذا التذكُّر دقيقًا أو أدق مما قد تكتبه يدويًا.

ومع ذلك، قد يحتاج المطوّرون أحيانًا لمزيد من التحكم في التذكُّر. يمكن استمرار استخدام `useMemo` و `useCallback` مع React Compiler كمهرب لتحديد القيم التي يجب تذكُّرها بدقة. حالة استخدام شائعة هي عندما تُستخدم قيمة مذكَّرة كاعتماد لتأثير (effect) لضمان عدم تشغيل التأثير مرارًا وتكرارًا عندما لا تتغير الاعتمادات فعليًا.

بالنسبة للشيفرة الجديدة، نوصي بالاعتماد على المُجمِّع للتذكُّر واستخدام `useMemo`/`useCallback` حين تكون الحاجة إلى تحكم دقيق.

بالنسبة للشيفرة الحالية، نوصي إمّا بترك التذكُّر الموجود كما هو (إزالته قد يغير ناتج التجميع) أو اختبار التغييرات بعناية قبل إزالته.

## جرّب React Compiler {/*try-react-compiler*/}

يساعدك هذا القسم على البدء مع React Compiler وفهم كيفية استخدامه بفعالية في مشاريعك.

* **[التثبيت](/learn/react-compiler/installation)** - ثبّت React Compiler وكمّنه لأدوات البناء التي تستخدمها
* **[توافق إصدارات React](/reference/react-compiler/target)** - الدعم لإصدارات React 17 و 18 و 19
* **[التكوين](/reference/react-compiler/configuration)** - خصّص المُجمِّع لاحتياجاتك
* **[التبنّي التدريجي](/learn/react-compiler/incremental-adoption)** - استراتيجيات النشر التدريجي في قواعد الشيفرة الحالية
* **[التصحيح واستكشاف المشكلات](/learn/react-compiler/debugging)** - تحديد وحل المشكلات عند استخدام المُجمِّع
* **[تجميع المكتبات](/reference/react-compiler/compiling-libraries)** - أفضل الممارسات لشحن الشيفرة المجمّعة
* **[مرجع API](/reference/react-compiler/configuration)** - التوثيق التفصيلي لجميع خيارات التكوين

## موارد إضافية {/*additional-resources*/}

بالإضافة إلى هذه الوثائق، نوصي بالاطلاع على مجموعة عمل [React Compiler Working Group](https://github.com/reactwg/react-compiler) لمزيد من المعلومات والنقاش حول المُجمِّع.


---
title: مقدمة
---

<Intro>
مُصرّف React أداة جديدة وقت البناء تُحسِّن تطبيق React تلقائياً. يعمل مع JavaScript العادي، ويفهم [قواعد React](/reference/rules)، فلا تحتاج إلى إعادة كتابة الشيفرة لاستخدامه.
</Intro>

<YouWillLearn>

* ما الذي يفعله مُصرّف React
* البدء بالمُصرّف
* استراتيجيات التبني التدريجي
* التصحيح واستكشاف الأخطاء عند حدوث مشكلات
* استخدام المُصرّف في مكتبة React لديك

</YouWillLearn>

## ما الذي يفعله مُصرّف React؟ {/*what-does-react-compiler-do*/}

يُحسِّن مُصرّف React تطبيقك تلقائياً وقت البناء. React غالباً سريع بلا تحسين، لكن أحياناً تحتاج إلى تذكّر المكوّنات والقيم يدوياً ليبقى التطبيق سريع الاستجابة. هذا التذكّر اليدوي مُرهِق، وسهل الخطأ، ويزيد الشيفرة التي تُصان. يطبّق مُصرّف React هذا التحسين تلقائياً، فيُخفّف عنك هذا العبء الذهني لتتفرّغ لبناء الميزات.

### قبل مُصرّف React {/*before-react-compiler*/}

بدون المُصرّف، تحتاج إلى تذكّر المكوّنات والقيم يدوياً لتقليل إعادة الرسم:

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

في هذا التذكّر اليدوي خلل دقيق يكسر التذكّر:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

رغم أن `handleClick` ملفوف بـ `useCallback`، فإن الدالة السهمية `() => handleClick(item)` تنشئ دالة جديدة في كل مرة يُعاد فيها رسم المكوّن. يعني ذلك أن `Item` ستتلقى دائماً `onClick` جديداً، فيُكسر التذكّر.

يستطيع مُصرّف React تحسين هذا بشكل صحيح مع الدالة السهمية أو بدونها، فيضمن أن `Item` تعاد رسمها فقط عند تغيّر `props.onClick`.

</Note>

### بعد مُصرّف React {/*after-react-compiler*/}

مع مُصرّف React تكتب الشيفرة نفسها بلا تذكّر يدوي:

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

_[اطلع على هذا المثال في ملعب مُصرّف React](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

يطبّق مُصرّف React تلقائياً أفضل تذكّر، فيضمن أن يُعاد رسم تطبيقك فقط عند الحاجة.

<DeepDive>
#### أي نوع من التذكّر يضيفه مُصرّف React؟ {/*what-kind-of-memoization-does-react-compiler-add*/}

يركّز التذكّر التلقائي لمُصرّف React أساساً على **تحسين الأداء عند التحديث** (إعادة رسم المكوّنات الموجودة)، فيركّز على حالتين:

1. **تخطي إعادة الرسم المتسلسلة للمكوّنات**
    * إعادة رسم `<Parent />` تُسبب إعادة رسم مكوّنات كثيرة في شجرته رغم أن `<Parent />` وحده تغيّر
1. **تخطي الحسابات المكلفة من خارج React**
    * مثلاً استدعاء `expensivelyProcessAReallyLargeArrayOfObjects()` داخل مكوّن أو خطاف يحتاج تلك البيانات

#### تحسين إعادة الرسم {/*optimizing-re-renders*/}

يسمح لك React بأن تعبّر عن واجهتك كدالة لحالتها الحالية (بشكل أدق: الـ props والحالة والسياق). في التنفيذ الحالي، عند تغيّر حالة مكوّن، يُعاد رسم ذلك المكوّن _وجميع أبنائه_ — ما لم تطبّق شكلاً من التذكّر اليدوي بـ `useMemo()` أو `useCallback()` أو `React.memo()`. مثلاً في المثال التالي، `<MessageButton>` تُعاد رسمها عندما تتغيّر حالة `<FriendList>`:

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
[_اطلع على هذا المثال في ملعب مُصرّف React_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

يطبّق مُصرّف React تلقائياً ما يعادل التذكّر اليدوي، فيضمن أن تُعاد رسم الأجزاء ذات الصلة فقط مع تغيّر الحالة، وهو ما يُسمى أحياناً «تفاعلية دقيقة الحبيبات». في المثال أعلاه، يحدد مُصرّف React أن قيمة إرجاع `<FriendListCard />` يمكن إعادة استخدامها حتى عند تغيّر `friends`، ويمكنه تجنب إعادة إنشاء هذا الـ JSX _وتجنب_ إعادة رسم `<MessageButton>` عند تغيّر العدّ.

#### تُذكَّر الحسابات المكلفة أيضاً {/*expensive-calculations-also-get-memoized*/}

يمكن لمُصرّف React أيضاً تذكّر الحسابات المكلفة المستخدمة أثناء الرسم تلقائياً:

```js
// **لا** يُذكَّر بواسطة مُصرّف React، لأنها ليست مكوّناً ولا خطافاً
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// يُذكَّر بواسطة مُصرّف React لأنها مكوّن
function TableContainer({ items }) {
  // سيُذكَّر استدعاء هذه الدالة:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_اطلع على هذا المثال في ملعب مُصرّف React_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

لكن إن كانت `expensivelyProcessAReallyLargeArrayOfObjects` مكلفة فعلاً، فقد ترغب في تنفيذ تذكّرها خارج React، لأن:

- يُذكّر مُصرّف React مكوّنات React والخطافات فقط، وليس كل دالة
- تذكّر مُصرّف React لا يُشارك بين مكوّنات أو خطافات متعددة

فإن استُخدمت `expensivelyProcessAReallyLargeArrayOfObjects` في مكوّنات كثيرة مختلفة، حتى مع تمرير نفس العناصر تماماً، فسيُنفَّذ ذلك الحساب المكلف مراراً. ننصح [بالقياس بالملف الشخصي](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) أولاً لمعرفة ما إن كانت مكلفة فعلاً قبل تعقيد الشيفرة.
</DeepDive>

## هل أجرّب المُصرّف؟ {/*should-i-try-out-the-compiler*/}

نشجع الجميع على البدء بمُصرّف React. رغم أن المُصرّف ما زال إضافة اختيارية إلى React اليوم، فقد تتطلّب بعض الميزات مستقبلاً المُصرّف لتعمل بالكامل.

### هل استخدامه آمِن؟ {/*is-it-safe-to-use*/}

مُصرّف React مستقر الآن ومُختبَر على نطاق واسع في الإنتاج. رغم استخدامه في الإنتاج في شركات مثل Meta، فاعتماد المُصرّف في إنتاج تطبيقك يعتمد على صحة قاعدة الشيفرة لديك ومدى التزامك بـ [قواعد React](/reference/rules).

## ما أدوات البناء المدعومة؟ {/*what-build-tools-are-supported*/}

يمكن تثبيت مُصرّف React مع [عدة أدوات بناء](/learn/react-compiler/installation) مثل Babel وVite وMetro وRsbuild.

مُصرّف React في الأساس غلاف خفيف لإضافة Babel حول نواة المُصرّف، التي صُممت لتنفصل عن Babel نفسه. رغم أن الإصدار المستقر الأول للمُصرّف سيبقى أساساً إضافة Babel، نعمل مع فرق swc و[oxc](https://github.com/oxc-project/oxc/issues/10048) لبناء دعم من الدرجة الأولى لمُصرّف React حتى لا تحتاج لإعادة Babel إلى مسارات البناء مستقبلاً.

يمكن لمستخدمي Next.js تفعيل مُصرّف React المستدعى عبر swc باستخدام [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) فما فوق.

## ماذا أفعل بشأن useMemo وuseCallback وReact.memo؟ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

بشكل افتراضي، يُذكّر مُصرّف React شيفرتك بناءً على تحليله واستدلالاته. في أغلب الحالات يكون هذا التذكّر دقيقاً مثل ما كتبته أو أكثر.

لكن أحياناً يحتاج المطوّرون إلى تحكم أدق في التذكّر. يمكن الاستمرار في استخدام `useMemo` و`useCallback` مع مُصرّف React كمخرج طارئ لتحديد القيم المُذكَّرة. حالة شائعة هي إن كانت قيمة مُذكَّرة تُستخدم كتبعية لتأثير، لضمان عدم إطلاق التأثير مراراً حتى عندما لا تتغيّر تبعياته بمعنى جوهري.

للشيفرة الجديدة، ننصح بالاعتماد على المُصرّف للتذكّر واستخدام `useMemo`/`useCallback` حيث يلزم للتحكم الدقيق.

للشيفرة الموجودة، ننصح إما بإبقاء التذكّر الحالي (إزالته قد يغيّر مخرجات التجميع) أو الاختبار بعناية قبل إزالة التذكّر.

## جرّب مُصرّف React {/*try-react-compiler*/}

يساعدك هذا القسم على البدء بمُصرّف React وفهم استخدامه الفعّال في مشاريعك.

* **[التثبيت](/learn/react-compiler/installation)** — تثبيت مُصرّف React وضبطه لأدوات البناء لديك
* **[توافق إصدارات React](/reference/react-compiler/target)** — دعم React 17 و18 و19
* **[الإعداد](/reference/react-compiler/configuration)** — تخصيص المُصرّف لاحتياجاتك
* **[التبني التدريجي](/learn/react-compiler/incremental-adoption)** — استراتيجيات تفعيل المُصرّف تدريجياً في قواعد شيفرة قائمة
* **[التصحيح واستكشاف الأخطاء](/learn/react-compiler/debugging)** — تحديد المشكلات وإصلاحها عند استخدام المُصرّف
* **[تجميع المكتبات](/reference/react-compiler/compiling-libraries)** — أفضل الممارسات لشحن شيفرة مُجمَّعة
* **[مرجع واجهة البرمجة](/reference/react-compiler/configuration)** — توثيق تفصيلي لكل خيارات الإعداد

## موارد إضافية {/*additional-resources*/}

إضافةً إلى هذه الوثائق، ننصح بمراجعة [مجموعة عمل مُصرّف React](https://github.com/reactwg/react-compiler) لمزيد من المعلومات والنقاش حول المُصرّف.


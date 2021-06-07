---
id: concurrent-mode-adoption
title: اعتماد الوضع المتزامن (تجريبي)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

> تحذير:
>
> تصف هذه الصفحة **الميزات التجريبية التي لم تتوفر بعد في إصدار ثابت**. لا تعتمد على تصميمات React التجريبية في تطبيقات الإنتاج. قد تتغير هذه الميزات بشكل كبير ودون سابق إنذار قبل أن تصبح جزءًا من React.
>
> هذه الوثائق تهدف إلى تبني أوائل الناس والأشخاص الفضوليين. **إذا كنت جديدًا في React، فلا تقلق بشأن هذه الميزات** -- لست بحاجة إلى تعلمها الآن.

>Caution:
>
>All references below to "blocking mode" and `createBlockingRoot` are outdated and should be ignored.

</div>

- [Installation](#installation)
  - [Who Is This Experimental Release For?](#who-is-this-experimental-release-for)
  - [Enabling Concurrent Mode](#enabling-concurrent-mode)
- [What to Expect](#what-to-expect)
  - [Migration Step: Blocking Mode](#migration-step-blocking-mode)
  - [Why So Many Modes?](#why-so-many-modes)
  - [Feature Comparison](#feature-comparison)

## تنصيب {#installation}

يتوفر وضع التزامن فقط في [الإنشاءات التجريبية](/blog/2019/10/22/react-release-channels.html#experimental-channel) في React. لتثبيتها، قم بتشغيل:

```
npm install react@experimental react-dom@experimental
```

**لا توجد ضمانات الإدارة الدلالية لنُسخ البرمجيات في بناءات التجريبية.**
يمكن إضافة واجهات برمجة التطبيقات (APIs) أو تغييرها أو إزالتها مع أي إصدار `@experimental`.


**الإصدارات التجريبية ستتضمن تغييرات متكررة.**

يمكنك تجربة هذه الإنشاءات على المشاريع الشخصية أو في أحد الفروع، لكننا لا نوصي بتشغيلها في الإنتاج. في فيسبوك، نقوم *بتشغيلها* في الإنتاج، لكن ذلك لأننا أيضًا نقوم بإصلاح الأخطاء عندما ينتج عطب ما. لقد تم تحذيرك!

### لمن يكون هذا الإصدار التجريبي؟ {#who-is-this-experimental-release-for}

يهدف هذا الإصدار في المقام الأول إلى المتبنين في وقت مبكر، ومؤلفي المكتبات ، والأشخاص الفضوليين.

نحن نستخدم هذه الشفرة في الإنتاج (وهي مناسبة لنا) ولكن لا تزال هناك بعض الأخطاء والميزات المفقودة والفجوات في الوثائق. نود أن نسمع المزيد حول ما ينتج من مشاكل في الوضع المتزامن حتى نتمكن من إصلاحه لإصدار رسمي مستقر في المستقبل.

### تمكين الوضع المتزامن {#enabling-concurrent-mode}

عادة، عندما نضيف ميزات إلى React ،يمكنك البدء في استخدامها على الفور. الأجزاء (Fragments) والسياق (Context) وحتى الخطافات (Hooks) هم أمثلة على هذه الميزات. يمكنك استخدام الشيفرة الجديد دون إجراء أي تغييرات على الشيفرة الموجود.

الوضع المتزامن مختلف. أنه يقدم تغييرات دلالية على كيفية عمل React. خلاف ذلك، فإن [الميزات الجديدة](/docs/concurrent-mode-patterns.html) الممكَّنة به *لن تكون ممكنة*. لهذا السبب تم تجميعهم في "وضع" جديد بدلاً من إصدار واحد تلو الآخر في عزلة.

لا يمكنك الاشتراك في الوضع المتزامن على أساس الشجرة الفرعية. بدلاً من ذلك، للاشتراك، يتعين عليك القيام بذلك في المكان الذي تقوم بنداء فيه اليوم بـ `ReactDOM.render()`.

**سيمكن هذا الوضع المتزامن للشجرة بأكملها `<App/>`:**

```js
import ReactDOM from 'react-dom';

// If you previously had:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// You can opt into Concurrent Mode by writing:

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />);
```

> ملاحظة:
>
> واجهات برمجة التطبيقات للوضع المتزامن مثل `createRoot` الموجودة فقط في البناءات التجريبية لـ React.

في الوضع المتزامن، تعد أساليب دورة الحياة [التي تم تمييزها مسبقًا](/blog/2018/03/27/update-on-async-rendering.html) كـ"غير آمنة" فعلا *تكون* غير آمنة، وتؤدي إلى الأخطاء أكثر مما كانت عليه React اليوم. لا نوصي بتجربة الوضع المتزامنة حتى يكون التطبيق متوافقًا مع [Strict Mode](/docs/strict-mode.html).

## ماذا تتوقع {#what-to-expect}

إذا كان لديك تطبيق كبير موجود، أو إذا كان تطبيقك يعتمد على الكثير من حزم الطرف الثالث ، فالرجاء عدم توقع أنه يمكنك استخدام الوضع المتزامن على الفور. **على سبيل المثال، في Facebook، نستخدم "الوضع المتزامن" لموقع الويب الجديد ، لكننا لا نخطط لتمكينه على الموقع القديم.** وذلك لأن موقعنا القديم لا يزال يستخدم أساليب دورة حياة غير آمنة في شيفرة الإنتاج، مكتبات طرف ثالث غير متوافق، والأنماط التي لا تعمل بشكل جيد مع الوضع المتزامنة.

من خلال تجربتنا، فإن الشفرة التى تستخدم أنماط React الاصطلاحية ولا تعتمد على حلول إدارة الحالة الخارجية هو الأسهل لتشغيله في الوضع المتزامن. سنصف المشكلات الشائعة التي رأيناها والحلول الخاصة بها بشكل منفصل في الأسابيع المقبلة.

### خطوة الترحيل: وضع الحظر {#migration-step-blocking-mode}

بالنسبة لقواعد الشفرات القديمة، قد يكون الوضع المتزامن خطوة بعيدة جدًا. هذا هو السبب في أننا نقدم أيضًا "وضع الحظر" الجديد في بناءات React التجريبية. يمكنك تجربتها عن طريق استبدال `createRoot` بـ` createBlockingRoot`. إنه يقدم مجموعة *صغيرة* فقط من ميزات الوضع المتزامن، ولكنه أقرب إلى كيفية عمل React اليوم ويمكن أن يكون بمثابة خطوة ترحيل.


لكي نلخص:

* **الوضع القديم:** `ReactDOM.render (<App /> ، rootNode)`. هذا هو ما تستخدمه تطبيقات React اليوم. لا توجد خطط لإزالة الوضع القديم في المستقبل الذي يمكن ملاحظته - لكنه لن يكون قادرًا على دعم هذه الميزات الجديدة.
* **وضع الحظر:** `ReactDOM.createBlockingRoot(rootNode).render(<App/>)`. حاليا تحت التجربة. الغرض منه هو خطوة الترحيل الأولى للتطبيقات التي ترغب في الحصول على مجموعة فرعية من ميزات الوضع المتزامن.
* **الوضع المتزامن:** `ReactDOM.createRoot(rootNode).render(<App/>)`. حاليا تحت التجربة. في المستقبل، بعد استقراره، نعتزم جعله وضع React الافتراضي. يتيح هذا الوضع *جميع* الميزات الجديدة.

### لماذا العديد من الأوضاع؟ {#why-so-many-modes}

نعتقد أنه من الأفضل تقديم [إستراتيجية ترحيل تدريجي](/docs/faq-versioning.html#commitment-to-stability) بدلاً من إجراء تغييرات فادحة هائلة - أو السماح لـ React بالركود إلى غير ذي صلة.

من الناحية العملية، نتوقع أن تتمكن معظم التطبيقات التي تستخدم الوضع القديم من الانتقال إلى وضع الحظر على الأقل (إن لم يكن الوضع المتزامن). يمكن أن يكون هذا التجزئة مزعجًا بالنسبة للمكتبات التي تهدف إلى دعم جميع الأوضاع على المدى القصير. ومع ذلك، فإن نقل النظام الإيكولوجي تدريجياً بعيدًا عن Legacy Mode سيؤدي أيضًا إلى *حل* المشكلات التي تؤثر على المكتبات الرئيسية في نظام React، مثل [مربكة سلوك Suspense عند قراءة التخطيط](https://github.com/facebook/react/issues / 14536) و [عدم وجود ضمانات مجمعة متسقة](https://github.com/facebook/react/issues/15080). هناك عدد من الأخطاء التي لا يمكن إصلاحها في الوضع القديم دون تغيير الدلالات، ولكن لا توجد في أوضاع الحظر والتزامن.

يمكنك التفكير في وضع الحظر كإصدار "متدهور بأمان" من الوضع المتزامن. **نتيجة لذلك، في المدى الطويل، يجب أن نكون قادرين على التقارب والتوقف عن التفكير في أوضاع مختلفة تمامًا.** لكن في الوقت الحالي، تعد الوسائط استراتيجية ترحيل مهمة. يسمحون للجميع بتحديد متى يستحق الترحيل ، وترقيتهم وفقًا لسرعتهم الخاصة.

### مقارنة الميزة {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |الوضع القديم |وضع الحظر  |الوضع المتزامن |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: يحتوي الوضع القديم على مجموعة تلقائية في الأحداث التي تتم إدارتها بواسطة React، ولكنه يقتصر على مهمة المتصفح الواحيد. يجب أن تشترك الأحداث التي لا تتضمن React في استخدام `unstable_batchedUpdates`. في وضع الحظر و الوضع المتزامن، يتم تجميع جميع `setState` افتراضيًا.

\*\*: تحذيرات فى عملية تطوير.

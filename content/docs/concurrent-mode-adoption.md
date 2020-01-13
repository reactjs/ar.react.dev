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

**لا توجد ضمانات الإصدار الدلالي للبنيات التجريبية.**
يمكن إضافة واجهات برمجة التطبيقات (APIs) أو تغييرها أو إزالتها مع أي إصدار `@experimental`.


**الإصدارات التجريبية ستتضمن تغييرات متكررة.**

يمكنك تجربة هذه الإنشاءات على المشاريع الشخصية أو في أحد الفروع، لكننا لا نوصي بتشغيلها في الإنتاج. في فيسبوك، نقوم *بتشغيلها* في الإنتاج، لكن ذلك لأننا أيضًا هناك لإصلاح الأخطاء عندما ينكسر شيء ما. لقد تم تحذيرك!

### لمن يكون هذا الإصدار التجريبي؟ {#who-is-this-experimental-release-for}

يهدف هذا الإصدار في المقام الأول إلى المتبنين في وقت مبكر، ومؤلفي المكتبات ، والأشخاص الفضوليين.

نحن نستخدم هذه الشفرة في الإنتاج (وهو مناسب لنا) ولكن لا تزال هناك بعض الأخطاء والميزات المفقودة والفجوات في الوثائق. نود أن نسمع المزيد حول ما ينقطع في الوضع المتزامن حتى نتمكن من إعداده بشكل أفضل لإصدار رسمي مستقر في المستقبل.

### تمكين الوضع المتزامن {#enabling-concurrent-mode}

عادة، عندما نضيف ميزات إلى React، يمكنك البدء في استخدامها على الفور. الشظايا والسياق وحتى الخطافات هي أمثلة على هذه الميزات. يمكنك استخدام الكود الجديد دون إجراء أي تغييرات على الكود الموجود.

الوضع المتزامن مختلف. أنه يقدم تغييرات الدلالية على كيفية عمل React. خلاف ذلك، فإن [الميزات الجديدة](/docs/concurrent-mode-patterns.html) الممكَّنة به *لن تكون ممكنة*. لهذا السبب تم تجميعهم في "وضع" جديد بدلاً من إصدار واحد تلو الآخر في عزلة.

لا يمكنك الاشتراك في الوضع المتزامن على أساس الشجرة الفرعية. بدلاً من ذلك، للاشتراك، يتعين عليك القيام بذلك في المكان الذي تقوم بنداء فيه اليوم بـ `ReactDOM.render () `.

**سيمكن هذا الوضع المتزامن للشجرة بأكملها `<App/>`:**

```js
import ReactDOM from 'react-dom';

// If you previously had:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// You can opt into Concurrent Mode by writing:

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

> ملاحظة:
>
> واجهات برمجة التطبيقات للوضع المتزامن مثل `createRoot` موجودة فقط في البنى التجريبية لـ React.

في الوضع المتزامن، تعد أساليب دورة الحياة [التي تم تمييزها مسبقًا](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) باعتبارها "غير آمنة" في الواقع *تكون* غير آمنة، وتؤدي إلى الخلل أكثر مما كانت عليه في رد فعل اليوم. لا نوصي بتجربة وضع المتزامنة حتى يكون تطبيق [Strict Mode](https://reactjs.org/docs/strict-mode.html) متوافقًا.

## What to Expect {#what-to-expect}

If you have a large existing app, or if your app depends on a lot of third-party packages, please don't expect that you can use the Concurrent Mode immediately. **For example, at Facebook we are using Concurrent Mode for the new website, but we're not planning to enable it on the old website.** This is because our old website still uses unsafe lifecycle methods in the product code, incompatible third-party libraries, and patterns that don't work well with the Concurrent Mode.

In our experience, code that uses idiomatic React patterns and doesn't rely on external state management solutions is the easiest to get running in the Concurrent Mode. We will describe common problems we've seen and the solutions to them separately in the coming weeks.

### Migration Step: Blocking Mode {#migration-step-blocking-mode}

For older codebases, Concurrent Mode might be a step too far. This is why we also provide a new "Blocking Mode" in the experimental React builds. You can try it by substituting `createRoot` with `createBlockingRoot`. It only offers a *small subset* of the Concurrent Mode features, but it is closer to how React works today and can serve as a migration step.

To recap:

* **Legacy Mode:** `ReactDOM.render(<App />, rootNode)`. This is what React apps use today. There are no plans to remove the legacy mode in the observable future — but it won't be able to support these new features.
* **Blocking Mode:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. It is currently experimental. It is intended as a first migration step for apps that want to get a subset of Concurrent Mode features.
* **Concurrent Mode:** `ReactDOM.createRoot(rootNode).render(<App />)`. It is currently experimental. In the future, after it stabilizes, we intend to make it the default React mode. This mode enables *all* the new features.

### Why So Many Modes? {#why-so-many-modes}

We think it is better to offer a [gradual migration strategy](/docs/faq-versioning.html#commitment-to-stability) than to make huge breaking changes — or to let React stagnate into irrelevance.

In practice, we expect that most apps using Legacy Mode today should be able to migrate at least to the Blocking Mode (if not Concurrent Mode). This fragmentation can be annoying for libraries that aim to support all Modes in the short term. However, gradually moving the ecosystem away from the Legacy Mode will also *solve* problems that affect major libraries in the React ecosystem, such as [confusing Suspense behavior when reading layout](https://github.com/facebook/react/issues/14536) and [lack of consistent batching guarantees](https://github.com/facebook/react/issues/15080). There's a number of bugs that can't be fixed in Legacy Mode without changing semantics, but don't exist in Blocking and Concurrent Modes.

You can think of the Blocking Mode as a "gracefully degraded" version of the Concurrent Mode. **As a result, in longer term we should be able to converge and stop thinking about different Modes altogether.** But for now, Modes are an important migration strategy. They let everyone decide when a migration is worth it, and upgrade at their own pace.

### Feature Comparison {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Legacy Mode  |Blocking Mode  |Concurrent Mode  |
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

\*: Legacy mode has automatic batching in React-managed events but it's limited to one browser task. Non-React events must opt-in using `unstable_batchedUpdates`. In Blocking Mode and Concurrent Mode, all `setState`s are batched by default.

\*\*: Warns in development.

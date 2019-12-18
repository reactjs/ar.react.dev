---
id: concurrent-mode-intro
title: "تجريبي: مدخل إلى الوضع المتزامن (Concurent mode)"
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>احذر:
>
>تتناول هذه الصفحة **ميزات تجريبية [والتي ليست متوفّرة بعد](/docs/concurrent-mode-adoption.html) في في أيّ من الاصدارات المستقرّة**. ﻻ تعتمد على بُنيات تجريبية من React في تطبيقاتك الموجهة للإنتاج (Production apps). قد تواجه هذه المميزات تغييرات جذرية دون أي تحذير قبل أن تصبح جزءًا من React.
>
>هذا المستند موجّه للفضوليين ولمن يريد تجربة الممزات الجديدة. **إن كنت مبتدأ في React ﻻ تقلق بشأن هذه الميزات** -- ﻻ تحتاج إلى تعلّمها في الوقت الحالي.

</div>

توفّر هذه الصفحة لمحة نظرية عن الوضع المتزامن (Concurent Mode) **إن كنت تريد مقّدمة عمليّة، يجدر بك الإطلاع على:**

* [استعمال Suspense لجلب البيانات](/docs/concurrent-mode-suspense.html) تشرح آلية جديدة لجلب البيانات في مكوّنات React.
* [أنماط واجهات المستخدم المتزامنة (Concurrent UI Patterns)](/docs/concurrent-mode-patterns.html) تعرض بعض أنماط واجهات المستخدم أين يستعمل فيها الوضع المتزامن و Suspense.
* [تبنّي الوضع المتزامن](/docs/concurrent-mode-adoption.html) تشرح كيفية استعمال الوضع المتزامن في مشروعك.
* [واجهة الوضع المتزامن البرمجية (API reference)](/docs/concurrent-mode-reference.html) توثّق الواجهات البرمجية المستعملة في البنى التجربية.

## ماهو الوضع المتزامن? {#what-is-concurrent-mode}

الوضع المتزامن هو مجموعة من الميزات التي تجعل من تطبيقات React متجاوبة ومتأقلمة مع إمكانيات جهاز المستخدم ونوعيّة (سرعة) اتصاله بالشبكة.

هذه الميزات ﻻ زالت تجريبية وقابلة للتغيير. ولذلك ليست جزءًا من إصدارات React المستقرّة.

## التصصير الإعتراضي (Blocking) والتصيير القابل للمقاطعة (Interruptible) {#blocking-vs-interruptible-rendering}

**سنستعمل إدارة الإصدارات كمثال لشرح الوضع المتزامن.** عند العمل في فريق، على الأغلب ستستعملون برنامج إدارة النسخ مثل Git وستعملون على فروع (branches). يمكنك دمج الفرع عندما يصبح جاهزا مع الفرع الرئيسي master حتى يسحبه الآخرون.

كان مسار التطوير مختلفا جدا قبل نشأءة نظم إدارة النسخ، لم يكن هناك أي مفهوم للفروع. إن كنت تريد تعديل بعض الملفات، عليك أن تخبر الجميع بألا يلمسوها حتى تنهي عملك. ﻻ يمكنك حتى أن تبدأ في العمل عليها بالتزامن مع الشخص الذي *يعترضك* حرفيّا.

هذا ما يوضّح طريقة عمل مكتبات واجهات المستخدم بما فيها React. لمّا تشرع في تصصير تحديث ينجم عنه إنشاء عقد DOM وتشغيل الشيفرة داخل المكوّن، ﻻ يمكن مقاطعتها أثناء ذلك. سنسمّي هذا المفهوم "التصيير الإعتراضي".

في الوضع المتزامن، التصيير ليس إعتراضيا بل هو قابل للمقاطعة. هذا سيحسّن تجربة المستخدم. وسيفتح الباب لمزيد من الميزات التي لم تكن ممكنة من قبل. قبل أن ننظر إلى أمثلة حقيقيّة في [الفقرات](/docs/concurrent-mode-suspense.html) [القادمة](/docs/concurrent-mode-patterns.html)، سنلقي نظرة سطحيّة على الميزات الجديدة.

### التصيير القابل للمقاطعة {#interruptible-rendering}

Consider a filterable product list. Have you ever typed into a list filter and felt that it stutters on every key press? Some of the work to update the product list might be unavoidable, such as creating new DOM nodes or the browser performing layout. However, *when* and *how* we perform that work plays a big role.

A common way to work around the stutter is to "debounce" the input. When debouncing, we only update the list *after* the user stops typing. However, it can be frustrating that the UI doesn't update while we're typing. As an alternative, we could "throttle" the input, and update the list with a certain maximum frequency. But then on lower-powered devices we'd still end up with stutter. Both debouncing and throttling create a suboptimal user experience.

The reason for the stutter is simple: once rendering begins, it can't be interrupted. So the browser can't update the text input right after the key press. No matter how good a UI library (such as React) might look on a benchmark, if it uses blocking rendering, a certain amount of work in your components will always cause stutter. And, often, there is no easy fix.

**Concurrent Mode fixes this fundamental limitation by making rendering interruptible.** This means when the user presses another key, React doesn't need to block the browser from updating the text input. Instead, it can let the browser paint an update to the input, and then continue rendering the updated list *in memory*. When the rendering is finished, React updates the DOM, and changes are reflected on the screen.

Conceptually, you can think of this as React preparing every update "on a branch". Just like you can abandon work in branches or switch between them, React in Concurrent Mode can interrupt an ongoing update to do something more important, and then come back to what it was doing earlier. This technique might also remind you of [double buffering](https://wiki.osdev.org/Double_Buffering) in video games.

Concurrent Mode techniques reduce the need for debouncing and throttling in UI. Because rendering is interruptible, React doesn't need to artificially *delay* work to avoid stutter. It can start rendering right away, but interrupt this work when needed to keep the app responsive.

### Intentional Loading Sequences {#intentional-loading-sequences}

We've said before that Concurrent Mode is like React working "on a branch". Branches are useful not only for short-term fixes, but also for long-running features. Sometimes you might work on a feature, but it could take weeks before it's in a "good enough state" to merge into master. This side of our version control metaphor applies to rendering too.

Imagine we're navigating between two screens in an app. Sometimes, we might not have enough code and data loaded to show a "good enough" loading state to the user on the new screen. Transitioning to an empty screen or a large spinner can be a jarring experience. However, it's also common that the necessary code and data doesn't take too long to fetch. **Wouldn't it be nicer if React could stay on the old screen for a little longer, and "skip" the "bad loading state" before showing the new screen?**

While this is possible today, it can be difficult to orchestrate. In Concurrent Mode, this feature is built-in. React starts preparing the new screen in memory first — or, as our metaphor goes, "on a different branch". So React can wait before updating the DOM so that more content can load. In Concurrent Mode, we can tell React to keep showing the old screen, fully interactive, with an inline loading indicator. And when the new screen is ready, React can take us to it.

### Concurrency {#concurrency}

Let's recap the two examples above and see how Concurrent Mode unifies them. **In Concurrent Mode, React can work on several state updates *concurrently*** — just like branches let different team members work independently:

* For CPU-bound updates (such as creating DOM nodes and running component code), concurrency means that a more urgent update can "interrupt" rendering that has already started.
* For IO-bound updates (such as fetching code or data from the network), concurrency means that React can start rendering in memory even before all the data arrives, and skip showing jarring empty loading states.

Importantly, the way you *use* React is the same. Concepts like components, props, and state fundamentally work the same way. When you want to update the screen, you set the state.

React uses a heuristic to decide how "urgent" an update is, and lets you adjust it with a few lines of code so that you can achieve the desired user experience for every interaction.

## Putting Research into Production {#putting-research-into-production}

There is a common theme around Concurrent Mode features. **Its mission is to help integrate the findings from the Human-Computer Interaction research into real UIs.**

For example, research shows that displaying too many intermediate loading states when transitioning between screens makes a transition feel *slower*. This is why Concurrent Mode shows new loading states on a fixed "schedule" to avoid jarring and too frequent updates.

Similarly, we know from research that interactions like hover and text input need to be handled within a very short period of time, while clicks and page transitions can wait a little longer without feeling laggy. The different "priorities" that Concurrent Mode uses internally roughly correspond to the interaction categories in the human perception research.

Teams with a strong focus on user experience sometimes solve similar problems with one-off solutions. However, those solutions rarely survive for a long time, as they're hard to maintain. With Concurrent Mode, our goal is to bake the UI research findings into the abstraction itself, and provide idiomatic ways to use them. As a UI library, React is well-positioned to do that.

## Next Steps {#next-steps}

Now you know what Concurrent Mode is all about!

On the next pages, you'll learn more details about specific topics:

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) describes a new mechanism for fetching data in React components.
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) shows some UI patterns made possible by Concurrent Mode and Suspense.
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) explains how you can try Concurrent Mode in your project.
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) documents the new APIs available in experimental builds.

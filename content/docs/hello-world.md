---
id: hello-world
title: أهلًا بالعالم 
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

يبدو أصغر مثال في React كما يلي:


```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

يعرض هذا المثال ترويسةً تقول "أهلًا بالعالم!" في الصّفحة. 

[](codepen://hello-world)

اضغط على الرابط في الأعلى لفتح محرِّر عبر CodePen يحوي المثال السابق. خذ راحتك وعدل هذا المثال كما يحلو لك وراقب كيف تؤثر تعديلاتك على المخرجات. أغلب الصفحات في هذا الدليل ستحوي على أمثلة قابلة للتعديل مثل هذا المثال.

## كيف تقرأ هذا الدليل {#how-to-read-this-guide}

ستُمهِّد لك الأقسام القادمة تدريجيًّا كيفيّة استخدام React، وسنتعامل مع الكتل التي يتكوّن منها تطبيق React وهي العناصر (elements) والمُكوِّنات (Components). حالما تتقنها سيصبح بمقدورك إنشاء تطبيقات مُعقَّدة من قطع صغيرة قابلة لإعادة الاستخدام.

>ملاحظة
>
>هذا الدليل صمِّم من أجل الأشخاص الذين يفضلون تعلم المفاهيم النظرية خطوةً بخطوة. إن كنت تفضل التعلم بالممارسة، انتقل إلى [الدليل التطبيقي](/tutorial/tutorial.html). ستجد أنَّ هذا الدليل والدليل التطبيقي يكمِّل أحدهما الأخر.

This is the first chapter in a step-by-step guide about main React concepts. You can find a list of all its chapters in the navigation sidebar. If you're reading this from a mobile device, you can access the navigation by pressing the button in the bottom right corner of your screen.

Every chapter in this guide builds on the knowledge introduced in earlier chapters. **You can learn most of React by reading the “Main Concepts” guide chapters in the order they appear in the sidebar.** For example, [“Introducing JSX”](/docs/introducing-jsx.html) is the next chapter after this one.

## Knowledge Level Assumptions {#knowledge-level-assumptions}

React is a JavaScript library, and so we'll assume you have a basic understanding of the JavaScript language. **If you don't feel very confident, we recommend [going through a JavaScript tutorial](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) to check your knowledge level** and enable you to follow along this guide without getting lost. It might take you between 30 minutes and an hour, but as a result you won't have to feel like you're learning both React and JavaScript at the same time.

>Note
>
>This guide occasionally uses some of the newer JavaScript syntax in the examples. If you haven't worked with JavaScript in the last few years, [these three points](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) should get you most of the way.


## Let's Get Started! {#lets-get-started}

Keep scrolling down, and you'll find the link to the [next chapter of this guide](/docs/introducing-jsx.html) right before the website footer.



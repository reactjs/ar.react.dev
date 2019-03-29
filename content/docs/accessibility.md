---
id: accessibility
title: سهولة الوصول في React
permalink: docs/accessibility.html
---

## الفائدة من سهولة الوصول؟ {#why-accessibility}

سهولة الوصول للويب (Web accessibility) والتي يشار إليها أيضًا بالرمز [**a11y**](https://en.wiktionary.org/wiki/a11y)) هي تصميم وإنشاء مواقع يُمكِن استخدامها من قبل أي شخص. يكون دعم سهولة الوصول ضروريًّا للسماح للتقنيات المساعدة بالتعامل مع صفحات الويب.

تدعم React بشكلٍ كامل بناء مواقع سهلة الوصول، وذلك عن طريق استخدام تقنيات HTML المعياريّة عادةً.

## المعايير والتوجيهات {#standards-and-guidelines}

### WCAG {#wcag}

تزوّدنا [توجيهات سهولة الوصول لمحتوى الويب (Web Content Accessibility Guidelines)](https://www.w3.org/WAI/intro/wcag) بتوجيهات لإنشاء مواقع سهلة الوصول.

تعطينا القوائم التالية فكرة عامة حول ذلك:

- [قائمة التوجيهات المُقدَّمة من Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [قائمة التوجيهات المُقدَّمة من WebAIM](https://webaim.org/standards/wcag/checklist)
- [قائمة التوجيهات من مشروع A11Y](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

يحتوي مستند  [دليل سهولة الوصول - تطبيقات الإنترنت سهلة الوصول (Web Accessibility Initiative - Accessible Rich Internet Applications )](https://www.w3.org/WAI/intro/aria) على تقنيات لبناء أدوات ذكية في JavaScript سهلة الوصول بشكلٍ كامل.

انتبه إلى أنّ خاصيّات  `aria-*` في HTML ليست كلّها مدعومة بشكلٍ كامل في JSX. وفي حين أنّ معظم خاصيّات DOM تُكتَب في React بشكل camelCase، ينبغي كتابة خاصيّات `aria-*`‎ بحالة hyphen-cased (والتي تُعرَف أيضًا بحالة kebab-case، أو lisp-case، إلخ..) كما هي حالتها في HTML:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML الخاصة بدلالات الألفاظ (Semantic HTML) {#semantic-html}
وهي تهتم بتقديم المعنى الدلالي لكل عنصر من عناصر HTML بدلًا من الاهتمام فقط بما يُمثِّله هذا العنصر. وهي أساس سهولة الوصول في تطبيقات الويب.
حيث يُعطينا استخدام عناصر HTML المتنوعة لتعزيز المعنى الدلالي للمعلومات في مواقعنا سهولة للوصول بشكلٍ مجاني.

- [مرجع عناصر HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

أحيانًا نخرق دلالات HTML عندما نُضيف عناصر `<div>` إلى JSX لجعل شيفرة React تعمل، خاصّة عند التعامل مع القوائم (`<ol>`, `<ul>` و `<dl>`)  والجدول `<table>`.
 في هذه الحالات يجب أن نستخدم [الأجزاء (Fragments)](/docs/fragments.html) في React لتجميع عناصر متعددة معًا.

على سبيل المثال:

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

تستطيع تعيين مجموعة من العناصر إلى مصفوفة من الأجزاء (fragments) كما ستفعل مع أي نوع آخر من العناصر:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
		// يجب أن تمتلك الأجزاء أيضًا خاصية مفتاح عند تعيين المجموعات
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

عندما لا تحتاج أي خاصيّات ضمن الوسم Fragment تستطيع أيضًا استخدام [الصياغة المختصرة](/docs/fragments.html#short-syntax), إن كانت أدواتك تدعمها:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

للمزيد من المعلومات انظر إلى [توثيق الأجزاء في React](/docs/fragments.html).

## الحقول (Forms) سهلة الوصول {#accessible-forms}

### التسمية (Labeling) {#labeling}
يجب تسمية كل حقل في HTML، مثل `<input>` و `<textarea>`, بطريقة سهلة الوصول. يجب علينا تزويد تسميات وصفية تكون ظاهرة أيضًا للقارئين.

تُرينا المصادر التالية كيفية فعل ذلك:

- [شرح كيفيّة تسمية العناصر المُقدَّم من قبل W3C](https://www.w3.org/WAI/tutorials/forms/labels/)
- [شرح كيفيّة تسمية العناصر المُقدَّم من قبل WebAIM](https://webaim.org/techniques/forms/controls)
- [شرح الأسماء سهلة الوصول المُقدَّم من قبل مجموعة Paciello](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

على الرغم من أنّه يُمكِن استخدام ممارسات HTML المعيارية هذه بشكلٍ مباشر في React، لاحظ أنّ الخاصيّة `for` attribute تُكتَب بالشكل `htmlFor` في JSX:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### إخبار المستخدمين عن الأخطاء {#notifying-the-user-of-errors}

يجب أن تكون جميع حالات الأخطاء مفهومة من قبل جميع المستخدمين. يُرينا الرابط التالي كيفيّة إظهار نصوص الأخطاء إلى القارئين أيضًا:

- [شرح إشعارات المستخدمين المُقدَّم من قبل W3C](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [شرح التحقّق من الحقول المُقدَّم من قبل WebAIM](https://webaim.org/techniques/formvalidation/)

## التحكم من خلال تركيز الحقول {#focus-control}

احرص على أن يكون تطبيق الويب لديك سهل الوصول بشكلٍ كامل من خلال لوحة المفاتيح فقط:

- [شرح سهولة الوصول من لوحة المفاتيح المُقدَّم من قبل WebAIM](https://webaim.org/techniques/keyboard/)

### تركيز لوحة المفاتيح وحدود التركيز {#keyboard-focus-and-focus-outline}

يُشير تركيز لوحة المفاتيح إلى العنصر الحالي في DOM المُختار ليقبل الدّخل من لوحة المفاتيح. نشاهده كحد خارجي للتركيز مرسوم بشكل مشابه للحد في الصورة التالية:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

لا تستخدم CSS لإزالة هذا الحد الخارجي (مثلًا عن طريق تعيين `outline: 0`) إلّا إن كنتَ تضع بدلًا منه طريقة أخرى لحدود التركيز.

### آليات التخطي إلى المحتوى المطلوب {#mechanisms-to-skip-to-desired-content}

يجب تزويد آليات للسماح للمستخدمين بتخطي مقاطع التصفّح (navigation) في تطبيقك لأنّ هذا يُساعد ويُسرِّح التصفح من لوحة المفاتيح.

تكون روابط تخطي التصفّح أو روابط التخطي عبارة عن روابط تصفّح مخفيّة والتي تُصبِح ظاهرة فقط عندما يتفاعل مستخدمو لوحة المفاتيح مع الصفحة
من السهل تطبيقها باستخدام الروابط الداخلية للصفحة وبعض التنسيق:

- [شرح روابط تخطي التصفّح من WebAIM](https://webaim.org/techniques/skipnav/)

استخدم أيضًا عناصر النقاط العلام والأدوار مثل العنصرين `<main>` و `<aside>`, للإعلان عن مناطق من الصفحة كمناطق مفيدة مما يسمح للمستخدم بالانتقال بسرعة إلى هذه الأقسام.

اقرأ المزيد حول استخدام هذه العناصر لتعزيز سهولة الوصول من هنا:

- [نقاط علام سهلة الوصول](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### إدارة التركيز برمجيًّا {#programmatically-managing-focus}

تُعدِّل تطبيقات React بشكلٍ مستمر HTML DOM خلال زمن التنفيذ، مما يؤدي أحيانًا إلى فقدان تركيز لوحة المفاتيح أو تعيينها إلى عنصر غير متوقّع. 
نحتاج لإصلاح هذا إلى توجيه تركيز لوحة المفاتيح برمجيًّا بالاتجاه الصحيح. مثلًا عن طريق إعادة تعيين تركيز لوحة المفايتح إلى الزر الذي فتح النافذة بعد إغلاق تلك النافذة.

تشرح توثيقات الويب الخاصّة بشبكة مطوري Mozilla هذا الأمر وتصف كيف يمكننا بناء [أدوات مصغرة في JavaScript قابلة للتصفّح باستخدام لوحة المفاتيح](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

لتعيين التركيز في React نستطيع استخدام [Refs to DOM elements](/docs/refs-and-the-dom.html).

نُنشِئ في البداية مرجعًا إلى عنصر في JSX الموجودة ضمن مكوّن React من نوع صنف:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
	// إنشاء مرجع لتخزين عنصر textInput
    this.textInput = React.createRef();
  }
  render() {
  // استخدم رد النداء ref لتخزين مرجع إلى عنصر إدخال النص ضمن نسخة الحقل
  // مثلًا this.textInput
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

نستطيع بعدها التركيز في مكان آخر في مكوّننا عند الحاجة لذلك:

 ```javascript
 focus() {
  // التركيز على حقل الإدخال النصي باستخدام DOM API
  // ملاحظة: نصل إلى current للحصول على عقدة DOM الحالية
   this.textInput.current.focus();
 }
 ```

يحتاج المكوّن الأب أحيانًا إلى تعيين التركيز إلى مكوّن ابن. نستطيع فعل ذلك عن طريق [تعريض مراجع DOM للمكوّن الأب](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)
عبر خاصية مميزة في المكوّن الابن والتي تُمرِّر مرجع الأب إلى عقدة DOM للمكوّن الابن:

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// تستطيع الآن تعيين التركيز عند الحاجة إليه
this.inputElement.current.focus();
```

عند استخدام المكوّنات ذات الترتيب الأعلى لتمديد المكوّنات، فمن المفضّل[تمرير المرجع](/docs/forwarding-refs.html)  إلى المكوّن المغلّف باستخدام الدالة `forwardRef` في React. إن كان لا يعتمد المكوّن ذو الترتيب الأعلى المُقدَّم من طرف ثالث تمرير المراجع، فيُمكِن استخدام الطريقة السابقة كطريقة احتياطية.

من الأمثلة الرائعة حول إدارة التركيز مثال [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). وهو مثال نادر نسبيًّا عن نافذة سهلة الوصول بشكل كامل، فهي لا تُعيِّن فقط التركيز المبدئي على
زر الإلغاء  `cancel` (ممّا يمنع مستخدم لوحة المفاتيح من تفعيل الحدث `success` عن طريق الخطأ) وتحصر تركيز لوحة المفاتيح بداخل النافذة، بل تُعيد تعيين التركيز أيضًا إلى العنصر الذي أطلق هذه النافذة.

>ملاحظة:
>
>على الرغم من أنّ ميزة تركيز لوحة المفاتيح هي ميزة هامة لسهولة الوصول ولكن في نفس الوقت هي تقنية يجب استخدامها بحذر. استخدمها لإصلاح تركيز لوحة المفاتيح عند حدوث خطأ ما، ولكن لا تستخدمها لتتوقع كيف يريد المستخدم أن يتعامل مع التطبيق.


## أحداث المؤشر والفأرة{#mouse-and-pointer-events}

احرص على أن تكون جميع الوظائف المتوفرة عبر أحداث الفأرة أو المؤشر سهلة الوصول باستخدام لوحة المفاتيح لوحدها. يقود الاعتماد على المؤشر فقط إلى حالات لا يتمكّن فيها مستخدمو لوحة المفاتيح من استخدام تطبيقك.

لتوضيح ذلك فلننظر إلى مثال حول حصول خلل في سهولة الوصول بسبب أحداث الضغط click. يحتوي هذا المثال على نمط الضغط خارج النافذة حيث يستطيع المستخدم تعطيل النافذة المنبثقة المفتوحة عن طريق الضغط خارج العنصر:

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

يُنفَّذ هذا عن طريق إرفاق الحدث `click` بكائن النافذة `window` الذي يُغلِق النافذة المنبثقة:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

يعمل هذا بشكل جيّد للمستخدمين الذي يمتلكون أجهزة تأشير كالفأرة مثلًا، ولكن تقود تجربة هذا المثال من لوحة المفاتيح وحدها إلى وظيفة معطوبة عند الانتقال للعنصر التالي بسبب عدم استقبال 
الكائن `window` للحدث `click`. قد يؤدي هذا إلى منع المستخدمين من استخدام تطبيقك:

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

يُمكِن تحقيق نفس الوظيفة عن طريق استخدام مُعالِجات الأحداث المناسبة، مثل  `onBlur` و `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // نغلق النافذة المنبثقة بالنقرة التالية عن طريق استخدام التابع setTimeout
  // هذا ضروري لأننا نحتاج أولا من التحقق
  // ما إذا كان ابن آخر للعنصر قد استقبل التركيز
  // بسبب إطلاق الحدث blur قبل حدث التركيز الجديد
  
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // إن استقبل أي عنصر ابن التركيز فلا تغلق النافذة المنبثقة
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
	// تساعدنا React عن طريق مضاعفة أحداث blur و focus للمكون الأب
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

تُوفِّر هذه الشيفرة الوظيفة المطلوبة إلى مستخدمي المؤشر ولوحة المفاتيح بنفس الوقت. لاحظ أيضًا أنّنا أضفنا خاصيّات `aria-*` دعم المستخدمين الذين يقرؤون الشاشة.
ولغرض البساطة لم ننفذ أحداث لوحة المفاتيح لتمكين التفاعل بمفاتيح الأسهم `arrow key` مع خيارات النافذة المنبثقة:

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

هذا فقط مثال واحد من حالات متعدّدة التي يؤدي فيها الاعتماد فقط على أحداث المؤشر والفأرة إلى خلل بالوظيفة بالنسبة لمستخدمي لوحة المفاتيح. يكشف اختبار لوحة المفاتيح مباشرة المناطق التي فيها مشاكل والتي يمكن بعد ذلك إصلاحها باستخدام معالجات أحداث لوحة المفاتيح.

## أدوات مصغرة أكثر تعقيدًا {#more-complex-widgets}

لا يجب أن تعني تجربة المستخدم الأكثر تعقيدًا أن تصبح سهولة الوصول أقل. تُحقَّق سهولة الوصول ببساطة عن طريق كتابة شيفرة قريبة من HTML قدر الإمكان. يُمكِن كتابة أكثر الأدوات المُصغَّرة تعقيدًا بطريقة سهلة الوصول.

نحتاج هنا إلى معرفة [بأدوار ARIA](https://www.w3.org/TR/wai-aria/#roles) و [حالات وخاصيّات ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties).
أيضًا. وهي عبارة عن جداول تحتوي على خاصيّات HTML مدعومة بشكل كامل في JSX وتُمكِّننا من بناء مكوّنات React سهلة الوصول وذات وظيفة عالية الكفاءة.

يمتلك كل نوع من الأدوات المصغرة نمط تصميم خاص ومن المتوقع أن يعمل بطريقة معينة من قبل المستخدمين والعملاء مثل:

- [أساليب WAI-ARIA – أنماط التصميم والأدوات المصغرة](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [أمثلة Heydon Pickering – ARIA](https://heydonworks.com/practical_aria_examples/)
- [المكوّنات الداخلية](https://inclusive-components.design/)

## نقاط أخرى يجب أخذها بعين الاعتبار {#other-points-for-consideration}

### تعيين اللغة{#setting-the-language}

يجب أن تشير إلى لغة نصوص الصفحة لأنّ برامج قراءة الشاشة تستخدم هذا لتحديد إعدادات الصوت الصحيحة:

- [توثيقات اللغة – WebAIM](https://webaim.org/techniques/screenreader/#language)

### تعيين عنوان المستند {#setting-the-document-title}

عيّن عنوان المستند عن طريق العنصر `<title>`  بشكل صحيح ليصف محتوى الصفحة الحالية حيث يضمن ذلك أن يبقى المستخدم على دراية بمحتوى الصفحة الحالي:

- [فهم متطلبات عنوان المستند – WCAG](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

نستطيع تعيين العنوان في React باستخدام[مكوّن عنوان المستند](https://github.com/gaearon/react-document-title).

### تباين اللون {#color-contrast}

احرص على امتلاك النص القابل للقراءة تباين ألوان كافٍ ليبقى مقروءًا من قبل المستخدمين ضعيفي البصر:

- [فهم متطلبات تباين اللون – WCAG](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [كل شيء حول تباين اللون ولماذا يجب أن تعيد النظر فيه](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [ما هو التباين اللوني – مشروع A11y](https://a11yproject.com/posts/what-is-color-contrast/)

قد يكون من الممل حساب مجموعات الألوان المناسبة يدويًّا لجميع الحالات في موقعك، لذا تستطيع [حساب جميع الألوان باستخدام Colorable](https://jxnblk.com/colorable/).

تتضمّن أدوات aXe و WAVE التي سنشير إليها اختبارات لتباين الألوان وستُبلِّغ عن أخطاء التباين.

إن أردت تمديد قدرات اختبار التباين فبإمكانك استخدام هذه الأدوات:

- [التحقق من تباين الألوان – WebAIM](https://webaim.org/resources/contrastchecker/)
- [محلل تباين الألوان – مجموعة Paciello](https://www.paciellogroup.com/resources/contrastanalyser/)

## أدوات الاختبار والتطوير {#development-and-testing-tools}

هنالك عدد من الأدوات التي نستطيع استخدامها لمساعدتنا على إنشاء تطبيقات ويب سهلة الوصول.

### لوحة المفاتيح {#the-keyboard}

من أسهل وأهم الاختبارات التي يجب عليك القيام بها هي التحقق ما إذا كان كامل موقعك قابلًا للوصول والاستخدام عن طريق لوحة المفاتيح لوحدها. افعل ذلك عن طريق:

1. إزالة الفأرة لديك.
1. استخدام زر `Tab` و `Shift+Tab`  للتصفح.
1. استخدام زر `Enter` لتفعيل العناصر.
1. استخدام الأسهم للتفاعل مع بعض العناصر، مثل القوائم والقوائم المنسدلة.

### مساعد التطوير {#development-assistance}

نستطيع التحقق من بعض ميزات سهولة الوصول بشكل مباشر في شيفرة JSX. عادة تكون هذه التحققات متوفرة مسبقًا في أي مُحرِّر يحتوي على إضافات JSX من أجل أدوار ARIA، والحالات والخاصيّات. لدينا أيضًا إمكانية الوصول للأدوات التالية:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

تزوّدنا [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) من أجل ESLint بالتحقق من الأخطاء خاص بمشاكل سهولة الوصول في JSX. تسمح لك العديد من المُحرِّرات بتضمين هذه الموجودات بشكل مباشر في تحليل الشيفرة ونوافذ الشيفرة المصدرية.

يمتلك [Create React App](https://github.com/facebookincubator/create-react-app) هذه الإضافة مع مجموعة قواعد فرعية مُفعلة. إن أردت تمكين المزيد من قواعد سهولة الوصول فبإمكانك إنشاء الملف `.eslintrc` في المجلد الجذري للمشروع مع وضع هذا المحتوى بداخله:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### اختبار سهولة الوصول في المتصفح {#testing-accessibility-in-the-browser}

العديد من الأدوات الموجودة تنفذ اختبارات أداء لسهولة الوصول في صفحات الويب ضمن متصفحك. استخدمها مع أدوات التحقق من سهولة الوصول التي سنشير إليها الآن لأنّها فقط تختبر سهولة الوصول من الناحية التقنية في HTML:


#### aXe, aXe-core و react-axe {#axe-axe-core-and-react-axe}

توفّر لنا شركة Deque تقنية تُدعى [aXe-core](https://github.com/dequelabs/axe-core) من أجل اختبارات سهولة الوصول التلقائيّة لتطبيقاتنا. تتضمّن هذه الوحدة تكاملًا من أجل Selenium.

إنّ [ مُحرِّك سهولة الوصول](https://www.deque.com/products/axe/) أو aXe هو عبارة عن إضافة للمتصفح لكشف سهولة الوصول مبنية على تقنية `aXe-core`.

بإمكانك أيضًا استخدام الوحدة [react-axe](https://github.com/dylanb/react-axe) للتبليغ عن موجودات سهولة الوصول بشكل مباشر إلى الكونسول أثناء التطوير وتنقيح الأخطاء.

#### WebAIM WAVE {#webaim-wave}

[أداة تقييم سهولة الوصول للويب](https://wave.webaim.org/extension/) ، وهي عبارة عن إضافة أخرى للمتصفح.

#### مستكشفات سهولة الوصول وشجرة سهولة الوصول {#accessibility-inspectors-and-the-accessibility-tree}

[شجرة سهولة الوصول](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) هي عبارة عن مجموعة فرعية من شجرة DOM والتي تحتوي على كائنات سهلة الوصول لكل عنصر DOM والتي ينبغي تعريضها إلى تقنية مُساعِدة مثل قارئات الشاشة.

نستطيع بسهولة في بعض المتصفحات مشاهدة معلومات سهولة الوصول لكل عنصر في شجرة سهولة الوصول:

- [استخدام مستكشف سهولة الوصول في متصفح Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [تفعيل مستكشف سهولة الوصول في متصفح Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [استخدام مستكشف سهولة الوصول في متصفح OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### قارئات الشاشة {#screen-readers}

يجب أن يكون اختبار قارئات الشاشة جزءًا من اختبارات سهولة الوصول لديك.

يرجى الانتباه إلى وجود اختلافات عند الجمع بين قارئات شاشة مختلفة مع متصفحات مختلفة. لذا من الأفضل أن تختبر تطبيقك مع المتصفح الذي يُلائِم قارئات الشاشة التي تختارها.

### قارئات الشاشة الأشيع استخدامًا {#commonly-used-screen-readers}

#### NVDA في متصفح Firefox {#nvda-in-firefox}

[الوصول غير المرئي لسطح المكتب](https://www.nvaccess.org/) (NonVisual Desktop Access أو اختصارًا NVDA) هو عبارة عن قارئ شاشة مُستخدَم بشكلٍ كبير.

ارجع إلى المقالات التالية لمعرفة أفضل طريقة لاستخدام NVDA:

- [استخدام NVDA لتقييم سهولة الوصول للويب – شرح من موقع WebAIM](https://webaim.org/articles/nvda/)
- [اختصارات لوحة المفاتيح في NVDA – شرح من موقع Deque](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver في متصفح Safari {#voiceover-in-safari}

وهو عبارة عن قارئ شاشة مُدمَج في أجهزة Apple.

ارجع إلى المقالات التالية لمعرفة كيفيّة تفعيل واستخدام VoiceOver:

- [استخدام VoiceOver لتقييم سهولة الوصول للويب – شرح من موقع WebAIM](https://webaim.org/articles/voiceover/)
- [اختصارات لوحة مفاتيح نظام OS X في VoiceOver – شرح من موقع Deque](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [اختصارات نظام iOS في VoiceOver – شرح من موقع Deque](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS في متصفح Internet Explorer {#jaws-in-internet-explorer}

[الوصول للوظائف عن طريق الكلام](https://www.freedomscientific.com/Products/software/JAWS/) (Job Access With Speech أو اختصارًا JAWS)، وهو قارئ شاشة مُستخدَم على نظام ويندوز.

رجع إلى هذه الإرشادات حول كيفيّة استخدام JAWS:

- [استخدام JAWS لتقييم سهولة الوصول للويب – شرح من موقع WebAIM](https://webaim.org/articles/jaws/)
- [اختصارات لوحة المفاتيح في JAWS – شرح من موقع Deque](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### قارئات شاشة أخرى {#other-screen-readers}

#### ChromeVox في متصفح Chrome{#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) هو قارئ شاشة مُدمَج على أجهزة Chromebooks ومُتوفِّر [كإضافة](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) لمتصفّح Google Chrome.

ارجع إلى الإرشادات التالية حول كيفيّة استخدام ChromeVox:

- [استخدام قارئ الشاشة المُدمَج – دليل Chromebook من Google](https://support.google.com/chromebook/answer/7031755?hl=en)
- [مرجع اختصارات لوحة المفاتيح التقليدية في ChromeVox](https://www.chromevox.com/keyboard_shortcuts.html)

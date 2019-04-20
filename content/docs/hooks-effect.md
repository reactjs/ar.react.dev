---
id: hooks-state
title: استعمال خطاف التأثير
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف.

يمكِّن *خطاف التأثير (Effect Hook)* من إحداث تأثيرات جانبية (side effects) في مكونات دالة:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

هذا المثال معتمد على مثال [العداد المستقى من الصفحة السابقة](/docs/hooks-state.html)، ولكن أضفنا إليه ميزة جديدة هي ضبط عنوان الصفحة إلى رسالة مخصصة تتضمن عدد الضغطات.

جلب البيانات، وضبط اشتراك (subscription)، وتغيير شجرة DOM يدويًّا في مكونات React كلها أمثلة عن التأثيرات الجانبية. سواءً أكنت اعتدت على تسمية هذه العمليات "بالتأثيرات الجانبية" (أو "التأثيرات") فقط أم لا، فلا بد أنك قد نفَّذت هذه العمليات في مكوناتك مسبقًا.


>نصيحة
>
>إن كانت توابع دورة حياة الأصناف مألوفةً لديك، فيمكنك التفكير بالخطاف `useEffect` بأنه ناتج دمج `componentDidMount` و `componentDidUpdate` و `componentWillUnmount`.

هنالك نوعان شائعان للتأثيرات الجانبية في مكونات React هما: الأول هو تلك التي لا تتطلب تنفيذ عملية تنظيف، والثاني هو تلك التي تتطلب ذلك. دعنا نطلع عليهما بمزيد من التفصيل.

## تأثيرات بدون عملية تنظيف {#effects-without-cleanup}

نريد أحيانًا **تنفيذ بعض الشيفرات الإضافية بعد تحديث React شجرة DOM**. طلبيات الشبكة (Network requests)، والتعديلات اليدوية على DOM، والتسجيل (logging) هي أمثلةٌ شائعةٌ عن التأثيرات التي لا تتطلب إجراء تنظيف (cleanup)، وذلك لأنَّنا نستطيع تنفيذها ثم نسيان أمرها مباشرةً. إذًا، دعنا نوازن كيف تمكننا الأصناف والخطافات من التعبير عن مثل هذه التأثيرات الجانبية.

### مثال باستعمال الأصناف {#example-using-classes}

في مكونات صنف في React، التابع `render` نفسه لا يجب أن يسبِّب أي تأثيرات جانبية، إذ يكون ذلك مبكرًا جدًا. نريد عادةً تنفيذ التأثيرات الجانبية الخاصة بنا *بعد* تحديث React شجرة DOM.

هذا هو سبب وضع التأثيرات الجانبية في أصناف React ضمن `componentDidMount` و `componentDidUpdate`. بالعودة إلى مثالنا، إليك مكون صنفٍ عدادٍ في React يحدِّث عنوان الصفحة بعد تنفيذ React التغييرات في DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

لاحظ كيف **يتوجب علينا مضاعفة الشيفرة بين دورتي حياة هذين التابعين في الصنف**.  

هذا بسبب أنَّنا نريد في حالات عديدة تنفيذ نفس التأثير الجانبي بغض النظر عن ما إذا كان المكون قد وُصِلَ (mounted) للتو أو حُدِّث. نظريًّا، نريد أن يحدث ذلك بعد كل عملية تصيير (render)، ولكن مكونات صنف React لا تملك أي تابع يؤدي هذا الغرض. نستطيع استخراج تابع منفصل ولكن لا يزال يتوجب علينا استدعائه في موضعين.
من جهة أخرى.  
 
دعنا نرى كيف نستطيع القيام بالأمر نفسه باستعمال الخطاف `useEffect`.

### مثال باستعمال الخطافات {#example-using-hooks}

المثال التالي رأيناه في بداية هذه الصفحة، ولكن دعنا نلقِ نظرة قريبة عليه:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**ما الذي يفعله الخطاف `useEffect` ؟** باستعمال هذا الخطاف، أنت تخبر React بأنَّ مكونك يحتاج إلى تنفيذ أمر ما بعد عملية التصيير. ستتذكر React الدالة التي مررتها (سنشير إليها بأنَّها "التأثير" [effect] الخاص بنا)، وتستدعيها لاحقًا بعد إجراء تحديث على DOM. نضبط في هذا التأثير عنوان الصفحة، ولكن يمكننا أيضًا تنفيذ عملية جلب بياناتٍ أو استدعاء واجهة برمجية أمرية (imperative API) أخرى.

**لماذا يُستدعَى `useEffect` داخل مكون؟** وضع `useEffect` داخل المكون يمكننا من الوصول إلى متغير الحالة count (أو أية خاصية) بشكل صحيح من التأثير. لا نحتاج إلى واجهة برمجية خاصة لقراءته، إذ يكون ضمن مجال الدالة مسبقًا. تتبنى الخطافات مفهوم مغلفات JavaScript (أي JavaScript closures) وتتجنب تعريف واجهات React برمجية مخصصة، إذ وفرت JavaScript حلًا مسبقًا.

**هل يُنفَّذ الخطاف useEffect بعد كل عملية تصيير؟** نعم. افتراضيًّا، يُنفَّذ بعد أول عملية تصيير وبعد كل عملية تحديث. (سنتحدث لاحقًا عن [كيفية تخصيص ذلك](#tip-optimizing-performance-by-skipping-effects).) بدلًا من التفكير من ناحية الوصل (mounting) والتحديث (updating)، ربما تجد أنَّه من السهل التفكير بأنَّ تلك التأثيرات تحدث "بعد التصيير". تضمن React بأنَّ شجرة DOM قد حُدِّثَت في الوقت الذي تُنفِّذ فيه التأثيرات.

### تفصيل أوسع {#detailed-explanation}

لآن وبعد التعرف على التأثيرات، يجب أن تصبح أسطر الشيفرة التالية مفهومةً لك:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

صرَّحنا عن متغير الحالة `count`، وأخبرنا بعدئذٍ React أننا نحتاج إلى استعمال تأثير. مرَّرنا دالةً إلى الخطاف `useEffect` والتي تمثِّل التأثير الخاص بنا. داخل هذا التأثير، ضبطنا عنوان الصفحة باستعمال الواجهة البرمجية `document.title` للمتصفح. يمكننا الآن قراءة أحدث قيمة للمتغير `count` داخل التأثير لأنَّه يتوضع داخل نطاق الدالة. عندما تصيِّر React المكون الخاص بنا، ستتذكر التأثير الذي استعملناه ثم ستُنفِّذ هذا التأثير بعد تحديث DOM. هذا يحدث من أجل كل عملية تصيير بما فيها عملية التصيير الأولى.

قد يلاحظ مطورو JavaScript المتمرسون أنَّ الدالة التي مررناها إلى الخطاف `useEffect` ستكون مختلفة في كل عملية تصيير. صحيح، فهذا الأمر متعمَّد، إذ هذا، في الحقيقة، هو الذي يمكننا من قراءة قيمة `count` من داخل التأثير دون القلق من تقادمها. في كل مرة نكرِّر فيها عملية التصيير، نجدول تأثيرًا جديدًا باستبدال التأثير السابق. بطريقةٍ ما، هذا يجعل التأثير يتصرف بطريقة أشبه بكونه جزءًا من ناتج عملية التصيير، إذ كل تأثير "يتبع" إلى عملية تصيير محدَّدة. سنلقِ نظرة تفصيلية عن سبب كون هذا السلوك مفيدًا في قسم لاحق من هذه الصفحة.

>نصيحة
>
>بخلاف `componentDidMount` أو `componentDidUpdate`، التأثيرات المجدولة مع `useEffect` لا تحجز المتصفح من تحديث الصفحة مما يزيد من تجاوبية تطبيقك. أغلبية التأثيرات لا تحتاج إلى تحدث بشكل متزامن. في الحالات النادرة التي تحدث فيها (مثل ضبط التخطيط [measuring the layout])، يوجد خطاف منفصل يدعى [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) مع واجهة برمجية مماثلة للخطاف `useEffect`.

## تأثيرات مع عملية تنظيف {#effects-with-cleanup}

فيما سبق، اطلعنا على كيفية عمل التأثيرات الجانبية التي لا تتطلب أية إجراءات تنظيف. على أي حال، هنالك بعض التأثيرات التي تتطلب ذلك؛ على سبيل المثال، **ربما كنا نريد ضبط اشتراك** إلى بعض موارد البيانات الخارجية. في هذه الحالة، من الضروري إجراء عملية تنظيف، وبذلك لا نتسبَّب في حدوث تسريب في الذاكرة (memory leak). دعنا نوازن كيفية القيام بذلك مع الأصناف ومع الخطافات.

### مثال باستعمال الأصناف {#example-using-classes-1}

في صنف React، ستحتاج عادةً إلى ضبط أي اشتراك في `componentDidMount`، وإجراء عملية التنظيف في `componentWillUnmount`. على سبيل المثال، دعنا نفترض أنَّه لدينا الوحدة `ChatAPI` التي تمكننا من الاشتراك بحالة اتصال صديق (friend’s online status). إليك كيفية إجراء ذلك وإظهار تلك الحالة باستعمال صنف:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

لاحظ كيف يحتاج `componentDidMount` و `componentWillUnmount` إلى أن يعكس كل منهما الآخر. تجبرنا توابع دورة الحياة (Lifecycle methods) بفصل هذه الشيفرة رغم أنَّ الشيفرة من الناحية النظرية في كليهما متعلقة بنفس التأثير.

>ملاحظة
>
>قد تلاحظ عمليات التصيير الدقيقة (Eagle-eyed readers) أنَّ هذا المثال يحتاج أيضًا إلى التابع `componentDidUpdate` ليكون صحيحًا بالمجمل. سنتغاضى عن هذا الأمر الآن ولكن سنعود إليه في [قسم أخر لاحق](#explanation-why-effects-run-on-each-update) من هذه الصفحة.

### مثال باستعمال الخطافات {#example-using-hooks-1}

دعنا نرى كيف يمكننا كتابة هذا المكون باستعمال الخطافات.

قد تفكر أنَّنا نحتاج إلى تأثير منفصل لتنفيذ عملية التنظيف، ولكننا في الحقيقة لا نحتاج إلى ذلك، إذ شيفرة إضافة وإزالة اشتراك مرتبطة بإحكام بالخطاف `useEffect` المصمم لإبقائهما في كيان واحد. إن كان التأثير الخاص بك يعيد دالة، فستُنفِّذها React عندما يحين وقت إجراء التنظيف:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**لماذا أعدنا دالة من التأثير؟** هذا السلوك هو آلية اختيارية لإجراء عملية تنظيف للتأثيرات.قد يعيد كل تأثير دالةً مهمتها إجراء عملية تنظيف خلفه. هذا يمكننا من إبقاء شيفرة إضافة وإزالة الاشتراكات قريبةً من بعضها بعضًا، إذ كلٌّ منهما جزءٌ من التأثير نفسه.

**متى تجري React عملية تنظيف للتأثير؟** تنفِّذ React عملية التنظيف عندما يجري فصل (unmount) المكون. على أي حال وكما تعلمنا سابقًا، تُنفَّذ التأثيرات في كل عملية تصيير وليس مرةً واحدةً. هذا هو سبب تنفيذ React عملية تنظيف للتأثيرات أيضًا من عملية التصيير السابقة قبل تنفيذ التأثير في المرة اللاحقة. سنناقش لاحقًا سبب مساعدة هذا الأمر [بتجنب حصول أخطاء](#explanation-why-effects-run-on-each-update) وكيفية [تجنب هذا السلوك في حال تسبب بمشاكل متعلقة بالأداء](#tip-optimizing-performance-by-skipping-effects).

>ملاحظة
>
>لا يتوجب علينا إعادة دالة مسماة من التأثير. لقد أطلقنا عليها `cleanup` هنا لتوضيح وظيفتها، ولكن يمكنك أن تعيد دالة سهمية أو تطلق عليها أي اسم آخر.

## الخلاصة {#recap}

تعلمنا إلى الآن أنَّ الخطاف `useEffect` يمكِّننا من التعبير عن مختلف أنواع التأثيرات الجانبية بعد تنفيذ عمليات تصيير لمكون. قد تتطلب بعض التأثيرات إجراء عملية تنظيف، لذا تعيد دالة:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

بينما قد لا تتطلب تأثيرات أخرى إجراء عملية تنظيف، فلا تعيد آنذاك أي شيء:

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

يوحِّد خطاف التأثير كلا الحالتين السابقتين في واجهة برمجية واحدة.

-------------

**إن كنت تشعر أنَّ لديك معرفة جيدة بكيفية عمل خطافات التأثير، أو إن كنت تشعر بالإرهاق والغرق في كم هائل من المعلومات، فيمكنك الآن الانتقال إلى الصفحة التالية:  ["قواعد استعمال الخطافات"](/docs/hooks-rules.html).**

-------------

## نصائح لاستعمال التأثيرات {#tips-for-using-effects}

سنكمل هذه الصفحة بإلقاء نظرة تفصيلية على بعض نواحي الخطاف `useEffect` التي قد يكون مستخدمو React الخبيرون متشوقين للاطلاع عليها. لا تجبر نفسك بالاطلاع عليها الآن. يمكنك في أي وقت العودة إلى هذه الصفحة لتعلُّم تفاصيل أوسع عن خطاف التأثير.

### نصيحة: استعمال تأثيرات متعددة لفصل الشيفرات ذات الصلة {#tip-use-multiple-effects-to-separate-concerns}

إحدى المشكلات التي أشرنا إليها في قسم " [الحافز](/docs/hooks-intro.html#complex-components-become-hard-to-understand) لإضافة الخطافات" هي أنَّ توابع دورة حياة صنف تحوي غالبًا شيفرةً غير مترابطة، ولكنَّ الشيفرة المترابطة تقسَّم إلى توابع متعددة. إليك مكون يدمج العداد ومؤشر حالة الصديق من الأمثلة السابقة:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

لاحظ كيف أنَّ الشيفرة التي تضبط `document.title` تنقسم بين `componentDidMount` و `componentDidUpdate`. شيفرة الاشتراك تتوزع أيضًا على `componentDidMount` و `componentWillUnmount`. ويحوي `componentDidMount` شيفرة لكلا المهمَّتين.  

لذلك، كيف يمكن للخطافات أن تحل هذه المشكلة؟ بشكل مشابه لتمكنك من [استعمال خطاف *الحالة* أكثر من مرة واحدة](/docs/hooks-state.html#tip-using-multiple-state-variables)، يمكنك أيضًا استعمال عدة تأثيرات. هذا يمكِّننا من فصل الشيفرة الغير مترابطة إلى تأثيرات مختلفة:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**تسمح الخطافات بفصل الشيفرة بناءً على وظيفتها** بدلًا من اسم تابع دورة الحياة. ستطبق React كل تأثير استُعمِل عبر المكون وفقًا للترتيب الذي عُرِّف به.

### شرح: لماذا تُنفَّذ التأثيرات على كل تحديث {#explanation-why-effects-run-on-each-update}

إن كنت معتادًا على الأصناف، فقد تتساءل عن سبب حدوث مرحلة التنظيف في التأثيرات بعد كل عملية إعادة تصيير، وليس مرةً واحدةً أثناء الفصل (unmounting). دعنا نشرح بمثال عملي لماذا يساعدنا هذا السلوك بإنشاء مكونات مع نسبة أخطاء أقل.

[فيما سبق من هذه الصفحة](#example-using-classes-1)، عرَّفنا مثالًا يحوي المكون `FriendStatus` الذي يظهر إذا كانت حالة صديق "متصل" أم "غير متصل". يقرأ الصنف الخاص بنا الخاصية `friend.id` من `this.props`، ثم يشترك بحال الصديق بعد وصل المكون، ثم يلغي الاشتراك أثناء عملية الفصل:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

***لكن ماذا يحدث إن تغيَّرت خاصية `friend`*** أثناء عرض المكون على الشاشة. سيستمر المكون الخاص بنا بإظهار حالة الاتصال لصديق مختلف، وهذا بالتأكيد خطأ. أضف إلى ذلك أنَّنا سنتسبَّب بحدوث تسريب في الذاكرة أو انهيار العملية أثناء الفصل، إذ سيستعمل استدعاء إلغاء الاشتراك معرِّف صديق خطأ.  

في مكون صنف، سنحتاج إلى إضافة `componentDidUpdate` لمعالجة هذه الحالة:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

نسيان المعالج `componentDidUpdate` هو مصدر شائع لحصول أخطاء منطقية في تطبيقات React.  

افترض الآن نسخة أخرى مشابهة لهذا المكون ولكن تستعمل الخطافات:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

لا تحوي هذه الشيفرة أي أثر للخطأ السابق. (ولكن لم نجرِ أية تغييرات لها في نفس الوقت.)  

ليس هنالك أية شيفرة خاصة لمعالجة التحديثات بسبب أنَّ الخطاف `useEffect` يعالجها افتراضيًّا، إذ ينظف التأثيرات السابقة قبل تطبيق التأثيرات اللاحقة. لتوضيح هذا الأمر، إليك سلسلة من استدعاءات الاشتراك وإلغاء الاشتراك التي يمكن للمكون أن يولدها مع مرور الوقت:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

يتأكد هذا السلوك تناسق وتطابق الاستدعاءات في الشيفرة بشكل افتراضي ويمنع حصول أية أخطاء شائعة الظهور في مكونات الصنف نتيجة نسيان عملية التحديث.

### نصيحة: حسين الأداء عبر تخطي التأثيرات {#tip-optimizing-performance-by-skipping-effects}

في بعض الحالات، تنظيف أو تطبيق التأثير بعد كل عملية تصيير قد يبطِّئ الأداء. في مكونات صنف، يمكننا حل هذه المشكلة عبر كتابة موازنة إضافية باستعمال `prevProps` أو `prevState` داخل `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```


الشيء الجيد أنَّ هذا الأمر مأخوذ بالحسبان ومضمن داخل واجهة الخطاف `useEffect` البرمجية. يمكنك أن تخبر React *بتخطي* تطبيق تأثير إن لم تتغير قيم محدَّدة بين عمليتي تصيير أو أكثر. ولفعل ذلك، مرِّر مصفوفة كوسيطٍ ثانٍ اختياري إلى الخطاف `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

في المثال أعلاه، مرَّرنا `[count]` كوسيط ثانٍ. ولكن، ما الذي يعني تمرير مثل هذه القيمة؟ إن أصبحت قيمة المتغير `count` هي `5`، وأُعيد تصيير المكون مع المتغير `count` الذي لا تزال قيمته ثابتة (أي `5`)، فستوازن React آنذاك القيمة `[5]` الناتجة من عملية التصيير السابقة مع القيمة `[5]` الناتجة من عملية التصيير التالية. لمَّا كانت القيمتان في المصفوفة متساويتين (أي `5 === 5` محقق)، ستتخطى React التأثير. هذا الأمر مفيد جدًا في تحسين الأداء.  

عندما تجرى عملية التصيير مع تغير القيمة `count` إلى `6`، ستوازن React بين العناصر في المصفوفة `[5]` من عملية التصيير السابقة مع العناصر في المصفوفة `[6]` من عملية التصيير التالية؛ هذه المرة، ستعيد React تطبيق التأثير لأنَّ `5 لا تساوي 6` (أي 5 === 6 غير محقق). إن كان هنالك عدة عناصر (وليس عنصرًا واحدًا كما في حالتنا)، ستعيد React تنفيذ التأثير متى ما اختلفت قيمة أحد العناصر فقط.

هذا السلوك متاحٌ أيضًا من أجل التأثيرات التي تجري عمليات تنظيف:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

مستقبلًا، قد يضاف هذا الوسيط الثاني تلقائيًّا عبر تحول مبني على الوقت (build-time transformation).

>ملاحظة
>
>إذا كنت تستخدم تحسين الأداء هذا، فتأكد من أن المصفوفة تشمل ***جميع القيم من نطاق المكون (مثل الخاصيات (props) أو الحالة (state)) التي تتغير بمرور الوقت والتي يتم استخدامها بواسطة التأثير***. وإلا ، فإن الرمز الخاص بك سوف يشير إلى القيم التي لا معنى لها من الإصدارات السابقة. تعرف على المزيد [حول كيفية التعامل مع الوظائف](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)و[ماذا تفعل عندما يتغير المصفوفة كثيرًا](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>إن أردت تنفيذ تأثيرٍ ثمَّ تنظيفه مرةً واحدةً فقط (عند الوصل والفصل)، يمكن تمرير مصفوفة فارغة (أي []) كمعاملٍ ثانٍ، إذ هذا يخبر React أنَّ التأثير لا يعتمد على أية قيم من الخاصيات (props) أو الحالة (state)؛ لذلك، فهو لا يحتاج إلى إعادة التنفيذ على الإطلاق. لا يعامل هذا الأمر على أنَّه حالة خاصة - و إنما يتبع مباشرة كيف تعمل مصفوفة المدخلات دائما. 
>
>إذا قمت بتمرير مصفوفة فارغة ([]) ، فستكون دائمًا الخاصيات (props) أو الحالة (state) داخل التأثير لها قيمها الأولية. أثناء اجتياز [] لأن الوسيطة الثانية أقرب إلى النموذج الذهني المألوف `ComponentDidMount` و `componentWillUnmount` ، عادة ما تكون هناك [حلول](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) [أفضل](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) لتجنب إعادة تشغيل التأثيرات كثيرًا. أيضًا ، لا تنسَ أن React defers قيد التشغيل `useEffect` حتى بعد رسم المتصفح ، لذا فإن القيام بعمل إضافي يمثل مشكلة أقل.
>
>نوصي باستخدام قاعدة [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) كجزء من حزمة خطاطيف [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). فهو يحذر عندما يتم تحديد التبعيات بشكل غير صحيح ويقترح إصلاح.

## الخطوات التالية {#next-steps}

مبارك لك! كانت هذه الصفحة طويلة ولكن تحمل في طيَّاتها أجوبةً على أسئلتك. تعملت إلى الآن خطاف الحالة وخطاف التأثير، والآن يمكنك فعل الكثير من الأشياء باستعمالهما سويةً، إذ يشملان أغلب حالات استعمال الأصناف؛ في الحالات التي لا تجد فيهما ضالتك، يمكن أن تبحث في صفحة [الخطافات الإضافية](/docs/hooks-reference.html) فربما تجدها هنالك.

أضف إلى ذلك أنَّنا بدأنا نرى كيف بإمكان الخطافات حل مشكلات ذُكرَت في القسم ["الحافز وراء إضافة الخطافات"](/docs/hooks-intro.html#motivation). وجدنا أيضًا كيف أن عملية تنظيف التأثير تلغي أية تكرارات في `componentDidUpdate` و `componentWillUnmount` وتجمع الشيفرة المترابطة وتجعلها قريبةً من بعضها بعضًا، وتساعد في تجنب حصول أخطاء. رأينا أيضًا كيف يمكننا فصل التأثيرات بحسب وظيفتها، وهذا الأمر لا يمكننا فعله في الأصناف مطلقًا.

إلى هذا الحد، قد تتساءل عن كيفية عمل الخطافات، وكيف تستطيع React أن تعرف أي استدعاء للخطاف `useState` يقابل أي متغير حالة بين عمليات التصيير، وكيف تطابق React التأثيرات السابقة واللاحقة في كل تحديث؟ ***في الصفحة التالية سنتعلم حول قواعد الخطافات، إذ هي ضرورية لجعل الخطافات تعمل بشكل صحيح***.

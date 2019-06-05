---
id: uncontrolled-components
title: المكونات غير المضبوطة
permalink: docs/uncontrolled-components.html
---

نُفضِّل في معظم الحالات استخدام [المُكوّنات المضبوطة](/docs/forms.html) من أجل حقول الإدخال، ففي المُكوّنات المضبوطة يتعامل مُكوّن React مع بيانات الحقول. البديل لها هو المُكوّنات غير المضبوطة والتي يتعامل فيها DOM مع بيانات الحقول.

لكتابة مُكوّن غير مضبوط بدلًا من كتابة معالج أحداث لكل تحديث للحالة، فبإمكانك [استخدام المراجع](/docs/refs-and-the-dom.html) للحصول على قيم الحقول من DOM.

مثلًا تقبل هذه الشيفرة اسمًا واحدًا في المُكوّن غير المضبوط:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('قُدِّم اسم : ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="تقديم الاسم" />
      </form>
    );
  }
}
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010).

لما كان المُكوّن غير المضبوط يحتفظ بمصدر الحقيقة ضمن DOM، فمن الأسهل أحيانًا دمج شيفرة React مع أي شيفرة أخرى عند استخدام المُكوّنات غير المضبوطة. قد يؤدي ذلك أيضًا إلى كتابة شيفرة أقل إن كانت تهمك السرعة. أما في غير ذلك فيجب عادةً استخدام المُكوّنات المضبوطة.

إن كنتَ لا تزال غير متأكد من نوع المُكوّن الذي يجب استخدامه لحالة محددة، فقد تجد [هذه المقالة](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) مفيدة.

### القيم الافتراضية {#default-values}

في دورة حياة تصيير React تتجاوز قيمة الخاصية `value` لعناصر الحقول القيمة الموجودة في DOM. ترغب عادة في المُكوّنات غير المضبوطة أن تُحدِّد React القيمة المبدئية، ولكن بنفس الوقت أن تترك التحديثات التالية غير مضبوطة. للتعامل مع هذه الحالة يمكنك تحديد الخاصية `defaultValue` بدلًا من `value`:

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="محمد علي"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="تقديم الاسم" />
    </form>
  );
}
```

يدعم العنصران `<input type="checkbox">`  و `<input type="radio">`‎ الخاصية `defaultChecked`. ويدعم العنصران `<select>` و `<textarea>` الخاصية `defaultValue`.

## عنصر إدخال الملفات {#the-file-input-tag}

يُتيح العنصر `<input type="file">` في HTML للمستخدم اختيار ملف أو أكثر من جهازه لتحميلها والتعامل معها من خلال JavaScript عبر واجهة برمجة الملفات [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

يُعدُّ العنصر ‎`<input type="file" />`‎ في React دوما مكونًا غير منضبط لأنّ قيمته لا يُمكِن تعيينها إلّا عن طريق المستخدم وليس برمجيًّا. يجب عليك استخدام واجهة برمجة الملفات للتعامل مع الملفات. يُظهِر المثال التالي كيفية [إنشاء مرجع إلى عقدة DOM](/docs/refs-and-the-dom.html) للوصول إلى الملفات من خلال دالة التعامل مع تقديم الحقول (Submit):

```javascript
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${
        this.fileInput.current.files[0].name
      }`
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <label>

          تحميل الملف:


          <input type="file" ref={this.fileInput} />

        </label>

        <br />

        <button type="submit">تقديم الطلب</button>

      </form>
    );
  }
}

ReactDOM.render(
  <FileInput />,
  document.getElementById('root')
);
```
[جرّب المثال على موقع CodePen.](codepen://uncontrolled-components/input-type-file)


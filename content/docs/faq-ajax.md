---
id: faq-ajax
title: AJAX و APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---
 
### كيف يمكنني إجراء استدعاء بواسطة AJAX؟ {#how-can-i-make-an-ajax-call}

بإمكانك استخدام أي مكتبة AJAX تريدها مع React. من المكتبات الشائعة هنالك [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), والمكتبة المُضمَّنة مع المتصفح والتي تُدعى [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### في أي تابع من توابع دورة الحياة يجب عليّ إجراء استدعاء AJAX؟ {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

يجب عليك الحصول على البيانات عن طريق استدعاء AJAX في تابع دور الحياة [`componentDidMount`](/docs/react-component.html#mounting).  وهذا لكي تستطيع استخدام التابع  `setState` لتحديث مكوّنك عند استقبال البيانات.

### مثال: استخدام نتائج AJAX لتعيين الحالة المحلية {#example-using-ajax-results-to-set-local-state}

يُوضّح المكوّن التالي كيفيّة إجراء استدعاء AJAX ضمن التابع `componentDidMount` لتعيين الحالة المحليّة للمكوّن. 

تُعيد واجهة برمجة التطبيق في هذا المثال كائن JSON مشابه لما يلي:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
       	// ملاحظة: من الهام التعامل مع الأخطاء هنا
        // catch() بدلًا من من استخدام الكتلة 
        // لكي لا نقبل الاستثناءات من أخطاء فعليّة في المكوّنات
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

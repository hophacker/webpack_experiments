var component = require('./component');
var app = document.createElement('div');
require('./index.css');

document.body.appendChild(app);

app.appendChild(component());

<h1>Test Assignment</h1>
<br>
<blockquote>
A small production-ready web server.
It can be hosted in a public GitHub/GitLab repository.
No deployment is needed.
Stack: <em>Typescript</em>, <em>Postgres</em> (without <em>ORM</em>), <em>Redis</em>.
</blockquote>

<h2>Endpoint 1</h2>
<br>
<p>
You need to access the item list from <a href="https://docs.skinport.com/#items">skinport</a>
and display an array of objects, where, among other things, the two minimum prices for the item should be specified (one price — <b>tradable</b>, the other — nonTradable).
The parameters <b>app_id</b> and <b>currency</b> are default; postgres should not be used here.
</p>

<h2>Endpoint 2</h2>
<br>
<p>
You need to implement the purchase of an item by the user. User must have a balance.
Database tables:
<ul>
  <li>users</li>
  <li>items</li>
  <li>purchases</li>
</ul>
The schema should be added to the repository.
</p>

<h1>Project Launch Instructions</h1>
<ul>
  <li>Rename <em><b>example.env</b></em> to <em><b>.env</b></em> and provide the necessary environment variables</li>
  <li>Inside the project folder, in terminal run <code>docker compose up --build</code></li>
  <li>Open <a href="http://localhost:&lt;APP_PORT&gt;/api">http://localhost:&lt;APP_PORT&gt;/api</a> in browser to see api documentation</li>
</ul>

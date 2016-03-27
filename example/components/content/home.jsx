<div class="panel panel-default">
	<div class="panel-body">
		<h1>The Mens Stack</h1>
		<h2>Lightweight, Lowly Opinionated, Isomorphic Javascript Framework for Rapid Prototyping Functional Web Apps</h2>
		<ul class="list-group">
			<li class="list-group-item"><a href="http://mithril.js.org/" target="_blank">Mithril.js</a></li>
			<li class="list-group-item"><a href="http://expressjs.com/" target="_blank">Express</a></li>
			<li class="list-group-item"><a href="https://nodejs.org/en/" target="_blank">Node.js</a></li>
			<li class="list-group-item"><a href="http://socket.io/" target="_blank">Socket.io</a></li>
		</ul>
		<p>Mens is meant to be a complete toolkit for quickly building <i>fast</i> isomorphic web applications, such that there is little to no differentiation between
		coding on the frontend and the backend.</p>
		<h3>Usage</h3>
		<div class="well">
			var mens = require("mens"), path = require("path");
			<br/>
			<br/>
			var server = mens(&#123;<br/>
			&nbsp;&nbsp;    logLevel: 3,<br/>
			&nbsp;&nbsp;	port: 80,<br/>
			&nbsp;&nbsp;	components: process.cwd()+path.sep+'components',<br/>
			&nbsp;&nbsp;	routes: process.cwd()+path.sep+'serverRoutes.js',<br/>
			&#125;);
			</div>
		<h3>Route Files</h3>
		<div class="well">
		module.exports = &#123;<br/>
			&nbsp;&nbsp;    '/': m.components.index,<br/>
			&nbsp;&nbsp;    '/about/':  m.components.about<br/>
			&#125;
		</div>
		<h3>Credits</h3>
		Special thanks for <a target="_blank" href="https://github.com/StephanHoyer">Stephan Hoyer</a> for some isomorphic examples and utilities, as well as <a target="_blank" href="https://github.com/lhorie">Leo Horie</a> for mithril. Many thanks to the node.js community.
	</div>
</div>
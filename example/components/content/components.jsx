<div class="panel panel-primary">
	<div class="panel-heading">Templating and Components</div>
	<div class="panel-body">
		<p>While any approach to mithril templating can be used, the Mens Stack has built in utilities to create components from JSX templates</p>
		<ul class="well">
			<li>The MENS config key <span class="label label-default">components</span> on the server accepts a path to a component directory</li>
			<li>All controllers should be in individual javascript (.js) files complying with <span class="label label-default">module.exports=</span> notation. These objects will be stored in <span class="label label-default">m.controllers</span> under a key corresponding to their camelcased path</li>
			<li>All views should be in individual JSX (.jsx) files. These templates will be compiled and stored in <span class="label label-default">m.views</span> under a key corresponding to their camelcased path</li>
			<li>Any view and controller with matching names will be paired together in an object stored in <span class="label label-default">m.components</span></li>
		</ul>
	</div>
</div>
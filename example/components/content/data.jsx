<div class="panel panel-primary">
	<div class="panel-heading">Asynchronous Data</div>
	<div class="panel-body">
		<p>The Mens Stack has utilities to render templates with asynchronous data.</p>
		<ul class="well">
			<li><span class="label label-primary">m.fetch(controller, model, callback, skipForRenderFlag);</span> will fetch a model</li>
			<li>The MENS config key <span class="label label-default">modeler</span> on the server accepts <span class="label label-primary">function(data, mensSession, callback)</span> to create a server side data modeler. Once the model lookup is complete, the model should be sent into the <span class="label label-default">callback</span> to reach the client</li>
			<li><span class="label label-default">controller</span> should have a session property server side, or the modeler cannot check access permissions. This is done in the route controller with the <span class="label label-primary">m.init(this, params)</span> call</li>
			<li>Multiple <span class="label label-default">m.fetch</span> calls can be made simultaneously, but ideally one model should describe a complete route</li>
			<li>To render pages without waiting on slow data, send <span class="label label-default">true</span> as the last argument</li>
			<li>All <span class="label label-default">m.fetch</span> calls must be ran on both the server and the client in order to initialize the route once the page
			is downloaded. An efficient modeler will cache any lookups.</li>
			<li>Fetch will automatically set the controllers <span class="label label-default">m.prop</span> properties that are also in the returned model structure</li>
			<li><span class="label label-default">m.prop</span> variables declarations and <span class="label label-default">m.fetch</span> calls should take place in the route controller and be passed to children components</li>
		</ul>
		<p>Here is some asyncronous data:</p>
		<ul class="list-group">
			<li class="list-group-item"><b>Required Data:</b> {(ctrl.data1() ? ctrl.data1() : 'Pending')}</li>
			<li class="list-group-item"><b>Defered Data:</b> {(ctrl.data2() ? ctrl.data2() : 'Pending')}</li>
		</ul>
	</div>
</div>
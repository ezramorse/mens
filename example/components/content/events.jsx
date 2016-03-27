<div class="panel panel-primary">
	<div class="panel-heading">Socket.io Events</div>
	<div class="panel-body">
		<p>The Mens Stack is meant to work strictly with socket.io to transfer data. There is no need to setup additional routes or APIs for ajax calls.</p>
		<ul class="well">
			<li><span class="label label-primary">m.socket.emit(event, data)</span> is available for emitting events on the client</li>
			<li>The MENS config key <span class="label label-default">socketHandler</span> on the server accepts <span class="label label-primary">function(client, mensSession)</span> to setup listeners for custom events</li>
			<li><span class="label label-primary">m.poll(event, data, callback)</span> allows bidirectional communication via the sockets</li>
			<li><span class="label label-default">m.poll</span> will wait to recieve data from the server on a unique event sent in the <span class="label label-default">key</span> property of the data</li>
			<li>The <span class="label label-default">socketHandler</span> must emit back <span class="label label-default">data.key</span> event to response</li>
		</ul>
		<p>Here is an example of polling:</p>
		<button onclick={ctrl.ping} class="btn btn-primary">Ping</button>
	</div>
</div>
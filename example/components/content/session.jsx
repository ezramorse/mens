<div class="panel panel-primary">
	<div class="panel-heading">Session Wrapper</div>
	<div class="panel-body">
		<p>The Mens Stack allows session variables to be shared between the client and the server.</p>
		<ul class="well">
			<li>Session variables should only be shared when the session variable is critical for rendering elements and not sensitive</li>
			<li>Session variables are only mutable on the server side. Changes are pushed to the client.</li>
			<li>To share a session variable, use <span class="label label-primary">[mensWrapper].set(key, value)</span></li>
			<li>To get the value of a shared session variable, use <span class="label label-primary">[mensWrapper].get(key)</span></li>
		</ul>
		<p>Set a session variable below:</p>
		<div class="btn-group" role="group">
			<button onclick={ctrl.makeHappy} type="button" class={"btn" + (ctrl.session.get('mood') == 'happy' ? ' btn-primary' : '')}>Happy</button>
			<button onclick={ctrl.makeSad} type="button" class={"btn" + (ctrl.session.get('mood') == 'sad' ? ' btn-primary' : '')}>Sad</button>
		</div>
	</div>
</div>
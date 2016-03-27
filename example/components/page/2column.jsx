<div>
	<div role="navigation" class="navbar navbar-default navbar-static-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<a href="javascript:void(0)" class="navbar-brand">MENS {(ctrl.session.get('mood') != null ? ctrl.session.get('mood') : '')} Isomorphic Example</a>
			</div>
			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav pull-right">
					<li>
						<a href="javascript:void(0)"><b>Mens:</b> v0.1.0</a>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="container">
		<div class="row">
			<div class="col-xs-4">{m.component(m.components.pageSectionsNav, ctrl)}</div>
			<div class="col-xs-8">{m.component(m.components[ctrl.flags.section()], ctrl)}</div>
		</div>
	</div>
</div>
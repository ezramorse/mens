<div>
	<h2>User Details: {ctrl.id()}</h2>
	<div class="list-group">
		<div style="display:block;text-align:center"  class="list-group-item">
			<a style="float:left;cursor:pointer" href={'/user/'+(ctrl.id()-1)} onclick={ctrl.handleLast}><i class="fa fa-chevron-circle-left"></i> Last</a>
			<a style="float:right;cursor:pointer"  href={'/user/'+(ctrl.id()+1)} onclick={ctrl.handleNext}>Next <i class="fa fa-chevron-circle-right"></i></a>
			Data Fetches: {ctrl.session.get('fetches')}
		</div>
		<div class="list-group-item"><b>User Info:</b> {(ctrl.info() ? ctrl.info() : <i class="fa fa-spinner fa-pulse"></i>)}</div>
		<div class="list-group-item"><b>User Background:</b> {(ctrl.text() ? ctrl.text() : <i class="fa fa-spinner fa-pulse"></i>)}</div>
		<div class="list-group-item"><b>Details:</b> {(ctrl.details1() ? ctrl.details1() : <i class="fa fa-spinner fa-pulse"></i>)}</div>
		<div class="list-group-item"><b>More Details:</b> {(ctrl.details2() ? ctrl.details2() : <i class="fa fa-spinner fa-pulse"></i>)}</div>
		<div class="list-group-item"><b>In Depth Information:</b> {(ctrl.slowDetails() ? ctrl.slowDetails() : <i class="fa fa-spinner fa-pulse"></i>)}</div>
		<div class="list-group-item"><b>Pages Browsed: </b>{m.extraFlags.pagesBrowsedTo()}</div>
	</div>
</div>
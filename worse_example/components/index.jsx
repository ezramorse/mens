<div>
	<h2>Example Index</h2>
	<div class="list-group">
		<div style="display:block;text-align:center"  class="list-group-item">
			<a style="float:right;cursor:pointer"  href='/user/1' onclick={ctrl.gotoUsers}>Goto Users <i class="fa fa-chevron-circle-right"></i></a>
			Data Fetches: {ctrl.session.get('fetches')}
		</div>
		<div class="list-group-item"><b>Pages Browsed: </b>{m.extraFlags.pagesBrowsedTo()}</div>
	</div>
</div>
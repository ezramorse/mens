<ul class="list-group">
	{Object.keys(ctrl.sections).map(function (key) {
		return	<a onclick={m.withAttr('data-section', ctrl.handleClick)} data-section={ctrl.sections[key].href} href={ctrl.sections[key].href} class={"list-group-item" + (ctrl.flags.section() == key ? ' active' : '')}>{ctrl.sections[key].name}</a>
	})}
</ul>
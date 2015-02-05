const width = 180;

import React from 'react/addons';
import Draggable from 'react-draggable2';
import { Cursor, ImmutableOptimizations }  from 'react-cursor';
import EventableMixin from '../mixins/EventableMixin';

class VolumeSlider {

	getInitialState() {
		return { dragging: false };
	}

	render () {
		var id = this.props.id || '';

		var left = width / 100 * this.props.volume.value;

		var pos = { x: left, y: 0 };

		return (
			<div
				id={this.props.id}
				className="volume-bar">
				<Draggable
					axis="x"
					handle="img"
					onDrag={this._onDrag}
					start={pos}
					bound="all box">
					<img
						src="images/popover_vol_scrubber_normal.png" />
				</Draggable>
			</div>
		);
	}

	_onDrag (e)  {
		console.log(arguments);
	}
}

VolumeSlider.prototype.displayName = "VolumeSlider";
VolumeSlider.prototype.mixins = [
	ImmutableOptimizations(['cursor']),
	EventableMixin
];
VolumeSlider.prototype.propTypes = {
	volume: React.PropTypes.instanceOf(Cursor).isRequired
};
export default React.createClass(VolumeSlider.prototype);

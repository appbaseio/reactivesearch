import dateFormats from '@appbaseio/reactivecore/lib/utils/dateFormats';

export default function formatDate(date, props) {
	switch (props.queryFormat) {
		case 'epoch_millis':
			return date.getTime();
		case 'epoch_seconds':
			return Math.floor(date.getTime() / 1000);
		default: {
			if (dateFormats[props.queryFormat]) {
				return date.toString(dateFormats[props.queryFormat]);
			}
			return date;
		}
	}
}

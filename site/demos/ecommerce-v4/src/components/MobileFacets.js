import { SelectedFilters } from '@appbaseio/reactivesearch';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import CollapsibleFacets from './CollapsibleFacets';

export default function MobileFacets() {
	const [open, setOpen] = useState(true);

	return (
		<>
			<div className="showFilters">
				<Button onClick={() => setOpen(true)} className="fullWidth" type="primary">
					Show Facets
				</Button>
			</div>
			<Modal
				open={open}
				cancelButtonProps={{ style: { display: 'none' } }}
				onCancel={() => setOpen(false)}
				onOk={() => setOpen(false)}
			>
				<div className="mobileFacetModal">
					<SelectedFilters />
					<br />
					<CollapsibleFacets isMobile />
				</div>
			</Modal>
		</>
	);
}
